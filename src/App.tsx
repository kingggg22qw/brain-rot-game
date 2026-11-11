import { useState } from 'react';

const cases = [
  { name: 'Starter Case', emoji: '📦', price: 100 },
  { name: 'Brainrot Case', emoji: '💗', price: 250 },
  { name: 'Rare Case', emoji: '💎', price: 500 },
  { name: 'Legendary Case', emoji: '🔥', price: 1000 },
  { name: 'God Case', emoji: '👑', price: 2500 },
];

export default function App() {
  const [balance, setBalance] = useState(5000);
  const [result, setResult] = useState('');

  function openCase(price: number, name: string) {
    if (balance < price) {
      setResult('Not enough coins!');
      return;
    }
    setBalance(balance - price);
    setResult('🎉 You opened ' + name + '!');
  }

  return (
    <main style={{ minHeight: '100vh', background: '#171722', color: 'white', padding: 30, fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>🧠 BRAINROT CASES</h1>
      <h2>💰 Balance: {balance} coins</h2>
      <h2>CHOOSE YOUR CASE</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 15 }}>
        {cases.map(c => (
          <div key={c.name} style={{ background: '#292943', padding: 20, borderRadius: 15 }}>
            <div style={{ fontSize: 55 }}>{c.emoji}</div>
            <h3>{c.name}</h3>
            <p>{c.price} COINS</p>
            <button onClick={() => openCase(c.price, c.name)} style={{ padding: 12, cursor: 'pointer', borderRadius: 8 }}>
              OPEN CASE
            </button>
          </div>
        ))}
      </div>
      <h2>{result}</h2>
      <footer>BRAINROT CASES • DEMO VERSION</footer>
    </main>
  );
}
