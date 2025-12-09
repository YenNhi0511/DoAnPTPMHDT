# 🚀 Hướng Dẫn Populate Dữ Liệu Lên Railway

## Bước 1: Cài Đặt Railway CLI

```cmd
npm i -g @railway/cli
```

Sau đó login:

```cmd
railway login
```

Browser sẽ mở, đăng nhập bằng tài khoản Railway của bạn.

## Bước 2: Link Project

```cmd
cd d:\DoAnPTPMHDT
railway link
```

Chọn project "DoAnPTPMHDT" từ danh sách.

## Bước 3: Chạy Migrations

```cmd
railway run --service backend python manage.py migrate
```

Output sẽ hiển thị:

```
Operations to perform:
  Apply all migrations: accounts, jobs, applications, ...
Running migrations:
  Applying accounts.0001_initial... OK
  Applying jobs.0001_initial... OK
  ...
```

## Bước 4: Tạo Superuser

```cmd
railway run --service backend python manage.py createsuperuser
```

Nhập thông tin khi được hỏi:

- Email: `admin@recruitmentpro.live`
- Password: `Admin@123456` (hoặc password mạnh khác)

## Bước 5: Populate Dữ Liệu Mẫu

### Cách 1: Sử dụng Management Command (Khuyến nghị)

```cmd
railway run --service backend python manage.py seed_sample_data
```

Command này sẽ tạo:

- ✅ 3 users (admin, recruiter, candidate)
- ✅ 15 jobs từ các công ty: FPT, VNG, Tiki, Viettel, Momo
- ✅ 2 sample applications
- ✅ 1 sample interview

Output:

```
🌱 Starting to seed sample data...
📝 Creating users...
✅ Created admin: admin@recruitmentpro.live
✅ Created recruiter: recruiter@recruitmentpro.live
✅ Created candidate: candidate@recruitmentpro.live

💼 Creating jobs...
✅ Created job: Senior Full Stack Developer - FPT Software
✅ Created job: Senior Java Backend Developer - FPT Software
✅ Created job: Frontend React Developer - VNG Corporation
... (15 jobs total)

📋 Creating sample applications...
✅ Created application for: Senior Full Stack Developer - FPT Software
✅ Created application for: Frontend React Developer - VNG Corporation
✅ Created interview for application

============================================================
🎉 Seed data created successfully!
============================================================

📊 Summary:
  • Users: 3
  • Jobs: 15
  • Applications: 2

🔑 Test Accounts:
  • Admin: admin@recruitmentpro.live / Admin@123456
  • Recruiter: recruiter@recruitmentpro.live / Recruiter@123
  • Candidate: candidate@recruitmentpro.live / Candidate@123

🌐 Access:
  • Website: https://www.recruitmentpro.live
  • Admin Panel: https://api.recruitmentpro.live/admin
  • API: https://api.recruitmentpro.live/api
```

### Cách 2: Sử dụng Script Seed Data Cũ

```cmd
railway run --service backend python seed_data.py
```

Script này tạo:

- 3 users (admin, recruiter, candidate)
- 2 jobs
- 1 application
- 1 interview

### Cách 3: Xóa Và Tạo Lại Dữ Liệu

Nếu muốn xóa jobs cũ và tạo mới:

```cmd
railway run --service backend python manage.py seed_sample_data --clear
```

**⚠️ Cảnh báo:** Option `--clear` sẽ xóa tất cả jobs và applications hiện có!

## Bước 6: Verify Dữ Liệu

### Kiểm tra qua API:

```cmd
curl https://api.recruitmentpro.live/api/jobs/
```

### Kiểm tra qua Admin Panel:

1. Truy cập: https://api.recruitmentpro.live/admin
2. Login: `admin@recruitmentpro.live` / `Admin@123456`
3. Xem Jobs, Users, Applications

### Kiểm tra qua Website:

1. Truy cập: https://www.recruitmentpro.live
2. Đăng nhập hoặc xem danh sách jobs

## Bước 7: Test Trên Website

1. **Login Admin:**

   - Email: `admin@recruitmentpro.live`
   - Password: `Admin@123456`

2. **Login Recruiter:**

   - Email: `recruiter@recruitmentpro.live`
   - Password: `Recruiter@123`

3. **Login Candidate:**
   - Email: `candidate@recruitmentpro.live`
   - Password: `Candidate@123`

## Danh Sách 15 Jobs Được Tạo

1. **Senior Full Stack Developer - FPT Software** (Hanoi, $2000-3500)
2. **Senior Java Backend Developer - FPT Software** (HCM, $1800-3000)
3. **Frontend React Developer - VNG Corporation** (Hanoi, $1200-2000)
4. **Python Backend Engineer - VNG Corporation** (HCM, $1500-2500)
5. **DevOps Engineer - Tiki** (Hanoi, $1800-2800)
6. **Mobile Developer (React Native) - Tiki** (HCM, $1500-2500)
7. **Data Engineer - Viettel Digital** (Hanoi, $1800-2800)
8. **QA Automation Engineer - Viettel Digital** (HCM, $1000-1800)
9. **UI/UX Designer - Momo** (Hanoi, $800-1500)
10. **Product Manager - Momo** (HCM, $1500-2500)
11. **Security Engineer - FPT Software** (Hanoi, $2000-3000)
12. **Junior Frontend Developer - VNG** (HCM, $500-800)
13. **Marketing Intern - Tiki** (Hanoi, $200-400)
14. **Business Analyst - Viettel Digital** (HCM, $800-1500)
15. **Scrum Master - Momo** (Hanoi, $1000-1800)

## Troubleshooting

### Lỗi: "No module named 'jobs'"

Kiểm tra Railway service có đúng root directory:

```cmd
railway variables --service backend
```

Đảm bảo `RAILWAY_SERVICE_ROOT` = `backend`

### Lỗi: "Database connection failed"

Kiểm tra database đã được provision:

```cmd
railway logs --service backend
```

### Lỗi: "Table does not exist"

Chạy migrations:

```cmd
railway run --service backend python manage.py migrate
```

### Muốn xem logs real-time:

```cmd
railway logs --service backend --tail
```

## Tips

1. **Push code lên GitHub trước khi seed:**

   - Railway auto-deploy từ GitHub
   - Đảm bảo code mới nhất được deploy

2. **Kiểm tra environment variables:**

   ```cmd
   railway variables --service backend
   ```

3. **Backup data trước khi clear:**

   ```cmd
   railway run --service backend python manage.py dumpdata > backup.json
   ```

4. **Restore data từ backup:**
   ```cmd
   railway run --service backend python manage.py loaddata backup.json
   ```

## Next Steps

Sau khi có dữ liệu:

1. ✅ Test toàn bộ tính năng trên production
2. ✅ Test job search, filter
3. ✅ Test application submission
4. ✅ Test interview scheduling
5. ✅ Chuẩn bị demo cho đồ án

---

**Happy Coding! 🎉**
