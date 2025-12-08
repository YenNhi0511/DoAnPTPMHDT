# ĐẶCTẢ 25 USE CASES - HỆ THỐNG TUYỂN DỤNG

## UC-01: Đăng ký và xác thực tài khoản

**Mô tả:** Người dùng tạo tài khoản mới và xác thực bằng mã OTP qua email

**Actor:** Candidate, Recruiter

**Tiền điều kiện:** Email chưa được đăng ký

**Hậu điều kiện:** Tài khoản được tạo và kích hoạt

**Luồng chính:**

1. Người dùng truy cập trang đăng ký và chọn vai trò
2. Người dùng nhập email, mật khẩu, họ tên, số điện thoại (và tên công ty nếu là Recruiter)
3. Hệ thống validate dữ liệu và kiểm tra email chưa tồn tại
4. Hệ thống tạo tài khoản và generate mã OTP 6 số
5. Hệ thống gửi OTP qua email
6. Người dùng nhập mã OTP
7. Hệ thống xác thực OTP và kích hoạt tài khoản
8. Hệ thống tự động đăng nhập và chuyển đến dashboard

**Ngoại lệ:**

- Email đã tồn tại → Hiển thị lỗi
- OTP sai hoặc hết hạn → Cho gửi lại OTP
- Quá 5 lần nhập sai → Khóa 15 phút

**Tần suất:** Cao

---

## UC-02: Đăng nhập

**Mô tả:** Người dùng đăng nhập bằng email và mật khẩu

**Actor:** Tất cả

**Tiền điều kiện:** Có tài khoản đã xác thực

**Hậu điều kiện:** Nhận JWT token và truy cập hệ thống

**Luồng chính:**

1. Người dùng nhập email và mật khẩu
2. Hệ thống xác thực thông tin
3. Hệ thống tạo JWT access token (24h) và refresh token (7 ngày)
4. Hệ thống chuyển đến dashboard theo vai trò

**Ngoại lệ:**

- Email/password sai → Hiển thị lỗi
- Sai 5 lần → Khóa tài khoản 15 phút
- Tài khoản bị khóa → Thông báo liên hệ admin

**Tần suất:** Rất cao

---

## UC-03: Đăng xuất

**Mô tả:** Người dùng đăng xuất khỏi hệ thống

**Actor:** Tất cả

**Tiền điều kiện:** Đã đăng nhập

**Hậu điều kiện:** Token bị vô hiệu hóa

**Luồng chính:**

1. Người dùng click "Đăng xuất"
2. Hệ thống xóa tokens khỏi localStorage
3. Hệ thống redirect về trang đăng nhập

**Tần suất:** Rất cao

---

## UC-04: Quản lý hồ sơ cá nhân

**Mô tả:** Xem, cập nhật thông tin cá nhân và đổi mật khẩu

**Actor:** Tất cả

**Tiền điều kiện:** Đã đăng nhập

**Hậu điều kiện:** Thông tin được cập nhật

**Luồng chính:**

1. Người dùng vào "Hồ sơ của tôi"
2. Hệ thống hiển thị thông tin hiện tại
3. Người dùng chỉnh sửa thông tin (tên, phone, avatar, địa chỉ...)
4. Người dùng có thể đổi mật khẩu (nhập mật khẩu cũ + mật khẩu mới)
5. Người dùng lưu thay đổi
6. Hệ thống validate và cập nhật

**Ngoại lệ:**

- Mật khẩu cũ sai → Hiển thị lỗi
- Ảnh avatar quá lớn → Giới hạn 2MB

**Tần suất:** Trung bình

---

## UC-05: Đăng tin tuyển dụng

**Mô tả:** Recruiter tạo tin tuyển dụng mới

**Actor:** Recruiter

**Tiền điều kiện:** Đã đăng nhập với role Recruiter

**Hậu điều kiện:** Tin tuyển dụng được tạo

**Luồng chính:**

1. Recruiter click "Đăng tin mới"
2. Recruiter điền form: Tiêu đề, Mô tả, Yêu cầu, Mức lương, Địa điểm, Loại công việc, Số lượng, Hạn nộp
3. Recruiter chọn trạng thái (DRAFT/OPEN)
4. Recruiter click "Đăng tin"
5. Hệ thống validate và lưu
6. Nếu OPEN: Gửi notification cho candidates quan tâm

**Tần suất:** Cao

---

## UC-06: Xem và tìm kiếm công việc

**Mô tả:** Xem danh sách và tìm kiếm tin tuyển dụng

**Actor:** Candidate, Recruiter

**Tiền điều kiện:** Không cần đăng nhập (cho Candidate)

