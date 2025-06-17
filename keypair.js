 keypair.js

const fs = require('fs');
const bs58 = require('bs58');
const { Keypair } = require('@solana/web3.js');

// 🔐 Sua chave privada em Base58:
const PRIVATE_KEY_BASE58 = '51dyWaLNZYpTuV4dwznxvPcyuMCMujfu7uUXfvgxodRY5UE8poGEyUPfPJW5aS9SgqZdeKLBQnXwFxounYRCQCXh';

try {
  // Decode da chave
  const secretKey = bs58.decode(PRIVATE_KEY_BASE58);

  // Cria o keypair com a chave decodificada
  const keypair = Keypair.fromSecretKey(secretKey);

  // Salva no formato correto em keypair.json
  fs.writeFileSync('keypair.json', JSON.stringify(Array.from(keypair.secretKey)));
  console.log('✅ Arquivo keypair.json gerado com sucesso!');
} catch (err) {
  console.error('❌ Erro ao gerar o keypair:', err.message);
}
