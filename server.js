const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const http = require('http');
const formatMessage = require('./utils/formatMessage.js');
const {
  assignUserData,
  getCurrentUser,
  getLeavingUserAndUpdateUsersArray,
  getUsersList,
} = require('./utils/usersHandlers.js');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const adminName = 'MSG Store';

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  socket.on('join room', (queries) => {
    const user = assignUserData(socket.id, queries);

    socket.join(user.room);

    io.to(user.room).emit('join room', user.room, getUsersList(user.room));

    socket.emit('message', formatMessage(adminName, 'welcome to the club!'));
    socket.emit('message', formatMessage(adminName, 'Silahkan berbincang!'));

    socket.to(user.room).broadcast.emit('message', formatMessage(adminName, `${user.username} has joined the room`));
  });

  socket.on('message', (userMessage) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, userMessage));
  });

  socket.on('typing', () => {
    const user = getCurrentUser(socket.id);

    if (user) {
      socket.to(user.room).broadcast.emit('typing', user);
    }
  });

  socket.on('finished typing', () => {
    const user = getCurrentUser(socket.id);
    if (user) {
      socket.to(user.room).broadcast.emit('finished typing');
    }
  });

  socket.on('disconnect', () => {
    const user = getLeavingUserAndUpdateUsersArray(socket.id)[0];

    if (user) {
      io.to(user.room).emit('leave room', getUsersList(user.room));
      io.to(user.room).emit('message', formatMessage(adminName, `${user.username} has left the room`));
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, console.log(`server is running at port ${port}`));
