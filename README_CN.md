# 我的公寓3D模型展示

[English Version](README.md)

这是一个简单的静态网页应用，用于展示公寓的3D扫描模型。用户可以轻松查看公寓的空间布局和细节，并可以在两种控制模式间切换：传统的鼠标轨道控制模式和FPS风格控制模式。这种设计满足了不同用户的浏览偏好，提供身临其境的体验。

## 功能特点

- 加载和显示OBJ格式的3D公寓模型
- 双控制模式系统：
  - **鼠标轨道模式**：传统旋转/平移/缩放控制
  - **FPS风格模式**：WASD键移动，鼠标控制视角
- 模式间无缝切换，保持视角连续性
- 直观的界面提示（ESC退出FPS模式）
- 自由穿越空间，无碰撞限制
- 预设视角快速切换（顶视图、侧视图等）
- 线框模式支持，查看模型结构
- 简洁清晰的用户界面
- 响应式设计，适配不同设备
- 多公寓模型切换（可扩展）

## 技术栈

- HTML5
- CSS3
- JavaScript (ES6+)
- Three.js（WebGL 3D库）

## 项目结构

```
My_Apartment_Web/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   ├── main.js         # 主JavaScript逻辑
│   └── keyboardControls.js  # 键盘控制模块（FPS移动）
└── Apartments/         # 3D模型文件夹
    ├── berlin_pankow/  # 柏林潘科区公寓模型
    │   ├── textured_output.obj  # OBJ模型文件
    │   ├── textured_output.mtl  # 材质文件
    │   ├── textured_output.jpg  # 纹理图片
    │   └── config.json  # 公寓配置文件
    └── example_apartment/  # 示例公寓模型
        └── config.json  # 公寓配置文件
```

## 使用方法

### 启动项目
**重要提示：** 必须使用本地HTTP服务器运行项目，直接打开HTML文件将无法正确加载3D模型（受浏览器CORS安全策略限制）。

```bash
# 导航到项目目录
cd My_Apartment_Web

# 使用Node.js的serve工具（推荐方式）
npx serve -p 8080

# 或使用Python HTTP服务器
python -m http.server
python3 -m http.server
```

然后在浏览器中访问 `http://localhost:8080` 或 `http://localhost:8000`

### 控制指南

#### 切换控制模式
- 点击界面左侧的"切换到FPS模式"或"切换到鼠标模式"按钮在两种模式间切换

#### 鼠标轨道模式（默认）
- **鼠标左键拖动**：旋转视角
- **鼠标右键拖动**：平移视角（基于屏幕空间，跟随当前相机方向）
- **鼠标滚轮**：缩放（靠近/远离）

#### FPS风格模式
1. 点击"切换到FPS模式"按钮
2. 点击出现的"点击以启用FPS控制"按钮锁定鼠标指针
3. 使用以下控制：
   - **WASD 键**：控制前后左右移动
   - **鼠标**：控制视角方向
   - **ESC键**：退出FPS模式（屏幕左上角会有提示）
4. 移动不受重力或碰撞限制，可以自由穿越空间

### 基本操作
1. 从下拉菜单中选择要查看的公寓
2. 等待模型加载完成
3. 选择偏好的控制模式（鼠标轨道或FPS）
4. 使用界面中的控制按钮：
   - "顶视图"、"正视图"、"侧视图"按钮快速切换预设视角
   - "重置视图"按钮可以将视角恢复到初始状态
   - "切换线框模式"可以查看模型的线框结构
   - 调整"渲染质量"以平衡性能和显示效果
   - 使用"保存截图"按钮保存当前视图为图片

## 添加新的公寓模型

要添加新的公寓模型，请按照以下步骤操作：

1. 在`Apartments`文件夹中创建新的子文件夹，使用公寓名称作为文件夹名
2. 将OBJ模型文件、MTL材质文件和纹理图片放入该文件夹
3. 创建`config.json`配置文件设置公寓参数：
   ```json
   {
       "name": "公寓显示名称",
       "camera": {
           "height": 1.7,
           "init_point": [0, 10]
       }
   }
   ```
4. 在`index.html`文件中的`apartmentSelector`选择器中添加新的选项：
   ```html
   <select id="apartmentSelector">
       <option value="berlin_pankow">柏林潘科区公寓</option>
       <option value="新公寓文件夹名称">新公寓显示名称</option>
   </select>
   ```

## 技术说明

### 双模式控制系统
应用使用两种互补的控制系统：
- **轨道控制模式**：基于Three.js的OrbitControls，适合传统3D浏览
  - 旋转中心智能调整，确保轨道控制始终围绕场景中心
  - 屏幕空间平移，使平移方向与当前视角保持一致
- **FPS控制模式**：
  - PointerLockControls处理鼠标锁定和视角旋转
  - 自定义KeyboardControls模块处理WASD键移动
  - 模式间平滑过渡，保持视角连续性

### 配置文件系统
每个公寓模型可以通过`config.json`文件进行自定义配置：
- 自定义名称
- 指定相机高度（人眼高度）
- 设置初始视角位置

### 本地开发注意事项
由于浏览器的安全限制（CORS策略），在开发过程中必须使用本地HTTP服务器加载3D模型。直接打开HTML文件会导致模型加载失败。

## 浏览器兼容性

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## 许可证

MIT 