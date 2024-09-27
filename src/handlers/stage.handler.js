// 유저는 스테이지를 하나 씩 올라갈 수 있다. (1 -> 2, 2 -> 3)
// 유저는 일정 점수가 되면 다음 스테이지로 이동한다.

import { getGameAssets } from '../init/assets';
import { getStage, setStage } from '../models/stage.model';

export const moveStageHander = (uuid, payload) => {
  // 유저의 현재 스테이지 정보
  let currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 오름차순 -> 가장 큰 스테이지 ID를 확인 <- 유저의 현재 스테이지
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // 클라이언트 vs 서버 비교
  if (payload.currentStage !== currentStage.id) {
    return { status: 'fail', message: 'Current Stage mismatch' };
  }

  // 점수 검증
  const serverTime = Date.now(); // 현재 타임스탬프
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000;

  // 1스테이지 -> 2스테이지로 넘어가는 가정
  // 5 => 임의로 정한 오차 범위
  if (elapsedTime < 100 || elapsedTime > 105) {
    return { status: 'fail', message: 'Invalid elapsed time' };
  }

  // targetStage 대한 검증 <- 게임 에셋에 존재하는가?
  const { stages } = getGameAssets();
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target stage not found' };
  }

  // todo: stage를 넘어가기 위한 점수가 되었나? 검증

  setStage(userId, payload.targetStage, serverTime);
  return { status: 'success' };
};
