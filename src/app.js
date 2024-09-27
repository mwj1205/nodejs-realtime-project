import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
initSocket(server);

app.get('/', (req, res) => {
  // 테스트를 위한 API 생성
  res.send('<h1>Hello World</h1>');
});

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    // 파일 읽어옴
    const assets = await loadGameAssets();
    console.log('assets: ', assets);
    console.log('Assets loaded successfully');
  } catch (e) {
    console.error('Failed to load game assets: ', e);
  }
});
