import { getGameAssets } from '../init/assets.js';
import { clearCollectedItems, getTotalItemScore } from '../models/item.model.js';
import { clearStage, getStage, getTotalStageScore, setStage } from '../models/stage.model.js';
import { getUserHighScore, saveUserScore, updateServerHighScore } from '../utils/redis.utils.js';

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();
  const serverTime = Date.now();
  // 타임스탬프 검증
  if (payload.timestamp > serverTime || payload.timestamp < serverTime - 5000) {
    return { status: 'fail', message: 'Invalid game start time' };
  }

  clearStage(uuid);
  clearCollectedItems(uuid);
  // stages 배열에서 첫 번째 스테이지의 id를 사용
  setStage(uuid, stages.data[0].id, payload.timestamp);
  console.log('stage: ', getStage(uuid));

  return { status: 'success', message: 'game start' };
};

export const gameEnd = async (uuid, payload) => {
  const { timestamp: gameEndTime, score } = payload;
  const userstages = getStage(uuid);
  if (!Object.keys(userstages).length === 0) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  let totalScore = 0;
  // 스테이지 지속 시간으로 획득한 총 점수
  totalScore += getTotalStageScore(uuid, gameEndTime);
  // 획득한 아이템의 점수를 계산하여 점수에 추가
  totalScore += getTotalItemScore(uuid);

  // 오차 범위 5
  if (Math.abs(score - totalScore) > 5) {
    return { status: 'fail', message: 'Score verification failed' };
  }

  const response = { status: 'success', message: 'Game ended', score };
  // Redis에 점수 저장
  if (await saveUserScore(uuid, score)) {
    response.highScore = score;
  }
  // 서버 하이스코어 업데이트 성공 시 response에 추가
  if (await updateServerHighScore(score)) {
    response.broadcast = true; // 브로드캐스트 정보 추가
    response.serverHighScore = score; // 서버 하이스코어 추가
  }
  return response;
};
