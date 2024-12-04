
// Função para validar o CEP
function validarCep(cep) {
    const cepRegex = /^[0-9]{5}-?[0-9]{3}$/; // Formato XXXXX-XXX ou XXXXXXXX
    return cepRegex.test(cep); // Retorna true se o CEP for válido
}

// Função para validar Cidade
function validarCidade(cidade) {
    const regex = /[A-Za-zÀ-ÖØ-öø-ÿ]{2,}/;
    return regex.test(cidade);
}

// Função para validar se ao menos um perfil foi selecionado
function validarPerfis(profiles) {     
    return profiles.length > 0; // Retorna true se ao menos um perfil estiver selecionado
}

// Função para limpar caracteres não numéricos
function limparNumero(input) {
    return input.replace(/\D/g, '');
}

// Função para validar CPF
function validarCPF(cpf) {

    cpf = limparNumero(cpf);

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0, resto;

    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

// Validação de CNPJ
function validarCNPJ(cnpj) {
    cnpj = limparNumero(cnpj);

    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0, pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho++;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
}

// Validação combinada para CPF ou CNPJ
function validarCPFouCNPJ(valor) {
    const numero = limparNumero(valor);
    if (numero.length === 11) {
        return validarCPF(numero);
    } else if (numero.length === 14) {
        return validarCNPJ(numero);
    }
    return false;
}

// Função para validar e-mail
function validarEmail(email) {
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    return regex.test(email); // Retorna true se o e-mail for válido
}

// Função para coletar perfis selecionados no formulário de cadastro
function getSelectedProfiles() {
    const profileCheckboxes = document.querySelectorAll('input[name="profiles"]:checked');
    let selectedProfiles = [];

    profileCheckboxes.forEach((checkbox) => {
        selectedProfiles.push(checkbox.value);
    });

    return selectedProfiles;
}

// Função para enviar os dados do formulário para o servidor
function cadastrarUsuario(event) {
    event.preventDefault(); // Evita que o formulário seja enviado antes do processamento

    // Seleciona o formulário pelo ID
    const form = document.getElementById('registerForm');

    // Seleciona o campo de CEP
    const cep = document.getElementById('zipCode').value;

    // Valida o CEP
    if (!validarCep(cep)) {
        alert('Por favor, insira um CEP válido no formato XXXXX-XXX ou XXXXXXXX.');
        return;
    }

    // Obtém o valor do campo cidade
    const cidade = document.getElementById('city').value;

    // Valida a cidade
    if (!validarCidade(cidade)) {
        alert('O campo "Cidade" deve conter pelo menos 2 letras.');
        return;
    }
    const password = document.getElementById('password').value;

    // Valida senha
    if (password.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return;
    } 

    // Obtém o CPF/CNPJ e valida
    const cpfCnpj = document.getElementById('cpfCnpj').value;
    
    // Valida CPF ou CNPJ
    if (!validarCPFouCNPJ(cpfCnpj)) {
        alert('CPF ou CNPJ inválido. Por favor, insira um valor válido.');
        return;
    }

    // Validação de e-mail
    const email = document.getElementById('email').value;
    if (!validarEmail(email)) {
        alert('E-mail inválido. Por favor, insira um e-mail válido.');
        return;
    }

    // Verifica se uma UF foi selecionada
    const uf = document.getElementById('state').value;
    if (!uf) {
        alert('Por favor, selecione um estado (UF).');
        return;
    }

    // Cria um objeto FormData para coletar os dados do formulário
    const formData = new FormData(form);

    // Converte o FormData para um objeto JSON
    const userData = {};
    formData.forEach((value, key) => {
        if (key.includes('.')) {
            const nestedKeys = key.split('.');
            if (!userData[nestedKeys[0]]) {
                userData[nestedKeys[0]] = {};
            }
            userData[nestedKeys[0]][nestedKeys[1]] = value;
        } else {
            userData[key] = value;
        }
    });

     // Coleta todos os perfis selecionados
     const profiles = getSelectedProfiles();

      // Valida se ao menos um perfil foi selecionado
    if (!validarPerfis(profiles)) {
        alert('Por favor, selecione ao menos um perfil.');
        return;
    }

     // Adiciona os perfis selecionados ao objeto userData
     userData.profiles = profiles;

    // Exemplo de como imprimir os dados para verificação
    console.log(userData);

    // Simulação de requisição AJAX (substitua pelo método adequado)
    fetch('https://insprak-delivery-api-3-388c3302da22.herokuapp.com/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    .then(response => {
        if (!response.ok) {
            //throw new Error('Erro ao cadastrar usuário');
            return response.json().then(errorData => {
                // Verifica se a resposta do servidor contém a mensagem de erro sobre o nome de usuário
                if (errorData.message === 'O nome de usuário já está em uso.') {
                    alert('O nome de usuário já está em uso. Por favor, escolha outro.');
                    throw new Error('Nome de usuário já em uso');
                }
                throw new Error('Erro ao cadastrar usuário');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Usuário cadastrado com sucesso:', data);

        // Exibe mensagem de sucesso
        alert('Cadastro realizado com sucesso! Você será redirecionado para a página de login.');

        // Redireciona para a página de login
        window.location.replace('../../index.html');
    })
    .catch(error => {
        console.error('Erro ao cadastrar usuário:', error.message);
        // Trate o erro de acordo com sua lógica de aplicação
    });
}

// Adiciona um event listener para o evento de submit do formulário
document.getElementById('registerForm').addEventListener('submit', cadastrarUsuario);
