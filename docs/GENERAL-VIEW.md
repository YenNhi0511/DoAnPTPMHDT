# CÁI NHÌN TỔNG QUAN VỀ HỆ THỐNG

## (General View of the System)

**Đề tài:** Xây dựng Hệ thống Tuyển dụng Nhân sự

---

## 1. Tầm nhìn (Vision)

Hệ thống Tuyển dụng Nhân sự là một nền tảng web toàn diện được phát triển nhằm số hóa và tự động hóa quy trình tuyển dụng cho doanh nghiệp. Hệ thống cho phép nhà tuyển dụng đăng tin tuyển dụng, tiếp nhận hồ sơ ứng viên trực tuyến, sử dụng trí tuệ nhân tạo (AI) để sàng lọc và chấm điểm CV tự động, quản lý lịch phỏng vấn với hội đồng đánh giá, và gửi thông báo kết quả cho ứng viên qua email.

Với việc tích hợp công nghệ AI (Google Gemini), hệ thống giúp giảm đáng kể thời gian sàng lọc CV thủ công, tăng tính khách quan trong đánh giá ứng viên, đồng thời mang lại trải nghiệm chuyên nghiệp và minh bạch cho cả nhà tuyển dụng lẫn ứng viên trong suốt quy trình tuyển dụng.

---

## 2. Tuyên bố Phạm vi (Scope Declaration)

### 2.1. Phạm vi bao gồm (In Scope)

Hệ thống được xây dựng với các chức năng chính sau:

- **Quản lý tài khoản và phân quyền:** Hỗ trợ đăng ký, đăng nhập và phân quyền cho 4 vai trò người dùng gồm Quản trị viên (Admin), Nhà tuyển dụng (Recruiter), Người phỏng vấn (Interviewer) và Ứng viên (Candidate).

- **Quản lý tin tuyển dụng:** Cho phép tạo mới, chỉnh sửa, đăng tải và đóng các tin tuyển dụng với đầy đủ thông tin về vị trí, yêu cầu, mức lương và hạn nộp hồ sơ.

- **Quản lý hồ sơ ứng viên:** Ứng viên có thể tải lên CV (định dạng PDF hoặc DOCX), theo dõi trạng thái hồ sơ trong suốt quy trình xét tuyển.

- **Sàng lọc CV bằng AI:** Tích hợp Google Gemini API để tự động phân tích nội dung CV, đánh giá mức độ phù hợp với yêu cầu công việc và cho điểm ứng viên.

- **Quản lý phỏng vấn:** Hỗ trợ lên lịch phỏng vấn, phân công hội đồng phỏng vấn gồm nhiều thành viên, ghi nhận điểm đánh giá và nhận xét của từng người phỏng vấn.

- **Thông báo tự động qua email:** Gửi email thông báo đến ứng viên khi có thay đổi trạng thái hồ sơ, lịch phỏng vấn hoặc kết quả tuyển dụng.

- **Dashboard và báo cáo:** Cung cấp giao diện tổng quan với các biểu đồ thống kê về số lượng ứng viên, tỷ lệ chuyển đổi qua các vòng và hiệu quả tuyển dụng.

### 2.2. Phạm vi không bao gồm (Out of Scope)

Trong phiên bản hiện tại, hệ thống không bao gồm các chức năng sau:

- Quản lý nhân sự sau khi tuyển dụng (chấm công, tính lương, đánh giá hiệu suất làm việc)
- Phỏng vấn trực tuyến qua video call
- Ứng dụng di động native (iOS/Android)
- Tích hợp đăng tin lên các nền tảng mạng xã hội (LinkedIn, Facebook)
- Xác minh lý lịch và bằng cấp ứng viên (background check)
- Tính năng thanh toán hoặc thu phí từ ứng viên

---

## 3. Các Ràng buộc (Constraints)

Hệ thống được phát triển với các ràng buộc kỹ thuật và nghiệp vụ sau:

- **Nền tảng truy cập:** Hệ thống chỉ hoạt động trên trình duyệt web (hỗ trợ Chrome, Firefox, Edge, Safari phiên bản mới nhất), chưa có ứng dụng di động.

- **Ngôn ngữ giao diện:** Giao diện chính bằng tiếng Việt, có hỗ trợ tiếng Anh cho một số thành phần.

- **Định dạng CV:** Chỉ chấp nhận file CV định dạng PDF hoặc DOCX với dung lượng tối đa 10MB.

- **Giới hạn AI:** Sử dụng Google Gemini API phiên bản miễn phí với giới hạn 60 requests/phút.

- **Dịch vụ email:** Gửi email thông qua Gmail SMTP, yêu cầu cấu hình App Password.

- **Cơ sở dữ liệu:** Sử dụng PostgreSQL được host trên nền tảng Neon (cloud database).

- **Kiến trúc đơn tenant:** Phiên bản đầu tiên chưa hỗ trợ multi-tenant (nhiều công ty trên cùng một hệ thống).

---

## 4. Tiêu chí Chấp nhận (Acceptance Criteria)

Hệ thống được coi là hoàn thành khi đáp ứng các tiêu chí định lượng sau:

- **Hiệu suất:** Thời gian phản hồi của mọi thao tác không vượt quá 2 giây; thời gian sàng lọc CV bằng AI không quá 30 giây cho mỗi hồ sơ.

- **Khả năng chịu tải:** Hệ thống hoạt động ổn định với ít nhất 100 người dùng truy cập đồng thời.

- **Độ sẵn sàng:** Đảm bảo uptime tối thiểu 99% trong giờ làm việc (8h-18h các ngày trong tuần).

- **Tỷ lệ gửi email:** Đạt tối thiểu 95% email được gửi thành công đến hộp thư ứng viên.

- **Độ chính xác AI:** Kết quả đánh giá của AI đạt độ tương đồng tối thiểu 80% so với đánh giá thủ công của nhà tuyển dụng.

- **Giao diện responsive:** Hiển thị và hoạt động tốt trên các thiết bị có độ rộng màn hình từ 320px (điện thoại) đến 1920px (màn hình desktop).

- **Bảo mật:** Áp dụng xác thực JWT (JSON Web Token), mã hóa mật khẩu bằng thuật toán bcrypt, và phân quyền truy cập theo vai trò (RBAC).

---

## 5. Công nghệ sử dụng

Hệ thống được xây dựng trên nền tảng công nghệ hiện đại:

- **Backend:** Django 5.0 với Django REST Framework để xây dựng API, Celery để xử lý tác vụ nền (background tasks).

- **Frontend:** React 18 kết hợp Tailwind CSS cho giao diện người dùng, Axios để gọi API.

- **Cơ sở dữ liệu:** PostgreSQL được triển khai trên Neon (dịch vụ cloud database).

- **Trí tuệ nhân tạo:** Tích hợp Google Gemini API cho chức năng phân tích và chấm điểm CV.

- **Dịch vụ email:** Gmail SMTP để gửi thông báo tự động.

- **Cache và hàng đợi:** Redis làm message broker cho Celery.

---

_Tài liệu này trình bày cái nhìn tổng quan về phạm vi, ràng buộc và tiêu chí chấp nhận của hệ thống. Thông tin chi tiết về yêu cầu chức năng, phi chức năng và thiết kế kỹ thuật được trình bày trong các tài liệu YC-01 đến YC-06._
