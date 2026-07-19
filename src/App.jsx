import { useCallback, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from 'lucide-react';
const GithubIcon = ({ size = 20, ...props }) => (
  <svg
    height={size}
    width={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    {...props}
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);
import { useAppState } from './hooks/useAppState';
import { useCalibration } from './hooks/useCalibration';
import { useWallpaper } from './hooks/useWallpaper';
import { Sidebar } from './components/layout/Sidebar';
import { HomePage } from './pages/HomePage';
import { UploadPage } from './pages/UploadPage';
import { PanelSelectPage } from './pages/PanelSelectPage';
import { CalibrationPage } from './pages/CalibrationPage';
import { WallpaperPage } from './pages/WallpaperPage';
import { EditorPage } from './pages/EditorPage';
import { PreviewPage } from './pages/PreviewPage';
import { ExportPage } from './pages/ExportPage';
import { PAGE_ORDER } from './types';

function App() {
  const { currentPage, navigateTo, goPrev } = useAppState();
  const cal = useCalibration();
  const wp = useWallpaper();

  // Track mobile sidebar drawer open state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Compute completed pages dynamically based on active state data
  const completedPages = useMemo(() => {
    const pages = new Set(['home']);
    if (cal.state.screenshotUrl) {
      pages.add('upload');
    }
    if (cal.state.enabledPanels.length > 0) {
      pages.add('panel-select');
    }
    const allCalibrated = cal.state.enabledPanels.length > 0 && cal.state.enabledPanels.every(id => cal.state.panelRects[id]);
    if (cal.state.screenshotUrl && allCalibrated) {
      pages.add('calibration');
    }
    if (wp.state.wallpaperUrl) {
      pages.add('wallpaper-upload');
      pages.add('editor');
    }
    // Mark preview complete only if we have passed preview stage
    if (currentPage === 'export') {
      pages.add('preview');
    }
    return pages;
  }, [cal.state, wp.state, currentPage]);

  const navigate = useCallback((page) => {
    setSidebarOpen(false); // Close mobile drawer
    navigateTo(page);
  }, [navigateTo]);

  const handleNext = useCallback(() => {
    const idx = PAGE_ORDER.indexOf(currentPage);
    if (idx < PAGE_ORDER.length - 1) {
      const nextPage = PAGE_ORDER[idx + 1];
      navigate(nextPage);
    }
  }, [currentPage, navigate]);

  const handleBack = useCallback(() => {
    goPrev();
  }, [goPrev]);

  // Screenshot file handler
  const handleScreenshotSelect = useCallback((file) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      cal.setScreenshot(url, img.width, img.height);
    };
  }, [cal]);

  // Wallpaper file handler
  const handleWallpaperSelect = useCallback((file) => {
    const url = URL.createObjectURL(file);
    wp.setWallpaper(url);
    // Auto-advance to editor after wallpaper upload
    navigate('editor');
  }, [wp, navigate]);

  const handleStartOver = useCallback(() => {
    navigate('home');
  }, [navigate]);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#0F1115]">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-4 border-b border-white/5 bg-[#181A20]/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn-ghost p-2 rounded-xl text-gray-400 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#4F8CFF] to-[#3770E0] flex items-center justify-center font-black text-white text-xs">
              UI
            </div>
            <span className="text-sm font-bold text-white tracking-tight">DIY OneUI</span>
          </div>
        </div>
        <a
          href="https://github.com/A-b-h-i-n-a-V-01/OneUI-QuickPanel-Customizer"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost p-2 rounded-xl text-gray-400 hover:text-white flex items-center justify-center"
        >
          <GithubIcon size={20} />
        </a>
      </header>

      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        enabledPanels={cal.state.enabledPanels}
        completedPages={completedPages}
        onNavigate={navigate}
        onSave={cal.saveCalibration}
        onLoad={cal.loadCalibration}
        onApply={cal.applySavedCalibration}
        onDelete={cal.deleteCalibration}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto flex flex-col min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="flex-1 flex flex-col min-w-0"
          >
            {currentPage === 'home' && (
              <HomePage
                hasSavedCalibration={cal.hasSavedCalibration()}
                onStart={() => navigate('upload')}
                onResume={(page) => {
                  const saved = cal.loadCalibration();
                  if (saved) {
                    cal.applySavedCalibration(saved);
                  }
                  navigate(page);
                }}
              />
            )}

            {currentPage === 'upload' && (
              <UploadPage
                screenshotUrl={cal.state.screenshotUrl}
                onFileSelect={handleScreenshotSelect}
                onClear={cal.clearScreenshot}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentPage === 'panel-select' && (
              <PanelSelectPage
                enabledPanels={cal.state.enabledPanels}
                onToggle={cal.togglePanel}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentPage === 'calibration' && cal.state.screenshotUrl && (
              <CalibrationPage
                screenshotUrl={cal.state.screenshotUrl}
                screenshotSize={cal.state.screenshotSize}
                enabledPanels={cal.state.enabledPanels}
                panelRects={cal.state.panelRects}
                onUpdateRect={cal.updateRect}
                onResetRect={cal.resetRect}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentPage === 'calibration' && !cal.state.screenshotUrl && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
                <p className="text-amber-400 font-semibold">Please upload a screenshot first.</p>
                <button onClick={() => navigate('upload')} className="btn-primary">
                  Upload Screenshot
                </button>
              </div>
            )}

            {currentPage === 'wallpaper-upload' && (
              <WallpaperPage
                wallpaperUrl={wp.state.wallpaperUrl}
                onFileSelect={handleWallpaperSelect}
                onClear={wp.clearWallpaper}
                onNext={() => navigate('editor')}
                onBack={handleBack}
              />
            )}

            {currentPage === 'editor' && wp.state.wallpaperUrl && (
              <EditorPage
                wallpaperUrl={wp.state.wallpaperUrl}
                screenshotUrl={cal.state.screenshotUrl}
                screenshotSize={cal.state.screenshotSize}
                transform={wp.state.transform}
                filters={wp.state.filters}
                panelRects={cal.state.panelRects}
                enabledPanels={cal.state.enabledPanels}
                onUpdateTransform={wp.updateTransform}
                onUpdateFilter={wp.updateFilter}
                onTransformChange={wp.setTransform}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentPage === 'editor' && !wp.state.wallpaperUrl && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
                <p className="text-amber-400 font-semibold">Please upload a wallpaper first.</p>
                <button onClick={() => navigate('wallpaper-upload')} className="btn-primary">
                  Upload Wallpaper
                </button>
              </div>
            )}

            {currentPage === 'preview' && wp.state.wallpaperUrl && (
              <PreviewPage
                wallpaperUrl={wp.state.wallpaperUrl}
                screenshotSize={cal.state.screenshotSize}
                transform={wp.state.transform}
                filters={wp.state.filters}
                panelRects={cal.state.panelRects}
                enabledPanels={cal.state.enabledPanels}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentPage === 'preview' && !wp.state.wallpaperUrl && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
                <p className="text-amber-400 font-semibold">No wallpaper loaded.</p>
                <button onClick={() => navigate('wallpaper-upload')} className="btn-primary">
                  Upload Wallpaper
                </button>
              </div>
            )}

            {currentPage === 'export' && wp.state.wallpaperUrl && (
              <ExportPage
                wallpaperUrl={wp.state.wallpaperUrl}
                screenshotSize={cal.state.screenshotSize}
                transform={wp.state.transform}
                filters={wp.state.filters}
                panelRects={cal.state.panelRects}
                enabledPanels={cal.state.enabledPanels}
                onBack={handleBack}
                onStartOver={handleStartOver}
              />
            )}

            {currentPage === 'export' && !wp.state.wallpaperUrl && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
                <p className="text-amber-400 font-semibold">No wallpaper loaded.</p>
                <button onClick={() => navigate('wallpaper-upload')} className="btn-primary">
                  Upload Wallpaper
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