**Hậu điều kiện:** Danh sách được hiển thị

**Luồng chính:**

1. Người dùng vào trang "Việc làm"
2. Hệ thống hiển thị danh sách tin (OPEN cho Candidate, tất cả cho Recruiter)
3. Người dùng có thể:
   - Tìm kiếm theo từ khóa
   - Lọc theo địa điểm, mức lương, loại công việc
   - Sắp xếp theo mới nhất, lương cao, deadline gần
4. Click vào tin để xem chi tiết (UC-07)

**Tần suất:** Rất cao

---

## UC-07: Xem chi tiết công việc

**Mô tả:** Xem thông tin đầy đủ một tin tuyển dụng

**Actor:** Candidate, Recruiter

**Luồng chính:**

1. Người dùng click vào tin tuyển dụng
2. Hệ thống hiển thị đầy đủ: Tiêu đề, Công ty, Mô tả, Yêu cầu, Lương, Địa điểm, Deadline, Số ứng viên đã nộp
3. Candidate thấy nút "Ứng tuyển ngay"
4. Recruiter thấy nút "Chỉnh sửa", "Xem ứng viên"

**Tần suất:** Rất cao

---

## UC-08: Chỉnh sửa tin tuyển dụng

**Mô tả:** Cập nhật thông tin tin đã đăng

**Actor:** Recruiter

**Tiền điều kiện:** Recruiter là người tạo tin

**Hậu điều kiện:** Tin được cập nhật

**Luồng chính:**

1. Recruiter click "Chỉnh sửa"
2. Form điền sẵn thông tin hiện tại
3. Recruiter cập nhật và lưu
4. Hệ thống validate và cập nhật

**Tần suất:** Trung bình

---

## UC-09: Quản lý trạng thái tin

**Mô tả:** Đóng, Mở hoặc Xóa tin tuyển dụng

**Actor:** Recruiter

**Luồng chính:**

- **Đóng tin:** Chuyển status = CLOSED, tin không hiển thị cho Candidate
- **Mở lại tin:** Chuyển status = OPEN
- **Xóa tin:** Soft delete (chỉ xóa được DRAFT hoặc không có ứng viên)

**Tần suất:** Trung bình

---

## UC-10: Nộp hồ sơ ứng tuyển

**Mô tả:** Candidate upload CV và nộp hồ sơ

**Actor:** Candidate

**Tiền điều kiện:** Đã đăng nhập, chưa nộp vào job này

**Hậu điều kiện:** Hồ sơ được tạo, AI tự động sàng lọc

**Luồng chính:**

1. Candidate click "Ứng tuyển ngay"
2. Candidate upload CV (PDF/DOCX, max 5MB)
3. Candidate nhập cover letter (optional)
4. Candidate click "Nộp hồ sơ"
5. Hệ thống validate file CV
6. Hệ thống tạo Application với status = PENDING
7. Hệ thống trigger AI sàng lọc tự động (UC-15)
8. Hệ thống gửi email xác nhận cho Candidate
9. Hệ thống gửi notification cho Recruiter

**Ngoại lệ:**

- File không đúng format → Lỗi
- Đã nộp rồi → Không cho nộp lại
- File quá lớn → Giới hạn 5MB

**Tần suất:** Rất cao

---

## UC-11: Xem hồ sơ đã nộp

**Mô tả:** Candidate xem lịch sử và trạng thái hồ sơ

**Actor:** Candidate

**Tiền điều kiện:** Đã đăng nhập

**Hậu điều kiện:** Danh sách hồ sơ được hiển thị

**Luồng chính:**

1. Candidate vào "Hồ sơ của tôi"
2. Hệ thống hiển thị danh sách hồ sơ đã nộp với: Job title, Company, Trạng thái, Ngày nộp, Timeline
3. Có filter theo trạng thái (PENDING, SCREENING, INTERVIEW, OFFER, REJECTED)
4. Click vào hồ sơ để xem chi tiết (UC-13)

**Tần suất:** Cao

---

## UC-12: Xem danh sách ứng viên

**Mô tả:** Recruiter xem tất cả hồ sơ ứng tuyển vào tin của mình

**Actor:** Recruiter

**Tiền điều kiện:** Đã đăng nhập

**Hậu điều kiện:** Danh sách ứng viên hiển thị

**Luồng chính:**

1. Recruiter click "Xem ứng viên" trên tin tuyển dụng
2. Hệ thống hiển thị bảng ứng viên với: Ảnh, Tên, Email, Điểm AI, Trạng thái, Ngày nộp
3. Recruiter có thể:
   - Lọc theo trạng thái, điểm AI (>=70, >=80, >=90)
   - Sắp xếp theo điểm AI, ngày nộp
   - Search theo tên, email
   - Tải CV (PDF icon)
