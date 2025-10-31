// Funções de navegação da sidebar (para os botões funcionarem)
function btn_diario() {
    window.location.href = 'dregistro.html'; // Ajuste o nome do arquivo se necessário
  }

  function btn_chat() {
    window.location.href = "./chat.html";
  };

  function btn_graf() {
    window.location.href = 'grafevolut.html'; // Ajuste o nome do arquivo se necessário
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Pegar referências dos elementos do formulário
    const form = document.getElementById('profile-form');
    const nomeInput = document.getElementById('nome');
    const sobrenomeInput = document.getElementById('sobrenome');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const tempoInput = document.getElementById('tempo');
    const deleteButton = document.getElementById('btn-delete-account');
  
    // 2. Pegar ID do usuário do localStorage
    const usuarioId = sessionStorage.getItem('id_usuario');
    if (!usuarioId) {
      alert('Usuário não autenticado. Redirecionando para o login.');
      window.location.href = 'index.html'; // Ou sua página de login
      return;
    }
  
    // 3. Função para carregar os dados do usuário
    async function carregarDadosUsuario() {
      try {
        const response = await fetch(`http://localhost:3030/usuarios/${usuarioId}`);
        const result = await response.json();
  
        if (result.success) {
          const data = result.data;
          // Preenche o formulário com os dados do banco
          nomeInput.value = data.nome;
          sobrenomeInput.value = data.sobrenome;
          emailInput.value = data.email;
          senhaInput.value = data.senha; // Preenche a senha atual
          tempoInput.value = data.tempo_condicao;
        } else {
          alert(`Erro ao carregar perfil: ${result.message}`);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert('Não foi possível conectar ao servidor.');
      }
    }
  
    // 4. Lógica para SALVAR (UPDATE)
    form.addEventListener('submit', async (event) => {
      event.preventDefault(); // Impede o recarregamento da página
  
      // Coleta os dados do formulário
      const dadosAtualizados = {
        name: nomeInput.value,
        surname: sobrenomeInput.value,
        email: emailInput.value,
        password: senhaInput.value,
        tempo: tempoInput.value
      };
  
      try {
        const response = await fetch(`http://localhost:3030/usuarios/${usuarioId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dadosAtualizados),
        });
  
        const result = await response.json();
  
        if (result.success) {
          alert('Perfil atualizado com sucesso!');
          // (Opcional) Atualiza o nome no localStorage se ele mudou
          localStorage.setItem('usuarioNome', dadosAtualizados.name);
        } else {
          alert(`Erro ao atualizar: ${result.message}`);
        }
      } catch (error) {
        console.error('Erro ao atualizar:', error);
        alert('Não foi possível conectar ao servidor.');
      }
    });
  
    // 5. Lógica para DELETAR
    deleteButton.addEventListener('click', async () => {
      // Dupla confirmação para segurança
      if (!confirm('TEM CERTEZA? Esta ação é irreversível e deletará sua conta permanentemente.')) {
        return;
      }
      if (!confirm('Confirmação final: Deletar sua conta agora?')) {
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:3030/usuarios/${usuarioId}`, {
          method: 'DELETE',
        });
  
        const result = await response.json();
  
        if (result.success) {
          alert('Conta deletada com sucesso. Você será redirecionado.');
          // Limpa o localStorage e redireciona
          sessionStorage.removeItem('id_usuario');
          window.location.href = 'index.html'; // Página de login
        } else {
          alert(`Erro ao deletar conta: ${result.message}`);
        }
      } catch (error) {
        console.error('Erro ao deletar:', error);
        alert('Não foi possível conectar ao servidor.');
      }
    });
  
    // Carrega os dados do usuário assim que a página é aberta
    carregarDadosUsuario();
  });