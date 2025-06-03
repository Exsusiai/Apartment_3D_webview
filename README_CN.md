# About MemoSpace

[中文版本](README_CN.md) | [English](README.md)

一个现代化的3D公寓展示平台，结合了优雅的画廊界面和强大的3D查看器功能。该项目成功地将公寓画廊和3D查看器功能合并为一个统一的平台。

⚠️注意： 这是一个完全由AI生成的项目，完全由自然语言驱动prompt的Cursor + claude 4 完成项目代码，因此代码以及项目架构不具备参考性。开发本项目所使用的Cursor Rule请参考[Cursor_Rule](cursor_rule.md)

## ✨ 功能特色

### 画廊界面
- **现代化设计**：使用Next.js + Tailwind CSS构建的响应式布局
- **优雅布局**：交替排列的公寓卡片，配有流畅的滚动动画
- **真实数据集成**：使用Apartments文件夹中的实际公寓数据
- **智能预览系统**：优先使用公寓文件夹中的`shotcut.png`作为预览图
- **智能交互**：区分有3D模型和无3D模型的公寓

### 3D查看器功能
- **双控制模式**：
  - **鼠标轨道模式**：传统的旋转/平移/缩放控制
  - **FPS模式**：WASD移动 + 鼠标视角控制
- **完整3D体验**：
  - 加载OBJ格式的3D公寓模型
  - 材质和纹理支持
  - 多种预设视角（顶视图、正视图、侧视图）
  - 线框模式切换
  - 渲染质量调节
  - 截图功能
- **无缝集成**：在对话框中嵌入完整的3D查看器，保留所有原始功能

## 🛠 技术栈

### 前端框架
- **Next.js 15** - React全栈框架
- **React 19** - 用户界面库
- **TypeScript** - 类型安全的JavaScript

### 样式和UI
- **Tailwind CSS** - 实用优先的CSS框架
- **Radix UI** - 无障碍的UI组件库
- **Lucide React** - 图标库

### 3D渲染
- **Three.js** - WebGL 3D库
- **OBJLoader** - OBJ模型加载器
- **MTLLoader** - 材质加载器
- **OrbitControls** - 轨道控制器
- **PointerLockControls** - 指针锁定控制器

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm、yarn 或 pnpm

### 安装依赖
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 启动开发服务器
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

在浏览器中访问 `http://localhost:3000`。

### 生产构建
```bash
npm run build
npm start
```

## 📁 项目结构

```
My_Apartment_Web/
├── app/                    # Next.js应用页面
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 应用布局
│   └── page.tsx           # 主页
├── components/            # React组件
│   ├── apartment-gallery.tsx      # 公寓画廊组件
│   ├── apartment-3d-viewer.tsx    # 3D查看器组件
│   ├── header.tsx                 # 页面头部
│   ├── hero-section.tsx           # 英雄区域
│   └── ui/                        # 基础UI组件
├── utils/                 # 工具函数
│   └── apartment-data.ts  # 公寓数据管理
├── public/               # 静态资源
│   └── apartments/       # 公寓3D模型文件
│       ├── berlin_pankow/
│       │   ├── textured_output.obj
│       │   ├── textured_output.mtl
│       │   ├── textured_output.jpg
│       │   └── config.json
│       └── example_apartment/
│           └── config.json
└── package.json          # 项目依赖
```

## 🎮 3D查看器使用指南

### 控制模式切换
- 点击"切换到FPS模式"按钮进入第一人称模式
- 在FPS模式下，点击"点击以启用FPS控制"来锁定鼠标
- 按ESC键退出FPS模式

### 鼠标轨道模式
- **左键点击拖拽**：旋转视角
- **右键点击拖拽**：平移视图
- **鼠标滚轮**：缩放

### FPS模式
- **WASD键**：前进、后退、左移、右移
- **鼠标**：控制视角方向
- **ESC键**：退出FPS模式

### 附加功能
- **预设视角**：快速切换到顶视图、正视图、侧视图
- **重置视图**：返回到初始视角
- **线框模式**：查看模型线框结构
- **质量控制**：调节渲染质量以平衡性能
- **截图功能**：保存当前视图为图片

## 🏠 添加新公寓模型

要添加新的公寓模型：

1. **准备模型文件**：
   ```
   public/apartments/新公寓名称/
   ├── textured_output.obj  # 3D模型文件
   ├── textured_output.mtl  # 材质文件
   ├── textured_output.jpg  # 纹理图片
   ├── shotcut.png          # 预览图片（推荐）
   └── config.json          # 配置文件
   ```

2. **创建配置文件** (`config.json`)：
   ```json
   {
       "name": "公寓显示名称",
       "camera": {
           "height": 1.7,
           "init_point": [0, 10]
       }
   }
   ```

3. **更新数据文件** (`utils/apartment-data.ts`)：
   - 在`apartments`数组中添加新的公寓数据对象
   - 如果公寓有`shotcut.png`，将公寓ID添加到`APARTMENTS_WITH_SHOTCUT`数组中

### 预览图片优先级
系统按以下优先级选择预览图片：
1. **shotcut.png** - 专门的预览图片（如果存在）
2. **textured_output.jpg** - 3D模型纹理作为备选
3. **placeholder.svg** - 默认占位符

## 🌐 浏览器兼容性

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## 🤝 参与贡献

欢迎贡献！请随时提交Issue和Pull Request。

### 开发流程
1. Fork本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 📄 许可证

本项目基于MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详细信息。