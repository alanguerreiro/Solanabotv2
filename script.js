// script.js (completo e atualizado)

let walletPublicKey = null;
let botRunning = false;
let foundTokens = [];

async function connectWallet() {
  try {
    const provider = window.phantom?.solana;
    if (!provider) {
      alert("Phantom Wallet não encontrada!");
      return;
    }

    const resp = await provider.connect();
    walletPublicKey = resp.publicKey.toString();

    document.getElementById("status").innerHTML = `
      ✅ Carteira conectada: ${walletPublicKey}<br>
      ✅ Bot iniciado.
    `;

    botRunning = true;
    document.getElementById("botStatus").innerText = "Executando";
    startBotLoop();
  } catch (err) {
    console.error("Erro ao conectar carteira:", err);
  }
}

function pauseBot() {
  botRunning = false;
  document.getElementById("botStatus").innerText = "Pausado";
}

function resumeBot() {
  if (!walletPublicKey) {
    alert("Conecte sua carteira Phantom antes.");
    return;
  }
  botRunning = true;
  document.getElementById("botStatus").innerText = "Executando";
  startBotLoop();
}

async function startBotLoop() {
  while (botRunning) {
    try {
      document.getElementById("console").innerText = "🔎 Buscando tokens...";

      const tokens = await buscarTokensPumpFun();
      foundTokens = tokens;

      document.getElementById("console").innerText = `🪙 Tokens encontrados: ${tokens.length}`;

      for (const token of tokens) {
        const shouldBuy = await avaliarToken(token);
        if (shouldBuy) {
          document.getElementById("console").innerText += `\n💰 Comprando ${token.symbol}...`;
          await realizarSwap(token);
        }
      }
    } catch (err) {
      console.error("Erro durante execução do bot:", err);
      document.getElementById("console").innerText = `❌ Erro: ${err.message}`;
    }

    await new Promise(resolve => setTimeout(resolve, 30000)); // espera 30s entre loops
  }
}

async function buscarTokensPumpFun() {
  try {
    const response = await fetch("https://solanabotbackend.vercel.app/tokens");
    const data = await response.json();
    return data.tokens || [];
  } catch (err) {
    console.error("Erro ao buscar tokens:", err);
    return [];
  }
}

async function avaliarToken(token) {
  try {
    const liquidity = parseFloat(token.liquidity);
    const marketCap = parseFloat(token.marketCap || 0);
    return liquidity > 500 && marketCap < 50000;
  } catch (err) {
    return false;
  }
}

async function realizarSwap(token) {
  try {
    const response = await fetch("https://quote-api.jup.ag/v6/swap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        route: token.route,
        userPublicKey: walletPublicKey,
        wrapUnwrapSOL: true,
        dynamicSlippage: true
      })
    });

    const data = await response.json();
    if (data?.swapTransaction) {
      const signed = await window.phantom.solana.signAndSendTransaction(data.swapTransaction);
      document.getElementById("console").innerText += `\n✅ Swap realizado: ${signed.signature}`;
    } else {
      document.getElementById("console").innerText += `\n⚠️ Swap não executado`;
    }
  } catch (err) {
    console.error("Erro no swap:", err);
    document.getElementById("console").innerText += `\n❌ Erro ao trocar: ${err.message}`;
  }
}
