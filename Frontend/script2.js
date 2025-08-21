// function handleSubmit(event) {
//     event.preventDefault();
//     alert("Cadastro realizado com sucesso!");
//   }
//   if (response.ok) {
//     // Cadastro feito com sucesso
//     window.location.href = 'menu.html'; // redireciona para a página do menu
//   } else {
//     const erro = await response.json();
//     alert('Erro ao cadastrar: ' + erro.mensagem);
//   }

async function cadastrar(event) {
      event.preventDefault();
      
      const name = document.getElementById('name').value
      const surname = document.getElementById('surname').value
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const tempo = document.getElementById('tempo_condicao').value;

      const response = await fetch('http://localhost:3030/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, email, password, tempo })
      });

      const result = await response.json();

      if (result.success) {
        alert("cadastro bem-sucedido!");
        window.location.href = "pginicial.html";
      } else {
        alert("Usuário ou senha incorretos!");
      }
};