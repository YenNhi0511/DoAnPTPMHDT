# Yêu cầu Hệ thống Tuyển dụng Nhân sự

## A. Yêu cầu Chức năng (Functional Requirements)

### 1. Quản lý Người dùng & Xác thực

| Mã YC | Tên yêu cầu           | Mô tả                                                                    | Độ ưu tiên | Người dùng           |
| ----- | --------------------- | ------------------------------------------------------------------------ | ---------- | -------------------- |
| YC-01 | Đăng ký tài khoản     | Đăng ký với email, mật khẩu, chọn vai trò. Xác thực qua OTP email.       | Cao        | Candidate, Recruiter |
| YC-02 | Đăng nhập/Đăng xuất   | Đăng nhập bằng email/password, cấp JWT token.                            | Cao        | Tất cả               |
| YC-03 | Quản lý hồ sơ cá nhân | Xem và cập nhật thông tin cá nhân, avatar, thông tin công ty.            | Trung bình | Tất cả               |
| YC-04 | Phân quyền người dùng | 4 vai trò: Candidate, Recruiter, Interviewer, Admin với quyền khác nhau. | Cao        | Admin                |

### 2. Quản lý Tin tuyển dụng

| Mã YC | Tên yêu cầu                   | Mô tả                                                                                            | Độ ưu tiên | Người dùng           |
| ----- | ----------------------------- | ------------------------------------------------------------------------------------------------ | ---------- | -------------------- |
| YC-05 | Đăng tin tuyển dụng           | Recruiter tạo tin với tiêu đề, mô tả, yêu cầu, lương, địa điểm. Trạng thái: DRAFT/ACTIVE/CLOSED. | Cao        | Recruiter            |
| YC-06 | Xem & tìm kiếm tin tuyển dụng | Candidate xem tin ACTIVE, tìm kiếm, lọc theo từ khóa, địa điểm, lương. Có phân trang.            | Cao        | Candidate, Recruiter |
| YC-07 | Quản lý tin tuyển dụng        | Recruiter xem, chỉnh sửa, xóa tin của mình. Admin quản lý toàn bộ.                               | Trung bình | Recruiter, Admin     |

### 3. Quản lý Ứng tuyển

| Mã YC | Tên yêu cầu            | Mô tả                                                                                           | Độ ưu tiên | Người dùng |
| ----- | ---------------------- | ----------------------------------------------------------------------------------------------- | ---------- | ---------- |
| YC-08 | Nộp hồ sơ ứng tuyển    | Candidate upload CV (PDF/DOCX), điền thông tin. Hệ thống trích xuất text và gửi email xác nhận. | Cao        | Candidate  |
| YC-09 | Xem hồ sơ đã nộp       | Candidate xem lịch sử hồ sơ với trạng thái: PENDING, SCREENING, INTERVIEW, OFFER, REJECTED.     | Cao        | Candidate  |
| YC-10 | Quản lý hồ sơ ứng viên | Recruiter xem danh sách hồ sơ, lọc theo trạng thái, sắp xếp theo điểm AI, ngày nộp.             | Cao        | Recruiter  |

### 4. Sàng lọc CV bằng AI

| Mã YC | Tên yêu cầu             | Mô tả                                                                | Độ ưu tiên | Người dùng |
| ----- | ----------------------- | -------------------------------------------------------------------- | ---------- | ---------- |
| YC-11 | Tự động sàng lọc CV     | Google Gemini AI phân tích CV, chấm điểm 0-100, đánh giá độ phù hợp. | Cao        | Hệ thống   |
| YC-12 | Xem kết quả sàng lọc AI | Recruiter xem điểm AI, phân tích điểm mạnh/yếu, kỹ năng phù hợp.     | Cao        | Recruiter  |

### 5. Quản lý Phỏng vấn

| Mã YC | Tên yêu cầu              | Mô tả                                                                                                       | Độ ưu tiên | Người dùng             |
| ----- | ------------------------ | ----------------------------------------------------------------------------------------------------------- | ---------- | ---------------------- |
| YC-13 | Mời & tạo lịch phỏng vấn | Recruiter mời ứng viên, tạo lịch với thời gian, địa điểm/link meeting, gán Interviewer.                     | Cao        | Recruiter              |
| YC-14 | Xem lịch phỏng vấn       | Candidate và Interviewer xem lịch được gán với đầy đủ thông tin.                                            | Cao        | Candidate, Interviewer |
| YC-15 | Chấm điểm & kết quả PV   | Interviewer nhập PASS/FAIL, điểm số, feedback. Tính điểm TB nếu có panel. Tự động tạo OFFER nếu đạt ngưỡng. | Cao        | Interviewer, Hệ thống  |

