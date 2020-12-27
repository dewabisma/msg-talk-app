const chatMessageWrapper = document.querySelector('.chat-messages');
const chatForm = document.getElementById('chat-form');
const roomNameElement = document.getElementById('room-name');
const usersListWrapper = document.getElementById('users');
const userTypingWrapper = document.querySelector('.typing-box');
const messageInput = document.getElementById('msg');

const socket = io();

socket.emit('join room', getUserDetails());

socket.on('join room', (room, usersList) => {
  setRoomName(room);
  showUsersInRoom(usersList);
});

socket.on('leave room', (usersList) => {
  showUsersInRoom(usersList);
});

socket.on('message', (message) => {
  displayMessage(message);

  scrollScreenToNewMessage();
});

socket.on('typing', (user) => {
  displayUserTyping(user.username);
});

socket.on('finished typing', () => {
  removeUserTypingDisplay();
});

function displayMessage({ username, message, time }) {
  const messageWrapper = createElementWithClass('div', 'message');
  const senderInfoElement = createElementWithClass('p', 'meta');
  const messageContentElement = createElementWithClass('p', 'text');

  senderInfoElement.innerHTML = `${username} <span>${time}</span>`;
  messageContentElement.innerHTML = message;

  messageWrapper.appendChild(senderInfoElement);
  messageWrapper.appendChild(messageContentElement);

  chatMessageWrapper.appendChild(messageWrapper);
}

function displayUserTyping(username) {
  userTypingWrapper.innerText = `${username} is typing...`;
}

function removeUserTypingDisplay() {
  userTypingWrapper.innerText = ``;
}

function createElementWithClass(tag, className) {
  const element = document.createElement(tag);
  element.classList.add(className);

  return element;
}

function scrollScreenToNewMessage() {
  chatMessageWrapper.scrollTop = chatMessageWrapper.scrollHeight;
}

function getUserDetails() {
  const params = window.location.search;
  const queries = new URLSearchParams(params);

  const username = queries.get('username');
  const room = queries.get('room');

  console.log(username, room);

  return { username, room };
}

function setRoomName(roomName) {
  roomNameElement.innerText = roomName;
}

function showUsersInRoom(listOfUsers) {
  usersListWrapper.innerHTML = '';

  listOfUsers.map((user) => {
    const listElement = document.createElement('li');
    listElement.innerText = user.username;

    usersListWrapper.appendChild(listElement);
  });
}

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const isSuccess = sendMessage(event);

  if (!isSuccess) return false;

  clearFormInput(event);
});

messageInput.addEventListener('keydown', (event) => {
  setTimeout(() => {
    const text = event.target.value.trim();
    console.log(text);

    if (text !== '') {
      socket.emit('typing');
    } else {
      socket.emit('finished typing');
    }
  }, 100);
});

function sendMessage(event) {
  const userMessage = event.target.elements.msg.value;
  userMessage.trim();

  if (!userMessage) return false;

  socket.emit('message', userMessage);

  return true;
}

function clearFormInput(event) {
  event.target.elements.msg.value = '';
  event.target.elements.msg.focus();
}
