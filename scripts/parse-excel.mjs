import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

// Tên file Excel của LuNu, có thể đổi thành Danh sách các quán ăn_2.xlsx nếu cần
const EXCEL_FILE = 'Danh sách các quán ăn.xlsx';
const OUTPUT_FILE = path.resolve('./src/assets/restaurants.json');

try {
  console.log(`Đang đọc dữ liệu từ ${EXCEL_FILE}...`);
  const workbook = xlsx.readFile(EXCEL_FILE);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  const data = xlsx.utils.sheet_to_json(sheet);
  
  // Quét chính xác các cột dựa trên tên cột trong Excel
  const formattedData = data.map((row, index) => ({
    id: index + 1,
    name: row['Tên Quán'] || row['Tên quán'] || '',
    price: row['Giá'] || row['Mức giá'] || '',
    address: row['Địa Chỉ'] || row['Địa chỉ'] || '',
    advantage: row['Ưu Điểm'] || row['Ưu điểm'] || '',
    disadvantages: row['Nhược Điểm'] || row['Nhược điểm'] || '',
    linkmap: row['Link Map'] || row['Link map'] || ''
  }));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(formattedData, null, 2));
  console.log('✅ Đã tạo thành công src/assets/restaurants.json chuẩn cấu trúc cho Cưng!');
} catch (error) {
  console.error('❌ Lỗi khi đọc file Excel:', error.message);
  console.log(`Hãy đảm bảo file "${EXCEL_FILE}" nằm ở thư mục gốc và cưng đã chạy 'npm install'.`);
}