import { analisarToken } from './decision.js';

const PUMP_FUN_API_URL = "https://pump.fun/api/trending";
let tokensAnalisados = new Set();

async function buscarTokensPumpFun() {
    try {
        const resposta = await fetch(PUMP_FUN_API_URL);
        const dados = await resposta.json();

        const novosTokens = dados.slice(0, 10); // top 10 tokens

        for (const token of novosTokens) {
            if (!tokensAnalisados.has(token.tokenAddress)) {
                tokensAnalisados.add(token.tokenAddress);

                const tokenFormatado = {
                    name: token.name || "Unknown",
                    address: token.tokenAddress,
                    price: token.price || 0
                };

                console.log(`🔍 Novo token detectado: ${tokenFormatado.name}`);
                await analisarToken(tokenFormatado);
            }
        }
    } catch (erro) {
        console.error("Erro ao buscar tokens do Pump.fun:", erro);
    }
}

setInterval(buscarTokensPumpFun, 15000); // a cada 15s
