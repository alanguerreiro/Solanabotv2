const fs = require('fs');
const bs58 = require('bs58');
const { Keypair } = require('@solana/web3.js');

// Sua chave privada em Base58 aqui:
const PRIVATE_KEY_BASE58 = '51dyWaLNZYpTuV4dwznxvPcyuMCMujfu7uUXfvgxodRY5UE8poGEyUPfPJW5aS9SgqZdeKLBQnXwFxounYRCQCXh';

try {
  const secretKey = bs58.decode(PRIVATE_KEY_BASE58);
  const keypair = Keypair.fromSecretKey(secretKey);
  fs.writeFileSync('keypair.json', JSON.stringify(Array.from(keypair.secretKey)));
  console.log('✅ Arquivo keypair.json gerado com sucesso!');
} catch (err) {
  console.error('❌ Erro ao gerar keypair:', err.message);
}
