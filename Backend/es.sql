create database epilepsy_support;
use epilepsy_support;

CREATE TABLE usuarios_login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);
CREATE TABLE usuarios_cadastro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tempo_condicao VARCHAR(100) NOT NULL,
    FOREIGN KEY (email) REFERENCES usuarios_login(email) ON DELETE CASCADE
);
CREATE TABLE conversas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_email VARCHAR(255) NOT NULL,
    profissional ENUM('medico', 'psicologo', 'neurologista') NOT NULL,
    mensagem TEXT NOT NULL,
    data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_email) REFERENCES usuarios_login(email) ON DELETE CASCADE 
);

--unificar as tabelas de usuário
--criar a tabela de diário que terá:
--id do diario
--id do usuario (FK)
--sintomas (TEXT)