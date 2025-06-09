import * as bip39 from "bip39";
import { mnemonicToSeedSync } from "bip39";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";

export const genMnemonic = () => {
  return bip39.generateMnemonic(); // 12-word mnemonic
};

export const GenSol = (mnemonics, count = 1) => {
  const wallet = [];

  if (!bip39.validateMnemonic(mnemonics)) {
    throw new Error("Invalid mnemonic");
  }

  const seedSync = mnemonicToSeedSync(mnemonics);

  for (let i = 0; i < count; i++) {
    const path = `m/44'/501'/${i}'/0'`;
    const derivedSeed = derivePath(path, seedSync.toString("hex"));
    const keypair = Keypair.fromSeed(derivedSeed.key);

    const privateKeyBytes = keypair.secretKey.slice(0, 32);
    const privateKeyBase58 = bs58.encode(privateKeyBytes);
    const publicKeyBase58 = keypair.publicKey.toBase58();

    wallet.push({
      publicKey: publicKeyBase58,
      privateKey: privateKeyBase58,
    });
  }

  return wallet;
};


// const mnemonic = genMnemonic();
// wallet.push({mnemonic:mnemonic});

// console.log("Mnemonic:", mnemonic);

// const wallets = GenSol(mnemonic, 3);
// console.log(wallets);