// Elementos do DOM
const header = document.getElementById('header');
const nav = document.getElementById('nav');
const content = document.getElementById('content');
const welcomeMessage = document.getElementById('welcomeMessage');
const usernameDisplay = document.getElementById('usernameDisplay');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Containers de perfis de usuário
const prestadorContainer = document.querySelector('.prestador-container');
const clienteContainer = document.querySelector('.cliente-container');
const entregadorContainer = document.querySelector('.entregador-container');

function obterUserIdLogado() {
  // Exemplo de leitura do ID do usuário do localStorage (pode variar dependendo da implementação real)
  const userId = localStorage.getItem('userId');
  if (!userId) {
      throw new Error('Usuário não está logado');
  }
  return userId;
}

// Função para exibir conteúdo após login
function exibirConteudo(usuario) {
    // Esconde o formulário de login no cabeçalho
   // nav.style.display = 'none';

    // Exibe mensagem de boas-vindas com o nome do usuário
    usernameDisplay.textContent = usuario.firstName;
    welcomeMessage.style.display = 'block';

    // Exibe botão de logout
    logoutBtn.style.display = 'inline';

    // Inicialmente, esconde todos os perfis
    prestadorContainer.style.display = 'none';
    clienteContainer.style.display = 'none';
    entregadorContainer.style.display = 'none';

    // Exibe os perfis de acordo com os perfis do usuário
    if (usuario.profiles.includes('Prestador')) {
      prestadorContainer.style.display = 'block';
    }
    if (usuario.profiles.includes('Cliente')) {
      clienteContainer.style.display = 'block';
    }
    if (usuario.profiles.includes('Entregador')) {
      entregadorContainer.style.display = 'block';
    }
}

// Função para ocultar conteúdo ao fazer logout
function ocultarConteudo() {
    // Exibe o formulário de login no cabeçalho
    nav.style.display = 'flex';

    // Oculta mensagem de boas-vindas e botão de logout
    welcomeMessage.style.display = 'none';
    logoutBtn.style.display = 'none';
}
 
// Função para verificar as credenciais e fazer login
function fazerLogin(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    
    const form = document.getElementById('loginForm');//.addEventListener('submit', function(event) {
    
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    fetch('https://insprak-delivery-api-3-388c3302da22.herokuapp.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      }) 
    .then(data => {
      if (data.success) {
        
        console.log(data);
        const usuarioAutenticado = {
          userId: data.userId, // Exemplo de ID do usuário autenticado (substitua pelo seu método real de obtenção)
          // Outros dados do usuário, como nome, perfil, etc.
        };
        // Armazenar o ID do usuário no localStorage após o login bem-sucedido
        localStorage.setItem('userId', usuarioAutenticado.userId);

        getUserById(usuarioAutenticado.userId); 
        // Simulação de redirecionamento após login bem-sucedido (substituir por lógica real)
        setTimeout(() => {
            // Redireciona para a página principal após 2 segundos (simulado)
            window.location.replace('login.html');
        }, 2000);

        // Login bem-sucedido
        //document.getElementById('message').textContent = 'Login bem-sucedido!';
        //document.getElementById('message').style.color = 'green';
        // Redirecionar ou realizar outras ações necessárias
      } else {
        // Login falhou
        document.getElementById('message').textContent = 'Usuário ou senha incorretos.';
        document.getElementById('message').style.color = 'red'
      }
    })
    .catch(error => {
      console.error('Erro:', error);
      document.getElementById('message').textContent = 'Usuário ou senha incorretos.';
      document.getElementById('message').style.color = 'red'
    });
 // });
}


// Função para obter dados do usuário por ID
function getUserById(userId) {
  console.log('AQUI' , userId);

  fetch(`https://insprak-delivery-api-3-388c3302da22.herokuapp.com/users/${userId}`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Erro ao buscar usuário');
          }
          return response.json();
      })
      .then(data => {
          // Exemplo de como usar os dados do usuário
          console.log('Dados do usuário:', data);
          exibirConteudo(data);
      })
      .catch(error => {
          console.error('Erro ao obter usuário:', error);
          // Trate o erro adequadamente (ex.: exibir mensagem de erro para o usuário)
      });
}

// Exemplo de uso: chamar a função getUserById com o ID do usuário desejado
const userId = obterUserIdLogado(); // Substitua pelo ID do usuário que você deseja buscar
getUserById(userId);
  
// Função para realizar logout
function fazerLogout(event) {
  event.preventDefault(); // Evita o comportamento padrão do link

  // Executa ação de logout
  ocultarConteudo();
  console.log("logout");
  // Simulação de redirecionamento para a página de login (substituir por lógica real)
  window.location.replace('index.html');
}

// Adiciona event listener para o evento de submit do formulário de login
document.getElementById('loginForm').addEventListener('submit', fazerLogin);

// Adiciona event listener para o evento de clique no botão de logout
logoutBtn.addEventListener('click', fazerLogout);

// Verifica se há um usuário logado ao carregar a página
// Simulação: verificar se há um token de sessão ou similar
const usuarioLogado = true; // Substituir por lógica real
if (usuarioLogado) {
  const usuario = users[0]; // Substituir por obtenção do usuário logado

  // Exibe conteúdo após login ao carregar a página
  exibirConteudo(usuario);
}