import { getGameAssets } from '../init/assets.js';
import { clearCollectedItems, getTotalItemScore } from '../models/item.model.js';
import { clearStage, getStage, getTotalStageScore, setStage } from '../models/stage.model.js';

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

export const gameEnd = (uuid, payload) => {
  // 클라이언트는 게임 종료 시 타임스탬프와 총 점수 줄거임
  const { timestamp: gameEndTime, score } = payload;
  const userstages = getStage(uuid);
  if (!Object.keys(userstages).length === 0) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 각 스테이지의 지속시간을 계산하여 총 점수 계산
  let totalScore = 0;

  // 스테이지 지속 시간으로 획득한 총 점수
  totalScore += getTotalStageScore(uuid, gameEndTime);

  // 획득한 아이템의 점수를 계산하여 점수에 추가
  totalScore += getTotalItemScore(uuid);

  // 점수와 타임스탬프 검증
  // 오차범위 5
  console.log('score: ', score);
  console.log('totalScore: ', totalScore);
  if (Math.abs(score - totalScore) > 5) {
    return { status: 'fail', message: 'Score verification failed' };
  }

  // todo: DB에 게임 결과 저장
  // setRusult(userId, score, timestamp);

  return { status: 'success', message: 'Game ended', score };
};
