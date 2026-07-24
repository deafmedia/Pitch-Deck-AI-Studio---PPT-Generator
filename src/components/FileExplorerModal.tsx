import React from 'react';
import {
  Folder,
  FileText,
  Plus,
  Search,
  Upload,
  Download,
  Trash2,
  Copy,
  Edit3,
  X,
  Grid,
  List,
  FolderPlus,
  Check,
  Clock,
  Sparkles,
  FileSpreadsheet,
  HardDrive,
  ArrowRight,
  RefreshCw,
  FolderTree
} from 'lucide-react';
import { PitchDeck, ThemePresetId } from '../types';
import { SAMPLE_DECKS, THEME_PRESETS } from '../data/templates';
import { exportDeckToPptx } from '../lib/pptxExport';

export interface SavedDeckFile {
  id: string;
  deck: PitchDeck;
  folder: string;
  createdAt: string;
  updatedAt: string;
  isTrash?: boolean;
}

interface FileExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDeck: PitchDeck;
  onSelectDeck: (deck: PitchDeck) => void;
}

const DEFAULT_FOLDERS = [
  { id: 'all', name: 'All Files', icon: FolderTree },
  { id: 'pitch_decks', name: 'Pitch Decks', icon: Folder },
  { id: 'investor_updates', name: 'Investor Updates', icon: Folder },
  { id: 'product_demos', name: 'Product Demos', icon: Folder },
  { id: 'custom_imports', name: 'Custom Imports', icon: Folder },
  { id: 'trash', name: 'Trash', icon: Trash2 },
];

