import React from 'react';
import { Download, Star } from 'lucide-react';
import { WindowProps } from '../../types';

const AppStore: React.FC<WindowProps> = () => {
  const featured = [
    { title: 'Cosmos Edit', category: 'Productivity', rating: 4.9, color: 'bg-purple-500' },
    { title: 'Flow State', category: 'Health', rating: 4.8, color: 'bg-teal-500' },
    { title: 'Cyberpunk 2078', category: 'Games', rating: 5.0, color: 'bg-yellow-500' },
    { title: 'Zenith', category: 'Finance', rating: 4.6, color: 'bg-indigo-500' },
  ];

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="p-8 pb-4">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Discover</h1>
            <div className="h-[1px] w-full bg-slate-200" />
        </div>

        {/* Featured Grid */}
        <div className="p-8 pt-0 grid grid-cols-2 gap-6">
            {featured.map((app, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer">
                    <div className="flex gap-4">
                        <div className={`w-16 h-16 rounded-xl ${app.color} shadow-lg group-hover:scale-105 transition-transform`} />
                        <div className="flex-1 py-1">
                            <h3 className="font-bold text-slate-800">{app.title}</h3>
                            <p className="text-sm text-slate-500">{app.category}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-bold text-slate-600">{app.rating}</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button className="bg-slate-100 text-blue-600 font-bold px-4 py-1.5 rounded-full text-xs hover:bg-blue-600 hover:text-white transition-colors">
                                GET
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Categories */}
        <div className="px-8 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Categories</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
                {['Arcade', 'Create', 'Work', 'Play', 'Social', 'Develop'].map(c => (
                    <div key={c} className="flex-shrink-0 px-6 py-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl text-slate-600 font-bold hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all cursor-pointer w-32 text-center">
                        {c}
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default AppStore;
