# Danh sách tài khoản mẫu

File này chứa danh sách tất cả các tài khoản mẫu được tạo bởi các script seed.

## Tài khoản Admin/Recruiter

### Tài khoản cơ bản
- **Email**: admin@recruitment.com
- **Password**: admin123
- **Role**: ADMIN
- **Username**: admin

- **Email**: recruiter@recruitment.com
- **Password**: recruiter123
- **Role**: RECRUITER
- **Username**: recruiter

### Tài khoản từ seed_companies_full.py
Script `seed_companies_full.py` sẽ tạo nhiều tài khoản ADMIN (doanh nghiệp) với:
- Email: `{company_name}@example.com`
- Password: Mặc định (cần set password)
- Role: ADMIN
- Có đầy đủ thông tin công ty (tax_id, company_name, field_of_activity, etc.)

## Tài khoản Candidate

### Tài khoản cơ bản
- **Email**: candidate@recruitment.com
- **Password**: candidate123
- **Role**: CANDIDATE
- **Username**: candidate

### Tài khoản từ generate_sample_cvs.py
Script `generate_sample_cvs.py` sẽ tạo các tài khoản CANDIDATE mẫu với CV tương ứng.

## Cách sử dụng

### Tạo tài khoản cơ bản
```bash
cd backend
python seed_data.py
```

### Tạo tài khoản doanh nghiệp đầy đủ
```bash
cd backend
python seed_companies_full.py
```

### Tạo CV mẫu và tài khoản candidate
```bash
cd backend
python sample_cvs/generate_sample_cvs.py
```

## Lưu ý

- Tất cả tài khoản mẫu có password mặc định là `{role}123` (ví dụ: admin123, candidate123)
- Các tài khoản từ seed_companies_full.py cần set password sau khi tạo
- Để đăng nhập, sử dụng email làm username

