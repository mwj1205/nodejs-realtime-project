// 유저는 스테이지를 하나 씩 올라갈 수 있다. (1 -> 2, 2 -> 3)
// 유저는 일정 점수가 되면 다음 스테이지로 이동한다.

import { getGameAssets } from '../init/assets.js';
import { getTotalItemScore } from '../models/item.model.js';
import { getStage, getTotalStageScore, setStage } from '../models/stage.model.js';

export const moveStageHandler = (uuid, payload) => {
  // 유저의 현재 스테이지 정보
  let currentStages = getStage(uuid);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 오름차순 -> 가장 큰 스테이지 ID를 확인 <- 유저의 현재 스테이지
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];
  //console.log('currentStage: ', currentStage);

  // 클라이언트 vs 서버 비교
  if (payload.currentStage !== currentStage.id) {
    return { status: 'fail', message: 'Current Stage mismatch' };
  }

  // targetStage 대한 검증 <- 게임 에셋에 존재하는가?
  const { stages } = getGameAssets();
  const currentStageData = stages.data.find((stage) => stage.id === currentStage.id);
  const targetStageData = stages.data.find((stage) => stage.id === payload.targetStage);
  if (!currentStageData) {
    return { status: 'fail', message: 'Current stage not found' };
  }

  if (!targetStageData) {
    return { status: 'fail', message: 'Target stage not found' };
  }

  // todo: currentStage의 다음 스테이지가 payload의 targetStage가 맞는지 검승

  // 점수 검증
  const serverTime = Date.now(); // 현재 타임스탬프
  // 각 스테이지의 지속시간을 계산하여 총 점수 계산
  let totalScore = 0;
  // 스테이지 지속 시간으로 획득한 총 점수
  totalScore += getTotalStageScore(uuid, serverTime);
  // 획득한 아이템의 점수를 계산하여 점수에 추가
  totalScore += getTotalItemScore(uuid);

  setStage(uuid, payload.targetStage, serverTime);
  return { status: 'success' };
};
