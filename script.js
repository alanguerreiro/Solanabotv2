let botAtivo = false;
let walletPublicKey = null;

async function connectWallet() {
  try {
    const provider = window.phantom?.solana;
    if (!provider) {
      logConsole('Phantom Wallet não encontrada!');
      return;
    }

    const resp = await provider.connect();
    walletPublicKey = resp.publicKey.toString();
    document.getElementById('wallet').innerText = `Carteira conectada: ${walletPublicKey}`;
    logConsole(`Carteira conectada com sucesso: ${walletPublicKey}`);
  } catch (error) {
    logConsole(`Erro ao conectar carteira: ${error.message}`);
  }
}

function iniciarBot() {
  if (!walletPublicKey) {
    logConsole('Conecte a Phantom Wallet antes de iniciar o bot.');
    return;
  }

  botAtivo = true;
  document.getElementById('botStatus').innerText = 'Executando';
  logConsole('Bot iniciado.');
  executarScannerContinuo();
}

function pausarBot() {
  botAtivo = false;
  document.getElementById('botStatus').innerText = 'Pausado';
  logConsole('Bot pausado.');
}

function retomarBot() {
  if (!walletPublicKey) {
    logConsole('Conecte a Phantom Wallet antes de retomar o bot.');
    return;
  }

  botAtivo = true;
  document.getElementById('botStatus').innerText = 'Executando';
  logConsole('Bot retomado.');
  executarScannerContinuo();
}

function logConsole(mensagem) {
  const consoleDiv = document.getElementById('console');
  const linha = document.createElement('div');
  linha.innerText = mensagem;
  consoleDiv.appendChild(linha);
  consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

async function executarScannerContinuo() {
  while (botAtivo) {
    try {
      const tokens = await buscarTokensPumpFun();
      logConsole(`Tokens encontrados: ${tokens.length}`);

      for (const token of tokens) {
        if (!botAtivo) break;

        const decisao = await avaliarToken(token);
        if (decisao === 'comprar') {
          const resultado = await realizarSwap(token);
          logConsole(`Compra realizada: ${resultado}`);
        }
      }
    } catch (erro) {
      logConsole(`Erro durante execução do bot: ${erro.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 10000)); // 10 segundos
  }
}
