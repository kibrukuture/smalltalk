import { useState } from 'react';
export default function Emoji() {
  const [recentEmojis, setRecentEmojis] = useState([]);
  const [emojiLib, setEmojiLib] = useState({
    recents: [],
    smileys_emotion: [],
    animals_nature: [],
    food_drink: [],
    travel_places: [],
    activities: [],
    objects: [],
    symbols: [],
    flags: [],
  });
  return (
    <div className='bg-skin-muted w-full'>
      {/* emoji tabs */}
      <ul className='flex justify-between items-center p-2'>
        <li>
          {/* recents */}
          <button>🕐</button>
        </li>
        <li>
          {/* Smileys & Emotion & People & Body */}
          <button>😀</button>
        </li>
        <li>
          {/* Animals & Nature */}
          <button>🐱</button>
        </li>
        <li>
          {/* Food & Drink */}
          <button>☕</button>
        </li>
        <li>
          {/* activities  */}
          <button>⚽</button>
        </li>
        <li>
          {/* travel & places  */}
          <button>✈️</button>
        </li>
        <li>
          {/* objects  */}
          <button>🛠️</button>
        </li>
        <li>
          {/* symbols  */}
          <button>#️⃣</button>
        </li>
        <li>
          {/* flags  */}
          <button>🏳️</button>
        </li>
      </ul>

      {/* search emojis */}
      <div className=''>
        <input type='text' placeholder='Search Emojis' className='font-mono bg-skin-muted   w-full  p-lg rounded-md   text-skin-muted border-2   outline-none border-gray-300 focus:border-teal-400 focus:outline-none transition duration-500' />
      </div>
      <div className=''>
        {/* recents */}
        <div className='flex flex-wrap  items-center gap-xs'>
          {recentEmojis.map((emoji) => (
            <button key={emoji} className=''>
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
/*

Recents
Smileys & Emotion & People & Body
Animals & Nature
Food & Drink
Travel & Places
Activities
Objects
Symbols
Flags

*/
