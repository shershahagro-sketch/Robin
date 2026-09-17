import React, { useState } from 'react';
import { Download, Copy, Check, Terminal, FileCode, FolderArchive, ShieldCheck, Play, Sparkles } from 'lucide-react';
import { ThemeConfig } from '../../types';
import { DESKTOP_SOURCE_FILES, WINDOWS_BUILD_COMMANDS, SourceCodeFile } from '../../data/desktopSourceCode';
import { sounds } from '../../services/soundEffects';

interface DesktopAppViewProps {
  currentTheme: ThemeConfig;
}

export const DesktopAppView: React.FC<DesktopAppViewProps> = ({ currentTheme }) => {
  const [selectedFile, setSelectedFile] = useState<SourceCodeFile>(DESKTOP_SOURCE_FILES[1]); // app/main.py
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [copiedCmdIdx, setCopiedCmdIdx] = useState<number | null>(null);

  const copyCode = (content: string, path: string) => {
    sounds.playClick();
    navigator.clipboard.writeText(content);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const copyCommand = (cmd: string, idx: number) => {
    sounds.playClick();
    navigator.clipboard.writeText(cmd);
    setCopiedCmdIdx(idx);
    setTimeout(() => setCopiedCmdIdx(null), 2000);
  };

  const downloadFile = (file: SourceCodeFile) => {
    sounds.playClick();
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.path.split(/[\/\\]/).pop() || 'file.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAllAsText = () => {
    sounds.playSuccessTone();
    let combined = `# ROBIN JARVIS AI COMMAND CENTER — COMPLETE PYTHON CODEBASE\n\n`;
    DESKTOP_SOURCE_FILES.forEach((f) => {
      combined += `\n\n======================================================\n`;
      combined += `FILE: ${f.path}\n`;
      combined += `DESCRIPTION: ${f.description}\n`;
      combined += `======================================================\n\n`;
      combined += f.content;
    });

    const blob = new Blob([combined], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ROBIN_JARVIS_WINDOWS_DESKTOP_SOURCE.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="view-desktop-packaging" className="space-y-4 max-w-7xl mx-auto font-mono text-slate-200">
      {/* Banner */}
      <div
        className="p-5 rounded-xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        style={{
          backgroundColor: currentTheme.panelBg,
          borderColor: currentTheme.panelBorder,
        }}
      >
        <div>
          <div className="flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-sky-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              WINDOWS DESKTOP APPLICATION & ROBIN_SETUP.EXE INSTALLER
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            The full, native Python Windows automation codebase (PySide6, pywin32, Playwright, pyttsx3, SpeechRecognition) and Inno Setup script to generate the official <code className="text-sky-300">ROBIN_SETUP.exe</code> installer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-download-all-desktop-code"
            onClick={downloadAllAsText}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white transition-all shadow-md active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download All Python Files (.txt)</span>
          </button>
        </div>
      </div>

      {/* Build & Compilation Workflow Guide */}
      <div
        className="p-4 rounded-xl border space-y-3"
        style={{
          backgroundColor: currentTheme.panelBg,
          borderColor: currentTheme.panelBorder,
        }}
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-white">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Windows CLI Compilation & Setup Commands</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {WINDOWS_BUILD_COMMANDS.map((step, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-black/50 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="text-[11px] font-bold text-sky-300 mb-1">{step.title}</div>
                <pre className="p-2 rounded bg-slate-950 text-[11px] text-slate-300 overflow-x-auto select-all border border-slate-900">
                  {step.code}
                </pre>
              </div>

              <div className="pt-2 mt-2 border-t border-slate-800/80 flex justify-end">
                <button
                  onClick={() => copyCommand(step.code, idx)}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-850 hover:bg-slate-800 transition-colors"
                >
                  {copiedCmdIdx === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Command</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Source Code Viewer Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Files List */}
        <div
          className="p-4 rounded-xl border space-y-2"
          style={{
            backgroundColor: currentTheme.panelBg,
            borderColor: currentTheme.panelBorder,
          }}
        >
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            PYTHON APPLICATION ARTIFACTS
          </div>

          <div className="space-y-1.5">
            {DESKTOP_SOURCE_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedFile(file);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all flex flex-col ${
                    isSelected
                      ? 'bg-sky-500/15 border-sky-500/50 text-white'
                      : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <FileCode className="w-3.5 h-3.5 text-sky-400" />
                    <span>{file.path}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {file.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div
          className="lg:col-span-2 p-4 rounded-xl border space-y-3"
          style={{
            backgroundColor: currentTheme.panelBg,
            borderColor: currentTheme.panelBorder,
          }}
        >
          <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: currentTheme.panelBorder }}>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>{selectedFile.path}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-sky-300 uppercase">
                  {selectedFile.language}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">{selectedFile.description}</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyCode(selectedFile.content, selectedFile.path)}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all"
              >
                {copiedPath === selectedFile.path ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy File</span>
                  </>
                )}
              </button>

              <button
                onClick={() => downloadFile(selectedFile)}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white transition-all shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save File</span>
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-lg bg-black/75 border border-slate-800 text-xs text-slate-300 font-mono overflow-x-auto max-h-[500px] leading-relaxed">
            <code>{selectedFile.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
