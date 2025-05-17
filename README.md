# 我的公寓3D模型展示

这是一个简单的静态网页应用，用于展示公寓的3D扫描模型。用户可以轻松查看公寓的空间布局和细节，并使用FPS风格控制（WASD移动+鼠标视角）在公寓内自由探索，提供身临其境的体验。

## 功能特点

- 加载和显示OBJ格式的3D公寓模型
- FPS风格控制系统（WASD键移动，鼠标控制视角）
- 无缝集成的键盘和鼠标控制，无需切换模式
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
    └── berlin_pankow/  # 柏林潘科区公寓模型
        ├── textured_output.obj  # OBJ模型文件
        ├── textured_output.mtl  # 材质文件
        └── textured_output.jpg  # 纹理图片
```

## 使用方法

### 启动项目
**重要提示：** 必须使用本地HTTP服务器运行项目，直接打开HTML文件将无法正确加载3D模型（受浏览器CORS安全策略限制）。

```bash
# 导航到项目目录
cd My_Apartment_Web

# 启动简单的Python HTTP服务器（Python 3）
python -m http.server
# 或者
python3 -m http.server
```

然后在浏览器中访问 `http://localhost:8000`

### 控制指南
游戏风格控制系统使用直观的FPS布局：
- **WASD 键**：控制前后左右移动
- **鼠标**：控制视角方向
- 移动不受重力或碰撞限制，可以自由穿越空间

### 基本操作
1. 从下拉菜单中选择要查看的公寓
2. 等待模型加载完成
3. 使用WASD移动，鼠标调整视角
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
3. 确保文件命名为`textured_output.obj`、`textured_output.mtl`和相应的纹理图片
4. 在`index.html`文件中的`apartmentSelector`选择器中添加新的选项：

```html
<select id="apartmentSelector">
    <option value="berlin_pankow">柏林潘科区公寓</option>
    <option value="新公寓名称">新公寓显示名称</option>
</select>
```

## 技术说明

### FPS控制系统
本应用使用集成的控制系统：
- **OrbitControls**: 配置为仅处理鼠标旋转（视角控制）
- **KeyboardControls**: 自定义模块，处理WASD键的移动逻辑
- 两个控制器同时工作，实现无缝集成的FPS控制体验

### 本地开发注意事项
由于浏览器的安全限制（CORS策略），在开发过程中必须使用本地HTTP服务器加载3D模型。直接打开HTML文件会导致模型加载失败。

## 浏览器兼容性

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## 许可证

MIT 