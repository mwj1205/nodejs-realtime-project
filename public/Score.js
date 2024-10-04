import { sendEvent } from './Socket.js';

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  currentStage = null; // 현재 스테이지의 데이터
  nextStage = null; // 다음 스테이지의 데이터
  stages = {}; // 모든 스테이지의 데이터
  itemScores = {};

  constructor(ctx, scaleRatio, stageData, itemData) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.stages = stageData.data.reduce((acc, stage) => {
      acc[stage.id] = stage;
      return acc;
    }, {});
    this.currentStage = this.stages[1000]; // 첫 번째 스테이지는 1000
    this.updateNextStage();

    itemData.data.forEach((item) => {
      this.itemScores[item.id] = item.score;
    });
  }

  updateNextStage() {
    this.nextStage = this.currentStage.next_stage_id
      ? this.stages[this.currentStage.next_stage_id]
      : null;
  }

  update(deltaTime) {
    this.score += deltaTime * 0.01 * this.currentStage.scorePerSecond;

    if (this.nextStage && this.score >= this.nextStage.score) {
      sendEvent(11, {
        currentStage: this.currentStage.id,
        targetStage: this.nextStage.id,
        score: this.score,
      });
      this.currentStage = this.nextStage;
      this.updateNextStage();
    }
  }

  getItem(itemId) {
    if (this.itemScores[itemId]) {
      this.score += this.itemScores[itemId];
      console.log(`itemId: ${itemId}, Score: ${this.itemScores[itemId]}`);

      sendEvent(12, { itemId: itemId });
    } else {
      console.warn(`Unknown item ID: ${itemId}`);
    }
  }

  reset() {
    this.score = 0;
    this.currentStage = this.stages[1000];
    this.updateNextStage();
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  getCurrentStageId() {
    return this.currentStage.id;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
