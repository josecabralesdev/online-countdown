import React, { useState } from 'react';
import { NamePickerEngine, PickerType } from './NamePickerEngine';

interface PickerCategory {
  title: string;
  items: { id: string; name: string; icon: string; type: PickerType }[];
}

const PICKER_CATEGORIES: PickerCategory[] = [
  {
    title: "Classic & Mechanical",
    items: [
      { id: 'slot', name: "One Arm Bandit", icon: "🎰", type: 'slot' },
      { id: 'wheel', name: "Picker Wheel", icon: "🎡", type: 'wheel' },
    ]
  },
  {
    title: "Magic & Mystery",
    items: [
      { id: 'box', name: "Magic Box", icon: "🎁", type: 'box' },
      { id: 'card', name: "Card Picker", icon: "🃏", type: 'card' },
    ]
  }
];

export const NamePickerDirectory: React.FC = () => {
  const [activePicker, setActivePicker] = useState<{name: string, icon: string, type: PickerType} | null>(null);

  if (activePicker) {
    return <NamePickerEngine title={activePicker.name} icon={activePicker.icon} type={activePicker.type} onBack={() => setActivePicker(null)} />;
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Intro Box */}
      <div className="w-full border-2 border-retro-green bg-retro-green/5 p-6 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-50 font-pixel text-[10px] animate-pulse">DB_V4.3</div>
        <h2 className="font-pixel text-xl sm:text-2xl text-retro-amber mb-2 text-center">
          NAME PICKER DATABASE
        </h2>
        <div className="font-retro text-lg text-center text-retro-green opacity-80">
          <p>Initialize selection algorithm.</p>
          <div className="mt-2 text-sm text-retro-red border-t border-retro-green/20 pt-2">
            SELECT MODULE BELOW
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        {PICKER_CATEGORIES.map((category, idx) => (
          <React.Fragment key={idx}>
             {category.items.map((item) => (
               <button
                 key={item.id}
                 onClick={() => setActivePicker(item)}
                 className="group relative bg-black border-2 border-gray-700 hover:border-retro-green transition-all duration-200 p-8 flex flex-row items-center gap-6 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(51,255,0,0.2)] text-left"
               >
                 <div className="text-5xl group-hover:scale-110 transition-transform duration-200 filter drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">
                   {item.icon}
                 </div>
                 <div>
                   <h3 className="font-pixel text-sm text-retro-green group-hover:text-retro-amber uppercase tracking-widest mb-1">
                     {item.name}
                   </h3>
                   <p className="font-retro text-gray-500 text-xs uppercase">
                     {category.title}
                   </p>
                 </div>
                 
                 {/* Decorative Corner lines */}
                 <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gray-500 group-hover:border-retro-green"></div>
                 <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gray-500 group-hover:border-retro-green"></div>
               </button>
             ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};