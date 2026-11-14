import { useRef, useState } from 'react';
type Item = { name: string; emoji: string; rarity: string; color: string; price: number; };
type InventoryItem = Item & { uid: string };
const cases = [ { name: 'Starter Case', emoji: '📦', price: 19 }, { name: 'Brainrot Case', emoji: '💗', price: 500 }, { name: 'Rare Case', emoji: '💎', price: 1500 }, { name: 'Legendary Case', emoji: '👑', price: 5000 }, { name: 'God Case', emoji: '🔥', price: 15000 }, ];
const loot: Item[] = [ { name: 'Noobini Pizzanini', emoji: '🍕', rarity: 'Common', color: '#aaaaaa', price: 100 }, { name: 'Lirili Larila', emoji: '🐘', rarity: 'Common', color: '#aaaaaa', price: 150 }, { name: 'Tim Cheese', emoji: '🧀', rarity: 'Uncommon', color: '#42b86b', price: 500 }, { name: 'Trippi Troppi', emoji: '🦐', rarity: 'Rare', color: '#3c91ed', price: 650 }, { name: 'Brr Brr Patapim', emoji: '🌳', rarity: 'Epic', color: '#a34dff', price: 1500 }, { name: 'Cappuccino Assassino', emoji: '☕', rarity: 'Legendary', color: '#ffad33', price: 5000 }, { name: 'Bombardiro Crocodilo', emoji: '🐊', rarity: 'Mythic', color: '#ff4545', price: 15000 }, ];

type WeightedItem = Item & { weight: number };
const starterLoot: WeightedItem[] = [
  { name: 'Los Combinasionas', emoji: '🧩', rarity: 'Common', color: '#aaaaaa', price: 5, weight: 20 },
  { name: 'Money Money Puggy', emoji: '🐶', rarity: 'Common', color: '#aaaaaa', price: 13, weight: 16 },
  { name: 'Los Primos', emoji: '👬', rarity: 'Rare', color: '#3c91ed', price: 28, weight: 10 },
  { name: 'Garama and Madundung', emoji: '🦣', rarity: 'Epic', color: '#a34dff', price: 45, weight: 5 },
  { name: 'Esok Sekolah', emoji: '🎒', rarity: 'Common', color: '#aaaaaa', price: 7, weight: 18 },
  { name: 'Tic Tac Sahur', emoji: '⏰', rarity: 'Uncommon', color: '#42b86b', price: 17, weight: 13 },
  { name: 'Ketupat Kepat', emoji: '🍃', rarity: 'Uncommon', color: '#42b86b', price: 18, weight: 11 },
  { name: 'Ketchuru and Musturu', emoji: '🍅', rarity: 'Uncommon', color: '#42b86b', price: 20, weight: 12 },
  { name: 'Lavadorito Spinito', emoji: '🧽', rarity: 'Rare', color: '#3c91ed', price: 30, weight: 9 },
  { name: 'W or L', emoji: '🏆', rarity: 'Legendary', color: '#ffad33', price: 65, weight: 2 },
  { name: 'Los 67', emoji: '6️⃣', rarity: 'Common', color: '#aaaaaa', price: 8, weight: 18 },
  { name: 'Los Puggies', emoji: '🐾', rarity: 'Common', color: '#aaaaaa', price: 15, weight: 15 },
];

function pickStarterDrop(): Item {
  const total = starterLoot.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of starterLoot) {
    roll -= item.weight;
    if (roll <= 0) return item;
  }
  return starterLoot[0];
}

