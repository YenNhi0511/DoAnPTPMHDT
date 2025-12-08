# Đặc tả Use Case 30-40 (Format đơn giản)

## UC-30: Tạo kết quả tuyển dụng cuối cùng

**Mô tả:** Recruiter đưa ra quyết định cuối cùng để gửi thư mời nhận việc (OFFER) hoặc thư từ chối (REJECT) cho ứng viên

**Actor:** Recruiter

**Tiền điều kiện:** Ứng viên đã hoàn thành phỏng vấn và có kết quả đánh giá

**Hậu điều kiện:** Ứng viên nhận được email thông báo kết quả

**Luồng chính:**

1. Recruiter vào trang chi tiết hồ sơ ứng viên để xem điểm phỏng vấn
2. Recruiter click "Gửi kết quả tuyển dụng"
3. Hệ thống hiển thị form cho phép chọn OFFER hoặc REJECT
4. Recruiter chọn quyết định và điền thông tin (mức lương, ngày bắt đầu nếu OFFER; lý do nếu REJECT)
5. Recruiter nhấn "Xác nhận"
6. Hệ thống lưu quyết định và gửi email tự động cho ứng viên
7. Hệ thống tạo thông báo cho ứng viên
8. Recruiter thấy thông báo "Đã gửi kết quả"

**Ngoại lệ:**

- Nếu ứng viên đã có kết quả thì không cho tạo mới
- Nếu gửi email thất bại thì hệ thống tự retry

**Tần suất:** Cao

---

## UC-31: Gửi email kết quả tự động

**Mô tả:** Hệ thống tự động gửi email thông báo kết quả (OFFER/REJECT) ngay khi Recruiter tạo quyết định

**Actor:** Hệ thống

**Tiền điều kiện:** Kết quả tuyển dụng vừa được tạo

**Hậu điều kiện:** Email đã gửi tới ứng viên

**Luồng chính:**

1. Hệ thống phát hiện có kết quả mới được tạo
2. Hệ thống chọn template email phù hợp (OFFER có thông tin lương, ngày bắt đầu; REJECT có lời động viên)
3. Hệ thống gửi email qua dịch vụ Resend API
4. Hệ thống ghi log đã gửi email thành công

**Ngoại lệ:**

- Nếu Resend thất bại thì dùng SendGrid backup
- Nếu cả 2 đều fail thì lưu vào hàng đợi để gửi lại sau

**Tần suất:** Cao

---

## UC-32: Xem lịch sử quyết định tuyển dụng

**Mô tả:** Recruiter và Admin xem lại tất cả các quyết định đã đưa ra để theo dõi và phân tích

**Actor:** Recruiter, Admin

**Tiền điều kiện:** Đã đăng nhập

**Hậu điều kiện:** Danh sách quyết định được hiển thị

**Luồng chính:**

1. Người dùng vào trang "Lịch sử quyết định"
2. Hệ thống hiển thị bảng danh sách với các cột: Ngày, Ứng viên, Vị trí, Quyết định (OFFER/REJECT), Mức lương, Người quyết định
3. Người dùng có thể lọc theo quyết định, thời gian, người quyết định
4. Người dùng có thể search theo tên ứng viên
5. Click vào một dòng để xem chi tiết đầy đủ (timeline, điểm số, lý do)

**Ngoại lệ:**

- Recruiter chỉ xem được quyết định của công ty mình
- Admin xem được tất cả

**Tần suất:** Trung bình

---

## UC-33: Xem danh sách thông báo

**Mô tả:** Người dùng xem tất cả thông báo từ hệ thống

**Actor:** Tất cả

**Tiền điều kiện:** Đã đăng nhập

**Hậu điều kiện:** Danh sách thông báo được hiển thị

**Luồng chính:**

1. Người dùng click icon chuông 🔔 trên header
2. Hệ thống hiển thị dropdown với 10 thông báo mới nhất
3. Nếu click vào một thông báo thì đánh dấu đã đọc và chuyển đến trang liên quan
4. Nếu click "Xem tất cả" thì vào trang đầy đủ với:
   - Tab "Chưa đọc" và "Tất cả"
   - Nút "Đánh dấu tất cả đã đọc"
   - Filter theo loại (INFO/SUCCESS/WARNING/ERROR) và thời gian
5. Badge trên icon chuông hiển thị số thông báo chưa đọc

