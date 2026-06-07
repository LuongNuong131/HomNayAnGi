export interface DistrictInfo {
  key: string;
  label: string;
}

interface DistrictDef {
  key: string;
  label: string;
  patterns: string[];
}

// Mỗi pattern là substring lowercase sẽ được tìm trong địa chỉ lowercase
const DISTRICTS: DistrictDef[] = [
  {
    key: 'go-vap',
    label: 'Gò Vấp',
    patterns: [
      'gò vấp', 'go vap',
      'hạnh thông', 'hanh thong',
      'an hội', 'an hoi',
      'quang trung',
      'nguyễn văn nghi', 'nguyen van nghi',
      'phan văn trị', 'phan van tri',
      'lê đức thọ', 'le duc tho',
      'nguyễn văn bảo', 'nguyen van bao',
      'bùi đình túy', 'bui dinh tuy',
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
      'thạnh xuân', 'thanh xuan',
      'tân hưng thuận', 'tan hung thuan',
      'hiệp thành', 'hiep thanh',
      'trường chinh, đông hưng',
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
      'song hành', 'song hanh',
      'đông thạnh', 'dong thanh',
      'tân hiệp, hóc', 'tan hiep, hoc',
      'xuân thới đông', 'xuan thoi dong',
      'xuân thới thượng', 'xuan thoi thuong',
      'nhị bình', 'nhi binh',
      'thới tam thôn', 'thoi tam thon',
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
      'thủ đức', 'thu duc',
      'linh xuân', 'linh xuan',
      'linh trung', 'linh chiểu', 'linh chieu',
      'linh tây', 'linh tay',
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
      'lê hồng phong, bình dương',
    ],
  },
  {
    key: 'tan-binh',
    label: 'Tân Bình',
    patterns: [
      'tân bình', 'tan binh',
      'cộng hòa', 'cong hoa',
      'trường chinh, tân bình',
      'bắc hải', 'bac hai',
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
      'sơn kỳ', 'son ky',
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

function norm(s: string): string {
  return s.toLowerCase();
}

export function getDistrict(address: string): DistrictInfo | null {
  if (!address) return null;
  const a = norm(address);
  for (const d of DISTRICTS) {
    for (const pat of d.patterns) {
      if (a.includes(norm(pat))) {
        return { key: d.key, label: d.label };
      }
    }
  }
  return null;
}

export const DISTRICT_DEFS = DISTRICTS;
export type { DistrictDef };