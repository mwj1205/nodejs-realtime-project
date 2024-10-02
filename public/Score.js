import { sendEvent } from './socket.js';

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  currentStageIndex = 0; // 현재 스테이지 인덱스
  stages = []; // 모든 스테이지의 데이터
  currentStage = null; // 현재 스테이지의 데이터
  nextStage = null; // 다음 스테이지의 데이터
  itemScores = {};

  constructor(ctx, scaleRatio, stageData, itemData) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.stages = stageData.data;
    this.items = itemData.data;
    this.updateStage();

    itemData.data.forEach((item) => {
      this.itemScores[item.id] = item.score;
    });
  }

  updateStage() {
    this.currentStage = this.stages[this.currentStageIndex];
    // nextStage는 currentStage가 마지막 스테이지면 null
    // 아니면 currentStageIndex + 1
    this.nextStage =
      this.currentStageIndex < this.stages.length - 1
        ? this.stages[this.currentStageIndex + 1]
        : null;
  }

  update(deltaTime) {
    this.score += deltaTime * 0.01 * this.currentStage.scorePerSecond;

    if (this.nextStage && this.score >= this.nextStage.score) {
      sendEvent(11, {
        currentStage: this.currentStage.id,
        targetStage: this.nextStage ? this.nextStage.id : this.currentStage.id,
        score: this.score,
      });
      this.currentStageIndex++;
      this.updateStage();
    }
  }

  getItem(itemId) {
    if (this.itemScores[itemId]) {
      this.score += this.itemScores[itemId];
      console.log(`itemId: ${itemId}, Score: ${this.itemScores[itemId]}`);
    } else {
      console.warn(`Unknown item ID: ${itemId}`);
    }
  }

  reset() {
    this.score = 0;
    this.currentStageIndex = 0;
    this.updateStage();
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
