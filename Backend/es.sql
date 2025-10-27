create database epilepsy_support;

use epilepsy_support;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    profissional ENUM('medico', 'psicologo', 'neurologista'),
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tempo_condicao VARCHAR(100)
);

CREATE TABLE historico_crises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario int,
    sintomas VARCHAR(250),
    data_registro timestamp default current_timestamp,
    
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE conversas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id VARCHAR(50) NOT NULL,
    id_usuario INT NOT NULL,
    mensagem TEXT NOT NULL,
    data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE 
);

select * from usuarios;
select * from historico_crises;

--unificar as tabelas de usuário
--criar a tabela de diário que terá:
--id do diario
--id do usuario (FK)
--sintomas (TEXT)