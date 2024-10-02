import { getGameAssets } from '../init/assets.js';

// 사용자별 획득한 아이템을 저장할 객체
const collectedItems = {};

export const getItemScore = (itemId) => {
  const { items } = getGameAssets();
  const item = items.data.find((item) => item.id === itemId);
  return item ? item.score : 0;
};

export const createCollectedItem = (uuid) => {
  collectedItems[uuid] = [];
};

export const addCollectedItem = (uuid, itemId) => {
  if (!collectedItems[uuid]) {
    collectedItems[uuid] = [];
  }
  collectedItems[uuid].push(itemId);
};

export const getCollectedItems = (uuid) => {
  return collectedItems[uuid] || [];
};

export const getTotalItemScore = (uuid) => {
  let totalScore = 0;
  const collectedItems = getCollectedItems(uuid);

  collectedItems.forEach((itemId, _) => {
    totalScore += getItemScore(itemId);
  });
  return totalScore;
};

// 게임 종료 시 사용자의 수집된 아이템 목록을 초기화하는 함수
export const clearCollectedItems = (uuid) => {
  collectedItems[uuid] = [];
};
