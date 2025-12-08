# CHƯƠNG 3: PHÂN TÍCH HỆ THỐNG

## 3.1 Sơ đồ lớp

### 3.1.1 Sơ đồ lớp mức phân tích

Sơ đồ lớp được thiết kế theo mô hình phân tích Entity-Boundary-Control (EBC), thể hiện các lớp chính trong hệ thống tuyển dụng nhân sự thông minh.

**Ghi chú:**

- Sơ đồ chi tiết được vẽ trong file `CLASS-DIAGRAM.drawio` (import vào draw.io để xem)
- Sơ đồ ở mức phân tích, chưa chi tiết đến mức thiết kế code
- Thể hiện các thuộc tính cơ bản và mối quan hệ giữa các lớp

---

### 3.1.2 Danh sách các đối tượng và mối quan hệ

#### A. BẢNG LIỆT KÊ CÁC LỚP

| STT                                                | Tên lớp                 | Loại lớp | Mô tả ngắn gọn                                                                                   |
| -------------------------------------------------- | ----------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| **I. ENTITY CLASSES (Lớp thực thể - 10 lớp)**      |
| 1                                                  | User                    | Entity   | Quản lý tất cả người dùng trong hệ thống với 4 vai trò: Admin, Recruiter, Interviewer, Candidate |
| 2                                                  | Job                     | Entity   | Lưu trữ thông tin tin tuyển dụng (vị trí công việc) do Recruiter đăng                            |
| 3                                                  | Application             | Entity   | Quản lý hồ sơ ứng tuyển của Candidate vào các Job                                                |
| 4                                                  | Interview               | Entity   | Quản lý lịch phỏng vấn cho các ứng viên                                                          |
| 5                                                  | InterviewPanel          | Entity   | Lưu trữ đánh giá và điểm số của từng Interviewer trong buổi phỏng vấn                            |
| 6                                                  | RecruitmentResult       | Entity   | Lưu kết quả tuyển dụng cuối cùng (OFFER/REJECT) cho từng hồ sơ                                   |
| 7                                                  | Notification            | Entity   | Quản lý thông báo gửi đến người dùng (in-app và email)                                           |
| 8                                                  | SavedJob                | Entity   | Lưu trữ các công việc mà Candidate đã lưu (bookmark)                                             |
| 9                                                  | RecruitmentProcess      | Entity   | Định nghĩa quy trình tuyển dụng gồm nhiều bước                                                   |
| 10                                                 | ProcessStep             | Entity   | Các bước cụ thể trong quy trình tuyển dụng (sàng lọc, phỏng vấn, offer...)                       |
| **II. BOUNDARY CLASSES (Lớp giao diện - 12 lớp)**  |
| 11                                                 | GiaoDienDangNhap        | Boundary | Form đăng nhập hệ thống bằng email/password                                                      |
| 12                                                 | GiaoDienDangKy          | Boundary | Form đăng ký tài khoản mới với xác thực OTP                                                      |
| 13                                                 | GiaoDienQuanLyHoSo      | Boundary | Giao diện quản lý thông tin cá nhân và đổi mật khẩu                                              |
| 14                                                 | GiaoDienDangTin         | Boundary | Form đăng tin tuyển dụng cho Recruiter                                                           |
| 15                                                 | GiaoDienTimKiemViecLam  | Boundary | Giao diện tìm kiếm và lọc công việc cho Candidate                                                |
| 16                                                 | GiaoDienNopHoSo         | Boundary | Form nộp hồ sơ ứng tuyển (upload CV, cover letter)                                               |
| 17                                                 | GiaoDienDanhSachUngVien | Boundary | Hiển thị danh sách ứng viên của Recruiter                                                        |
| 18                                                 | GiaoDienTaoPhongVan     | Boundary | Form tạo lịch phỏng vấn và mời ứng viên                                                          |
| 19                                                 | GiaoDienDanhGiaPhongVan | Boundary | Form đánh giá và chấm điểm phỏng vấn                                                             |
| 20                                                 | GiaoDienKetQuaTuyenDung | Boundary | Form quyết định OFFER/REJECT cho ứng viên                                                        |
| 21                                                 | GiaoDienThongBao        | Boundary | Hiển thị danh sách thông báo và trạng thái đọc                                                   |
| 22                                                 | GiaoDienDashboard       | Boundary | Dashboard hiển thị thống kê và biểu đồ cho Admin                                                 |
| **III. CONTROL CLASSES (Lớp điều khiển - 13 lớp)** |
| 23                                                 | XuLyDangNhap            | Control  | Xác thực thông tin đăng nhập, tạo JWT token                                                      |
| 24                                                 | XuLyDangKy              | Control  | Xử lý đăng ký, tạo OTP và gửi email xác thực                                                     |
| 25                                                 | XuLyXacThucOTP          | Control  | Validate mã OTP và kích hoạt tài khoản                                                           |
| 26                                                 | QuanLyJob               | Control  | Xử lý logic tạo, sửa, xóa, đóng/mở tin tuyển dụng                                                |
| 27                                                 | QuanLyUngTuyen          | Control  | Xử lý nộp hồ sơ, validate CV, trigger AI sàng lọc                                                |
| 28                                                 | XuLySangLocAI           | Control  | Gọi Google Gemini API để phân tích CV và chấm điểm                                               |
| 29                                                 | QuanLyPhongVan          | Control  | Xử lý tạo lịch, gán interviewer, cập nhật kết quả                                                |
| 30                                                 | TinhDiemPhongVan        | Control  | Tính điểm trung bình từ nhiều interviewer                                                        |
| 31                                                 | QuanLyKetQuaTuyenDung   | Control  | Xử lý quyết định cuối cùng, tạo offer letter                                                     |
| 32                                                 | GuiEmail                | Control  | Gửi email thông qua Resend API (OTP, thông báo, kết quả)                                         |
| 33                                                 | QuanLyThongBao          | Control  | Tạo và gửi notification (in-app + email)                                                         |
| 34                                                 | QuanLyNguoiDung         | Control  | Xử lý logic quản lý user và công ty (Admin)                                                      |
| 35                                                 | TaoThongKe              | Control  | Tạo báo cáo và biểu đồ thống kê cho Dashboard                                                    |

