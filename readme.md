Site do projeto Voto Válido

Como rodar o projeto:
1º: Instalar o node.js:
Para instalar o node.js basta acessar o site: https://nodejs.org/en/download/package-manager

A instalação pode ser conferida com o seguinte comando no terminal

  node --version 
  
  npm --version
  
1º: Instalar as dependências:
Com o respositório já adicionado instale as depências, lembre de atualizar o repositório antes de rodar, isso pode ser feito com o comando:

  git pull
  
Abra o terminal na pasta do site, se estiver no VSCode na raiz do projeto ela pode ser acessada com o comando:

cd site/front

Agora basta instalar as dependências com o comando:

npm install

Depois de instalar as dependências instale o pacote de roteamento para React: 


npm install react-router-dom


3º: Rodar o projeto:
Por fim para executar o projeto basta executar o comando:

npm run dev

O site poderá ser visualizado no navegador com o link: http://localhost:5173/