4. Click vào ứng viên để xem chi tiết (UC-13)

**Tần suất:** Rất cao

---

## UC-13: Xem chi tiết hồ sơ

**Mô tả:** Xem thông tin đầy đủ hồ sơ ứng viên

**Actor:** Candidate, Recruiter

**Luồng chính:**

1. Click vào hồ sơ
2. Hệ thống hiển thị:
   - Thông tin ứng viên: Tên, Email, Phone
   - Job ứng tuyển
   - CV (link download)
   - Cover letter
   - Trạng thái hiện tại
   - Timeline: Nộp → Sàng lọc → Phỏng vấn → Kết quả
   - [Recruiter] Điểm AI, Phân tích AI, Feedback
3. [Recruiter] Có nút "Mời phỏng vấn", "Từ chối"

**Tần suất:** Cao

---

## UC-14: Rút hồ sơ ứng tuyển

**Mô tả:** Candidate hủy hồ sơ đã nộp

**Actor:** Candidate

**Tiền điều kiện:** Hồ sơ ở trạng thái PENDING hoặc SCREENING

**Hậu điều kiện:** Application status = WITHDRAWN

**Luồng chính:**

1. Candidate click "Rút hồ sơ"
2. Nhập lý do (optional)
3. Xác nhận
4. Hệ thống cập nhật status và gửi notification cho Recruiter

**Tần suất:** Thấp

---

## UC-15: Tự động sàng lọc CV bằng AI

**Mô tả:** AI phân tích CV và chấm điểm tự động

**Actor:** AI System (Google Gemini)

**Tiền điều kiện:** Có Application mới được tạo

**Hậu điều kiện:** Application có ai_score và ai_analysis

**Luồng chính:**

1. Hệ thống detect Application mới (signal post_save)
2. Hệ thống tạo Celery task để xử lý async
3. Worker load CV file và Job Description
4. Worker gửi request đến Gemini API với prompt:
   - Phân tích CV
   - So sánh với JD
   - Chấm điểm 0-100
   - Liệt kê điểm mạnh, điểm yếu, kỹ năng khớp/thiếu
5. Worker nhận response và parse JSON
6. Worker lưu ai_score và ai_analysis vào Application
7. Worker cập nhật Application.status = SCREENING
8. Hệ thống gửi notification cho Recruiter

**Ngoại lệ:**

- API lỗi → Retry 3 lần
- CV không đọc được → Score = 0, ghi log

**Tần suất:** Rất cao (tự động)

---

## UC-16: Xem kết quả sàng lọc AI

**Mô tả:** Recruiter xem phân tích chi tiết từ AI

**Actor:** Recruiter

**Luồng chính:**

1. Recruiter click "Xem kết quả AI" trên hồ sơ
2. Hệ thống hiển thị:
   - Điểm tổng (0-100)
   - Điểm mạnh (bullet points)
   - Điểm yếu
   - Kỹ năng khớp / thiếu
   - Kinh nghiệm phù hợp
   - Recommendation (Strongly recommend / Recommend / Consider / Not recommend)
3. Recruiter có nút "Chạy lại AI" nếu cần

**Tần suất:** Cao

---

## UC-17: Tạo và mời phỏng vấn

**Mô tả:** Recruiter tạo lịch phỏng vấn và gửi lời mời

**Actor:** Recruiter

**Tiền điều kiện:** Application ở trạng thái SCREENING

**Hậu điều kiện:** Interview được tạo, email gửi đến Candidate

**Luồng chính:**

1. Recruiter click "Mời phỏng vấn"
2. Recruiter điền form:
   - Thời gian phỏng vấn
   - Thời lượng (phút)
   - Loại (PHONE/VIDEO/ONSITE)
   - Địa điểm hoặc Link meeting
   - Chọn Interviewer(s) để gán
3. Recruiter click "Tạo lịch"
4. Hệ thống validate thời gian không trùng
5. Hệ thống tạo Interview
6. Hệ thống tạo InterviewPanel cho mỗi Interviewer
7. Hệ thống cập nhật Application.status = INTERVIEW
8. Hệ thống gửi email mời phỏng vấn cho Candidate
9. Hệ thống gửi notification cho Interviewer(s)

**Tần suất:** Cao

---

## UC-18: Xem lịch phỏng vấn

**Mô tả:** Xem danh sách lịch phỏng vấn của mình

**Actor:** Candidate, Interviewer

**Luồng chính:**