const brainrotImages: Record<string, string> = {
  'Los Combinasionas': '/brain-rot-game/images/brainrots/los-combinasionas.png',
  'Money Money Puggy': '/brain-rot-game/images/brainrots/money-money-puggy.png',
  'Los Primos': '/brain-rot-game/images/brainrots/los-primos.png',
  'Garama and Madundung': '/brain-rot-game/images/brainrots/garama-and-madundung.png',
  'Esok Sekolah': '/brain-rot-game/images/brainrots/esok-sekolah.png',
  'Tic Tac Sahur': '/brain-rot-game/images/brainrots/tic-tac-sahur.png',
  'Ketupat Kepat': '/brain-rot-game/images/brainrots/ketupat-kepat.png',
  'Ketchuru and Musturu': '/brain-rot-game/images/brainrots/ketchuru-and-musturu.png',
  'Lavadorito Spinito': '/brain-rot-game/images/brainrots/lavadorito-spinito.png',
  'W or L': '/brain-rot-game/images/brainrots/w-or-l.png',
  'Los 67': '/brain-rot-game/images/brainrots/los-67.png',
  'Los Puggies': '/brain-rot-game/images/brainrots/los-puggies.png',
};

function ItemImage({ item, size }: { item: Item; size: number }) {
  const src = brainrotImages[item.name];
  return src
    ? <img src={src} alt={item.name} style={{ width: size, height: size, objectFit: 'contain' }} />
    : <span>{item.emoji}</span>;
}

