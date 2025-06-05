let botAtivo = false;

async function conectarCarteira() {
    logToConsole("🟡 Tentando conectar à Phantom Wallet...");
    try {
        const provider = window?.phantom?.solana;
        if (!provider?.isPhantom) throw new Error("Phantom Wallet não detectada.");
        
        const resp = await provider.connect();
        const publicKey = resp.publicKey.toString();
        document.getElementById("walletAddress").innerText = publicKey;
        logToConsole(`🟢 Carteira conectada: ${publicKey}`);
        iniciarBot();
    } catch (err) {
        logToConsole(`❌ Erro ao conectar carteira: ${err.message}`);
    }
}

function iniciarBot() {
    botAtivo = true;
    document.getElementById("status").innerText = "Executando";
    document.getElementById("status").style.color = "lime";
    document.getElementById("botStatus").innerText = "Bot iniciado.";
    logToConsole("🟢 Bot iniciado.");
    loopDoBot();
}

function pausarBot() {
    botAtivo = false;
    document.getElementById("status").innerText = "Pausado";
    document.getElementById("status").style.color = "orange";
    logToConsole("⏸️ Bot pausado.");
}

function retomarBot() {
    if (!botAtivo) {
        botAtivo = true;
        document.getElementById("status").innerText = "Executando";
        document.getElementById("status").style.color = "lime";
        logToConsole("▶️ Bot retomado.");
        loopDoBot();
    }
}

async function loopDoBot() {
    while (botAtivo) {
        try {
            logToConsole("⏳ Aguardando inicialização do bot...");
            const tokens = await buscarTokensPumpFun(); // scanner.js
            document.getElementById("tokenCount").innerText = tokens.length;
            logToConsole(`🔍 Tokens encontrados: ${tokens.length}`);
            for (const token of tokens) {
                if (!botAtivo) break;
                logToConsole(`📊 Analisando token ${token.symbol}`);
                const decisao = await tomarDecisao(token); // decision.js
                if (decisao.comprar) {
                    logToConsole(`💰 Comprando token ${token.symbol}`);
                    await executarSwap(token); // swap.js
                }
            }
        } catch (err) {
            logToConsole(`❌ Erro no loop do bot: ${err.message}`);
        }
        await new Promise(resolve => setTimeout(resolve, 10000)); // Aguarda 10s
    }
}

// ✅ Utilitário para logs na tela
function logToConsole(msg) {
    const consoleBox = document.getElementById("console");
    const timestamp = new Date().toLocaleTimeString();
    const line = document.createElement("div");
    line.textContent = `[${timestamp}] ${msg}`;
    consoleBox.appendChild(line);
    consoleBox.scrollTop = consoleBox.scrollHeight;
}
