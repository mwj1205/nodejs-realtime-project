import { CLIENT_VERSION } from './Constants.js';

const storageUserId = localStorage.getItem('userId');
let userId = storageUserId;

const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
    userUUID: storageUserId || null,
  },
});

socket.on('response', (data) => {
  console.log(data);
});

socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
  localStorage.setItem('userId', userId);
});

const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
  console.log('userId: ', userId);
};

export { sendEvent };
