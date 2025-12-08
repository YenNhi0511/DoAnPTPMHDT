# Đặc tả đầy đủ 40 Use Cases - Hệ thống Tuyển dụng

## PHẦN BỔ SUNG: Đặc tả UC-04 đến UC-40

### UC-04: Đăng xuất

**Mô tả:** Người dùng đăng xuất khỏi hệ thống

**Actor chính:** Tất cả

**Tiền điều kiện:**

- Người dùng đã đăng nhập

**Hậu điều kiện:**

- JWT token bị vô hiệu hóa
- Người dùng bị đăng xuất

**Luồng sự kiện chính:**

1. Người dùng click nút "Đăng xuất" trên header
2. Hệ thống hiển thị dialog xác nhận "Bạn có chắc muốn đăng xuất?"
3. Người dùng xác nhận
4. Frontend xóa tokens khỏi localStorage
5. Frontend xóa user info khỏi state
6. Hệ thống ghi log đăng xuất
7. Hệ thống redirect về trang đăng nhập
8. Hiển thị thông báo "Đã đăng xuất thành công"

**Tần suất sử dụng:** Rất cao

---

### UC-05: Quản lý hồ sơ cá nhân

**Mô tả:** Người dùng xem và cập nhật thông tin cá nhân

**Actor chính:** Tất cả

**Tiền điều kiện:**

- Người dùng đã đăng nhập

**Hậu điều kiện:**

- Thông tin cá nhân được cập nhật
- Avatar mới được lưu (nếu có)

**Luồng sự kiện chính:**

1. Người dùng truy cập "Hồ sơ của tôi"
2. Hệ thống hiển thị thông tin hiện tại:
   - Avatar, Họ tên, Email (read-only)
   - Số điện thoại, Địa chỉ, Ngày sinh
   - [Nếu Recruiter] Tên công ty, Website công ty
3. Người dùng click "Chỉnh sửa"
4. Người dùng cập nhật thông tin
5. Người dùng có thể upload avatar mới (JPG/PNG, max 2MB)
6. Người dùng click "Lưu thay đổi"
7. Hệ thống validate dữ liệu
8. Hệ thống lưu thông tin mới
9. Hệ thống resize và crop avatar (nếu có)
10. Hiển thị thông báo "Cập nhật thành công"

**Luồng sự kiện phụ:**

**5a. File avatar không hợp lệ:**

- Hiển thị lỗi "File phải là JPG/PNG, max 2MB"

**Tần suất sử dụng:** Trung bình

---

### UC-06: Đổi mật khẩu

**Mô tả:** Người dùng thay đổi mật khẩu đăng nhập

**Actor chính:** Tất cả

**Tiền điều kiện:**

- Người dùng đã đăng nhập

**Hậu điều kiện:**

- Mật khẩu mới được lưu (hash)
- Email thông báo được gửi

**Luồng sự kiện chính:**

1. Người dùng truy cập "Đổi mật khẩu"
2. Người dùng nhập:
   - Mật khẩu hiện tại
   - Mật khẩu mới (min 8 ký tự)
   - Xác nhận mật khẩu mới
3. Hệ thống validate mật khẩu hiện tại đúng
4. Hệ thống validate mật khẩu mới != mật khẩu cũ
5. Hệ thống validate 2 mật khẩu mới khớp nhau
6. Hệ thống hash mật khẩu mới
7. Hệ thống lưu vào database
8. Hệ thống gửi email thông báo đổi mật khẩu
9. Hiển thị "Đổi mật khẩu thành công"

**Tần suất sử dụng:** Thấp

---

### UC-07: Đăng tin tuyển dụng

**Mô tả:** Recruiter tạo tin tuyển dụng mới

**Actor chính:** Recruiter

**Tiền điều kiện:**

- Recruiter đã đăng nhập

**Hậu điều kiện:**

- Tin tuyển dụng được tạo với trạng thái DRAFT/ACTIVE

**Luồng sự kiện chính:**

1. Recruiter truy cập "Đăng tin tuyển dụng"
2. Recruiter điền form:
   - Tiêu đề công việc
   - Mô tả công việc (rich text editor)
   - Yêu cầu ứng viên
   - Quyền lợi
   - Mức lương (từ-đến hoặc "Thỏa thuận")
   - Địa điểm làm việc
   - Loại công việc (Full-time/Part-time/Remote)
   - Số lượng cần tuyển
   - Hạn nộp hồ sơ
   - Trạng thái (DRAFT/ACTIVE)
