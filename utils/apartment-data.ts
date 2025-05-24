// Apartment data utilities
// 从真实的Apartments文件夹加载公寓数据

export interface ApartmentConfig {
  name: string;
  camera: {
    height: number;
    init_point: [number, number];
  };
}

export interface ApartmentData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  modelPath: string;
  config: ApartmentConfig;
  hasModel: boolean;
}

// 从Apartments文件夹获取的真实数据
export const APARTMENT_FOLDERS = ['berlin_pankow', 'example_apartment'];

// 已知有shotcut.png的公寓列表（可以根据实际情况更新）
const APARTMENTS_WITH_SHOTCUT = ['berlin_pankow'];

// 生成缩略图路径的函数
function getThumbnailPath(apartmentId: string): string {
  // 对于占位符，直接返回占位符图片
  if (apartmentId.startsWith('placeholder_')) {
    return '/placeholder.svg?height=400&width=400';
  }
  
  // 优先使用shotcut.png（如果该公寓有的话）
  if (APARTMENTS_WITH_SHOTCUT.includes(apartmentId)) {
    return `/apartments/${apartmentId}/shotcut.png`;
  }
  
  // 回退策略：根据已知的公寓结构选择合适的图片
  switch (apartmentId) {
    case 'berlin_pankow':
      return '/apartments/berlin_pankow/textured_output.jpg';
    default:
      return '/placeholder.svg?height=400&width=400';
  }
}

// 添加新公寓时的辅助函数
export function addApartmentWithShotcut(apartmentId: string) {
  if (!APARTMENTS_WITH_SHOTCUT.includes(apartmentId)) {
    APARTMENTS_WITH_SHOTCUT.push(apartmentId);
  }
}

// 创建公寓数据数组，包括空位
export const apartments: ApartmentData[] = [
  // Berlin Pankow 公寓
  {
    id: 'berlin_pankow',
    title: 'Berlin Pankow公寓',
    description: '位于柏林潘科区的真实3D扫描公寓模型。采用高精度扫描技术，完整还原实际空间布局和细节，提供沉浸式的空间浏览体验。',
    thumbnail: getThumbnailPath('berlin_pankow'),
    modelPath: '/apartments/berlin_pankow',
    config: {
      name: 'Berlin Pankow',
      camera: {
        height: 1.3,
        init_point: [0, 0]
      }
    },
    hasModel: true
  },
  // 示例公寓
  {
    id: 'example_apartment',
    title: '示例公寓（演示用）',
    description: '这是一个演示用的示例公寓模型，用于展示3D查看器的基本功能和交互方式。适合用来体验不同的控制模式和视角切换。',
    thumbnail: getThumbnailPath('example_apartment'),
    modelPath: '/apartments/example_apartment',
    config: {
      name: '示例公寓（演示用）',
      camera: {
        height: 1.8,
        init_point: [5, 15]
      }
    },
    hasModel: false // example_apartment目前只有config.json
  },
  // 空位1
  {
    id: 'placeholder_1',
    title: '更多公寓即将推出',
    description: '我们正在扫描和处理更多的公寓模型，敬请期待。如果您有兴趣展示您的公寓，请联系我们。',
    thumbnail: getThumbnailPath('placeholder_1'),
    modelPath: '',
    config: {
      name: '待添加',
      camera: { height: 1.7, init_point: [0, 0] }
    },
    hasModel: false
  },
  // 空位2
  {
    id: 'placeholder_2',
    title: '更多公寓即将推出',
    description: '我们正在扫描和处理更多的公寓模型，敬请期待。如果您有兴趣展示您的公寓，请联系我们。',
    thumbnail: getThumbnailPath('placeholder_2'),
    modelPath: '',
    config: {
      name: '待添加',
      camera: { height: 1.7, init_point: [0, 0] }
    },
    hasModel: false
  }
];

// 获取所有可用的公寓数据
export function getApartments(): ApartmentData[] {
  return apartments;
}

// 根据ID获取特定公寓数据
export function getApartmentById(id: string): ApartmentData | null {
  return apartments.find(apt => apt.id === id) || null;
}

// 获取有3D模型的公寓
export function getApartmentsWithModels(): ApartmentData[] {
  return apartments.filter(apt => apt.hasModel);
}

// 检查公寓是否有shotcut.png预览图的函数
export function hasShortcutImage(apartmentId: string): boolean {
  return APARTMENTS_WITH_SHOTCUT.includes(apartmentId);
} 