window.onload = function () {
  let isRunning = false;
  let walletPublicKey = null;

  async function connectWallet() {
    logToConsole('🔄 Tentando conectar à Phantom Wallet...');
    try {
      const resp = await window.solana.connect();
      walletPublicKey = resp.publicKey.toString();
      document.getElementById('walletAddress').innerText = walletPublicKey;
      document.getElementById('walletAddress').style.color = 'lime';
      logToConsole(`✅ Carteira conectada: ${walletPublicKey}`);
      startBot();
    } catch (err) {
      logToConsole(`❌ Erro ao conectar carteira: ${err.message || err}`);
    }
  }

  function logToConsole(message) {
    const consoleElement = document.getElementById('console');
    const time = new Date().toLocaleTimeString();
    const formatted = `[${time}] ${message}`;
    consoleElement.innerHTML += `<div>${formatted}</div>`;
    consoleElement.scrollTop = consoleElement.scrollHeight;
  }

  function startBot() {
    if (!walletPublicKey) {
      logToConsole("⚠️ Conecte a carteira antes de iniciar o bot.");
      return;
    }

    isRunning = true;
    document.getElementById('botStatus').innerText = 'Executando';
    document.getElementById('botStatus').style.color = 'lime';
    logToConsole("✅ Bot iniciado.");
    // Aqui você pode chamar scanner.js ou outras rotinas
  }

  function pauseBot() {
    isRunning = false;
    document.getElementById('botStatus').innerText = 'Pausado';
    document.getElementById('botStatus').style.color = 'orange';
    logToConsole("⏸ Bot pausado.");
  }

  function resumeBot() {
    if (walletPublicKey) {
      isRunning = true;
      document.getElementById('botStatus').innerText = 'Executando';
      document.getElementById('botStatus').style.color = 'lime';
      logToConsole("▶️ Bot retomado.");
    } else {
      logToConsole("⚠️ Carteira não conectada.");
    }
  }

  // Botões
  document.querySelector('button[onclick="connectWallet()"]').onclick = connectWallet;
  document.querySelector('button[onclick="pausarBot()"]').onclick = pauseBot;
  document.querySelector('button[onclick="retomarBot()"]').onclick = resumeBot;
};
