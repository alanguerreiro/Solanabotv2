import { Jupiter, RouteMap, TOKEN_LIST_URL } from '@jup-ag/core';
import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';

const connection = new Connection('https://api.mainnet-beta.solana.com');
let jupiter = null;
let routeMap = null;
let tokenList = [];

const SLIPPAGE = 5; // 5%
const BUY_AMOUNT_USDC = 5 * 10 ** 6; // $5 em USDC (6 casas decimais)

async function initJupiter() {
    const tokensRes = await fetch(TOKEN_LIST_URL['mainnet-beta']);
    tokenList = await tokensRes.json();
    jupiter = await Jupiter.load({ connection, cluster: 'mainnet-beta' });
    routeMap = await jupiter.getRouteMap();
    console.log('Jupiter initialized');
}

function findTokenMintBySymbol(symbol) {
    const token = tokenList.find((t) => t.symbol === symbol);
    return token?.address || null;
}

async function executeSwap(inputSymbol, outputSymbol) {
    if (!window.solana || !window.solana.isPhantom) {
        alert('Phantom Wallet não detectada!');
        return;
    }

    await window.solana.connect();
    const userPublicKey = window.solana.publicKey;

    const inputMint = new PublicKey(findTokenMintBySymbol(inputSymbol));
    const outputMint = new PublicKey(findTokenMintBySymbol(outputSymbol));

    const routes = await jupiter.computeRoutes({
        inputMint,
        outputMint,
        amount: BUY_AMOUNT_USDC,
        slippageBps: SLIPPAGE * 100,
        userPublicKey,
    });

    if (!routes.routesInfos.length) {
        console.log('Nenhuma rota encontrada.');
        return;
    }

    const { execute } = await jupiter.exchange({
        routeInfo: routes.routesInfos[0],
        userPublicKey,
    });

    const { txid } = await execute();
    console.log('Swap enviado. Tx ID:', txid);
    alert('Swap executado com sucesso!');
}

window.executeSwap = executeSwap;
window.initJupiter = initJupiter;
