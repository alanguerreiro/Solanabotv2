const fs = require('fs');
const { Connection, Keypair } = require('@solana/web3.js');
const {
  Jupiter,
  RouteMap,
  TokenListProvider
} = require('@jup-ag/core');

const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

// 🔐 Lê o keypair exportado para JSON
const secret = JSON.parse(fs.readFileSync('keypair.json', 'utf-8'));
const wallet = Keypair.fromSecretKey(new Uint8Array(secret));

const SLIPPAGE = 0.5; // % de tolerância
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qjZtXzyabqcC8GBz66X2yDTVbT'; // USDC

async function swapToken(targetMintAddress, amountInUsdc) {
  try {
    const jupiter = await Jupiter.load({
      connection,
      cluster: 'mainnet-beta',
      user: wallet,
    });

    const inputAmount = amountInUsdc * 10 ** 6; // USDC = 6 decimals

    const routes = await jupiter.computeRoutes({
      inputMint: USDC_MINT,
      outputMint: targetMintAddress,
      amount: inputAmount,
      slippage: SLIPPAGE,
      forceFetch: true,
    });

    if (!routes.routesInfos || routes.routesInfos.length === 0) {
      console.log(`❌ Nenhuma rota encontrada para ${targetMintAddress}`);
      return;
    }

    const { execute } = await jupiter.exchange({
      routeInfo: routes.routesInfos[0],
    });

    const txid = await execute();
    console.log(`✅ Swap realizado com sucesso! TxID: ${txid}`);
  } catch (error) {
    console.error('❌ Erro ao realizar swap:', error.message);
  }
}

module.exports = swapToken;
