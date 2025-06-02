async function executarSwap(tokenAddress, wallet) {
  try {
    const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${tokenAddress}&amount=5000000&slippage=5`;
    const quoteRes = await fetch(quoteUrl);
    const quote = await quoteRes.json();

    const swapUrl = "https://quote-api.jup.ag/v6/swap";
    const swapReq = {
      route: quote.data[0],
      userPublicKey: wallet.publicKey.toString(),
      wrapUnwrapSOL: true,
      feeAccount: null
    };

    const swapRes = await fetch(swapUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(swapReq)
    });

    const swapTx = await swapRes.json();
    const tx = swapTx.swapTransaction;
    const decodedTx = new Uint8Array(atob(tx).split("").map((c) => c.charCodeAt(0)));

    const signedTx = await wallet.signAndSendTransaction(decodedTx);
    log(`✅ Swap executado com sucesso!`, signedTx);
  } catch (err) {
    console.error("❌ Erro no swap:", err);
    alert("❌ Erro no swap");
  }
}
