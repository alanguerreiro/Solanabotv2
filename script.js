let running = false;

function logConsole(message) {
  const consoleDiv = document.getElementById("console");
  consoleDiv.innerHTML += `> ${message}<br>`;
  consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

async function connectWallet() {
  try {
    const provider = window.solana;
    if (!provider || !provider.isPhantom) {
      alert("Phantom Wallet não encontrada!");
      return;
    }

    const resp = await provider.connect();
    window.connectedWallet = resp.publicKey.toString();
    logConsole(`💼 Carteira conectada: ${window.connectedWallet}`);
    document.getElementById("botStatus").innerText = "Conectado (Parado)";
  } catch (err) {
    logConsole("❌ Erro ao conectar carteira.");
  }
}

function pausarBot() {
  running = false;
  document.getElementById("botStatus").innerText = "Pausado";
  logConsole("⏸ Bot pausado.");
}

function retomarBot() {
  if (!window.connectedWallet) {
    alert("Conecte a Phantom Wallet primeiro.");
    return;
  }
  running = true;
  document.getElementById("botStatus").innerText = "Rodando";
  logConsole("🔁 Bot retomado.");
  iniciarLoop();
}

async function iniciarLoop() {
  while (running) {
    try {
      const tokens = await buscarTokens();
      logConsole(`🔎 Tokens encontrados: ${tokens.length}`);

      for (let token of tokens) {
        const decisao = await analisarToken(token);
        if (decisao === "COMPRAR") {
          logConsole(`🚀 Comprando: ${token.symbol}`);
          await realizarSwap(token);
        } else {
          logConsole(`❌ Ignorado: ${token.symbol}`);
        }
      }
    } catch (err) {
      logConsole(`⚠️ Erro: ${err.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 15000)); // espera 15s
  }
}
