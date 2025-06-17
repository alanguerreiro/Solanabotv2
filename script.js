let isBotRunning = false;
let intervalId;

async function connectWallet() {
    logToConsole('🟡 Tentando conectar à Phantom Wallet...');
    if (!window.solana || !window.solana.isPhantom) {
        logToConsole('❌ Phantom Wallet não detectado.');
        return;
    }

    try {
        const resp = await window.solana.connect();
        const walletAddress = resp.publicKey.toString();
        document.getElementById('walletAddress').innerText = walletAddress;
        document.getElementById('walletStatus').style.color = 'lime';
        logToConsole(`✅ Carteira conectada: ${walletAddress}`);
    } catch (err) {
        logToConsole(`❌ Erro ao conectar carteira: ${err.message}`);
    }
}

function startBot() {
    if (isBotRunning) {
        logToConsole("⚠️ Bot já está em execução.");
        return;
    }

    isBotRunning = true;
    document.getElementById("botStatus").innerText = "Executando";
    document.getElementById("botStatus").style.color = "lime";
    logToConsole("✅ Bot iniciado.");

    intervalId = setInterval(async () => {
        try {
            logToConsole("🕐 Aguardando inicialização do bot...");
            const tokens = await buscarTokensPumpFun();
            document.getElementById("tokenCount").innerText = tokens.length;
            for (const token of tokens) {
                await decidirCompraOuVenda(token);
            }
        } catch (error) {
            logToConsole(`❌ Erro no loop do bot: ${error.message}`);
        }
    }, 15000); // 15 segundos
}

function pauseBot() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        isBotRunning = false;
        document.getElementById("botStatus").innerText = "Parado";
        document.getElementById("botStatus").style.color = "orange";
        logToConsole("⏸️ Bot pausado.");
    }
}

function resetBot() {
    pauseBot();
    document.getElementById("walletAddress").innerText = "---";
    document.getElementById("tokenCount").innerText = "0";
    logToConsole("🔄 Bot resetado.");
}

function logToConsole(message) {
    const consoleElement = document.getElementById("console");
    const timestamp = new Date().toLocaleTimeString();
    consoleElement.innerHTML += `<div>[${timestamp}] ${message}</div>`;
    consoleElement.scrollTop = consoleElement.scrollHeight;
}
