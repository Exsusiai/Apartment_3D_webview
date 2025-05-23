# 3D公寓展示平台 - 合并版本

这是一个现代化的3D公寓展示平台，结合了优雅的画廊界面和强大的3D查看器功能。该项目成功合并了`apartment-gallery`（主页界面）和`3D_viewr`（3D查看器）两个项目的功能。

## 🌟 项目特色

### 主页功能
- **现代化设计**：采用Next.js + Tailwind CSS构建的响应式界面
- **优雅的画廊布局**：交替排列的公寓卡片，配有流畅的滚动动画
- **真实数据驱动**：使用Apartments文件夹中的真实公寓数据
- **智能交互**：区分有模型和无模型的公寓，提供不同的交互体验

### 3D查看器功能
- **双控制模式**：
  - **鼠标轨道模式**：传统的旋转/平移/缩放控制
  - **FPS模式**：WASD键移动 + 鼠标视角控制
- **完整的3D体验**：
  - 加载OBJ格式的3D公寓模型
  - 支持材质和纹理显示
  - 多种预设视角（顶视图、正视图、侧视图）
  - 线框模式切换
  - 渲染质量调节
  - 截图功能
- **无缝集成**：在对话框中嵌入完整的3D查看器，保持原有功能

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
│   └── ui/                        # UI基础组件
├── utils/                 # 工具函数
│   └── apartment-data.ts  # 公寓数据管理
├── public/               # 静态资源
│   ├── apartments/       # 公寓3D模型文件
│   │   ├── berlin_pankow/
│   │   │   ├── textured_output.obj
│   │   │   ├── textured_output.mtl
│   │   │   ├── textured_output.jpg
│   │   │   └── config.json
│   │   └── example_apartment/
│   │       └── config.json
│   └── 3d-viewer/        # 3D查看器资源（备用）
├── package.json          # 项目依赖
└── README_MERGED.md      # 本文档
```

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn 或 pnpm

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

然后在浏览器中访问 `http://localhost:3000`

### 构建生产版本
```bash
npm run build
npm start
```

## 🏠 公寓数据管理

### 当前公寓数据
项目目前包含以下公寓数据：

1. **Berlin Pankow公寓** - 完整的3D模型（有OBJ、MTL、纹理文件）
2. **示例公寓** - 仅配置文件（演示用）
3. **占位符1** - 预留位置
4. **占位符2** - 预留位置

### 添加新公寓模型

要添加新的公寓模型，请按以下步骤操作：

1. **准备模型文件**：
   ```
   public/apartments/新公寓名称/
   ├── textured_output.obj  # 3D模型文件
   ├── textured_output.mtl  # 材质文件
   ├── textured_output.jpg  # 纹理图片
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
   在`apartments`数组中添加新的公寓数据对象。

## 🎮 3D查看器使用指南

### 控制模式切换
- 点击"切换到FPS模式"按钮进入第一人称模式
- 在FPS模式下，点击"点击以启用FPS控制"来锁定鼠标
- 按ESC键退出FPS模式

### 鼠标轨道模式
- **左键拖拽**：旋转视角
- **右键拖拽**：平移视图
- **滚轮**：缩放

### FPS模式
- **WASD键**：前后左右移动
- **鼠标**：控制视角方向
- **ESC键**：退出FPS模式

### 其他功能
- **预设视角**：快速切换到顶视图、正视图、侧视图
- **重置视图**：恢复到初始视角
- **线框模式**：查看模型的线框结构
- **质量控制**：调节渲染质量以平衡性能和画质
- **截图功能**：保存当前视角的截图

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

## 🔧 开发说明

### 项目合并策略
本项目采用了以下合并策略：

1. **保持原项目完整性**：不修改原始的`apartment-gallery`和`3D_viewr`项目文件
2. **复用3D查看器**：通过iframe嵌入的方式复用3D_viewr的完整功能
3. **数据驱动**：使用真实的Apartments文件夹数据替换示例数据
4. **响应式设计**：确保在不同设备上都有良好的用户体验

### 关键组件说明

#### `apartment-3d-viewer.tsx`
- 核心的3D查看器组件
- 通过iframe嵌入完整的3D查看器HTML
- 支持与父窗口的消息通信
- 处理模型加载和错误状态

#### `apartment-gallery.tsx`
- 主画廊组件
- 使用真实公寓数据
- 区分有模型和无模型的公寓
- 集成3D查看器对话框

#### `apartment-data.ts`
- 公寓数据管理工具
- 提供统一的数据接口
- 支持扩展新的公寓数据

## 🌐 浏览器兼容性

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## 📝 许可证

MIT License

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

### 开发流程
1. Fork本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 创建GitHub Issue
- 发送邮件至项目维护者

---

**注意**：本项目成功合并了两个独立项目的功能，提供了完整的3D公寓展示解决方案。所有原始项目的功能都得到了保留和增强。 