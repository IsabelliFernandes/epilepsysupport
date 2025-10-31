/* script.js
   No momento, apenas um exemplo básico. Coloque aqui funções
   de interação (ex.: marcar sintomas, salvar no backend, etc.).
*/

function btn_chat() {
  window.location.href = "./chat.html";
};

function btn_graf() {
  window.location.href = "./grafevolut.html";
};

function btn_user() {
  window.location.href = "./perfil.html";
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("Epilepsy Support carregado 🎉");

  // Exemplo: destacar item ativo ao clicar
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(btn =>
    btn.addEventListener("click", () => {
      navItems.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    })
  );

  // Lista para armazenar sintomas selecionados
  let sintomasSelecionados = [];

  // Seleciona todos os spans dos sintomas
  const sintomas = document.querySelectorAll(".symptoms-card span");

  sintomas.forEach(span => {
    span.addEventListener("click", () => {
      const sintoma = span.textContent.trim();

      // Se já estiver selecionado → remove
      if (sintomasSelecionados.includes(sintoma)) {
        sintomasSelecionados = sintomasSelecionados.filter(item => item !== sintoma);
        span.style.textDecoration = "none"; // Remove sublinhado
      }
      // Se não estiver → adiciona
      else {
        sintomasSelecionados.push(sintoma);
        span.style.textDecoration = "underline"; // Aplica sublinhado
      }
    });
  });

  const btn_enviar = document.getElementById("btn_enviar");
  const id_usuario = sessionStorage.getItem("id_usuario");

  btn_enviar.onclick = async function (e) {
    e.preventDefault();

    if (sintomasSelecionados.length !== 0) {
      const response = await fetch('http://localhost:3030/enviarSintomas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario, sintomasSelecionados })
      });

      const result = await response.json();

      if (result.success) {
        alert("Sintomas registrados!");
      } else {
        alert("Problemas ao enviar sintomas!");
      }
    } else {
      alert("Selecione uma das opções!");
    }
  };
});