
async function connectWallet() {
  if (window.solana && window.solana.isPhantom) {
    try {
      const resp = await window.solana.connect();
      console.log("Conectado à Phantom:", resp.publicKey.toString());
      alert("Wallet conectada: " + resp.publicKey.toString());
    } catch (err) {
      console.error("Erro ao conectar:", err);
    }
  } else {
    alert("Phantom Wallet não encontrada. Instale no navegador.");
  }
}

// Placeholder para futura lógica de swap via Jupiter + scanner Pump.fun
