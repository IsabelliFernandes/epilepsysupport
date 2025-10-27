const express = require('express');
const cors = require('cors');
const connection = require('../src/db_config');
const app = express();

// ==========================================================
// === 1. CONFIGURAÇÃO DO SOCKET.IO (INÍCIO) ===
// ==========================================================
// O Socket.io precisa de um servidor HTTP padrão do Node, não do 'app' Express diretamente.
const http = require('http'); 
const server = http.createServer(app); // Cria um servidor HTTP a partir da aplicação Express
const { Server } = require("socket.io"); // Importa a classe 'Server' do Socket.io

// Instancia o Socket.io no servidor HTTP, configurando o CORS para permitir conexões
const io = new Server(server, {
  cors: {
    origin: "*", // Permite conexões de qualquer origem
    methods: ["GET", "POST"]
  }
});
// ==========================================================

app.use(cors());
app.use(express.json());

const port = 3030;

// ==========================================================
// === SEUS ENDPOINTS EXISTENTES (Cadastro, Login, etc) ===
// ==========================================================

// Endpoint: Cadastro de usuário (Corrigido para incluir 'profissional')
app.post('/cadastro', (req, res) => {
  const { name, surname, email, password, tempo, profissional } = req.body; 

  const query = 'INSERT INTO usuarios (nome, sobrenome, email, senha, tempo_condicao, profissional) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [name, surname, email, password, tempo, profissional], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro no servidor.', err: err });
    }
    if (results.affectedRows > 0) {
      res.json({ success: true, message: 'Cadastro bem-sucedido!' });
    } else {
      res.json({ success: false, message: 'Cadastro falhou!' });
    }
  });
});

// Endpoint: Login de usuário (Retornando o ID)
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const query = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
  connection.query(query, [email, senha], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }
    if (results.length > 0) {
      res.json({ 
        success: true, 
        message: 'Login bem-sucedido!', 
        usuario: { 
          id_usuario: results[0].id,
          nome_usuario: results[0].nome,
          email: results[0].email,
          profissional: results[0].profissional
        } 
      });
    } else {
      res.json({ success: false, message: 'Usuário ou senha incorretos!' });
    }
  });
});

// Endpoint: Atualizar usuário
app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nome, sobrenome, email, senha, tempo_condicao } = req.body;
    const query = 'UPDATE usuarios SET nome = ?, sobrenome = ?, email = ?, senha = ?, tempo_condicao = ? WHERE id = ?';
    
    connection.query(query, [nome, sobrenome, email, senha, tempo_condicao, id], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro no servidor.', err });
        }
        if (results.affectedRows > 0) {
            res.json({ success: true, message: 'Usuário atualizado com sucesso!' });
        } else {
            res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
        }
    });
});

// Endpoint: Deletar usuário
app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM usuarios WHERE id = ?';
    
    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro no servidor.', err });
        }
        if (results.affectedRows > 0) {
            res.json({ success: true, message: 'Usuário deletado com sucesso!' });
        } else {
            res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
        }
    });
});

// Endpoint: Registrar sintoma (historico_crises)
app.post('/enviarSintomas', (req, res) => {
    const { id_usuario, sintomas } = req.body;
    const query = 'INSERT INTO historico_crises (id_usuario, sintomas) VALUES (?, ?)';
    
    connection.query(query, [id_usuario, sintomas], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao registrar sintoma.', err });
        }
        res.json({ success: true, message: 'Sintomas registrados com sucesso!' });
    });
});

// Endpoint: Deletar sintoma
app.delete('/historico/:id_registro', (req, res) => {
    const { id_registro } = req.params;
    const query = 'DELETE FROM historico_crises WHERE id = ?';
    
    connection.query(query, [id_registro], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro no servidor.', err });
        }
        if (results.affectedRows > 0) {
            res.json({ success: true, message: 'Registro de crise deletado com sucesso!' });
        } else {
            res.status(404).json({ success: false, message: 'Registro não encontrado.' });
        }
    });
});

// Endpoint: Buscar histórico de sintomas
app.get('/historico/:id_usuario', (req, res) => {
  const { id_usuario } = req.params;
  const query = 'SELECT * FROM historico_crises WHERE id_usuario = ? ORDER BY data_registro DESC';
  
  connection.query(query, [id_usuario], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro no servidor.', err });
    }
    res.json({ success: true, historico: results });
  });
});

// Endpoint: Buscar dados do perfil
app.get('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT nome, sobrenome, email, senha, tempo_condicao FROM usuarios WHERE id = ?';
  
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro no servidor.', err });
    }
    if (results.length > 0) {
      res.json({ success: true, data: results[0] });
    } else {
      res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }
  });
});

// ==========================================================
// === ENDPOINTS DO CHAT ===
// ==========================================================

