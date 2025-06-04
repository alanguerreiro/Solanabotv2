import { Jupiter, RouteMap, TOKEN_LIST_URL } from '@jup-ag/core';
import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';

const connection = new Connection('https://api.mainnet-beta.solana.com');

let jupiter;
let routeMap;

async function initJupiter() {
    const tokens = await (await fetch(TOKEN_LIST_URL['mainnet-beta'])).json();
    const inputMint = tokens.find(t => t.symbol === 'USDC')?.address;
    jupiter = await Jupiter.load({
        connection,
        cluster: 'mainnet-beta',
        user: window.solana.publicKey,
    });
    routeMap = jupiter.routeMap;
}

async function swapToken(tokenMint) {
    try {
        const inputMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // USDC
        const outputMint = new PublicKey(tokenMint);

        const routes = await jupiter.computeRoutes({
            inputMint,
            outputMint,
            amount: 5 * 10 ** 6, // $5 USDC (6 decimals)
            slippage: 10,
            forceFetch: true,
        });

        if (!routes.routesInfos || routes.routesInfos.length === 0) {
            console.log('Nenhuma rota encontrada para o token:', tokenMint);
            return;
        }

        const { execute } = await jupiter.exchange({ routeInfo: routes.routesInfos[0] });
        const swapResult = await execute();
        console.log('Swap realizado:', swapResult);
    } catch (error) {
        console.error('Erro ao fazer swap:', error);
    }
}

export { initJupiter, swapToken };
