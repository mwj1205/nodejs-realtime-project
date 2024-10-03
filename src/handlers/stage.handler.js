// 유저는 스테이지를 하나 씩 올라갈 수 있다. (1 -> 2, 2 -> 3)
// 유저는 일정 점수가 되면 다음 스테이지로 이동한다.

import { getGameAssets } from '../init/assets.js';
import { getTotalItemScore } from '../models/item.model.js';
import {
  getCurrentStageId,
  getStage,
  getTotalStageScore,
  setStage,
} from '../models/stage.model.js';

export const moveStageHandler = (uuid, payload) => {
  // 유저의 현재 스테이지 정보
  let currentStages = getStage(uuid);
  if (Object.keys(currentStages).length === 0) {
    return { status: 'fail', message: 'No stages found for user12' };
  }

  // 게임 에셋에서 스테이지 데이터 가져오기
  const { stages } = getGameAssets();
  const stageDataMap = stages.data.reduce((acc, stage) => {
    acc[stage.id] = stage;
    return acc;
  }, {});

  // timestamp가 가장 큰 값의 stageId를 찾음
  const currentStageId = getCurrentStageId(uuid);
  if (!currentStageId) {
    return { status: 'fail', message: 'Current stage not found' };
  }

  // 클라이언트 vs 서버 비교
  if (payload.currentStage !== currentStageId) {
    return { status: 'fail', message: 'Current Stage mismatch' };
  }

  const currentStageData = stageDataMap[currentStageId];
  const targetStageData = stageDataMap[payload.targetStage];

  if (!currentStageData || !targetStageData) {
    return { status: 'fail', message: 'Stage data not found' };
  }

  // 현재 스테이지의 다음 스테이지가 payload의 targetStage가 맞는지 검증
  if (currentStageData.next_stage_id !== targetStageData.id) {
    return { status: 'fail', message: 'Invalid target stage' };
  }

  // 점수 검증
  const serverTime = Date.now(); // 현재 타임스탬프
  let totalScore = 0;
  // 스테이지 지속 시간으로 획득한 총 점수
  totalScore += getTotalStageScore(uuid, serverTime);
  // 획득한 아이템의 점수를 계산하여 점수에 추가
  totalScore += getTotalItemScore(uuid);

  console.log('totalScore: ', totalScore);
  if (totalScore < targetStageData.score - 3) {
    return { status: 'fail', message: 'Insufficient score' };
  }

  setStage(uuid, payload.targetStage, serverTime);
  return { status: 'success', message: 'next stage' };
};
