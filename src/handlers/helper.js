import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';
import { getUser, removeUser } from '../models/user.model.js';

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id);
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users: ', getUser());
};

export const handleConnection = (socket, uuid) => {
  console.log('New User Connected!: ' + uuid + ' with socket Id ' + socket.id);
  console.log('Current users: ', getUser());

  const { stages } = getGameAssets;
  setStage(uuid, stages.data[0].id);
  console.log('stage: ', getStage(uuid));

  socket.emit('connection', { uuid });
};
