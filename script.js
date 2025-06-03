// Variáveis globais
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

// Conectar à carteira Phantom
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
    iniciarBot();
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
  atualizaStatus("🟢 Executando");
  log("🚀 Bot iniciado.");
  executarBot(); // executa de imediato
  loopInterval = setInterval(executarBot, 60000); // a cada 60s
}

// Função principal do bot com scanner, decisão e swap
async function executarBot() {
  try {
    const tokens = await buscarTokensPumpFun(); // scanner.js
    log("🔍 Tokens encontrados: " + tokens.length);

    for (const token of tokens) {
      const decision = decidirCompraVenda(token); // decision.js
      log("🧠 Token = " + token.name + " | Decisão: " + decision);

      if (decision === "BUY") {
        log("🟢 Comprando 5$ de " + token.name);
        await executarSwap(token.tokenAddress, window.solana); // swap.js
      }

      if (decision === "SELL") {
        log("🔴 Vendendo " + token.name + " com +100% de lucro");
        // lógica futura de venda
      }

      if (decision === "HOLD") {
        log("⏳ Aguardando possível 5x de " + token.name);
      }
    }
  } catch (err) {
    console.error("❌ Erro durante execução do bot:", err);
    log("❌ Erro durante execução do bot: " + err.message);
  }
}