**Ngoại lệ:**

- Thông báo cũ hơn 90 ngày tự động xóa

**Tần suất:** Rất cao

---

## UC-34: Đánh dấu thông báo đã đọc

**Mô tả:** Người dùng đánh dấu thông báo là đã đọc để giảm số lượng chưa đọc

**Actor:** Tất cả

**Tiền điều kiện:** Có thông báo chưa đọc

**Hậu điều kiện:** Badge số giảm đi

**Luồng chính (Đọc từng cái):**

1. User click vào một thông báo
2. Hệ thống tự động đánh dấu là đã đọc
3. Badge số giảm 1
4. Thông báo không còn in đậm

**Luồng chính (Đọc tất cả):**

1. User click "Đánh dấu tất cả đã đọc"
2. Hệ thống cập nhật tất cả thông báo chưa đọc thành đã đọc
3. Badge về 0
4. Tab "Chưa đọc" trống

**Tần suất:** Cao

---

## UC-35: Nhận email thông báo

**Mô tả:** Người dùng nhận email khi có sự kiện quan trọng xảy ra

**Actor:** Tất cả

**Tiền điều kiện:** User bật tính năng nhận email trong settings

**Hậu điều kiện:** Email được gửi tới inbox

**Luồng chính:**

1. Có sự kiện xảy ra (nộp hồ sơ, mời phỏng vấn, có kết quả...)
2. Hệ thống tạo thông báo trong app
3. Hệ thống kiểm tra user có bật email notification không
4. Nếu có thì gửi email với nội dung tương ứng
5. User nhận email trong inbox
6. User click link trong email để vào app xem chi tiết

**Ngoại lệ:**

- User có thể click "Unsubscribe" để tắt nhận email
- Email vẫn có thể gửi thất bại nhưng thông báo in-app vẫn có

**Các loại email:**

- Candidate: OTP, xác nhận nộp hồ sơ, mời phỏng vấn, kết quả
- Recruiter: Có hồ sơ mới, AI hoàn thành, kết quả phỏng vấn
- Interviewer: Được gán lịch phỏng vấn
- Admin: Báo cáo tuần, cảnh báo

**Tần suất:** Rất cao

---

## UC-36: Quản lý người dùng

**Mô tả:** Admin xem, sửa, khóa/mở khóa tài khoản người dùng

**Actor:** Admin

**Tiền điều kiện:** Admin đã đăng nhập

**Hậu điều kiện:** Thông tin user được cập nhật

**Luồng chính:**

1. Admin vào trang "Quản lý người dùng"
2. Hệ thống hiển thị bảng danh sách users (Avatar, Tên, Email, Role, Trạng thái, Ngày đăng ký)
3. Admin có thể lọc theo role, trạng thái; tìm kiếm theo tên, email
4. Admin click "Xem chi tiết" một user
5. Hệ thống hiển thị thông tin đầy đủ và lịch sử hoạt động
6. Admin có thể:
   - Sửa thông tin (tên, phone, role...)
   - Khóa tài khoản (nhập lý do, gửi email thông báo)
   - Mở khóa tài khoản
   - Reset password (gửi password mới qua email)
   - Xóa tài khoản (soft delete)

**Ngoại lệ:**

- Không thể xóa user có dữ liệu quan trọng (recruiter có job đang active)
- Không thể tự khóa chính mình

**Tần suất:** Trung bình

---

## UC-37: Quản lý công ty

**Mô tả:** Admin quản lý thông tin các công ty (từ tài khoản Recruiter)

**Actor:** Admin

**Tiền điều kiện:** Có ít nhất 1 Recruiter đăng ký

**Hậu điều kiện:** Thông tin công ty được cập nhật

**Luồng chính:**

1. Admin vào "Quản lý công ty"
2. Hệ thống hiển thị bảng công ty (Tên, Logo, Số recruiter, Số tin đăng, Số hồ sơ, Trạng thái)
3. Admin có thể sort, search, filter
4. Admin click "Xem chi tiết" một công ty
5. Hệ thống hiển thị:
   - Thông tin công ty (tên, website, mô tả)
   - Danh sách recruiters
   - Danh sách jobs
   - Thống kê
6. Admin có thể:
   - Sửa thông tin công ty
   - Vô hiệu hóa công ty (tất cả recruiter bị khóa, job bị đóng)
   - Kích hoạt lại công ty

