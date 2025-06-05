let walletAddress = null;
let botRunning = false;
let intervalId = null;

async function connectPhantom() {
  try {
    logToConsole("🟡 Tentando conectar à Phantom Wallet...");
    const provider = window.solana;
    if (!provider || !provider.isPhantom) {
      alert("Phantom Wallet não encontrada. Instale a extensão.");
      return;
    }

    const resp = await provider.connect();
    walletAddress = resp.publicKey.toString();

    document.getElementById("walletAddress").innerText = walletAddress;
    document.getElementById("walletStatus").innerText = "🟢 Conectada";
    logToConsole("✅ Carteira conectada: " + walletAddress);

    startBot();
  } catch (err) {
    logToConsole("❌ Erro ao conectar carteira: " + err.message);
  }
}

function startBot() {
  botRunning = true;
  document.getElementById("botStatus").innerText = "🟢 Executando";
  document.getElementById("botStarted").innerText = "🟢 Bot iniciado.";
  logToConsole("🤖 Bot iniciado.");

  intervalId = setInterval(async () => {
    try {
      logToConsole("⏳ Aguardando tokens...");
      const tokens = await buscarTokensPumpFun(); // <- scanner.js
      document.getElementById("tokenCount").innerText = tokens.length;
      logToConsole("🔍 Tokens encontrados: " + tokens.length);

      for (const token of tokens) {
        logToConsole("📈 Analisando token: " + token.symbol);
        const decisao = await decidirCompra(token); // <- decision.js

        if (decisao.comprar) {
          logToConsole("💰 Comprando token: " + token.symbol);
          await realizarSwap(token); // <- swap.js
        } else {
          logToConsole("⏭️ Pulando token: " + token.symbol);
        }
      }
    } catch (err) {
      logToConsole("❌ Erro no loop do bot: " + err.message);
    }
  }, 10000); // Executa a cada 10 segundos
}

function pauseBot() {
  if (intervalId) clearInterval(intervalId);
  botRunning = false;
  document.getElementById("botStatus").innerText = "🟡 Pausado";
  logToConsole("⏸️ Bot pausado.");
}

function resumeBot() {
  if (!botRunning) {
    startBot();
  }
}

function logToConsole(msg) {
  const logDiv = document.getElementById("logConsole");
  const time = new Date().toLocaleTimeString();
  const p = document.createElement("p");
  p.innerText = `[${time}] ${msg}`;
  logDiv.appendChild(p);
  logDiv.scrollTop = logDiv.scrollHeight;
}