### 6. Quản lý Kết quả Tuyển dụng

| Mã YC | Tên yêu cầu                 | Mô tả                                                                                      | Độ ưu tiên | Người dùng          |
| ----- | --------------------------- | ------------------------------------------------------------------------------------------ | ---------- | ------------------- |
| YC-16 | Tạo & gửi kết quả           | Recruiter hoặc hệ thống tự động tạo OFFER/REJECT. Gửi email thông báo kèm thông tin offer. | Cao        | Recruiter, Hệ thống |
| YC-17 | Tự động cập nhật trạng thái | Đồng bộ trạng thái hồ sơ: OFFER → status OFFER, REJECT → REJECTED.                         | Cao        | Hệ thống            |

### 7. Thông báo

| Mã YC | Tên yêu cầu       | Mô tả                                                                                                                 | Độ ưu tiên | Người dùng |
| ----- | ----------------- | --------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- |
| YC-18 | Thông báo & Email | Hệ thống tạo notification và gửi email cho các sự kiện: nộp hồ sơ, kết quả sàng lọc, lịch PV, kết quả PV, kết quả TD. | Cao        | Tất cả     |
| YC-19 | Quản lý thông báo | Xem danh sách thông báo, đánh dấu đã đọc. Badge số lượng real-time.                                                   | Trung bình | Tất cả     |

### 8. Quản trị hệ thống

| Mã YC | Tên yêu cầu                   | Mô tả                                                                                            | Độ ưu tiên | Người dùng |
| ----- | ----------------------------- | ------------------------------------------------------------------------------------------------ | ---------- | ---------- |
| YC-20 | Quản lý người dùng            | Admin xem, chỉnh sửa, khóa/mở khóa tài khoản. Lọc theo vai trò, trạng thái.                      | Cao        | Admin      |
| YC-21 | Dashboard & Thống kê          | Admin xem tổng quan: số người dùng, tin TD, hồ sơ, PV, tỷ lệ thành công. Biểu đồ theo thời gian. | Trung bình | Admin      |
| YC-22 | Quản lý tin TD & Log hệ thống | Admin quản lý toàn bộ tin TD, xem log hoạt động (đăng nhập, CRUD, email, lỗi).                   | Trung bình | Admin      |

---

## B. Yêu cầu Phi chức năng (Non-Functional Requirements)

### 1. Hiệu năng (Performance)

| Mã YC  | Tên yêu cầu              | Mô tả                                                                                                                                                                | Độ ưu tiên | Người dùng |
| ------ | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- |
| NFR-01 | Thời gian tải trang      | Trang web phải tải xong trong vòng 2 giây với kết nối internet tốc độ trung bình (4G/Wifi). Trang chủ và danh sách công việc ưu tiên tối ưu.                         | Cao        | Tất cả     |
| NFR-02 | Thời gian phản hồi API   | API phải phản hồi trong vòng 500ms đối với các request đơn giản (list, detail). Request phức tạp (AI screening, upload file) tối đa 5 giây.                          | Cao        | Backend    |
| NFR-03 | Khả năng xử lý đồng thời | Hệ thống phải xử lý được ít nhất 100 request/giây đồng thời mà không bị giảm hiệu năng đáng kể. Database connection pool tối thiểu 20 connections.                   | Trung bình | Hệ thống   |
| NFR-04 | Tối ưu truy vấn database | Tất cả truy vấn database phải được tối ưu với index phù hợp. Các truy vấn phức tạp (join nhiều bảng) không được quá 200ms. Sử dụng eager loading để tránh N+1 query. | Cao        | Backend    |
| NFR-05 | Tối ưu AI screening      | Việc sàng lọc CV bằng AI không được làm chậm trải nghiệm người dùng. Chạy background task (Celery) để xử lý bất đồng bộ. Kết quả trả về trong vòng 3-5 giây.         | Cao        | Hệ thống   |
| NFR-06 | Tối ưu upload file       | Upload CV (5-10MB) phải hoàn thành trong vòng 5 giây. Hỗ trợ upload progress bar. Tự động compress file nếu quá lớn (>10MB).                                         | Trung bình | Backend    |
| NFR-07 | Caching                  | Sử dụng Redis để cache dữ liệu thường xuyên truy cập: danh sách công việc ACTIVE, user profile, notifications. TTL: 5-10 phút.                                       | Trung bình | Backend    |
| NFR-08 | Phân trang               | Tất cả danh sách dài phải có phân trang. Mỗi trang tối đa 20 items. Hỗ trợ infinite scroll hoặc pagination buttons.                                                  | Cao        | Frontend   |

