# All Create Studio — PowerPoint Presentation & AI Deck Suite

**All Create Studio** is a full-featured, interactive PowerPoint presentation editor, AI deck builder, and live streaming studio with sign language interpreter integration.

---

## 🌟 Key Features

### 🔐 1. Authentication & Account Management
* **First Screen Auth Flow**: Complete Sign In, Sign Up, and Password Reset screens with validation and status feedback.
* **Quick Social Authentication**: Instant demo sign-in options for Google, Microsoft, and GitHub.
* **Guest Mode**: Allows instant studio exploration without forcing account creation.
* **Profile Persistence**: User sessions, roles, and avatar profiles saved in browser `localStorage`.

### 📂 2. Presentation File Explorer
* **Categorized Directories**: Organize presentation files into *Pitch Decks*, *Investor Updates*, *Product Demos*, *Custom Imports*, and *Trash*.
* **Local Synchronization**: Files persist automatically in browser storage with file metadata.
* **Import & Export**:
  * Native `.pptx` PowerPoint file generation via `pptxgenjs`.
  * `.json` file import and export for backup and migration.
* **File Operations**: Duplicate decks, rename titles, restore deleted files, or delete permanently.

### 🎨 3. Interactive Slide Canvas & Studio
* **Multiple Slide Layouts**: Title, Split Content, Feature Grid, Metric Highlight, Big Stat, Timeline, and Bullet Lists.
* **Theme Engine**: Preset design themes (*Corporate Blue*, *Emerald Tech*, *Midnight Dark*, *Sunset Warmth*, *Violet Glow*).
* **Global Search Overlay (⌘K / /)**: Instant keyboard-driven slide search matching titles, subtitles, and body text.
* **Global Undo & Redo (⌘Z / ⌘Y)**: 30-step history stack for deck modifications with keyboard shortcuts.

### 🎥 4. Live Stream & Sign Language Interpreter Studio
* **Multi-Host Streaming**: Simultaneous webcam support for Presenter, Sign Language Interpreter, and Co-host.
* **Interpreter Video Overlay**: Picture-in-picture and side-by-side stream layouts designed specifically for accessible presentations.
* **Live Stream Broadcast**: Simulated broadcast output with controls for mic/camera toggles and layout switches.

### ✏️ 5. Drawing Annotations & Presentation Mode
* **Canvas Annotations**: Draw shapes, highlight text, and add freehand annotations during live presentations or preparation.
* **Keyboard Drawing Hotkeys**: Instant undo/redo support for canvas drawings.
* **Fullscreen Interactive Presentation Mode**: Smooth slide navigation, presenter notes, timer, and pointer tools.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation

1. Install required dependencies:
   ```bash
   npm install
   ```

2. Start the development server (runs on port `3000`):
   ```bash
   npm run dev
   ```

3. Open your browser at `http://localhost:3000`.

---

## 🛠️ Project Structure

```
├── src/
│   ├── components/
│   │   ├── AuthScreen.tsx            # First page Sign In / Sign Up / Forgot Password
│   │   ├── FileExplorerModal.tsx     # Presentation file directory explorer modal
│   │   ├── Navbar.tsx                # Top navigation header, theme selector, ⌘K search
│   │   ├── SlideCanvas.tsx           # Slide rendering & live editing engine
│   │   ├── AnnotationCanvas.tsx      # Drawing overlay canvas
│   │   ├── LiveStreamStudio.tsx      # Multi-camera & Sign Language Interpreter studio
│   │   ├── PresentationMode.tsx      # Fullscreen interactive presentation mode
│   │   ├── AiDeckModal.tsx           # AI-powered deck generation dialog
│   │   ├── ExportModal.tsx           # PowerPoint (.pptx) & JSON export modal
│   │   └── SlideThumbnails.tsx       # Left sidebar slide list & reordering
│   ├── data/
│   │   └── templates.ts              # Preset decks & theme color definitions
│   ├── lib/
│   │   └── pptxExport.ts             # pptxgenjs PowerPoint conversion library
│   ├── types.ts                      # Shared TypeScript data models
│   ├── App.tsx                       # Primary studio layout & state engine
│   └── main.tsx                      # Vite React entry point
├── server.ts                         # Express server with Vite middleware integration
└── package.json                      # Project dependencies & scripts
```

---

## 📦 Scripts

* `npm run dev`: Starts the development server using `tsx server.ts`.
* `npm run build`: Bundles the client app with Vite and compiles `server.ts` with esbuild.
* `npm run start`: Runs the production CommonJS bundle from `dist/server.cjs`.
* `npm run lint`: Validates TypeScript type safety without emitting files.

---

## 📄 License

Distributed under the MIT License.