1. Người dùng vào "Lịch phỏng vấn"
2. Hệ thống hiển thị:
   - [Candidate] Lịch PV của mình
   - [Interviewer] Lịch được gán đánh giá
3. Mỗi lịch có: Thời gian, Địa điểm/Link, Thông tin ứng viên/job, Trạng thái
4. Có calendar view và list view
5. Click vào lịch để xem chi tiết

**Tần suất:** Cao

---

## UC-19: Đánh giá phỏng vấn

**Mô tả:** Interviewer chấm điểm và nhập feedback

**Actor:** Interviewer

**Tiền điều kiện:** Interview đã diễn ra (scheduled_at < now)

**Hậu điều kiện:** InterviewPanel có score và feedback

**Luồng chính:**

1. Interviewer vào form đánh giá
2. Interviewer nhập:
   - Điểm kỹ năng chuyên môn (1-5 sao)
   - Điểm kỹ năng mềm (1-5 sao)
   - Điểm thái độ (1-5 sao)
   - Điểm tổng (0-100)
   - Feedback chi tiết
   - Kết quả: PASS/FAIL
3. Interviewer lưu
4. Hệ thống cập nhật InterviewPanel
5. Hệ thống tính điểm TB nếu có nhiều Interviewer
6. Hệ thống cập nhật Interview.result (nếu tất cả đã chấm)

**Tần suất:** Cao

---

## UC-20: Gửi email kết quả phỏng vấn

**Mô tả:** Tự động gửi email thông báo kết quả PV

**Actor:** Hệ thống

**Tiền điều kiện:** Interview có result (PASS/FAIL)

**Hậu điều kiện:** Email gửi đến Candidate

**Luồng chính:**

1. Hệ thống detect Interview.result updated
2. Load template email (PASS hoặc FAIL)
3. Render với data
4. Gửi qua Resend API
5. Log email sent

**Tần suất:** Cao (tự động)

---

## UC-21: Tạo và gửi kết quả tuyển dụng

**Mô tả:** Recruiter tạo quyết định cuối cùng OFFER/REJECT

**Actor:** Recruiter

**Tiền điều kiện:** Application đã qua phỏng vấn

**Hậu điều kiện:** RecruitmentResult được tạo, email gửi

**Luồng chính:**

1. Recruiter vào chi tiết hồ sơ
2. Recruiter click "Gửi kết quả tuyển dụng"
3. Recruiter chọn quyết định: OFFER/REJECT
4. Recruiter nhập:
   - [OFFER] Mức lương, Ngày bắt đầu
   - [REJECT] Lý do (optional)
   - Ghi chú
5. Recruiter xác nhận
6. Hệ thống tạo RecruitmentResult
7. Hệ thống cập nhật Application.status
8. Hệ thống gửi email tự động:
   - OFFER: Thư mời nhận việc với thông tin chi tiết
   - REJECT: Thư từ chối lịch sự
9. Hệ thống tạo notification
10. Hệ thống log quyết định

**Tần suất:** Cao

---

## UC-22: Xem lịch sử quyết định

**Mô tả:** Xem tất cả quyết định tuyển dụng đã đưa ra

**Actor:** Recruiter, Admin

**Luồng chính:**

1. Người dùng vào "Lịch sử quyết định"
2. Hệ thống hiển thị bảng: Ngày, Ứng viên, Vị trí, Quyết định, Mức lương, Người quyết định
3. Có filter: Quyết định (OFFER/REJECT), Thời gian, Người quyết định
4. Có search theo tên ứng viên
5. Click vào dòng để xem chi tiết

**Ngoại lệ:**

- Recruiter chỉ xem quyết định của công ty mình
- Admin xem tất cả

**Tần suất:** Trung bình

---

## UC-23: Hệ thống thông báo

**Mô tả:** Xem, đánh dấu đã đọc và nhận thông báo

**Actor:** Tất cả

**Luồng chính:**

**Xem thông báo:**

1. Người dùng click icon chuông 🔔
2. Dropdown hiển thị 10 notification mới nhất
3. Click "Xem tất cả" để vào trang đầy đủ
4. Có tab "Chưa đọc" và "Tất cả"
5. Badge hiển thị số chưa đọc

**Đánh dấu đã đọc:**

- Click vào notification → Tự động đánh dấu đã đọc
- Click "Đánh dấu tất cả đã đọc" → Badge về 0

**Nhận email thông báo:**

- Khi có sự kiện quan trọng, hệ thống tạo in-app notification
- Nếu user bật email notification trong settings
- Hệ thống gửi email tương ứng qua Resend API

**Các loại thông báo:**