export const FileExplorerModal: React.FC<FileExplorerModalProps> = ({
  isOpen,
  onClose,
  currentDeck,
  onSelectDeck,
}) => {
  // Initialize files from localStorage or sample decks
  const [files, setFiles] = React.useState<SavedDeckFile[]>(() => {
    try {
      const saved = localStorage.getItem('ac_presentation_files_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved files from localStorage', e);
    }
    // Seed with SAMPLE_DECKS if none found
    return SAMPLE_DECKS.map((d, index) => ({
      id: d.id,
      deck: d,
      folder: index === 0 ? 'pitch_decks' : index === 1 ? 'investor_updates' : 'product_demos',
      createdAt: new Date(Date.now() - (index + 1) * 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - (index + 1) * 3600000 * 5).toISOString(),
      isTrash: false,
    }));
  });

  const [activeFolder, setActiveFolder] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  
  // Renaming File state
  const [editingFileId, setEditingFileId] = React.useState<string | null>(null);
  const [editingTitle, setEditingTitle] = React.useState<string>('');

  // Save to localStorage when files state updates
  React.useEffect(() => {
    try {
      localStorage.setItem('ac_presentation_files_v1', JSON.stringify(files));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [files]);

  // Keep active deck updated in files array
  React.useEffect(() => {
    setFiles((prevFiles) => {
      const exists = prevFiles.some((f) => f.id === currentDeck.id);
      if (exists) {
        return prevFiles.map((f) =>
          f.id === currentDeck.id
            ? { ...f, deck: currentDeck, updatedAt: new Date().toISOString() }
            : f
        );
      } else {
        return [
          ...prevFiles,
          {
            id: currentDeck.id,
            deck: currentDeck,
            folder: 'pitch_decks',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isTrash: false,
          },
        ];
      }
    });
  }, [currentDeck]);

  if (!isOpen) return null;

  // Filter files by folder and search term
  const filteredFiles = files.filter((f) => {
    if (activeFolder === 'trash') {
      if (!f.isTrash) return false;
    } else {
      if (f.isTrash) return false;
      if (activeFolder !== 'all' && f.folder !== activeFolder) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
    const matchTitle = f.deck.title.toLowerCase().includes(q);
    const matchSubtitle = f.deck.subtitle?.toLowerCase().includes(q);
    const matchCategory = f.deck.category?.toLowerCase().includes(q);
    const matchSlide = f.deck.slides.some(
      (s) => s.title.toLowerCase().includes(q) || s.subtitle?.toLowerCase().includes(q)
    );
    return matchTitle || matchSubtitle || matchCategory || matchSlide;
    }

    return true;
  });

  // Actions
  const handleOpenDeck = (file: SavedDeckFile) => {
    onSelectDeck(file.deck);
    onClose();
  };

  const handleCreateNewFile = () => {
    const newId = `deck-${Date.now()}`;
    const newDeck: PitchDeck = {
      id: newId,
      title: 'Untitled Presentation Deck',
      subtitle: 'Newly created pitch deck document.',
      author: 'Studio User',
      category: 'Pitch Deck',
      theme: 'corporate_blue',
      slides: [
        {
          id: `slide-${Date.now()}-1`,
          layout: 'title',
          eyebrow: 'NEW PRESENTATION',
          title: 'Untitled Presentation',
          subtitle: 'Double click to edit subtitle or presenter name.',
          bullets: ['Key takeaway or pitch summary point'],
          accentBadge: 'DRAFT v1',
        },
      ],
    };

    const newFile: SavedDeckFile = {
      id: newId,
      deck: newDeck,
      folder: activeFolder === 'trash' ? 'pitch_decks' : activeFolder === 'all' ? 'pitch_decks' : activeFolder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isTrash: false,
    };

    setFiles((prev) => [newFile, ...prev]);
    onSelectDeck(newDeck);
  };

  const handleDuplicateFile = (file: SavedDeckFile, e: React.MouseEvent) => {
    e.stopPropagation();
    const newId = `deck-${Date.now()}`;
    const duplicatedDeck: PitchDeck = {
      ...file.deck,
      id: newId,
      title: `${file.deck.title} (Copy)`,
    };

    const duplicatedFile: SavedDeckFile = {
      id: newId,
      deck: duplicatedDeck,
      folder: file.folder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isTrash: false,
    };

    setFiles((prev) => [duplicatedFile, ...prev]);
  };

  const handleRenameFile = (fileId: string, newTitle: string) => {
    if (!newTitle.trim()) {
      setEditingFileId(null);
      return;
    }
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? {
              ...f,
              deck: { ...f.deck, title: newTitle.trim() },
              updatedAt: new Date().toISOString(),
            }
          : f
      )
    );
    if (fileId === currentDeck.id) {
      onSelectDeck({ ...currentDeck, title: newTitle.trim() });
    }
    setEditingFileId(null);
  };

  const handleMoveToTrash = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, isTrash: true } : f))
    );
  };

  const handleRestoreFile = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, isTrash: false } : f))
    );
  };

  const handleDeletePermanently = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // Import JSON file handler
  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.slides && Array.isArray(parsed.slides)) {
          const newDeck: PitchDeck = {
            id: `imported-${Date.now()}`,
            title: parsed.title || file.name.replace(/\.[^/.]+$/, ''),
            subtitle: parsed.subtitle || 'Imported deck document',
            author: parsed.author || 'Imported',
            category: parsed.category || 'Custom Imports',
            theme: parsed.theme || 'corporate_blue',
            slides: parsed.slides,
          };

          const newFile: SavedDeckFile = {
            id: newDeck.id,
            deck: newDeck,
            folder: 'custom_imports',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isTrash: false,
          };

          setFiles((prev) => [newFile, ...prev]);
          onSelectDeck(newDeck);
          alert(`Successfully imported "${newDeck.title}"!`);
        } else {
          alert('Invalid JSON file format. Expected presentation deck JSON.');
        }
      } catch (err) {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Export JSON file
  const handleExportJson = (file: SavedDeckFile, e: React.MouseEvent) => {
    e.stopPropagation();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(file.deck, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${file.deck.title.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col text-slate-100 overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FolderTree className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white flex items-center gap-2">
                Presentation File Explorer
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-950 border border-blue-800 text-blue-300">
                  Local Sync
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Manage, browse, duplicate, and import presentation files (.pptx & .json)
              </p>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex items-center gap-2">
            {/* Import JSON / File button */}
            <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Import File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJsonFile}
                className="hidden"
              />
            </label>

            {/* Create New Presentation File */}
            <button
              onClick={handleCreateNewFile}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Deck File</span>
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body Layout: Left Sidebar + Right Grid/Table */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Folder Tree Navigation */}
          <div className="w-60 bg-slate-950/70 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 px-3 mb-2">
                Directories & Categories
              </div>
              <nav className="space-y-1">
                {DEFAULT_FOLDERS.map((folder) => {
                  const Icon = folder.icon;
                  const count = files.filter((f) => {
                    if (folder.id === 'trash') return f.isTrash;
                    if (f.isTrash) return false;
                    if (folder.id === 'all') return true;
                    return f.folder === folder.id;
                  }).length;

                  const isSelected = activeFolder === folder.id;

                  return (
                    <button
                      key={folder.id}
                      onClick={() => setActiveFolder(folder.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md font-extrabold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                        <span>{folder.name}</span>
                      </div>
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                          isSelected ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Storage Metric Footer */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-bold mb-1">
                <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                <span>Storage Overview</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {files.filter((f) => !f.isTrash).length} total presentations stored locally in browser sandbox.
              </p>
            </div>
          </div>

          {/* Right Main File Explorer Workspace */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-900/50">
            
            {/* Explorer Filter & View Controls */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0 bg-slate-900/60">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search file title, subtitle, or slide content..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* View Mode Toggle (Grid vs List) */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                    viewMode === 'grid' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                    viewMode === 'list' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Files Viewport */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredFiles.length > 0 ? (
                viewMode === 'grid' ? (
                  /* Grid Card View */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredFiles.map((file) => {
                      const isActive = file.id === currentDeck.id;
                      const theme = THEME_PRESETS[file.deck.theme] || THEME_PRESETS.corporate_blue;
                      const isEditing = editingFileId === file.id;

                      return (
                        <div
                          key={file.id}
                          onClick={() => !file.isTrash && handleOpenDeck(file)}
                          className={`group relative bg-slate-950 border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                            isActive
                              ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-xl shadow-blue-950/50 bg-slate-950/90'
                              : 'border-slate-800 hover:border-slate-700 hover:shadow-xl hover:bg-slate-900/80'
                          }`}
                        >
                          {/* File Header */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span
                                className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border"
                                style={{
                                  borderColor: `${theme.accentColor}40`,
                                  color: theme.accentColor,
                                  backgroundColor: `${theme.accentColor}10`,
                                }}
                              >
                                {theme.name}
                              </span>

                              {isActive && (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-950 text-blue-300 border border-blue-800">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                  ACTIVE
                                </span>
                              )}
                            </div>

                            {/* Deck Title */}
                            {isEditing ? (
                              <div className="flex items-center gap-1.5 my-1" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="text"
                                  autoFocus
                                  value={editingTitle}
                                  onChange={(e) => setEditingTitle(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleRenameFile(file.id, editingTitle);
                                    if (e.key === 'Escape') setEditingFileId(null);
                                  }}
                                  className="bg-slate-900 text-white font-bold text-sm px-2 py-1 rounded border border-blue-500 w-full focus:outline-none"
                                />
                                <button
                                  onClick={() => handleRenameFile(file.id, editingTitle)}
                                  className="p-1 bg-blue-600 text-white rounded hover:bg-blue-500 cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <h3 className="font-extrabold text-base text-white group-hover:text-blue-400 transition line-clamp-1">
                                {file.deck.title}
                              </h3>
                            )}

                            <p className="text-xs text-slate-400 line-clamp-2 mt-1 font-medium">
                              {file.deck.subtitle || 'PowerPoint Presentation Deck Document'}
                            </p>
                          </div>

                          {/* Slide Count & Meta Info */}
                          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                                {file.deck.slides.length} slides
                              </span>
                              <span className="text-[11px] font-medium text-slate-500">
                                Updated {new Date(file.updatedAt).toLocaleDateString()}
                              </span>
                            </div>

                            {/* Hover Actions Menu */}
                            {!file.isTrash ? (
                              <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingFileId(file.id);
                                    setEditingTitle(file.deck.title);
                                  }}
                                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                                  title="Rename File"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={(e) => handleDuplicateFile(file, e)}
                                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                                  title="Duplicate Presentation"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={(e) => exportDeckToPptx(file.deck)}
                                  className="p-1.5 hover:bg-blue-950 rounded-lg text-blue-400 hover:text-blue-300 cursor-pointer"
                                  title="Download PowerPoint (.pptx)"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={(e) => handleMoveToTrash(file.id, e)}
                                  className="p-1.5 hover:bg-red-950 rounded-lg text-red-400 hover:text-red-300 cursor-pointer"
                                  title="Move to Trash"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => handleRestoreFile(file.id, e)}
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg font-bold text-[11px] cursor-pointer"
                                  title="Restore File"
                                >
                                  Restore
                                </button>
                                <button
                                  onClick={(e) => handleDeletePermanently(file.id, e)}
                                  className="p-1.5 bg-red-950 hover:bg-red-900 text-red-300 rounded-lg font-bold text-[11px] cursor-pointer"
                                  title="Delete Permanently"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* List View Table */
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
                    <div className="px-5 py-3 bg-slate-900/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 grid grid-cols-12 gap-4">
                      <span className="col-span-5">Presentation Deck Title</span>
                      <span className="col-span-2">Theme Preset</span>
                      <span className="col-span-2">Slides</span>
                      <span className="col-span-2">Last Modified</span>
                      <span className="col-span-1 text-right">Actions</span>
                    </div>

                    {filteredFiles.map((file) => {
                      const isActive = file.id === currentDeck.id;
                      const theme = THEME_PRESETS[file.deck.theme] || THEME_PRESETS.corporate_blue;

                      return (
                        <div
                          key={file.id}
                          onClick={() => !file.isTrash && handleOpenDeck(file)}
                          className={`px-5 py-3.5 grid grid-cols-12 gap-4 items-center text-xs transition cursor-pointer ${
                            isActive ? 'bg-blue-950/40 text-blue-200' : 'hover:bg-slate-900/80 text-slate-200'
                          }`}
                        >
                          <div className="col-span-5 flex items-center gap-3">
                            <FileSpreadsheet className="w-4 h-4 text-blue-400 shrink-0" />
                            <div>
                              <div className="font-extrabold text-white flex items-center gap-2">
                                <span>{file.deck.title}</span>
                                {isActive && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-600 text-white">
                                    ACTIVE
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 truncate max-w-xs">
                                {file.deck.subtitle || file.deck.category}
                              </p>
                            </div>
                          </div>

                          <div className="col-span-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                              {theme.name}
                            </span>
                          </div>

                          <div className="col-span-2 font-mono font-bold text-slate-300">
                            {file.deck.slides.length} slides
                          </div>

                          <div className="col-span-2 text-slate-400 font-medium text-[11px]">
                            {new Date(file.updatedAt).toLocaleDateString()}
                          </div>

                          <div className="col-span-1 flex items-center justify-end gap-1.5">
                            <button
                              onClick={(e) => exportDeckToPptx(file.deck)}
                              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
                              title="Download PPTX"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => handleMoveToTrash(file.id, e)}
                              className="p-1.5 hover:bg-red-950 rounded text-red-400 hover:text-red-300 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Folder className="w-12 h-12 text-slate-600 mb-3" />
                  <h3 className="font-extrabold text-base text-slate-300">No Presentation Files Found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    No presentation documents match your search or selected folder category.
                  </p>
                  <button
                    onClick={handleCreateNewFile}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl transition cursor-pointer"
                  >
                    Create New Presentation File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
