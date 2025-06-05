// scanner.js

let running = true;

async function buscarTokensPumpFun() {
  if (!running) return;

  try {
    const response = await fetch("https://pump.fun/api/trending");
    const tokens = await response.json();

    if (tokens && Array.isArray(tokens)) {
      for (const token of tokens) {
        const tokenData = {
          address: token?.mint,
          name: token?.name,
          symbol: token?.symbol,
          volume: token?.volume,
          price: token?.price,
        };

        logConsole(`🔍 Token detectado: ${tokenData.name} (${tokenData.symbol}) - $${tokenData.price}`);
        window.processarToken(tokenData); // Envia para decision.js
      }
    } else {
      logConsole("⚠️ Nenhum token válido retornado do Pump.fun.");
    }
  } catch (error) {
    logConsole(`❌ Erro ao buscar tokens do Pump.fun: ${error.message}`);
  }

  setTimeout(buscarTokensPumpFun, 60000); // Repetir a cada 60 segundos
}

function iniciarScanner() {
  running = true;
  logConsole("🚀 Scanner iniciado...");
  buscarTokensPumpFun();
}

function pararScanner() {
  running = false;
  logConsole("⏹️ Scanner pausado.");
}