### 2. Bảo mật (Security)

| Mã YC  | Tên yêu cầu           | Mô tả                                                                                                                                                            | Độ ưu tiên | Người dùng |
| ------ | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- |
| NFR-09 | Mã hóa mật khẩu       | Tất cả mật khẩu phải được hash bằng bcrypt hoặc PBKDF2 với salt ngẫu nhiên trước khi lưu database. Không lưu plain text dưới bất kỳ hình thức nào.               | Cao        | Backend    |
| NFR-10 | Xác thực JWT          | Sử dụng JWT (JSON Web Token) để xác thực người dùng. Access token hết hạn sau 24h, refresh token sau 7 ngày. Token phải được ký bằng secret key an toàn.         | Cao        | Backend    |
| NFR-11 | Phân quyền API        | Tất cả API endpoint phải kiểm tra quyền truy cập. Chỉ cho phép user truy cập dữ liệu của mình. Admin có quyền cao nhất. Trả về 403 Forbidden nếu không đủ quyền. | Cao        | Backend    |
| NFR-12 | Validate input        | Tất cả input từ người dùng phải được validate kỹ càng (frontend + backend). Chặn SQL injection, XSS, CSRF attacks. Sử dụng Django REST Framework serializers.    | Cao        | Backend    |
| NFR-13 | HTTPS                 | Sử dụng HTTPS cho tất cả kết nối trong production. Chứng chỉ SSL/TLS hợp lệ. Không cho phép HTTP plain text khi deploy.                                          | Cao        | DevOps     |
| NFR-14 | CORS                  | Cấu hình CORS (Cross-Origin Resource Sharing) chặt chẽ. Chỉ cho phép frontend domain (localhost:3000 dev, production domain) gọi API.                            | Cao        | Backend    |
| NFR-15 | Rate limiting         | Giới hạn số lượng request từ cùng một IP: 100 request/phút cho API thông thường, 5 request/phút cho login/register để chống brute force.                         | Trung bình | Backend    |
| NFR-16 | Bảo mật file upload   | Kiểm tra loại file upload (chỉ cho phép PDF, DOCX). Scan virus/malware trước khi lưu. Lưu file với tên ngẫu nhiên để tránh path traversal attack.                | Cao        | Backend    |
| NFR-17 | Environment variables | Tất cả thông tin nhạy cảm (secret key, database password, API keys) phải lưu trong .env file, không commit lên Git. Sử dụng python-dotenv để load.               | Cao        | DevOps     |
| NFR-18 | OTP security          | Mã OTP phải random 6 chữ số, hết hạn sau 10 phút, giới hạn 5 lần thử sai. Sau 5 lần sai phải đợi 15 phút hoặc request OTP mới.                                   | Cao        | Backend    |

### 3. Khả năng mở rộng (Scalability)

| Mã YC  | Tên yêu cầu                   | Mô tả                                                                                                                                                     | Độ ưu tiên | Người dùng |
| ------ | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- |
| NFR-19 | Kiến trúc microservices-ready | Code được tổ chức theo module rõ ràng (accounts, jobs, applications, interviews). Dễ dàng tách thành microservices riêng biệt trong tương lai nếu cần.    | Thấp       | Backend    |
| NFR-20 | Database scaling              | Sử dụng PostgreSQL với khả năng scale theo chiều ngang (sharding) hoặc chiều dọc (vertical scaling). Chuẩn bị sẵn cho việc migrate sang database cluster. | Thấp       | DevOps     |
| NFR-21 | Static file CDN               | Tất cả file tĩnh (CSS, JS, images) có thể deploy lên CDN (Cloudflare, AWS CloudFront) để giảm tải cho server và tăng tốc độ tải trang toàn cầu.           | Thấp       | DevOps     |
| NFR-22 | Background job queue          | Sử dụng Celery + Redis để xử lý background tasks (AI screening, send email). Có thể thêm nhiều worker khi traffic tăng.                                   | Trung bình | Backend    |
| NFR-23 | Load balancing ready          | Code không lưu session state trên server (stateless). Sẵn sàng để deploy nhiều instance phía sau load balancer (Nginx, HAProxy).                          | Thấp       | DevOps     |

