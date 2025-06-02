// Conecta à Phantom Wallet
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

    // Após conectar, inicia o scanner
    iniciarBot();

  } catch (err) {
    console.error("Erro ao conectar:", err);
    alert("Erro ao conectar com a carteira.");
  }
}

// Função principal do bot
async function iniciarBot() {
  const tokens = await buscarTokensPumpFun(); // do scanner.js
  console.log("Tokens encontrados:", tokens);

  for (const token of tokens) {
    const decisao = decidirSwap(token); // do decision.js

    console.log(`Token: ${token.name} | Decisão: ${decisao}`);

    if (decisao === "BUY") {
      console.log(`Executando compra de $5 em ${token.name} 🚀`);
      // Aqui entraremos com a função de swap real
    }

    if (decisao === "SELL") {
      console.log(`Vendendo ${token.name} com +100% de lucro 🎯`);
      // Em breve: integração com função de venda
    }

    if (decisao === "STOP") {
      console.log(`Stop Loss ativado para ${token.name} ❌`);
    }
  }
}
