import { Jupiter, RouteInfo } from '@jup-ag/core';
import { Connection, Keypair, PublicKey, VersionedTransaction } from '@solana/web3.js';

const connection = new Connection('https://api.mainnet-beta.solana.com');
const provider = window.phantom?.solana;

export async function executarSwap(token) {
    try {
        if (!provider || !provider.publicKey) {
            throw new Error("Carteira Phantom não conectada.");
        }

        const jupiter = await Jupiter.load({
            connection,
            cluster: 'mainnet-beta',
            user: provider.publicKey,
        });

        const routes = await jupiter.computeRoutes({
            inputMint: new PublicKey("Es9vMFrzaCERsBYX2pzEgdHcYt1UuFXQ8E9uQg9P9GZb"), // USDC
            outputMint: new PublicKey(token.address),
            amount: 5 * 10 ** 6, // 5 USDC (6 decimais)
            slippage: 15,
        });

        if (!routes.routesInfos.length) {
            return { status: "erro", mensagem: "Nenhuma rota encontrada." };
        }

        const bestRoute = routes.routesInfos[0];
        const { execute } = await jupiter.exchange({
            routeInfo: bestRoute,
        });

        const swapResult = await execute();

        if (swapResult.error) {
            return { status: "erro", mensagem: swapResult.error.message };
        }

        return { status: "sucesso", assinatura: swapResult.txid };
    } catch (error) {
        return { status: "erro", mensagem: error.message };
    }
}
