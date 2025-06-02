let botAtivo = false;
let botIntervalo = null;
let walletAddress = null;

function log(texto) {
  const el = document.getElementById("console");
  const linha = document.createElement("div");
  linha.textContent = texto;
  el.appendChild(linha);
  el.scrollTop = el.scrollHeight;
}

function atualizarStatus(status) {
  document.getElementById("botStatus").textContent = status;
}

async function connectWallet() {
  try {
    const provider = window.solana;
    if (!provider || !provider.isPhantom) {
      alert("Phantom Wallet não encontrada!");
      return;
    }

    const resp = await provider.connect();
    walletAddress = resp.publicKey.toString();
    log("✅ Carteira conectada: " + walletAddress);
    atualizarStatus("Conectado");
    iniciarBot();
  } catch (err) {
    console.error("Erro ao conectar:", err);
    alert("Erro ao conectar com a carteira.");
  }
}

function iniciarBot() {
  if (botIntervalo) clearInterval(botIntervalo);
  botAtivo = true;
  atualizarStatus("Ativo");
  log("🚀 Bot iniciado...");

  botIntervalo = setInterval(() => {
    executarBot(walletAddress);
  }, 60000); // a cada 60 segundos
}

function pausarBot() {
  botAtivo = false;
  clearInterval(botIntervalo);
  atualizarStatus("Pausado");
  log("⏸️ Bot pausado.");
}

function retomarBot() {
  if (!walletAddress) {
    alert("Conecte a carteira primeiro.");
    return;
  }
  iniciarBot();
}

// Função principal do bot com lógica de scanner, decisão e swap
async function executarBot(wallet) {
  try {
    const tokens = await buscarTokensPumpFun(); // scanner.js
    log("🔍 Tokens encontrados: " + tokens.length);

    for (const token of tokens) {
      const decisao = decidirCompraVenda(token); // decision.js
      log("🤖 Token: " + token.name + " | Decisão: " + decisao);

      if (decisao === "BUY") {
        log("💸 Comprando $5 de " + token.name);
        await executarSwap(token.address, wallet); // swap.js
      } else if (decisao === "SELL") {
        log("💰 Vendendo " + token.name + " com +100% de lucro");
      } else if (decisao === "HOLD") {
        log("⏳ Aguardando possível 5x: " + token.name);
      }
    }
  } catch (err) {
    log("❌ Erro durante execução: " + err.message);
  }
}
    }
  }, 60000); // 60 segundos
}
