'use client';

import { useState } from 'react';
import { VelvetSoleModal } from '../generate/GenerateModal';

export default function DemoPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mode, setMode] = useState<'generator' | 'viewer'>('generator');

  const handleOpen = (m: 'generator' | 'viewer') => {
    setMode(m);
    setIsOpen(true);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-6">
      <h1 className="text-white text-3xl font-light tracking-widest uppercase mb-8">
        VelvetSole Couture
      </h1>

      <div className="flex gap-4">
        <button
          onClick={() => handleOpen('generator')}
          className="px-8 py-3 bg-[#1a1a1a] border border-[#333] text-gray-300 hover:text-white hover:border-[#555] transition-all duration-200 rounded-sm text-sm font-medium tracking-wider uppercase"
        >
          Open Generator
        </button>
        <button
          onClick={() => handleOpen('viewer')}
          className="px-8 py-3 bg-[#1a1a1a] border border-[#333] text-gray-300 hover:text-white hover:border-[#555] transition-all duration-200 rounded-sm text-sm font-medium tracking-wider uppercase"
        >
          Open Viewer
        </button>
      </div>

      <p className="text-gray-600 text-xs mt-4">
        Press ESC to close • Use − to minimize • Click minimized bar to restore
      </p>

      <VelvetSoleModal
        isOpen={isOpen}
        onClose={handleClose}
        isMinimized={isMinimized}
        onMinimize={handleMinimize}
        mode={mode}
      />
    </main>
  );
}