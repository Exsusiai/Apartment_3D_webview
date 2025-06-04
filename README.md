# MemoSpace

[中文版本](README_CN.md) | [English](README.md)

[**Website Preview**](https://memospace.jingsheng.dev/)

A modern 3D apartment showcase platform that combines an elegant gallery interface with powerful 3D viewer functionality. This project successfully merges apartment gallery and 3D viewer capabilities into a unified platform.

⚠️Note: This is a project generated entirely by AI, and the project code is completely driven by prompt + Cursor + claude 4, so the code and project architecture are not for reference. For the Cursor Rule used in this project, please refer to [Cursor_Rule](cursor_rule.md)

## ✨ Features

### Gallery Interface
- **Modern Design**: Responsive layout built with Next.js + Tailwind CSS
- **Elegant Layout**: Alternating apartment cards with smooth scroll animations
- **Real Data Integration**: Uses actual apartment data from the Apartments folder
- **Smart Preview System**: Prioritizes `shotcut.png` from apartment folders as preview images
- **Intelligent Interaction**: Distinguishes between apartments with and without 3D models

### 3D Viewer Capabilities
- **Dual Control Modes**:
  - **Mouse Orbit Mode**: Traditional rotation/pan/zoom controls
  - **FPS Mode**: WASD movement + mouse view control
- **Complete 3D Experience**:
  - Load OBJ format 3D apartment models
  - Material and texture support
  - Multiple preset views (top, front, side views)
  - Wireframe mode toggle
  - Render quality adjustment
  - Screenshot functionality
- **Seamless Integration**: Full 3D viewer embedded in dialog with all original features

## 🛠 Technology Stack

### Frontend Framework
- **Next.js 15** - React full-stack framework
- **React 19** - User interface library
- **TypeScript** - Type-safe JavaScript

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI component library
- **Lucide React** - Icon library

### 3D Rendering
- **Three.js** - WebGL 3D library
- **OBJLoader** - OBJ model loader
- **MTLLoader** - Material loader
- **OrbitControls** - Orbit controller
- **PointerLockControls** - Pointer lock controller

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm

### Installation
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Visit `http://localhost:3000` in your browser.

### Production Build
```bash
npm run build
npm start
```

## 📁 Project Structure

```
My_Apartment_Web/
├── app/                    # Next.js app pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # App layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── apartment-gallery.tsx      # Apartment gallery component
│   ├── apartment-3d-viewer.tsx    # 3D viewer component
│   ├── header.tsx                 # Page header
│   ├── hero-section.tsx           # Hero section
│   └── ui/                        # Base UI components
├── utils/                 # Utility functions
│   └── apartment-data.ts  # Apartment data management
├── public/               # Static assets
│   └── apartments/       # Apartment 3D model files
│       ├── berlin_pankow/
│       │   ├── textured_output.obj
│       │   ├── textured_output.mtl
│       │   ├── textured_output.jpg
│       │   └── config.json
│       └── example_apartment/
│           └── config.json
└── package.json          # Project dependencies
```

## 🎮 3D Viewer Usage

### Control Mode Switching
- Click "Switch to FPS Mode" button to enter first-person mode
- In FPS mode, click "Click to enable FPS controls" to lock mouse
- Press ESC key to exit FPS mode

### Mouse Orbit Mode
- **Left Click & Drag**: Rotate view
- **Right Click & Drag**: Pan view
- **Mouse Wheel**: Zoom

### FPS Mode
- **WASD Keys**: Forward, backward, left, right movement
- **Mouse**: Control view direction
- **ESC Key**: Exit FPS mode

### Additional Features
- **Preset Views**: Quick switch to top view, front view, side view
- **Reset View**: Return to initial perspective
- **Wireframe Mode**: View model wireframe structure
- **Quality Control**: Adjust render quality for performance balance
- **Screenshot**: Save current view as image

## 🏠 Adding New Apartment Models

To add a new apartment model:

1. **Prepare Model Files**:
   ```
   public/apartments/new_apartment_name/
   ├── textured_output.obj  # 3D model file
   ├── textured_output.mtl  # Material file
   ├── textured_output.jpg  # Texture image
   ├── shotcut.png          # Preview image (recommended)
   └── config.json          # Configuration file
   ```

2. **Create Configuration File** (`config.json`):
   ```json
   {
       "name": "Apartment Display Name",
       "camera": {
           "height": 1.7,
           "init_point": [0, 10]
       }
   }
   ```

3. **Update Data File** (`utils/apartment-data.ts`):
   - Add new apartment data object to `apartments` array
   - If apartment has `shotcut.png`, add apartment ID to `APARTMENTS_WITH_SHOTCUT` array

### Preview Image Priority
The system selects preview images in the following priority:
1. **shotcut.png** - Dedicated preview image (if exists)
2. **textured_output.jpg** - 3D model texture as fallback
3. **placeholder.svg** - Default placeholder

## 🌐 Browser Compatibility

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## 🤝 Contributing

Contributions are welcome! Please feel free to submit Issues and Pull Requests.

### Development Workflow
1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.