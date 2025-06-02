// swap.js - execução real via Phantom com Jupiter Swap SDK
async function executarSwap(tokenAddress) {
  try {
    const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${tokenAddress}&amount=5000000&slippage=5`;
    const quoteRes = await fetch(quoteUrl);
    const quote = await quoteRes.json();

    const swapUrl = 'https://quote-api.jup.ag/v6/swap';
    const wallet = window.solana;

    if (!wallet || !wallet.isConnected) {
      alert("Carteira não conectada");
      return;
    }

    const swapReq = {
      route: quote.data[0], // Melhor rota do Jupiter
      userPublicKey: wallet.publicKey.toString(),
      wrapUnwrapSOL: true,
      feeAccount: null,
    };

    const swapRes = await fetch(swapUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(swapReq),
    });

    const swapTx = await swapRes.json();
    const tx = swapTx.swapTransaction;

    // Decode da transação em base64
    const decodedTx = new Uint8Array(atob(tx).split("").map(c => c.charCodeAt(0)));

    const signedTx = await wallet.signAndSendTransaction(decodedTx);
    console.log("✅ Swap executado com sucesso!", signedTx);
  } catch (err) {
    console.error("❌ ERRO na execução real do swap:", err);
    alert("❌ ERRO na execução real do swap.");
  }
}
