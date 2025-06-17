// swap.js

const fs = require('fs');
const { Connection, Keypair, VersionedTransaction, clusterApiUrl } = require('@solana/web3.js');
const { Jupiter, RouteMap, TokenListProvider } = require('@jup-ag/core');

const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

// ⚙️ Lê o keypair do arquivo gerado com o keypair.js
const secret = JSON.parse(fs.readFileSync('keypair.json'));
const wallet = Keypair.fromSecretKey(new Uint8Array(secret));

const SLIPPAGE = 0.5; // 0.5%
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // USDC

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
      console.log(`⚠️ Nenhuma rota encontrada para ${targetMintAddress}`);
      return;
    }

    const { execute } = await jupiter.exchange({
      routeInfo: routes.routesInfos[0],
    });

    const txid = await execute();
    console.log(`✅ Swap realizado com sucesso: ${txid}`);
  } catch (error) {
    console.error('❌ Erro ao realizar swap:', error.message);
  }
}

module.exports = { swapToken };
