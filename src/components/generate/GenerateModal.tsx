'use client';

import React, { useCallback, useEffect, useState } from 'react';

/* ────────────────────────────────────────────────────────────────
   VelvetSoleModal
   ────────────────────────────────────────────────────────────────
   Standalone overlay modal for VelvetSole Couture.

   Props
   ─────
   isOpen        boolean   – controls modal visibility
   onClose       () => void – called when user clicks close / backdrop
   isMinimized   boolean   – controlled minimize state
   onMinimize    () => void – called when minimize button clicked
   mode          'generator' | 'viewer'  – which layout to render
   className     string    – optional extra classes on the modal frame
──────────────────────────────────────────────────────────────── */

export interface VelvetSoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized: boolean;
  onMinimize: () => void;
  mode?: 'generator' | 'viewer';
  className?: string;
}

/* ── small helper: placeholder thumbnail ── */
const PlaceholderThumb = ({ onClick }: { onClick?: () => void }) => (
  <div
    onClick={onClick}
    className="bg-[#3a3a3a] rounded-sm w-full h-16 hover:bg-[#4a4a4a] hover:scale-[1.03] transition-all duration-150 cursor-pointer"
  />
);

/* ── small helper: dark pill button ── */
const PillButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}> = ({ children, onClick, active, className = '' }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase
      rounded-sm transition-all duration-200
      ${
        active
          ? 'bg-white text-black'
          : 'bg-[#3a3a3a] text-gray-200 hover:bg-[#4a4a4a]'
      }
      ${className}
    `}
  >
    {children}
  </button>
);

/* ── main component ── */
export const VelvetSoleModal: React.FC<VelvetSoleModalProps> = ({
  isOpen,
  onClose,
  isMinimized,
  onMinimize,
  mode = 'generator',
  className = '',
}) => {
  /* local UI state */
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [modelType, setModelType] = useState<'realistic' | 'artistic'>('realistic');
  const [styleType, setStyleType] = useState<'classic'>('classic');

  /* side panel pop-up state */
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  /* ESC to close */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isMinimized) onClose();
    },
    [isOpen, isMinimized, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  /* body scroll lock */
  useEffect(() => {
    if (isOpen && !isMinimized) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMinimized]);

  /* ── render nothing when fully closed ── */
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* ═══════════════════════════════════════════════════════
          BACKDROP
         ═══════════════════════════════════════════════════════ */}
      <div
        className={`
          absolute inset-0 bg-black/80
          transition-opacity duration-300 ease-out
          ${isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
        onClick={!isMinimized ? onClose : undefined}
        aria-hidden="true"
      />

      {/* ═══════════════════════════════════════════════════════
          MODAL FRAME
         ═══════════════════════════════════════════════════════ */}
      <div
        className={`
          relative flex flex-col
          bg-[#1a1a1a] border border-[#333]
          shadow-2xl
          transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${
            isMinimized
              ? 'w-[280px] h-[40px] translate-y-[calc(50vh-20px)] scale-95 opacity-90'
              : 'w-[95vw] max-w-[1200px] h-[85vh] max-h-[800px] translate-y-0 scale-100 opacity-100'
          }
          ${className}
        `}
        role="dialog"
        aria-modal="true"
      >
        {/* ── Top-right window controls ── */}
        <div className="absolute top-0 right-0 flex z-10">
          <button
            onClick={onMinimize}
            className="
              w-8 h-7 flex items-center justify-center
              bg-[#2a2a2a] hover:bg-[#3a3a3a]
              text-gray-300 hover:text-white
              text-sm font-bold
              transition-colors duration-200
              border-l border-b border-[#333]
            "
            aria-label="Minimize"
            title="Minimize"
          >
            −
          </button>
          <button
            onClick={onClose}
            className="
              w-8 h-7 flex items-center justify-center
              bg-[#c0392b] hover:bg-[#e74c3c]
              text-white
              text-sm font-bold
              transition-colors duration-200
              border-l border-b border-[#333]
            "
            aria-label="Close"
            title="Close"
          >
            ×
          </button>
        </div>

        {/* ── Minimized bar (visible only when minimized) ── */}
        {isMinimized && (
          <div
            className="flex items-center h-full px-3 cursor-pointer"
            onClick={onMinimize}
          >
            <span className="text-gray-400 text-xs font-medium tracking-wide uppercase">
              VelvetSole {mode === 'generator' ? 'Generator' : 'Viewer'}
            </span>
            <span className="ml-auto text-gray-500 text-xs">Click to restore</span>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            MAIN CONTENT (hidden when minimized)
           ═══════════════════════════════════════════════════════ */}
        <div
          className={`
            flex-1 flex flex-col overflow-hidden
            transition-opacity duration-300
            ${isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `}
        >
          {/* ── Canvas + Side Panels ── */}
          <div className="flex-1 flex min-h-0">
            {/* ═══════ LEFT SIDE: Base Model Panel ═══════ */}
            {mode === 'generator' && (
              <div className="w-[180px] flex flex-col justify-end px-3 pb-2 shrink-0 relative">
                {/* Thumbnail grid – pops up when leftPanelOpen */}
                <div
                  className={`
                    flex flex-col gap-2 mb-2
                    transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                    origin-bottom
                    ${leftPanelOpen
                      ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                      : 'opacity-0 translate-y-4 scale-95 pointer-events-none absolute bottom-14 left-3 right-3'
                    }
                  `}
                >
                  {Array.from({ length: 4 }).map((_, row) => (
                    <div key={row} className="flex gap-2">
                      <PlaceholderThumb onClick={() => setLeftPanelOpen(false)} />
                      <PlaceholderThumb onClick={() => setLeftPanelOpen(false)} />
                    </div>
                  ))}
                </div>

                {/* Toggle button */}
                <div className="flex flex-col items-center gap-1 z-10">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest">
                    Choose Base Model
                  </span>
                  <button
                    onClick={() => setLeftPanelOpen((p) => !p)}
                    className={`
                      px-5 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm transition-all duration-200
                      ${leftPanelOpen
                        ? 'bg-white text-black'
                        : 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-200'
                      }
                    `}
                  >
                    {leftPanelOpen ? 'Close' : 'Choose Base'}
                  </button>
                </div>
              </div>
            )}

            {/* ═══════ CENTER: Main Canvas ═══════ */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 bg-black m-1 relative">
                {/* Canvas content goes here */}
              </div>

              {/* Bottom action bar (generator only) */}
              {mode === 'generator' && (
                <div className="h-14 flex items-center justify-center px-4 shrink-0">
                  {/* Center: Generate */}
                  <button className="
                    px-10 py-2.5
                    bg-[#0f9d58] hover:bg-[#0b8043]
                    text-white text-sm font-bold uppercase tracking-widest
                    rounded-sm
                    transition-all duration-200
                    shadow-lg shadow-green-900/30
                    hover:shadow-green-900/50
                    hover:scale-[1.02]
                    active:scale-[0.98]
                  ">
                    Generate
                  </button>
                </div>
              )}
            </div>

            {/* ═══════ RIGHT SIDE: Catalog Panel ═══════ */}
            {mode === 'generator' && (
              <div className="w-[180px] flex flex-col justify-end px-3 pb-2 shrink-0 relative">
                {/* Thumbnail grid – pops up when rightPanelOpen */}
                <div
                  className={`
                    flex flex-col gap-2 mb-2
                    transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                    origin-bottom
                    ${rightPanelOpen
                      ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                      : 'opacity-0 translate-y-4 scale-95 pointer-events-none absolute bottom-14 left-3 right-3'
                    }
                  `}
                >
                  {Array.from({ length: 4 }).map((_, row) => (
                    <div key={row} className="flex gap-2">
                      <PlaceholderThumb onClick={() => setRightPanelOpen(false)} />
                      <PlaceholderThumb onClick={() => setRightPanelOpen(false)} />
                    </div>
                  ))}
                </div>

                {/* Toggle button */}
                <div className="flex flex-col items-center gap-1 z-10">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest">
                    Browse Catalog
                  </span>
                  <button
                    onClick={() => setRightPanelOpen((p) => !p)}
                    className={`
                      px-5 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm transition-all duration-200
                      ${rightPanelOpen
                        ? 'bg-white text-black'
                        : 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-200'
                      }
                    `}
                  >
                    {rightPanelOpen ? 'Close' : 'Browse Catalog'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════
              BOTTOM SETTINGS BAR (generator only)
             ═══════════════════════════════════════════════════════ */}
          {mode === 'generator' && (
            <div className="bg-[#1e1e1e] border-t border-[#333] px-6 py-4 shrink-0">
              <div className="flex gap-8">
                {/* Column 1: Choose Media */}
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-medium">
                    Choose Media
                  </span>
                  <div className="flex gap-2">
                    <PillButton
                      active={mediaType === 'image'}
                      onClick={() => setMediaType('image')}
                    >
                      Image
                    </PillButton>
                    <PillButton
                      active={mediaType === 'video'}
                      onClick={() => setMediaType('video')}
                    >
                      Video
                    </PillButton>
                  </div>
                </div>

                {/* Column 2: Choose Model Type */}
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-medium">
                    Choose Model Type
                  </span>
                  <div className="flex gap-2">
                    <PillButton
                      active={modelType === 'realistic'}
                      onClick={() => setModelType('realistic')}
                    >
                      Realistic
                    </PillButton>
                    <PillButton
                      active={modelType === 'artistic'}
                      onClick={() => setModelType('artistic')}
                    >
                      Artistic
                    </PillButton>
                  </div>
                </div>

                {/* Column 3: Choose Style */}
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-medium">
                    Choose Style
                  </span>
                  <div className="flex gap-2">
                    <PillButton
                      active={styleType === 'classic'}
                      onClick={() => setStyleType('classic')}
                    >
                      Classic
                    </PillButton>
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