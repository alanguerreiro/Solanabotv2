async function executarSwap(tokenAddress) {
  try {
    const quoteRes = await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${tokenAddress}&amount=5000000&slippageBps=500`);
    const quote = await quoteRes.json();
    const route = quote[0]; // 👈 Adicione essa linha!

    const swapRes = await fetch("https://quote-api.jup.ag/v6/swap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        route: route,
        userPublicKey: window.solana.publicKey.toString(),
        wrapUnwrapSOL: true
      })
    });

    const result = await swapRes.json();
    console.log("Swap executado:", result);
    alert("Swap executado com sucesso!");
  } catch (err) {
    console.error("Erro ao executar swap:", err);
    alert("Erro ao executar o swap.");
  }
}
