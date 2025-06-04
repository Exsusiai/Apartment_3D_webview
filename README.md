# MemoSpace

[中文版本](README_CN.md) | [English](README.md)

A modern 3D apartment showcase platform that combines an elegant gallery interface with powerful 3D viewer functionality. This project successfully merges apartment gallery and 3D viewer capabilities into a unified platform.

⚠️Note: This is a project generated entirely by AI, and the project code is completely driven by prompt + Cursor + claude 4, so the code and project architecture are not for reference. For the Cursor Rule used in this project, please refer to [Cursor_Rule](cursor_rule.md)

## ✨ Features

### Gallery Interface
- **Modern Design**: Responsive layout built with Next.js + Tailwind CSS
- **Elegant Layout**: Alternating apartment cards with smooth scroll animations
- **Real Data Integration**: Uses actual apartment data from the Apartments folder
- **Smart Preview System**: Prioritizes `shotcut.png` from apartment folders as preview images
- **Intelligent Interaction**: Distinguishes between apartments with and without 3D models
- **Dynamic Auto-Detection**: Automatically discovers new apartments without code changes

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
├── scripts/              # Build scripts
│   └── generate-apartments-list.js # Auto-generate apartment list
├── public/               # Static assets
│   └── apartments/       # Apartment 3D model files
│       ├── 1_berlin_pankow/
│       │   ├── textured_output.obj
│       │   ├── textured_output.mtl
│       │   ├── textured_output.jpg
│       │   ├── shotcut.png
│       │   └── config.json
│       ├── 2_test_model/
│       │   └── config.json
│       └── apartments-list.json    # Auto-generated apartment list
└── package.json          # Project dependencies
```

## 🏠 Dynamic Apartment Loading System

### Overview

This project implements a fully automated apartment detection and loading system. No code changes are needed when adding new apartments - simply add new apartment folders to the `public/apartments/` directory and they will automatically be recognized and displayed.

### How It Works

#### 1. Auto-Scan Script

The `scripts/generate-apartments-list.js` script:
- Scans all folders in the `public/apartments/` directory
- Validates that each folder contains a valid `config.json`
- Checks for 3D model files (`textured_output.obj`)
- Checks for preview images (`shotcut.png`)
- Generates `public/apartments-list.json` file

#### 2. Automatic Execution

- **Development**: The `predev` script automatically runs the scan when executing `npm run dev`
- **Build**: The `prebuild` script automatically runs the scan when executing `npm run build`
- **Vercel Deployment**: The build script automatically executes during each deployment

#### 3. Frontend Dynamic Loading

`utils/apartment-data.ts`:
- Loads the `apartments-list.json` file
- Dynamically loads each apartment's configuration
- Displays apartments sorted by folder name (string sort)

### Adding New Apartments

#### Steps

1. **Create new folder** under `public/apartments/` (recommend using numeric prefix for ordering):
   ```
   public/apartments/5_new_apartment/
   ```

2. **Add required `config.json` file**:
   ```json
   {
     "name": "Apartment Display Name",
     "description": "Apartment description\nSupports line breaks",
     "camera": {
       "height": 1.7,
       "init_point": [0, 0]
     }
   }
   ```

3. **Optional files**:
   - `textured_output.obj` - 3D model file
   - `textured_output.mtl` - Material file
   - `textured_output.jpg` - Texture image
   - `shotcut.png` - Preview image

#### File Structure Example

```
public/apartments/
├── 1_berlin_pankow/
│   ├── config.json           # Required
│   ├── shotcut.png          # Optional: Preview image
│   ├── textured_output.obj  # Optional: 3D model
│   ├── textured_output.mtl  # Optional: Material
│   └── textured_output.jpg  # Optional: Texture
├── 2_test_model/
│   └── config.json          # Required
└── apartments-list.json     # Auto-generated, do not edit manually
```

#### Important Notes

1. **Folder Naming**: Use numeric prefixes (e.g., `1_`, `2_`) to control display order
2. **config.json**: Must be valid JSON format, otherwise the apartment will be ignored
3. **Preview Image Priority**:
   - First choice: `shotcut.png`
   - Second choice: `textured_output.jpg`
   - Fallback: Default placeholder
4. **3D Model Button**: "View 3D Model" button only appears when `textured_output.obj` exists

#### Development Tips

- After modifying apartments, refresh the page to see updates (development environment automatically regenerates the list)
- `apartments-list.json` is added to `.gitignore` and won't be committed to version control
- Production environment regenerates the apartment list on each deployment

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