3. Recruiter click "Lưu" hoặc "Đăng ngay"
4. Hệ thống validate dữ liệu
5. Hệ thống tạo Job record
6. Nếu ACTIVE: gửi notification cho Candidate đã theo dõi công ty
7. Hiển thị "Đăng tin thành công"

**Tần suất sử dụng:** Cao

---

### UC-08: Xem danh sách tin tuyển dụng

**Mô tả:** Xem tất cả tin tuyển dụng

**Actor chính:** Candidate, Recruiter

**Tiền điều kiện:**

- Không cần đăng nhập (cho Candidate)
- Recruiter đã đăng nhập (để xem tin của mình)

**Hậu điều kiện:**

- Danh sách được hiển thị

**Luồng sự kiện chính:**

1. Người dùng truy cập trang "Việc làm"
2. Hệ thống hiển thị danh sách:
   - [Candidate] Tất cả tin ACTIVE
   - [Recruiter] Tất cả tin của mình (DRAFT/ACTIVE/CLOSED)
3. Mỗi tin hiển thị: Title, Company, Location, Salary, Deadline
4. Có phân trang (20 tin/trang)
5. Có sắp xếp (mới nhất, lương cao, deadline gần)

**Tần suất sử dụng:** Rất cao

---

### UC-09: Tìm kiếm & lọc tin tuyển dụng

**Mô tả:** Candidate tìm kiếm công việc phù hợp

**Actor chính:** Candidate

**Luồng sự kiện chính:**

1. Candidate nhập từ khóa vào search box
2. Candidate chọn bộ lọc:
   - Địa điểm
   - Mức lương
   - Loại công việc
   - Ngành nghề
3. Hệ thống áp dụng filter và full-text search
4. Hiển thị kết quả phù hợp
5. Candidate có thể lưu bộ lọc

**Tần suất sử dụng:** Rất cao

---

### UC-10: Xem chi tiết tin tuyển dụng

**Mô tả:** Xem thông tin đầy đủ một tin tuyển dụng

**Actor chính:** Candidate, Recruiter

**Luồng sự kiện chính:**

1. Người dùng click vào tin tuyển dụng
2. Hệ thống hiển thị:
   - Thông tin job đầy đủ
   - Thông tin công ty
   - Số lượng ứng viên đã nộp
   - [Candidate] Nút "Ứng tuyển ngay"
   - [Recruiter] Nút "Chỉnh sửa", "Xem ứng viên"

**Tần suất sử dụng:** Rất cao

---

### UC-11: Chỉnh sửa tin tuyển dụng

**Mô tả:** Recruiter cập nhật thông tin tin

**Actor chính:** Recruiter

**Tiền điều kiện:**

- Recruiter là người tạo tin

**Luồng sự kiện chính:**

1. Recruiter click "Chỉnh sửa"
2. Form được điền sẵn thông tin hiện tại
3. Recruiter cập nhật thông tin
4. Recruiter có thể đổi trạng thái (DRAFT↔ACTIVE, ACTIVE→CLOSED)
5. Click "Lưu thay đổi"
6. Hệ thống validate và lưu
7. Nếu đổi sang ACTIVE: gửi notification

**Tần suất sử dụng:** Trung bình

---

### UC-12: Xóa tin tuyển dụng

**Mô tả:** Xóa tin khỏi hệ thống

**Actor chính:** Recruiter, Admin

**Tiền điều kiện:**

- [Recruiter] Tin ở trạng thái DRAFT và chưa có ứng viên
- [Admin] Có thể xóa bất kỳ

**Luồng sự kiện chính:**

1. Click "Xóa"
2. Hệ thống hiển thị cảnh báo
3. Xác nhận
4. Hệ thống kiểm tra điều kiện
5. Soft delete (deleted_at = now())
6. Hiển thị "Đã xóa"

**Tần suất sử dụng:** Thấp

---

### UC-13: Đóng/Mở tin tuyển dụng

**Mô tả:** Thay đổi trạng thái tin

**Actor chính:** Recruiter