**Tổng cộng: 35 lớp**

- Entity: 10 lớp
- Boundary: 12 lớp
- Control: 13 lớp

---

#### B. BẢNG MỐI QUAN HỆ GIỮA CÁC LỚP

##### **B.1. Mối quan hệ Entity - Entity**

| STT | Lớp nguồn          | Loại quan hệ      | Lớp đích           | Bản số     | Mô tả mối quan hệ                                                    |
| --- | ------------------ | ----------------- | ------------------ | ---------- | -------------------------------------------------------------------- |
| 1   | User               | Association       | Job                | 1 → 0..\*  | Một Recruiter tạo nhiều tin tuyển dụng                               |
| 2   | User               | Association       | Application        | 1 → 0..\*  | Một Candidate nộp nhiều hồ sơ ứng tuyển                              |
| 3   | User               | Association       | InterviewPanel     | 1 → 0..\*  | Một Interviewer đánh giá nhiều buổi phỏng vấn                        |
| 4   | User               | Association       | RecruitmentResult  | 1 → 0..\*  | Một Recruiter quyết định nhiều kết quả tuyển dụng                    |
| 5   | User               | Association       | Notification       | 1 → 0..\*  | Một User nhận nhiều thông báo                                        |
| 6   | User               | Association       | RecruitmentProcess | 1 → 0..\*  | Một Recruiter tạo nhiều quy trình tuyển dụng                         |
| 7   | Job                | Association       | Application        | 1 → 0..\*  | Một Job nhận nhiều hồ sơ ứng tuyển                                   |
| 8   | Application        | Association       | Interview          | 1 → 0..\*  | Một hồ sơ có nhiều buổi phỏng vấn (vòng 1, 2, 3...)                  |
| 9   | Application        | Association       | RecruitmentResult  | 1 → 0..1   | Một hồ sơ có tối đa một kết quả tuyển dụng cuối cùng                 |
| 10  | Interview          | Composition       | InterviewPanel     | 1 ◆→ 1..\* | Một buổi phỏng vấn bao gồm nhiều người đánh giá (phụ thuộc mạnh)     |
| 11  | RecruitmentProcess | Composition       | ProcessStep        | 1 ◆→ 1..\* | Một quy trình bao gồm nhiều bước (phụ thuộc mạnh)                    |
| 12  | RecruitmentProcess | Association       | Job                | 1 → 0..\*  | Một quy trình được áp dụng cho nhiều Job                             |
| 13  | User               | Association (M-N) | Job                | _ ↔ _      | Candidate lưu nhiều Job, Job được nhiều Candidate lưu (qua SavedJob) |

**Chú thích:**

- **Association (→)**: Quan hệ liên kết thông thường
- **Composition (◆→)**: Quan hệ chứa đựng mạnh (phụ thuộc vòng đời)
- **M-N (↔)**: Quan hệ nhiều-nhiều qua bảng trung gian

---

##### **B.2. Mối quan hệ Boundary - Control**

| STT | Lớp nguồn (Boundary)    | Loại quan hệ | Lớp đích (Control)    | Bản số | Mô tả mối quan hệ                                   |
| --- | ----------------------- | ------------ | --------------------- | ------ | --------------------------------------------------- |
| 14  | GiaoDienDangNhap        | Dependency   | XuLyDangNhap          | 1 ⇢ 1  | Giao diện gọi controller để xử lý đăng nhập         |
| 15  | GiaoDienDangKy          | Dependency   | XuLyDangKy            | 1 ⇢ 1  | Giao diện gọi controller để xử lý đăng ký           |
| 16  | GiaoDienDangKy          | Dependency   | XuLyXacThucOTP        | 1 ⇢ 1  | Giao diện gọi controller để xác thực OTP            |
| 17  | GiaoDienQuanLyHoSo      | Dependency   | QuanLyNguoiDung       | 1 ⇢ 1  | Giao diện gọi controller để cập nhật thông tin      |
| 18  | GiaoDienDangTin         | Dependency   | QuanLyJob             | 1 ⇢ 1  | Giao diện gọi controller để quản lý tin tuyển dụng  |
| 19  | GiaoDienTimKiemViecLam  | Dependency   | QuanLyJob             | 1 ⇢ 1  | Giao diện gọi controller để tìm kiếm và lọc Job     |
| 20  | GiaoDienNopHoSo         | Dependency   | QuanLyUngTuyen        | 1 ⇢ 1  | Giao diện gọi controller để nộp hồ sơ               |
| 21  | GiaoDienDanhSachUngVien | Dependency   | QuanLyUngTuyen        | 1 ⇢ 1  | Giao diện gọi controller để xem danh sách ứng viên  |
| 22  | GiaoDienTaoPhongVan     | Dependency   | QuanLyPhongVan        | 1 ⇢ 1  | Giao diện gọi controller để tạo lịch phỏng vấn      |
| 23  | GiaoDienDanhGiaPhongVan | Dependency   | QuanLyPhongVan        | 1 ⇢ 1  | Giao diện gọi controller để đánh giá phỏng vấn      |
| 24  | GiaoDienDanhGiaPhongVan | Dependency   | TinhDiemPhongVan      | 1 ⇢ 1  | Giao diện gọi controller để tính điểm trung bình    |
| 25  | GiaoDienKetQuaTuyenDung | Dependency   | QuanLyKetQuaTuyenDung | 1 ⇢ 1  | Giao diện gọi controller để quyết định OFFER/REJECT |
| 26  | GiaoDienThongBao        | Dependency   | QuanLyThongBao        | 1 ⇢ 1  | Giao diện gọi controller để lấy danh sách thông báo |
| 27  | GiaoDienDashboard       | Dependency   | TaoThongKe            | 1 ⇢ 1  | Giao diện gọi controller để tạo báo cáo thống kê    |

**Chú thích:**

