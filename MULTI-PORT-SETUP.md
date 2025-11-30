# Hướng Dẫn Chạy Multi-Port cho Từng Role

Hệ thống GoodCV đã được cấu hình để chạy mỗi role trên một port riêng biệt.

## Port Configuration

- **Port 3003**: ADMIN (Quản trị viên)
- **Port 3001**: CANDIDATE (Ứng viên)
- **Port 3002**: RECRUITER (Nhà tuyển dụng)

## Cài Đặt

### 1. Cài đặt cross-env package

```bash
cd frontend
npm install --save-dev cross-env
```

## Cách Chạy

### Option 1: Chạy từng role riêng lẻ

#### Chạy ADMIN (Port 3003)

```bash
cd frontend
npm run start:admin
```

Hoặc double-click file `start-admin.bat` ở root folder

#### Chạy CANDIDATE (Port 3001)

```bash
cd frontend
npm run start:candidate
```

Hoặc double-click file `start-candidate.bat` ở root folder

#### Chạy RECRUITER (Port 3002)

```bash
cd frontend
npm run start:recruiter
```

Hoặc double-click file `start-recruiter.bat` ở root folder

### Option 2: Chạy tất cả roles cùng lúc

Double-click file `start-all-roles.bat` ở root folder

File này sẽ mở 3 cửa sổ terminal riêng biệt, mỗi cửa sổ chạy một role.

## URLs

Sau khi chạy, truy cập:

- **Admin**: http://localhost:3003
- **Candidate**: http://localhost:3001
- **Recruiter**: http://localhost:3002

## Lưu Ý

1. **Mỗi port chỉ hiển thị routes của role tương ứng:**

   - Port 3003 (ADMIN): Chỉ có routes admin, không có careers, không có recruiter routes
   - Port 3001 (CANDIDATE): Chỉ có routes candidate và public routes (careers, home)
   - Port 3002 (RECRUITER): Chỉ có routes recruiter, không có careers

2. **Nếu muốn test tất cả roles:**

   - Chạy `start-all-roles.bat` để mở cả 3 ports cùng lúc
   - Mỗi port sẽ mở trong một tab trình duyệt riêng

3. **Backend API:**
   - Tất cả ports đều kết nối đến backend tại `http://localhost:8000/api`
   - Đảm bảo backend đang chạy trước khi start frontend

## Troubleshooting

### Port đã được sử dụng

Nếu gặp lỗi "Port 3003/3001/3002 is already in use":

1. Tìm process đang dùng port:
   ```bash
   netstat -ano | findstr :3003
   ```
2. Kill process:
   ```bash
   taskkill /PID <PID> /F
   ```

### cross-env không hoạt động

Nếu gặp lỗi với cross-env trên Windows:

- Đảm bảo đã cài: `npm install --save-dev cross-env`
- Hoặc dùng batch files đã tạo sẵn

## Scripts trong package.json

```json
{
  "scripts": {
    "start:admin": "cross-env PORT=3003 REACT_APP_ROLE=ADMIN react-scripts start",
    "start:candidate": "cross-env PORT=3001 REACT_APP_ROLE=CANDIDATE react-scripts start",
    "start:recruiter": "cross-env PORT=3002 REACT_APP_ROLE=RECRUITER react-scripts start"
  }
}
```

## Environment Variables

Mỗi port sẽ set environment variable `REACT_APP_ROLE`:

- `REACT_APP_ROLE=ADMIN` cho port 3003
- `REACT_APP_ROLE=CANDIDATE` cho port 3001
- `REACT_APP_ROLE=RECRUITER` cho port 3002

App.js sẽ filter routes dựa trên `REACT_APP_ROLE` để chỉ hiển thị routes phù hợp với role đó.
