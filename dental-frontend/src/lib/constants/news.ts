export const EN_MAP = {
  'Tất cả': 'All',
  'Đọc ngay': 'Read Now',
  'Đọc thêm': 'Read More',
  'Tìm kiếm bài viết...': 'Search articles...',
  'Không tìm thấy bài viết nào.': 'No articles found.',
  'Niềng răng': 'Braces',
  'Tẩy trắng': 'Whitening',
  'Răng sứ': 'Porcelain Teeth',
  'Chăm sóc răng': 'Oral Care',
  'Implant': 'Implant',
} as Record<string, string>;

export const STATIC_CATEGORIES = [
  { id: 'all', label: 'All Articles', icon: 'grid' },
  { id: 'implant-dentistry', label: 'Implant Dentistry', icon: 'implant' },
  { id: 'cosmetic-dentistry', label: 'Cosmetic Dentistry', icon: 'sparkle' },
  { id: 'orthodontics', label: 'Orthodontics', icon: 'braces' },
  { id: 'preventive-care', label: 'Preventive Care', icon: 'shield' },
  { id: 'dental-technology', label: 'Dental Technology', icon: 'technology' },
  { id: 'general-knowledge', label: 'General Knowledge', icon: 'book' },
];

// Strapi currently contains Vietnamese service tags. Keep the CMS values
// mapped to the English navigation IDs so the menu remains stable while
// editors can continue using the existing tags.
export const BLOG_CATEGORY_TAGS: Record<string, string[]> = {
  'implant-dentistry': ['implant', 'implants', 'implant dentistry'],
  'cosmetic-dentistry': ['cosmetic', 'whitening', 'tẩy trắng', 'porcelain', 'răng sứ', 'veneers', 'cosmetic dentistry'],
  orthodontics: ['orthodontics', 'braces', 'invisalign', 'niềng răng'],
  'preventive-care': ['preventive', 'oral care', 'chăm sóc răng', 'dental care'],
  'dental-technology': ['technology', 'digital dentistry', 'dental technology'],
  'general-knowledge': ['general', 'knowledge', 'general knowledge'],
};

export function getBlogCategoryLabel(category?: string) {
  const value = (category || '').trim().toLowerCase();
  const match = STATIC_CATEGORIES.find((item) => item.id !== 'all' && (
    item.id === value || (BLOG_CATEGORY_TAGS[item.id] || []).some((tag) => tag.toLowerCase() === value)
  ));
  return match?.label || category || 'General Knowledge';
}
