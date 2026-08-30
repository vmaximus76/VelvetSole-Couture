'use client';

import React, { useCallback, useEffect, useState } from 'react';

export interface VelvetSoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized: boolean;
  onMinimize: () => void;
  mode?: 'generator' | 'viewer';
  className?: string;
}

const Thumb = ({ onClick }: { onClick?: () => void }) => (
  <div
    onClick={onClick}
    className="bg-[#3a3a3a] rounded-sm w-full h-[52px] hover:bg-[#505050] hover:scale-[1.03] active:scale-[0.98] transition-all duration-150 cursor-pointer"
  />
);

const Pill = ({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-[5px] text-[11px] font-semibold tracking-wider uppercase rounded-sm transition-all duration-200 ${
      active
        ? 'bg-white text-black'
        : 'bg-[#3a3a3a] text-gray-300 hover:bg-[#4a4a4a]'
    }`}
  >
    {children}
  </button>
);

export const VelvetSoleModal: React.FC<VelvetSoleModalProps> = ({
  isOpen,
  onClose,
  isMinimized,
  onMinimize,
  mode = 'generator',
  className = '',
}) => {
  const [media, setMedia] = useState<'image' | 'video'>('image');
  const [model, setModel] = useState<'realistic' | 'artistic'>('realistic');
  const [style, setStyle] = useState<'classic'>('classic');
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isMinimized) onClose();
    },
    [isOpen, isMinimized, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  useEffect(() => {
    document.body.style.overflow = isOpen && !isMinimized ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMinimized]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/80 transition-opacity duration-300 ${
          isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onClick={!isMinimized ? onClose : undefined}
      />

      {/* Modal Frame */}
      <div
        className={`relative flex flex-col bg-[#1a1a1a] border border-[#333] shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isMinimized
            ? 'w-[280px] h-[40px] translate-y-[calc(50vh-20px)] scale-95 opacity-90'
            : 'w-[95vw] max-w-[1200px] h-[85vh] max-h-[800px] translate-y-0 scale-100 opacity-100'
        } ${className}`}
      >
        {/* Window Controls */}
        <div className="absolute top-0 right-0 flex z-20">
          <button
            onClick={onMinimize}
            className="w-8 h-7 flex items-center justify-center bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-300 hover:text-white text-sm font-bold transition-colors border-l border-b border-[#333]"
            title="Minimize"
          >
            −
          </button>
          <button
            onClick={onClose}
            className="w-8 h-7 flex items-center justify-center bg-[#c0392b] hover:bg-[#e74c3c] text-white text-sm font-bold transition-colors border-l border-b border-[#333]"
            title="Close"
          >
            ×
          </button>
        </div>

        {/* Minimized Bar */}
        {isMinimized && (
          <div
            className="flex items-center h-full px-3 cursor-pointer"
            onClick={onMinimize}
          >
            <span className="text-gray-400 text-xs font-medium tracking-wide uppercase">
              VelvetSole {mode === 'generator' ? 'Generator' : 'Viewer'}
            </span>
            <span className="ml-auto text-gray-500 text-[10px]">Click to restore</span>
          </div>
        )}

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col overflow-hidden transition-opacity duration-300 ${
            isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* ── Canvas + Floating Side Panels ── */}
          <div className="flex-1 flex min-h-0 relative">
            {/* LEFT: Base Model Panel */}
            {mode === 'generator' && (
              <div className="absolute left-3 bottom-[72px] w-[164px] flex flex-col z-10">
                {/* Thumbnails - pop up */}
                <div
                  className={`flex flex-col gap-[6px] mb-2 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-bottom ${
                    leftOpen
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-3 scale-95 pointer-events-none'
                  }`}
                >
                  {Array.from({ length: 4 }).map((_, r) => (
                    <div key={r} className="flex gap-[6px]">
                      <Thumb onClick={() => setLeftOpen(false)} />
                      <Thumb onClick={() => setLeftOpen(false)} />
                    </div>
                  ))}
                </div>
                {/* Toggle Button */}
                <button
                  onClick={() => setLeftOpen((p) => !p)}
                  className={`w-full py-[6px] text-[10px] font-semibold uppercase tracking-wider rounded-sm transition-all duration-200 ${
                    leftOpen
                      ? 'bg-white text-black'
                      : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]'
                  }`}
                >
                  {leftOpen ? 'Close' : 'Choose Base Model'}
                </button>
              </div>
            )}

            {/* CENTER: Canvas */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 bg-black m-1" />

              {/* Bottom Action Row */}
              {mode === 'generator' && (
                <div className="h-[56px] flex items-center justify-center px-4 shrink-0">
                  <button
                    className="px-12 py-[10px] bg-[#0f9d58] hover:bg-[#0b8043] text-white text-[13px] font-bold uppercase tracking-[0.15em] rounded-sm transition-all duration-200 shadow-lg shadow-green-900/30 hover:shadow-green-900/50 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Generate
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT: Catalog Panel */}
            {mode === 'generator' && (
              <div className="absolute right-3 bottom-[72px] w-[164px] flex flex-col z-10">
                {/* Thumbnails - pop up */}
                <div
                  className={`flex flex-col gap-[6px] mb-2 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-bottom ${
                    rightOpen
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-3 scale-95 pointer-events-none'
                  }`}
                >
                  {Array.from({ length: 4 }).map((_, r) => (
                    <div key={r} className="flex gap-[6px]">
                      <Thumb onClick={() => setRightOpen(false)} />
                      <Thumb onClick={() => setRightOpen(false)} />
                    </div>
                  ))}
                </div>
                {/* Toggle Button */}
                <button
                  onClick={() => setRightOpen((p) => !p)}
                  className={`w-full py-[6px] text-[10px] font-semibold uppercase tracking-wider rounded-sm transition-all duration-200 ${
                    rightOpen
                      ? 'bg-white text-black'
                      : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]'
                  }`}
                >
                  {rightOpen ? 'Close' : 'Browse Catalog'}
                </button>
              </div>
            )}
          </div>

          {/* ── Bottom Settings Bar ── */}
          {mode === 'generator' && (
            <div className="bg-[#1e1e1e] border-t border-[#333] px-6 py-3 shrink-0">
              <div className="flex gap-10">
                {/* Choose Media */}
                <div className="flex flex-col gap-[6px]">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-medium">
                    Choose Media
                  </span>
                  <div className="flex gap-2">
                    <Pill active={media === 'image'} onClick={() => setMedia('image')}>
                      Image
                    </Pill>
                    <Pill active={media === 'video'} onClick={() => setMedia('video')}>
                      Video
                    </Pill>
                  </div>
                </div>

                {/* Choose Model Type */}
                <div className="flex flex-col gap-[6px]">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-medium">
                    Choose Model Type
                  </span>
                  <div className="flex gap-2">
                    <Pill active={model === 'realistic'} onClick={() => setModel('realistic')}>
                      Realistic
                    </Pill>
                    <Pill active={model === 'artistic'} onClick={() => setModel('artistic')}>
                      Artistic
                    </Pill>
                  </div>
                </div>

                {/* Choose Style */}
                <div className="flex flex-col gap-[6px]">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-medium">
                    Choose Style
                  </span>
                  <div className="flex gap-2">
                    <Pill active={style === 'classic'} onClick={() => setStyle('classic')}>
                      Classic
                    </Pill>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VelvetSoleModal;