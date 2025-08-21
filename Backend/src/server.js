// function entrar() {
//     alert("Você clicou em Entrar");
//   }
  
//   function cadastrar() {
//     alert("Você clicou em Cadastrar");
//   }
  
//   function souEstudante() {
//     alert("Você clicou em 'Sou um estudante'");
//   }
  
  const express = require('express');
  const cors = require('cors');
  const connection = require('../src/db_config');
  const app = express();
  
  app.use(cors());
  app.use(express.json());
  
  const port = 3030;


app.post('/cadastro', (req, res) => {
  const { name, surname, email, password, tempo } = req.body;

  const query = 'INSERT INTO usuarios (nome, sobrenome, email, senha, tempo_condicao) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [ name, surname, email, password, tempo ], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro no servidor.', err: err});
    }

    if (results.length > 0) {
      res.json({ success: false, message: 'Cadastro falhou!'});
      console.log(results);
    } else {
      res.json({ success: true, message: 'Cadastro bem-sucedido!' });
      console.log(results);
    }
  });
});

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));  //final!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//criar o endpoint do login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const query = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
  connection.query(query, [email, senha], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }

    if (results.length > 0) {
      res.json({ success: true, message: 'Login bem-sucedido!' });
    } else {
      res.json({ success: false, message: 'Usuário ou senha incorretos!' });
    }
  });
});

//editar o usuario
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

//deletar o usuario
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


//unificar o endpoint do cadastro baseado na tabela de usuarios (nome, senha), criar o endpoint com a query INSERT INTO
//endpoint do login no formato app.post com SELECT para logar e salvar o usuario no app
//endpoint do cadastro do diário salvando com INSERT INTO id do user e sintomas