- **Dependency (⇢)**: Quan hệ phụ thuộc (Boundary phụ thuộc Control để xử lý logic)

---

##### **B.3. Mối quan hệ Control - Entity**

| STT | Lớp nguồn (Control)   | Loại quan hệ | Lớp đích (Entity)  | Bản số | Mô tả mối quan hệ                                           |
| --- | --------------------- | ------------ | ------------------ | ------ | ----------------------------------------------------------- |
| 28  | XuLyDangNhap          | Dependency   | User               | 1 ⇢ \* | Controller truy xuất dữ liệu User để xác thực               |
| 29  | XuLyDangKy            | Dependency   | User               | 1 ⇢ \* | Controller tạo User mới trong database                      |
| 30  | XuLyDangKy            | Dependency   | GuiEmail           | 1 ⇢ 1  | Controller gọi service gửi email OTP                        |
| 31  | XuLyXacThucOTP        | Dependency   | User               | 1 ⇢ \* | Controller cập nhật trạng thái xác thực User                |
| 32  | QuanLyJob             | Dependency   | Job                | 1 ⇢ \* | Controller tạo, đọc, cập nhật, xóa Job                      |
| 33  | QuanLyJob             | Dependency   | RecruitmentProcess | 1 ⇢ \* | Controller liên kết Job với quy trình tuyển dụng            |
| 34  | QuanLyUngTuyen        | Dependency   | Application        | 1 ⇢ \* | Controller tạo và quản lý hồ sơ ứng tuyển                   |
| 35  | QuanLyUngTuyen        | Dependency   | XuLySangLocAI      | 1 ⇢ 1  | Controller gọi AI service để sàng lọc CV                    |
| 36  | XuLySangLocAI         | Dependency   | Application        | 1 ⇢ \* | Controller cập nhật ai_score và ai_analysis vào Application |
| 37  | QuanLyPhongVan        | Dependency   | Interview          | 1 ⇢ \* | Controller tạo và quản lý lịch phỏng vấn                    |
| 38  | QuanLyPhongVan        | Dependency   | InterviewPanel     | 1 ⇢ \* | Controller gán Interviewer vào buổi phỏng vấn               |
| 39  | QuanLyPhongVan        | Dependency   | GuiEmail           | 1 ⇢ 1  | Controller gọi service gửi email mời phỏng vấn              |
| 40  | TinhDiemPhongVan      | Dependency   | InterviewPanel     | 1 ⇢ \* | Controller tính điểm trung bình từ các Interviewer          |
| 41  | TinhDiemPhongVan      | Dependency   | Interview          | 1 ⇢ \* | Controller cập nhật kết quả phỏng vấn                       |
| 42  | QuanLyKetQuaTuyenDung | Dependency   | RecruitmentResult  | 1 ⇢ \* | Controller tạo kết quả tuyển dụng cuối cùng                 |
| 43  | QuanLyKetQuaTuyenDung | Dependency   | Application        | 1 ⇢ \* | Controller cập nhật trạng thái Application                  |
| 44  | QuanLyKetQuaTuyenDung | Dependency   | GuiEmail           | 1 ⇢ 1  | Controller gọi service gửi email kết quả                    |
| 45  | GuiEmail              | Dependency   | Notification       | 1 ⇢ \* | Service tạo notification khi gửi email                      |
| 46  | QuanLyThongBao        | Dependency   | Notification       | 1 ⇢ \* | Controller quản lý thông báo (tạo, đọc, xóa)                |
| 47  | QuanLyNguoiDung       | Dependency   | User               | 1 ⇢ \* | Controller quản lý danh sách người dùng (Admin)             |
| 48  | TaoThongKe            | Dependency   | User               | 1 ⇢ \* | Controller truy vấn dữ liệu User để thống kê                |
| 49  | TaoThongKe            | Dependency   | Job                | 1 ⇢ \* | Controller truy vấn dữ liệu Job để thống kê                 |
| 50  | TaoThongKe            | Dependency   | Application        | 1 ⇢ \* | Controller truy vấn dữ liệu Application để thống kê         |
| 51  | TaoThongKe            | Dependency   | Interview          | 1 ⇢ \* | Controller truy vấn dữ liệu Interview để thống kê           |

**Chú thích:**

- **Dependency (⇢)**: Quan hệ phụ thuộc (Control phụ thuộc Entity để lưu trữ/truy xuất dữ liệu)

---

##### **B.4. Mối quan hệ đặc biệt**

| STT | Lớp nguồn | Loại quan hệ | Lớp đích | Bản số | Mô tả mối quan hệ                                 |
| --- | --------- | ------------ | -------- | ------ | ------------------------------------------------- |
| 52  | SavedJob  | Association  | User     | \* → 1 | Bảng trung gian liên kết Candidate với Job đã lưu |
| 53  | SavedJob  | Association  | Job      | \* → 1 | Bảng trung gian liên kết Job với Candidate đã lưu |

---

### 3.1.3 Mô tả chi tiết từng đối tượng

#### **1. User (Entity - Lớp người dùng)**

**a) Thông tin chung:**

- **Tên lớp:** User
- **Loại lớp:** Entity
- **Vai trò:** Quản lý tất cả người dùng trong hệ thống với 4 vai trò khác nhau

**b) Thuộc tính:**

