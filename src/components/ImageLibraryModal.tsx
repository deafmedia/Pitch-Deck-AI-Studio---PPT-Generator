import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Image as ImageIcon,
  Sparkles,
  Upload,
  Check,
  Plus,
  Trash2,
  Tag,
  Shield,
  Rocket,
  Globe,
  BarChart3,
  Users,
  Cpu,
  Layers,
  Zap,
  Heart,
  Award,
  Smartphone,
  Laptop,
  Cloud,
  Video,
  Film,
  FileText,
  Target,
  CheckCircle2,
  FolderOpen,
  ArrowUpRight,
  HardDrive
} from 'lucide-react';
import { SlideData } from '../types';

interface ImageLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  slide: SlideData;
  onUpdateSlide: (updated: SlideData) => void;
}

export interface UploadedMediaAsset {
  id: string;
  name: string;
  url: string;
  size?: string;
  type: string;
  createdAt: string;
}

interface StockImage {
  id: string;
  title: string;
  category: 'Business' | 'Tech' | 'Analytics' | 'Accessibility' | 'Abstract';
  url: string;
  author: string;
}

const STOCK_LIBRARY: StockImage[] = [
  {
    id: '1',
    title: 'Modern Corporate Office & Workspace',
    category: 'Business',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    author: 'Unsplash Workplace'
  },
  {
    id: '2',
    title: 'Executive Boardroom Strategy Presentation',
    category: 'Business',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
    author: 'Unsplash Meeting'
  },
  {
    id: '3',
    title: 'AI & Data Analytics Dashboard Visualization',
    category: 'Analytics',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
    author: 'Unsplash Tech'
  },
  {
    id: '4',
    title: 'Artificial Intelligence Neural Network Code',
    category: 'Tech',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    author: 'Unsplash AI'
  },
  {
    id: '5',
    title: 'Indian Sign Language (ISL) Interpreter Studio',
    category: 'Accessibility',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80',
    author: 'Unsplash Accessibility'
  },
  {
    id: '6',
    title: 'Cybersecurity Cloud Server Architecture',
    category: 'Tech',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80',
    author: 'Unsplash Security'
  },
  {
    id: '7',
    title: 'Mobile App UX Wireframes & UI Kit Design',
    category: 'Tech',
    url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1000&q=80',
    author: 'Unsplash UX'
  },
  {
    id: '8',
    title: 'Financial Growth Chart & Quarterly Revenue Metrics',
    category: 'Analytics',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
    author: 'Unsplash Finance'
  },
  {
    id: '9',
    title: 'Creative Collaboration & Team Brainstorming',
    category: 'Business',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
    author: 'Unsplash Team'
  },
  {
    id: '10',
    title: 'Abstract Gradient Minimalist Background Accent',
    category: 'Abstract',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    author: 'Unsplash Design'
  }
];

const ICON_LIBRARY = [
  { name: 'Sparkles', icon: Sparkles, label: 'AI Sparkles', group: 'Tech' },
  { name: 'Shield', icon: Shield, label: 'Cybersecurity', group: 'Tech' },
  { name: 'Rocket', icon: Rocket, label: 'Launch & Pitch', group: 'Business' },
  { name: 'Target', icon: Target, label: 'OKRs & Goals', group: 'Business' },
  { name: 'Globe', icon: Globe, label: 'Global Network', group: 'Business' },
  { name: 'BarChart3', icon: BarChart3, label: 'Analytics & ROI', group: 'Analytics' },
  { name: 'Users', icon: Users, label: 'Team & Customers', group: 'Business' },
  { name: 'Cpu', icon: Cpu, label: 'Hardware & AI', group: 'Tech' },
  { name: 'Layers', icon: Layers, label: 'Tech Stack', group: 'Tech' },
  { name: 'Zap', icon: Zap, label: 'Speed & Power', group: 'Analytics' },
  { name: 'Heart', icon: Heart, label: 'Empathy & Impact', group: 'Accessibility' },
  { name: 'Award', icon: Award, label: 'Certification', group: 'Business' },
  { name: 'Smartphone', icon: Smartphone, label: 'Mobile App', group: 'Tech' },
  { name: 'Laptop', icon: Laptop, label: 'SaaS Web Platform', group: 'Tech' },
  { name: 'Cloud', icon: Cloud, label: 'Cloud Storage', group: 'Tech' },
  { name: 'Video', icon: Video, label: 'Live Stream', group: 'Accessibility' },
];

