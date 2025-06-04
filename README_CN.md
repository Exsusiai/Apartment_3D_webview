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
- **动态自动检测**：无需代码更改即可自动发现新公寓

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
├── scripts/              # 构建脚本
│   └── generate-apartments-list.js # 自动生成公寓列表
├── public/               # 静态资源
│   └── apartments/       # 公寓3D模型文件
│       ├── 1_berlin_pankow/
│       │   ├── textured_output.obj
│       │   ├── textured_output.mtl
│       │   ├── textured_output.jpg
│       │   ├── shotcut.png
│       │   └── config.json
│       ├── 2_test_model/
│       │   └── config.json
│       └── apartments-list.json    # 自动生成的公寓列表
└── package.json          # 项目依赖
```

## 🏠 动态公寓加载系统

### 概述

本项目实现了一个完全自动化的公寓识别和加载系统。无需修改任何代码，只需将新的公寓文件夹添加到 `public/apartments/` 目录下，系统就会自动识别并显示。

### 工作原理

#### 1. 自动扫描脚本

`scripts/generate-apartments-list.js` 脚本会：
- 扫描 `public/apartments/` 目录下的所有文件夹
- 验证每个文件夹是否包含有效的 `config.json`
- 检查是否存在 3D 模型文件（`textured_output.obj`）
- 检查是否存在预览图（`shotcut.png`）
- 生成 `public/apartments-list.json` 文件

#### 2. 自动执行时机

- **开发环境**：运行 `npm run dev` 时，`predev` 脚本会自动执行扫描
- **构建时**：运行 `npm run build` 时，`prebuild` 脚本会自动执行扫描
- **Vercel 部署**：每次部署时会自动执行构建脚本

#### 3. 前端动态加载

`utils/apartment-data.ts` 会：
- 加载 `apartments-list.json` 文件
- 根据列表动态加载每个公寓的配置
- 按照文件夹名称字符串排序显示

### 添加新公寓

#### 步骤

1. **创建新文件夹** 在 `public/apartments/` 下（建议使用数字前缀以控制排序）：
   ```
   public/apartments/5_new_apartment/
   ```

2. **添加必需的 `config.json` 文件**：
   ```json
   {
     "name": "公寓名称",
     "description": "公寓描述\n支持换行",
     "camera": {
       "height": 1.7,
       "init_point": [0, 0]
     }
   }
   ```

3. **可选文件**：
   - `textured_output.obj` - 3D 模型文件
   - `textured_output.mtl` - 材质文件
   - `textured_output.jpg` - 贴图文件
   - `shotcut.png` - 预览图片

#### 文件结构示例

```
public/apartments/
├── 1_berlin_pankow/
│   ├── config.json           # 必需
│   ├── shotcut.png          # 可选：预览图
│   ├── textured_output.obj  # 可选：3D模型
│   ├── textured_output.mtl  # 可选：材质
│   └── textured_output.jpg  # 可选：贴图
├── 2_test_model/
│   └── config.json          # 必需
└── apartments-list.json     # 自动生成，不要手动修改
```

#### 注意事项

1. **文件夹命名**：建议使用数字前缀（如 `1_`, `2_`）来控制显示顺序
2. **config.json**：必须是有效的 JSON 格式，否则该公寓会被忽略
3. **预览图优先级**：
   - 首选 `shotcut.png`
   - 其次 `textured_output.jpg`
   - 最后使用默认占位符
4. **3D 模型按钮**：只有存在 `textured_output.obj` 时才显示"View 3D Model"按钮

#### 开发提示

- 修改公寓后，刷新页面即可看到更新（开发环境会自动重新生成列表）
- `apartments-list.json` 已添加到 `.gitignore`，不会被提交到版本控制
- 生产环境每次部署时会重新生成公寓列表

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