- Candidate: OTP, Xác nhận nộp hồ sơ, Mời PV, Kết quả PV, Kết quả TD
- Recruiter: Hồ sơ mới, AI hoàn thành, Kết quả PV từ Interviewer
- Interviewer: Được gán lịch PV

**Tần suất:** Rất cao

---

## UC-24: Quản lý người dùng

**Mô tả:** Admin quản lý tài khoản người dùng và công ty

**Actor:** Admin

**Luồng chính:**

**Quản lý người dùng:**

1. Admin vào "Quản lý người dùng"
2. Hiển thị bảng: Avatar, Tên, Email, Role, Trạng thái, Ngày đăng ký
3. Admin có thể:
   - Lọc theo role, trạng thái
   - Search theo tên, email
   - Xem chi tiết user
   - Sửa thông tin (tên, phone, role)
   - Khóa/Mở khóa tài khoản
   - Reset password (gửi email password mới)
   - Xóa tài khoản (soft delete)

**Quản lý công ty:**

1. Admin vào "Quản lý công ty"
2. Hiển thị danh sách công ty (group by company_name từ Recruiter accounts)
3. Mỗi công ty có: Tên, Logo, Số Recruiter, Số tin đăng, Số hồ sơ nhận, Trạng thái
4. Admin có thể:
   - Xem chi tiết công ty
   - Sửa thông tin công ty
   - Vô hiệu hóa công ty (tất cả recruiter bị khóa, job bị đóng)
   - Kích hoạt lại công ty

**Tần suất:** Trung bình

---

## UC-25: Dashboard và báo cáo

**Mô tả:** Admin xem thống kê và xuất báo cáo

**Actor:** Admin

**Luồng chính:**

**Dashboard:**

1. Admin vào Dashboard
2. Hệ thống hiển thị:
   - **Cards:** Tổng users, jobs, hồ sơ, tỷ lệ thành công
   - **Charts:**
     - Line: Người dùng mới theo thời gian
     - Bar: Hồ sơ theo trạng thái
     - Pie: Phân bố user theo role
     - Area: Tin tuyển dụng theo thời gian
     - Horizontal Bar: Top công ty
   - **Tables:** Jobs mới nhất, Hồ sơ mới nhất, PV sắp tới
3. Dashboard tự động refresh mỗi 5 phút
4. Admin có thể chọn date range (7/30/90 ngày)

**Xuất báo cáo:**

1. Admin vào "Xuất báo cáo"
2. Chọn loại: Tuyển dụng, Người dùng, Hoạt động, Công ty
3. Chọn kỳ: Tuần/Tháng/Quý/Năm/Tùy chỉnh
4. Chọn format: Excel/PDF
5. Chọn tùy chọn: Có biểu đồ, Có tóm tắt
6. Click "Xuất báo cáo"
7. Hệ thống tạo file async
8. Gửi notification khi sẵn sàng
9. Admin tải file về

**Tần suất:** Trung bình

---

## TỔNG KẾT

**Số lượng Use Case:** 25

**Phân loại:**

- **Nhóm 1 - Tài khoản (4 UC):** UC-01 đến UC-04
- **Nhóm 2 - Tin tuyển dụng (5 UC):** UC-05 đến UC-09
- **Nhóm 3 - Ứng tuyển (5 UC):** UC-10 đến UC-14
- **Nhóm 4 - AI (2 UC):** UC-15 đến UC-16
- **Nhóm 5 - Phỏng vấn (4 UC):** UC-17 đến UC-20
- **Nhóm 6 - Kết quả (2 UC):** UC-21 đến UC-22
- **Nhóm 7 - Thông báo (1 UC):** UC-23
- **Nhóm 8 - Admin (2 UC):** UC-24 đến UC-25

**Độ ưu tiên:**

- Cao: 18 UC
- Trung bình: 6 UC
- Thấp: 1 UC

**Actors:**

- Candidate: 10 UC
- Recruiter: 12 UC
- Interviewer: 2 UC
- Admin: 2 UC
- AI System: 1 UC
- Hệ thống: 3 UC (tự động)

**Tính năng nổi bật:**

- ✅ AI sàng lọc CV tự động (UC-15)
- ✅ Hệ thống thông báo đa kênh (UC-23)
- ✅ Email automation (UC-20, UC-21)
- ✅ Dashboard thống kê (UC-25)

---

_Document này mô tả 25 Use Cases của Hệ thống Tuyển dụng Nhân sự Thông minh, đã được rút gọn từ 40 UC ban đầu bằng cách gộp các UC tương tự và loại bỏ UC ít quan trọng._
