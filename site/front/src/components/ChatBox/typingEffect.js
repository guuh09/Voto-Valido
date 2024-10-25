export const digitacao = (elemento) => {
  const textoOriginal = elemento.textContent;

  
  const textoComQuebras = textoOriginal.replace(/\n/g, '<br>');


  const textoArray = textoComQuebras.split(/(\/start|\/consulta|Relatar um novo problema|Consultar atualizações da minha cidade)/);

  elemento.innerHTML = ''; 

  let totalDelay = 0; 

  textoArray.forEach((part) => {
    if (part === '/start') {
      setTimeout(() => {
        elemento.innerHTML += `<span style="color: #002776; font-weight: bold;">/start</span>`;
        elemento.scrollTop = elemento.scrollHeight; 
      }, totalDelay);
      totalDelay += 30; 
    } else if (part === '/consulta') {
      
      setTimeout(() => {
        elemento.innerHTML += `<span style="color: #002776; font-weight: bold;">/consulta</span>`;
        elemento.scrollTop = elemento.scrollHeight; 
      }, totalDelay);
      totalDelay += 30; 
    } else if (part.trim() === "Relatar um novo problema" || part.trim() === "Consultar atualizações da minha cidade") {
      
      setTimeout(() => {
        elemento.innerHTML += part; 
        elemento.scrollTop = elemento.scrollHeight; 
      }, totalDelay);
      totalDelay += 0; 
    } else {
      
      if (part.includes('<br>')) {
       
        const partesComQuebras = part.split('<br>');
        partesComQuebras.forEach((subparte, i) => {
          subparte.split('').forEach((letra, j) => {
            setTimeout(() => {
              elemento.innerHTML += letra; 
              elemento.scrollTop = elemento.scrollHeight; 
            }, totalDelay + (j * 30));
          });
          
          totalDelay += subparte.length * 30; 
          setTimeout(() => {
            if (i < partesComQuebras.length - 1) { 
              elemento.innerHTML += '<br>'; 
              elemento.scrollTop = elemento.scrollHeight; 
            }
          }, totalDelay);
          totalDelay += 30; 
        });
      } else {
       
        part.split('').forEach((letra, i) => {
          setTimeout(() => {
            elemento.innerHTML += letra; 
            elemento.scrollTop = elemento.scrollHeight; 
          }, totalDelay + (i * 30));
        });
        totalDelay += part.length * 30; 
      }
    }
  });

  // Adiciona um atraso para que a animação de digitação termine
  setTimeout(() => {
    elemento.innerHTML += ''; // Força a atualização do elemento
    elemento.scrollTop = elemento.scrollHeight; // Para rolar até o final
  }, totalDelay);
};