| Tên thuộc tính    | Kiểu dữ liệu | Mô tả                                              | Ràng buộc                      |
| ----------------- | ------------ | -------------------------------------------------- | ------------------------------ |
| id                | UUID         | Mã định danh người dùng                            | Primary Key, Not Null          |
| email             | String       | Email đăng nhập                                    | Unique, Not Null, Email Format |
| password          | String       | Mật khẩu đã mã hóa                                 | Not Null, Min 8 ký tự          |
| first_name        | String       | Tên                                                | Not Null, Max 100 ký tự        |
| last_name         | String       | Họ                                                 | Not Null, Max 100 ký tự        |
| role              | Enum         | Vai trò (ADMIN, RECRUITER, INTERVIEWER, CANDIDATE) | Not Null                       |
| avatar            | Image        | Ảnh đại diện                                       | Nullable, Max 2MB              |
| phone             | String       | Số điện thoại                                      | Nullable, Max 20 ký tự         |
| is_email_verified | Boolean      | Trạng thái xác thực email                          | Default: False                 |
| otp_code          | String       | Mã OTP 6 số                                        | Nullable, Length 6             |
| otp_sent_at       | DateTime     | Thời gian gửi OTP                                  | Nullable                       |
| company_name      | String       | Tên công ty (cho Recruiter)                        | Nullable, Max 255 ký tự        |
| tax_id            | String       | Mã số thuế                                         | Nullable, Max 50 ký tú         |
| website           | URL          | Website công ty                                    | Nullable, URL Format           |
| address           | Text         | Địa chỉ công ty                                    | Nullable                       |
| created_at        | DateTime     | Thời gian tạo tài khoản                            | Auto, Not Null                 |
| updated_at        | DateTime     | Thời gian cập nhật                                 | Auto, Not Null                 |

**c) Phương thức:**

| Tên phương thức   | Tham số                    | Kiểu trả về | Mô tả                                         |
| ----------------- | -------------------------- | ----------- | --------------------------------------------- |
| get_full_name()   | -                          | String      | Trả về họ tên đầy đủ (last_name + first_name) |
| verify_email()    | otp: String                | Boolean     | Xác thực email bằng mã OTP                    |
| change_password() | old_password, new_password | Boolean     | Đổi mật khẩu                                  |
| update_profile()  | data: Dict                 | Boolean     | Cập nhật thông tin cá nhân                    |
| is_recruiter()    | -                          | Boolean     | Kiểm tra có phải Recruiter không              |
| is_candidate()    | -                          | Boolean     | Kiểm tra có phải Candidate không              |

**d) Mối quan hệ:**

- **1 → 0..\*** với Job: Một Recruiter tạo nhiều tin tuyển dụng
- **1 → 0..\*** với Application: Một Candidate nộp nhiều hồ sơ
- **1 → 0..\*** với InterviewPanel: Một Interviewer đánh giá nhiều buổi phỏng vấn
- **1 → 0..\*** với RecruitmentResult: Một Recruiter quyết định nhiều kết quả
- **1 → 0..\*** với Notification: Một User nhận nhiều thông báo
- **\* ↔ \*** với Job (qua SavedJob): Candidate lưu nhiều Job

**e) Quy tắc nghiệp vụ:**

- Email phải duy nhất trong hệ thống
- OTP chỉ hợp lệ trong 10 phút
- Chỉ Recruiter mới có thông tin công ty (company_name, tax_id, website)
- Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
- Sau 5 lần nhập sai OTP, tài khoản bị khóa 15 phút

---

#### **2. Job (Entity - Tin tuyển dụng)**

**a) Thông tin chung:**

- **Tên lớp:** Job
- **Loại lớp:** Entity
- **Vai trò:** Lưu trữ thông tin tin tuyển dụng (vị trí công việc)

**b) Thuộc tính:**

| Tên thuộc tính   | Kiểu dữ liệu | Mô tả                                            | Ràng buộc                         |
| ---------------- | ------------ | ------------------------------------------------ | --------------------------------- |
| id               | UUID         | Mã định danh công việc                           | Primary Key, Not Null             |
| title            | String       | Tiêu đề công việc                                | Not Null, Max 255 ký tự           |
| department       | String       | Phòng ban                                        | Nullable, Max 100 ký tự           |
| description      | Text         | Mô tả công việc                                  | Not Null                          |
| requirements     | Text         | Yêu cầu ứng viên (JD)                            | Not Null                          |
| salary_min       | Decimal      | Mức lương tối thiểu                              | Nullable, >= 0                    |
| salary_max       | Decimal      | Mức lương tối đa                                 | Nullable, >= salary_min           |
| salary           | String       | Mức lương dạng text                              | Nullable, Max 100 ký tự           |
| location         | String       | Địa điểm làm việc                                | Not Null, Max 255 ký tự           |
| employment_type  | Enum         | Loại hình (FULLTIME, PARTTIME, CONTRACT, INTERN) | Not Null                          |
| positions_count  | Integer      | Số lượng cần tuyển                               | Default: 1, >= 1                  |
| experience_years | Integer      | Số năm kinh nghiệm                               | Default: 0, >= 0                  |
| status           | Enum         | Trạng thái (DRAFT, OPEN, CLOSED)                 | Not Null, Default: DRAFT          |
| deadline         | DateTime     | Hạn nộp hồ sơ                                    | Not Null, >= today                |
| process          | FK           | Quy trình tuyển dụng                             | Nullable, FK → RecruitmentProcess |
| created_by       | FK           | Người tạo tin                                    | Not Null, FK → User               |
| created_at       | DateTime     | Thời gian tạo                                    | Auto, Not Null                    |
| updated_at       | DateTime     | Thời gian cập nhật                               | Auto, Not Null                    |

**c) Phương thức:**

| Tên phương thức            | Tham số    | Kiểu trả về | Mô tả                                  |
| -------------------------- | ---------- | ----------- | -------------------------------------- |
| publish()                  | -          | Boolean     | Chuyển status từ DRAFT sang OPEN       |
| close()                    | -          | Boolean     | Chuyển status sang CLOSED              |
| is_expired()               | -          | Boolean     | Kiểm tra đã quá hạn deadline chưa      |
| count_applications()       | -          | Integer     | Đếm số hồ sơ đã nộp                    |
| get_pending_applications() | -          | List        | Lấy danh sách hồ sơ đang chờ           |
| can_edit()                 | user: User | Boolean     | Kiểm tra user có quyền chỉnh sửa không |

**d) Mối quan hệ:**

- **Many → 1** với User: Nhiều Job thuộc 1 Recruiter
- **1 → 0..\*** với Application: Một Job nhận nhiều hồ sơ
- **Many → 1** với RecruitmentProcess: Nhiều Job dùng 1 quy trình
- **\* ↔ \*** với User (qua SavedJob): Job được nhiều Candidate lưu

