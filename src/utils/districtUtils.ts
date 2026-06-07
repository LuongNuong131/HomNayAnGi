export interface DistrictInfo {
  key: string;
  label: string;
}

interface DistrictDef {
  key: string;
  label: string;
  patterns: string[]; // substrings to match (case-insensitive)
}

const DISTRICTS: DistrictDef[] = [
  {
    key: 'go-vap',
    label: 'Gò Vấp',
    patterns: [
      'gò vấp', 'go vap',
      // Old wards still used in addresses
      'hạnh thông', 'hanh thong',
      'an hội đông', 'an hội tây', 'an hội bắc',
      'quang trung', 'nguyễn văn nghi',
      'phan văn trị', 'lê đức thọ',
      'nguyễn văn bảo',
      // Street names highly specific to GV
      'đ. số 8, gò', 'bùi đình túy',
    ],
  },
  {
    key: 'quan-12',
    label: 'Quận 12',
    patterns: [
      'quận 12', 'quan 12', 'q.12', 'q12',
      'đông hưng thuận', 'dong hung thuan',
      'tân thới hiệp', 'tan thoi hiep',
      'trung mỹ tây', 'trung my tay',
      'an phú đông', 'an phu dong',
      'nguyễn văn quá', 'nguyen van qua',
      'thị mười', 'thi muoi',
      'tô ký', 'to ky',
      'tân chánh hiệp', 'tan chanh hiep',
      'thạnh lộc', 'thanh loc',
    ],
  },
  {
    key: 'hoc-mon',
    label: 'Hóc Môn',
    patterns: [
      'hóc môn', 'hoc mon',
      'bà điểm', 'ba diem',
      'phan văn hớn', 'phan van hon',
      'nguyễn hữu cầu', 'nguyen huu cau',
      'nguyễn ảnh thủ', 'nguyen anh thu',
      'vạn hạnh', 'van hanh',
      'đông thạnh', 'dong thanh',
      'xuân thới', 'xuan thoi',
      'tân hiệp', 'tan hiep',
    ],
  },
  {
    key: 'binh-thanh',
    label: 'Bình Thạnh',
    patterns: [
      'bình thạnh', 'binh thanh',
      'nhiêu lộc', 'nhieu loc',
      'gia định', 'gia dinh',
      'phan xích long', 'phan xich long',
      'hoàng sa', 'hoang sa',
      'lý chính thắng', 'ly chinh thang',
      'đinh tiên hoàng', 'dinh tien hoang',
      'bùi hữu nghĩa', 'bui huu nghia',
      'xô viết nghệ tĩnh', 'xo viet nghe tinh',
    ],
  },
  {
    key: 'thu-duc',
    label: 'TP. Thủ Đức',
    patterns: [
      'thủ đức', 'thu duc', 'tp. thủ đức',
      'linh xuân', 'linh xuan',
      'linh trung', 'linh chiểu', 'linh tây',
      'hiệp bình', 'hiep binh',
      'tam bình', 'tam binh',
      'trường thọ', 'truong tho',
      'bình chiểu', 'binh chieu',
      'long bình', 'long binh',
      'long thạnh mỹ', 'long thanh my',
      'phước long', 'phuoc long',
      'tăng nhơn phú', 'tang nhon phu',
    ],
  },
  {
    key: 'binh-duong',
    label: 'Bình Dương',
    patterns: [
      'bình dương', 'binh duong',
      'phú lợi', 'phu loi',
      'diên hồng', 'dien hong',
      'tam đảo', 'tam dao',
      'thuận an', 'thuan an',
      'dĩ an', 'di an',
      'thủ dầu một', 'thu dau mot',
    ],
  },
  {
    key: 'tan-binh',
    label: 'Tân Bình',
    patterns: [
      'tân bình', 'tan binh',
      'cộng hòa', 'cong hoa',
      'trường chinh', 'truong chinh',
      'lạc long quân', 'lac long quan',
    ],
  },
  {
    key: 'tan-phu',
    label: 'Tân Phú',
    patterns: [
      'tân phú', 'tan phu',
      'hòa thạnh', 'hoa thanh',
      'hiệp tân', 'hiep tan',
      'phú thọ hòa', 'phu tho hoa',
    ],
  },
  {
    key: 'binh-tan',
    label: 'Bình Tân',
    patterns: [
      'bình tân', 'binh tan',
      'an lạc', 'an lac',
      'tân tạo', 'tan tao',
      'bình trị đông', 'binh tri dong',
    ],
  },
];

// Normalize Vietnamese string for looser matching
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFC'); // keep diacritics but lowercase
}

export function getDistrict(address: string): DistrictInfo | null {
  const a = normalize(address);
  for (const d of DISTRICTS) {
    for (const pat of d.patterns) {
      if (a.includes(normalize(pat))) {
        return { key: d.key, label: d.label };
      }
    }
  }
  return null;
}

export const DISTRICT_DEFS = DISTRICTS;
export type { DistrictDef };