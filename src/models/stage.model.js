import { getGameAssets } from '../init/assets.js';

// key uuid, value: object -> stage 정보는 객체
const stages = {};

// 스테이지 초기화
export const createStage = (uuid) => {
  stages[uuid] = {};
};

export const getStage = (uuid) => {
  return stages[uuid] || {};
};

export const getCurrentStageId = (uuid) => {
  const currentStages = getStage(uuid);
  console.log('currentStages: ', currentStages);
  if (Object.keys(currentStages).length === 0) {
    return null; // 빈 객체면 null 반환
  }

  return Object.keys(currentStages).reduce((nowStage, stage) => {
    return currentStages[stage] > currentStages[nowStage] ? Number(nowStage) : Number(stage);
  }, Object.keys(currentStages)[0]);
};

export const setStage = (uuid, id, timestamp) => {
  stages[uuid][id] = { timestamp };
};

export const clearStage = (uuid) => {
  stages[uuid] = {};
};

export const getTotalStageScore = (uuid, time) => {
  const { stages } = getGameAssets();
  let currentStages = getStage(uuid);
  let totalScore = 0;

  // stageData의 id를 키로 하는 객체로 변환
  const stageDataMap = stages.data.reduce((acc, stage) => {
    acc[stage.id] = stage;
    return acc;
  }, {});

  // 스테이지 별 점수 계산
  let currentStageId = stages.data[0].id; // 첫 번째 스테이지 ID로 시작
  while (currentStageId) {
    const currentStage = currentStages[currentStageId];
    const nextStageId = stageDataMap[currentStageId].next_stage_id;

    if (currentStage) {
      let stageEndTime;
      if (nextStageId && currentStages[nextStageId]) {
        stageEndTime = currentStages[nextStageId].timestamp;
      } else {
        stageEndTime = time;
      }

      const stageDuration = (stageEndTime - currentStage.timestamp) / 100;
      totalScore += stageDuration * stageDataMap[currentStageId].scorePerSecond;
    }

    currentStageId = nextStageId;
  }

  return totalScore;
};
