// ==========================================================
// === LÓGICA DO HEADER (Navegação) ===
// ==========================================================

function btn_diario() {
  window.location.href = "./dregistro.html";
};

function btn_graf() {
  window.location.href = "./grafevolut.html";
};

function btn_user() {
  window.location.href = "./perfil.html";
};

// ==========================================================
// === LÓGICA DO CHAT ===
// ==========================================================

const API_URL = "http://localhost:3030";

let socket; // Armazena a conexão do Socket.io
let currentUser = {}; // Armazena dados do usuário logado (id, nome, role)
let currentRoomId = null; // Armazena a sala de chat ativa
let allListItems = []; // Armazena profissionais ou conversas para o filtro

// Função para gerar o Room ID com base nos IDs
function getRoomId(id1, id2) {
  return [id1, id2].sort((a, b) => a - b).join(':');
}

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Obter dados do usuário logado ---
  const userName = sessionStorage.getItem("nome_usuario");
  const userId = sessionStorage.getItem("id_usuario");
  const userRole = sessionStorage.getItem("profissional");

  // Validação do login
  if (!userName || !userId) {
    alert("Usuário não logado. Redirecionando...");
    window.location.href = "./entrar.html";
    return;
  }

  // Armazena os dados do usuário na variável
  currentUser = {
    id: parseInt(userId),
    nome: userName,
    role: userRole // Armazena a profissão do usuário, caso este campo fique como "null", significa que o usuário é um paciente
  };

  // --- 2. Referências aos elementos do DOM ---

  // Seção em que é feita a escolha do profissional/paciente para iniciar uma conversa
  const professionalSelection = document.getElementById('professional-selection');

  // Listagem dos nomes dos profissionais ou pacientes para iniciar uma conversa
  const professionalListDiv = document.getElementById('professional-list');

  // Input para selecionar uma pessoa para iniciar uma conversa
  const searchInput = document.getElementById('search-professional');

  // Mensagem
  const selectionTitle = document.querySelector('#professional-selection h2');

  // Mensagem que indica o usuário selecionar uma pessoa para iniciar a conversa
  const selectionSubTitle = document.querySelector('#professional-selection p');

  // Seção da qual armazena o bloco de apresentaçao do nome em que está sendo destinada as mensagens e o bloco das mensagens
  const chatWrapper = document.getElementById('chat-wrapper');

  // Seção do input para inserir a mensagem a ser enviada
  const chatInputWrapper = document.getElementById('chat-input-wrapper');

  // Campo de texto para inserir a mensagem a ser enviada
  const messageInput = document.getElementById('messageInput');

  // Seção da qual apresenta as mensagens
  const container_msg = document.getElementById("container-msg");

  // Campo em que apresenta o nome da pessoa da qual o usuário logado está enviando mensagem
  const chatHeaderName = document.getElementById('chat-with-name');

  // Botão para voltar para a listagem dos usuário para iniciar uma conversa
  const backBtn = document.getElementById('back-to-list-btn');

  // --- 3. Inicializar Conexão Socket.io ---
  socket = io(API_URL);

  // Evento 'connect': Disparado quando a conexão é estabelecida
  socket.on('connect', () => {
    // console.log('Conectado ao servidor de chat com ID:', socket.id);
  });

  // --- 4. LÓGICA CONDICIONAL (Paciente vs Profissional) ---
  // Caso o usuário não tiver profissão, signfica que ele é um paciente, caso contrário ele é um profissional.
  if (currentUser.role && currentUser.role !== 'null' && currentUser.role !== 'undefined') {
    // É um PROFISSIONAL
    selectionTitle.textContent = "Minhas Conversas";
    selectionSubTitle.textContent = "Selecione um paciente para ver o histórico.";
    searchInput.placeholder = "Buscar paciente...";
    loadMyConversations(); // Chama a função para carregar conversas
  } else {
    // É um PACIENTE
    selectionTitle.textContent = "Iniciar Conversa";
    selectionSubTitle.textContent = "Selecione um profissional para conversar.";
    searchInput.placeholder = "Buscar profissional pelo nome...";
    loadProfessionals(); // Chama a função para carregar a lista dos profissionais
  }

  // --- 5. Funções de Carregamento de Lista ---

  // Carrega lista de profissionais para o PACIENTE
  async function loadProfessionals() {
    try {
      const response = await fetch(`${API_URL}/chat/professionals`);
      const data = await response.json();
      if (data.success) {
        // 1. Armazena a lista COMPLETA para a busca
        allListItems = data.professionals;

        // 2. Cria uma lista inicial apenas com os 8 primeiros
        const initialList = allListItems.slice(0, 8);

        // 3. Renderiza apenas a lista inicial
        renderProfessionalList(initialList);
      } else {
        professionalListDiv.innerHTML = "<p>Nenhum profissional disponível.</p>";
      }
    } catch (err) {
      console.error("Erro ao buscar profissionais:", err);
      professionalListDiv.innerHTML = "<p>Erro ao carregar profissionais.</p>";
    }
  }

  // Carrega lista de conversas para o PROFISSIONAL
  async function loadMyConversations() {
    try {
      const response = await fetch(`${API_URL}/chat/my-conversations/${currentUser.id}`);
      const data = await response.json();

      if (data.success && data.conversations.length > 0) {
        // Armazena a lista COMPLETA para a busca
        allListItems = data.conversations;

        // Renderiza todas as conversas encontradas
        renderConversationList(allListItems);
      } else {
        professionalListDiv.innerHTML = "<p>Nenhuma conversa ativa.</p>";
      }
    } catch (err) {
      console.error("Erro ao buscar conversas:", err);
      professionalListDiv.innerHTML = "<p>Erro ao carregar conversas.</p>";
    }
  }

  // --- 6. Funções de Renderização de Lista ---

  // Renderiza lista de profissionais (para Paciente)
  function renderProfessionalList(professionals) {
    professionalListDiv.innerHTML = ''; // Limpa a lista
    // Filtra para não mostrar o próprio usuário (caso ele seja um profissional)
    const filteredList = professionals.filter(p => p.id !== currentUser.id);
    if (filteredList.length === 0) {
      professionalListDiv.innerHTML = "<p>Nenhum profissional disponível.</p>";
      return;
    }
    filteredList.forEach(prof => {
      const profElement = document.createElement('button');
      profElement.className = 'professional-item';
      profElement.innerHTML = `
        <span class="prof-name">${prof.nome} ${prof.sobrenome}</span>
        <span class="prof-role">${prof.profissional}</span>
      `;
      profElement.addEventListener('click', () => openChat(prof));
      professionalListDiv.appendChild(profElement);
    });
  }

  // Renderiza lista de conversas (para Profissional)
  function renderConversationList(conversations) {
    professionalListDiv.innerHTML = ''; // Limpa a lista
    if (conversations.length === 0) {
      professionalListDiv.innerHTML = "<p>Nenhuma conversa encontrada.</p>";
      return;
    }
    conversations.forEach(conv => {
      const convElement = document.createElement('button');
      convElement.className = 'professional-item';
      let lastMessage = conv.last_message;
      if (lastMessage.length > 30) lastMessage = lastMessage.substring(0, 30) + "...";
      convElement.innerHTML = `
        <span class="prof-name">${conv.other_user_nome} ${conv.other_user_sobrenome}</span>
        <span class="prof-role last-message">${lastMessage}</span>
      `;
      convElement.addEventListener('click', () => openChat(conv));
      professionalListDiv.appendChild(convElement);
    });
  }

  // --- 7. Lógica para abrir um chat ---
  function openChat(otherParty) {
    professionalSelection.style.display = 'none';
    chatWrapper.style.display = 'block';
    chatInputWrapper.style.display = 'flex';
    container_msg.innerHTML = '';

    let otherUserId, otherUserFullName, roomId;

    // Decide como montar os dados com base em quem abriu o chat
    if (otherParty.other_user_id) { // É um PROFISSIONAL (otherParty = 'conversation')
      otherUserId = otherParty.other_user_id;
      otherUserFullName = `${otherParty.other_user_nome} ${otherParty.other_user_sobrenome}`;
      roomId = otherParty.room_id;
    } else { // É um PACIENTE (otherParty = 'professional')
      otherUserId = otherParty.id;
      otherUserFullName = `${otherParty.nome} ${otherParty.sobrenome} (${otherParty.profissional})`;
      roomId = getRoomId(currentUser.id, otherUserId);
      console.log(otherParty, roomId);
    }

    // Atualiza o cabeçalho do chat
    chatHeaderName.textContent = otherUserFullName;

    // Define a sala atual
    currentRoomId = roomId;

    // Avisa o servidor para "entrar" nesta sala
    socket.emit('join_room', currentRoomId);

    // console.log(`Entrando na sala: ${currentRoomId}`);

    // Carrega o histórico de mensagens
    loadChatHistory(currentRoomId);
  }

  // --- 8. Carregar histórico de mensagens ---
  async function loadChatHistory(room_id) {
    try {
      const response = await fetch(`${API_URL}/chat/messages/${room_id}`);
      const data = await response.json();
      if (data.success && data.messages.length > 0) {
        data.messages.forEach(addMessageToChat);
      } else {
        // console.log("Nenhuma mensagem anterior.");
      }
    } catch (err) {
      console.error("Erro ao buscar histórico:", err);
    }
  }

  // --- 9. Adicionar mensagem à tela ---
  function addMessageToChat(msgData) {
    const messageClass = msgData.id_usuario === currentUser.id ? 'user' : 'doctor';
    const chatBubble = document.createElement('div');
    chatBubble.className = `chat-bubble ${messageClass}`;

    // Cria o elemento H5 para o nome
    const chatBubleh5 = document.createElement('h5');
    chatBubleh5.textContent = msgData.nome == currentUser.nome ? 'Eu' : msgData.nome;

    // Cria o elemento P para a mensagem
    const chatBublep = document.createElement('p');
    chatBublep.textContent = msgData.mensagem;

    // Adiciona H5 e P ao balão de chat
    chatBubble.appendChild(chatBubleh5);
    chatBubble.appendChild(chatBublep);

    // Adiciona o balão ao container
    container_msg.appendChild(chatBubble);

    // Rola a tela para a última mensagem
    container_msg.scrollTop = container_msg.scrollHeight;
  }

  // --- 10. Enviar mensagem ---
  messageInput.addEventListener('keypress', function (e) {
    // Verifica se a tecla é 'Enter' e se o campo não está vazio
    if (e.key === 'Enter' && messageInput.value.trim() !== '') {
      // Monta o objeto da mensagem
      const messageData = {
        room_id: currentRoomId,
        id_usuario: currentUser.id,
        mensagem: messageInput.value.trim(),
        nome: currentUser.nome // Envia o nome para o outro usuário ver
      };

      console.log(messageData);

      // Emite o evento 'send_message' para o servidor
      socket.emit('send_message', messageData);
      
      // Limpa o campo de input onde é inserida a mensagem a ser enviada
      messageInput.value = '';
    }
  });

  // --- 11. Receber mensagem ---
  // Ouvinte para o evento 'receive_message' emitido pelo servidor
  socket.on('receive_message', (data) => {
    // Só adiciona a mensagem se ela pertencer à sala que está aberta
    if (data.room_id === currentRoomId) {
      addMessageToChat(data);
    }
  });

  // --- 12. Botão Voltar ---
  backBtn.addEventListener('click', () => {
    // Esconde o chat e mostra a lista de seleção
    professionalSelection.style.display = 'block';
    chatWrapper.style.display = 'none';
    chatInputWrapper.style.display = 'none';
    currentRoomId = null; // "Sai" da sala
  });

  // --- 13. Filtro de Busca ---
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    // Lógica para Profissional (busca em conversas)
    if (currentUser.role && currentUser.role !== 'null' && currentUser.role !== 'undefined') {
      const filteredList = allListItems.filter(person => {
        let fullName;
        if (person.other_user_nome) {
          fullName = `${person.other_user_nome} ${person.other_user_sobrenome}`.toLowerCase();
        }
        return fullName ? fullName.includes(searchTerm) : false;
      });
      renderConversationList(filteredList); // Re-renderiza a lista de conversas
    } else {
      // Lógica para Paciente (busca em profissionais) - COM MUDANÇAS
      // Se a busca estiver VAZIA, mostra a lista inicial de 8
      if (searchTerm.trim() === '') {
        const initialList = allListItems.slice(0, 8);
        renderProfessionalList(initialList);
      } else {
        // Se a busca NÃO estiver vazia, filtra a lista COMPLETA
        const filteredList = allListItems.filter(person => {
          let fullName;
          if (person.nome) {
            fullName = `${person.nome} ${person.sobrenome}`.toLowerCase();
          }
          return fullName ? fullName.includes(searchTerm) : false;
        });
        // Renderiza TODOS os resultados da busca (sem slice)
        renderProfessionalList(filteredList);
      }
    }
  });
});