// script.js
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('messageInput');
    const userMessage = document.getElementById('userMessage');
  
    input.addEventListener('keypress', function (e) {
      if (e.key === 'Enter' && input.value.trim() !== '') {
        userMessage.textContent = input.value.trim();
        input.value = '';
      }
    });
  });
  