import { getGameAssets } from '../init/assets.js';
import { clearCollectedItems, getCollectedItems, getItemScore } from '../models/item.model.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();
  // stage 배열에서 0번째 = 첫번째 스테이지
  // todo: timestamp 검증

  clearStage(uuid);
  clearCollectedItems(uuid);
  setStage(uuid, stages.data[0].id, payload.timestamp);
  console.log('stage: ', getStage(uuid));

  return { status: 'success' };
};

export const gameEnd = (uuid, payload) => {
  // 클라이언트는 게임 종료 시 타임스탬프와 총 점수 줄거임
  const { timestamp: gameEndTime, score } = payload;
  const { stages } = getGameAssets();
  const userstages = getStage(uuid);

  if (!userstages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 각 스테이지의 지속시간을 계산하여 총 점수 계산
  let totalScore = 0;

  userstages.forEach((stage, index) => {
    let stageEndTime;
    let currentStageData = stages.data[index];
    if (index === userstages.length - 1) {
      stageEndTime = gameEndTime;
    } else {
      stageEndTime = userstages[index + 1].timestamp;
    }

    const stageDuration = (stageEndTime - stage.timestamp) / 100;
    totalScore += stageDuration * currentStageData.scorePerSecond; // 1초당 1점
  });

  // 획득한 아이템의 점수를 계산하여 점수에 추가
  const collectedItems = getCollectedItems(uuid);

  collectedItems.forEach((itemId, _) => {
    totalScore += getItemScore(itemId);
  });

  // 점수와 타임스탬프 검증
  // 오차범위 5
  console.log('totalScore: ', totalScore);
  if (Math.abs(score - totalScore) > 5) {
    return { status: 'fail', message: 'Score verification failed' };
  }

  // todo: DB에 게임 결과 저장
  // setRusult(userId, score, timestamp);

  return { status: 'success', message: 'Game ended', score };
};
