export interface DistrictDef {
  key: string;
  label: string;
  keywords: string[];
}

/**
 * Cấu hình từ khóa nhận diện cho từng quận/huyện
 * Export lại biến này để các file View (HomeView, RouletteView) xài để filter hoặc loop.
 */
export const DISTRICT_DEFS: DistrictDef[] = [
  { key: 'quan-1', label: 'Quận 1', keywords: ['quan 1', 'q 1', 'q1', 'district 1'] },
  { key: 'quan-2', label: 'Quận 2', keywords: ['quan 2', 'q 2', 'q2', 'district 2'] },
  { key: 'quan-3', label: 'Quận 3', keywords: ['quan 3', 'q 3', 'q3', 'district 3'] },
  { key: 'quan-4', label: 'Quận 4', keywords: ['quan 4', 'q 4', 'q4', 'district 4'] },
  { key: 'quan-5', label: 'Quận 5', keywords: ['quan 5', 'q 5', 'q5', 'district 5'] },
  { key: 'quan-6', label: 'Quận 6', keywords: ['quan 6', 'q 6', 'q6', 'district 6'] },
  { key: 'quan-7', label: 'Quận 7', keywords: ['quan 7', 'q 7', 'q7', 'district 7'] },
  { key: 'quan-8', label: 'Quận 8', keywords: ['quan 8', 'q 8', 'q8', 'district 8'] },
  { key: 'quan-9', label: 'Quận 9', keywords: ['quan 9', 'q 9', 'q9', 'district 9'] },
  { key: 'quan-10', label: 'Quận 10', keywords: ['quan 10', 'q 10', 'q10', 'district 10'] },
  { key: 'quan-11', label: 'Quận 11', keywords: ['quan 11', 'q 11', 'q11', 'district 11'] },
  { key: 'quan-12', label: 'Quận 12', keywords: ['quan 12', 'q 12', 'q12', 'district 12'] },
  { key: 'go-vap', label: 'Quận Gò Vấp', keywords: ['go vap', 'q go vap', 'quan go vap'] },
  { key: 'binh-thanh', label: 'Quận Bình Thạnh', keywords: ['binh thanh', 'q binh thanh', 'quan binh thanh'] },
  { key: 'tan-binh', label: 'Quận Tân Bình', keywords: ['tan binh', 'q tan binh', 'quan tan binh'] },
  { key: 'tan-phu', label: 'Quận Tân Phú', keywords: ['tan phu', 'q tan phu', 'quan tan phu'] },
  { key: 'phu-nhuan', label: 'Quận Phú Nhuận', keywords: ['phu nhuan', 'q phu nhuan', 'quan phu nhuan'] },
  { key: 'binh-tan', label: 'Quận Bình Tân', keywords: ['binh tan', 'q binh tan', 'quan binh tan'] },
  { key: 'thu-duc', label: 'TP Thủ Đức', keywords: ['thu duc', 'tp thu duc', 'thanh pho thu duc', 'thuduc'] },
  { key: 'cu-chi', label: 'Huyện Củ Chi', keywords: ['cu chi', 'huyen cu chi', 'h cu chi'] },
  { key: 'hoc-mon', label: 'Huyện Hóc Môn', keywords: ['hoc mon', 'huyen hoc mon', 'h hoc mon'] },
  { key: 'binh-chanh', label: 'Huyện Bình Chánh', keywords: ['binh chanh', 'huyen binh chanh', 'h binh chanh'] },
  { key: 'nha-be', label: 'Huyện Nhà Bè', keywords: ['nha be', 'huyen nha be', 'h nha be'] },
  { key: 'can-gio', label: 'Huyện Cần Giờ', keywords: ['can gio', 'huyen can gio', 'h can gio'] }
];

/**
 * Hàm chuẩn hóa: Loại bỏ toàn bộ dấu tiếng Việt, chuyển về chữ thường
 */
export const removeVietnameseTones = (str: string): string => {
  if (!str) return '';
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); 
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); 
  str = str.trim().replace(/\s+/g, ' ');
  return str.toLowerCase();
};

/**
 * Compile pattern chứa Regex ranh giới từ \b để tăng tính chuẩn xác và mapping thẳng tới DistrictDef
 */
const COMPILED_DISTRICTS = DISTRICT_DEFS.map(def => {
  const pattern = [...def.keywords]
    .sort((a, b) => b.length - a.length)
    .map(kw => `\\b${kw}\\b`)
    .join('|');
    
  return {
    def, 
    regex: new RegExp(`(${pattern})`, 'i') 
  };
});

/**
 * Bộ đệm (Cache) tốc độ cao
 */
const districtCache = new Map<string, DistrictDef | null>();

/**
 * Hàm phân tích và lấy DistrictDef từ địa chỉ bất kỳ
 * Trả về full object (có .label, .key) để không bị crash giao diện
 * @param address Địa chỉ thô đầu vào
 * @returns Object DistrictDef hoặc null nếu không tìm thấy
 */
export const getDistrict = (address: string): DistrictDef | null => {
  if (!address || typeof address !== 'string') return null;

  // 1. Nếu cache có thì lấy ra xài luôn cho lẹ
  if (districtCache.has(address)) {
    return districtCache.get(address) as DistrictDef | null;
  }

  // 2. Xóa dấu tiếng Việt
  const normalizedAddress = removeVietnameseTones(address);

  // 3. Phân tách chuỗi ngược từ dưới lên ưu tiên
  const parts = normalizedAddress.split(',').map(p => p.trim()).reverse();

  let foundDistrict: DistrictDef | null = null;

  // Quét từng cụm
  for (const part of parts) {
    for (const district of COMPILED_DISTRICTS) {
      if (district.regex.test(part)) {
        foundDistrict = district.def;
        break;
      }
    }
    if (foundDistrict) break;
  }

  // 4. Quét tổng thể chuỗi nếu fail ở bước 3
  if (!foundDistrict) {
    for (const district of COMPILED_DISTRICTS) {
      if (district.regex.test(normalizedAddress)) {
        foundDistrict = district.def;
        break;
      }
    }
  }

  // 5. Lưu vào Cache 
  districtCache.set(address, foundDistrict);

  return foundDistrict;
};