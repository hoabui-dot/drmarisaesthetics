export const EN_MAP = {
  'Tất cả': 'All',
  'Đọc ngay': 'Read Now',
  'Đọc thêm': 'Read More',
  'Tìm kiếm bài viết...': 'Search articles...',
  'Không tìm thấy bài viết nào.': 'No articles found.',
  'Phẫu thuật chỉnh sửa': 'Revision Surgery',
  'Tạo hình khuôn mặt': 'Facial Contouring',
  'Nâng mũi': 'Rhinoplasty',
  'Chăm sóc hậu phẫu': 'Postoperative Care',
  'Phẫu thuật thẩm mỹ': 'Cosmetic Surgery',
} as Record<string, string>;

export const STATIC_CATEGORIES = [
  { id: 'all', label: 'All Articles', icon: 'grid' },
  { id: 'revision-surgery', label: 'Revision Surgery', icon: 'shield' },
  { id: 'facial-contouring', label: 'Facial Contouring', icon: 'sparkle' },
  { id: 'rhinoplasty', label: 'Rhinoplasty', icon: 'book' },
  { id: 'postoperative-care', label: 'Postoperative Care', icon: 'shield' },
  { id: 'cosmetic-surgery', label: 'Cosmetic Surgery', icon: 'technology' },
  { id: 'plastic-surgery', label: 'Plastic Surgery', icon: 'sparkle' },
  { id: 'general-knowledge', label: 'General Knowledge', icon: 'book' },
];

// Strapi currently contains Vietnamese service tags. Keep the CMS values
// mapped to the English navigation IDs so the menu remains stable while
// editors can continue using the existing tags.
export const BLOG_CATEGORY_TAGS: Record<string, string[]> = {
  'revision-surgery': ['revision', 'revision surgery', 'phẫu thuật chỉnh sửa'],
  'facial-contouring': ['facial', 'facial contouring', 'tạo hình khuôn mặt'],
  rhinoplasty: ['rhinoplasty', 'nâng mũi'],
  'postoperative-care': ['postoperative', 'aftercare', 'chăm sóc hậu phẫu'],
  'cosmetic-surgery': ['cosmetic', 'cosmetic surgery', 'phẫu thuật thẩm mỹ'],
  'plastic-surgery': ['plastic surgery', 'plastic'],
  'general-knowledge': ['general', 'knowledge', 'general knowledge'],
};

export function getBlogCategoryLabel(category?: string) {
  const value = (category || '').trim().toLowerCase();
  const match = STATIC_CATEGORIES.find((item) => item.id !== 'all' && (
    item.id === value || (BLOG_CATEGORY_TAGS[item.id] || []).some((tag) => tag.toLowerCase() === value)
  ));
  return match?.label || category || 'General Knowledge';
}
