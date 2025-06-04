let botRunning = false;
let intervalId = null;

async function connectWallet() {
  try {
    const provider = window.phantom?.solana;
    if (!provider || !provider.isPhantom) throw new Error("Phantom não encontrado");

    const resp = await provider.connect();
    const walletAddress = resp.publicKey.toString();

    document.getElementById("status").innerText = "🟢 Carteira conectada: " + walletAddress;
    document.getElementById("botStatus").innerText = "Parado";
    logConsole("✅ Carteira conectada: " + walletAddress);

    window.walletAddress = walletAddress;
  } catch (error) {
    logConsole("❌ Erro ao conectar carteira: " + error.message);
  }
}

function startBot() {
  if (botRunning) return;
  botRunning = true;
  document.getElementById("botStatus").innerText = "Executando";
  logConsole("✅ Bot iniciado.");

  intervalId = setInterval(async () => {
    try {
      const tokens = await buscarTokensPumpFun();
      logConsole("🔍 Tokens encontrados: " + tokens.length);
      for (const token of tokens) {
        const decision = await decidirCompra(token);
        if (decision.comprar) {
          logConsole("💸 Comprando token: " + token.symbol);
          await executarSwap(token);
        }
      }
    } catch (err) {
      logConsole("❌ Erro no bot: " + err.message);
    }
  }, 15000); // a cada 15 segundos
}

function pauseBot() {
  if (!botRunning) return;
  clearInterval(intervalId);
  botRunning = false;
  document.getElementById("botStatus").innerText = "Pausado";
  logConsole("⏸️ Bot pausado.");
}

function resumeBot() {
  if (!botRunning) {
    startBot();
  }
}

function logConsole(msg) {
  const consoleBox = document.getElementById("console");
  const line = document.createElement("div");
  line.innerText = msg;
  consoleBox.appendChild(line);
  consoleBox.scrollTop = consoleBox.scrollHeight;
}
