const BIRDEYE_API_KEY = "f6238bead5294bc98607d0e4be6082d8";

async function buscarTokensPumpFun() {
    const consoleDiv = document.getElementById("console");
    const log = (msg) => {
        const p = document.createElement("p");
        p.textContent = msg;
        consoleDiv.appendChild(p);
    };

    try {
        const response = await fetch("https://public-api.birdeye.so/defi/tokenlist?sort_by=fdv&sort_type=desc&limit=15", {
            headers: {
                "accept": "application/json",
                "x-api-key": BIRDEYE_API_KEY
            }
        });

        if (!response.ok) {
            log(`Erro ao buscar tokens: ${response.status}`);
            return [];
        }

        const data = await response.json();
        if (!data || !data.data || !data.data.tokens) {
            log("Nenhum token encontrado na resposta.");
            return [];
        }

        const tokens = data.data.tokens.map(token => ({
            symbol: token.symbol,
            address: token.address,
            name: token.name
        }));

        log(`🔍 Tokens encontrados: ${tokens.length}`);
        return tokens;
    } catch (err) {
        log("❌ Erro no scanner: " + err.message);
        return [];
    }
}
