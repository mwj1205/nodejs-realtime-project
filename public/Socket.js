import { CLIENT_VERSION } from './Constants.js';

const storageUserId = localStorage.getItem('userId');
let socket = null;
let userId = storageUserId;
let highScore = 0;
let serverHighScore = 0;

socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
    userUUID: storageUserId || null,
  },
});

socket.on('response', (data) => {
  console.log(data);
  if (data.highScore) {
    highScore = data.highScore;
  }
});

socket.on('broadcast', (data) => {
  console.log(data);
  if (data.serverhighscore) {
    serverHighScore = data.serverhighscore;
  }
});

socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
  localStorage.setItem('userId', userId);
  if (data.highScore) {
    highScore = data.highScore;
  }
});

const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

const getHighScore = () => {
  return highScore;
};

export { sendEvent, getHighScore };
