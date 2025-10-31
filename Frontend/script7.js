// document.getElementById('msgInput').addEventListener('keypress', function (e) {
//     if (e.key === 'Enter') {
//       const message = this.value.trim();
//       if (message) {
//         const msgContainer = document.createElement('div');
//         msgContainer.className = 'message user';
//         msgContainer.textContent = message;
//         document.querySelector('.messages').appendChild(msgContainer);
//         this.value = '';
//         document.querySelector('.messages').scrollTop = document.querySelector('.messages').scrollHeight;
//       }
//     }
//   });

function btn_diario() {
  window.location.href = "./dregistro.html";
};

function btn_chat() {
  window.location.href = "./chat.html";
};
function btn_user() {
    window.location.href = "./perfil.html";
};

// Gráfico
const ctx_evolution = document.getElementById('evolutionChart').getContext('2d');

    const mixedChart = new Chart(ctx_evolution, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [
                {
                    label: 'Chance de crise (%)',
                    data: [82, 83, 32, 55, 64, 32, 89, 12, 67, 98, 43, 14], // Dados a serem apresentados dentro do gráfico
                    backgroundColor: '#e8a894',
                    borderColor: '#ca9a8ca8',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: { enabled: true }
            }
        }
    });