const express = require('express');
const cors = require('cors');
const connection = require('../src/db_config'); // Certifique-se que o caminho está correto
const app = express();

app.use(cors());
app.use(express.json());

const port = 3030;

// Endpoint: Cadastro de usuário (Refatorado)
app.post('/cadastro', (req, res) => {
  const { name, surname, email, password, tempo } = req.body;

  const query = 'INSERT INTO usuarios (nome, sobrenome, email, senha, tempo_condicao) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [name, surname, email, password, tempo], (err, results) => {
    if (err) {
      // Trata erros (ex: email duplicado, erro de conexão)
      return res.status(500).json({ success: false, message: 'Erro no servidor.', err: err });
    }

    // Lógica correta: affectedRows > 0 significa que o INSERT funcionou
    if (results.affectedRows > 0) {
      res.json({ success: true, message: 'Cadastro bem-sucedido!' });
    } else {
      res.json({ success: false, message: 'Cadastro falhou!' });
    }
  });
});

// Endpoint: Login de usuário
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const query = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
  connection.query(query, [email, senha], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }

    if (results.length > 0) {
      res.json({ success: true, message: 'Login bem-sucedido!', usuario: { id_usuario: results[0].id, nome_usuario: results[0].nome } });
    } else {
      res.json({ success: false, message: 'Usuário ou senha incorretos!' });
    }
  });
});

// Endpoint: Atualizar usuário
app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { name, surname, email, password, tempo } = req.body;

  const query = `
    UPDATE usuarios
    SET nome = ?, sobrenome = ?, email = ?, senha = ?, tempo_condicao = ?
    WHERE id = ?
  `;

  connection.query(query, [name, surname, email, password, tempo, id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao atualizar usuário.', err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    res.json({ success: true, message: 'Usuário atualizado com sucesso.' });
  });
});

// Endpoint: Deletar usuário
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM usuarios WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao deletar usuário.', err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    res.json({ success: true, message: 'Usuário deletado com sucesso.' });
  });
});

// Endpoint: Registrar sintomas
app.post('/enviarSintomas', (req, res) => {
  const { id_usuario, sintomasSelecionados } = req.body;

  // Armazena o array de sintomas como uma string JSON
  const sintomasString = JSON.stringify(sintomasSelecionados);

  const query = 'INSERT INTO historico_crises (id_usuario, sintomas) VALUES (?, ?);';

  connection.query(query, [id_usuario, sintomasString], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }

    if (results.affectedRows > 0) {
      res.json({ success: true, message: 'Sintomas registrados!' });
    } else {
      res.json({ success: false, message: 'Erro ao enviar sintomas!' });
    }
  });
});

// Deletar sintomas
app.delete('/historico/:id_relatorio', (req, res) => {
  const { id_relatorio } = req.params;

  // Validação simples para garantir que o ID é um número
  if (isNaN(id_relatorio)) {
    return res.status(400).json({ success: false, message: 'ID de relatório inválido.' });
  }

  const query = 'DELETE FROM historico_crises WHERE id = ?';

  connection.query(query, [id_relatorio], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro no servidor.', err });
    }

    if (results.affectedRows === 0) {
      // Nenhum registro foi deletado (ID não encontrado)
      return res.status(404).json({ success: false, message: 'Relatório não encontrado.' });
    }

    // Sucesso
    res.json({ success: true, message: 'Relatório deletado com sucesso.' });
  });
});

// ==========================================================
// === NOVO ENDPOINT PARA BUSCAR O HISTÓRICO ===
// ==========================================================
app.get('/historico/:id_usuario', (req, res) => {
  const { id_usuario } = req.params;

  // Busca todos os registros do usuário, ordenando pelos mais recentes
  const query = 'SELECT * FROM historico_crises WHERE id_usuario = ? ORDER BY data_registro DESC';

  connection.query(query, [id_usuario], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro no servidor.', err });
    }

    // `results` será um array com os registros encontrados
    res.json({ success: true, historico: results });
  });
});

// ==========================================================
// === NOVO ENDPOINT PARA BUSCAR DADOS DO PERFIL ===
// ==========================================================
app.get('/usuarios/:id', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT nome, sobrenome, email, senha, tempo_condicao FROM usuarios WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro no servidor.', err });
    }

    if (results.length > 0) {
      // Envia os dados do usuário (sem o ID, pois o front já tem)
      res.json({ success: true, data: results[0] });
    } else {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }
  });
});

// ==========================================================

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));