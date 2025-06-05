let botRunning = false;
let paused = false;

function logToConsole(message, type = 'info') {
    const consoleDiv = document.getElementById('console');
    const timestamp = new Date().toLocaleTimeString();
    const color = type === 'error' ? 'red' : type === 'success' ? 'lime' : 'white';
    consoleDiv.innerHTML += `<div style="color: ${color}">[${timestamp}] ${message}</div>`;
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

async function connectWallet() {
    try {
        logToConsole("Tentando conectar à Phantom Wallet...");
        const provider = window.phantom?.solana;

        if (!provider || !provider.isPhantom) {
            throw new Error("Phantom Wallet não encontrada.");
        }

        const resp = await provider.connect();
        const publicKey = resp.publicKey.toString();
        document.getElementById("walletAddress").innerText = publicKey;
        logToConsole(`Carteira conectada: ${publicKey}`, 'success');

        startBot();
    } catch (error) {
        logToConsole(`Erro ao conectar carteira: ${error.message}`, 'error');
    }
}

function startBot() {
    logToConsole("Bot iniciado.", 'success');
    botRunning = true;
    paused = false;
    document.getElementById("botStatus").innerText = "Executando";
    runBot();
}

function pauseBot() {
    botRunning = false;
    paused = true;
    document.getElementById("botStatus").innerText = "Pausado";
    logToConsole("Bot pausado.", 'info');
}

function resumeBot() {
    if (!botRunning) {
        botRunning = true;
        paused = false;
        document.getElementById("botStatus").innerText = "Executando";
        logToConsole("Bot retomado.", 'info');
        runBot();
    }
}

async function runBot() {
    while (botRunning && !paused) {
        try {
            const tokens = await buscarTokensPumpFun(); // scanner.js
            document.getElementById("tokenCount").innerText = tokens.length;
            logToConsole(`Tokens encontrados: ${tokens.length}`, 'info');

            for (const token of tokens) {
                if (!botRunning || paused) break;

                const decisao = await analisarToken(token); // decision.js
                if (decisao.comprar) {
                    logToConsole(`Comprando ${token.symbol}...`);
                    const resultado = await executarSwap(token); // swap.js
                    logToConsole(`Resultado do swap: ${resultado.status}`, resultado.status === "sucesso" ? "success" : "error");
                }
            }
        } catch (err) {
            logToConsole(`Erro no loop do bot: ${err.message}`, 'error');
        }

        await new Promise(resolve => setTimeout(resolve, 30000));
    }
}
