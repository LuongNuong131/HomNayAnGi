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
  
  if (data.length > 0) {
    console.log('📋 Các cột trong file Excel:', Object.keys(data[0]));
    console.log('📝 Dữ liệu hàng đầu tiên:', JSON.stringify(data[0], null, 2));
  }

  // Helper: tìm giá trị từ row theo nhiều tên cột có thể
  const getField = (row: any, ...keys: string[]): string => {
    for (const k of keys) {
      if (row[k] !== undefined && row[k] !== null && row[k] !== '') {
        return String(row[k]).trim();
      }
    }
    return '';
  };

  // Helper: parse boolean từ nhiều dạng giá trị
  const parseBool = (val: any): boolean => {
    if (val === undefined || val === null) return false;
    const s = String(val).trim().toLowerCase();
    return /^(x|có|co|yes|true|1|✓|✔|v|đã|da|done|y|checked)$/i.test(s);
  };

  const formattedData = data.map((row: any, index: number) => {
    // Tên quán - thử nhiều tên cột
    const name = getField(row,
      'Tên Quán', 'Tên quán', 'Ten Quan', 'ten quan', 'Quán', 'Name', 'name'
    );

    // Giá
    const price = getField(row,
      'Giá', 'Mức giá', 'Gia', 'Price', 'price', 'Muc Gia'
    );

    // Địa chỉ
    const address = getField(row,
      'Địa Chỉ', 'Địa chỉ', 'Dia Chi', 'dia chi', 'Address', 'address'
    );

    // Ưu điểm
    const advantage = getField(row,
      'Ưu Điểm', 'Ưu điểm', 'Uu Diem', 'uu diem', 'Pros', 'pros'
    );

    // Nhược điểm
    const disadvantages = getField(row,
      'Nhược Điểm', 'Nhược điểm', 'Nhuoc Diem', 'nhuoc diem', 'Cons', 'cons'
    );

    // Link map
    const linkmap = getField(row,
      'Link Map', 'Link map', 'link map', 'Link', 'Map', 'Google Maps'
    );

    // Đã trải nghiệm - thử rất nhiều tên cột
    const rawExp = row['Đã Trải Nghiệm']
      ?? row['Đã trải nghiệm']
      ?? row['Da Trai Nghiem']
      ?? row['Trải Nghiệm']
      ?? row['trai nghiem']
      ?? row['Experienced']
      ?? row['experienced']
      ?? row['Done']
      ?? row['done']
      ?? row['Đi Rồi']
      ?? row['di roi']
      ?? row['Đã đi']
      ?? row['da di']
      ?? row['Đã Đi']
      ?? row['Check']
      ?? row['check']
      ?? null;

    const experienced = parseBool(rawExp);

    if (index === 0) {
      console.log('  → experienced raw value:', rawExp, '→ parsed:', experienced);
    }

    return {
      id: index + 1,
      name,
      price,
      address,
      advantage,
      disadvantages,
      linkmap,
      experienced,
    };
  }).filter((r: any) => r.name); // bỏ hàng trống

  const experiencedCount = formattedData.filter((r: any) => r.experienced).length;
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(formattedData, null, 2));
  console.log(`\n✅ Đã tạo thành công src/assets/restaurants.json!`);
  console.log(`   📊 Tổng: ${formattedData.length} quán`);
  console.log(`   ✓  Đã đi: ${experiencedCount} quán`);
  console.log(`   ○  Chưa đi: ${formattedData.length - experiencedCount} quán`);

  if (experiencedCount === 0) {
    console.warn('\n⚠️  Tất cả quán đều là "chưa đi".');
    console.warn('   Hãy kiểm tra lại tên cột "Đã Trải Nghiệm" trong file Excel.');
    console.warn('   Các cột hiện có:', Object.keys(data[0] ?? {}).join(', '));
  }
} catch (error: any) {
  console.error('❌ Lỗi khi đọc file Excel:', error.message);
  console.log(`Hãy đảm bảo file "${EXCEL_FILE}" nằm ở thư mục gốc và đã chạy 'npm install'.`);
}