const ITEM_WIDTH = 134; const WINNER_INDEX = 24;
export default function App() {
  const [balance, setBalance] = useState(1000); const [page, setPage] = useState('cases'); const [selectedCase, setSelectedCase] = useState(cases[0]); const [inventory, setInventory] = useState<InventoryItem[]>([]); const [strips, setStrips] = useState<Item[][]>([]); const [winner, setWinner] = useState<Item | null>(null); const [winnerUids, setWinnerUids] = useState<string[]>([]); const [winnerTotal, setWinnerTotal] = useState(0); const [openQuantity, setOpenQuantity] = useState(1); const [result, setResult] = useState(''); const [rolling, setRolling] = useState(false); const [positions, setPositions] = useState<number[]>([]); const [transitionOn, setTransitionOn] = useState(false); const [selectedItem, setSelectedItem] = useState<string | null>(null); const [targetItem, setTargetItem] = useState<Item | null>(null);  const [upgrading, setUpgrading] = useState(false);
  const [upgradeSpeed, setUpgradeSpeed] = useState<'fast' | 'slow'>('fast');
  const [upgradeRotation, setUpgradeRotation] = useState(0); const [upgradeOutcome, setUpgradeOutcome] = useState<'success' | 'fail' | null>(null); const [upgradeResult, setUpgradeResult] = useState(''); const rouletteRefs = useRef<(HTMLDivElement | null)[]>([]);
const buttonStyle: React.CSSProperties = { background: '#a34dff', color: 'white', border: 'none', borderRadius: 12, padding: '13px 18px', fontWeight: 800, cursor: 'pointer', };
const cardStyle: React.CSSProperties = { background: '#202033', border: '1px solid #393950', borderRadius: 15, padding: 14, textAlign: 'center', };

function sellItem(uid: string) {
  const item = inventory.find(item => item.uid === uid);
  if (!item) return;
  setBalance(old => old + item.price);
  setInventory(old => old.filter(item => item.uid !== uid));
  if (selectedItem === uid) setSelectedItem(null);
}

function sellAll() {
  if (inventory.length === 0) return;
  const total = inventory.reduce((sum, item) => sum + item.price, 0);
  setBalance(old => old + total);
  setInventory([]);
  setSelectedItem(null);
}

function sellWinner() {
  if (winnerUids.length === 0) return;
  const ids = new Set(winnerUids);
  setBalance(old => old + winnerTotal);
  setInventory(old => old.filter(item => !ids.has(item.uid)));
  setWinner(null);
  setWinnerUids([]);
  setWinnerTotal(0);
}

function openCase() {
  if (rolling) return;

  const totalPrice = selectedCase.price * openQuantity;
  if (balance < totalPrice) {
    setResult('Not enough balance!');
    return;
  }

  setBalance(old => old - totalPrice);
  setWinner(null);
  setWinnerUids([]);
  setWinnerTotal(0);
  setResult('');
  setPositions(Array(openQuantity).fill(0));
  setTransitionOn(false);

  const caseLoot: Item[] = selectedCase.name === 'Starter Case' ? starterLoot : loot;

  const prizes: Item[] = Array.from({ length: openQuantity }, () =>
    selectedCase.name === 'Starter Case'
      ? pickStarterDrop()
      : caseLoot[Math.floor(Math.random() * caseLoot.length)]
  );

  const newStrips = prizes.map(prize => {
    const reel: Item[] = [];
    for (let i = 0; i < 35; i++) {
      reel.push(i === WINNER_INDEX
        ? prize
        : caseLoot[Math.floor(Math.random() * caseLoot.length)]);
    }
    return reel;
  });

  setStrips(newStrips);
  rouletteRefs.current = [];
  setRolling(true);

  window.setTimeout(() => {
    const targets = newStrips.map((_, index) => {
      const container = rouletteRefs.current[index];
      const stripElement = container?.children[1] as HTMLElement | undefined;
      const winningCard = stripElement?.children[WINNER_INDEX] as HTMLElement | undefined;

      if (!container || !winningCard) return 0;

      const containerRect = container.getBoundingClientRect();
      const cardRect = winningCard.getBoundingClientRect();

      return container.clientWidth / 2 -
        (cardRect.left - containerRect.left + cardRect.width / 2);
    });

    setTransitionOn(true);
    setPositions(targets);
  }, 100);

  window.setTimeout(() => {
    setRolling(false);

    const newItems = prizes.map(item => ({
      ...item,
      uid: Date.now() + Math.random() + ''
    }));

    setWinner(prizes[0]);
    setWinnerUids(newItems.map(item => item.uid));
    setWinnerTotal(prizes.reduce((sum, item) => sum + item.price, 0));
    setInventory(old => [...newItems, ...old]);
    setResult('You opened ' + openQuantity + ' case(s)! All prizes added to inventory.');
  }, 5500);
}
function doUpgrade() {
  if (upgrading || !selectedItem || !targetItem) return;
  const source = inventory.find(item => item.uid === selectedItem);
  if (!source || targetItem.price <= source.price) return;

  const success = Math.random() * 100 < chance;
  const coloredAngle = chance * 3.6;
  const stopAngle = success
    ? coloredAngle * (0.15 + Math.random() * 0.7)
    : coloredAngle + (360 - coloredAngle) * (0.15 + Math.random() * 0.7);
  const duration = upgradeSpeed === 'fast' ? 5000 : 10000;
  const turns = upgradeSpeed === 'fast' ? 2160 : 3600;
  const finalRotation = Math.ceil(upgradeRotation / 360) * 360 + turns + stopAngle;

  setUpgrading(true);
  setUpgradeRotation(finalRotation);
  setUpgradeOutcome(null);
  setUpgradeResult('');

  window.setTimeout(() => {
    setUpgradeOutcome(success ? 'success' : 'fail');
    setInventory(old => {
      const remaining = old.filter(item => item.uid !== selectedItem);
      return success
        ? [{ ...targetItem, uid: Date.now() + Math.random() + '' }, ...remaining]
        : remaining;
    });

    setUpgradeResult(success
      ? '🎉 SUCCESS! You got ' + targetItem.name + '!'
      : '💥 FAILED! Your ' + source.name + ' was lost!');

    setUpgrading(false);
    setSelectedItem(null);
    setTargetItem(null);
  }, duration + 100);
}
const selectedSource = inventory.find(item => item.uid === selectedItem);
const possibleTargets = selectedSource ? starterLoot.filter(item => item.price > selectedSource.price) : [];
const chance = selectedSource && targetItem
  ? Math.min(100, selectedSource.price / targetItem.price * 100)
  : 0;
return ( <main style={{ minHeight: '100vh', background: '#11111d', color: 'white', fontFamily: 'Arial, sans-serif', padding: 16, paddingBottom: 100, }}> <style>{`* { box-sizing: border-box; } @keyframes upgradePulse { from { filter: brightness(1); transform: scale(1); } to { filter: brightness(1.6); transform: scale(1.04); } } @keyframes upgradeSpin { to { transform: rotate(360deg); } } @keyframes winPulse { from { transform: scale(1); } to { transform: scale(1.05); } } button:disabled { opacity: 0.5; }`}</style>
  <header style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  }}>
    <div>
      <div style={{ color: '#aaa', fontSize: 12 }}>BRAINROT CASES</div>
      <h1 style={{ margin: '5px 0' }}>🎰 Brainrot</h1>
    </div>
    <div style={{
      background: '#29243d',
      padding: 12,
      borderRadius: 12,
      color: '#ffd34d',
      fontWeight: 800,
    }}>
      🪙 {balance.toLocaleString()} SL
    </div>
  </header>

  {page === 'cases' && (
    <>
      <h2>🎁 CASES</h2>
      <p style={{ color: '#999' }}>Choose your case!</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 12,
      }}>
        {cases.map((c, index) => (
          <div
            key={c.name}
            onClick={() => {
              if (index !== 0) return;
              setSelectedCase(c);
              setWinner(null);
              setResult('');
              setPage('roulette');
            }}
            style={{
              ...cardStyle,
              cursor: index === 0 ? 'pointer' : 'default',
              gridColumn: 'auto',
              opacity: index === 0 ? 1 : 0.5,
            }}
          >
            {index === 0 ? (
  <img
    src="/brain-rot-game/images/starter-case.png"
    alt="Starter Case"
    style={{
      width: '100%',
      maxWidth: '100%',
      height: 160,
      objectFit: 'contain',
      display: 'block',
      margin: '0 auto',
    }}
  />
) : (
  <div style={{ fontSize: 48 }}>{c.emoji}</div>
)}
            <h3>{c.name}</h3>
            <p style={{ color: '#ffd34d' }}>{c.price.toLocaleString()} SL</p>
            <button style={buttonStyle}>
              {index === 0 ? 'SELECT CASE' : 'COMING SOON'}
            </button>
          </div>
        ))}
      </div>


    </>
  )}

  {page === 'roulette' && (
    <>
      <button style={buttonStyle} onClick={() => setPage('cases')}>
        ← BACK
      </button>

      <h2 style={{ textAlign: 'center' }}>📦 {selectedCase.name}</h2>
      <p style={{ textAlign: 'center', color: '#aaa' }}>Try your luck!</p>

      <div style={{ display: 'flex', gap: 10, marginTop: 18, marginBottom: 18 }}>
        {[1, 3, 5].map(count => (
          <button
            key={count}
            onClick={() => setOpenQuantity(count)}
            disabled={rolling}
            style={{
              ...buttonStyle,
              flex: 1,
              background: openQuantity === count ? '#a34dff' : '#29293d',
              border: openQuantity === count ? '2px solid #d6aaff' : '2px solid #45455e',
              opacity: rolling ? 0.6 : 1,
            }}
          >
            {count}x
          </button>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: openQuantity === 1 ? '1fr' : 'repeat(2, minmax(0, 1fr))',
        gap: 12,
        marginTop: 25,
      }}>
        {strips.map((reel, reelIndex) => (
          <div
            key={reelIndex}
            ref={element => { rouletteRefs.current[reelIndex] = element; }}
            style={{
              overflow: 'hidden',
              position: 'relative',
              height: 180,
              minWidth: 0,
              background: '#202033',
              borderRadius: 16,
            }}
          >
            <div style={{
              position: 'absolute',
              zIndex: 2,
              left: '50%',
              top: 0,
              bottom: 0,
              width: 3,
              background: '#ffd34d',
            }} />

            <div style={{
              display: 'flex',
              position: 'absolute',
              left: 0,
              top: 15,
              transform: `translateX(${positions[reelIndex] || 0}px)`,
              transition: transitionOn
                ? 'transform 5.2s cubic-bezier(0.12, 0.75, 0.08, 1)'
                : 'none',
            }}>
              {reel.map((item, index) => (
                <div key={index} style={{
                  width: ITEM_WIDTH,
                  minWidth: ITEM_WIDTH,
                  height: 145,
                  background: '#29293d',
                  border: '2px solid ' + item.color,
                  borderRadius: 12,
                  marginRight: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{ fontSize: 42 }}>
                    <ItemImage item={item} size={82} />
                  </div>
                  <div style={{ fontSize: 11, textAlign: 'center', padding: 4 }}>
                    {item.name}
                  </div>
                  <div style={{ color: item.color, fontSize: 11 }}>
                    {item.rarity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {winner && (
        <button
          onClick={sellWinner}
          style={{
            ...buttonStyle,
            background: '#e04455',
            width: '100%',
            marginTop: 20,
            padding: 18,
            fontSize: 18,
          }}
        >
          SELL · {winnerTotal.toLocaleString()} SL
        </button>
      )}

      <button
        onClick={openCase}
        disabled={rolling}
        style={{
          ...buttonStyle,
          width: '100%',
          marginTop: 24,
          padding: 18,
          fontSize: 18,
        }}
      >
        {rolling ? '🎰 ROLLING...' : 'OPEN ' + openQuantity + ' CASE' + (openQuantity > 1 ? 'S' : '') + ' — ' + (selectedCase.price * openQuantity).toLocaleString() + ' SL'}
      </button>

      <p style={{ textAlign: 'center', color: '#ffd34d' }}>{result}</p>

      <h2 style={{ marginTop: 30 }}>🎁 STARTER CASE — DROP LIST</h2>
      <p style={{ color: '#999' }}>All 12 possible drops</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 10,
      }}>
        {starterLoot.map((item) => (
          <div key={item.name} style={{
            ...cardStyle,
            border: `1px solid ${item.color}`,
            padding: 10,
          }}>
            <div style={{ fontSize: 30 }}><ItemImage item={item} size={64} /></div>
            <b style={{ fontSize: 13 }}>{item.name}</b>
            <div style={{ color: item.color, fontSize: 12, marginTop: 5 }}>
              {item.rarity}
            </div>
            <div style={{ color: '#ffd34d', fontWeight: 800, marginTop: 5 }}>
              {item.price} SL
            </div>
          </div>
        ))}
      </div>
    </>
  )}

  {page === 'inventory' && (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <div>
          <h2>🎒 YOUR INVENTORY</h2>
          <p style={{ color: '#aaa' }}>Your collected items</p>
        </div>
        <button
          onClick={sellAll}
          disabled={inventory.length === 0}
          style={{ ...buttonStyle, background: '#e04455', padding: '11px 13px' }}
        >
          SELL ALL
        </button>
      </div>

      {inventory.length === 0 && (
        <p style={{ color: '#888' }}>Your inventory is empty. Open a case!</p>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 12,
      }}>
        {inventory.map(item => (
          <div
            key={item.uid}
            style={{
              ...cardStyle,
              border: '1px solid ' + item.color,
              cursor: 'pointer',
              outline: selectedItem === item.uid ? '2px solid #a34dff' : 'none',
            }}
            onClick={() => {
              if (upgrading) return;
              setSelectedItem(item.uid);
              setUpgradeResult('');
            }}
          >
            <div style={{ fontSize: 42 }}><ItemImage item={item} size={82} /></div>
            <b>{item.name}</b>
            <p style={{ color: item.color }}>{item.rarity}</p>
            <b>{item.price.toLocaleString()} SL</b>
            <button
              onClick={(e) => {
                e.stopPropagation();
                sellItem(item.uid);
              }}
              style={{ ...buttonStyle, background: '#e04455', width: '100%', marginTop: 10 }}
            >
              SELL · {item.price.toLocaleString()} SL
            </button>
          </div>
        ))}
      </div>
    </>
  )}

  {page === 'upgrader' && (
    <>
      <h2>⚡ ITEM UPGRADER</h2>
      <p style={{ color: '#aaa' }}>Select an item and try to upgrade it!</p>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '30px 0' }}>
        <div style={{ width: 250, height: 250, borderRadius: '50%', background: `conic-gradient(#a34dff ${chance * 3.6}deg, #393950 0deg)`, position: 'relative', display: 'grid', placeItems: 'center', boxShadow: '0 0 35px #7935bd55' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', transform: `rotate(${upgradeRotation}deg)`, transition: upgrading ? `transform ${upgradeSpeed === 'fast' ? 5 : 10}s cubic-bezier(0.12, 0.75, 0.12, 1)` : 'none' }}>
            <div style={{ position: 'absolute', top: 5, left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: 30 }}>▼</div>
          </div>
          <div style={{ width: 210, height: 210, borderRadius: '50%', background: '#151522', display: 'grid', placeItems: 'center', zIndex: 1 }}>
            <div style={{ textAlign: 'center' }}>
              <b style={{ fontSize: 38, color: '#c78aff' }}>{chance.toFixed(2)}%</b>
              <div style={{ color: '#aaa', fontSize: 13 }}>WIN CHANCE</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
        <button type="button" disabled={upgrading} onClick={() => setUpgradeSpeed('fast')} style={{ ...buttonStyle, flex: 1, background: upgradeSpeed === 'fast' ? '#7935bd' : '#252538', border: upgradeSpeed === 'fast' ? '2px solid #c78aff' : '2px solid transparent' }}>
          FAST · 5 SEC
        </button>
        <button type="button" disabled={upgrading} onClick={() => setUpgradeSpeed('slow')} style={{ ...buttonStyle, flex: 1, background: upgradeSpeed === 'slow' ? '#7935bd' : '#252538', border: upgradeSpeed === 'slow' ? '2px solid #c78aff' : '2px solid transparent' }}>
          SLOW · 10 SEC
        </button>
      </div>

      <button
        onClick={doUpgrade}
        disabled={upgrading || !selectedItem || !targetItem}
        style={{
          ...buttonStyle,
          width: '100%',
          padding: 18,
          marginTop: 20,
          fontSize: 20,
          background: upgradeOutcome === 'success'
            ? '#a34dff'
            : upgradeOutcome === 'fail'
            ? '#ff3030'
            : '#7935bd',
          boxShadow: upgradeOutcome === 'success'
            ? '0 0 35px #a34dff'
            : upgradeOutcome === 'fail'
            ? '0 0 35px #ff3030'
            : 'none',
          animation: upgrading ? 'upgradePulse 0.7s infinite alternate' : 'none',
        }}
      >
        {upgrading ? '⚡ UPGRADING...' : '⚡ UPGRADE'}
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gap: 12,
        marginTop: 20,
      }}>
        <div>
          <h3 style={{ textAlign: 'center' }}>YOUR ITEM</h3>
          <div style={{
            ...cardStyle,
            minHeight: 125,
            border: '2px solid #a34dff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {selectedSource ? (
              <>
                <div style={{ fontSize: 38 }}><ItemImage item={selectedSource} size={76} /></div>
                <b style={{ fontSize: 12 }}>{selectedSource.name}</b>
                <p style={{ color: selectedSource.color, margin: '6px 0' }}>
                  {selectedSource.price.toLocaleString()} SL
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: 34 }}>🎒</div>
                <b>SELECT ITEM BELOW</b>
              </>
            )}
          </div>
        </div>

        <div>
          <h3 style={{ textAlign: 'center' }}>TARGET</h3>
          <div style={{
            ...cardStyle,
            minHeight: 125,
            border: '2px solid #a34dff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {targetItem ? (
              <>
                <div style={{ fontSize: 38 }}><ItemImage item={targetItem} size={76} /></div>
                <b style={{ fontSize: 12 }}>{targetItem.name}</b>
                <p style={{ color: targetItem.color, margin: '6px 0' }}>
                  {targetItem.price.toLocaleString()} SL
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: 34 }}>❓</div>
                <b>CHOOSE TARGET BELOW</b>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gap: 20,
        alignItems: 'start',
        marginTop: 24,
      }}>
        <div style={{ minWidth: 0 }}>
          <h3>🎒 YOUR INVENTORY</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 10,
          }}>
            {inventory.map(item => (
              <div
                key={item.uid}
                onClick={() => {
                  if (upgrading) return;
                  setSelectedItem(item.uid);
                  setTargetItem(null);
                  setUpgradeResult('');
                }}
                style={{
                  ...cardStyle,
                  minWidth: 0,
                  border: selectedItem === item.uid
                    ? '2px solid #a34dff'
                    : '1px solid ' + item.color,
                  cursor: upgrading ? 'default' : 'pointer',
                  boxShadow: selectedItem === item.uid ? '0 0 15px #a34dff66' : 'none',
                }}
              >
                <div style={{ fontSize: 30 }}><ItemImage item={item} size={64} /></div>
                <b style={{ fontSize: 11 }}>{item.name}</b>
                <p style={{ color: item.color, margin: '6px 0' }}>
                  {item.price.toLocaleString()} SL
                </p>
                <small style={{ color: selectedItem === item.uid ? '#c78aff' : '#888' }}>
                  {selectedItem === item.uid ? '✓ SELECTED' : 'TAP TO SELECT'}
                </small>
              </div>
            ))}
            {inventory.length === 0 && (
              <p style={{ color: '#888', gridColumn: '1 / -1', textAlign: 'center' }}>
                Inventory is empty
              </p>
            )}
          </div>
        </div>

        <div style={{ minWidth: 0 }}>
          <h3>🎯 TARGET ITEMS</h3>
          <p style={{ color: '#aaa', fontSize: 12 }}>
            Swipe or drag to browse targets
          </p>
          <div style={{
            display: 'flex',
            gap: 10,
            overflowX: 'auto',
            overflowY: 'hidden',
            padding: '5px 2px 14px',
            scrollbarWidth: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorX: 'contain',
          }}>
            {selectedSource ? (
              possibleTargets.map(item => (
                <div
                  key={item.name}
                  onClick={() => {
                    if (upgrading) return;
                    setTargetItem(item);
                    setUpgradeResult('');
                  }}
                  style={{
                    ...cardStyle,
                    flex: '0 0 125px',
                    minWidth: 125,
                    border: targetItem?.name === item.name
                      ? '2px solid #a34dff'
                      : '1px solid ' + item.color,
                    cursor: upgrading ? 'default' : 'pointer',
                  }}
                >
                  <div style={{ fontSize: 34 }}><ItemImage item={item} size={72} /></div>
                  <b style={{ fontSize: 12 }}>{item.name}</b>
                  <p style={{ color: item.color, margin: '6px 0' }}>
                    {item.price.toLocaleString()} SL
                  </p>
                  <small style={{ color: targetItem?.name === item.name ? '#c78aff' : '#888' }}>
                    {targetItem?.name === item.name ? '✓ SELECTED' : 'SELECT'}
                  </small>
                </div>
              ))
            ) : (
              <p style={{ color: '#888' }}>First select your item on the left</p>
            )}
            {selectedSource && possibleTargets.length === 0 && (
              <p style={{ color: '#888' }}>No available targets</p>
            )}
          </div>
        </div>
      </div>

      {upgradeResult && (
        <div style={{
          ...cardStyle,
          marginTop: 18,
          border: '2px solid ' + (upgradeOutcome === 'success' ? '#a34dff' : '#ff3030'),
          fontSize: 17,
        }}>
          {upgradeResult}
        </div>
      )}
    </>
  )}

  <nav style={{
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-around',
    background: '#1c1c2b',
    borderTop: '1px solid #393950',
    padding: '12px 5px',
    zIndex: 10,
  }}>
    {[
      { id: 'cases', label: '🎁 Cases' },
      { id: 'inventory', label: '🎒 Items' },
      { id: 'upgrader', label: '⚡ Upgrade' },
    ].map(tab => (
      <button
        key={tab.id}
        onClick={() => setPage(tab.id)}
        style={{
          ...buttonStyle,
          background: page === tab.id ? '#7935bd' : 'transparent',
          fontSize: 13,
          padding: '10px 12px',
        }}
      >
        {tab.label}
      </button>
    ))}
  </nav>
</main>); }