**Luồng sự kiện chính:**

1. Recruiter click "Đóng tuyển dụng"
2. Hệ thống cập nhật status = CLOSED
3. Tin không còn hiển thị với Candidate
4. Hồ sơ đang PENDING → REJECTED tự động

**Tần suất sử dụng:** Trung bình

---

### UC-15: Xem danh sách hồ sơ đã nộp

**Mô tả:** Candidate xem lịch sử ứng tuyển

**Actor chính:** Candidate

**Luồng sự kiện chính:**

1. Candidate truy cập "Hồ sơ của tôi"
2. Hệ thống hiển thị danh sách applications:
   - Job title, Company
   - Trạng thái (PENDING/SCREENING/INTERVIEW/OFFER/REJECTED)
   - Ngày nộp
   - Timeline (nếu có)
3. Có filter theo trạng thái
4. Có phân trang

**Tần suất sử dụng:** Cao

---

### UC-16: Xem chi tiết hồ sơ ứng tuyển

**Mô tả:** Xem thông tin đầy đủ một hồ sơ

**Actor chính:** Candidate, Recruiter

**Luồng sự kiện chính:**

1. Click vào hồ sơ
2. Hệ thống hiển thị:
   - Thông tin ứng viên
   - CV (link download)
   - Trạng thái hiện tại
   - Timeline các bước
   - Feedback (nếu có)
   - [Recruiter] Điểm AI, phân tích

**Tần suất sử dụng:** Cao

---

### UC-17: Rút hồ sơ ứng tuyển

**Mô tả:** Candidate hủy hồ sơ đã nộp

**Actor chính:** Candidate

**Tiền điều kiện:**

- Hồ sơ ở trạng thái PENDING hoặc SCREENING

**Luồng sự kiện chính:**

1. Candidate click "Rút hồ sơ"
2. Nhập lý do (optional)
3. Xác nhận
4. Hệ thống cập nhật status = WITHDRAWN
5. Gửi notification cho Recruiter

**Tần suất sử dụng:** Thấp

---

### UC-18: Xem danh sách ứng viên

**Mô tả:** Recruiter xem hồ sơ ứng tuyển vào tin của mình

**Actor chính:** Recruiter

**Luồng sự kiện chính:**

1. Recruiter click "Xem ứng viên"
2. Hệ thống hiển thị danh sách applications
3. Mỗi hồ sơ có:
   - Ảnh, Tên, Email
   - Điểm AI (nếu đã sàng lọc)
   - Trạng thái
   - Ngày nộp
4. Có filter, sort, search
5. Hiển thị thống kê: Tổng số, theo trạng thái

**Tần suất sử dụng:** Rất cao

---

### UC-19: Lọc và sắp xếp hồ sơ

**Mô tả:** Recruiter filter/sort danh sách ứng viên

**Actor chính:** Recruiter

**Luồng sự kiện chính:**

1. Recruiter chọn bộ lọc:
   - Trạng thái
   - Điểm AI (>=70, >=80, >=90)
   - Ngày nộp
2. Recruiter chọn sắp xếp:
   - Điểm AI cao → thấp
   - Ngày nộp mới → cũ
3. Hệ thống áp dụng và hiển thị

**Tần suất sử dụng:** Cao

---

### UC-20: Tải xuống CV

**Mô tả:** Recruiter download CV của ứng viên

**Actor chính:** Recruiter

**Luồng sự kiện chính:**

1. Recruiter click "Tải CV"
2. Hệ thống kiểm tra quyền
3. Hệ thống tạo download link (signed URL, expire 5 phút)
4. Browser tải file về

**Tần suất sử dụng:** Cao

---

### UC-22: Xem kết quả sàng lọc AI

**Mô tả:** Recruiter xem phân tích AI chi tiết

**Actor chính:** Recruiter

**Luồng sự kiện chính:**

1. Recruiter click "Xem kết quả AI"
2. Hệ thống hiển thị:
   - Điểm tổng (0-100)
   - Điểm mạnh (bullet points)
   - Điểm yếu
   - Kỹ năng khớp / thiếu
   - Kinh nghiệm phù hợp
   - Học vấn phù hợp
   - Recommendation

**Tần suất sử dụng:** Cao

---

### UC-23: Chạy lại sàng lọc AI

