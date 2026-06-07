# LuNu ❤️ Bé Yêu - Hôm Nay Ăn Gì?

Ứng dụng nhật ký ẩm thực cá nhân cao cấp dành riêng cho hai cưng. 

## Cài đặt & Khởi chạy

1. Cài đặt các gói phụ thuộc:
\`\`\`bash
npm install
\`\`\`

2. Thiết lập môi trường (.env):
\`\`\`
VITE_GEMINI_API_KEY=key_cua_ban
VITE_GOOGLE_MAPS_API_KEY=key_cua_ban
\`\`\`

3. Đồng bộ dữ liệu Excel sang JSON:
*Đảm bảo file `Danh sách các quán ăn.xlsx` nằm ở thư mục gốc của dự án.*
\`\`\`bash
npm run parse-data
\`\`\`

4. Khởi chạy dự án ở môi trường dev:
\`\`\`bash
npm run dev
\`\`\`

## Deploy lên Vercel
Dự án đã được config sẵn `vercel.json`. Chỉ cần push code lên Github và kết nối với Vercel, framework sẽ tự động nhận diện là `Vite` và build tĩnh hoàn toàn miễn phí.