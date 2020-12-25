const users = [];

function assignUserData(id, { username, room }) {
  const newUser = {
    id,
    username,
    room,
  };

  users.push(newUser);

  return newUser;
}

function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

function getLeavingUserAndUpdateUsersArray(id) {
  const userIndex = users.findIndex((user) => user.id === id);
  const userThatHasLeft = users.splice(userIndex, 1);

  return userThatHasLeft;
}

function getUsersList(room) {
  return users.filter((user) => user.room === room);
}

module.exports = { assignUserData, getCurrentUser, getLeavingUserAndUpdateUsersArray, getUsersList };
