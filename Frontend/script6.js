document.getElementById('msgInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      const message = this.value.trim();
      if (message) {
        const msgContainer = document.createElement('div');
        msgContainer.className = 'message user';
        msgContainer.textContent = message;
        document.querySelector('.messages').appendChild(msgContainer);
        this.value = '';
        document.querySelector('.messages').scrollTop = document.querySelector('.messages').scrollHeight;
      }
    }
  });
  