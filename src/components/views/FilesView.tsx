import React, { useState } from 'react';
import {
  Folder,
  FileText,
  Search,
  Plus,
  Trash2,
  FolderPlus,
  FileCode,
  FileSpreadsheet,
  AlertTriangle,
  HardDrive,
  Sparkles,
  ExternalLink,
  Clock,
  ArrowUpDown,
} from 'lucide-react';
import { VirtualFile, ThemeConfig } from '../../types';
import { sounds } from '../../services/soundEffects';

interface FilesViewProps {
  files: VirtualFile[];
  currentTheme: ThemeConfig;
  onCreateFile: (name: string, content: string) => void;
  onCreateFolder: (name: string) => void;
  onDeleteRequest: (file: VirtualFile) => void;
  onOrganizeDownloads: () => void;
  onFindLargeFiles: () => void;
}

export const FilesView: React.FC<FilesViewProps> = ({
  files,
  currentTheme,
  onCreateFile,
  onCreateFolder,
  onDeleteRequest,
  onOrganizeDownloads,
  onFindLargeFiles,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<VirtualFile | null>(files[1] || files[0]);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [activeFolderFilter, setActiveFolderFilter] = useState<string>('ALL');

  const filteredFiles = files.filter((f) => {
    if (activeFolderFilter !== 'ALL') {
      if (!f.path.toLowerCase().includes(activeFolderFilter.toLowerCase())) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.path.toLowerCase().includes(q) ||
        (f.extension && f.extension.toLowerCase().includes(q)) ||
        (f.content && f.content.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getFileIcon = (file: VirtualFile) => {
    if (file.type === 'folder') return <Folder className="w-4 h-4 text-amber-400" />;
    switch (file.extension) {
      case 'py':
      case 'ts':
      case 'json':
        return <FileCode className="w-4 h-4 text-sky-400" />;
      case 'csv':
      case 'xlsx':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
      case 'pdf':
        return <FileText className="w-4 h-4 text-rose-400" />;
      case 'md':
        return <FileText className="w-4 h-4 text-purple-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    sounds.playSuccessTone();
    onCreateFile(newFileName.trim(), newFileContent);
    setNewFileName('');
    setNewFileContent('');
    setIsCreatingFile(false);
  };

  return (
    <div id="view-file-manager" className="space-y-4 max-w-7xl mx-auto font-mono text-slate-200">
      {/* Top Header & Fast Action Toolbar */}
      <div
        className="p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3"
        style={{
          backgroundColor: currentTheme.panelBg,
          borderColor: currentTheme.panelBorder,
        }}
      >
        <div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              WINDOWS FILE & STORAGE CONTROLLER
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse Windows workspace folders (Desktop, Documents, Downloads). All file operations operate with safety confirmation gates.
          </p>
        </div>

        {/* Quick File Operations */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-organize-downloads"
            onClick={() => {
              sounds.playClick();
              onOrganizeDownloads();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition-all"
            title="Auto-categorize downloads by extension"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Organize Downloads</span>
          </button>

          <button
            id="btn-find-large-files"
            onClick={() => {
              sounds.playClick();
              onFindLargeFiles();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition-all"
            title="Identify files consuming > 100MB disk"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
            <span>Scan Large Files</span>
          </button>

          <button
            id="btn-new-file-dialog"
            onClick={() => {
              sounds.playClick();
              setIsCreatingFile(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white transition-all shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New File</span>
          </button>
        </div>
      </div>

      {/* New File Modal / Form */}
      {isCreatingFile && (
        <form
          onSubmit={handleCreateSubmit}
          className="p-4 rounded-xl border border-sky-500/40 bg-slate-900/90 space-y-3 animate-fadeIn"
        >
          <div className="flex items-center justify-between text-xs font-bold text-sky-300 uppercase">
            <span>Create New File</span>
            <button
              type="button"
              onClick={() => setIsCreatingFile(false)}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="Filename (e.g. script.py, report.md, data.json)"
              className="md:col-span-1 bg-black/50 border border-slate-700 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-sky-400 font-mono"
            />
            <input
              type="text"
              value={newFileContent}
              onChange={(e) => setNewFileContent(e.target.value)}
              placeholder="Initial text contents..."
              className="md:col-span-2 bg-black/50 border border-slate-700 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-sky-400 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white transition-all"
          >
            Save File to Drive
          </button>
        </form>
      )}

      {/* Main File Browser Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Directory & File List */}
        <div
          className="lg:col-span-2 p-4 rounded-xl border space-y-3"
          style={{
            backgroundColor: currentTheme.panelBg,
            borderColor: currentTheme.panelBorder,
          }}
        >
          {/* Search and Directory Filter Pills */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                id="input-search-files"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search file name, extension or content..."
                className="w-full bg-slate-900/90 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-400"
              />
            </div>

            <div className="flex items-center gap-1 text-[11px] w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {['ALL', 'Desktop', 'Documents', 'Downloads'].map((dir) => (
                <button
                  key={dir}
                  onClick={() => setActiveFolderFilter(dir)}
                  className={`px-2.5 py-1 rounded border transition-colors whitespace-nowrap ${
                    activeFolderFilter === dir
                      ? 'bg-sky-500/20 text-sky-300 border-sky-400/50 font-bold'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>

          {/* Files Table */}
          <div className="divide-y divide-slate-800/80 max-h-[500px] overflow-y-auto">
            {filteredFiles.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No matching files found on Windows virtual storage.
              </div>
            ) : (
              filteredFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedFile(file);
                  }}
                  className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-all ${
                    selectedFile?.id === file.id
                      ? 'bg-sky-500/15 border border-sky-500/40 text-white'
                      : 'hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    {getFileIcon(file)}
                    <div>
                      <div className="text-xs font-bold text-slate-100 truncate">{file.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{file.path}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 shrink-0">
                    <span>{file.sizeFormatted}</span>
                    <span className="hidden sm:inline text-slate-500">{file.modified}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sounds.playClick();
                        onDeleteRequest(file);
                      }}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="Safely Delete File"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: File Preview & Metadata Inspector */}
        <div
          className="p-4 rounded-xl border space-y-4"
          style={{
            backgroundColor: currentTheme.panelBg,
            borderColor: currentTheme.panelBorder,
          }}
        >
          {selectedFile ? (
            <>
              <div className="border-b pb-3" style={{ borderColor: currentTheme.panelBorder }}>
                <div className="flex items-center gap-2 mb-1">
                  {getFileIcon(selectedFile)}
                  <h3 className="text-sm font-bold text-white truncate">{selectedFile.name}</h3>
                </div>
                <div className="text-[10px] text-slate-400 break-all">{selectedFile.path}</div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>File Type:</span>
                  <span className="text-white uppercase font-bold">{selectedFile.extension || selectedFile.type}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Size on Disk:</span>
                  <span className="text-white font-bold">{selectedFile.sizeFormatted}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Last Modified:</span>
                  <span className="text-slate-300">{selectedFile.modified}</span>
                </div>
              </div>

              {/* File Content Preview */}
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  CONTENT PREVIEW
                </span>
                <div className="mt-1 p-3 rounded-lg bg-black/60 border border-slate-800 text-[11px] text-slate-300 font-mono max-h-56 overflow-y-auto whitespace-pre-wrap">
                  {selectedFile.content || '(Binary file or empty directory container)'}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    onDeleteRequest(selectedFile);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/80 text-rose-300 text-xs font-bold transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete via Security Gate</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select a file or folder to preview.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
