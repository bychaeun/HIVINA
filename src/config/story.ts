import type { Lang } from './site';
export const STORY = {
  ko: {
    title: '한국의 기술을 잇고,\n베트남에서 만듭니다.',
    intro: '효산과 ICC의 경험을 바탕으로, 공간의 바탕이 되는 표면재를 만듭니다.',
    foundation: '하나의 뿌리,\n이어지는 전문성.',
    photo: '베트남 동나이 HIVINA 사옥',
    location: '생산 거점', material: '주요 소재', roots: '기술의 뿌리',
    locationValue: '베트남 동나이', materialValue: 'LPM · Finishing Foil',
    historyNote: '효산·ICC의 시작부터 HIVINA의 오늘까지',
    historyTitle: '경험이 쌓이고,\n다음으로 이어집니다.',
    next: '다음 공간을 함께 만듭니다.',
  },
  en: {
    title: 'Korean expertise.\nMade in Vietnam.',
    intro: 'Building on the experience of HYOSAN and ICC, we make the surfaces that shape everyday spaces.',
    foundation: 'Shared roots.\nContinuing expertise.',
    photo: 'HIVINA office in Dong Nai, Vietnam',
    location: 'Production base', material: 'Core materials', roots: 'Technical roots',
    locationValue: 'Dong Nai, Vietnam', materialValue: 'LPM · Finishing Foil',
    historyNote: 'From the beginnings of HYOSAN and ICC to HIVINA today',
    historyTitle: 'Experience,\ncarried forward.', next: 'Let’s shape your next space.',
  },
  vi: {
    title: 'Công nghệ Hàn Quốc.\nSản xuất tại Việt Nam.',
    intro: 'Kế thừa kinh nghiệm của HYOSAN và ICC, chúng tôi tạo nên vật liệu bề mặt cho không gian sống.',
    foundation: 'Chung nguồn cội.\nTiếp nối chuyên môn.',
    photo: 'Văn phòng HIVINA tại Đồng Nai, Việt Nam',
    location: 'Cơ sở sản xuất', material: 'Vật liệu chính', roots: 'Nền tảng công nghệ',
    locationValue: 'Đồng Nai, Việt Nam', materialValue: 'LPM · Finishing Foil',
    historyNote: 'Từ khởi đầu của HYOSAN và ICC đến HIVINA hôm nay',
    historyTitle: 'Tích lũy kinh nghiệm,\nTiếp bước tương lai.', next: 'Cùng tạo nên không gian tiếp theo.',
  },
} satisfies Record<Lang, Record<string, string>>;
