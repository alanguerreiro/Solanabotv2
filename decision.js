import { Jupiter, RouteMap, createJupiterApiClient } from "@jup-ag/core";
import { Connection, PublicKey, Keypair, Transaction } from "@solana/web3.js";

const connection = new Connection("https://api.mainnet-beta.solana.com");
const apiClient = createJupiterApiClient();

export async function executarSwap(token) {
    try {
        const phantomProvider = window?.phantom?.solana;
        if (!phantomProvider?.publicKey) {
            throw new Error("Phantom Wallet não conectada.");
        }

        const owner = phantomProvider.publicKey;
        const inputMint = new PublicKey("Es9vMFrzaCERntbLxjtsP79Zx5ecTXZzK2L9nqkdD7i"); // USDT
        const outputMint = new PublicKey(token.address); // Token alvo
        const amount = 5 * 10 ** 6; // 5 USDT (USDT tem 6 casas decimais)

        const jupiter = await Jupiter.load({
            connection,
            cluster: "mainnet-beta",
            user: owner,
        });

        const routes = await jupiter.computeRoutes({
            inputMint,
            outputMint,
            amount,
            slippageBps: 500, // 5% slippage
            forceFetch: true,
        });

        if (!routes.routesInfos || routes.routesInfos.length === 0) {
            throw new Error("Nenhuma rota encontrada para swap.");
        }

        const swapResult = await jupiter.exchange({
            routeInfo: routes.routesInfos[0],
        });

        if (swapResult.error) {
            throw new Error(`Erro ao executar swap: ${swapResult.error}`);
        }

        const signedTx = await phantomProvider.signAndSendTransaction(swapResult.tx);
        logToConsole(`✅ Swap executado com sucesso. TX ID: ${signedTx.signature}`);
    } catch (err) {
        logToConsole(`❌ Erro ao executar swap: ${err.message}`);
    }
}
