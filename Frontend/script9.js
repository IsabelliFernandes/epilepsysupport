// Funções de navegação (presentes no seu HTML)
function btn_chat() {
    console.log("Navegar para o chat");
    // Ex: window.location.href = 'chat.html';
  }
  
  function btn_graf() {
    console.log("Navegar para estatísticas");
    // Ex: window.location.href = 'estatisticas.html';
  }
  
  function btn_user() {
    window.location.href = "./perfil.html";
  };
  
  // --- SCRIPT PRINCIPAL DA PÁGINA DE RELATÓRIOS ---
  
  // Aguarda o HTML ser completamente carregado
  document.addEventListener('DOMContentLoaded', () => {
    // Pega o ID do usuário salvo no localStorage (durante o login)
    const usuarioId = sessionStorage.getItem('id_usuario');
  
    // Seleciona os elementos da página
    const mainContent = document.querySelector('.container-relatorios');
    const backButton = mainContent.querySelector('a[href="dregistro.html"]');
  
    // Se não encontrar o ID, redireciona para o login (segurança)
    if (!usuarioId) {
      alert('Usuário não autenticado. Redirecionando para o login.');
      // window.location.href = 'login.html'; // Descomente para redirecionar
      return;
    }
  
    // Função para buscar e exibir os relatórios
    async function carregarRelatorios() {
      try {
        const response = await fetch(`http://localhost:3030/historico/${usuarioId}`);
        const data = await response.json();
  
        if (data.success && data.historico.length > 0) {
          // Remove mensagem de 'carregando' se houver
          const loadingMsg = document.getElementById('loading-message');
          if (loadingMsg) loadingMsg.remove();
          
          // Itera sobre cada registro do histórico
          data.historico.forEach(relatorio => {
            // 1. Cria o card do relatório
            const reportCard = document.createElement('article');
            reportCard.className = 'report-card'; // Adicione estilos para .report-card no seu CSS
            // Guarda o ID do relatório no próprio elemento do card para fácil remoção
            reportCard.dataset.relatorioId = relatorio.id; 
  
            // 2. Formata a data
            const dataFormatada = new Date(relatorio.data_registro).toLocaleString('pt-BR', {
              dateStyle: 'long',
              timeStyle: 'short'
            });
  
            // 3. Formata os sintomas (converte de JSON string para texto)
            let sintomasFormatados = '';
            try {
              const sintomasArray = JSON.parse(relatorio.sintomas);
              sintomasFormatados = sintomasArray.join(', '); 
            } catch (e) {
              sintomasFormatados = relatorio.sintomas; // Fallback
            }
  
            // 4. Adiciona o conteúdo HTML ao card (COM O BOTÃO DELETAR)
            reportCard.innerHTML = `
              <div class="report-header">
                <div>
                  <strong>Data:</strong> ${dataFormatada}
                </div>
                <button class="delete-btn" data-id="${relatorio.id}" title="Deletar relatório">
                  ❌
                </button>
              </div>
              <div class="report-body">
                <strong>Sintomas Registrados:</strong>
                <p>${sintomasFormatados}</p>
              </div>
            `;
  
            // 5. Insere o card na página, ANTES do botão "Voltar"
            mainContent.insertBefore(reportCard, backButton);
          });
  
        } else if (data.success && data.historico.length === 0) {
          exibirMensagem("Você ainda não possui nenhum relatório registrado.");
        } else {
          exibirMensagem(`Erro ao buscar relatórios: ${data.message}`);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
        exibirMensagem('Não foi possível conectar ao servidor.');
      }
    }
  
    // Função auxiliar para exibir mensagens na tela
    function exibirMensagem(mensagem) {
      const messageElement = document.createElement('p');
      messageElement.id = 'loading-message'; // Reutilizando o ID
      messageElement.textContent = mensagem;
      mainContent.insertBefore(messageElement, backButton);
    }
  
    // ==========================================================
    // === NOVA LÓGICA DE DELEÇÃO (Event Delegation) ===
    // ==========================================================
    
    // Adiciona um único "ouvinte" ao 'mainContent' que observa cliques
    // em qualquer botão .delete-btn que esteja dentro dele.
    mainContent.addEventListener('click', (event) => {
      // Verifica se o elemento clicado foi um botão de deletar
      if (event.target.classList.contains('delete-btn')) {
        const idRelatorio = event.target.dataset.id;
        // Passa o próprio botão como argumento para podermos achar o card
        deletarRelatorio(idRelatorio, event.target);
      }
    });
  
    // Nova função para deletar o relatório
    async function deletarRelatorio(idRelatorio, botaoElement) {
      // Pede confirmação ao usuário
      if (!confirm('Tem certeza que deseja deletar este relatório? Esta ação não pode ser desfeita.')) {
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:3030/historico/${idRelatorio}`, {
          method: 'DELETE'
        });
  
        const data = await response.json();
  
        if (data.success) {
          // Encontra o card "pai" do botão e o remove da tela
          const cardParaRemover = botaoElement.closest('.report-card');
          if (cardParaRemover) {
            cardParaRemover.remove();
            alert('Relatório deletado com sucesso!');
          }
        } else {
          // Exibe erro caso o backend falhe
          alert(`Erro ao deletar: ${data.message}`);
        }
      } catch (error) {
        console.error('Erro na requisição de deleção:', error);
        alert('Não foi possível conectar ao servidor para deletar.');
      }
    }
    // ==========================================================
  
    // Inicia o processo
    exibirMensagem("Carregando relatórios...");
    carregarRelatorios();
  });