export const ImageLibraryModal: React.FC<ImageLibraryModalProps> = ({
  isOpen,
  onClose,
  slide,
  onUpdateSlide,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'photos' | 'icons'>('upload');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [insertTarget, setInsertTarget] = useState<'featured' | 'item'>('featured');
  const [lastInsertedNotice, setLastInsertedNotice] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Persistence for user uploaded media assets
  const [uploadedAssets, setUploadedAssets] = useState<UploadedMediaAsset[]>(() => {
    try {
      const saved = localStorage.getItem('ac_uploaded_media_assets_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load uploaded assets from localStorage', e);
    }
    return [
      {
        id: 'sample-1',
        name: 'Company_Logo_Dark.png',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        size: '240 KB',
        type: 'image/png',
        createdAt: new Date().toISOString(),
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('ac_uploaded_media_assets_v1', JSON.stringify(uploadedAssets));
    } catch (e) {
      console.warn('Failed to save uploaded assets', e);
    }
  }, [uploadedAssets]);

  if (!isOpen) return null;

  const handleInsertImage = (url: string, title: string) => {
    if (insertTarget === 'featured') {
      onUpdateSlide({
        ...slide,
        imageUrl: url,
        mediaCaption: title,
      });
      setLastInsertedNotice(`Inserted as Slide Featured Image: "${title}"`);
    } else {
      const existingItems = slide.items || [];
      const newItem = {
        id: `item-${Date.now()}`,
        title: title,
        subtitle: `Custom uploaded asset (${title})`,
        metric: 'Media Asset',
        detail: 'Uploaded via ALL CREATE STUDIO File Browser',
      };
      onUpdateSlide({
        ...slide,
        items: [...existingItems, newItem],
      });
      setLastInsertedNotice(`Inserted into Slide Content Grid: "${title}"`);
    }

    setTimeout(() => {
      setLastInsertedNotice(null);
    }, 3000);
  };

  const handleSelectIcon = (iconName: string, label: string) => {
    onUpdateSlide({
      ...slide,
      iconName: iconName,
    });
    setLastInsertedNotice(`Set slide feature icon to: "${label}"`);
    setTimeout(() => {
      setLastInsertedNotice(null);
    }, 3000);
  };

  const processFiles = (files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Url = reader.result as string;
          const formattedSize = `${(file.size / 1024).toFixed(1)} KB`;
          const newAsset: UploadedMediaAsset = {
            id: `asset-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: file.name,
            url: base64Url,
            size: formattedSize,
            type: file.type,
            createdAt: new Date().toISOString(),
          };
          setUploadedAssets((prev) => [newAsset, ...prev]);
          handleInsertImage(base64Url, file.name);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please upload standard image formats (PNG, JPG, WEBP, SVG, GIF).');
      }
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleDeleteAsset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedAssets((prev) => prev.filter((a) => a.id !== id));
  };

  // Filtered lists
  const filteredUploaded = uploadedAssets.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredImages = STOCK_LIBRARY.filter((img) => {
    const matchesCategory = selectedCategory === 'All' || img.category === selectedCategory;
    const matchesQuery =
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const filteredIcons = ICON_LIBRARY.filter((ic) => {
    const matchesCategory = selectedCategory === 'All' || ic.group === selectedCategory;
    const matchesQuery =
      ic.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ic.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 via-indigo-600 to-slate-900 rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight flex items-center gap-2">
                File & Media Upload Browser
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-wide">
                  Local Drag & Drop
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Upload images directly from your computer, browse your local asset library, or select stock graphics.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-200/80 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Bar */}
        {lastInsertedNotice && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 flex items-center gap-2 shadow-inner animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{lastInsertedNotice}</span>
          </div>
        )}

        {/* Search & Insertion Target Bar */}
        <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search uploaded files or stock..."
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Target Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 w-full sm:w-auto text-xs font-bold">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase px-2">Apply To:</span>
            <button
              onClick={() => setInsertTarget('featured')}
              className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg transition cursor-pointer ${
                insertTarget === 'featured' ? 'bg-white text-blue-700 shadow-2xs font-black' : 'text-slate-600'
              }`}
            >
              Main Slide Image
            </button>
            <button
              onClick={() => setInsertTarget('item')}
              className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg transition cursor-pointer ${
                insertTarget === 'item' ? 'bg-white text-blue-700 shadow-2xs font-black' : 'text-slate-600'
              }`}
            >
              Content Card Grid
            </button>
          </div>
        </div>

        {/* Tab Selector Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload & Local Files ({uploadedAssets.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('photos')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Stock Photos</span>
            </button>

            <button
              onClick={() => setActiveTab('icons')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'icons'
                  ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vector Icons</span>
            </button>
          </div>

          {activeTab === 'photos' && (
            <div className="flex items-center gap-1 overflow-x-auto">
              {['All', 'Business', 'Tech', 'Analytics', 'Accessibility'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase transition cursor-pointer ${
                    selectedCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 bg-slate-50/50">
          {/* TAB 1: FILE UPLOAD BROWSER & DRAG DROP ZONE */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              {/* Interactive Drag & Drop Box */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer ${
                  isDragging
                    ? 'border-blue-600 bg-blue-50/90 scale-[1.01] shadow-xl'
                    : 'border-blue-300 hover:border-blue-500 bg-white shadow-xs'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition ${
                  isDragging ? 'bg-blue-600 text-white animate-bounce' : 'bg-blue-50 text-blue-600'
                }`}>
                  <Upload className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    {isDragging ? 'Drop Image Files Here Now!' : 'Drag & Drop Images from Your Computer'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Supports PNG, JPG, WEBP, SVG, GIF up to 10MB per file.
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer shadow-md shadow-blue-500/20 active:scale-95">
                  <FolderOpen className="w-4 h-4" />
                  <span>Browse Computer Files</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Uploaded Files Gallery */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-blue-600" />
                    My Uploaded Files ({filteredUploaded.length})
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Stored locally in browser session
                  </span>
                </div>

                {filteredUploaded.length === 0 ? (
                  <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs font-medium">
                    No files uploaded yet. Drag an image into the box above to get started!
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {filteredUploaded.map((asset) => (
                      <div
                        key={asset.id}
                        className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-blue-400 transition flex flex-col"
                      >
                        <div className="relative aspect-video bg-slate-900 overflow-hidden">
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <button
                            type="button"
                            onClick={(e) => handleDeleteAsset(asset.id, e)}
                            className="absolute top-1.5 right-1.5 p-1 bg-slate-950/80 hover:bg-red-600 text-white rounded-lg transition opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Delete file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="p-2.5 flex-1 flex flex-col justify-between space-y-1.5">
                          <div>
                            <p className="font-extrabold text-[11px] text-slate-800 truncate" title={asset.name}>
                              {asset.name}
                            </p>
                            {asset.size && (
                              <p className="text-[10px] text-slate-400 font-mono font-medium">{asset.size}</p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleInsertImage(asset.url, asset.name)}
                            className="w-full py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-lg text-[10px] font-black flex items-center justify-center gap-1 transition cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Insert Slide</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: STOCK PHOTOS GRID */}
          {activeTab === 'photos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-400 transition flex flex-col"
                >
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-slate-950/75 backdrop-blur-xs text-white text-[9px] font-black uppercase rounded-md">
                      {img.category}
                    </span>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <h4 className="font-extrabold text-xs text-slate-800 line-clamp-1" title={img.title}>
                      {img.title}
                    </h4>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 font-medium">{img.author}</span>
                      <button
                        onClick={() => handleInsertImage(img.url, img.title)}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Insert</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: VECTOR ICONS GRID */}
          {activeTab === 'icons' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {filteredIcons.map((ic) => {
                const IconComp = ic.icon;
                const isSelected = slide.iconName === ic.name;
                return (
                  <button
                    key={ic.name}
                    onClick={() => handleSelectIcon(ic.name, ic.label)}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition cursor-pointer group ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-blue-50'
                    }`}
                  >
                    <IconComp className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
                    <span className="text-[11px] font-extrabold text-center line-clamp-1">{ic.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Active Target: <strong className="text-slate-800">Slide #{slide.id} ({slide.title || 'Untitled'})</strong>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