**Mô tả:** Recruiter yêu cầu AI phân tích lại

**Actor chính:** Recruiter

**Tiền điều kiện:**

- Application đã có kết quả AI trước đó

**Luồng sự kiện chính:**

1. Recruiter click "Chạy lại AI"
2. Hệ thống tạo Celery task mới
3. AI phân tích lại CV
4. Kết quả mới ghi đè kết quả cũ
5. Gửi notification cho Recruiter

**Tần suất sử dụng:** Trung bình

---

### UC-24: Mời phỏng vấn

**Mô tả:** Recruiter mời ứng viên phỏng vấn

**Actor chính:** Recruiter

**Tiền điều kiện:**

- Application ở trạng thái SCREENING
- Điểm AI >= ngưỡng (optional)

**Luồng sự kiện chính:**

1. Recruiter click "Mời phỏng vấn"
2. Hệ thống cập nhật status = INTERVIEW
3. Gửi email mời phỏng vấn
4. Tạo notification cho Candidate
5. Hiển thị "Đã gửi lời mời"

**Tần suất sử dụng:** Cao

---

### UC-26: Xem lịch phỏng vấn

**Mô tả:** Xem danh sách lịch phỏng vấn

**Actor chính:** Candidate, Interviewer

**Luồng sự kiện chính:**

1. Người dùng truy cập "Lịch phỏng vấn"
2. Hệ thống hiển thị:
   - [Candidate] Lịch PV của mình
   - [Interviewer] Lịch được gán
3. Mỗi lịch hiển thị:
   - Thời gian, Địa điểm/Link
   - Thông tin ứng viên/công việc
   - Trạng thái
4. Có calendar view và list view

**Tần suất sử dụng:** Cao

---

### UC-28: Chấm điểm ứng viên

**Mô tả:** Interviewer đánh giá chi tiết ứng viên

**Actor chính:** Interviewer

**Luồng sự kiện chính:**

1. Interviewer truy cập form chấm điểm
2. Nhập:
   - Điểm kỹ năng chuyên môn (1-5 sao)
   - Điểm kỹ năng mềm (1-5 sao)
   - Điểm thái độ (1-5 sao)
   - Điểm tổng (0-100)
   - Feedback chi tiết
3. Chọn kết quả: PASS/FAIL
4. Lưu điểm
5. Hệ thống tính điểm TB (nếu panel)

**Tần suất sử dụng:** Cao

---

### UC-29: Gửi email kết quả phỏng vấn

**Mô tả:** Hệ thống tự động gửi email

**Actor chính:** Hệ thống

**Tiền điều kiện:**

- Interview có result (PASS/FAIL)

**Luồng sự kiện chính:**

1. Hệ thống detect Interview.result updated
2. Load email template tương ứng (pass/fail)
3. Render template với data
4. Gửi email qua Resend API
5. Tạo notification
6. Log email sent

**Tần suất sử dụng:** Cao

---

### UC-31: Gửi email kết quả tuyển dụng

**Mô tả:** Gửi email OFFER/REJECT cuối cùng

**Actor chính:** Hệ thống

**Luồng sự kiện chính:**

1. Hệ thống detect RecruitmentResult created
2. Load template OFFER hoặc REJECT
3. Render với thông tin offer (nếu OFFER)
4. Gửi email
5. Tạo notification
6. Log

**Tần suất sử dụng:** Cao

---

### UC-32: Xem lịch sử quyết định

**Mô tả:** Xem audit trail các quyết định tuyển dụng

**Actor chính:** Recruiter, Admin

**Luồng sự kiện chính:**

1. Truy cập "Lịch sử quyết định"
2. Hệ thống hiển thị:
   - Ứng viên
   - Quyết định (OFFER/REJECT)
   - Người quyết định
   - Thời gian
   - Lý do
3. Có filter theo thời gian, quyết định

**Tần suất sử dụng:** Thấp

---

### UC-33: Xem danh sách thông báo

**Mô tả:** Xem tất cả notification

**Actor chính:** Tất cả

**Luồng sự kiện chính:**

1. Người dùng click icon notification
2. Hệ thống hiển thị dropdown với 10 notification gần nhất
3. Click "Xem tất cả"
4. Hiển thị trang đầy đủ với:
   - Chưa đọc (bold)
   - Đã đọc
   - Loại (INFO/SUCCESS/WARNING/ERROR)
   - Thời gian
