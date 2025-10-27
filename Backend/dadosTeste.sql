-- Garante que você está usando o banco de dados correto
USE epilepsy_support;

-- Inserção dos 10 usuários PROFISSIONAIS
INSERT INTO usuarios (nome, sobrenome, profissional, email, senha, tempo_condicao)
VALUES
-- 4 Neurologistas
('Bianca', 'de Oliveira', 'neurologista', 'bianca.oliveira@med.com', 'senha123', NULL),
('Carlos', 'Andrade', 'neurologista', 'carlos.andrade@med.com', 'senha123', NULL),
('Roberto', 'Fernandes', 'neurologista', 'roberto.fernandes@med.com', 'senha123', NULL),
('Sofia', 'Costa', 'neurologista', 'sofia.costa@med.com', 'senha123', NULL),
-- 3 Psicólogos
('Marcos', 'Lins', 'psicologo', 'marcos.lins@psi.com', 'senha123', NULL),
('Helena', 'Martins', 'psicologo', 'helena.martins@psi.com', 'senha123', NULL),
('Ricardo', 'Gomes', 'psicologo', 'ricardo.gomes@psi.com', 'senha123', NULL),
-- 3 Médicos (Clínicos Gerais)
('Amanda', 'Souza', 'medico', 'amanda.souza@med.com', 'senha123', NULL),
('Bruno', 'Pereira', 'medico', 'bruno.pereira@med.com', 'senha123', NULL),
('Clara', 'Lima', 'medico', 'clara.lima@med.com', 'senha123', NULL);

-- Inserção dos 10 usuários PACIENTES
INSERT INTO usuarios (nome, sobrenome, profissional, email, senha, tempo_condicao)
VALUES
('Ana', 'Silva', NULL, 'ana.silva@paciente.com', 'senha123', '3 anos'),
('Beatriz', 'Costa', NULL, 'beatriz.costa@paciente.com', 'senha123', '1 ano'),
('Carla', 'Dias', NULL, 'carla.dias@paciente.com', 'senha123', 'Desde a infância'),
('Daniel', 'Moreira', NULL, 'daniel.moreira@paciente.com', 'senha123', '6 meses'),
('Elisa', 'Ferreira', NULL, 'elisa.ferreira@paciente.com', 'senha123', '10 anos'),
('Fábio', 'Azevedo', NULL, 'fabio.azevedo@paciente.com', 'senha123', '5 anos'),
('Gabriela', 'Nunes', NULL, 'gabriela.nunes@paciente.com', 'senha123', '2 anos'),
('Heitor', 'Campos', NULL, 'heitor.campos@paciente.com', 'senha123', '8 meses'),
('Isabela', 'Barros', NULL, 'isabela.barros@paciente.com', 'senha123', '12 anos'),
('João', 'Pedro Almeida', NULL, 'joao.pedro@paciente.com', 'senha123', 'Diagnóstico recente');