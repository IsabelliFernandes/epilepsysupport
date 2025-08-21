/* script.js
   No momento, apenas um exemplo básico. Coloque aqui funções
   de interação (ex.: marcar sintomas, salvar no backend, etc.).
*/
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
  });
  