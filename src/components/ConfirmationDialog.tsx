import React from 'react';
import { AlertTriangle, ShieldAlert, X, Check } from 'lucide-react';
import { ThemeConfig } from '../types';
import { sounds } from '../services/soundEffects';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  actionName: string;
  onConfirm: () => void;
  onCancel: () => void;
  currentTheme: ThemeConfig;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  actionName,
  onConfirm,
  onCancel,
  currentTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        id="robin-confirmation-modal"
        className="w-full max-w-lg rounded-2xl border border-rose-600/60 bg-slate-950 p-6 shadow-2xl font-mono text-slate-200"
        style={{
          boxShadow: '0 0 50px rgba(225, 29, 72, 0.35)',
        }}
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-700/80 text-rose-400 shrink-0">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white uppercase tracking-wider">
                SECURITY BARRIER
              </span>
              <span className="text-xs text-rose-400 font-bold">HIGH RISK OPERATION</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">{title || 'Explicit Confirmation Mandated'}</h3>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-black/50 border border-slate-800 text-xs text-slate-300 leading-relaxed mb-6 space-y-2">
          <p className="font-semibold text-rose-300">
            {message || 'You are requesting an operation that may modify or permanently remove system files, kill active processes, or alter security state.'}
          </p>
          <p className="text-[11px] text-slate-400">
            Target Operation: <span className="font-mono text-white underline">{actionName}</span>
          </p>
          <p className="text-[10px] text-slate-500">
            ROBIN Security Engine has halted automated execution pending explicit human verification.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            id="btn-cancel-high-risk"
            onClick={() => {
              sounds.playClick();
              onCancel();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-500 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-all"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel Operation</span>
          </button>

          <button
            id="btn-confirm-high-risk"
            onClick={() => {
              sounds.playSuccessTone();
              onConfirm();
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/40 transition-all active:scale-95"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Authorize & Execute</span>
          </button>
        </div>
      </div>
    </div>
  );
};
