import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
import { type AppPage, PAGE_ORDER } from './types';

function App() {
  const { currentPage, navigateTo, goPrev } = useAppState();
  const cal = useCalibration();
  const wp = useWallpaper();

  // Track which pages have been visited (for sidebar "completed" styling)
  const [visited, setVisited] = useState<Set<AppPage>>(new Set(['home']));

  const navigate = useCallback((page: AppPage) => {
    setVisited((prev) => new Set(prev).add(page));
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
  const handleScreenshotSelect = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      cal.setScreenshot(url, img.width, img.height);
    };
  }, [cal]);

  // Wallpaper file handler
  const handleWallpaperSelect = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    wp.setWallpaper(url);
    // Auto-advance to editor after wallpaper upload
    navigate('editor');
  }, [wp, navigate]);

  const handleStartOver = useCallback(() => {
    navigate('home');
  }, [navigate]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0F1115]">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        enabledPanels={cal.state.enabledPanels}
        completedPages={visited}
        onNavigate={navigate}
        onSave={cal.saveCalibration}
        onLoad={cal.loadCalibration}
        onApply={cal.applySavedCalibration}
        onDelete={cal.deleteCalibration}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="flex-1 flex flex-col"
          >
            {currentPage === 'home' && (
              <HomePage
                hasSavedCalibration={cal.hasSavedCalibration()}
                onStart={() => navigate('upload')}
                onResume={(page) => navigate(page)}
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
