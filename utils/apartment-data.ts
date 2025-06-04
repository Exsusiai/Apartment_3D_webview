// Apartment data utilities
// 从真实的Apartments文件夹加载公寓数据

export interface ApartmentConfig {
  name: string;
  description?: string;
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

// 公寓列表接口
interface ApartmentListItem {
  id: string;
  hasModel: boolean;
  hasShotcut: boolean;
}

interface ApartmentsList {
  apartments: ApartmentListItem[];
  generatedAt: string;
}

// 动态加载公寓列表
async function loadApartmentsList(): Promise<ApartmentsList> {
  try {
    const response = await fetch('/apartments-list.json');
    if (!response.ok) {
      throw new Error('Failed to load apartments list');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading apartments list:', error);
    // 返回空列表作为 fallback
    return { apartments: [], generatedAt: new Date().toISOString() };
  }
}

// 动态加载公寓配置的函数
export async function loadApartmentConfig(apartmentId: string): Promise<ApartmentConfig | null> {
  try {
    const response = await fetch(`/apartments/${apartmentId}/config.json`);
    if (!response.ok) {
      console.warn(`Failed to load config for ${apartmentId}: ${response.status}`);
      return null;
    }
    const config = await response.json();
    return config;
  } catch (error) {
    console.warn(`Error loading config for ${apartmentId}:`, error);
    return null;
  }
}

// 生成缩略图路径的函数
function getThumbnailPath(apartmentId: string, hasShotcut: boolean): string {
  if (hasShotcut) {
    return `/apartments/${apartmentId}/shotcut.png`;
  }
  
  // 如果没有 shotcut.png，尝试使用 textured_output.jpg
  // 但由于我们是前端，无法检查文件是否存在，所以直接返回路径
  // 如果不存在，浏览器会处理 404
  return `/apartments/${apartmentId}/textured_output.jpg`;
}

// 默认配置，用于fallback
const DEFAULT_CONFIG: ApartmentConfig = {
  name: 'Apartment',
  description: 'No description available',
  camera: {
    height: 1.7,
    init_point: [0, 0]
  }
};

// 动态创建公寓数据的函数
async function createApartmentData(apartment: ApartmentListItem): Promise<ApartmentData> {
  const config = await loadApartmentConfig(apartment.id) || DEFAULT_CONFIG;
  
  // 格式化description中的换行符
  const formattedDescription = config.description 
    ? config.description.replace(/\\n/g, '\n')
    : DEFAULT_CONFIG.description!;
  
  // 获取缩略图路径
  let thumbnail = getThumbnailPath(apartment.id, apartment.hasShotcut);
  
  // 如果既没有 shotcut 也没有模型（可能没有 textured_output.jpg），使用占位符
  if (!apartment.hasShotcut && !apartment.hasModel) {
    thumbnail = '/placeholder.svg?height=400&width=400';
  }
  
  return {
    id: apartment.id,
    title: config.name,
    description: formattedDescription,
    thumbnail: thumbnail,
    modelPath: `/apartments/${apartment.id}`,
    config: {
      ...config,
      description: formattedDescription
    },
    hasModel: apartment.hasModel
  };
}

// 创建公寓数据数组
let apartmentsCache: ApartmentData[] | null = null;
let apartmentsListCache: ApartmentsList | null = null;

export async function getApartments(): Promise<ApartmentData[]> {
  // 如果有缓存，直接返回
  if (apartmentsCache) {
    return apartmentsCache;
  }

  // 加载公寓列表
  if (!apartmentsListCache) {
    apartmentsListCache = await loadApartmentsList();
  }

  const apartments: ApartmentData[] = [];
  
  // 动态加载每个公寓的数据
  for (const apartment of apartmentsListCache.apartments) {
    try {
      const apartmentData = await createApartmentData(apartment);
      apartments.push(apartmentData);
    } catch (error) {
      console.error(`Failed to create apartment data for ${apartment.id}:`, error);
    }
  }

  // 缓存结果
  apartmentsCache = apartments;
  return apartments;
}

// 根据ID获取特定公寓数据
export async function getApartmentById(id: string): Promise<ApartmentData | null> {
  const apartments = await getApartments();
  return apartments.find(apt => apt.id === id) || null;
}

// 获取有3D模型的公寓
export async function getApartmentsWithModels(): Promise<ApartmentData[]> {
  const apartments = await getApartments();
  return apartments.filter(apt => apt.hasModel);
}

// 清除缓存的函数（用于开发时重新加载）
export function clearApartmentsCache() {
  apartmentsCache = null;
  apartmentsListCache = null;
} 