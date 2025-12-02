# HƯỚNG DẪN TRUY CẬP CV DOCX ĐÃ TẠO

## 📁 VỊ TRÍ FILE

**Đường dẫn đầy đủ:**
```
D:\DoAnPTPMHDT\backend\sample_cvs\sample_cvs_docx\
```

**Đường dẫn tương đối (từ thư mục gốc project):**
```
backend/sample_cvs/sample_cvs_docx/
```

---

## 📋 DANH SÁCH 10 CV DOCX

Các file CV đã được tạo thành công trong thư mục `sample_cvs_docx/`:

1. ✅ `CV_01_Lan_Phạm_Frontend_Developer.docx`
2. ✅ `CV_02_Trung_Mai_Backend_Developer.docx`
3. ✅ `CV_03_Trọng_Phạm_Digital_Marketing_Specialist.docx`
4. ✅ `CV_04_Nhật_Lê_Kế_toán_tổng_hợp.docx`
5. ✅ `CV_05_Dũng_Lê_HR_Manager.docx`
6. ✅ `CV_06_Thành_Đức_Nguyễn_Sales_ITPhần_mềm.docx`
7. ✅ `CV_07_Bà_Ngọc_Bùi_Data_Analyst.docx`
8. ✅ `CV_08_Nam_Phạm_Brand_Manager.docx`
9. ✅ `CV_09_Tùng_Bùi_Operations_Manager.docx`
10. ✅ `CV_10_Ông_Dũng_Mai_Financial_Analyst.docx`

---

## 🔍 CÁCH TRUY CẬP

### **Cách 1: Từ File Explorer (Windows)**

1. Mở **File Explorer**
2. Điều hướng đến: `D:\DoAnPTPMHDT\backend\sample_cvs\sample_cvs_docx\`
3. Bạn sẽ thấy 10 file DOCX và 1 file README.md

### **Cách 2: Từ Command Prompt/Terminal**

```bash
# Từ thư mục gốc project
cd backend\sample_cvs\sample_cvs_docx
dir

# Hoặc từ bất kỳ đâu
cd D:\DoAnPTPMHDT\backend\sample_cvs\sample_cvs_docx
dir
```

### **Cách 3: Từ VS Code/Cursor**

1. Mở thư mục project trong VS Code/Cursor
2. Trong **Explorer** (sidebar bên trái), điều hướng đến:
   ```
   backend/
     └── sample_cvs/
         └── sample_cvs_docx/
             ├── CV_01_*.docx
             ├── CV_02_*.docx
             ├── ...
             └── README.md
   ```

---

## ✅ XÁC NHẬN FILE ĐÃ TẠO

Để kiểm tra xem các file có tồn tại không, chạy lệnh:

```bash
# Từ thư mục gốc project
dir backend\sample_cvs\sample_cvs_docx\*.docx

# Hoặc từ thư mục backend
cd backend
dir sample_cvs\sample_cvs_docx\*.docx
```

**Kết quả mong đợi:** Hiển thị 10 file DOCX

---

## 📝 SỬ DỤNG CV ĐỂ TEST

1. **Mở một trong các CV DOCX** bằng Microsoft Word hoặc Google Docs
2. **Kiểm tra nội dung:** Mỗi CV có đầy đủ thông tin (thông tin cá nhân, kinh nghiệm, học vấn, kỹ năng, chứng chỉ)
3. **Upload vào hệ thống:**
   - Đăng nhập với tài khoản CANDIDATE
   - Vào trang "Tìm việc làm"
   - Chọn job phù hợp
   - Upload CV DOCX
   - Hệ thống sẽ tự động parse và AI screening

---

## 🔧 NẾU KHÔNG THẤY THƯ MỤC

Nếu bạn không thấy thư mục `backend/sample_cvs`, có thể:

1. **Kiểm tra lại đường dẫn:**
   ```bash
   cd D:\DoAnPTPMHDT
   dir backend
   ```

2. **Tạo lại CV (nếu cần):**
   ```bash
   cd backend\sample_cvs
   python generate_10_cvs_docx.py
   ```

3. **Kiểm tra quyền truy cập:**
   - Đảm bảo bạn có quyền đọc/ghi trong thư mục project
   - Kiểm tra xem thư mục có bị ẩn không

---

## 📊 CẤU TRÚC THƯ MỤC

```
backend/
└── sample_cvs/
    ├── generate_10_cvs_docx.py  (Script tạo CV)
    ├── sample_cvs_docx/          (Thư mục chứa 10 CV DOCX)
    │   ├── CV_01_*.docx
    │   ├── CV_02_*.docx
    │   ├── ...
    │   ├── CV_10_*.docx
    │   └── README.md
    └── ... (các file khác)
```

---

**Lưu ý:** Tất cả 10 CV DOCX đã được tạo thành công và sẵn sàng để sử dụng!

