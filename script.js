let wallet = null;
let isRunning = false;

async function connectWallet() {
  logConsole("🟡 Tentando conectar à Phantom Wallet...");

  try {
    const provider = window.solana;
    if (!provider || !provider.isPhantom) {
      throw new Error("Phantom Wallet não encontrada. Instale a extensão.");
    }

    const resp = await provider.connect();
    wallet = provider;

    document.getElementById("walletAddress").innerText = resp.publicKey.toString();
    logConsole("🟢 Carteira conectada: " + resp.publicKey.toString());

    startBot();
  } catch (err) {
    logConsole("❌ Erro ao conectar carteira: " + err.message);
  }
}

function startBot() {
  if (!wallet) {
    logConsole("❌ Conecte uma carteira primeiro.");
    return;
  }

  isRunning = true;
  document.getElementById("botStatus").innerText = "Executando";
  logConsole("🤖 Bot iniciado...");

  runScanner();
}

function pauseBot() {
  isRunning = false;
  document.getElementById("botStatus").innerText = "Pausado";
  logConsole("⏸️ Bot pausado.");
}

function resumeBot() {
  if (!wallet) {
    logConsole("❌ Conecte uma carteira primeiro.");
    return;
  }

  isRunning = true;
  document.getElementById("botStatus").innerText = "Executando";
  logConsole("▶️ Bot retomado.");
  runScanner();
}

async function runScanner() {
  if (!isRunning) return;

  try {
    logConsole("🔍 Procurando tokens...");
    const tokens = await buscarTokensPumpFun();

    logConsole("📦 Tokens encontrados: " + tokens.length);
    document.getElementById("tokensFound").innerText = tokens.length;

    for (const token of tokens) {
      if (!isRunning) break;

      logConsole(`⚙️ Analisando ${token.symbol} (${token.address})`);
      const shouldBuy = await shouldBuyToken(token);
      if (shouldBuy) {
        logConsole(`💰 Decisão: COMPRAR ${token.symbol}`);
        await executeSwap(token);
      } else {
        logConsole(`❌ Decisão: Ignorar ${token.symbol}`);
      }
    }
  } catch (err) {
    logConsole("❌ Erro no scanner: " + err.message);
  }

  setTimeout(runScanner, 10000); // Repetição a cada 10 segundos
}

function logConsole(msg) {
  const consoleEl = document.getElementById("console");
  if (!consoleEl) return;
  const time = new Date().toLocaleTimeString();
  consoleEl.innerText += `[${time}] ${msg}\n`;
  consoleEl.scrollTop = consoleEl.scrollHeight;
}
