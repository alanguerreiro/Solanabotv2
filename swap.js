const fs = require('fs');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { Jupiter } = require('@jup-ag/core');
const fetch = require('node-fetch');

// Conexão com a Solana Mainnet
const RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';
const connection = new Connection(RPC_ENDPOINT, 'confirmed');

// Carrega sua carteira (keypair.json gerado localmente)
const secretKey = JSON.parse(fs.readFileSync('./keypair.json'));
const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKey));

// Função para realizar o swap
async function swapToken(inputMint, outputMint, amount) {
  const jupiter = await Jupiter.load({
    connection,
    cluster: 'mainnet-beta',
    user: wallet,
    wrapUnwrapSOL: true,
  });

  const routes = await jupiter.computeRoutes({
    inputMint: new PublicKey(inputMint),
    outputMint: new PublicKey(outputMint),
    amount,
    slippage: 1, // 1% de tolerância
  });

  if (!routes || routes.routesInfos.length === 0) {
    console.log('❌ Nenhuma rota encontrada para o swap.');
    return;
  }

  const { execute } = await jupiter.exchange({
    routeInfo: routes.routesInfos[0],
  });

  const swapResult = await execute();

  if (swapResult.error) {
    console.error('❌ Erro ao executar swap:', swapResult.error);
  } else {
    console.log('✅ Swap executado com sucesso!');
    console.log('🔁 Transação ID:', swapResult.txid);
  }
}

// Exemplo: Swap de 5 USDC → SOL
const USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const SOL = 'So11111111111111111111111111111111111111112';
const amount = 5 * 10 ** 6; // 5 USDC em base de 6 decimais

swapToken(USDC, SOL, amount);
