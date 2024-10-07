# 리얼 타임 프로젝트

![image](https://github.com/user-attachments/assets/97f141b1-233a-412d-a7f3-e9d198d05fd3)

## 1️⃣ 프로젝트 개요

실시간 웹소켓을 이용하여 데이터를 주고받는 사이드뷰 플랫폼 점프 액션 게임

## AWS EC2 배포
- 프로젝트를 [**AWS EC2**](https://ap-northeast-2.console.aws.amazon.com/ec2)에 배포하였습니다.
- 주소: 52.79.166.57:3001

## 2️⃣ 프로젝트 구조

- 공통 패킷 구조:

```
| 필드 명          | 타입   | 설명                                      |
|------------------|--------|------------------------------------------|
| handlerID        | int    | 요청을 처리할 서버 핸들러의 ID             |
| userId           | int    | 요청을 보내는 유저의 ID                    |
| clientVersion    | string | 현재 클라이언트 버전 (고정: "1.0.0")       |
| payload          | JSON   | 요청 내용                                 |
```

- 파일 구조

```
📦public // 프론트엔드
┣ 📂.idea
┣ 📂assets // 게임 데이터
┃ ┣ 📜item.json
┃ ┣ 📜item_unlock.json
┃ ┗ 📜stage.json
┣ 📂images
┣ 📜.DS_Store
┣ 📜CactiController.js
┣ 📜Cactus.js
┣ 📜Constants.js
┣ 📜Ground.js
┣ 📜index.html
┣ 📜index.js
┣ 📜Item.js
┣ 📜ItemController.js
┣ 📜Player.js
┣ 📜Score.js
┣ 📜Socket.js
┗ 📜style.css

📦src // 서버
┣ 📂handlers // 비즈니스 로직
┃ ┣ 📜game.handler.js
┃ ┣ 📜handlerMapping.js
┃ ┣ 📜helper.js
┃ ┣ 📜item.handler.js
┃ ┣ 📜register.handler.js
┃ ┗ 📜stage.handler.js
┣ 📂init // 필수 데이터, 기능 로드 (load)
┃ ┣ 📜assets.js
┃ ┗ 📜socket.js
┣ 📂models // 세션 모델 관리
┃ ┣ 📜item.model.js
┃ ┣ 📜stage.model.js
┃ ┗ 📜user.model.js
┣ 📂utils // 유틸리티
┃ ┗ 📜redis.utils.js
┣ 📜app.js
┗ 📜constants.js
```

## 3️⃣ 필수 기능

1. 스테이지 구분
   게임 진행 시 점수에 따라 스테이지가 구분됩니다.
2. 스테이지에 따른 점수 획득 구분
   각 스테이지에 따라 점수 획득하는 점수가 다릅니다.
   ```
   { "id": 1000, "score": 0, "scorePerSecond": 1, "next_stage_id": 1001 },
   { "id": 1001, "score": 100, "scorePerSecond": 2, "next_stage_id": 1002 },
   { "id": 1002, "score": 300, "scorePerSecond": 3, "next_stage_id": 1003 },
   { "id": 1003, "score": 600, "scorePerSecond": 5, "next_stage_id": 1004 },
   { "id": 1004, "score": 1100, "scorePerSecond": 7, "next_stage_id": 1005 },
   { "id": 1005, "score": 1800, "scorePerSecond": 11, "next_stage_id": 1006 },
   { "id": 1006, "score": 3000, "scorePerSecond": 13, "next_stage_id": null }
   ```
3. 스테이지에 따라 아이템 생성
   스테이지에 따라 생성되는 아이템이 다릅니다.
   ```
   { "id": 101, "stage_id": 1001, "item_id": 1 },
   { "id": 201, "stage_id": 1002, "item_id": 2 },
   { "id": 301, "stage_id": 1003, "item_id": 3 },
   { "id": 401, "stage_id": 1004, "item_id": 4 },
   { "id": 501, "stage_id": 1005, "item_id": 5 },
   { "id": 601, "stage_id": 1006, "item_id": 6 }
   ```
4. 아이템 획득 시 점수 획득
   아이템을 획득할 때 점수를 부여합니다.
5. 아이템 별 획득 점수 구분
   아이템 종류에 따라 획득하는 점수를 구분합니다.
   ```
   { "id": 1, "score": 10 },
   { "id": 2, "score": 20 },
   { "id": 3, "score": 30 },
   { "id": 4, "score": 40 },
   { "id": 5, "score": 50 },
   { "id": 6, "score": 60 }
   ```

## 4️⃣ 도전 기능

1. Broadcast 기능 추가
   서버에서 가장 높은 점수를 달성하면 해당 점수를 Broadcast합니다.
2. 가장 높은 점수 Record 관리
   서버에서 가장 높은 점수를 관리하고 갱신 시 알림을 보냅니다.
3. 유저 정보 연결
   최초 접속 시 발급 받은 UUID를 기반으로 게임 기록을 연동합니다.
   유저가 기록한 최고 점수를 클라이언트에 전송하여 화면에 표시하도록 합니다.
5. Redis 연동, 게임 로그 저장
   Redis를 사용하여 유저 정보 및 게임 로그를 기록합니다.

## 🛠️ 기술 스택

<img src="https://shields.io/badge/JavaScript-F7DF1E?logo=JavaScript&logoColor=000&style=flat-square" style="height : 25px; margin-left : 10px; margin-right : 10px;"/>&nbsp;
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white" style="height : 25px; margin-left : 10px; margin-right : 10px;"/>&nbsp;
<img src="https://img.shields.io/badge/Web%20Socket-010101?style=flat-square&logo=socketdotio&logoColor=white" style="height : 25px; margin-left : 10px; margin-right : 10px;"/>&nbsp;

Node.js: 서버 사이드 로직
WebSocket: 실시간 데이터 통신
