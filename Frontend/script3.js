console.log("Epilepsy Support carregado");

const p_nome = document.getElementById("p_nome_usuario").textContent = sessionStorage.getItem("nome_usuario");

function btn_diario() {
  window.location.href = "./dregistro.html";
};

function btn_chat() {
  window.location.href = "./chat.html";
};

function btn_graf() {
    window.location.href = "./grafevolut.html";
};

function btn_user() {
  window.location.href = "./perfil.html";
};