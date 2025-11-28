# 📝 Changelog

Tất cả các thay đổi quan trọng trong dự án sẽ được ghi lại ở đây.

## [Unreleased]

### Added
- ✨ Giao diện Admin Dashboard với thống kê chi tiết
- ✨ Trang quản lý người dùng (AdminUsers)
- ✨ Trang cài đặt hệ thống (AdminSettings)
- ✨ Link đến Django Admin trong giao diện admin
- ✨ Hỗ trợ PostgreSQL online (Neon, Supabase, Railway)
- ✨ Script setup tự động cho Windows và Mac/Linux
- 📚 Documentation đầy đủ:
  - README.md - Tổng quan dự án
  - SETUP-GUIDE.md - Hướng dẫn setup chi tiết
  - QUICK-START.md - Hướng dẫn nhanh
  - DEPLOYMENT.md - Hướng dẫn deploy
  - CONTRIBUTING.md - Hướng dẫn đóng góp
  - START-HERE.md - File bắt đầu

### Changed
- 🔧 Tối ưu settings.py để hỗ trợ cả local và online PostgreSQL
- 🔧 Thêm python-dotenv vào requirements.txt
- 🔧 Cập nhật .gitignore để ignore .env files
- 🔧 Cải thiện Layout với menu admin riêng

### Fixed
- 🐛 Fix lỗi đăng ký/đăng nhập
- 🐛 Fix lỗi ModuleNotFoundError cho dotenv
- 🐛 Fix encoding issue với .env file trên Windows

---

## Cấu trúc Documentation

```
DoAnPTPMHDT/
├── README.md              # Tổng quan dự án, tech stack, quick start
├── SETUP-GUIDE.md         # Hướng dẫn setup từng bước chi tiết
├── QUICK-START.md         # Hướng dẫn nhanh 5 phút
├── DEPLOYMENT.md          # Hướng dẫn deploy production
├── CONTRIBUTING.md        # Hướng dẫn đóng góp code
├── START-HERE.md          # File bắt đầu cho người mới
├── CHANGELOG.md           # File này
└── docs/                  # Documentation chi tiết
    ├── 01-database-design.md
    ├── 02-system-architecture.md
    ├── 03-api-endpoints.md
    └── ...
```

---

## Scripts Setup

### Windows
- `setup-backend.bat` - Setup backend tự động
- `setup-frontend.bat` - Setup frontend tự động

### Mac/Linux
- `setup.sh` - Setup cả backend và frontend

---

## Environment Files

### Backend
- `.env.example` - Template cho backend .env
- Cần tạo `.env` từ `.env.example` và điền thông tin

### Frontend
- `.env.example` - Template cho frontend .env
- Cần tạo `.env` từ `.env.example`

---

## Next Steps

1. ✅ Setup documentation - Hoàn thành
2. ✅ Admin interface - Hoàn thành
3. ⏳ Testing - Cần bổ sung
4. ⏳ CI/CD - Cần bổ sung
5. ⏳ Performance optimization - Cần bổ sung

---

**Format dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)**

