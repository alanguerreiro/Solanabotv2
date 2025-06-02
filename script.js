let walletAddress = null;
let botAtivo = false;
let loopInterval = null;

// Função para log visual no console da interface
function log(msg) {
  const el = document.getElementById("console");
  const linha = document.createElement("div");
  linha.textContent = msg;
  el.appendChild(linha);
  el.scrollTop = el.scrollHeight;
}

// Atualiza o texto do status do bot
function atualizaStatus(texto) {
  document.getElementById("botStatus").textContent = texto;
}

// Conectar a carteira Phantom
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

    iniciarBot(); // já inicia o bot após conectar
  } catch (err) {
    console.error("❌ Erro ao conectar:", err);
    alert("Erro ao conectar com a carteira.");
  }
}

// Pausar o bot
function pausarBot() {
  botAtivo = false;
  clearInterval(loopInterval);
  atualizaStatus("⏸️ Pausado");
  log("⏸️ Bot pausado.");
}

// Retomar o bot
function retomarBot() {
  if (!walletAddress) {
    alert("Conecte a carteira primeiro.");
    return;
  }
  iniciarBot();
}

// Iniciar o bot (com loop automático)
function iniciarBot() {
  if (botAtivo) return;
  botAtivo = true;
  atualizaStatus("✅ Executando");
  executarBot(); // executa de imediato
  loopInterval = setInterval(executarBot, 60000); // a cada 60s
}

// Função principal do bot com scanner, decisão e swap
async function executarBot() {
  try {
    const tokens = await buscarTokensPumpFun(); // scanner.js
    log(`🔍 Tokens encontrados: ${tokens.length}`);

    for (const token of tokens) {
      const decisao = decidirCompraVenda(token); // decision.js
      log(`📊 Token = ${token.name} | Decisão: ${decisao}`);

      if (decisao === "BUY") {
        log(`🟢 Comprando $5 de ${token.name}`);
        await executarSwap(token.address, walletAddress); // swap.js
      }

      if (decisao === "SELL") {
        log(`🔴 Vendendo ${token.name} com +100% de lucro`);
        // lógica futura de venda
      }

      if (decisao === "HOLD") {
        log(`🟡 Aguardando possível 5x de ${token.name}`);
      }
    }
  } catch (err) {
    console.error("❌ Erro durante execução do bot:", err);
    log("❌ Erro durante execução do bot: " + err.message);
  }
}
