// 이후에는 db에 담았다가 connection 되면 db에서 검색해보고 연결한다 생각
const users = [];

// set
export const addUser = (user) => {
  users.push(user);
};

// 유저 접속해제시 삭제
export const removeUser = (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// get
export const getUser = () => {
  return users;
};
