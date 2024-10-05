import { CLIENT_VERSION } from '../constants.js';
import { createCollectedItem } from '../models/item.model.js';
import { createStage } from '../models/stage.model.js';
import { getUser, removeUser } from '../models/user.model.js';
import { getUserHighScore, loginUser } from '../utils/redis.utils.js';
import handlerMappings from './handlerMapping.js';

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id);
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users: ', getUser());
};

export const handleConnection = async (socket, uuid) => {
  console.log(`New User Connected!: ${uuid} with socket Id ${socket.id}`);
  const loginSuccess = await loginUser(uuid);
  console.log('Current users: ', getUser());

  createStage(uuid);
  createCollectedItem(uuid);

  const highScore = await getUserHighScore(uuid);
  socket.emit('connection', { uuid, highScore });
};

export const handlerEvent = async (io, socket, data) => {
  console.log('data: ', data);
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
    return;
  }

  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return;
  }

  try {
    const response = await handler(data.userId, data.payload);

    if (response.broadcast) {
      io.emit('response', 'broadcast');
      return;
    }

    socket.emit('response', response);
  } catch (error) {
    console.error('Error in handler:', error);
    socket.emit('response', { status: 'error', message: 'Internal server error' });
  }
};
