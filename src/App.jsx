import React, { useState } from 'react';
import { genMnemonic, GenSol } from './utils/Wallet-utils';
import * as bip39 from "bip39";
import { FaRegMoon } from "react-icons/fa6";
import { SiLetsencrypt } from "react-icons/si";

import './App.css';

const Nav = () => (
  <div className='Nav'>
    <h1>WALLIFY.IO</h1>
    <p className='Icon'><FaRegMoon /></p>
  </div>
);

const SeedPhrases = ({ mnemonic, setMnemonic, generateFirstWallet }) => {
  const phrasesArray = mnemonic.split(" ");
  if(phrasesArray.length==0){
    return <h1>hii</h1>
  }
  return (
    <div className='SeedC'>
      <div>
        <textarea
          id="SeedPhrases"
          placeholder='ENTER YOUR OWN PHRASES / GENERATE BY CLICKING BUTTON'
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
        ></textarea>
        <span>
          <button className='Seedbtn' onClick={() => {
            const newMnemonic = genMnemonic();
            setMnemonic(newMnemonic);
            generateFirstWallet(newMnemonic);
          }}>Generate</button>
        </span>
      </div>
      <div className='Phrases'>
        <div className='table'>
          {mnemonic.length>0&&phrasesArray.map((e, index) => (
            <div className='singlephrase' key={index}><h2><span>{index+1}</span>.{e}</h2></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Wallet = ({ mnemonic, wallets, setWallets }) => {
  const [showPrivates, setShowPrivates] = useState([]);
  function generateNext() {
    const newWallet = GenSol(mnemonic, wallets.length + 1).slice(-1)[0];
    setWallets([...wallets, newWallet]);
    setShowPrivates([...showPrivates, false]); // default hidden
  }
    function togglePrivate(index) {
    const updated = [...showPrivates];
    updated[index] = !updated[index];
    setShowPrivates(updated);
  }

  if (!bip39.validateMnemonic(mnemonic)) return null;

  return (
    <div className='Wallets'>
      <div className='Head'><h1>Solana Wallets</h1></div>
      <button className='Seedbtn3' onClick={generateNext}>Generate Next Wallet</button>
      {wallets.map((w, i) => (
        <div className='Eachkey' key={i}>
          <p className='Publicp'>Public Key: {w.publicKey}</p>
          <p className='Privatep'>Private Key: {showPrivates[i]?w.publicKey:"****************************************************"}</p>
          <button onClick={()=>togglePrivate(i)} className='Toglebtn'><SiLetsencrypt />
</button>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [wallets, setWallets] = useState([]);

  const generateFirstWallet = (mnemonicPhrase) => {
    if (bip39.validateMnemonic(mnemonicPhrase)) {
      const initialWallet = GenSol(mnemonicPhrase, 1);
      setWallets(initialWallet);
    }
  };

  return (
    <div className='appContainer'>
      <Nav />
      <SeedPhrases mnemonic={mnemonic} setMnemonic={setMnemonic} generateFirstWallet={generateFirstWallet} />
      <Wallet mnemonic={mnemonic} wallets={wallets} setWallets={setWallets} />
    </div>
  );
};

export default App;
