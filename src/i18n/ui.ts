/**
 * 화면에 고정으로 들어가는 문구(메뉴, 버튼 등)의 번역.
 * 한국어(ko)에 키를 추가하면 vi/en 에도 같은 키가 없을 때 빌드 오류가 나서 번역 누락을 막아줍니다.
 */
import type { Lang } from '../config/site';

const ko = {
  'nav.home': '홈',
  'nav.about': '회사소개',
  'nav.products': '제품',
  'nav.catalogue': '카탈로그',
  'nav.contact': '문의',
  'nav.menu': '메뉴',
  'nav.language': '언어 선택',

  'home.eyebrow': '베트남 친환경 표면재 전문 기업',
  'home.title': '가구와 인테리어의 표면을\n더 아름답고 단단하게',
  'home.lead': 'HIVINA는 한국 효산(HYOSAN)과 ICC의 기술을 바탕으로 베트남 동나이 공장에서 LPM과 Finishing Foil을 생산합니다.',
  'home.cta.products': '제품 보기',
  'home.cta.contact': '문의하기',
  'home.categories': '제품군',
  'home.about.title': 'HIVINA 소개',
  'home.about.more': '회사소개 더 보기',

  'about.title': '회사소개',
  'about.lead': 'HI VINA는 효산(HYOSAN)과 ICC의 이름을 딴 한국계 표면재 전문 기업입니다.',
  'about.body':
    '2020년 설립 이후 2021년부터 베트남 동나이성 장디엔 산업단지에서 생산을 시작했습니다. 멜라민 함침지(LPM), Finishing Foil 등 MDF·PB용 친환경 표면재를 생산·공급합니다.',
  'about.history': '연혁',
  'about.partners': '관계사',

  'products.title': '제품',
  'products.lead': 'HIVINA의 표면재 제품을 소개합니다.',
  'products.new': 'NEW',
  'products.empty': '등록된 제품이 없습니다.',
  'products.features': '특징',
  'products.applications': '적용 분야',
  'products.back': '제품 목록으로',
  'products.inquiry': '이 제품 문의하기',
  'products.noImage': '이미지 준비 중',

  'catalogue.title': '카탈로그',
  'catalogue.lead': '패턴별 디자인을 확인하세요.',
  'catalogue.empty': '패턴 이미지 준비 중입니다.',
  'catalogue.all': '전체',
  'catalogue.wood': '우드',
  'catalogue.stone': '스톤',
  'catalogue.fabric': '패브릭',
  'catalogue.fantasy': '판타지',
  'catalogue.solid': '솔리드',

  'contact.title': '문의',
  'contact.lead': '제품 및 거래 관련 문의는 아래 연락처로 부탁드립니다.',
  'contact.address': '주소',
  'contact.phone': '전화',
  'contact.fax': '팩스',
  'contact.email': '이메일',
  'contact.map': '지도에서 보기',

  'footer.rights': 'All rights reserved.',
  'notFound.title': '페이지를 찾을 수 없습니다',
  'notFound.back': '홈으로',
};

export type UIKey = keyof typeof ko;

