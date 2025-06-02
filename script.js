async function connectWallet() {
  try {
    const provider = window.solana;
    if (!provider || !provider.isPhantom) {
      alert("Phantom Wallet não encontrada!");
      return;
    }

    const resp = await provider.connect();
    log("Carteira conectada: " + resp.publicKey.toString());

    // Inicia o bot com loop automático
    iniciarBot(resp.publicKey.toString());
  } catch (err) {
    console.error("Erro ao conectar:", err);
    alert("Erro ao conectar com a carteira.");
  }
}

// Função para exibir logs visuais
function log(msg) {
  const el = document.getElementById("console");
  const line = document.createElement("div");
  line.textContent = "> " + msg;
  el.appendChild(line);
  el.scrollTop = el.scrollHeight;
}

// Função principal com loop a cada 60s
async function iniciarBot(walletAddress) {
  setInterval(async () => {
    try {
      const tokens = await buscarTokensPumpFun(); // scanner.js
      log(`Tokens encontrados: ${tokens.length}`);

      for (const token of tokens) {
        const decision = decidirCompraVenda(token); // decision.js
        log(`Token: ${token.name} | Decisão: ${decision}`);

        if (decision === "BUY") {
          log(`🟢 Comprando $5 de ${token.name}`);
          await executarSwap(token.address, walletAddress); // swap.js
        }

        if (decision === "SELL") {
          log(`🔴 Vendendo ${token.name} com +100% de lucro`);
          // lógica futura de venda
        }

        if (decision === "HOLD") {
          log(`🟡 Aguardando possível 5x de ${token.name}`);
        }
      }
    } catch (err) {
      log("Erro durante execução do bot: " + err.message);
    }
  }, 60000); // 60 segundos
}