// Endpoint: Buscar todos os profissionais (Para a lista do Paciente)
app.get('/chat/professionals', (req, res) => {
  const query = "SELECT id, nome, sobrenome, profissional FROM usuarios WHERE profissional IS NOT NULL";
  
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro no servidor.', err });
    }
    res.json({ success: true, professionals: results });
  });
});

// Endpoint: Buscar histórico de mensagens de uma sala (room_id)
app.get('/chat/messages/:room_id', (req, res) => {
  const { room_id } = req.params;

  const query = `
    SELECT c.mensagem, c.data_envio, c.id_usuario, u.nome
    FROM conversas c
    JOIN usuarios u ON c.id_usuario = u.id
    WHERE c.room_id = ?
    ORDER BY c.data_envio ASC
  `; 

  connection.query(query, [room_id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro no servidor.', err });
    }
    // Retorna sucesso mesmo se 'results' estiver vazio (é o log "Nenhuma msg anterior")
    res.json({ success: true, messages: results });
  });
});

// Endpoint: Buscar conversas de um profissional (Para a lista do Profissional)
app.get('/chat/my-conversations/:userId', (req, res) => {
    const { userId } = req.params; // Pega o ID do profissional logado

    // Esta query é complexa, mas faz o seguinte:
    // 1. Encontra a MENSAGEM MAIS RECENTE para cada 'room_id' que o profissional participa.
    // 2. Extrai o ID do OUTRO usuário (o paciente) a partir do 'room_id' (ex: "1:10").
    // 3. Junta com a tabela 'usuarios' para obter o NOME do paciente.
    // 4. Ordena tudo pela data da última mensagem, da mais nova para a mais antiga.
    
    const query = `
      SELECT 
          t.room_id,
          t.last_message,
          t.data_envio,
          u.id AS other_user_id,
          u.nome AS other_user_nome,
          u.sobrenome AS other_user_sobrenome
      FROM (
          SELECT 
              room_id, 
              mensagem AS last_message, 
              data_envio,
              -- Extrai o ID do "outro" usuário da string "id1:id2"
              CAST(
                  IF(SUBSTRING_INDEX(room_id, ':', 1) = ?, 
                     SUBSTRING_INDEX(room_id, ':', -1), 
                     SUBSTRING_INDEX(room_id, ':', 1)
                  ) 
              AS UNSIGNED) AS other_user_id
          FROM conversas c
          -- Sub-query para encontrar apenas a última mensagem de cada sala
          WHERE (c.room_id, c.data_envio) IN (
              SELECT room_id, MAX(data_envio)
              FROM conversas
              GROUP BY room_id
          )
          -- Filtra apenas as salas das quais o profissional participa
          AND (c.room_id LIKE CONCAT(?, ':%') OR c.room_id LIKE CONCAT('%:', ?))
      ) AS t
      -- Junta com a tabela de usuários para obter o nome do paciente
      JOIN usuarios u ON u.id = t.other_user_id
      ORDER BY t.data_envio DESC;
    `;

    connection.query(query, [userId, userId, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro no servidor.', err });
        }
        res.json({ success: true, conversations: results });
    });
});

// ==========================================================
// === LÓGICA DO CHAT EM TEMPO REAL (Socket.io) ===
// ==========================================================

// Evento 'connection': Disparado quando um novo cliente (navegador) se conecta
io.on('connection', (socket) => {
  // Evento 'join_room': Ouvinte para quando um cliente pede para entrar em uma sala
  socket.on('join_room', (room_id) => {
    socket.join(room_id); // Coloca o socket do cliente na sala específica
    // console.log(`Usuário ${socket.id} entrou na sala ${room_id}`);
  });

  // Evento 'send_message': Ouvinte para quando um cliente envia uma mensagem
  socket.on('send_message', (data) => {
    const { room_id, id_usuario, mensagem, nome } = data;

    // 1. Salvar a mensagem no banco (usando id_usuario)
    const query = 'INSERT INTO conversas (room_id, id_usuario, mensagem) VALUES (?, ?, ?)';
    
    connection.query(query, [room_id, id_usuario, mensagem], (err, results) => {
      if (err) {
        console.error('Erro ao salvar mensagem no DB:', err);
        return;
      }
      
      // 2. Enviar a mensagem em tempo real para todos na sala
      const dataCompleta = {
          ...data,
          data_envio: new Date().toISOString(),
          nome: nome 
      }
      
      // Emite o evento 'receive_message' para todos os clientes na 'room_id'
      io.to(room_id).emit('receive_message', dataCompleta);
      // console.log(`Mensagem enviada para a sala ${room_id}:`, dataCompleta);
    });
  });

  // Evento 'disconnect': Disparado quando o cliente fecha o navegador
  socket.on('disconnect', () => {
    // console.log('Usuário desconectou:', socket.id);
  });
});

// ==========================================================
// === INICIAR O SERVIDOR ===
// ==========================================================

server.listen(port, () => console.log(`Servidor HTTP e Socket.io rodando na porta ${port}`));