**e) Quy tắc nghiệp vụ:**

- Chỉ Recruiter mới có thể tạo Job
- Job ở trạng thái DRAFT không hiển thị cho Candidate
- Khi status = CLOSED, không thể nộp hồ sơ mới
- Deadline phải lớn hơn hoặc bằng ngày hiện tại
- Nếu có salary_min và salary_max, thì salary_max >= salary_min
- Job chỉ được xóa khi chưa có hồ sơ nào hoặc status = DRAFT

---

#### **3. Application (Entity - Hồ sơ ứng tuyển)**

**a) Thông tin chung:**

- **Tên lớp:** Application
- **Loại lớp:** Entity
- **Vai trò:** Quản lý hồ sơ ứng viên nộp vào các Job

**b) Thuộc tính:**

| Tên thuộc tính | Kiểu dữ liệu | Mô tả                                                                 | Ràng buộc                  |
| -------------- | ------------ | --------------------------------------------------------------------- | -------------------------- |
| id             | UUID         | Mã định danh hồ sơ                                                    | Primary Key, Not Null      |
| job            | FK           | Công việc ứng tuyển                                                   | Not Null, FK → Job         |
| candidate      | FK           | Ứng viên                                                              | Not Null, FK → User        |
| cv_file        | File         | File CV (PDF/DOCX)                                                    | Not Null, Max 5MB          |
| cover_letter   | Text         | Thư xin việc                                                          | Nullable                   |
| status         | Enum         | Trạng thái (PENDING, SCREENING, INTERVIEW, OFFER, REJECTED, ACCEPTED) | Not Null, Default: PENDING |
| ai_score       | Float        | Điểm AI sàng lọc (0-100)                                              | Nullable, 0-100            |
| ai_analysis    | JSON         | Kết quả phân tích AI                                                  | Nullable                   |
| screener_notes | Text         | Ghi chú của người sàng lọc                                            | Nullable                   |
| applied_at     | DateTime     | Thời gian nộp                                                         | Auto, Not Null             |
| updated_at     | DateTime     | Thời gian cập nhật                                                    | Auto, Not Null             |

**c) Phương thức:**

| Tên phương thức         | Tham số        | Kiểu trả về | Mô tả                                                                   |
| ----------------------- | -------------- | ----------- | ----------------------------------------------------------------------- |
| run_ai_screening()      | -              | Boolean     | Trigger AI để sàng lọc CV                                               |
| move_to_interview()     | -              | Boolean     | Chuyển sang giai đoạn phỏng vấn                                         |
| reject()                | reason: String | Boolean     | Từ chối hồ sơ                                                           |
| withdraw()              | -              | Boolean     | Candidate rút hồ sơ                                                     |
| get_ai_recommendation() | -              | String      | Lấy đề xuất từ AI (Strongly recommend/Recommend/Consider/Not recommend) |
| can_withdraw()          | -              | Boolean     | Kiểm tra có thể rút hồ sơ không (chỉ khi PENDING hoặc SCREENING)        |

**d) Mối quan hệ:**

- **Many → 1** với Job: Nhiều hồ sơ cho 1 công việc
- **Many → 1** với User: Nhiều hồ sơ từ 1 Candidate
- **1 → 0..\*** với Interview: Một hồ sơ có nhiều lịch phỏng vấn
- **1 → 0..1** với RecruitmentResult: Một hồ sơ có tối đa 1 kết quả cuối cùng

**e) Quy tắc nghiệp vụ:**

- Một Candidate chỉ nộp 1 lần vào 1 Job (unique_together: job, candidate)
- CV file chỉ chấp nhận PDF hoặc DOCX, tối đa 5MB
- Sau khi nộp, hệ thống tự động trigger AI sàng lọc
- Chỉ có thể rút hồ sơ khi status = PENDING hoặc SCREENING
- Khi status = REJECTED hoặc ACCEPTED, không thể thay đổi
- ai_score được cập nhật tự động bởi AI service

---

#### **4. Interview (Entity - Lịch phỏng vấn)**

**a) Thông tin chung:**

- **Tên lớp:** Interview
- **Loại lớp:** Entity
- **Vai trò:** Quản lý lịch phỏng vấn cho ứng viên

**b) Thuộc tính:**

| Tên thuộc tính | Kiểu dữ liệu | Mô tả                                        | Ràng buộc                    |
| -------------- | ------------ | -------------------------------------------- | ---------------------------- |
| id             | UUID         | Mã định danh lịch PV                         | Primary Key, Not Null        |
| application    | FK           | Hồ sơ liên quan                              | Not Null, FK → Application   |
| scheduled_at   | DateTime     | Thời gian phỏng vấn                          | Not Null, >= now             |
| duration       | Integer      | Thời lượng (phút)                            | Not Null, > 0                |
| location       | String       | Địa điểm/Link meeting                        | Not Null, Max 500 ký tự      |
| interview_type | Enum         | Loại (PHONE, VIDEO, ONSITE)                  | Not Null                     |
| status         | Enum         | Trạng thái (SCHEDULED, COMPLETED, CANCELLED) | Not Null, Default: SCHEDULED |
| feedback       | Text         | Phản hồi tổng quan                           | Nullable                     |
| result         | Enum         | Kết quả (PASS, FAIL, PENDING)                | Not Null, Default: PENDING   |
| created_at     | DateTime     | Thời gian tạo                                | Auto, Not Null               |
| updated_at     | DateTime     | Thời gian cập nhật                           | Auto, Not Null               |

**c) Phương thức:**

| Tên phương thức           | Tham số                             | Kiểu trả về | Mô tả                                 |
| ------------------------- | ----------------------------------- | ----------- | ------------------------------------- |
| schedule()                | date_time, duration, type, location | Boolean     | Tạo lịch phỏng vấn mới                |
| cancel()                  | reason: String                      | Boolean     | Hủy lịch phỏng vấn                    |
| complete()                | -                                   | Boolean     | Đánh dấu hoàn thành                   |
| calculate_average_score() | -                                   | Float       | Tính điểm TB từ tất cả InterviewPanel |
| is_passed()               | -                                   | Boolean     | Kiểm tra kết quả PASS hay không       |
| send_invitation_email()   | -                                   | Boolean     | Gửi email mời phỏng vấn               |

