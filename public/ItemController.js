import Item from './Item.js';

class ItemController {
  INTERVAL_MIN = 0;
  INTERVAL_MAX = 12000;

  nextInterval = null;
  items = [];
  appearItems = [];
  currentStageId = null;

  constructor(ctx, itemImages, scaleRatio, speed, itemUnlockData) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;
    this.itemUnlockData = itemUnlockData.data;

    this.setNextItemTime();
  }

  setNextItemTime() {
    this.nextInterval = this.getRandomNumber(this.INTERVAL_MIN, this.INTERVAL_MAX);
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  updateAppearItems(newStageId) {
    if (this.currentStageId !== newStageId) {
      this.currentStageId = newStageId;
      const newItems = this.itemUnlockData
        .filter((item) => item.stage_id === this.currentStageId)
        .map((item) => item.item_id);

      newItems.forEach((itemId) => {
        if (!this.appearItems.includes(itemId)) {
          this.appearItems.push(itemId);
        }
      });
    }
  }

  createItem() {
    if (this.appearItems.length === 0) return;

    const appearItemsIndices = this.itemImages
      .filter((item) => this.appearItems.includes(item.id))
      .map((_, index) => index);

    const index = this.getRandomNumber(0, this.appearItems.length - 1);
    const itemIndex = appearItemsIndices[index];
    const itemInfo = this.itemImages[itemIndex];
    const x = this.canvas.width * 1.5;
    const y = this.getRandomNumber(10, this.canvas.height - itemInfo.height);

    const item = new Item(
      this.ctx,
      itemInfo.id,
      x,
      y,
      itemInfo.width,
      itemInfo.height,
      itemInfo.image,
    );

    this.items.push(item);
  }

  update(gameSpeed, deltaTime, nowStage) {
    this.updateAppearItems(nowStage);
    if (this.nextInterval <= 0) {
      this.createItem();
      this.setNextItemTime();
    }

    this.nextInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
  }

  collideWith(sprite) {
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
      return {
        itemId: collidedItem.id,
      };
    }
  }

  reset() {
    this.items = [];
    this.appearItems = [];
    this.currentStageId = null;
  }
}

export default ItemController;
