/**
 * Hàm chuẩn hóa: Loại bỏ toàn bộ dấu tiếng Việt, chuyển về chữ thường
 * Giúp việc so sánh không bị ảnh hưởng bởi font chữ hay cách gõ dấu (ví dụ: Gò Vấp = go vap)
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
  // Xử lý các dấu thanh đi kèm riêng lẻ
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Loại bỏ khoảng trắng thừa
  str = str.trim().replace(/\s+/g, ' ');
  return str.toLowerCase();
};

/**
 * Cấu hình từ khóa nhận diện cho từng quận/huyện
 * Lưu ý: Tất cả từ khóa viết ở dạng chữ thường, KHÔNG dấu.
 */
const DISTRICT_CONFIG: Record<string, string[]> = {
  "Quận 1": ["quan 1", "q 1", "q1", "district 1"],
  "Quận 2": ["quan 2", "q 2", "q2", "district 2"],
  "Quận 3": ["quan 3", "q 3", "q3", "district 3"],
  "Quận 4": ["quan 4", "q 4", "q4", "district 4"],
  "Quận 5": ["quan 5", "q 5", "q5", "district 5"],
  "Quận 6": ["quan 6", "q 6", "q6", "district 6"],
  "Quận 7": ["quan 7", "q 7", "q7", "district 7"],
  "Quận 8": ["quan 8", "q 8", "q8", "district 8"],
  "Quận 9": ["quan 9", "q 9", "q9", "district 9"],
  "Quận 10": ["quan 10", "q 10", "q10", "district 10"],
  "Quận 11": ["quan 11", "q 11", "q11", "district 11"],
  "Quận 12": ["quan 12", "q 12", "q12", "district 12"],
  "Quận Gò Vấp": ["go vap", "q go vap", "quan go vap"],
  "Quận Bình Thạnh": ["binh thanh", "q binh thanh", "quan binh thanh"],
  "Quận Tân Bình": ["tan binh", "q tan binh", "quan tan binh"],
  "Quận Tân Phú": ["tan phu", "q tan phu", "quan tan phu"],
  "Quận Phú Nhuận": ["phu nhuan", "q phu nhuan", "quan phu nhuan"],
  "Quận Bình Tân": ["binh tan", "q binh tan", "quan binh tan"],
  "TP Thủ Đức": ["thu duc", "tp thu duc", "thanh pho thu duc", "thuduc"],
  "Huyện Củ Chi": ["cu chi", "huyen cu chi", "h cu chi"],
  "Huyện Hóc Môn": ["hoc mon", "huyen hoc mon", "h hoc mon"],
  "Huyện Bình Chánh": ["binh chanh", "huyen binh chanh", "h binh chanh"],
  "Huyện Nhà Bè": ["nha be", "huyen nha be", "h nha be"],
  "Huyện Cần Giờ": ["can gio", "huyen can gio", "h can gio"],
};

/**
 * Bước khởi tạo 1 lần (Pre-compile): 
 * Map cấu hình thành mảng Regex chứa ranh giới từ \b.
 * \b ngăn chặn "quan 1" bắt nhầm vào "quan 12" hoặc "binh tan" dính vào "tan binh".
 */
const COMPILED_DISTRICTS = Object.entries(DISTRICT_CONFIG).map(([name, keywords]) => {
  // Sắp xếp keyword dài lên trước để ưu tiên match cụm dài, kết hợp \b bao bọc
  const pattern = keywords
    .sort((a, b) => b.length - a.length)
    .map(kw => `\\b${kw}\\b`)
    .join('|');
    
  return {
    name,
    regex: new RegExp(`(${pattern})`, 'i') // 'i' để không phân biệt hoa thường
  };
});

/**
 * Bộ đệm (Cache) để tăng tốc cho hàng tỉ dữ liệu
 * Độ phức tạp lúc này sẽ giảm xuống O(1) cho những địa chỉ lặp lại.
 */
const districtCache = new Map<string, string | null>();

/**
 * Hàm phân tích và lấy tên Quận/Huyện từ địa chỉ bất kỳ
 * @param address Địa chỉ thô đầu vào
 * @returns Tên Quận/Huyện chuẩn hoặc null nếu không tìm thấy
 */
export const getDistrict = (address: string): string | null => {
  if (!address || typeof address !== 'string') return null;

  // 1. Kiểm tra Cache - Nếu đã từng xử lý rồi thì trả về ngay
  if (districtCache.has(address)) {
    return districtCache.get(address) as string | null;
  }

  // 2. Chuẩn hóa chuỗi (Xóa dấu, đưa về lowercase)
  const normalizedAddress = removeVietnameseTones(address);

  // 3. Phân tách từ dưới lên (Tail-first parsing)
  // Ưu tiên cắt theo dấu phẩy và đảo ngược mảng vì quận/huyện hay nằm ở cuối
  const parts = normalizedAddress.split(',').map(p => p.trim()).reverse();

  let foundDistrict: string | null = null;

  // Quét từng cụm địa chỉ từ cuối lên đầu
  for (const part of parts) {
    for (const district of COMPILED_DISTRICTS) {
      if (district.regex.test(part)) {
        foundDistrict = district.name;
        break;
      }
    }
    // Nếu tìm thấy rồi thì thoát vòng lặp ngoài luôn, tiết kiệm tài nguyên
    if (foundDistrict) break;
  }

  // 4. Fallback an toàn:
  // Nếu chuỗi địa chỉ đầu vào không hề có dấu phẩy (ví dụ: "20 Cộng Hòa Tân Bình HCM"), 
  // ta quét Regex trên toàn bộ chuỗi chuẩn hóa.
  if (!foundDistrict) {
    for (const district of COMPILED_DISTRICTS) {
      if (district.regex.test(normalizedAddress)) {
        foundDistrict = district.name;
        break;
      }
    }
  }

  // 5. Lưu vào Cache trước khi trả về để xài cho lần sau
  districtCache.set(address, foundDistrict);

  return foundDistrict;
};