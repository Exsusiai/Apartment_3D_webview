# 3D Apartment Model Viewer

[中文版](README_CN.md)

This is a simple static web application designed to showcase 3D scanned apartment models. Users can easily explore the spatial layout and details of apartments while switching between two control modes: traditional mouse orbit controls and FPS-style controls. This design caters to different browsing preferences, providing an immersive experience.

## Features

- Load and display 3D apartment models in OBJ format
- Dual control system:
  - **Mouse orbit mode**: Traditional rotation/pan/zoom controls
  - **FPS-style mode**: WASD key movement with mouse view control
- Seamless switching between modes while maintaining view continuity
- Intuitive interface prompts (ESC to exit FPS mode)
- Free space traversal without collision constraints
- Quick switching between preset views (top view, front view, etc.)
- Wireframe mode support to examine model structure
- Clean and clear user interface
- Responsive design for different devices
- Multiple apartment model selection (expandable)

## Technology Stack

- HTML5
- CSS3
- JavaScript (ES6+)
- Three.js (WebGL 3D library)

## Project Structure

```
My_Apartment_Web/
├── index.html          # Main page
├── css/
│   └── style.css       # Stylesheet
├── js/
│   ├── main.js         # Main JavaScript logic
│   └── keyboardControls.js  # Keyboard control module (for FPS movement)
└── Apartments/         # 3D model folder
    ├── berlin_pankow/  # Berlin Pankow apartment model
    │   ├── textured_output.obj  # OBJ model file
    │   ├── textured_output.mtl  # Material file
    │   ├── textured_output.jpg  # Texture image
    │   └── config.json  # Apartment configuration file
    └── example_apartment/  # Example apartment model
        └── config.json  # Apartment configuration file
```

## Usage Instructions

### Starting the Project
**Important Note:** The project must be run with a local HTTP server. Opening the HTML file directly will fail to load the 3D models correctly (due to browser CORS security policies).

```bash
# Navigate to the project directory
cd My_Apartment_Web

# Using Node.js serve tool (recommended)
npx serve -p 8080

# Or using Python HTTP server
python -m http.server
python3 -m http.server
```

Then access `http://localhost:8080` or `http://localhost:8000` in your browser.

### Control Guide

#### Switching Control Modes
- Click the "Switch to FPS mode" or "Switch to Mouse mode" button on the left side of the interface to toggle between the two modes

#### Mouse Orbit Mode (Default)
- **Left mouse button drag**: Rotate view
- **Right mouse button drag**: Pan view (in screen space, following current camera direction)
- **Mouse wheel**: Zoom (in/out)

#### FPS-style Mode
1. Click the "Switch to FPS mode" button
2. Click the "Click to enable FPS controls" button that appears to lock the mouse pointer
3. Use the following controls:
   - **WASD keys**: Control forward, backward, left, right movement
   - **Mouse**: Control view direction
   - **ESC key**: Exit FPS mode (prompt will appear in top-left)
4. Movement is unrestricted by gravity or collisions, allowing free traversal of space

### Basic Operations
1. Select the apartment to view from the dropdown menu
2. Wait for the model to load
3. Choose your preferred control mode (mouse orbit or FPS)
4. Use the control buttons in the interface:
   - "Top view", "Front view", "Side view" buttons to quickly switch between preset views
   - "Reset view" button to restore the view to its initial state
   - "Toggle wireframe mode" to see the model's wireframe structure
   - Adjust "Render quality" to balance performance and display quality
   - Use "Save screenshot" button to save the current view as an image

## Adding New Apartment Models

To add a new apartment model, follow these steps:

1. Create a new subfolder in the `Apartments` folder, using the apartment name as the folder name
2. Place the OBJ model file, MTL material file, and texture images in this folder
3. Create a `config.json` configuration file to set apartment parameters:
   ```json
   {
       "name": "Apartment Display Name",
       "camera": {
           "height": 1.7,
           "init_point": [0, 10]
       }
   }
   ```
4. Add a new option in the `apartmentSelector` selector in the `index.html` file:
   ```html
   <select id="apartmentSelector">
       <option value="berlin_pankow">Berlin Pankow Apartment</option>
       <option value="new_apartment_folder_name">New Apartment Display Name</option>
   </select>
   ```

## Technical Details

### Dual Mode Control System
The application uses two complementary control systems:
- **Orbit Controls Mode**: Based on Three.js OrbitControls, suitable for traditional 3D browsing
  - Smart adjustment of rotation center, ensuring orbit controls always revolve around scene center
  - Screen space panning, keeping pan direction consistent with current view
- **FPS Controls Mode**:
  - PointerLockControls handles mouse locking and view rotation
  - Custom KeyboardControls module handles WASD key movement
  - Smooth transition between modes, maintaining view continuity

### Configuration File System
Each apartment model can be customized via a `config.json` file:
- Custom name
- Camera height specification (eye level)
- Initial view position setting

### Local Development Notes
Due to browser security restrictions (CORS policies), a local HTTP server must be used to load 3D models during development. Opening the HTML file directly will result in model loading failure.

## Browser Compatibility

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## License

MIT 