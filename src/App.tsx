import { useState, useRef } from 'react';
import { PhoneMockup } from './components/PhoneMockup';
import { QuickPanelCanvas, type QuickPanelCanvasRef } from './components/QuickPanelCanvas';
import { DropzoneCard } from './components/DropzoneCard';
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
  Smartphone
} from 'lucide-react';

function App() {
  // Image URL state
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [wallpaperUrl, setWallpaperUrl] = useState<string | null>(null);
  
  // Custom interactive settings
  const [screenshotOpacity, setScreenshotOpacity] = useState<number>(0.65);
  const [wallpaperScale, setWallpaperScale] = useState<number>(1);
  const [wallpaperPos, setWallpaperPos] = useState({ x: 0, y: 0 });

  // Refs for editor canvas controls
  const canvasRef = useRef<QuickPanelCanvasRef>(null);
  
  // Ref to scroll to editor
  const editorSectionRef = useRef<HTMLDivElement>(null);

  // File selection handlers
  const handleScreenshotSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setScreenshotUrl(url);
    // Auto scroll to editor if not already there
    scrollToEditor();
  };

  const handleWallpaperSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setWallpaperUrl(url);
  };

  const scrollToEditor = () => {
    setTimeout(() => {
      editorSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Canvas Action delegates
  const handleReset = () => {
    canvasRef.current?.reset();
  };

  const handleCenter = () => {
    canvasRef.current?.center();
  };

  const handleDownload = () => {
    const dataUrl = canvasRef.current?.exportImage();
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = 'diy-oneui-quickpanel.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Determine current step in the workflow
  const getCurrentStep = () => {
    if (!screenshotUrl) return 1;
    if (!wallpaperUrl) return 2;
    return 3; // Adjust / Preview / Download phase
  };

  const currentStep = getCurrentStep();

  return (
    <div className="min-h-screen bg-[#0F1115] text-white flex flex-col antialiased selection:bg-[#4F8CFF] selection:text-white pb-16">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4F8CFF] to-[#3770E0] flex items-center justify-center font-bold text-white text-lg tracking-wider shadow-lg">
            UI
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
              DIY OneUI
            </h1>
            <span className="text-[10px] font-medium text-gray-500 tracking-wide uppercase">
              Samsung Quick Panel Background Editor
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="#editor" 
            onClick={(e) => {
              e.preventDefault();
              scrollToEditor();
            }}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#181A20] border border-white/5 hover:bg-white/5 transition-smooth"
          >
            Launch Editor
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6 text-center max-w-4xl mx-auto flex flex-col items-center">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#4F8CFF]/10 blur-[100px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#4F8CFF] text-xs font-semibold mb-6">
          <Sparkles size={13} /> Samsung Galaxy Customization tool
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
          Create Stunning Samsung <br/>
          <span className="bg-gradient-to-r from-[#4F8CFF] to-[#8eb5ff] bg-clip-text text-transparent">
            Quick Panel Backgrounds
          </span>
        </h2>

        <p className="text-base md:text-lg text-gray-400 max-w-2xl mb-10 leading-relaxed">
          Design your Samsung Quick Panel exactly the way you want. Upload your Samsung Quick Panel screenshot and your favorite wallpaper. Position it perfectly and export a ready-to-use image.
        </p>

        {!screenshotUrl && (
          <button
            onClick={scrollToEditor}
            className="flex items-center gap-2.5 px-8 py-4 bg-[#4F8CFF] hover:bg-[#3770E0] text-white font-semibold rounded-2xl shadow-lg transition-smooth transform hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
          >
            <Smartphone size={18} />
            Upload Screenshot
          </button>
        )}
      </section>

      {/* Stepper Progress bar */}
      <div className="max-w-5xl mx-auto w-full px-6 mb-12">
        <div className="glass-card rounded-2xl p-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 border border-white/5">
          <div className="flex items-center gap-2.5 text-xs text-gray-400 font-semibold">
            <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs">
              i
            </span>
            Workflow Status
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-center">
            {[
              { step: 1, label: 'Upload Screenshot' },
              { step: 2, label: 'Upload Wallpaper' },
              { step: 3, label: 'Adjust Position' },
              { step: 4, label: 'Preview' },
              { step: 5, label: 'Download' },
            ].map((s, idx) => (
              <div key={s.step} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-smooth ${
                    currentStep === s.step 
                      ? 'bg-[#4F8CFF] text-white shadow-md shadow-[#4F8CFF]/20'
                      : currentStep > s.step
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/5 text-gray-500 border border-white/5'
                  }`}>
                    {currentStep > s.step ? '✓' : s.step}
                  </div>
                  <span className={`text-xs font-semibold ${
                    currentStep === s.step 
                      ? 'text-white font-bold' 
                      : currentStep > s.step 
                      ? 'text-gray-300' 
                      : 'text-gray-600'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {idx < 4 && (
                  <ChevronRight size={14} className="mx-2 text-gray-700 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Section */}
      <section 
        id="editor" 
        ref={editorSectionRef}
        className="max-w-6xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-24"
      >
        {/* Left Side: Mockup Preview */}
        <div className="lg:col-span-5 xl:col-span-5 flex justify-center sticky top-24">
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
              />
            </PhoneMockup>
            {screenshotUrl && (
              <span className="text-xs text-gray-500 mt-4 font-semibold uppercase tracking-wider bg-white/5 px-3 py-1 rounded-full border border-white/5">
                Quick Panel Preview
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Upload and Customization Controls */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col gap-6">
          {/* Controls Box */}
          <div className="glass-card rounded-3xl p-6 border border-white/5 flex flex-col gap-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-white border-b border-white/5 pb-4">
              <Settings2 size={18} className="text-[#4F8CFF]" /> Editor Controls
            </h3>

            {/* Step 1 & 2: Upload areas */}
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
                description="Upload your favorite align wallpaper"
                previewUrl={wallpaperUrl}
                onClear={() => setWallpaperUrl(null)}
                onFileSelect={handleWallpaperSelect}
                icon={<Sparkles size={24} />}
              />
            </div>

            {/* Adjustments (Visible only when screenshot is loaded) */}
            {screenshotUrl && (
              <div className="flex flex-col gap-5 pt-4 border-t border-white/5 animate-fadeIn">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Sliders size={14} /> Adjustments
                </h4>

                {/* Opacity Slider */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300 font-medium flex items-center gap-1.5">
                      <Eye size={16} /> Screenshot Overlay Opacity
                    </span>
                    <span className="text-[#4F8CFF] font-semibold">{Math.round(screenshotOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={screenshotOpacity}
                    onChange={(e) => setScreenshotOpacity(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#4F8CFF]"
                  />
                  <p className="text-[10px] text-gray-500">
                    Lower the opacity to align the wallpaper, and increase to 100% to preview your custom blend.
                  </p>
                </div>

                {/* Canvas Action Triggers */}
                {wallpaperUrl && (
                  <>
                    <div className="flex flex-col gap-2 pt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300 font-medium">Wallpaper Position</span>
                        <span className="text-gray-400 font-mono text-xs">X: {Math.round(wallpaperPos.x)}px, Y: {Math.round(wallpaperPos.y)}px</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300 font-medium">Wallpaper Zoom Scale</span>
                        <span className="text-gray-400 font-mono text-xs">x{wallpaperScale.toFixed(2)}</span>
                      </div>
                      <p className="text-[10px] text-gray-500">
                        Use mouse wheel or pinch gestures over the phone mockup preview to scale, and drag to position.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <button
                        onClick={handleCenter}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-xl border border-white/5 transition-smooth"
                      >
                        <AlignCenter size={16} />
                        Center Image
                      </button>

                      <button
                        onClick={handleReset}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-xl border border-white/5 transition-smooth"
                      >
                        <RefreshCw size={16} />
                        Reset Fit
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Export and download button */}
            {screenshotUrl && (
              <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2.5 w-full py-4 bg-[#4F8CFF] hover:bg-[#3770E0] text-white font-bold rounded-2xl shadow-lg transition-smooth transform hover:-translate-y-0.5"
                >
                  <Download size={18} />
                  Download Image
                </button>
                <p className="text-[10px] text-center text-gray-500 mt-1">
                  Downloads the combined background composite. Double click the wallpaper inside the screen to reset.
                </p>
              </div>
            )}
          </div>

          {/* Future features list / TODOs box */}
          <div className="glass-card rounded-3xl p-6 border border-white/5">
            <h3 className="text-md font-bold flex items-center gap-2 text-white border-b border-white/5 pb-4 mb-4">
              <Info size={16} className="text-[#4F8CFF]" /> Future Updates & Roadmap
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-1.5 opacity-80">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">OpenCV Detection</span>
                  <span className="px-2 py-0.5 text-[9px] bg-amber-500/10 text-amber-400 font-bold rounded-full">TODO</span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Automatic recognition and cropping of the Quick Panel boundaries from your screenshot.
                </p>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-1.5 opacity-80">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Region Masking</span>
                  <span className="px-2 py-0.5 text-[9px] bg-amber-500/10 text-amber-400 font-bold rounded-full">TODO</span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Mask individual panel sectors like notifications and settings toggles dynamically.
                </p>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-1.5 opacity-80">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Auto Transparency</span>
                  <span className="px-2 py-0.5 text-[9px] bg-amber-500/10 text-amber-400 font-bold rounded-full">TODO</span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Intelligent background cutout behind transparent toggles for perfect visual integration.
                </p>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-1.5 opacity-80">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">API Integration</span>
                  <span className="px-2 py-0.5 text-[9px] bg-amber-500/10 text-amber-400 font-bold rounded-full">TODO</span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Cloud processing to automatically blend wallpaper at original high-resolution display scale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Code Comment placeholders */}
      {/*
        TODO: OpenCV Quick Panel detection & border matching.
        TODO: Region masking for status bar and button toggles.
        TODO: Automatic transparent area extraction.
        TODO: Backend API integration for custom filters & assets.
        TODO: Export at original screenshot resolution using canvas layout scales.
      */}
    </div>
  );
}

export default App;
