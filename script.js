async function connectWallet() {
  try {
    const provider = window.solana;
    if (!provider || !provider.isPhantom) {
      alert("Phantom Wallet não encontrada!");
      return;
    }

    const resp = await provider.connect();
    console.log("Conectado:", resp.publicKey.toString());
    alert("Wallet conectada: " + resp.publicKey.toString());
  } catch (err) {
    console.error("Erro ao conectar:", err);
    alert("Erro ao conectar com a carteira.");
  }
}
