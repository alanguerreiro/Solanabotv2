let intervalScanner;
let tokensEncontrados = [];

async function buscarTokensPumpFun() {
  try {
    const response = await fetch('https://pump.fun/api/trending');
    const data = await response.json();

    if (!data || !data.length) {
      logConsole('Nenhum token novo encontrado.');
      return;
    }

    const novosTokens = data
      .filter(token => !tokensEncontrados.includes(token.tokenAddress))
      .slice(0, 10); // Pega os 10 primeiros novos tokens

    if (novosTokens.length === 0) {
      logConsole('Nenhum token novo desde a última verificação.');
      return;
    }

    for (const token of novosTokens) {
      tokensEncontrados.push(token.tokenAddress);
      logConsole(`🔍 Novo token encontrado: ${token.tokenSymbol} (${token.tokenAddress})`);
      avaliarToken(token.tokenAddress); // envia para decision.js
    }

    document.getElementById('tokenCount').innerText = tokensEncontrados.length;

  } catch (error) {
    logConsole('Erro ao buscar tokens no Pump.fun: ' + error.message);
  }
}

function iniciarScannerPump() {
  tokensEncontrados = [];
  intervalScanner = setInterval(buscarTokensPumpFun, 15000); // a cada 15s
  logConsole('🔄 Scanner iniciado com Pump.fun...');
}

function pararScanner() {
  clearInterval(intervalScanner);
  logConsole('⛔ Scanner parado.');
}
