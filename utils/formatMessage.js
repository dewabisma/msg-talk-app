function formatMessage(username, message) {
  const currentTime = new Date().toTimeString().substring(0, 5);

  return {
    username,
    message,
    time: currentTime,
  };
}

module.exports = formatMessage;
