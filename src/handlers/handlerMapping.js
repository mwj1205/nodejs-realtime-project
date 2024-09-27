import { gameEnd, gameStart } from './game.handler.js';
import { moveStageHander } from './stage.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: moveStageHander,
};

export default handlerMappings;