### 4. Khả năng sử dụng (Usability)

| Mã YC  | Tên yêu cầu           | Mô tả                                                                                                                                         | Độ ưu tiên | Người dùng |
| ------ | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- |
| NFR-24 | Giao diện thân thiện  | UI/UX đơn giản, trực quan, dễ sử dụng. Tuân thủ nguyên tắc thiết kế Material Design hoặc Bootstrap. Menu navigation rõ ràng.                  | Cao        | Frontend   |
| NFR-25 | Responsive design     | Giao diện phải responsive trên tất cả thiết bị: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667). Tự động điều chỉnh layout.          | Cao        | Frontend   |
| NFR-26 | Thông báo lỗi rõ ràng | Khi có lỗi, hiển thị thông báo rõ ràng bằng tiếng Việt, hướng dẫn người dùng cách khắc phục. Không hiển thị stack trace hoặc technical error. | Cao        | Frontend   |
| NFR-27 | Loading indicators    | Hiển thị loading spinner/skeleton khi đang tải dữ liệu. Không để người dùng chờ mà không biết chuyện gì đang xảy ra.                          | Cao        | Frontend   |
| NFR-28 | Confirmation dialogs  | Các hành động quan trọng (xóa, rút hồ sơ, từ chối ứng viên) phải có dialog xác nhận "Bạn có chắc chắn?" để tránh thao tác nhầm.               | Trung bình | Frontend   |
| NFR-29 | Accessibility (A11y)  | Hỗ trợ keyboard navigation (Tab, Enter, Esc). Có alt text cho images. Color contrast đạt chuẩn WCAG 2.1 AA. Hỗ trợ screen reader cơ bản.      | Thấp       | Frontend   |
| NFR-30 | Tiếng Việt            | Toàn bộ giao diện và nội dung phải bằng tiếng Việt. Format ngày tháng theo chuẩn Việt Nam (dd/mm/yyyy). Format số tiền: 1.000.000 ₫.          | Cao        | Frontend   |

### 5. Độ tin cậy (Reliability)

| Mã YC  | Tên yêu cầu             | Mô tả                                                                                                                                                        | Độ ưu tiên | Người dùng |
| ------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ---------- |
| NFR-31 | Uptime 99.5%            | Hệ thống phải đảm bảo hoạt động ít nhất 99.5% thời gian trong tháng (downtime tối đa ~3.6 giờ/tháng). Scheduled maintenance thông báo trước 24h.             | Trung bình | DevOps     |
| NFR-32 | Error handling          | Tất cả exception phải được catch và handle đúng cách. Trả về HTTP status code phù hợp. Log error chi tiết để debug.                                          | Cao        | Backend    |
| NFR-33 | Database backup         | Database phải được backup tự động mỗi ngày (daily backup). Lưu trữ ít nhất 7 bản backup gần nhất. Test khôi phục backup định kỳ.                             | Cao        | DevOps     |
| NFR-34 | Transaction integrity   | Các thao tác quan trọng (tạo hồ sơ + gửi email, cập nhật kết quả + gửi notification) phải được thực hiện trong transaction để đảm bảo tính toàn vẹn dữ liệu. | Cao        | Backend    |
| NFR-35 | Graceful degradation    | Khi một service bị lỗi (ví dụ: AI không hoạt động), hệ thống vẫn cho phép các chức năng khác hoạt động bình thường. Hiển thị thông báo lỗi rõ ràng.          | Trung bình | Backend    |
| NFR-36 | Email delivery fallback | Hệ thống gửi email qua API (Resend primary, SendGrid fallback). Nếu cả 2 lỗi, lưu email vào queue để gửi lại sau. Đảm bảo không bị mất email quan trọng.     | Cao        | Backend    |

### 6. Khả năng bảo trì (Maintainability)

