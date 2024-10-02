import { getGameAssets } from '../init/assets.js';

// key uuid, value: array -> stage 정보는 배열
const stages = {};

// 스테이지 초기화
export const createStage = (uuid) => {
  stages[uuid] = [];
};

export const getStage = (uuid) => {
  return stages[uuid] || [];
};

export const setStage = (uuid, id, timestamp) => {
  return stages[uuid].push({ id, timestamp });
};

export const clearStage = (uuid) => {
  stages[uuid] = [];
};

export const getTotalStageScore = (uuid, time) => {
  const { stages } = getGameAssets();
  let currentStages = getStage(uuid);
  let totalScore = 0;

  // 스테이지 별 점수 계산
  currentStages.forEach((stage, index) => {
    let stageEndTime;
    let currentStageData = stages.data[index];
    if (index === currentStages.length - 1) {
      stageEndTime = time;
    } else {
      stageEndTime = currentStages[index + 1].timestamp;
    }

    const stageDuration = (stageEndTime - stage.timestamp) / 100;
    totalScore += stageDuration * currentStageData.scorePerSecond;
  });

  return totalScore;
};
