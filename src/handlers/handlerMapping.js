import { gameEnd, gameStart } from './game.handler';
import { moveStageHander } from './stage.handler';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: moveStageHander,
};

export default handlerMappings;
