import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

const EXCEL_FILE = 'Danh sách các quán ăn.xlsx';
const OUTPUT_FILE = path.resolve('./src/assets/restaurants.json');

try {
  console.log(`Đang đọc dữ liệu từ ${EXCEL_FILE}...`);
  const workbook = xlsx.readFile(EXCEL_FILE);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  const data = xlsx.utils.sheet_to_json(sheet);
  
  // Format lại keys cho chuẩn TypeScript
  const formattedData = data.map((row, index) => ({
    id: index + 1,
    name: row['Tên quán'] || 'Chưa rõ',
    price: row['Mức giá'] || 'Vừa phải',
    address: row['Địa chỉ'] || '',
    rating: Number(row['Đánh giá']) || 0,
    visited: row['Đã đi'] === 'Rồi' || row['Đã đi'] === true || row['Đã đi'] === 'Yes',
    notes: row['Kỷ niệm'] || '',
    photoUrl: row['Ảnh'] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    dateVisited: row['Ngày đi'] || null,
    lat: Number(row['Vĩ độ']) || 10.762622, // Mặc định HCM
    lng: Number(row['Kinh độ']) || 106.660172
  }));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(formattedData, null, 2));
  console.log('✅ Đã tạo thành công src/assets/restaurants.json cho Cưng!');
} catch (error) {
  console.error('❌ Lỗi khi đọc file Excel:', error.message);
  console.log('Hãy đảm bảo file "Danh sách các quán ăn.xlsx" nằm ở thư mục gốc.');
}