**d) Mối quan hệ:**

- **Many → 1** với Application: Nhiều buổi PV cho 1 hồ sơ (vòng 1, 2, 3...)
- **1 ◆→ 1..\*** với InterviewPanel: Một buổi PV bao gồm nhiều người đánh giá (Composition)

**e) Quy tắc nghiệp vụ:**

- scheduled_at phải lớn hơn thời gian hiện tại
- Một Application có thể có nhiều Interview (nhiều vòng phỏng vấn)
- Khi tạo Interview, Application.status tự động chuyển sang INTERVIEW
- result = PASS/FAIL được tính dựa trên điểm TB từ InterviewPanel
- Khi status = CANCELLED, không thể cập nhật feedback hay result
- Hệ thống tự động gửi email mời khi tạo Interview

---

#### **5. InterviewPanel (Entity - Hội đồng phỏng vấn)**

**a) Thông tin chung:**

- **Tên lớp:** InterviewPanel
- **Loại lớp:** Entity
- **Vai trò:** Lưu điểm và feedback của từng Interviewer

**b) Thuộc tính:**

| Tên thuộc tính   | Kiểu dữ liệu | Mô tả                             | Ràng buộc                |
| ---------------- | ------------ | --------------------------------- | ------------------------ |
| id               | UUID         | Mã định danh                      | Primary Key, Not Null    |
| interview        | FK           | Lịch phỏng vấn                    | Not Null, FK → Interview |
| interviewer      | FK           | Người phỏng vấn                   | Not Null, FK → User      |
| role             | Enum         | Vai trò (LEAD, MEMBER, OBSERVER)  | Not Null                 |
| feedback         | Text         | Nhận xét chi tiết                 | Nullable                 |
| score            | Float        | Điểm đánh giá (0-100)             | Nullable, 0-100          |
| technical_score  | Integer      | Điểm kỹ năng chuyên môn (1-5 sao) | Nullable, 1-5            |
| soft_skill_score | Integer      | Điểm kỹ năng mềm (1-5 sao)        | Nullable, 1-5            |
| attitude_score   | Integer      | Điểm thái độ (1-5 sao)            | Nullable, 1-5            |
| created_at       | DateTime     | Thời gian tạo                     | Auto, Not Null           |
| updated_at       | DateTime     | Thời gian cập nhật                | Auto, Not Null           |

**c) Phương thức:**

| Tên phương thức     | Tham số                                          | Kiểu trả về | Mô tả                            |
| ------------------- | ------------------------------------------------ | ----------- | -------------------------------- |
| submit_evaluation() | score, feedback, technical, soft_skill, attitude | Boolean     | Gửi đánh giá                     |
| is_evaluated()      | -                                                | Boolean     | Kiểm tra đã đánh giá chưa        |
| can_edit()          | user: User                                       | Boolean     | Kiểm tra user có quyền sửa không |

**d) Mối quan hệ:**

- **Many → 1** với Interview: Nhiều người đánh giá 1 buổi PV (Composition - phụ thuộc vòng đời)
- **Many → 1** với User: Nhiều đánh giá từ 1 Interviewer

**e) Quy tắc nghiệp vụ:**

- Một Interviewer chỉ đánh giá 1 lần trong 1 Interview (unique_together: interview, interviewer)
- Chỉ User có role = INTERVIEWER mới được gán vào InterviewPanel
- score là điểm tổng (0-100), các điểm con là 1-5 sao
- Interview.result chỉ được tính khi tất cả InterviewPanel đã có score
- OBSERVER chỉ xem, không chấm điểm (score = null)

---

#### **6. RecruitmentResult (Entity - Kết quả tuyển dụng)**

**a) Thông tin chung:**

- **Tên lớp:** RecruitmentResult
- **Loại lớp:** Entity
- **Vai trò:** Lưu kết quả tuyển dụng cuối cùng (OFFER/REJECT)

**b) Thuộc tính:**

| Tên thuộc tính    | Kiểu dữ liệu | Mô tả                      | Ràng buộc                        |
| ----------------- | ------------ | -------------------------- | -------------------------------- |
| id                | UUID         | Mã định danh               | Primary Key, Not Null            |
| application       | FK (1-1)     | Hồ sơ liên quan            | Not Null, OneToOne → Application |
| final_decision    | Enum         | Quyết định (OFFER, REJECT) | Not Null                         |
| offer_letter_file | File         | File thư mời (nếu OFFER)   | Nullable, Max 10MB               |
| salary            | String       | Mức lương đề nghị          | Nullable, Max 100 ký tự          |
| start_date        | Date         | Ngày bắt đầu làm việc      | Nullable, >= today               |
| notes             | Text         | Ghi chú                    | Nullable                         |
| rejection_reason  | String       | Lý do từ chối (nếu REJECT) | Nullable, Max 500 ký tự          |
| decided_by        | FK           | Người quyết định           | Not Null, FK → User (Recruiter)  |
| decided_at        | DateTime     | Thời gian quyết định       | Auto, Not Null                   |

**c) Phương thức:**

| Tên phương thức     | Tham số                   | Kiểu trả về | Mô tả                        |
| ------------------- | ------------------------- | ----------- | ---------------------------- |
| make_offer()        | salary, start_date, notes | Boolean     | Tạo quyết định OFFER         |
| make_rejection()    | reason, notes             | Boolean     | Tạo quyết định REJECT        |
| send_result_email() | -                         | Boolean     | Gửi email thông báo kết quả  |
| is_offer()          | -                         | Boolean     | Kiểm tra có phải OFFER không |

**d) Mối quan hệ:**

- **1 → 1** với Application: Một hồ sơ có duy nhất 1 kết quả cuối cùng
- **Many → 1** với User: Nhiều kết quả từ 1 Recruiter

