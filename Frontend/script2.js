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
        window.location.href = "index.html";
      } else {
        alert("Usuário ou senha incorretos!");
      }
};