**Ngoại lệ:**

- Nếu công ty có job đang phỏng vấn thì cảnh báo trước khi vô hiệu hóa

**Tần suất:** Thấp

---

## UC-38: Xem dashboard thống kê

**Mô tả:** Admin xem tổng quan hệ thống qua dashboard với biểu đồ và số liệu

**Actor:** Admin

**Tiền điều kiện:** Admin đã đăng nhập

**Hậu điều kiện:** Dashboard hiển thị dữ liệu real-time

**Luồng chính:**

1. Admin vào trang Dashboard
2. Hệ thống hiển thị:
   - **Cards:** Tổng users, jobs, hồ sơ, tỷ lệ thành công
   - **Biểu đồ:**
     - Line: Người dùng mới theo thời gian
     - Bar: Hồ sơ theo trạng thái
     - Pie: Phân bố user theo role
     - Area: Tin tuyển dụng theo thời gian
     - Horizontal Bar: Top công ty
   - **Tables:** Jobs mới nhất, Hồ sơ mới nhất, Phỏng vấn sắp tới
3. Dashboard tự động refresh mỗi 5 phút
4. Admin có thể chọn date range (7/30/90 ngày hoặc tùy chỉnh)
5. Admin có thể export dashboard ra PDF

**Ngoại lệ:**

- Click vào số liệu để xem chi tiết (drill-down)

**Tần suất:** Cao (Admin check hàng ngày)

---

## UC-39: Xuất báo cáo

**Mô tả:** Admin xuất báo cáo chi tiết dưới dạng Excel hoặc PDF

**Actor:** Admin

**Tiền điều kiện:** Có dữ liệu để xuất

**Hậu điều kiện:** File báo cáo được download

**Luồng chính:**

1. Admin vào "Xuất báo cáo"
2. Hệ thống hiển thị form với các bước:
   - Bước 1: Chọn loại báo cáo (Tuyển dụng, Người dùng, Hoạt động, Công ty)
   - Bước 2: Chọn kỳ (Tuần/Tháng/Quý/Năm/Tùy chỉnh)
   - Bước 3: Chọn format (Excel hoặc PDF)
   - Bước 4: Tùy chọn (Có biểu đồ, Có tóm tắt, Nhóm theo...)
3. Admin click "Xuất báo cáo"
4. Hệ thống hiển thị loading "Đang tạo báo cáo..."
5. Hệ thống tạo file trong background
6. Hệ thống gửi thông báo "Báo cáo đã sẵn sàng"
7. Admin click link download
8. Browser tải file về

**Ngoại lệ:**

- Báo cáo lớn (>5 phút) thì gửi email có link download
- Link download hết hạn sau 1 giờ, có thể tạo lại

**Tần suất:** Thấp (Tuần 1 lần hoặc cuối tháng)

---

## UC-40: Xem log hệ thống

**Mô tả:** Admin xem chi tiết log các hoạt động để audit và bảo mật

**Actor:** Admin

**Tiền điều kiện:** Admin đã đăng nhập

**Hậu điều kiện:** Logs được hiển thị

**Luồng chính:**

1. Admin vào "Log hệ thống"
2. Hệ thống hiển thị bảng logs với cột: Timestamp, User, Action, Resource, Status, IP Address
3. Bảng hiển thị 100 logs mới nhất, có phân trang
4. Admin có thể filter theo:
   - User
   - Action (login, create, update, delete...)
   - Resource Type (User, Job, Application...)
   - Status (SUCCESS/ERROR/WARNING)
   - Thời gian (1 giờ/24 giờ/7 ngày/30 ngày/Tùy chỉnh)
   - IP address
5. Admin có thể search full-text
6. Admin click vào một log để xem chi tiết đầy đủ (Before/After values, Error message, Context)
7. Admin có thể export logs ra CSV/JSON

**Ngoại lệ:**

- Search không có kết quả thì gợi ý filter khác
- Export quá nhiều (>100k) thì bắt filter thêm

**Các loại log:**

- Authentication: login, logout, failed_login, signup, OTP, password reset
- CRUD: create/update/delete user, job, application, interview, result
- System: send_email, ai_screening, file upload/download, export report
- Security: permission denied, suspicious activity, account locked/unlocked

**Tần suất:** Trung bình (Admin check khi có vấn đề)