const vi: Record<UIKey, string> = {
  'nav.home': 'Trang chủ',
  'nav.about': 'Giới thiệu',
  'nav.products': 'Sản phẩm',
  'nav.catalogue': 'Catalogue',
  'nav.contact': 'Liên hệ',
  'nav.menu': 'Menu',
  'nav.language': 'Chọn ngôn ngữ',

  'home.eyebrow': 'Chuyên sản xuất vật liệu bề mặt thân thiện môi trường tại Việt Nam',
  'home.title': 'Bề mặt nội thất\nđẹp hơn, bền hơn',
  'home.lead': 'Dựa trên công nghệ của HYOSAN và ICC (Hàn Quốc), HIVINA sản xuất LPM và Finishing Foil tại nhà máy ở Đồng Nai.',
  'home.cta.products': 'Xem sản phẩm',
  'home.cta.contact': 'Liên hệ',
  'home.categories': 'Dòng sản phẩm',
  'home.about.title': 'Về HIVINA',
  'home.about.more': 'Xem thêm',

  'about.title': 'Giới thiệu',
  'about.lead': 'HI VINA là doanh nghiệp vật liệu bề mặt có vốn Hàn Quốc, tên gọi ghép từ HYOSAN và ICC.',
  'about.body':
    'Thành lập năm 2020, HIVINA bắt đầu sản xuất từ năm 2021 tại KCN Giang Điền, tỉnh Đồng Nai. Chúng tôi sản xuất và cung cấp vật liệu bề mặt thân thiện môi trường cho MDF/PB như giấy melamine (LPM) và Finishing Foil.',
  'about.history': 'Lịch sử phát triển',
  'about.partners': 'Công ty liên kết',

  'products.title': 'Sản phẩm',
  'products.lead': 'Giới thiệu các sản phẩm vật liệu bề mặt của HIVINA.',
  'products.new': 'MỚI',
  'products.empty': 'Chưa có sản phẩm.',
  'products.features': 'Đặc điểm',
  'products.applications': 'Ứng dụng',
  'products.back': 'Quay lại danh sách',
  'products.inquiry': 'Liên hệ về sản phẩm này',
  'products.noImage': 'Hình ảnh đang cập nhật',

  'catalogue.title': 'Catalogue',
  'catalogue.lead': 'Xem các mẫu thiết kế theo nhóm.',
  'catalogue.empty': 'Hình ảnh mẫu đang được cập nhật.',
  'catalogue.all': 'Tất cả',
  'catalogue.wood': 'Vân gỗ',
  'catalogue.stone': 'Vân đá',
  'catalogue.fabric': 'Vân vải',
  'catalogue.fantasy': 'Fantasy',
  'catalogue.solid': 'Màu trơn',

  'contact.title': 'Liên hệ',
  'contact.lead': 'Vui lòng liên hệ với chúng tôi về sản phẩm và hợp tác kinh doanh.',
  'contact.address': 'Địa chỉ',
  'contact.phone': 'Điện thoại',
  'contact.fax': 'Fax',
  'contact.email': 'Email',
  'contact.map': 'Xem bản đồ',

  'footer.rights': 'All rights reserved.',
  'notFound.title': 'Không tìm thấy trang',
  'notFound.back': 'Về trang chủ',
};

const en: Record<UIKey, string> = {
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.products': 'Products',
  'nav.catalogue': 'Catalogue',
  'nav.contact': 'Contact',
  'nav.menu': 'Menu',
  'nav.language': 'Language',

  'home.eyebrow': 'Eco-friendly surface materials, made in Vietnam',
  'home.title': 'Better-looking, tougher\nsurfaces for furniture',
  'home.lead': 'Built on the know-how of HYOSAN and ICC of Korea, HIVINA produces LPM and finishing foil at its plant in Dong Nai.',
  'home.cta.products': 'View products',
  'home.cta.contact': 'Contact us',
  'home.categories': 'Product lines',
  'home.about.title': 'About HIVINA',
  'home.about.more': 'More about us',

  'about.title': 'About',
  'about.lead': 'HI VINA is a Korean-affiliated surface materials company named after HYOSAN and ICC.',
  'about.body':
    'Founded in 2020, HIVINA started production in 2021 at Giang Dien Industrial Park, Dong Nai. We make and supply eco-friendly surface materials for MDF and particleboard, including melamine paper (LPM) and finishing foil.',
  'about.history': 'History',
  'about.partners': 'Affiliates',

  'products.title': 'Products',
  'products.lead': 'Surface materials made by HIVINA.',
  'products.new': 'NEW',
  'products.empty': 'No products yet.',
  'products.features': 'Features',
  'products.applications': 'Applications',
  'products.back': 'Back to products',
  'products.inquiry': 'Ask about this product',
  'products.noImage': 'Image coming soon',

  'catalogue.title': 'Catalogue',
  'catalogue.lead': 'Browse our decors by group.',
  'catalogue.empty': 'Decor images coming soon.',
  'catalogue.all': 'All',
  'catalogue.wood': 'Wood',
  'catalogue.stone': 'Stone',
  'catalogue.fabric': 'Fabric',
  'catalogue.fantasy': 'Fantasy',
  'catalogue.solid': 'Solid',

  'contact.title': 'Contact',
  'contact.lead': 'Get in touch about our products or a business partnership.',
  'contact.address': 'Address',
  'contact.phone': 'Phone',
  'contact.fax': 'Fax',
  'contact.email': 'Email',
  'contact.map': 'Open in Maps',

  'footer.rights': 'All rights reserved.',
  'notFound.title': 'Page not found',
  'notFound.back': 'Go home',
};

export const UI: Record<Lang, Record<UIKey, string>> = { ko, vi, en };

export function useT(lang: Lang) {
  return (key: UIKey) => UI[lang][key];
}