| Mã YC  | Tên yêu cầu       | Mô tả                                                                                                                                                               | Độ ưu tiên | Người dùng |
| ------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- |
| NFR-37 | Code structure    | Code được tổ chức theo chuẩn Django (apps, models, views, serializers). Frontend theo React best practices (components, hooks, context). Dễ dọc, dễ tìm.            | Cao        | Developer  |
| NFR-38 | Code comments     | Các hàm phức tạp phải có docstring giải thích input, output, logic. Comment bằng tiếng Việt hoặc tiếng Anh. Tránh comment dư thừa.                                  | Trung bình | Developer  |
| NFR-39 | Naming convention | Biến, hàm, class đặt tên rõ ràng, có ý nghĩa. Python: snake_case. JavaScript: camelCase. Class: PascalCase. Tránh tên viết tắt khó hiểu.                            | Cao        | Developer  |
| NFR-40 | Git workflow      | Sử dụng Git cho version control. Commit message rõ ràng (feat:, fix:, docs:). Branch cho mỗi feature/bugfix. Pull request trước khi merge vào main.                 | Cao        | Developer  |
| NFR-41 | Documentation     | Có file README.md hướng dẫn setup project. API documentation tự động bằng Swagger/OpenAPI. Document các quy trình nghiệp vụ phức tạp.                               | Cao        | Developer  |
| NFR-42 | Logging           | Log tất cả events quan trọng: user actions, API calls, errors, AI screening results. Sử dụng Python logging module với level phù hợp (DEBUG, INFO, WARNING, ERROR). | Cao        | Backend    |
| NFR-43 | Automated testing | Viết unit tests cho các hàm quan trọng. Integration tests cho API endpoints. Target: test coverage ≥ 60%. Chạy tests trước khi merge PR.                            | Thấp       | Developer  |

### 7. Tương thích (Compatibility)

| Mã YC  | Tên yêu cầu      | Mô tả                                                                                                                             | Độ ưu tiên | Người dùng |
| ------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- |
| NFR-44 | Browser support  | Hỗ trợ các trình duyệt phổ biến: Chrome 100+, Firefox 100+, Safari 15+, Edge 100+. Test trên cả Windows và macOS.                 | Cao        | Frontend   |
| NFR-45 | Mobile browser   | Giao diện mobile hoạt động tốt trên Chrome Mobile (Android) và Safari Mobile (iOS). Touch gestures hoạt động mượt mà.             | Cao        | Frontend   |
| NFR-46 | Python version   | Backend chạy trên Python 3.10+ (tương thích với Django 5.0). Không sử dụng features chỉ có ở Python 3.12+ để đảm bảo tương thích. | Trung bình | Backend    |
| NFR-47 | Database version | Sử dụng PostgreSQL 14+. Tránh dùng features chỉ có ở phiên bản mới nhất để dễ dàng deploy trên nhiều hosting provider.            | Trung bình | Backend    |

### 8. Legal & Compliance

| Mã YC  | Tên yêu cầu      | Mô tả                                                                                                                                         | Độ ưu tiên | Người dùng |
| ------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- |
| NFR-48 | Privacy policy   | Có trang Privacy Policy giải thích cách thu thập, sử dụng, lưu trữ dữ liệu cá nhân. Tuân thủ quy định bảo vệ dữ liệu cá nhân Việt Nam.        | Thấp       | Legal      |
| NFR-49 | Terms of service | Có trang Terms of Service quy định quyền và trách nhiệm của người dùng, công ty. Người dùng phải đồng ý terms khi đăng ký.                    | Thấp       | Legal      |
| NFR-50 | GDPR compliance  | Cho phép người dùng xem, xuất, xóa dữ liệu cá nhân của mình (nếu triển khai ra thị trường quốc tế). Có consent checkbox khi thu thập dữ liệu. | Thấp       | Legal      |

---

**Tổng số yêu cầu**: 50 yêu cầu (40 chức năng + 50 phi chức năng)

**Phân loại độ ưu tiên**:

- **Cao**: 38 yêu cầu (phải có trong MVP)
- **Trung bình**: 24 yêu cầu (nên có trong version 1.0)
- **Thấp**: 18 yêu cầu (có thể phát triển sau)

---

_Lưu ý: Document này là yêu cầu chi tiết của hệ thống tuyển dụng. Các yêu cầu có thể được điều chỉnh trong quá trình phát triển dựa trên feedback từ stakeholders và users._
