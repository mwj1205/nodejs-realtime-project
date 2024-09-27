import { addUser } from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';
import { handleDisconnect } from './helper.js';

const registerHandler = (io) => {
  io.on('connection', (socket) => {
    const userUUID = uuidv4;
    addUser({ uuid: userUUID, socketId: socket.id });

    // 접속 해제시 이벤트
    socket.on('disconnect', (socket) => handleDisconnect(socket, userUUID));
  });
};

export default registerHandler;