**e) Quy tắc nghiệp vụ:**

- Một Application chỉ có tối đa 1 RecruitmentResult (quan hệ 1-1)
- Chỉ Recruiter mới có thể tạo RecruitmentResult
- Nếu final_decision = OFFER, phải có salary và start_date
- Nếu final_decision = REJECT, nên có rejection_reason
- Khi tạo OFFER, Application.status chuyển sang OFFER
- Khi tạo REJECT, Application.status chuyển sang REJECTED
- Hệ thống tự động gửi email thông báo kết quả

---

#### **7. Notification (Entity - Thông báo)**

**a) Thông tin chung:**

- **Tên lớp:** Notification
- **Loại lớp:** Entity
- **Vai trò:** Quản lý thông báo gửi đến người dùng

**b) Thuộc tính:**

| Tên thuộc tính    | Kiểu dữ liệu | Mô tả                                           | Ràng buộc               |
| ----------------- | ------------ | ----------------------------------------------- | ----------------------- |
| id                | UUID         | Mã định danh                                    | Primary Key, Not Null   |
| user              | FK           | Người nhận                                      | Not Null, FK → User     |
| notification_type | Enum         | Loại (EMAIL, SYSTEM)                            | Not Null                |
| title             | String       | Tiêu đề                                         | Not Null, Max 255 ký tự |
| content           | Text         | Nội dung                                        | Not Null                |
| is_read           | Boolean      | Đã đọc chưa                                     | Default: False          |
| related_id        | UUID         | ID đối tượng liên quan                          | Nullable                |
| related_type      | String       | Loại đối tượng (Application, Interview, Job...) | Nullable, Max 50 ký tự  |
| sent_at           | DateTime     | Thời gian gửi                                   | Auto, Not Null          |

**c) Phương thức:**

| Tên phương thức            | Tham số       | Kiểu trả về | Mô tả                                     |
| -------------------------- | ------------- | ----------- | ----------------------------------------- |
| mark_as_read()             | -             | Boolean     | Đánh dấu đã đọc                           |
| mark_all_as_read()         | user: User    | Integer     | Đánh dấu tất cả thông báo của user đã đọc |
| get_unread_count()         | user: User    | Integer     | Đếm số thông báo chưa đọc                 |
| delete_old_notifications() | days: Integer | Integer     | Xóa thông báo cũ hơn N ngày               |

**d) Mối quan hệ:**

- **Many → 1** với User: Nhiều thông báo cho 1 user

**e) Quy tắc nghiệp vụ:**

- Mỗi sự kiện quan trọng tạo thông báo (nộp hồ sơ, mời PV, kết quả...)
- notification_type = SYSTEM: Hiển thị in-app
- notification_type = EMAIL: Đã gửi qua email
- related_id và related_type dùng để link đến đối tượng liên quan
- Tự động xóa thông báo cũ hơn 90 ngày
- Badge thông báo hiển thị số lượng is_read = False

---

#### **8. SavedJob (Entity - Công việc đã lưu)**

**a) Thông tin chung:**

- **Tên lớp:** SavedJob
- **Loại lớp:** Entity
- **Vai trò:** Bảng trung gian Many-to-Many giữa User (Candidate) và Job

**b) Thuộc tính:**

| Tên thuộc tính | Kiểu dữ liệu | Mô tả         | Ràng buộc             |
| -------------- | ------------ | ------------- | --------------------- |
| id             | UUID         | Mã định danh  | Primary Key, Not Null |
| user           | FK           | Candidate     | Not Null, FK → User   |
| job            | FK           | Công việc     | Not Null, FK → Job    |
| saved_at       | DateTime     | Thời gian lưu | Auto, Not Null        |

**c) Phương thức:**

| Tên phương thức  | Tham số   | Kiểu trả về | Mô tả                    |
| ---------------- | --------- | ----------- | ------------------------ |
| save_job()       | user, job | Boolean     | Lưu công việc            |
| unsave_job()     | user, job | Boolean     | Bỏ lưu công việc         |
| is_saved()       | user, job | Boolean     | Kiểm tra đã lưu chưa     |
| get_saved_jobs() | user      | List        | Lấy danh sách job đã lưu |

**d) Mối quan hệ:**

- **\* → 1** với User: Nhiều SavedJob từ 1 Candidate
- **\* → 1** với Job: Nhiều SavedJob cho 1 Job
- **Bảng trung gian Many-to-Many** giữa User và Job

**e) Quy tắc nghiệp vụ:**

- Một User chỉ lưu 1 Job 1 lần (unique_together: user, job)
- Chỉ Candidate mới có thể lưu Job
- Khi Job bị xóa, tự động xóa các SavedJob liên quan (cascade)
- Hiển thị icon trái tim (đã lưu) trên danh sách Job

---

#### **9. RecruitmentProcess (Entity - Quy trình tuyển dụng)**

**a) Thông tin chung:**

- **Tên lớp:** RecruitmentProcess
- **Loại lớp:** Entity
- **Vai trò:** Định nghĩa quy trình tuyển dụng gồm nhiều bước

**b) Thuộc tính:**

| Tên thuộc tính | Kiểu dữ liệu | Mô tả              | Ràng buộc                       |
| -------------- | ------------ | ------------------ | ------------------------------- |
| id             | UUID         | Mã định danh       | Primary Key, Not Null           |
| name           | String       | Tên quy trình      | Not Null, Max 255 ký tự         |
| description    | Text         | Mô tả              | Nullable                        |
| is_default     | Boolean      | Quy trình mặc định | Default: False                  |
| created_by     | FK           | Người tạo          | Not Null, FK → User (Recruiter) |
| created_at     | DateTime     | Thời gian tạo      | Auto, Not Null                  |
| updated_at     | DateTime     | Thời gian cập nhật | Auto, Not Null                  |

**c) Phương thức:**

