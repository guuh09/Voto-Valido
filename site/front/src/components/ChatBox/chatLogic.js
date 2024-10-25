import { useState, useEffect,useCallback,useRef  } from 'react';
import { digitacao } from './typingEffect';
import { carregar_problemas } from '../../../../../funcoes/problemas';
import { sendMessageToAPI, getMessageToAPI } from '../../../../../Api/api';




const useChatLogic = () => {
  const [mensagens, setMensagens] = useState([
    { 
      from: 'bot',
      text: 'Olá!  Sou o Veve, o bot que vai ajudar a cidade.\n\nDiga onde está o problema, envie uma foto e selecione o que esta acontecendo\nvocê também pode fazer uma consulta rápida de denúncias já cadastradas.\n\nDigite /start para começar a usar o bot.' 
    },
  ]);
  
  const [mensagem, setMensagem] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [step, setStep] = useState('inicio');
  const [localizacao, setLocalizacao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [subcategoria, setSubcategoria] = useState('');
  const [fotoCarregada, setFotoCarregada] = useState(false);
  const [subcategoriaSelecionada,setSubcategoriaSelecionada] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [phtoSelecionada, setphtoSelecionada] = useState('');
  const mensagemRef = useRef(null);



  const problemas = carregar_problemas();
  const topicos = Object.keys(problemas);
  const dicProblemas = problemas;
  

  const handleEnviarMensagem = () => {
    

    if (mensagem !== '') {
      if (step === 'enviarLocalizacao' && mensagem === '1') {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
  
            fetch(`https://eu1.locationiq.com/v1/reverse.php?key=pk.ddacdac981d0c27a478e935f8558a272&lat=${latitude}&lon=${longitude}&format=json`)
              .then(response => response.json())
              .then(data => {
                
                
                const localizacao = `${data.address.state}, ${data.address.city}, ${data.address.road}`;
                setLocalizacao(localizacao);
                
                setMensagens(prevMensagens => [...prevMensagens, { from: 'user', text: localizacao }]);
               
                setStep('categoria');
              })
              .catch(error => console.error(error));
          },
          (error) => console.error(error),
          {
            enableHighAccuracy: true, 
            timeout: 10000,           
            maximumAge: 0             
          }
        );
        setMensagem('');
      } else if (step === 'enviarLocalizacao' && mensagem === '2') {
       
        setMensagens(prevMensagens => [
          ...prevMensagens,
          { from: 'user', text: mensagem },
          { from: 'bot', text: 'Por favor, digite a localização manualmente (Estado, Cidade, Nome da Rua):' }
        ]);
        setStep('localizacaoManual');
        setMensagem('');
      } else {
        const novaMensagem = mensagem;
        const resposta = getResposta(novaMensagem, step);
        setMensagens(prevMensagens => [...prevMensagens, { from: 'user', text: novaMensagem }]);
          setMensagens(prevMensagens => [...prevMensagens, { from: 'bot', text: resposta }]);
        setMensagem('');
        if (step === 'enviarLocalizacao' && mensagem) {
          setStep('finalizado');
        }
        if (step === 'finalizado') {
          return ''
        }
      }
     
    }
  };



  const getResposta = (mensagem, step) => {
    switch (step) {
      case 'inicio':
        if (mensagem === '/start') {
          setStep('opcoes');
          return 'Muito bem, com qual das opções você deseja seguir:';
        } else {
          return 'Digite /start para começar';
        }
      case 'opcoes':
        if (mensagem === 'Relatar um novo problema') {
          setStep('enviarFoto');
          return 'Muito bem! Vou te auxiliar até completar o cadastro. Envie uma foto do problema que você encontrou\nLembre-se, apenas UMA FOTO';
        } else if (mensagem === 'Consultar atualizações da minha cidade') {
          setStep('consultar');
          return 'Aqui estão as atualizações mais recentes:';
        } else {
          return 'Por favor, digite (Relatar um novo problema) ou (Consultar atualizações da minha cidade).';
        }
      case 'enviar Foto':
        if (selectedFile) {
          setStep('enviarLocalizacao ');
          return 'Agora compartilhe sua localização .';
        } else {
          return 'Por favor, envie uma foto do problema que você encontrou.';
        }
        
      case 'enviarLocalizacao':
        if (mensagem === 'Compartilhar a Localização Atual') {
          handleCompartilharLocalizacao();
          setStep('categoria');
          return '';
        } else if (mensagem === 'Enviar Manualmente') {
          handleEnviarManualmente()
          return '';
        } else {
          if (mensagem.split(',').length === 3) {
            setLocalizacao(mensagem);
            setMensagens(prevMensagens => [...prevMensagens, { from: 'user', text: mensagem }]);
            setStep('categoria');
            categoriasProblema();
            return '';
          } else {
            return 'Por favor, digite exatamente como no Modelo (Estado, Cidade, Nome da Rua):';
          }
        }
        



        case 'categoria':
          if (mensagem) {
            const categoriaSelecionada = mensagem.trim().toLowerCase();
            const categoriasDisponiveis = Object.keys(dicProblemas).map(categoria => categoria.toLowerCase());
            const indexCategoria = categoriasDisponiveis.indexOf(categoriaSelecionada);
            if (indexCategoria !== -1) {
              const categoriaReal = Object.keys(dicProblemas)[indexCategoria];
              const subcategorias = dicProblemas[categoriaReal];
              if (subcategorias && subcategorias.length > 0) {
                setCategoria(categoriaReal);
                setStep('subcategoria');
                setTimeout(() => {
                  setMensagens(prevMensagens => [
                    ...prevMensagens,
                    { from: 'bot',  text: 'Selecione qual o problema no local:\n' , opcoes: subcategorias, isSubcategory: true } ,
                    
                ])
                 }, 500);
                return ''
              } else {
                return 'Não há subcategorias disponíveis para a categoria selecionada.';
              }
            } else {
              for (const categoria in dicProblemas) {
                if (dicProblemas[categoria].includes(categoriaSelecionada)) {
                  setCategoria(categoria);
                  setSubcategoria(categoriaSelecionada);
                  setStep('finalizado');
                 
                  return `Obrigado por relatar o problema! Categoria: ${categoria}, Subcategoria: ${categoriaSelecionada}.`
                  
                  ;
                }
              }
            }
          } else {
            return 'Por favor, selecione uma categoria.';
          }

          break
          
        
          case 'subcategoria':
            if (mensagem) {
              const subcategoriaSelecionada = mensagem; 
              
          
              if (dicProblemas[categoria].includes(subcategoriaSelecionada)) {
                setSubcategoria(subcategoriaSelecionada);
                setStep('finalizado');
                return `Obrigado por relatar o problema! Categoriaa: ${categoria}, Subcategoria: ${subcategoriaSelecionada}.`;
              } else {
                return 'Subcategoria inválida. Por favor, selecione uma subcategoria válida.';
              }
            } else {
              return 'Por favor, selecione uma subcategoria.';
            }

            case 'finalizado':
            return ;
              

      case 'consultar':
        return 'Aqui estão as atualizações mais recentes:';
        case 'localizacaoManual':
      if (mensagem.split(',').length === 3) {
        setLocalizacao(mensagem);
        setTimeout(() => {
          categoriasProblema();
        }, 500);
        setStep('categoria');
        return '';
      } else {
        return 'Por favor, digite exatamente como no Modelo (Estado, Cidade, Nome da Rua):';
      }
          default:
            return 'Desculpe, não entendi sua mensagem.';
        }
      };


      
      const handleButtonClick = (opcao) => {
        const textoBotao = opcao;
        setMensagens(prevMensagens => [...prevMensagens, { from: 'user', text: textoBotao }]);
        setCategoriaSelecionada(opcao);
        setTimeout(() => {
            if (problemas[opcao]) {
                const subcategorias = problemas[opcao];
                setMensagens(prevMensagens => [
                    ...prevMensagens,
                    { from: 'bot', text: 'Selecione qual o problema no local:\n', opcoes: subcategorias, isSubcategory: true },
                ]);
            } else {
                switch (opcao) {
                    case '1':
                        setStep('enviarFoto');
                        setMensagens(prevMensagens => [...prevMensagens, { from: 'bot', text: 'Muito bem! Vou te auxiliar até completar o cadastro. Envie uma foto do problema que você encontrou\nLembre-se, apenas UMA FOTO' }]);
                        break;
                    case '2':
                        setStep('consultar');
                        setMensagens(prevMensagens => [...prevMensagens, { from: 'bot', text: 'Aqui estão as atualizações mais recentes:' }]);
                        break;
                    case '3':
                        setStep('Enviar Manualmente');
                        setMensagens(prevMensagens => [...prevMensagens, { from: 'bot', text: 'Aqui estão as atualizações mais recentes:' }]);
                        break;
                    default:
                        break;
                }
            }
        }, 500);
    };


  const handleRelatarProblema = () => {
    setMensagens(prevMensagens => [...prevMensagens, { from: 'user', text: 'Relatar um novo problema' }]);
    setTimeout(() => {
      setStep('enviarFoto');
      setMensagens(prevMensagens => [...prevMensagens, { from: 'bot', text: ' Muito bem! Vou te auxiliar até completar o cadastro.\n Envie uma foto do problema que você encontrou, Lembre-se apenas UMA FOTO.' }]);
    }, 500 );
  };
  

  const handleGetEstados = useCallback(async () => {
    try {
      const data = await getMessageToAPI(); 
      if (data && Array.isArray(data)) {
        const estadosUnicos = [...new Set(data.map((item) => {
          const localizacao = item.localizacao; 
          if (typeof localizacao === 'string') {
            const estado = localizacao.split(',')[0].trim(); 
            return estado;
          }
          return null; 
        }).filter(Boolean))]; 
        return estadosUnicos;
      } else {
        console.error('Erro ao buscar estados: Dados não encontrados ou não são um array');
        return [];
      }
    } catch (error) {
      console.error('Erro ao buscar estados:', error);
      return [];
    }
  }, []);



  const handleConsultarProblema = useCallback(async () => {
    setMensagens(prevMensagens => [
      ...prevMensagens,
      { from: 'user', text: 'Consultar atualizações da minha cidade' }
    ]);
    setTimeout(async () => {
      
      const estados = await handleGetEstados(); 
      const estadosMensagem = estados.length > 0 
        ? `Aqui estão as atualizações mais recentes:\n`
        : 'Nenhum estado encontrado.';

      setMensagens(prevMensagens => [
        ...prevMensagens,
        { from: 'bot', text: estadosMensagem, estado: estados }
      ]);
    }, 500);
  }, [handleGetEstados]);


  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  

  const handleConfirm = async (file) => {
    setSelectedFile(file);
    setFotoCarregada(true);
    handleClosePopup();
  
    setphtoSelecionada(file);
  
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      
      const response = await fetch('http://localhost:3333/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      if (data.imageUrl) {
        setphtoSelecionada(data.imageUrl); 
        setMensagens((prevMensagens) => [
          ...prevMensagens,
          { from: 'user', text: 'Foto adicionada' },
          { from: 'bot', text: 'Agora compartilhe sua localização:' },
        ]);
      }
    } catch (error) {
      console.error('Erro ao enviar a foto:', error);
    }
  };

  
  const handleKeyDown = (evento) => {
    if (evento.key === 'Enter') {
      
      handleEnviarMensagem ();
    }
  };

  const categoriasProblema = () =>{
  setTimeout(() => {
    const opcoes = topicos;
    setMensagens(prevMensagens => [...prevMensagens, { from: 'bot', text: 'Selecione a categoria do problema:', opcoes: opcoes, isSubcategory: false }]);
    }, 300);
  }
  
  const handleSubcategoriaClick = (subcategoria) => {
    setMensagens(prevMensagens => [
      ...prevMensagens,
      { from: 'user', text: subcategoria || 'Mensagem não definida' }
    ]);
  
    setTimeout(() => {
      setMensagens(prevMensagens => [
        ...prevMensagens,
        {
          from: 'bot',
          text: `Agradecemos sinceramente por relatar o problema relacionado à ${subcategoria}.\nSua contribuição é fundamental para a manutenção da ordem e do bem-estar em nossa cidade.\n\nEstamos comprometidos em ouvir a voz dos cidadãos e valorizar cada feedback recebido. Sua participação ativa ajuda a construir uma comunidade mais forte e engajada.\nSe você estiver interessado em acompanhar todos os cadastros realizados e as discussões em andamento, convidamos você a visitar o nosso Fórum.\nJuntos, podemos continuar a trabalhar em prol de melhorias e soluções para nossa cidade.\n\nAgradecemos mais uma vez pela sua colaboração e esperamos contar com você em futuras interações. Até breve!`,
        }
      ]);
    }, 1000);
  
    setStep('finalizado');
    setSubcategoriaSelecionada(subcategoria);
  };
  

  

  const getSubcategorias = (opcao) => {
    if (problemas[opcao]) {
      return problemas[opcao];
    }
    return [];
  };


  
  const handleCompartilharLocalizacao = () => {
    setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          fetch(`https://eu1.locationiq.com/v1/reverse.php?key=pk.ddacdac981d0c27a478e935f8558a272&lat=${latitude}&lon=${longitude}&format=json`)
            .then(response => response.json())
            .then(data => {
              const localizacao = `${data.address.state}, ${data.address.city}, ${data.address.road}`;
              setLocalizacao(localizacao);
              setMensagens(prevMensagens => [...prevMensagens, { from: 'user', text: localizacao }]);
              
              setStep('categoria');
            })
            .catch(error => console.error(error));
        }, 
        (error) => console.error(error),
        {
          enableHighAccuracy: true, // Habilita a alta precisão
          timeout: 5000,            // Tempo limite de 5 segundos
          maximumAge: 0             // Não usar cache
        }
      );
    }, 500);
       
    setTimeout(() => {
      categoriasProblema()
    },1500)
    
  };
  
  const handleEnviarManualmenteClick = () => {
    handleEnviarManualmente();
  };

  const handleEnviarManualmente = () => {
    setTimeout(() => {
      setMensagens(prevMensagens => [...prevMensagens, { from: 'bot', text: 'Por favor, digite a localização manualmente (Estado , Cidade, Nome da Rua):' }]);
      setStep('localizacaoManual');
    }, 500);
  };




  const handleGetCidadesPorEstado = async (estadoSelecionado) => {
    try {
      const data = await getMessageToAPI(); 
      if (data && Array.isArray(data)) {
        const cidades = data
          .filter((item) => {
            const localizacao = item.localizacao; 
            if (typeof localizacao === 'string') {
              const estado = localizacao.split(',')[0].trim(); 
              return estado === estadoSelecionado; 
            }
            return false; 
          })
          .map((item) => {
            const localizacao = item.localizacao;
            return localizacao.split(',')[1].trim();
          });
  
        // Remove duplicatas
        const cidadesUnicas = [...new Set(cidades)];
        console.log('Cidades únicas:', cidadesUnicas); 
        return cidadesUnicas;
      } else {
        console.error('Erro ao buscar cidades: Dados não encontrados ou não são um array');
        return [];
      }
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
      return [];
    }
  };

  const handleGetProblemasPorCidade = async (cidadeSelecionada) => {
    try {
      const data = await getMessageToAPI(); 
      console.log('Dados recebidos da API:', data); 
  
      
      if (data && Array.isArray(data)) {
        const problemas = data.filter((item) => {
          const localizacao = item.localizacao; 
          if (typeof localizacao === 'string') {
            const cidade = localizacao.split(',')[1].trim(); 
            return cidade === cidadeSelecionada; 
          }
          return false; 
        });
  
        console.log('Problemas encontrados:', problemas); 
        return problemas;
      } else {
        console.error('Erro ao buscar problemas: Dados não encontrados ou não são um array');
        return [];
      }
    } catch (error) {
      console.error('Erro ao buscar problemas:', error);
      return [];
    }
  };



  const handleEstadoClick =  (estado) => {
    setMensagens(prevMensagens => [...prevMensagens, { from: 'user', text: estado }]);
    
    handleselCidade(estado)

    
  };

  
  const handleselCidade = async (estado) => {
    const estadoSel = estado;
  
    // Aguarde a execução da função assíncrona
    const cidadesSel = await handleGetCidadesPorEstado(estadoSel);
    
  
    setMensagens(prevMensagens => [...prevMensagens, { from: 'bot', text: 'Cidades do estado selecionado:', cidades: cidadesSel }]);

    
  };


  const handleEstadoClickCidade = (cidade) => {
    const cidadeSel = cidade
    // Adiciona a mensagem ao estado para exibir ao lado do usuário
    setMensagens(prevMensagens => [
      ...prevMensagens,
      { from: 'user', text: cidadeSel }
    ]);
    viewProblem(cidadeSel)
    
    }

    const viewProblem = async (cidade) => {
      const cidadeProm = cidade;
      
     
      const problemasCidade = await handleGetProblemasPorCidade(cidadeProm);
      
     
      if (problemasCidade.length > 0) {
       
        const problemasText = problemasCidade.map(problema => {
          const locationArray = problema.localizacao.split(','); 
          const rua = locationArray[locationArray.length - 1].trim(); 
    
          return `Problema de ${problema.subcategoria} no local ${rua}`; 
        }).join('\n'); 
    
        
        setMensagens(prevMensagens => [
          ...prevMensagens,
          { from: 'bot', text: `Aqui estão os problemas encontrados na cidade ${cidadeProm}:\n\n` + problemasText }
        ]);
      } else {
        
        setMensagens(prevMensagens => [
          ...prevMensagens,
          { from: 'bot', text: 'Nenhum problema encontrado para esta cidade.' }
        ]);
      }
    };

    
    const getUltimaMensagemDoUsuario = useCallback(() => {
      const mensagensUsuario = mensagens.filter(mensagem => mensagem.from === 'user');
      const ultimaMensagem = mensagensUsuario[mensagensUsuario.length - 1];
      return ultimaMensagem ? ultimaMensagem.text : null;
    }, [mensagens]);

    const handleFinalizado = useCallback(async (dados, ultimaMensagem) => {
       const ultimaMensagemUsuario = ultimaMensagem
      if (!dados.foto || !dados.localizacao || !dados.categoria || !dados.subcategoria) {
        
        return;
      }
  
      try {
        await sendMessageToAPI(dados);
        // console.log("Dados enviados com sucesso:", dados);
  
        // Limpar estados após o envio
        setLocalizacao(null);
        setCategoriaSelecionada(null);
        setSubcategoriaSelecionada(null);
        setphtoSelecionada(null);

        console.log('aqui esta a mensagem do usuario', ultimaMensagemUsuario)

  
      } catch (error) {
        console.error("Erro ao enviar os dados:", error);
      }
    }, []);

   
    


  useEffect (() => {
    // console.log("mensagens:", mensagens);

    if (mensagemRef.current) {
      digitacao(mensagemRef.current);
    }


    const lastTypingRef = document.querySelector('.last-bot-message');
    if (lastTypingRef) {
      digitacao(lastTypingRef);
    }
    const dados = {
      // 
      foto: phtoSelecionada,
      localizacao: localizacao,
      categoria: categoriaSelecionada,
      subcategoria: subcategoriaSelecionada
    };
    
  // Chama a função para obter a última mensagem
  const ultimaMensagem = getUltimaMensagemDoUsuario();
  if (ultimaMensagem) {
      // console.log("Última mensagem do usuário:", ultimaMensagem);
  }

  handleFinalizado(dados,ultimaMensagem);
    
  }, [mensagens, categoriaSelecionada, localizacao, subcategoriaSelecionada,phtoSelecionada, getUltimaMensagemDoUsuario, handleFinalizado]);

  return {
    mensagens,
    mensagem,
    setMensagem,
    handleEnviarMensagem,
    showPopup,
    handleOpenPopup,
    handleClosePopup,
    handleConfirm,
    handleKeyDown,
    selectedFile,
    fotoCarregada,
    setStep,
    localizacao,
    getSubcategorias,
    categoria,
    subcategoria,
    handleButtonClick,
    handleRelatarProblema,
    handleConsultarProblema,
    handleCompartilharLocalizacao,
    handleEnviarManualmenteClick,
    categoriaSelecionada,
    setMensagens,
    phtoSelecionada,
    handleEnviarManualmente, 
    handleSubcategoriaClick ,
    handleFinalizado,
    handleGetEstados,
    handleEstadoClick,
    handleselCidade,
    handleEstadoClickCidade,
    handleGetProblemasPorCidade,
    mensagemRef
    
  };
};

export default useChatLogic;