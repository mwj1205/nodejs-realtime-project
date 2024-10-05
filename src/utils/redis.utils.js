import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', (err) => console.log('Redis Client Error', err));

await redisClient.connect();

export const saveUserScore = async (userId, score) => {
  try {
    const timestamp = Date.now();
    // 현재 점수 저장
    await redisClient.hSet(`user:${userId}`, 'recentscore', score.toString());

    // 점수 로그 저장
    await redisClient.hSet(`user:${userId}:scores`, timestamp.toString(), score.toString());

    // 최고 점수 업데이트
    const highScore = await redisClient.hGet(`user:${userId}`, 'highscore');
    if (!highScore || parseInt(score) > parseInt(highScore)) {
      await redisClient.hSet(`user:${userId}`, 'highscore', score.toString());
    }
  } catch (error) {
    console.error('Error saving user score:', error);
  }
};

export const getUserHighScore = async (userId) => {
  try {
    const highScore = await redisClient.hGet(`user:${userId}`, 'highscore');
    return highScore ? parseInt(highScore) : null;
  } catch (error) {
    console.error('Error getting user high score:', error);
    return null;
  }
};

// 유저 로그인
export const loginUser = async (userId) => {
  try {
    const exists = await redisClient.exists(`user:${userId}`);
    if (!exists) {
      // 새 사용자 생성
      await redisClient.hSet(`user:${userId}`, {
        id: userId,
        highscore: '0',
        lastLogin: Date.now().toString(),
      });
    } else {
      // 마지막 로그인 시간 업데이트
      await redisClient.hSet(`user:${userId}`, 'lastLogin', Date.now().toString());
    }
    return await getUserInfo(userId);
  } catch (error) {
    console.error('Error logging in user:', error);
    return null;
  }
};

export const getUserInfo = async (userId) => {
  try {
    const userInfo = await redisClient.hGetAll(`user:${userId}`);
    if (Object.keys(userInfo).length === 0) {
      return null; // 사용자가 존재하지 않는 경우
    }
    return {
      id: userInfo.id,
      recentscore: parseInt(userInfo.recentscore) || 0,
      highscore: parseInt(userInfo.highscore) || 0,
      lastLogin: parseInt(userInfo.lastLogin) || 0,
    };
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};
