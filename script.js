// Conectar à Phantom Wallet
async function connectWallet() {
  try {
    const provider = window.solana;
    if (!provider || !provider.isPhantom) {
      alert("Phantom Wallet não encontrada!");
      return;
    }

    const resp = await provider.connect();
    console.log("Conectado:", resp.publicKey.toString());
    alert("Carteira conectada: " + resp.publicKey.toString());

    // Inicia o bot após conectar
    iniciarBot(resp.publicKey.toString());

  } catch (err) {
    console.error("Erro ao conectar:", err);
    alert("Erro ao conectar com a carteira.");
  }
}

// Função principal do bot
async function iniciarBot(walletAddress) {
  const tokens = await buscarTokensPumpFun(); // scanner.js
  console.log("Tokens encontrados:", tokens);

  for (const token of tokens) {
    const decisao = decidirCompraVenda(token); // decision.js
    console.log(`Token: ${token.name} | Decisão: ${decisao}`);

    if (decisao === "BUY") {
      console.log(`Comprando $5 de ${token.name}`);
      executarSwap(token.address, walletAddress); // swap.js
    }

    if (decisao === "SELL") {
      console.log(`Vendendo ${token.name} com +100% de lucro`);
      // Aqui futuramente: executarSwap para venda
    }

    if (decisao === "HOLD") {
      console.log(`Segurando ${token.name}`);
    }
  }
}
