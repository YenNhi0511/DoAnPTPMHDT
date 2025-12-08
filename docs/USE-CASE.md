# Use Case - Hệ thống Tuyển dụng Nhân sự

## 2.1. Mô hình Use Case (Use Case Diagram)

### Sơ đồ tổng quan hệ thống

```
                                    HỆ THỐNG TUYỂN DỤNG NHÂN SỰ

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│  CANDIDATE (Ứng viên)           RECRUITER (Nhà tuyển dụng)                     │
│  ┌──────────┐                   ┌──────────┐                                   │
│  │          │                   │          │                                   │
│  │    👤    │                   │    👤    │                                   │
│  │          │                   │          │                                   │
│  └────┬─────┘                   └────┬─────┘                                   │
│       │                              │                                         │
│       │  ┌────────────────────┐      │  ┌────────────────────────┐             │
│       ├──│ Đăng ký/Đăng nhập  │──────┼──│  Đăng ký/Đăng nhập     │             │
│       │  └────────────────────┘      │  └────────────────────────┘             │
│       │                              │                                         │
│       │  ┌────────────────────┐      │  ┌────────────────────────┐             │
│       ├──│ Xem tin tuyển dụng │      │  │  Đăng tin tuyển dụng   │             │
│       │  └────────────────────┘      │  └────────────────────────┘             │
│       │                              │                                         │
│       │  ┌────────────────────┐      │  ┌────────────────────────┐             │
│       ├──│ Tìm kiếm công việc │      │  │  Quản lý tin tuyển dụng│             │
│       │  └────────────────────┘      │  └────────────────────────┘             │
│       │                              │                                         │
│       │  ┌────────────────────┐      │  ┌────────────────────────┐             │
│       ├──│ Nộp hồ sơ ứng tuyển│      │  │  Xem hồ sơ ứng viên    │             │
│       │  └────────────────────┘      │  └───────────┬────────────┘             │
│       │                              │              │                          │
│       │  ┌────────────────────┐      │  ┌───────────▼────────────┐             │
│       ├──│ Xem trạng thái hồ sơ│     │  │  Mời phỏng vấn         │             │
│       │  └────────────────────┘      │  └────────────────────────┘             │
│       │                              │                                         │
│       │  ┌────────────────────┐      │  ┌────────────────────────┐             │
│       ├──│ Xem lịch phỏng vấn │      ├──│  Tạo lịch phỏng vấn    │             │
│       │  └────────────────────┘      │  └────────────────────────┘             │
│       │                              │                                         │
│       │  ┌────────────────────┐      │  ┌────────────────────────┐             │
│       └──│ Xem thông báo      │      ├──│  Gửi kết quả tuyển dụng│             │
│          └────────────────────┘      │  └────────────────────────┘             │
│                                      │                                         │
│  INTERVIEWER (Người PV)              │  ┌────────────────────────┐             │
│  ┌──────────┐                        └──│  Xem thống kê          │             │
│  │          │                           └────────────────────────┘             │
│  │    👤    │                                                                   │
│  │          │                    ADMIN (Quản trị viên)                         │
│  └────┬─────┘                    ┌──────────┐                                 │
│       │                          │          │                                 │
│       │  ┌────────────────────┐  │    👤    │                                 │
│       ├──│ Xem lịch phỏng vấn │  │          │                                 │
│       │  └────────────────────┘  └────┬─────┘                                 │
│       │                               │                                       │
│       │  ┌────────────────────┐       │  ┌────────────────────────┐           │
│       └──│ Chấm điểm ứng viên │       ├──│  Quản lý người dùng    │           │
│          └────────────────────┘       │  └────────────────────────┘           │
│                                       │                                       │
│          ┌────────────────────┐       │  ┌────────────────────────┐           │
│          │  AI System (Gemini)│◄──────┼──│  Quản lý hệ thống      │           │
│          │                    │       │  └────────────────────────┘           │
│          │  🤖 Sàng lọc CV    │       │                                       │
│          │                    │       │  ┌────────────────────────┐           │
│          └────────────────────┘       └──│  Xem báo cáo thống kê  │           │
│                                          └────────────────────────┘           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Mối quan hệ giữa các Use Case

**Include (bao gồm):**

- `Nộp hồ sơ` **include** `Upload CV`
- `Nộp hồ sơ` **include** `Xác thực người dùng`
- `Đăng tin tuyển dụng` **include** `Xác thực Recruiter`
- `Tạo lịch phỏng vấn` **include** `Gửi email thông báo`

**Extend (mở rộng):**

- `Xem hồ sơ ứng viên` **extend** `Chạy sàng lọc AI`
- `Nộp hồ sơ` **extend** `Tự động sàng lọc CV`
- `Chấm điểm ứng viên` **extend** `Tự động tạo kết quả OFFER`

**Generalization (kế thừa):**

- `Đăng ký Candidate` và `Đăng ký Recruiter` kế thừa `Đăng ký tài khoản`
- `Xem tin tuyển dụng` được kế thừa bởi cả Candidate và Recruiter

---

## 2.2. Danh sách các Actor (Tác nhân)

| STT | Actor                               | Mô tả                                            | Quyền hạn                                                                                                                                                               |
| --- | ----------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Candidate (Ứng viên)**            | Người tìm việc và nộp hồ sơ ứng tuyển            | - Xem và tìm kiếm công việc<br>- Nộp hồ sơ ứng tuyển<br>- Xem trạng thái hồ sơ<br>- Xem lịch phỏng vấn<br>- Nhận thông báo và email                                     |
| 2   | **Recruiter (Nhà tuyển dụng)**      | Người đại diện công ty đăng tin và tuyển dụng    | - Đăng và quản lý tin tuyển dụng<br>- Xem và quản lý hồ sơ ứng viên<br>- Mời phỏng vấn<br>- Tạo lịch phỏng vấn<br>- Gửi kết quả tuyển dụng<br>- Xem thống kê tuyển dụng |
| 3   | **Interviewer (Người phỏng vấn)**   | Người được gán để phỏng vấn và đánh giá ứng viên | - Xem lịch phỏng vấn được gán<br>- Xem thông tin ứng viên<br>- Chấm điểm và nhập feedback<br>- Cập nhật kết quả phỏng vấn                                               |
| 4   | **Admin (Quản trị viên)**           | Người quản lý toàn bộ hệ thống                   | - Quản lý tất cả người dùng<br>- Quản lý tất cả tin tuyển dụng<br>- Xem dashboard tổng quan<br>- Xuất báo cáo thống kê<br>- Xem log hệ thống<br>- Quyền cao nhất        |
| 5   | **AI System (Google Gemini)**       | Hệ thống AI tự động sàng lọc CV                  | - Phân tích CV tự động<br>- Chấm điểm độ phù hợp<br>- Tạo báo cáo sàng lọc                                                                                              |
| 6   | **Email Service (Resend/SendGrid)** | Dịch vụ gửi email tự động                        | - Gửi email xác thực<br>- Gửi email thông báo<br>- Gửi email kết quả                                                                                                    |
| 7   | **Database System**                 | Hệ thống lưu trữ dữ liệu (PostgreSQL)            | - Lưu trữ và truy xuất dữ liệu<br>- Đảm bảo tính toàn vẹn                                                                                                               |

---

## 2.3. Danh sách các Use Case

### Nhóm 1: Quản lý Tài khoản và Xác thực (4 UC)

| Mã UC | Tên Use Case          | Actor                | Mô tả ngắn                                      | Độ ưu tiên |
| ----- | --------------------- | -------------------- | ----------------------------------------------- | ---------- |
| UC-01 | Đăng ký và xác thực   | Candidate, Recruiter | Đăng ký tài khoản mới và xác thực bằng OTP      | Cao        |
| UC-02 | Đăng nhập             | Tất cả               | Đăng nhập vào hệ thống bằng email và mật khẩu   | Cao        |
| UC-03 | Đăng xuất             | Tất cả               | Đăng xuất khỏi hệ thống                         | Cao        |
| UC-04 | Quản lý hồ sơ cá nhân | Tất cả               | Xem, cập nhật thông tin cá nhân và đổi mật khẩu | Trung bình |

### Nhóm 2: Quản lý Tin tuyển dụng (5 UC)

| Mã UC | Tên Use Case              | Actor                | Mô tả ngắn                                    | Độ ưu tiên |
| ----- | ------------------------- | -------------------- | --------------------------------------------- | ---------- |
| UC-05 | Đăng tin tuyển dụng       | Recruiter            | Tạo tin tuyển dụng mới với đầy đủ thông tin   | Cao        |
| UC-06 | Xem và tìm kiếm công việc | Candidate, Recruiter | Xem danh sách, tìm kiếm và lọc tin tuyển dụng | Cao        |
| UC-07 | Xem chi tiết công việc    | Candidate, Recruiter | Xem thông tin chi tiết một tin tuyển dụng     | Cao        |
| UC-08 | Chỉnh sửa tin tuyển dụng  | Recruiter            | Cập nhật thông tin tin tuyển dụng             | Trung bình |
| UC-09 | Quản lý trạng thái tin    | Recruiter            | Đóng/Mở/Xóa tin tuyển dụng                    | Trung bình |

### Nhóm 3: Quản lý Ứng tuyển (5 UC)

| Mã UC | Tên Use Case           | Actor                | Mô tả ngắn                                         | Độ ưu tiên |
| ----- | ---------------------- | -------------------- | -------------------------------------------------- | ---------- |
| UC-10 | Nộp hồ sơ ứng tuyển    | Candidate            | Upload CV và thông tin để ứng tuyển                | Cao        |
| UC-11 | Xem hồ sơ đã nộp       | Candidate            | Xem lịch sử và trạng thái tất cả hồ sơ đã nộp      | Cao        |
| UC-12 | Xem danh sách ứng viên | Recruiter            | Xem, lọc, sắp xếp hồ sơ ứng tuyển vào tin của mình | Cao        |
| UC-13 | Xem chi tiết hồ sơ     | Candidate, Recruiter | Xem thông tin chi tiết hồ sơ và tải CV             | Cao        |
| UC-14 | Rút hồ sơ ứng tuyển    | Candidate            | Hủy hồ sơ đã nộp (nếu chưa qua phỏng vấn)          | Thấp       |

### Nhóm 4: Sàng lọc AI (2 UC)

| Mã UC | Tên Use Case                | Actor     | Mô tả ngắn                                        | Độ ưu tiên |
| ----- | --------------------------- | --------- | ------------------------------------------------- | ---------- |
| UC-15 | Tự động sàng lọc CV bằng AI | AI System | AI tự động phân tích, chấm điểm và đánh giá CV    | Cao        |
| UC-16 | Xem kết quả sàng lọc AI     | Recruiter | Xem điểm, phân tích chi tiết và chạy lại sàng lọc | Cao        |

### Nhóm 5: Quản lý Phỏng vấn (4 UC)

| Mã UC | Tên Use Case                | Actor                  | Mô tả ngắn                                    | Độ ưu tiên |
| ----- | --------------------------- | ---------------------- | --------------------------------------------- | ---------- |
| UC-17 | Tạo và mời phỏng vấn        | Recruiter              | Tạo lịch phỏng vấn và gửi email mời ứng viên  | Cao        |
| UC-18 | Xem lịch phỏng vấn          | Candidate, Interviewer | Xem danh sách các buổi phỏng vấn của mình     | Cao        |
| UC-19 | Đánh giá phỏng vấn          | Interviewer            | Chấm điểm, nhập feedback và cập nhật kết quả  | Cao        |
| UC-20 | Gửi email kết quả phỏng vấn | Hệ thống               | Tự động gửi email thông báo kết quả phỏng vấn | Cao        |

### Nhóm 6: Quản lý Kết quả Tuyển dụng (2 UC)

| Mã UC | Tên Use Case                  | Actor               | Mô tả ngắn                                       | Độ ưu tiên |
| ----- | ----------------------------- | ------------------- | ------------------------------------------------ | ---------- |
| UC-21 | Tạo và gửi kết quả tuyển dụng | Recruiter, Hệ thống | Tạo quyết định OFFER/REJECT và gửi email tự động | Cao        |
| UC-22 | Xem lịch sử quyết định        | Recruiter, Admin    | Xem lịch sử tất cả quyết định tuyển dụng         | Trung bình |

### Nhóm 7: Thông báo (1 UC)

| Mã UC | Tên Use Case       | Actor  | Mô tả ngắn                                              | Độ ưu tiên |
| ----- | ------------------ | ------ | ------------------------------------------------------- | ---------- |
| UC-23 | Hệ thống thông báo | Tất cả | Xem, đánh dấu đã đọc và nhận thông báo qua email/in-app | Cao        |

### Nhóm 8: Quản trị Hệ thống (2 UC)

| Mã UC | Tên Use Case         | Admin | Mô tả ngắn                                         | Độ ưu tiên |
| ----- | -------------------- | ----- | -------------------------------------------------- | ---------- |
| UC-24 | Quản lý người dùng   | Admin | Xem, chỉnh sửa, khóa/mở khóa người dùng và công ty | Cao        |
| UC-25 | Dashboard và báo cáo | Admin | Xem dashboard thống kê và xuất báo cáo hệ thống    | Trung bình |

**Tổng số Use Case:** 25

### Ghi chú về việc rút gọn:

**Đã gộp các UC tương tự:**

- UC-01 = Đăng ký + Xác thực OTP (cũ: UC-01, UC-02)
- UC-04 = Quản lý hồ sơ + Đổi mật khẩu (cũ: UC-05, UC-06)
- UC-06 = Xem danh sách + Tìm kiếm (cũ: UC-08, UC-09)
- UC-09 = Đóng/Mở/Xóa tin (cũ: UC-12, UC-13)
- UC-12 = Xem danh sách + Lọc/Sắp xếp + Tải CV (cũ: UC-18, UC-19, UC-20)
- UC-15 = Sàng lọc AI tự động (cũ: UC-21)
- UC-16 = Xem kết quả + Chạy lại AI (cũ: UC-22, UC-23)
- UC-17 = Tạo lịch + Mời PV (cũ: UC-24, UC-25)
- UC-19 = Chấm điểm + Cập nhật kết quả (cũ: UC-27, UC-28)
- UC-21 = Tạo kết quả + Gửi email (cũ: UC-30, UC-31)
- UC-23 = Xem + Đánh dấu + Email thông báo (cũ: UC-33, UC-34, UC-35)
- UC-24 = Quản lý user + Quản lý công ty (cũ: UC-36, UC-37)
- UC-25 = Dashboard + Xuất báo cáo (cũ: UC-38, UC-39)

**Đã loại bỏ:**

- UC-40 (Xem log hệ thống) - Ít quan trọng cho đồ án

---

## 2.4. Đặc tả Use Case (Use Case Specification)

### UC-01: Đăng ký và xác thực tài khoản

**Mô tả:** Người dùng tạo tài khoản mới để sử dụng hệ thống

**Actor chính:** Candidate, Recruiter

**Actor phụ:** Email Service

**Tiền điều kiện:**

- Người dùng chưa có tài khoản
- Email chưa được đăng ký trong hệ thống

**Hậu điều kiện:**

- Tài khoản mới được tạo với trạng thái "chưa xác thực"
- Mã OTP được gửi qua email

**Luồng sự kiện chính:**

1. Người dùng truy cập trang đăng ký
2. Người dùng chọn vai trò (Candidate/Recruiter)
3. Người dùng nhập thông tin:
   - Email
   - Mật khẩu (tối thiểu 8 ký tự)
   - Họ tên
   - Số điện thoại
   - [Nếu Recruiter] Tên công ty
4. Hệ thống validate dữ liệu nhập vào
5. Hệ thống kiểm tra email chưa tồn tại
6. Hệ thống hash mật khẩu bằng bcrypt
7. Hệ thống tạo tài khoản mới với trạng thái `is_active=False`
8. Hệ thống generate mã OTP 6 chữ số ngẫu nhiên
9. Hệ thống lưu OTP vào database với thời gian hết hạn 10 phút
10. Hệ thống gửi email chứa mã OTP đến địa chỉ email đã đăng ký
11. Hệ thống chuyển người dùng đến trang xác thực OTP
12. Hiển thị thông báo "Vui lòng kiểm tra email để lấy mã OTP"

**Luồng sự kiện phụ:**

**3a. Email đã tồn tại:**

- 3a1. Hệ thống hiển thị lỗi "Email đã được đăng ký"
- 3a2. Quay lại bước 3

**4a. Dữ liệu không hợp lệ:**

- 4a1. Hệ thống hiển thị lỗi validation cụ thể
- 4a2. Quay lại bước 3

**10a. Gửi email thất bại:**

- 10a1. Hệ thống thử gửi lại qua SendGrid (fallback)
- 10a2. Nếu vẫn lỗi, hiển thị mã OTP trên màn hình
- 10a3. Tiếp tục bước 11

**Yêu cầu đặc biệt:**

- Mật khẩu phải được hash trước khi lưu
- OTP phải random và unique
- Rate limit: tối đa 5 lần đăng ký/IP trong 1 giờ

**Tần suất sử dụng:** Cao (hàng ngày)

---

### UC-02: Xác thực OTP

**Mô tả:** Người dùng nhập mã OTP để kích hoạt tài khoản sau khi đăng ký

**Actor chính:** Candidate, Recruiter

**Actor phụ:** Email Service

**Tiền điều kiện:**

- Người dùng đã đăng ký tài khoản (UC-01)
- Mã OTP đã được gửi qua email
- OTP chưa hết hạn (10 phút)

**Hậu điều kiện:**

- Tài khoản được kích hoạt (is_active=True)
- Người dùng có thể đăng nhập

**Luồng sự kiện chính:**

1. Người dùng truy cập trang xác thực OTP
2. Hệ thống hiển thị form nhập OTP
3. Người dùng nhập mã OTP 6 chữ số
4. Hệ thống validate OTP
5. Hệ thống kiểm tra OTP khớp với database
6. Hệ thống kiểm tra OTP chưa hết hạn
7. Hệ thống kiểm tra số lần thử không vượt quá 5
8. Hệ thống cập nhật user.is_active = True
9. Hệ thống xóa OTP khỏi database
10. Hệ thống tự động đăng nhập user (tạo JWT token)
11. Hệ thống chuyển đến dashboard tương ứng vai trò
12. Hiển thị thông báo "Xác thực thành công!"

**Luồng sự kiện phụ:**

**3a. Người dùng không nhận được email:**

- 3a1. Click "Gửi lại mã OTP"
- 3a2. Hệ thống generate OTP mới
- 3a3. Gửi email mới
- 3a4. Reset số lần thử về 0
- 3a5. Quay lại bước 2

**5a. OTP không đúng:**

- 5a1. Tăng số lần thử lên 1
- 5a2. Hiển thị "Mã OTP không đúng. Còn X lần thử"
- 5a3. Quay lại bước 3

**6a. OTP đã hết hạn:**

- 6a1. Hiển thị "Mã OTP đã hết hạn"
- 6a2. Hiển thị nút "Gửi lại mã OTP"
- 6a3. Chuyển đến luồng 3a

**7a. Vượt quá 5 lần thử:**

- 7a1. Khóa tạm thời 15 phút
- 7a2. Hiển thị "Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút"
- 7a3. Kết thúc use case

**Yêu cầu đặc biệt:**

- OTP phải expire sau 10 phút
- Giới hạn 5 lần thử sai
- Rate limit: tối đa 3 lần gửi lại OTP trong 1 giờ
- Log mỗi lần nhập OTP (audit)

**Tần suất sử dụng:** Cao

---

### UC-03: Đăng nhập

**Mô tả:** Người dùng đăng nhập vào hệ thống

**Actor chính:** Candidate, Recruiter, Interviewer, Admin

**Tiền điều kiện:**

- Người dùng đã có tài khoản đã xác thực
- Tài khoản không bị khóa

**Hậu điều kiện:**

- Người dùng đăng nhập thành công
- JWT token được cấp

**Luồng sự kiện chính:**

1. Người dùng truy cập trang đăng nhập
2. Người dùng nhập email và mật khẩu
3. Hệ thống validate dữ liệu
4. Hệ thống tìm user theo email
5. Hệ thống verify mật khẩu với hash trong database
6. Hệ thống kiểm tra tài khoản đã xác thực (`is_active=True`)
7. Hệ thống kiểm tra tài khoản không bị khóa
8. Hệ thống tạo JWT access token (hết hạn 24h)
9. Hệ thống tạo JWT refresh token (hết hạn 7 ngày)
10. Hệ thống trả về tokens và thông tin user
11. Frontend lưu tokens vào localStorage
12. Hệ thống chuyển user đến trang dashboard tương ứng vai trò
13. Hiển thị thông báo "Đăng nhập thành công"

**Luồng sự kiện phụ:**

**4a. Email không tồn tại:**

- 4a1. Hệ thống hiển thị "Email hoặc mật khẩu không đúng"
- 4a2. Quay lại bước 2

**5a. Mật khẩu sai:**

- 5a1. Hệ thống tăng số lần đăng nhập sai
- 5a2. Hệ thống hiển thị "Email hoặc mật khẩu không đúng"
- 5a3. Nếu sai 5 lần, khóa tài khoản 15 phút
- 5a4. Quay lại bước 2

**6a. Tài khoản chưa xác thực:**

- 6a1. Hệ thống hiển thị "Tài khoản chưa được xác thực"
- 6a2. Hiển thị nút "Gửi lại mã OTP"
- 6a3. Chuyển đến UC-02

**7a. Tài khoản bị khóa:**

- 7a1. Hệ thống hiển thị "Tài khoản đã bị khóa. Vui lòng liên hệ admin"
- 7a2. Kết thúc use case

**Yêu cầu đặc biệt:**

- Không hiển thị cụ thể email hay password sai (bảo mật)
- Rate limit: 5 lần đăng nhập sai → khóa 15 phút
- JWT phải được sign với secret key mạnh

**Tần suất sử dụng:** Rất cao (nhiều lần/ngày)

---

### UC-14: Nộp hồ sơ ứng tuyển

**Mô tả:** Candidate upload CV và nộp hồ sơ ứng tuyển vào một tin tuyển dụng

**Actor chính:** Candidate

**Actor phụ:** AI System, Email Service

**Tiền điều kiện:**

- Candidate đã đăng nhập
- Tin tuyển dụng ở trạng thái ACTIVE
- Candidate chưa nộp hồ sơ vào tin này

**Hậu điều kiện:**

- Hồ sơ ứng tuyển được tạo với trạng thái PENDING
- CV được lưu vào server
- AI tự động sàng lọc CV (background task)
- Email xác nhận được gửi

**Luồng sự kiện chính:**

1. Candidate truy cập trang chi tiết tin tuyển dụng
2. Candidate click nút "Ứng tuyển ngay"
3. Hệ thống hiển thị form ứng tuyển
4. Candidate điền thông tin:
   - Upload file CV (PDF/DOCX, max 10MB)
   - Thư giới thiệu (tùy chọn)
   - Số điện thoại liên hệ
   - Email liên hệ (tự động điền từ profile)
5. Hệ thống validate file CV (định dạng, kích thước)
6. Hệ thống upload file CV lên server
7. Hệ thống đổi tên file CV thành UUID (bảo mật)
8. Hệ thống trích xuất text từ CV (PyPDF2/python-docx)
9. Hệ thống tạo record Application mới:
   - candidate_id
   - job_id
   - cv_file_path
   - cv_text
   - cover_letter
   - status = PENDING
   - created_at = now()
10. Hệ thống lưu Application vào database
11. Hệ thống tạo Celery task để AI sàng lọc CV
12. Hệ thống gửi email xác nhận đã nhận hồ sơ
13. Hệ thống tạo notification cho Candidate
14. Hệ thống tạo notification cho Recruiter của tin tuyển dụng
15. Hệ thống chuyển về trang "Hồ sơ của tôi"
16. Hiển thị thông báo "Nộp hồ sơ thành công! Vui lòng chờ kết quả sàng lọc"

**Luồng sự kiện phụ:**

**4a. Candidate đã nộp hồ sơ vào tin này:**

- 4a1. Hệ thống hiển thị "Bạn đã nộp hồ sơ vào tin này"
- 4a2. Hiển thị thông tin hồ sơ đã nộp
- 4a3. Kết thúc use case

**5a. File không hợp lệ:**

- 5a1. Hệ thống hiển thị lỗi cụ thể:
  - "File phải là PDF hoặc DOCX"
  - "File không được vượt quá 10MB"
- 5a2. Quay lại bước 4

**8a. Không thể trích xuất text từ CV:**

- 8a1. Hệ thống lưu cv_text = ""
- 8a2. Log cảnh báo
- 8a3. Tiếp tục bước 9

**11a. Background task (AI sàng lọc):**

- Task chạy bất đồng bộ (không block)
- Khi task hoàn thành:
  - Cập nhật Application.status = SCREENING
  - Lưu điểm AI vào Application.ai_score
  - Lưu phân tích vào Application.ai_analysis
  - Gửi email kết quả sàng lọc cho Candidate và Recruiter
  - Tạo notification

**12a. Gửi email thất bại:**

- 12a1. Thử gửi qua SendGrid (fallback)
- 12a2. Nếu vẫn lỗi, lưu email vào queue
- 12a3. Tiếp tục bước 13

**Yêu cầu đặc biệt:**

- File CV phải được scan virus trước khi lưu
- CV phải được lưu với tên file unique (UUID)
- AI screening không được block form submission
- Phải có progress bar khi upload file

**Tần suất sử dụng:** Rất cao

---

### UC-21: Tự động sàng lọc CV

**Mô tả:** Hệ thống AI tự động phân tích CV và đánh giá độ phù hợp với yêu cầu công việc

**Actor chính:** AI System (Google Gemini)

**Actor phụ:** Email Service

**Tiền điều kiện:**

- Có Application mới với cv_text đã được trích xuất
- Job có đầy đủ description và requirements

**Hậu điều kiện:**

- Application có ai_score (0-100)
- Application có ai_analysis (JSON)
- Status được update thành SCREENING
- Email kết quả được gửi

**Luồng sự kiện chính:**

1. Celery worker nhận task `screen_cv_with_ai(application_id)`
2. Worker load Application từ database
3. Worker load Job tương ứng
4. Worker chuẩn bị prompt cho Gemini AI:

   ```
   Job Title: {job.title}
   Requirements: {job.requirements}
   Description: {job.description}

   CV Content: {application.cv_text}

   Task: Phân tích CV và đánh giá độ phù hợp với công việc.
   Trả về JSON format:
   {
     "score": 0-100,
     "strengths": ["..."],
     "weaknesses": ["..."],
     "skill_match": {
       "matched_skills": ["..."],
       "missing_skills": ["..."]
     },
     "experience_match": "...",
     "education_match": "...",
     "recommendation": "..."
   }
   ```

5. Worker gọi Google Gemini API
6. Worker nhận response từ Gemini
7. Worker parse JSON response
8. Worker validate dữ liệu trả về
9. Worker cập nhật Application:
   - ai_score = response['score']
   - ai_analysis = response (JSON)
   - status = SCREENING
   - ai_screened_at = now()
10. Worker lưu vào database
11. Worker gửi email kết quả sàng lọc đến Candidate:
    - Subject: "Kết quả sàng lọc CV - {job.title}"
    - Body: Điểm số, nhận xét tổng quan
12. Worker gửi email thông báo đến Recruiter:
    - Subject: "Có hồ sơ mới - {candidate.name} - Điểm AI: {score}"
    - Body: Link xem chi tiết hồ sơ
13. Worker tạo notification cho Candidate và Recruiter
14. Worker log kết quả
15. Task hoàn thành

**Luồng sự kiện phụ:**

**5a. Gemini API error:**

- 5a1. Worker retry 3 lần với exponential backoff
- 5a2. Nếu vẫn lỗi, log error
- 5a3. Gửi email cho admin thông báo lỗi
- 5a4. Set Application.ai_score = None, status = PENDING
- 5a5. Kết thúc task

**6a. Response không hợp lệ:**

- 6a1. Worker log error
- 6a2. Thử parse lại hoặc dùng giá trị mặc định
- 6a3. Set ai_score = 50 (neutral)
- 6a4. Tiếp tục bước 9

**8a. cv_text rỗng:**

- 8a1. Không thể phân tích
- 8a2. Set ai_analysis = {"error": "Không thể đọc CV"}
- 8a3. Gửi email yêu cầu Candidate nộp lại CV
- 8a4. Kết thúc task

**11a. Gửi email thất bại:**

- 11a1. Thử SendGrid fallback
- 11a2. Lưu email vào queue để gửi lại sau
- 11a3. Tiếp tục bước 13

**Yêu cầu đặc biệt:**

- Task phải chạy bất đồng bộ (Celery)
- Timeout: tối đa 30 giây cho Gemini API
- Retry strategy: 3 lần, exponential backoff
- Rate limit: tối đa 10 requests/phút đến Gemini API
- Logging đầy đủ để debug

**Tần suất sử dụng:** Rất cao (mỗi lần có CV mới)

---

### UC-25: Tạo lịch phỏng vấn

**Mô tả:** Recruiter tạo lịch phỏng vấn cho ứng viên đã được mời

**Actor chính:** Recruiter

**Actor phụ:** Email Service

**Tiền điều kiện:**

- Recruiter đã đăng nhập
- Application ở trạng thái INTERVIEW
- Có ít nhất 1 Interviewer trong hệ thống

**Hậu điều kiện:**

- Interview record được tạo
- Email thông báo được gửi đến Candidate và Interviewer
- Notification được tạo

**Luồng sự kiện chính:**

1. Recruiter truy cập trang chi tiết hồ sơ ứng viên
2. Recruiter click nút "Tạo lịch phỏng vấn"
3. Hệ thống hiển thị form tạo lịch phỏng vấn
4. Recruiter điền thông tin:
   - Thời gian phỏng vấn (date + time)
   - Loại phỏng vấn (ONLINE/OFFLINE)
   - [Nếu ONLINE] Link meeting (Zoom/Google Meet)
   - [Nếu OFFLINE] Địa điểm phỏng vấn
   - Chọn Interviewer (có thể chọn nhiều người - panel)
   - Ghi chú bổ sung (tùy chọn)
5. Hệ thống validate dữ liệu:
   - Thời gian phải trong tương lai
   - Link meeting hợp lệ (nếu ONLINE)
   - Ít nhất 1 Interviewer được chọn
6. Hệ thống kiểm tra Interviewer không bận vào thời gian này
7. Hệ thống tạo Interview record:
   - application_id
   - interview_date
   - interview_type
   - location/meeting_link
   - notes
   - result = PENDING
   - created_by = recruiter_id
8. Hệ thống lưu vào database
9. Hệ thống tạo InterviewPanel records cho mỗi Interviewer
10. Hệ thống cập nhật Application.status = INTERVIEW (nếu chưa)
11. Hệ thống gửi email thông báo đến Candidate:
    - Subject: "Thông báo lịch phỏng vấn - {job.title}"
    - Body: Thời gian, địa điểm/link, lưu ý chuẩn bị
12. Hệ thống gửi email đến từng Interviewer:
    - Subject: "Bạn được gán phỏng vấn - {candidate.name}"
    - Body: Thông tin ứng viên, thời gian, link xem CV
13. Hệ thống tạo notification cho Candidate
14. Hệ thống tạo notification cho từng Interviewer
15. Hệ thống quay lại trang chi tiết hồ sơ
16. Hiển thị thông báo "Tạo lịch phỏng vấn thành công"

**Luồng sự kiện phụ:**

**5a. Dữ liệu không hợp lệ:**

- 5a1. Hệ thống hiển thị lỗi validation cụ thể
- 5a2. Quay lại bước 4

**6a. Interviewer bận:**

- 6a1. Hệ thống hiển thị cảnh báo "Interviewer X đã có lịch vào thời gian này"
- 6a2. Đề xuất thời gian khác
- 6a3. Cho phép Recruiter bỏ qua và tiếp tục (với warning)

**12a. Gửi email thất bại:**

- 12a1. Thử SendGrid fallback
- 12a2. Lưu email vào queue
- 12a3. Tiếp tục bước 13

**Luồng sự kiện thay thế:**

**4a. Chỉnh sửa lịch đã tồn tại:**

- 4a1. Load dữ liệu Interview hiện tại
- 4a2. Cho phép chỉnh sửa
- 4a3. Gửi email "Cập nhật lịch phỏng vấn" thay vì "Thông báo mới"

**Yêu cầu đặc biệt:**

- Validate timezone (VN: UTC+7)
- Calendar view để chọn thời gian dễ dàng
- Gợi ý thời gian trống của Interviewer
- Có thể tạo nhiều vòng phỏng vấn cho 1 ứng viên

**Tần suất sử dụng:** Cao

---

### UC-27: Cập nhật kết quả phỏng vấn

**Mô tả:** Interviewer nhập kết quả và feedback sau khi phỏng vấn ứng viên

**Actor chính:** Interviewer

**Actor phụ:** Email Service, Hệ thống

**Tiền điều kiện:**

- Interviewer đã đăng nhập
- Interviewer được gán vào Interview này
- Interview đã qua thời gian phỏng vấn

**Hậu điều kiện:**

- InterviewPanel có score và feedback
- Interview.result được cập nhật (nếu đủ điều kiện)
- Email kết quả được gửi (nếu Interview hoàn thành)
- Tự động tạo RecruitmentResult nếu PASS với điểm cao

**Luồng sự kiện chính:**

1. Interviewer truy cập trang "Lịch phỏng vấn của tôi"
2. Interviewer click vào buổi phỏng vấn cần chấm điểm
3. Hệ thống hiển thị thông tin ứng viên và CV
4. Interviewer click "Nhập kết quả"
5. Hệ thống hiển thị form chấm điểm
6. Interviewer nhập thông tin:
   - Điểm số (0-100)
   - Kết quả (PASS/FAIL)
   - Feedback chi tiết (text area)
   - Đánh giá kỹ năng chuyên môn (1-5 sao)
   - Đánh giá kỹ năng mềm (1-5 sao)
   - Đánh giá thái độ (1-5 sao)
7. Hệ thống validate dữ liệu
8. Hệ thống lưu vào InterviewPanel:
   - score
   - feedback
   - technical_score
   - soft_skill_score
   - attitude_score
   - updated_by = interviewer_id
   - updated_at = now()
9. Hệ thống kiểm tra tất cả Interviewer đã chấm điểm chưa
10. **Nếu tất cả đã chấm:**
    - 10a. Tính điểm trung bình từ tất cả InterviewPanel
    - 10b. Xác định result:
      - avg_score >= 70 → PASS
      - avg_score < 70 → FAIL
    - 10c. Cập nhật Interview.result và Interview.score
    - 10d. Gửi email kết quả đến Candidate
    - 10e. **Nếu PASS và avg_score >= 80:**
      - Tự động tạo RecruitmentResult với OFFER
      - Cập nhật Application.status = OFFER
      - Gửi email chúc mừng nhận OFFER
11. **Nếu chưa đủ:** Chỉ lưu và chờ
12. Hệ thống tạo notification cho Candidate (nếu đủ người chấm)
13. Hệ thống quay lại trang danh sách
14. Hiển thị thông báo "Cập nhật kết quả thành công"

**Luồng sự kiện phụ:**

**7a. Dữ liệu không hợp lệ:**

- 7a1. Hiển thị lỗi validation
- 7a2. Quay lại bước 6

**10d. Gửi email thất bại:**

- Fallback sang SendGrid
- Lưu vào queue nếu cả 2 lỗi

**10e. Tạo OFFER tự động:**

- Logic:
  ```python
  if interview.result == 'PASS' and avg_score >= 80:
      if not hasattr(application, 'recruitment_result'):
          RecruitmentResult.objects.create(
              application=application,
              final_decision='OFFER',
              decided_by=system,
              notes=f'Tự động tạo từ phỏng vấn. Điểm: {avg_score}'
          )
  ```

**Luồng sự kiện thay thế:**

**6a. Chỉnh sửa kết quả đã nhập:**

- 6a1. Load dữ liệu InterviewPanel hiện tại
- 6a2. Cho phép chỉnh sửa
- 6a3. Log lịch sử chỉnh sửa (audit trail)

**Yêu cầu đặc biệt:**

- Phải có audit trail (ai sửa, khi nào, giá trị cũ/mới)
- Interviewer chỉ được sửa kết quả của mình
- Admin có thể xem tất cả kết quả
- Điểm trung bình làm tròn 1 chữ số thập phân

**Tần suất sử dụng:** Cao

---

### UC-30: Tạo kết quả tuyển dụng cuối cùng

**Mô tả:** Recruiter đưa ra quyết định cuối cùng để gửi thư mời nhận việc (OFFER) hoặc thư từ chối (REJECT) cho ứng viên sau khi đã phỏng vấn xong

**Actor chính:** Recruiter, Hệ thống

**Actor phụ:** Email Service

**Tiền điều kiện:**

- Application đã qua phỏng vấn (có Interview với result)
- Chưa có RecruitmentResult cho Application này

**Hậu điều kiện:**

- RecruitmentResult được tạo
- Application.status được cập nhật
- Email kết quả được gửi
- Notification được tạo

**Luồng sự kiện chính (Manual - Recruiter):**

1. Recruiter truy cập trang chi tiết hồ sơ ứng viên
2. Recruiter xem kết quả phỏng vấn và điểm số
3. Recruiter click "Gửi kết quả tuyển dụng"
4. Hệ thống hiển thị form tạo kết quả
5. Recruiter chọn quyết định:
   - **OFFER** (Nhận việc)
   - **REJECT** (Từ chối)
6. Recruiter nhập thông tin:
   - Lý do quyết định
   - [Nếu OFFER] Mức lương đề nghị
   - [Nếu OFFER] Ngày bắt đầu làm việc
   - [Nếu OFFER] Thông tin offer khác
   - Ghi chú bổ sung
7. Hệ thống validate dữ liệu
8. Hệ thống tạo RecruitmentResult:
   - application_id
   - final_decision (OFFER/REJECT)
   - salary_offer (nếu OFFER)
   - start_date (nếu OFFER)
   - notes
   - decided_by = recruiter_id
   - decided_at = now()
9. Hệ thống lưu vào database
10. Hệ thống cập nhật Application.status:
    - OFFER → status = OFFER
    - REJECT → status = REJECTED
11. Hệ thống gửi email kết quả đến Candidate:
    - **OFFER email:**
      - Subject: "🎉 Chúc mừng! Bạn đã được nhận - {job.title}"
      - Body: Thông tin offer, mức lương, ngày bắt đầu, hướng dẫn tiếp theo
    - **REJECT email:**
      - Subject: "Kết quả tuyển dụng - {job.title}"
      - Body: Cảm ơn, khuyến khích ứng tuyển lần sau
12. Hệ thống tạo notification cho Candidate
13. Hệ thống log quyết định (audit trail)
14. Hệ thống quay lại trang chi tiết hồ sơ
15. Hiển thị thông báo "Đã gửi kết quả tuyển dụng"

**Luồng sự kiện chính (Automatic - Hệ thống):**

1. Hệ thống detect Interview.result = PASS với avg_score >= 80
2. Hệ thống kiểm tra chưa có RecruitmentResult
3. Hệ thống tự động tạo RecruitmentResult:
   - final_decision = OFFER
   - decided_by = None (system)
   - notes = "Tự động tạo từ kết quả phỏng vấn xuất sắc"
4. Thực hiện bước 9-13 như luồng manual

**Luồng sự kiện phụ:**

**5a. Application đã có RecruitmentResult:**

- 5a1. Hiển thị "Đã có kết quả tuyển dụng"
- 5a2. Hiển thị thông tin kết quả hiện tại
- 5a3. Cho phép xem lại, không cho tạo mới

**7a. Dữ liệu không hợp lệ:**

- 7a1. Hiển thị lỗi validation
- 7a2. Quay lại bước 6

**11a. Gửi email thất bại:**

- 11a1. Fallback SendGrid
- 11a2. Lưu vào queue
- 11a3. Tiếp tục bước 12

**Luồng sự kiện thay thế:**

**6a. Chỉnh sửa kết quả đã tồn tại (Admin only):**

- 6a1. Admin có thể sửa quyết định
- 6a2. Gửi email "Cập nhật kết quả tuyển dụng"
- 6a3. Log đầy đủ audit trail

**Yêu cầu đặc biệt:**

- Quyết định không thể xóa, chỉ có thể sửa (audit)
- Email OFFER phải chuyên nghiệp, đầy đủ thông tin
- Email REJECT phải lịch sự, động viên ứng viên
- Có thể đính kèm file offer letter (PDF)
- Log đầy đủ: ai quyết định, khi nào, lý do gì

**Tần suất sử dụng:** Cao

---

### UC-31: Gửi email kết quả tuyển dụng

**Mô tả:** Hệ thống tự động gửi email thông báo kết quả tuyển dụng (OFFER/REJECT) đến ứng viên

**Actor chính:** Hệ thống

**Actor phụ:** Email Service (Resend API)

**Tiền điều kiện:**

- RecruitmentResult đã được tạo
- Candidate có email hợp lệ

**Hậu điều kiện:**

- Email được gửi thành công
- Notification được tạo
- Log email được ghi nhận

**Luồng sự kiện chính:**

1. Hệ thống detect RecruitmentResult mới được tạo (signal post_save)
2. Hệ thống load thông tin:
   - Candidate email
   - Job title, company
   - Final decision (OFFER/REJECT)
   - Salary offer, start date (nếu OFFER)
   - Notes từ Recruiter
3. Hệ thống xác định template email:
   - **Nếu OFFER:** Load template "offer_letter.html"
   - **Nếu REJECT:** Load template "rejection_letter.html"
4. Hệ thống render template với context data:
   ```python
   context = {
       'candidate_name': candidate.full_name,
       'job_title': job.title,
       'company_name': recruiter.company_name,
       'salary_offer': result.salary_offer,  # Nếu OFFER
       'start_date': result.start_date,      # Nếu OFFER
       'notes': result.notes,
       'recruiter_name': recruiter.full_name,
       'recruiter_email': recruiter.email,
   }
   ```
5. Hệ thống tạo subject line:
   - **OFFER:** "🎉 Chúc mừng! Bạn đã được nhận vào {company_name} - {job_title}"
   - **REJECT:** "Thông báo kết quả tuyển dụng - {job_title}"
6. Hệ thống gửi email qua Resend API:
   ```python
   send_email(
       to=candidate.email,
       subject=subject,
       html_content=rendered_html,
       from_email="noreply@recruitment.com",
       from_name="Hệ thống Tuyển dụng"
   )
   ```
7. Hệ thống kiểm tra response từ API
8. **Nếu thành công:**
   - Lưu log: "Email sent to {email} - Result: {decision}"
   - Tạo Notification cho Candidate với link đến kết quả
9. **Nếu thất bại:**
   - Fallback SendGrid API
   - Nếu vẫn thất bại: Lưu vào retry queue
10. Hệ thống cập nhật Application.notification_sent = True
11. Kết thúc

**Luồng sự kiện phụ:**

**6a. Gửi email qua Resend thất bại:**

- 6a1. Log error: "Resend failed: {error_message}"
- 6a2. Thử gửi qua SendGrid API
- 6a3. Nếu SendGrid thành công: Tiếp tục bước 7
- 6a4. Nếu SendGrid cũng thất bại: Tiếp tục 6b

**6b. Cả 2 API đều thất bại:**

- 6b1. Log error nghiêm trọng
- 6b2. Lưu email vào FailedEmail table với:
  - recipient, subject, content
  - error_message
  - retry_count = 0
- 6b3. Celery task sẽ retry sau 5 phút
- 6b4. Vẫn tạo Notification cho user (fallback)

**7a. Email bị bounce (invalid email):**

- 7a1. Nhận webhook từ Resend/SendGrid
- 7a2. Đánh dấu candidate.email_valid = False
- 7a3. Tạo notification yêu cầu cập nhật email

**Yêu cầu đặc biệt:**

- Email OFFER phải chuyên nghiệp, đầy đủ:
  - Logo công ty
  - Thông tin position, salary, start date
  - Benefits, working hours
  - Next steps: Liên hệ trong 3 ngày
  - Chữ ký recruiter
- Email REJECT phải lịch sự:
  - Cảm ơn ứng viên đã quan tâm
  - Động viên thử lại lần sau
  - Không nêu lý do cụ thể (trừ khi recruiter ghi chú)
- Retry mechanism: Max 3 lần, backoff 5-15-30 phút
- Tracking: Click tracking, open tracking (nếu có)
- Compliance: Có link "Unsubscribe" (nếu yêu cầu)

**Tần suất sử dụng:** Cao

---

### UC-32: Xem lịch sử quyết định tuyển dụng

**Mô tả:** Recruiter và Admin xem lịch sử tất cả các quyết định tuyển dụng (audit trail) để theo dõi và phân tích

**Actor chính:** Recruiter, Admin

**Tiền điều kiện:**

- Đã đăng nhập
- [Recruiter] Chỉ xem quyết định của công ty mình
- [Admin] Xem tất cả

**Hậu điều kiện:**

- Danh sách quyết định được hiển thị

**Luồng sự kiện chính:**

1. Người dùng truy cập "Lịch sử quyết định tuyển dụng"
2. Hệ thống query RecruitmentResult với filter:
   - **Recruiter:** results của các job mà recruiter tạo
   - **Admin:** Tất cả results
3. Hệ thống hiển thị bảng với các cột:
   - **Ngày quyết định** (decided_at)
   - **Ứng viên** (tên + avatar)
   - **Vị trí ứng tuyển** (job title)
   - **Quyết định** (Badge: OFFER màu xanh / REJECT màu đỏ)
   - **Mức lương** (nếu OFFER)
   - **Người quyết định** (Recruiter name hoặc "Hệ thống")
   - **Thao tác** (Xem chi tiết)
4. Bảng hỗ trợ:
   - Phân trang: 20 records/trang
   - Sort: Mới nhất/Cũ nhất, Theo tên ứng viên, Theo lương
5. Người dùng có thể filter:
   - **Theo quyết định:** OFFER / REJECT / Tất cả
   - **Theo thời gian:** Hôm nay / 7 ngày / 30 ngày / Tùy chỉnh
   - **Theo người quyết định:** Chọn recruiter / Hệ thống
   - **Theo job:** Chọn từ dropdown job list
6. Người dùng có thể search:
   - Tìm theo tên ứng viên
   - Tìm theo email
7. Người dùng click "Xem chi tiết"
8. Hệ thống hiển thị modal/page với thông tin đầy đủ:
   - Thông tin ứng viên
   - Thông tin job
   - Điểm phỏng vấn (nếu có)
   - Quyết định và lý do
   - Salary offer, start date (nếu OFFER)
   - Notes từ recruiter
   - Timeline: Nộp hồ sơ → AI Screening → Interview → Result
   - Audit log: Ai tạo, khi nào, có sửa đổi không
9. [Admin] Có nút "Export Excel" để xuất báo cáo

**Luồng sự kiện phụ:**

**9a. Export Excel:**

- 9a1. Admin click "Export Excel"
- 9a2. Chọn filter và date range
- 9a3. Hệ thống generate Excel file với:
  - Tất cả columns trong bảng
  - Thêm columns: Email, Phone, Ngày nộp hồ sơ, Điểm AI, Điểm PV
- 9a4. Download file "recruitment*results*{date}.xlsx"

**Yêu cầu đặc biệt:**

- Real-time update: Khi có quyết định mới, tự động refresh list (WebSocket hoặc polling)
- Performance: Index trên decided_at, application_id
- Security: Recruiter không xem được quyết định của công ty khác
- Analytics: Hiển thị thống kê tóm tắt:
  - Tổng số quyết định
  - Tỷ lệ OFFER/REJECT
  - Avg salary offer
  - Avg time to hire (từ nộp hồ sơ đến offer)

**Tần suất sử dụng:** Trung bình

---

### UC-33: Xem danh sách thông báo

**Mô tả:** Người dùng xem tất cả các thông báo (notification) từ hệ thống

**Actor chính:** Tất cả user roles

**Tiền điều kiện:**

- Đã đăng nhập

**Hậu điều kiện:**

- Danh sách notification được hiển thị
- Badge số lượng notification chưa đọc được cập nhật

**Luồng sự kiện chính:**

1. Người dùng click vào icon "🔔" trên header
2. Hệ thống hiển thị dropdown với:
   - **10 notification mới nhất** (DESC by created_at)
   - Mỗi notification hiển thị:
     - Icon (dựa vào type: INFO/SUCCESS/WARNING/ERROR)
     - Title (bold nếu chưa đọc)
     - Short message (truncate 100 chars)
     - Thời gian tương đối ("5 phút trước", "2 giờ trước")
   - Nút "Xem tất cả" ở cuối dropdown
3. **Nếu người dùng click vào 1 notification:**
   - 3a. Hệ thống cập nhật notification.is_read = True
   - 3b. Badge số giảm đi 1
   - 3c. Redirect đến trang liên quan (ví dụ: application detail, interview schedule)
   - 3d. Close dropdown
4. **Nếu người dùng click "Xem tất cả":**
   - 4a. Redirect đến trang "/notifications"
   - 4b. Hệ thống hiển thị trang đầy đủ với:
     - **Tab "Chưa đọc"**: Notifications với is_read = False
     - **Tab "Tất cả"**: Tất cả notifications
   - 4c. Mỗi notification hiển thị đầy đủ:
     - Icon + Type (INFO/SUCCESS/WARNING/ERROR)
     - Title (bold)
     - Full message
     - Timestamp chính xác
     - Link "Xem chi tiết" (nếu có related object)
   - 4d. Có phân trang: 30 notifications/trang
   - 4e. Có nút "Đánh dấu tất cả đã đọc" ở đầu trang
   - 4f. Có filter:
     - Theo loại (INFO/SUCCESS/WARNING/ERROR)
     - Theo thời gian (Hôm nay/7 ngày/30 ngày/Tất cả)
5. Badge trên icon "🔔" hiển thị số notification chưa đọc real-time

**Luồng sự kiện phụ:**

**4e. Đánh dấu tất cả đã đọc:**

- 4e1. User click "Đánh dấu tất cả đã đọc"
- 4e2. Hệ thống cập nhật:
  ```python
  Notification.objects.filter(
      user=request.user,
      is_read=False
  ).update(is_read=True)
  ```
- 4e3. Badge về 0
- 4e4. Refresh trang, tab "Chưa đọc" trống
- 4e5. Hiển thị toast "Đã đánh dấu tất cả là đã đọc"

**5a. Real-time notification (WebSocket):**

- 5a1. Khi có notification mới được tạo
- 5a2. Backend push qua WebSocket channel của user
- 5a3. Frontend nhận event, cập nhật badge +1
- 5a4. Hiển thị toast notification nhỏ ở góc màn hình
- 5a5. Play sound (nếu user enable)

**Yêu cầu đặc biệt:**

- **Performance:** Index trên (user_id, is_read, created_at)
- **Real-time:** WebSocket hoặc SSE để push notification mới
- **Retention:** Tự động xóa notification > 90 ngày
- **Grouping:** Nhóm các notification giống nhau (ví dụ: 5 ứng viên mới nộp hồ sơ → "5 ứng viên mới nộp hồ sơ vào {job}")
- **Privacy:** User chỉ xem được notification của mình
- **Types:**
  - INFO (xanh): Thông tin chung
  - SUCCESS (xanh lá): Hành động thành công (nộp hồ sơ, gửi kết quả)
  - WARNING (vàng): Cần chú ý (deadline gần, lịch PV sắp tới)
  - ERROR (đỏ): Lỗi, từ chối

**Tần suất sử dụng:** Rất cao

---

### UC-34: Đánh dấu thông báo đã đọc

**Mô tả:** Người dùng đánh dấu notification là đã đọc để giảm số lượng chưa đọc

**Actor chính:** Tất cả user roles

**Tiền điều kiện:**

- Đã đăng nhập
- Có notification chưa đọc

**Hậu điều kiện:**

- Notification.is_read = True
- Badge số giảm

**Luồng sự kiện chính (Đọc từng notification):**

1. User click vào 1 notification trong dropdown hoặc trang notifications
2. Hệ thống gửi PATCH request:
   ```
   PATCH /api/notifications/{id}/
   { "is_read": true }
   ```
3. Backend validate: User chỉ được sửa notification của mình
4. Backend cập nhật:
   ```python
   notification.is_read = True
   notification.read_at = timezone.now()
   notification.save()
   ```
5. Backend return updated notification
6. Frontend cập nhật UI:
   - Notification không còn bold
   - Badge số giảm 1
7. Frontend redirect đến trang liên quan (nếu có link)

**Luồng sự kiện chính (Đánh dấu tất cả đã đọc):**

1. User click "Đánh dấu tất cả đã đọc" trên trang notifications
2. Hệ thống gửi POST request:
   ```
   POST /api/notifications/mark-all-read/
   ```
3. Backend cập nhật bulk:
   ```python
   count = Notification.objects.filter(
       user=request.user,
       is_read=False
   ).update(
       is_read=True,
       read_at=timezone.now()
   )
   ```
4. Backend return { "count": count }
5. Frontend cập nhật:
   - Badge về 0
   - Tất cả notification không còn bold
   - Tab "Chưa đọc" trống
6. Hiển thị toast "Đã đánh dấu {count} thông báo là đã đọc"

**Luồng sự kiện phụ:**

**3a. User cố đánh dấu notification của người khác:**

- 3a1. Backend kiểm tra notification.user != request.user
- 3a2. Return 403 Forbidden
- 3a3. Frontend hiển thị "Không có quyền"

**4a. Không có notification nào chưa đọc:**

- 4a1. Backend return { "count": 0 }
- 4a2. Frontend hiển thị "Không có thông báo chưa đọc"

**Yêu cầu đặc biệt:**

- **Auto mark read:** Notification tự động được đánh dấu đã đọc sau khi user click vào (không cần action riêng)
- **Debounce:** Nếu user click liên tục, chỉ gửi 1 request
- **Optimistic UI:** Frontend cập nhật UI ngay, không đợi response (rollback nếu lỗi)
- **Bulk operation:** Đánh dấu tất cả phải efficient (1 query UPDATE, không loop)

**Tần suất sử dụng:** Cao

---

### UC-35: Nhận email thông báo

**Mô tả:** Người dùng nhận email thông báo về các sự kiện quan trọng trong hệ thống

**Actor chính:** Tất cả user roles

**Actor phụ:** Email Service, Celery Worker

**Tiền điều kiện:**

- User có email hợp lệ
- User.email_notifications_enabled = True (setting)

**Hậu điều kiện:**

- Email được gửi đến inbox của user
- Log email được ghi nhận

**Luồng sự kiện chính:**

1. **Trigger event** xảy ra trong hệ thống:
   - Candidate nộp hồ sơ → Email cho Recruiter
   - AI hoàn thành sàng lọc → Email cho Recruiter
   - Recruiter mời phỏng vấn → Email cho Candidate
   - Interview được tạo → Email cho Interviewer
   - Kết quả phỏng vấn → Email cho Candidate
   - Kết quả tuyển dụng → Email cho Candidate
   - Deadline công việc gần hết → Email reminder
2. Hệ thống tạo Notification trong database (UC-33)
3. Hệ thống kiểm tra `user.email_notifications_enabled`
4. **Nếu enabled:**
   - 4a. Hệ thống xác định email template dựa vào notification type
   - 4b. Hệ thống load template HTML tương ứng
   - 4c. Hệ thống render template với data:
     ```python
     context = {
         'user_name': user.full_name,
         'notification_title': notification.title,
         'notification_message': notification.message,
         'action_url': f"{FRONTEND_URL}{notification.link}",
         'action_text': "Xem chi tiết",
         'unsubscribe_url': f"{FRONTEND_URL}/settings/notifications"
     }
     ```
   - 4d. Hệ thống tạo Celery task (async):
     ```python
     send_notification_email.delay(
         user_id=user.id,
         notification_id=notification.id
     )
     ```
5. **Celery worker** xử lý task:
   - 5a. Load user và notification từ DB
   - 5b. Gửi email qua Resend API:
     ```python
     send_email(
         to=user.email,
         subject=f"🔔 {notification.title}",
         html_content=rendered_html,
         from_email="notifications@recruitment.com"
     )
     ```
   - 5c. **Nếu thành công:**
     - Log: "Email notification sent to {email}"
     - Cập nhật notification.email_sent = True
   - 5d. **Nếu thất bại:**
     - Retry 3 lần với backoff (5-15-30 phút)
     - Sau 3 lần thất bại: Log error, không gửi nữa
6. User nhận email trong inbox
7. User click "Xem chi tiết" → Redirect về frontend app

**Luồng sự kiện phụ:**

**4. User tắt email notifications:**

- 4a. User.email_notifications_enabled = False
- 4b. Hệ thống chỉ tạo in-app notification
- 4c. Không gửi email

**5b. Gửi qua Resend thất bại:**

- 5b1. Fallback SendGrid API
- 5b2. Nếu SendGrid OK: Log "Sent via SendGrid fallback"
- 5b3. Nếu cả 2 đều fail: Retry mechanism

**7a. User click "Unsubscribe":**

- 7a1. Redirect về trang Settings
- 7a2. Hiển thị toggle "Email notifications"
- 7a3. User tắt toggle
- 7a4. Cập nhật user.email_notifications_enabled = False
- 7a5. Không còn nhận email nữa (vẫn nhận in-app)

**Yêu cầu đặc biệt:**

- **Email template:** Professional, responsive (mobile-friendly)
- **Frequency control:** Không spam, group notifications trong 1 email nếu quá nhiều
- **Digest email:** Option gửi tổng hợp 1 ngày (thay vì realtime)
- **Priority:**
  - HIGH: Interview invite, Recruitment result → Gửi ngay
  - MEDIUM: New application, AI result → Có thể delay 5-10 phút
  - LOW: Reminder → Gửi vào giờ hợp lý (9AM-5PM)
- **Compliance:**
  - Footer phải có link "Unsubscribe"
  - Footer có địa chỉ công ty (GDPR, CAN-SPAM)
- **Tracking:** Log mọi email (sent/failed/bounced) để audit

**Các loại email notification:**

1. **Cho Candidate:**

   - OTP xác thực tài khoản
   - Xác nhận nộp hồ sơ thành công
   - Lời mời phỏng vấn
   - Nhắc lịch phỏng vấn (1 ngày trước)
   - Kết quả phỏng vấn
   - Kết quả tuyển dụng (OFFER/REJECT)

2. **Cho Recruiter:**

   - Có ứng viên mới nộp hồ sơ
   - AI hoàn thành sàng lọc
   - Interviewer gửi kết quả phỏng vấn
   - Deadline công việc sắp hết

3. **Cho Interviewer:**

   - Được gán lịch phỏng vấn mới
   - Nhắc chấm điểm ứng viên

4. **Cho Admin:**
   - Báo cáo hàng tuần (digest)
   - Cảnh báo hệ thống (errors, high load)

**Tần suất sử dụng:** Rất cao

---

### UC-36: Quản lý người dùng

**Mô tả:** Admin xem, chỉnh sửa, khóa/mở khóa tài khoản người dùng

**Actor chính:** Admin

**Tiền điều kiện:**

- Admin đã đăng nhập
- Có quyền admin (role = ADMIN)

**Hậu điều kiện:**

- Thông tin user được cập nhật
- Tài khoản bị khóa/mở khóa
- Log được ghi nhận

**Luồng sự kiện chính:**

1. Admin truy cập trang "Quản lý người dùng"
2. Hệ thống hiển thị danh sách tất cả users với bảng:
   - ID, Avatar, Họ tên, Email, Role, Trạng thái, Ngày đăng ký, Thao tác
3. Admin có thể:
   - Lọc theo role (CANDIDATE/RECRUITER/INTERVIEWER/ADMIN)
   - Lọc theo trạng thái (Active/Inactive/Locked)
   - Tìm kiếm theo tên, email
   - Sắp xếp theo ngày đăng ký, tên
4. Admin click "Xem chi tiết" một user
5. Hệ thống hiển thị trang chi tiết user với:
   - Thông tin cá nhân đầy đủ
   - Lịch sử hoạt động (logins, applications nếu candidate, jobs nếu recruiter)
   - Thống kê (số tin đăng, số hồ sơ nộp, v.v.)
6. Admin có thể thực hiện:
   - **Chỉnh sửa thông tin:**
     - 6a1. Click "Chỉnh sửa"
     - 6a2. Sửa thông tin (tên, phone, role, v.v.)
     - 6a3. Lưu thay đổi
     - 6a4. Log audit: "Admin X changed user Y's info"
   - **Khóa tài khoản:**
     - 6b1. Click "Khóa tài khoản"
     - 6b2. Nhập lý do khóa
     - 6b3. Xác nhận
     - 6b4. Set user.is_active = False
     - 6b5. Gửi email thông báo cho user
     - 6b6. Log: "Admin X locked user Y. Reason: ..."
   - **Mở khóa tài khoản:**
     - 6c1. Click "Mở khóa"
     - 6c2. Xác nhận
     - 6c3. Set user.is_active = True
     - 6c4. Gửi email thông báo
     - 6c5. Log: "Admin X unlocked user Y"
   - **Đổi mật khẩu:**
     - 6d1. Click "Reset password"
     - 6d2. Generate password mới
     - 6d3. Gửi email password mới cho user
     - 6d4. Log: "Admin X reset password for user Y"
   - **Xóa tài khoản (soft delete):**
     - 6e1. Click "Xóa tài khoản"
     - 6e2. Xác nhận (cảnh báo nghiêm trọng)
     - 6e3. Kiểm tra ràng buộc (có jobs, applications đang active không)
     - 6e4. Soft delete: user.deleted_at = now()
     - 6e5. Log: "Admin X deleted user Y"

**Luồng sự kiện phụ:**

**6a3. Sửa thông tin nhạy cảm (email, role):**

- Yêu cầu xác nhận bổ sung
- Gửi email thông báo cho user

**6e3. Không thể xóa:**

- Nếu user có dữ liệu quan trọng (ví dụ: Recruiter có job đang active)
- Hiển thị lỗi "Không thể xóa user này. Vui lòng xử lý dữ liệu trước"

**Yêu cầu đặc biệt:**

- Phân trang: 50 users/trang
- Export danh sách user ra CSV/Excel
- Audit log đầy đủ mọi thao tác
- Không thể xóa tài khoản admin cuối cùng
- Không thể tự khóa tài khoản của mình

**Tần suất sử dụng:** Trung bình

---

### UC-37: Quản lý công ty

**Mô tả:** Admin quản lý thông tin các công ty trong hệ thống (từ Recruiter accounts)

**Actor chính:** Admin

**Tiền điều kiện:**

- Admin đã đăng nhập
- Có ít nhất 1 Recruiter đã đăng ký

**Hậu điều kiện:**

- Thông tin công ty được cập nhật
- Công ty bị vô hiệu hóa (nếu cần)

**Luồng sự kiện chính:**

1. Admin truy cập "Quản lý công ty"
2. Hệ thống query tất cả Recruiter accounts, group by company_name
3. Hệ thống hiển thị bảng với các cột:
   - **Tên công ty** (company_name)
   - **Website** (company_website)
   - **Logo** (thumbnail)
   - **Số Recruiter** (count)
   - **Số tin đăng** (active jobs count)
   - **Số hồ sơ nhận** (total applications)
   - **Trạng thái** (Active/Inactive)
   - **Ngày tham gia** (first recruiter signup date)
   - **Thao tác** (Xem chi tiết / Vô hiệu hóa)
4. Bảng hỗ trợ:
   - Sort theo: Tên, Số tin đăng, Số hồ sơ
   - Search theo tên công ty
   - Filter theo trạng thái
   - Phân trang: 20 công ty/trang
5. Admin click "Xem chi tiết" một công ty
6. Hệ thống hiển thị trang chi tiết với:
   - **Thông tin công ty:**
     - Tên, Website, Logo
     - Mô tả (nếu có)
     - Địa chỉ, Quy mô
   - **Danh sách Recruiters** của công ty (bảng):
     - Tên, Email, Phone
     - Ngày tham gia
     - Số tin đã đăng
     - Trạng thái account
   - **Danh sách Jobs** của công ty:
     - Title, Status, Applications count
     - Ngày đăng
   - **Thống kê:**
     - Tổng số tin đã đăng
     - Tổng số hồ sơ nhận
     - Tỷ lệ offer/reject
     - Avg time to hire
7. Admin có thể thực hiện:
   - **Chỉnh sửa thông tin công ty:**
     - 7a1. Click "Chỉnh sửa"
     - 7a2. Sửa company_name, website, logo, description
     - 7a3. Cập nhật cho tất cả Recruiters của công ty
     - 7a4. Log: "Admin updated company {name}"
   - **Vô hiệu hóa công ty:**
     - 7b1. Click "Vô hiệu hóa công ty"
     - 7b2. Nhập lý do
     - 7b3. Xác nhận (cảnh báo: Tất cả tin đăng sẽ bị đóng)
     - 7b4. Hệ thống:
       - Set tất cả Recruiters: is_active = False
       - Set tất cả Jobs: status = CLOSED
       - Gửi email thông báo cho Recruiters
     - 7b5. Log: "Admin disabled company {name}"
   - **Kích hoạt lại công ty:**
     - 7c1. Click "Kích hoạt"
     - 7c2. Xác nhận
     - 7c3. Set is_active = True cho Recruiters
     - 7c4. Jobs vẫn CLOSED, recruiter tự mở lại

**Luồng sự kiện phụ:**

**3a. Công ty có nhiều tên (typo, inconsistent):**

- 3a1. Admin thấy: "ABC Company", "ABC Co.", "ABC"
- 3a2. Admin merge các công ty (tool riêng)
- 3a3. Chọn tên chính thức
- 3a4. Cập nhật tất cả Recruiters về tên thống nhất

**7b3. Không thể vô hiệu hóa:**

- Nếu công ty có job đang có ứng viên ở trạng thái INTERVIEW
- Hiển thị cảnh báo: "Vui lòng hoàn tất các phỏng vấn trước"
- Admin phải xử lý thủ công hoặc force disable

**Yêu cầu đặc biệt:**

- **Company verification:** Admin có thể verify công ty (badge "✓ Verified")
- **Featured company:** Admin đánh dấu công ty nổi bật (hiển thị ưu tiên)
- **Analytics:** Export báo cáo công ty (Excel) với thống kê chi tiết
- **Bulk actions:** Chọn nhiều công ty → Vô hiệu hóa/Kích hoạt cùng lúc
- **Audit log:** Mọi thao tác với công ty phải được log

**Tần suất sử dụng:** Thấp

---

### UC-38: Xem dashboard thống kê

**Mô tả:** Admin xem tổng quan, thống kê toàn hệ thống qua dashboard với charts và metrics

**Actor chính:** Admin

**Tiền điều kiện:**

- Admin đã đăng nhập

**Hậu điều kiện:**

- Dashboard được hiển thị với dữ liệu real-time

**Luồng sự kiện chính:**

1. Admin truy cập trang "Dashboard" (hoặc trang chủ sau khi login)
2. Hệ thống query dữ liệu thống kê:
   - Tổng số users (group by role)
   - Tổng số jobs (group by status)
   - Tổng số applications (group by status)
   - Tổng số interviews
   - Recruitment results (OFFER/REJECT)
   - Dữ liệu theo thời gian (30 ngày gần nhất)
3. Hệ thống hiển thị dashboard với layout:

   **Section 1: Key Metrics (Cards với icon):**

   - **Tổng người dùng:** 1,234
     - Candidates: 800
     - Recruiters: 400
     - Interviewers: 30
     - Admins: 4
   - **Tin tuyển dụng:** 156
     - Active: 89
     - Draft: 12
     - Closed: 55
   - **Hồ sơ ứng tuyển:** 3,456
     - Pending: 234
     - Screening: 567
     - Interview: 123
     - Offer: 89
     - Rejected: 2,443
   - **Tỷ lệ thành công:** 2.6%
     - (OFFER / Total applications) \* 100

   **Section 2: Charts:**

   **2.1. Line Chart - "Người dùng mới theo thời gian":**

   - X-axis: 30 ngày gần nhất
   - Y-axis: Số người dùng đăng ký
   - Lines: Candidates (xanh), Recruiters (cam), Interviewers (xanh lá)

   **2.2. Bar Chart - "Hồ sơ theo trạng thái":**

   - X-axis: PENDING, SCREENING, INTERVIEW, OFFER, REJECTED
   - Y-axis: Số lượng
   - Colors: Xanh, Vàng, Cam, Xanh lá, Đỏ

   **2.3. Pie Chart - "Phân bố người dùng theo role":**

   - Segments: CANDIDATE (65%), RECRUITER (32%), INTERVIEWER (2%), ADMIN (1%)

   **2.4. Area Chart - "Tin tuyển dụng theo thời gian":**

   - X-axis: 30 ngày
   - Y-axis: Số tin đăng
   - Areas: Active (xanh), Closed (xám)

   **2.5. Horizontal Bar - "Top 10 công ty có nhiều tin tuyển dụng nhất":**

   - Y-axis: Company name
   - X-axis: Số tin đăng

   **Section 3: Tables:**

   **3.1. "Tin tuyển dụng mới nhất" (5 jobs):**

   - Columns: Title, Company, Status, Applications, Ngày đăng

   **3.2. "Hồ sơ mới nhất" (10 applications):**

   - Columns: Candidate, Job, Status, Điểm AI, Ngày nộp

   **3.3. "Phỏng vấn sắp tới" (5 interviews):**

   - Columns: Candidate, Job, Interviewer, Thời gian

4. Dashboard tự động refresh mỗi 5 phút (hoặc có nút "Refresh")
5. Admin có thể:
   - Chọn date range (7 ngày / 30 ngày / 90 ngày / Tùy chỉnh)
   - Export dashboard dưới dạng PDF report
   - Click vào số liệu → Xem chi tiết (ví dụ: Click "156 Jobs" → Trang quản lý jobs)

**Luồng sự kiện phụ:**

**5a. Export PDF report:**

- 5a1. Admin click "Export PDF"
- 5a2. Chọn date range và sections cần export
- 5a3. Hệ thống generate PDF với:
  - Logo, header
  - Tất cả metrics (dạng số và text)
  - Charts (convert thành images)
  - Tables
  - Footer: Generated by {admin_name} at {datetime}
- 5a4. Download "dashboard*report*{date}.pdf"

**5b. Filter by date range:**

- 5b1. Admin chọn date range
- 5b2. Hệ thống re-query data
- 5b3. Re-render tất cả charts và metrics
- 5b4. Animate transition

**Yêu cầu đặc biệt:**

- **Performance:**
  - Cache metrics (Redis) 5 phút
  - Aggregation queries phải optimize (indexes)
  - Charts render client-side (Chart.js hoặc Recharts)
- **Real-time:**
  - WebSocket update metrics khi có event mới
  - Badge notification nếu có vấn đề (ví dụ: Spike in rejections)
- **Responsive:** Dashboard phải hiển thị tốt trên mobile/tablet
- **Accessibility:** Charts có alt text, color-blind friendly
- **Drill-down:** Click vào metric/chart → Chi tiết hơn
- **Comparison:** Hiển thị % change so với kỳ trước
  - Ví dụ: "1,234 users (+12% so với tuần trước)"

**Additional Metrics (Advanced):**

- **Avg time to hire:** Thời gian TB từ nộp hồ sơ → offer
- **Avg applications per job:** 3,456 / 156 = 22.1
- **Interview-to-offer ratio:** Tỷ lệ offer/interview
- **Top skills in demand:** Word cloud từ job descriptions
- **Peak posting time:** Giờ nào có nhiều tin đăng nhất
- **Peak application time:** Giờ nào có nhiều hồ sơ nộp nhất

**Tần suất sử dụng:** Cao (Admin check hàng ngày)

---

### UC-39: Xuất báo cáo

**Mô tả:** Admin xuất báo cáo chi tiết dưới dạng Excel hoặc PDF về các hoạt động trong hệ thống

**Actor chính:** Admin

**Tiền điều kiện:**

- Admin đã đăng nhập
- Có dữ liệu để xuất

**Hậu điều kiện:**

- File báo cáo (Excel/PDF) được generate
- File được download về máy admin

**Luồng sự kiện chính:**

1. Admin truy cập "Báo cáo" → "Xuất báo cáo"
2. Hệ thống hiển thị form với các options:

   **Bước 1: Chọn loại báo cáo**

   - [ ] Báo cáo tuyển dụng (Recruitment Report)
   - [ ] Báo cáo người dùng (User Report)
   - [ ] Báo cáo hoạt động (Activity Report)
   - [ ] Báo cáo công ty (Company Report)
   - [ ] Báo cáo tài chính (Financial Report - nếu có billing)

   **Bước 2: Chọn kỳ báo cáo**

   - ( ) Tuần này
   - ( ) Tháng này
   - ( ) Quý này (Q1/Q2/Q3/Q4)
   - ( ) Năm này
   - (•) Tùy chỉnh: [Start Date] → [End Date]

   **Bước 3: Chọn định dạng**

   - ( ) Excel (.xlsx) - Dữ liệu chi tiết, có thể phân tích tiếp
   - (•) PDF (.pdf) - Báo cáo formatted, ready to print

   **Bước 4: Tùy chọn bổ sung**

   - [x] Bao gồm biểu đồ
   - [x] Bao gồm thống kê tóm tắt
   - [ ] Chỉ dữ liệu tóm tắt (không chi tiết)
   - [ ] Nhóm theo công ty
   - [ ] Nhóm theo tháng

3. Admin click "Xuất báo cáo"
4. Hệ thống validate input
5. Hệ thống hiển thị loading "Đang tạo báo cáo... (có thể mất vài phút)"
6. Hệ thống tạo Celery task để generate report async:
   ```python
   generate_report.delay(
       report_type='recruitment',
       start_date='2024-01-01',
       end_date='2024-12-31',
       format='pdf',
       options={...}
   )
   ```
7. Celery worker xử lý:
   - 7a. Query dữ liệu từ DB theo filter
   - 7b. Aggregate statistics
   - 7c. Generate charts (matplotlib/plotly)
   - 7d. **Nếu Excel:**
     - Sử dụng openpyxl/xlsxwriter
     - Tạo multiple sheets (Summary, Details, Charts)
     - Apply formatting (colors, borders, formulas)
   - 7e. **Nếu PDF:**
     - Sử dụng ReportLab/WeasyPrint
     - Render HTML template → PDF
     - Include charts as images
   - 7f. Lưu file vào storage (S3/local)
   - 7g. Generate signed download URL (expire 1 giờ)
8. Hệ thống gửi notification cho Admin:
   - "Báo cáo đã sẵn sàng. Click để tải xuống."
9. Admin click notification hoặc refresh trang
10. Hệ thống hiển thị link download
11. Admin click "Tải xuống"
12. Browser tải file: `recruitment_report_2024.pdf`

**Cấu trúc báo cáo:**

**A. Báo cáo Tuyển dụng (Recruitment Report):**

- **Summary Page:**
  - Tổng số tin đăng
  - Tổng số hồ sơ nhận
  - Tỷ lệ offer/reject
  - Avg time to hire
  - Top 5 jobs có nhiều ứng viên nhất
- **Details Pages:**
  - Bảng chi tiết tất cả jobs với: Title, Company, Applications, Offers, Rejections, Status
  - Bảng chi tiết tất cả applications với: Candidate, Job, Status, AI Score, Interview Score, Result
- **Charts:**
  - Applications by status (Pie)
  - Applications over time (Line)
  - Top companies (Bar)
  - Avg time to hire by company (Bar)

**B. Báo cáo Người dùng (User Report):**

- **Summary:**
  - Tổng users by role
  - New signups this period
  - Active users (login trong 30 ngày)
  - Inactive users
- **Details:**
  - Bảng tất cả users với: Name, Email, Role, Signup Date, Last Login, Status
- **Charts:**
  - Users by role (Pie)
  - New signups over time (Line)
  - Active vs Inactive (Bar)

**C. Báo cáo Hoạt động (Activity Report):**

- **System Activity:**
  - Total logins
  - Total job posts
  - Total applications
  - Total interviews
  - Total emails sent
- **Details:**
  - Activity log table (recent 1000 actions)
- **Charts:**
  - Activity by hour of day (Heatmap)
  - Activity by day of week (Bar)

**Luồng sự kiện phụ:**

**7. Generate report timeout (>5 phút):**

- 7a. Task vẫn chạy background
- 7b. Gửi email cho Admin khi xong:
  - Subject: "Báo cáo của bạn đã sẵn sàng"
  - Link download trong email

**11a. Download link expired:**

- 11a1. Hiển thị "Link đã hết hạn"
- 11a2. Admin click "Tạo lại link"
- 11a3. Hệ thống generate URL mới (không cần generate lại report)

**Yêu cầu đặc biệt:**

- **Performance:**
  - Reports lớn (>10k rows) phải async
  - Timeout: 10 phút
  - Progress bar nếu có thể
- **Storage:**
  - Lưu reports 30 ngày
  - Auto-delete sau đó
  - Admin có thể xem lịch sử reports đã xuất
- **Security:**
  - Download URL phải signed, expire 1 giờ
  - Chỉ admin tạo report mới download được
- **Quality:**
  - Excel: Freeze panes, auto-filter, format đẹp
  - PDF: Logo, header/footer, page numbers, table of contents
- **Scheduling:**
  - Admin có thể schedule báo cáo định kỳ (tuần/tháng)
  - Tự động gửi email vào sáng thứ 2 hoặc đầu tháng

**Tần suất sử dụng:** Thấp (Tuần 1 lần hoặc cuối tháng)

---

### UC-40: Xem log hệ thống

**Mô tả:** Admin xem chi tiết log các hoạt động trong hệ thống để audit, debug và bảo mật

**Actor chính:** Admin

**Tiền điều kiện:**

- Admin đã đăng nhập
- Hệ thống đang ghi log (middleware)

**Hậu điều kiện:**

- Logs được hiển thị và có thể filter/search

**Luồng sự kiện chính:**

1. Admin truy cập "Log hệ thống" hoặc "Audit Trail"
2. Hệ thống query ActivityLog table (hoặc file logs)
3. Hệ thống hiển thị bảng logs với các cột:
   - **Timestamp** (YYYY-MM-DD HH:mm:ss)
   - **User** (Name + Avatar, hoặc "System")
   - **Action** (Dropdown: login, logout, create, update, delete, view, download, etc.)
   - **Resource Type** (User, Job, Application, Interview, etc.)
   - **Resource ID** (Link đến object nếu còn tồn tại)
   - **Status** (Badge: SUCCESS màu xanh / ERROR màu đỏ / WARNING màu vàng)
   - **IP Address** (xxx.xxx.xxx.xxx)
   - **User Agent** (Browser info - tooltip)
   - **Details** (Expandable: Before/After values, Error message)
4. Bảng hiển thị 100 logs mới nhất, phân trang 100 logs/trang
5. Admin có thể **filter**:
   - **Theo User:** Dropdown chọn user (hoặc search)
   - **Theo Action:** Checkboxes (login, create, update, delete, v.v.)
   - **Theo Resource Type:** Dropdown (User, Job, Application, v.v.)
   - **Theo Status:** SUCCESS / ERROR / WARNING / ALL
   - **Theo Thời gian:** Date range picker hoặc presets:
     - Last 1 hour
     - Last 24 hours
     - Last 7 days
     - Last 30 days
     - Custom range
   - **Theo IP:** Nhập IP address (để track suspicious activity)
6. Admin có thể **search** full-text:
   - Search trong: User name, Action, Resource type, Details
   - Ví dụ: Search "delete" → Tìm tất cả actions xóa
   - Ví dụ: Search "john@example.com" → Tất cả logs của user này
7. Admin click vào 1 log để xem chi tiết
8. Hệ thống hiển thị modal/page với thông tin đầy đủ:
   - **Basic Info:**
     - ID, Timestamp, User, IP, User Agent
   - **Action Details:**
     - Action type, Resource type, Resource ID
     - Status, Error message (nếu có)
   - **Changes (nếu update):**
     - Before: { "name": "Old Name", "status": "DRAFT" }
     - After: { "name": "New Name", "status": "ACTIVE" }
     - Diff highlighting
   - **Context:**
     - Request URL, Method (GET/POST/PUT/DELETE)
     - Request params/body (sanitized - không log password)
     - Response status code
   - **Related Logs:**
     - Các logs liên quan (cùng user, cùng resource)
9. Admin có thể **export logs:**
   - Click "Export"
   - Chọn format: CSV / JSON
   - Download file với logs đã filter

**Luồng sự kiện phụ:**

**6a. Search không có kết quả:**

- 6a1. Hiển thị "Không tìm thấy log nào"
- 6a2. Gợi ý thử filter khác

**9a. Export quá nhiều logs (>100k):**

- 9a1. Hiển thị warning "Quá nhiều logs, vui lòng filter thêm"
- 9a2. Hoặc tạo async export task, gửi email khi xong

**Các loại Action được log:**

**1. Authentication:**

- `login` - User đăng nhập (IP, User Agent)
- `logout` - User đăng xuất
- `failed_login` - Đăng nhập thất bại (track brute force)
- `signup` - Đăng ký mới
- `verify_otp` - Xác thực OTP
- `password_reset` - Reset mật khẩu

**2. CRUD Operations:**

- `create_user` - Admin tạo user mới
- `update_user` - Cập nhật thông tin user (log before/after)
- `delete_user` - Xóa user (soft delete)
- `create_job` - Tạo tin tuyển dụng
- `update_job` - Sửa tin
- `delete_job` - Xóa tin
- `create_application` - Nộp hồ sơ
- `update_application_status` - Đổi trạng thái hồ sơ
- `create_interview` - Tạo lịch phỏng vấn
- `update_interview` - Cập nhật lịch
- `create_recruitment_result` - Tạo kết quả TD

**3. System Actions:**

- `send_email` - Gửi email (to, subject, status)
- `ai_screening` - AI sàng lọc CV (application_id, score)
- `file_upload` - Upload file (CV, avatar)
- `file_download` - Download CV
- `export_report` - Xuất báo cáo

**4. Security:**

- `permission_denied` - User cố truy cập resource không được phép
- `suspicious_activity` - Hệ thống detect hành vi bất thường
- `account_locked` - Tài khoản bị khóa
- `account_unlocked` - Mở khóa

**Yêu cầu đặc biệt:**

- **Performance:**
  - Index trên (timestamp, user_id, action, status)
  - Partition logs theo tháng (nếu quá nhiều)
  - Archive logs > 1 năm sang cold storage
- **Security:**
  - Logs phải immutable (không sửa/xóa được)
  - Chỉ Admin xem được
  - Sensitive data (password, token) KHÔNG được log
- **Retention:**
  - Hot logs: 90 ngày (DB, query nhanh)
  - Warm logs: 1 năm (Elasticsearch/S3)
  - Cold logs: >1 năm (Archive, chỉ khi cần)
- **Alerting:**
  - Tự động cảnh báo nếu:
    - Quá nhiều failed_login từ 1 IP (brute force)
    - Quá nhiều errors trong 5 phút
    - Sensitive actions (delete_user, update_permissions) → Notification ngay
- **Compliance:**
  - Đáp ứng yêu cầu audit (GDPR, SOC2)
  - Có thể prove "ai làm gì, khi nào"

**UI/UX:**

- Real-time log stream (WebSocket) - Logs mới xuất hiện tự động
- Color coding: SUCCESS (xanh), ERROR (đỏ), WARNING (vàng), INFO (xám)
- Expandable rows (click để xem details, không cần modal)
- Keyboard shortcuts: `/` để focus search, `Ctrl+K` để filter

**Tần suất sử dụng:** Trung bình (Admin check khi có vấn đề hoặc audit định kỳ)

---

## Tổng kết

**Thống kê Use Case:**

- Tổng số: 40 Use Cases
- Độ ưu tiên Cao: 25 UC
- Độ ưu tiên Trung bình: 10 UC
- Độ ưu tiên Thấp: 5 UC

**Actors chính:**

- Candidate: 15 UC
- Recruiter: 20 UC
- Interviewer: 5 UC
- Admin: 8 UC
- AI System: 3 UC
- Email Service: tích hợp trong nhiều UC

**Nhóm Use Case theo module:**

1. **Authentication** (6 UC): Đăng ký, đăng nhập, xác thực
2. **Job Management** (7 UC): CRUD tin tuyển dụng
3. **Application Management** (7 UC): Quản lý hồ sơ ứng tuyển
4. **AI Screening** (3 UC): Sàng lọc CV tự động
5. **Interview Management** (6 UC): Quản lý phỏng vấn
6. **Result Management** (3 UC): Kết quả tuyển dụng
7. **Notification** (3 UC): Thông báo hệ thống
8. **Admin** (5 UC): Quản trị hệ thống

**Độ phức tạp:**

- **Phức tạp cao**: UC-14 (Nộp hồ sơ), UC-21 (AI screening), UC-27 (Kết quả PV)
- **Phức tạp trung bình**: UC-25 (Lịch PV), UC-30 (Kết quả TD)
- **Phức tạp thấp**: UC-03 (Đăng nhập), UC-08 (Xem danh sách)

---

_Document này mô tả đầy đủ các Use Case của Hệ thống Tuyển dụng Nhân sự. Các Use Case đã được đặc tả chi tiết với luồng sự kiện chính, phụ, tiền/hậu điều kiện để phục vụ cho việc phát triển và testing._
