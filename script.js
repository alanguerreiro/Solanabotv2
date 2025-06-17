const { handleToken, monitorProfits } = require('./decision.js');
const buscarTokensPumpFun = require('./scanner.js');

let isBotRunning = false;
let intervalId = null;

function startBot() {
  isBotRunning = true;
  document.getElementById("botStatus").innerText = "Executando";
  document.getElementById("botStatus").style.color = "lime";
  logToConsole("✅ Bot iniciado...");

  intervalId = setInterval(async () => {
    try {
      logToConsole("⏳ Aguardando inicialização do bot...");
      const tokens = await buscarTokensPumpFun();

      document.getElementById("tokenCount").innerText = tokens.length;

      for (const token of tokens) {
        await handleToken(token);
      }

      await monitorProfits();

    } catch (error) {
      logToConsole(`❌ Erro no loop do bot: ${error.message}`);
    }
  }, 15000); // a cada 15 segundos
}

function pauseBot() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    isBotRunning = false;
    document.getElementById("botStatus").innerText = "Parado";
    document.getElementById("botStatus").style.color = "orange";
    logToConsole("⏸️ Bot pausado.");
  }
}

function resetBot() {
  pauseBot();
  document.getElementById("walletAddress").innerText = "---";
  document.getElementById("tokenCount").innerText = "0";
  logToConsole("🔄 Bot resetado.");
}

function logToConsole(message) {
  const consoleElement = document.getElementById("console");
  const timestamp = new Date().toLocaleTimeString();
  consoleElement.innerHTML += `<div>[${timestamp}] ${message}</div>`;
}