| Tên phương thức      | Tham số                               | Kiểu trả về | Mô tả                              |
| -------------------- | ------------------------------------- | ----------- | ---------------------------------- |
| add_step()           | name, step_type, order, duration_days | Boolean     | Thêm bước vào quy trình            |
| remove_step()        | step_id                               | Boolean     | Xóa bước khỏi quy trình            |
| set_as_default()     | -                                     | Boolean     | Đặt làm quy trình mặc định         |
| get_total_duration() | -                                     | Integer     | Tính tổng thời gian dự kiến (ngày) |

**d) Mối quan hệ:**

- **1 ◆→ 1..\*** với ProcessStep: Một quy trình bao gồm nhiều bước (Composition)
- **1 → 0..\*** với Job: Một quy trình được áp dụng cho nhiều Job
- **Many → 1** với User: Nhiều quy trình từ 1 Recruiter

**e) Quy tắc nghiệp vụ:**

- Mỗi công ty chỉ có 1 quy trình mặc định (is_default = True)
- Khi xóa RecruitmentProcess, tự động xóa các ProcessStep (cascade)
- Không thể xóa quy trình đang được Job sử dụng
- Quy trình phải có ít nhất 1 bước

---

#### **10. ProcessStep (Entity - Bước quy trình)**

**a) Thông tin chung:**

- **Tên lớp:** ProcessStep
- **Loại lớp:** Entity
- **Vai trò:** Các bước cụ thể trong quy trình tuyển dụng

**b) Thuộc tính:**

| Tên thuộc tính | Kiểu dữ liệu | Mô tả                                                                                     | Ràng buộc                         |
| -------------- | ------------ | ----------------------------------------------------------------------------------------- | --------------------------------- |
| id             | UUID         | Mã định danh                                                                              | Primary Key, Not Null             |
| process        | FK           | Quy trình                                                                                 | Not Null, FK → RecruitmentProcess |
| name           | String       | Tên bước                                                                                  | Not Null, Max 255 ký tự           |
| step_type      | Enum         | Loại bước (SCREENING, PHONE_INTERVIEW, TECHNICAL_TEST, INTERVIEW, FINAL_INTERVIEW, OFFER) | Not Null                          |
| order          | Integer      | Thứ tự bước                                                                               | Not Null, >= 1                    |
| duration_days  | Integer      | Thời gian dự kiến (ngày)                                                                  | Not Null, >= 1                    |
| is_required    | Boolean      | Bắt buộc hay không                                                                        | Default: True                     |
| description    | Text         | Mô tả chi tiết                                                                            | Nullable                          |

**c) Phương thức:**

| Tên phương thức | Tham số | Kiểu trả về | Mô tả                                |
| --------------- | ------- | ----------- | ------------------------------------ |
| move_up()       | -       | Boolean     | Tăng thứ tự bước (lên trên)          |
| move_down()     | -       | Boolean     | Giảm thứ tự bước (xuống dưới)        |
| is_first_step() | -       | Boolean     | Kiểm tra có phải bước đầu tiên không |
| is_last_step()  | -       | Boolean     | Kiểm tra có phải bước cuối không     |

**d) Mối quan hệ:**

- **Many → 1** với RecruitmentProcess: Nhiều bước thuộc 1 quy trình (Composition)

**e) Quy tắc nghiệp vụ:**

- order phải duy nhất trong 1 quy trình (unique_together: process, order)
- Khi thêm bước mới, tự động gán order = max(order) + 1
- Không thể xóa bước cuối cùng của quy trình
- step_type định nghĩa loại bước (SCREENING, INTERVIEW, OFFER...)

---

### 3.1.4 Tổng kết phân tích lớp

#### A. Thống kê tổng quan

**Số lượng lớp:** 35 lớp

- **Entity:** 10 lớp (lưu trữ dữ liệu)
- **Boundary:** 12 lớp (giao diện người dùng)
- **Control:** 13 lớp (xử lý logic nghiệp vụ)

**Số lượng mối quan hệ:** 53 quan hệ

- **Association:** 13 quan hệ
- **Composition:** 2 quan hệ
- **Dependency:** 38 quan hệ

#### B. Đặc điểm thiết kế

✅ **Phân tách rõ ràng:** Theo mô hình EBC (Entity-Boundary-Control)

- Entity: Tập trung vào dữ liệu và trạng thái
- Boundary: Quản lý tương tác với người dùng
- Control: Xử lý logic nghiệp vụ phức tạp

✅ **Tính mở rộng cao:** Dễ dàng thêm tính năng mới

- Thêm step_type mới trong ProcessStep
- Thêm role mới trong User
- Thêm notification_type mới

✅ **Đảm bảo tính toàn vẹn:** Ràng buộc và quy tắc nghiệp vụ rõ ràng

- Unique constraints
- Foreign key constraints
- Business rules validation

✅ **Hỗ trợ truy vấn:** Có index trên các trường thường xuyên tìm kiếm

- User: email, role
- Job: status, deadline, created_by
- Application: (job, status), candidate, ai_score
- Interview: (scheduled_at, status)
- Notification: (user, is_read, created_at)

✅ **Audit trail:** Tất cả Entity đều có created_at và updated_at

#### C. Luồng xử lý chính

**Luồng tuyển dụng hoàn chỉnh:**

```
1. Recruiter tạo Job (QuanLyJob)
   ↓
2. Candidate nộp Application (QuanLyUngTuyen)
   ↓
3. AI tự động sàng lọc (XuLySangLocAI)
   ↓
4. Application.status = SCREENING
   ↓
5. Recruiter duyệt và mời phỏng vấn (QuanLyPhongVan)
   ↓
6. Tạo Interview và InterviewPanel
   ↓
7. Interviewer đánh giá (TinhDiemPhongVan)
   ↓
8. Interview.result = PASS/FAIL
   ↓
9. Recruiter tạo RecruitmentResult (QuanLyKetQuaTuyenDung)
   ↓
10. Gửi email và Notification (GuiEmail, QuanLyThongBao)
```

---

_Document này mô tả đầy đủ phân tích lớp cho Hệ thống Tuyển dụng Nhân sự Thông minh._
