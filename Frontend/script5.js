function btn_diario() {
  window.location.href = "./dregistro.html";
};

function btn_graf() {
  window.location.href = "./grafevolut.html";
};

document.addEventListener('DOMContentLoaded', () => {
  const p_nome = document.getElementById("p_nome_usuario").textContent = sessionStorage.getItem("nome_usuario");

  const input = document.getElementById('messageInput');
  // const userMessage = document.getElementById('userMessage');
  const container_msg = document.querySelector(".container-msg");

  input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && input.value.trim() !== '') {
      container_msg.innerHTML += `
        <div class="chat-bubble user">${input.value.trim()}</div>
      `;
      input.value = '';
    }
  });
});