# OneUI QuickPanel Customizer (DIY OneUI)

A specialized tool designed to create perfectly aligned wallpapers and custom theme templates for Samsung's OneUI QuickPanel layout. This project was built for personal use to accommodate customization preferences following a new OneUI update, and was vibecoded in a collaborative pair-programming partnership with an AI coding assistant.

---

## 🚀 Key Features

* **Visual Calibration**: Upload a screenshot of your device's QuickPanel, select active panel areas, and calibrate dimensions in real-time.
* **Wallpaper Customizer**: Crop, scale, align, and apply modern filters (blur, brightness, contrast, etc.) to your wallpapers matching the exact dimensions of your panel panels.
* **Real-time Live Preview**: View how your customized wallpaper will blend with the UI elements before exporting.
* **Persistent Calibration Profiles**: Save, apply, or delete device-specific calibration templates locally in your browser.
* **Seamless Exporting**: Export the final custom-cropped wallpaper assets tailored for your device screen layout.

---

## 🛠️ Development & Local Run

This project runs on **React 19**, **Vite 8**, and **Tailwind CSS v4**.

### Install dependencies:
```bash
npm install
```

### Start the development server:
```bash
npm run dev
```

### Accessing on mobile/phone:
To preview changes directly on your phone, start the server exposed to the local network:
```bash
npm run dev -- --host
```
Then visit the printed **Network** IP (e.g., `http://192.168.1.37:5173`) on your phone.

---

## 📦 GitHub Pages Deployment

The project is configured to easily deploy directly to GitHub Pages.

To deploy a new build:
```bash
npm run deploy
```
*Note: Make sure your repository settings point the GitHub Pages source branch to the `gh-pages` branch.*