5. Có phân trang

**Tần suất sử dụng:** Rất cao

---

### UC-34: Đánh dấu đã đọc

**Mô tả:** Đánh dấu notification là đã đọc

**Actor chính:** Tất cả

**Luồng sự kiện chính:**

1. Người dùng click notification
2. Hệ thống cập nhật is_read = True
3. Badge số lượng giảm đi 1
4. Notification không còn bold

**Hoặc:**

1. Click "Đánh dấu tất cả là đã đọc"
2. Hệ thống cập nhật tất cả is_read = True
3. Badge về 0

**Tần suất sử dụng:** Cao

---

### UC-35: Nhận email thông báo

**Mô tả:** Nhận thông báo qua email

**Actor chính:** Tất cả

**Actor phụ:** Email Service

**Tiền điều kiện:**

- User có email hợp lệ
- Email notification được bật

**Luồng sự kiện chính:**

1. Hệ thống tạo notification
2. Hệ thống check user.email_notifications_enabled
3. Nếu enabled: tạo email task
4. Celery worker gửi email qua Resend
5. Email delivered

**Tần suất sử dụng:** Rất cao

---

### UC-37: Quản lý công ty

**Mô tả:** Admin quản lý thông tin các công ty

**Actor chính:** Admin

**Luồng sự kiện chính:**

1. Admin truy cập "Quản lý công ty"
2. Hiển thị danh sách công ty (từ Recruiter accounts)
3. Mỗi công ty hiển thị:
   - Tên công ty
   - Số Recruiter
   - Số tin đăng
   - Số hồ sơ nhận
4. Admin có thể:
   - Xem chi tiết
   - Chỉnh sửa thông tin
   - Vô hiệu hóa (disable tất cả tin)

**Tần suất sử dụng:** Thấp

---

### UC-38: Xem dashboard thống kê

**Mô tả:** Admin xem tổng quan hệ thống

**Actor chính:** Admin

**Luồng sự kiện chính:**

1. Admin truy cập dashboard
2. Hệ thống hiển thị:
   - Tổng số users (theo role)
   - Tổng số tin tuyển dụng (ACTIVE/CLOSED)
   - Tổng số hồ sơ (theo trạng thái)
   - Tổng số phỏng vấn
   - Tỷ lệ thành công (OFFER/total)
3. Có biểu đồ:
   - Line chart: Users theo tháng
   - Bar chart: Applications theo trạng thái
   - Pie chart: Phân bố theo role

**Tần suất sử dụng:** Trung bình

---

### UC-39: Xuất báo cáo

**Mô tả:** Admin xuất báo cáo chi tiết

**Actor chính:** Admin

**Luồng sự kiện chính:**

1. Admin chọn loại báo cáo:
   - Báo cáo tuyển dụng
   - Báo cáo người dùng
   - Báo cáo hoạt động
2. Chọn kỳ (tuần/tháng/quý)
3. Chọn format (PDF/Excel)
4. Click "Xuất báo cáo"
5. Hệ thống generate report
6. Download file

**Tần suất sử dụng:** Thấp

---

### UC-40: Xem log hệ thống

**Mô tả:** Admin xem log các hoạt động

**Actor chính:** Admin

**Luồng sự kiện chính:**

1. Admin truy cập "Log hệ thống"
2. Hệ thống hiển thị logs:
   - Timestamp
   - User
   - Action (login, create, update, delete)
   - Resource (user, job, application)
   - Status (success/error)
   - IP address
3. Có filter:
   - Theo user
   - Theo action
   - Theo thời gian
   - Theo status
4. Có search full-text
5. Có phân trang (100 logs/trang)

**Tần suất sử dụng:** Thấp

---

## Kết luận

Đã bổ sung đầy đủ đặc tả cho **40 Use Cases**. File này nên được merge vào USE-CASE.md chính để có tài liệu hoàn chỉnh.

**Lưu ý:** Các UC đã có trong file gốc (UC-01, UC-02, UC-03, UC-14, UC-21, UC-25, UC-27, UC-30, UC-36) đã được giữ nguyên và bổ sung thêm 31 UC còn lại.
