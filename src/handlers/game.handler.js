import { getStage } from '../models/stage.model';

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets;
  // stage 배열에서 0번째 = 첫번째 스테이지
  // todo: timestamp 검증
  setStage(uuid, stages.data[0].id, payload.timestamp);
  console.log('stage: ', getStage(uuid));

  return { status: 'success' };
};

export const gameEnd = () => {
  // 클라이언트는 게임 종료 시 타임스탬프와 총 점수 줄거임
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid);

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 각 스테이지의 지속시간을 계산하여 총 점수 계산
  let totalScore = 0;

  stages.foreach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      stageEndTime = gameEndTime;
    } else {
      stageEndTime = stages[index + 1].timestamp;
    }

    const stageDuration = (stageEndTime - stage.timestamp) / 1000;
    totalScore += stageDuration; // 1초당 1점
  });

  // 점수와 타임스탬프 검증
  // 오차범위 5
  if (Math.abs(score - totalScore) > 5) {
    return { status: 'fail', message: 'Score verification failed' };
  }

  // todo: DB에 게임 결과 저장
  // setRusult(userId, score, timestamp);

  return { status: 'success', message: 'Game ended', score };
};
