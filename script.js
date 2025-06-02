// Conectar à Phantom Wallet
async function connectWallet() {
  try {
    const provider = window.solana;
    if (!provider || !provider.isPhantom) {
      alert("Phantom Wallet não encontrada!");
      return;
    }

    const resp = await provider.connect();
    console.log("✅ Carteira conectada:", resp.publicKey.toString());
    alert("Carteira conectada: " + resp.publicKey.toString());

    // Inicia o bot com o loop automático
    iniciarBot(resp.publicKey.toString());
  } catch (err) {
    console.error("❌ Erro ao conectar:", err);
    alert("Erro ao conectar com a carteira.");
  }
}

// Função principal do bot com loop a cada 60s
async function iniciarBot(walletAddress) {
  console.log("🚀 Bot iniciado...");
  setInterval(async () => {
    const tokens = await buscarTokensPumpFun(); // scanner.js
    console.log(`🔍 Tokens encontrados: ${tokens.length}`);

    for (const token of tokens) {
      const decisao = decidirCompraVenda(token); // decision.js
      console.log(`📈 Token: ${token.name} | Decisão: ${decisao}`);

      if (decisao === "BUY") {
        console.log(`🟢 Comprando $5 de ${token.name}`);
        executarSwap(token.address, walletAddress); // swap.js
      }

      if (decisao === "SELL") {
        console.log(`🔴 Vendendo ${token.name} com +100% de lucro`);
        // lógica futura de venda
      }

      if (decisao === "HOLD") {
        console.log(`⏳ Aguardando possível 5x de ${token.name}`);
      }
    }
  }, 60000); // 60s por loop
}
