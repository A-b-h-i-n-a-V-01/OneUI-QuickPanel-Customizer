import { useState, useRef } from 'react';
import { PhoneMockup } from './components/PhoneMockup';
import { QuickPanelCanvas, type QuickPanelCanvasRef } from './components/QuickPanelCanvas';
import { DropzoneCard } from './components/DropzoneCard';
import { LayersPanel } from './components/LayersPanel';
import { type ShapeConfig } from './components/OverlayShape';
import {
  FileImage,
  Sparkles,
  Settings2,
  Download,
  RefreshCw,
  AlignCenter,
  Eye,
  Info,
  Sliders,
  ChevronRight,
  Smartphone,
  PlusSquare,
} from 'lucide-react';

function App() {
  // Image URL state
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [wallpaperUrl, setWallpaperUrl] = useState<string | null>(null);

  // Overlay opacity
  const [screenshotOpacity, setScreenshotOpacity] = useState<number>(0.65);

  // Wallpaper transform info (for display)
  const [wallpaperScale, setWallpaperScale] = useState<number>(1);
  const [wallpaperPos, setWallpaperPos] = useState({ x: 0, y: 0 });

  // Overlay shapes (manual card alignment)
  const [shapes, setShapes] = useState<ShapeConfig[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

  // Canvas ref for imperative actions
  const canvasRef = useRef<QuickPanelCanvasRef>(null);

  // Scroll ref for editor section
  const editorSectionRef = useRef<HTMLDivElement>(null);

  const scrollToEditor = () => {
    setTimeout(() => {
      editorSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // File selection handlers
  const handleScreenshotSelect = (file: File) => {
    setScreenshotUrl(URL.createObjectURL(file));
    scrollToEditor();
  };

  const handleWallpaperSelect = (file: File) => {
    setWallpaperUrl(URL.createObjectURL(file));
  };

  // Canvas imperative controls
  const handleReset = () => canvasRef.current?.reset();
  const handleCenter = () => canvasRef.current?.center();
  const handleDownload = () => {
    const dataUrl = canvasRef.current?.exportImage();
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = 'diy-oneui-quickpanel.png';
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Shape management
  const addShape = () => {
    const id = `shape-${Date.now()}`;
    const newShape: ShapeConfig = {
      id,
      name: `Card ${shapes.length + 1}`,
      x: 60,
      y: 60 + shapes.length * 30,
      width: 200,
      height: 90,
      rotation: 0,
      cornerRadius: 14,
      opacity: 0.45,
      visible: true,
      fillColor: 'rgba(79,140,255,0.18)',
      strokeColor: '#4F8CFF',
    };
    setShapes((prev) => [...prev, newShape]);
    setSelectedShapeId(id);
  };

  const updateShape = (updated: ShapeConfig) =>
    setShapes((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));

  const renameShape = (id: string, newName: string) =>
    setShapes((prev) => prev.map((s) => (s.id === id ? { ...s, name: newName } : s)));

  const deleteShape = (id: string) => {
    setShapes((prev) => prev.filter((s) => s.id !== id));
    if (selectedShapeId === id) setSelectedShapeId(null);
  };

  const duplicateShape = (id: string) => {
    const orig = shapes.find((s) => s.id === id);
    if (!orig) return;
    const dupId = `shape-${Date.now()}`;
    setShapes((prev) => [...prev, { ...orig, id: dupId, name: `${orig.name} copy`, x: orig.x + 20, y: orig.y + 20 }]);
    setSelectedShapeId(dupId);
  };

  const toggleVisibility = (id: string) =>
    setShapes((prev) => prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)));

  const moveShapeUp = (id: string) => {
    const idx = shapes.findIndex((s) => s.id === id);
    if (idx < shapes.length - 1) {
      const next = [...shapes];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      setShapes(next);
    }
  };

  const moveShapeDown = (id: string) => {
    const idx = shapes.findIndex((s) => s.id === id);
    if (idx > 0) {
      const next = [...shapes];
      [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
      setShapes(next);
    }
  };

  // Step computation
  const currentStep = !screenshotUrl ? 1 : !wallpaperUrl ? 2 : 3;

  return (
    <div className="min-h-screen bg-[#0F1115] text-white flex flex-col antialiased selection:bg-[#4F8CFF] selection:text-white pb-16">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4F8CFF] to-[#3770E0] flex items-center justify-center font-bold text-white text-lg shadow-lg">
            UI
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-none">DIY OneUI</h1>
            <span className="text-[10px] font-medium text-gray-500 tracking-wide uppercase">
              Samsung Quick Panel Background Editor
            </span>
          </div>
        </div>
        <a
          href="#editor"
          onClick={(e) => { e.preventDefault(); scrollToEditor(); }}
          className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#181A20] border border-white/5 hover:bg-white/5 transition-smooth"
        >
          Launch Editor
        </a>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6 text-center max-w-4xl mx-auto flex flex-col items-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#4F8CFF]/10 blur-[100px] pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#4F8CFF] text-xs font-semibold mb-6">
          <Sparkles size={13} /> Samsung Galaxy Customization Tool
        </div>
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
          Create Stunning Samsung <br />
          <span className="bg-gradient-to-r from-[#4F8CFF] to-[#8eb5ff] bg-clip-text text-transparent">
            Quick Panel Backgrounds
          </span>
        </h2>
        <p className="text-base md:text-lg text-gray-400 max-w-2xl mb-10 leading-relaxed">
          Upload your Samsung Quick Panel screenshot and your favourite wallpaper.
          Manually align transparent card overlays, then export a pixel-perfect background image.
        </p>
        {!screenshotUrl && (
          <button
            onClick={scrollToEditor}
            className="flex items-center gap-2.5 px-8 py-4 bg-[#4F8CFF] hover:bg-[#3770E0] text-white font-semibold rounded-2xl shadow-lg transition-smooth transform hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
          >
            <Smartphone size={18} /> Get Started
          </button>
        )}
      </section>

      {/* ── Progress Stepper ── */}
      <div className="max-w-5xl mx-auto w-full px-6 mb-12">
        <div className="glass-card rounded-2xl p-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 border border-white/5">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold">
            <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs">i</span>
            Workflow Status
          </div>
          <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-center">
            {[
              { step: 1, label: 'Upload Screenshot' },
              { step: 2, label: 'Upload Wallpaper' },
              { step: 3, label: 'Align Cards' },
              { step: 4, label: 'Preview' },
              { step: 5, label: 'Download' },
            ].map((s, idx) => (
              <div key={s.step} className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-smooth ${
                  currentStep === s.step
                    ? 'bg-[#4F8CFF] text-white shadow-md shadow-[#4F8CFF]/20'
                    : currentStep > s.step
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/5 text-gray-500 border border-white/5'
                }`}>
                  {currentStep > s.step ? '✓' : s.step}
                </div>
                <span className={`ml-2 text-xs font-semibold ${
                  currentStep === s.step ? 'text-white' : currentStep > s.step ? 'text-gray-300' : 'text-gray-600'
                }`}>{s.label}</span>
                {idx < 4 && <ChevronRight size={14} className="mx-2 text-gray-700 hidden md:block" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Editor ── */}
      <section
        id="editor"
        ref={editorSectionRef}
        className="max-w-6xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-24"
      >
        {/* Left: Phone Mockup */}
        <div className="lg:col-span-5 flex justify-center sticky top-24">
          <div className="flex flex-col items-center">
            <PhoneMockup>
              <QuickPanelCanvas
                ref={canvasRef}
                screenshotUrl={screenshotUrl}
                wallpaperUrl={wallpaperUrl}
                screenshotOpacity={screenshotOpacity}
                containerWidth={320}
                containerHeight={690}
                onWallpaperTransform={(pos, scale) => {
                  setWallpaperPos(pos);
                  setWallpaperScale(scale);
                }}
                shapes={shapes}
                selectedShapeId={selectedShapeId}
                onSelectShape={setSelectedShapeId}
                onUpdateShape={updateShape}
              />
            </PhoneMockup>
            {screenshotUrl && (
              <span className="text-xs text-gray-500 mt-4 font-semibold uppercase tracking-wider bg-white/5 px-3 py-1 rounded-full border border-white/5">
                Quick Panel Preview
              </span>
            )}
          </div>
        </div>

        {/* Right: Controls */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          {/* Controls card */}
          <div className="glass-card rounded-3xl p-6 border border-white/5 flex flex-col gap-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-white border-b border-white/5 pb-4">
              <Settings2 size={18} className="text-[#4F8CFF]" /> Editor Controls
            </h3>

            {/* Upload areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DropzoneCard
                title="Quick Panel Screenshot"
                description="Upload a full screenshot of your panel"
                previewUrl={screenshotUrl}
                onClear={() => setScreenshotUrl(null)}
                onFileSelect={handleScreenshotSelect}
                icon={<FileImage size={24} />}
              />
              <DropzoneCard
                title="Background Wallpaper"
                description="Upload your favourite wallpaper"
                previewUrl={wallpaperUrl}
                onClear={() => setWallpaperUrl(null)}
                onFileSelect={handleWallpaperSelect}
                icon={<Sparkles size={24} />}
              />
            </div>

            {/* Adjustments — only visible once screenshot is loaded */}
            {screenshotUrl && (
              <div className="flex flex-col gap-5 pt-4 border-t border-white/5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Sliders size={14} /> Adjustments
                </h4>

                {/* Opacity slider */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300 font-medium flex items-center gap-1.5">
                      <Eye size={16} /> Screenshot Overlay Opacity
                    </span>
                    <span className="text-[#4F8CFF] font-semibold">{Math.round(screenshotOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0" max="1" step="0.01"
                    value={screenshotOpacity}
                    onChange={(e) => setScreenshotOpacity(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#4F8CFF]"
                  />
                  <p className="text-[10px] text-gray-500">
                    Lower to see wallpaper underneath; raise to preview the final blend.
                  </p>
                </div>

                {/* Wallpaper position display + controls */}
                {wallpaperUrl && (
                  <>
                    <div className="flex flex-col gap-1 pt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300 font-medium">Wallpaper Position</span>
                        <span className="text-gray-400 font-mono text-xs">X: {Math.round(wallpaperPos.x)}  Y: {Math.round(wallpaperPos.y)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300 font-medium">Zoom Scale</span>
                        <span className="text-gray-400 font-mono text-xs">×{wallpaperScale.toFixed(2)}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">
                        Scroll / pinch to zoom · Drag to pan · Double-click to reset fit.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleCenter}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-xl border border-white/5 transition-smooth"
                      >
                        <AlignCenter size={16} /> Center Image
                      </button>
                      <button
                        onClick={handleReset}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-xl border border-white/5 transition-smooth"
                      >
                        <RefreshCw size={16} /> Reset Fit
                      </button>
                    </div>
                  </>
                )}

                {/* Add card overlay button */}
                <button
                  onClick={addShape}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[#4F8CFF]/10 hover:bg-[#4F8CFF]/20 text-[#4F8CFF] font-semibold rounded-xl border border-[#4F8CFF]/30 transition-smooth"
                >
                  <PlusSquare size={16} /> Add Card Overlay
                </button>
              </div>
            )}

            {/* Download */}
            {screenshotUrl && (
              <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2.5 w-full py-4 bg-[#4F8CFF] hover:bg-[#3770E0] text-white font-bold rounded-2xl shadow-lg transition-smooth transform hover:-translate-y-0.5"
                >
                  <Download size={18} /> Download Image
                </button>
                <p className="text-[10px] text-center text-gray-500">
                  Exports the wallpaper composite at preview resolution.
                </p>
              </div>
            )}
          </div>

          {/* Layers panel — shown when there are shapes */}
          {shapes.length > 0 && (
            <LayersPanel
              shapes={shapes}
              selectedId={selectedShapeId}
              onSelect={setSelectedShapeId}
              onRename={renameShape}
              onDelete={deleteShape}
              onDuplicate={duplicateShape}
              onToggleVisibility={toggleVisibility}
              onMoveUp={moveShapeUp}
              onMoveDown={moveShapeDown}
            />
          )}

          {/* Roadmap card */}
          <div className="glass-card rounded-3xl p-6 border border-white/5">
            <h3 className="text-md font-bold flex items-center gap-2 text-white border-b border-white/5 pb-4 mb-4">
              <Info size={16} className="text-[#4F8CFF]" /> Roadmap
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {[
                { title: 'Auto Card Detection', desc: 'Automatically detect Quick Panel card boundaries from screenshots.' },
                { title: 'Region Masking', desc: 'Mask status bar, notification shade, and toggle areas independently.' },
                { title: 'Auto Transparency', desc: 'Intelligent background cutout behind transparent toggle icons.' },
                { title: 'High-Res Export', desc: 'Cloud-scale export at native device resolution for pixel-perfect results.' },
              ].map((item) => (
                <div key={item.title} className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-1.5 opacity-80">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{item.title}</span>
                    <span className="px-2 py-0.5 text-[9px] bg-amber-500/10 text-amber-400 font-bold rounded-full">TODO</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default App;
