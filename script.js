let botRunning = false;
let paused = false;

async function connectWallet() {
    log("🟠 Tentando conectar à Phantom Wallet...");
    try {
        const provider = window.solana;
        if (!provider || !provider.isPhantom) {
            log("❌ Phantom Wallet não encontrada.");
            return;
        }

        const resp = await provider.connect();
        const walletAddress = resp.publicKey.toString();
        document.getElementById("walletAddress").innerText = walletAddress;
        log(`✅ Carteira conectada: ${walletAddress}`);
        startBotLoop(provider);
    } catch (err) {
        log(`❌ Erro ao conectar carteira: ${err.message}`);
    }
}

function pauseBot() {
    paused = true;
    document.getElementById("botStatus").innerText = "Pausado";
    log("⏸️ Bot pausado.");
}

function resumeBot() {
    paused = false;
    document.getElementById("botStatus").innerText = "Executando";
    log("▶️ Bot retomado.");
}

function log(message) {
    const consoleElement = document.getElementById("console");
    const time = new Date().toLocaleTimeString();
    const entry = `[${time}] ${message}`;
    consoleElement.innerText += entry + "\n";
    consoleElement.scrollTop = consoleElement.scrollHeight;
}

async function startBotLoop(provider) {
    if (botRunning) return;
    botRunning = true;
    document.getElementById("botStatus").innerText = "Executando";
    log("🟢 Bot iniciado.");

    try {
        while (botRunning) {
            if (paused) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
            }
            await buscarTokensPumpFun(); // Função do scanner.js
            await new Promise(resolve => setTimeout(resolve, 6000)); // Delay entre loops
        }
    } catch (error) {
        log(`❌ Erro no loop do bot: ${error.message}`);
    }
}
