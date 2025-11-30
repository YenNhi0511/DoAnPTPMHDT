# PHẦN 1: TỔNG QUAN DỰ ÁN

## ĐỀ TÀI: XÂY DỰNG HỆ THỐNG TUYỂN DỤNG NHÂN SỰ

---

## 1.1. Giới Thiệu

### 1.1.1. Bối cảnh

Trong môi trường kinh doanh hiện đại, quá trình tuyển dụng nhân sự đóng vai trò then chốt quyết định sự thành công của doanh nghiệp. Tuy nhiên, phương pháp tuyển dụng truyền thống thường gặp phải nhiều hạn chế:

- **Xử lý thủ công tốn thời gian**: Nhân sự phải sàng lọc hàng trăm CV thủ công
- **Thiếu tính nhất quán**: Đánh giá ứng viên phụ thuộc vào cảm tính cá nhân
- **Khó theo dõi tiến độ**: Không có hệ thống tập trung để quản lý toàn bộ quy trình
- **Giao tiếp kém hiệu quả**: Thông báo cho ứng viên chậm trễ và thiếu chuyên nghiệp
- **Không tận dụng công nghệ AI**: Bỏ lỡ cơ hội tự động hóa và tối ưu hóa quyết định

### 1.1.2. Vấn đề cần giải quyết

Hệ thống tuyển dụng hiện tại của các doanh nghiệp vừa và nhỏ thường gặp các vấn đề:

1. **Khối lượng công việc lớn**: Nhân viên HR phải xử lý hàng trăm hồ sơ mỗi đợt tuyển dụng
2. **Thiếu công cụ đánh giá khách quan**: Dựa vào cảm tính và kinh nghiệm cá nhân
3. **Quy trình phân tán**: Sử dụng nhiều công cụ riêng lẻ (email, Excel, tài liệu giấy)
4. **Mất thông tin**: Không lưu trữ lịch sử tuyển dụng một cách có hệ thống
5. **Trải nghiệm ứng viên kém**: Không nhận được phản hồi kịp thời về trạng thái hồ sơ

### 1.1.3. Giải pháp đề xuất

Xây dựng **Hệ thống Tuyển dụng Nhân sự thông minh** tích hợp công nghệ AI, cung cấp:

- ✅ Nền tảng web tập trung quản lý toàn bộ quy trình tuyển dụng
- ✅ Sàng lọc và đánh giá CV tự động bằng AI (Google Gemini)
- ✅ Quản lý lịch phỏng vấn và phân công ban giám khảo
- ✅ Thông báo tự động qua email cho ứng viên
- ✅ Báo cáo và thống kê chi tiết về hiệu quả tuyển dụng
- ✅ Giao diện riêng cho từng vai trò (Admin, Recruiter, Interviewer, Candidate)

---

## 1.2. Mục Tiêu Dự Án

### 1.2.1. Mục tiêu chung

Xây dựng hệ thống tuyển dụng nhân sự toàn diện, hiện đại, tự động hóa tối đa quy trình từ đăng tin tuyển dụng đến gửi thư mời nhận việc, giúp doanh nghiệp tiết kiệm thời gian, chi phí và nâng cao chất lượng tuyển dụng.

### 1.2.2. Mục tiêu cụ thể

#### A. Về chức năng

1. **Quản lý tin tuyển dụng**: CRUD đầy đủ, đa dạng vị trí và hình thức làm việc
2. **Sàng lọc ứng viên thông minh**: AI đánh giá CV tự động, cho điểm theo tiêu chí
3. **Quản lý phỏng vấn**: Lên lịch, phân công ban giám khảo, ghi nhận kết quả
4. **Quản lý quyết định tuyển dụng**: Lưu trữ kết quả, tạo thư mời nhận việc
5. **Thông báo tự động**: Gửi email xác nhận, thông báo trạng thái theo thời gian thực

#### B. Về hiệu suất

1. Giảm **70%** thời gian sàng lọc CV so với phương pháp thủ công
2. Tăng **50%** tính nhất quán trong đánh giá ứng viên
3. Giảm **80%** công việc gửi email thủ công
4. Xử lý được **500+ ứng viên đồng thời** không gián đoạn

#### C. Về trải nghiệm người dùng

1. Giao diện thân thiện, responsive trên mọi thiết bị (desktop/tablet/mobile)
2. Thời gian phản hồi < 2 giây cho mọi thao tác
3. Ứng viên nhận phản hồi trong vòng 24 giờ sau khi nộp hồ sơ
4. Dashboard trực quan với biểu đồ và thống kê real-time

#### D. Về kỹ thuật

1. Backend RESTful API với Django + PostgreSQL
2. Frontend SPA với React + Tailwind CSS
3. Tích hợp AI (Google Gemini) cho sàng lọc CV
4. Background jobs với Celery + Redis
5. Cloud storage cho CV và tài liệu
6. Security: JWT authentication, RBAC, HTTPS

---

## 1.3. Phạm Vi Dự Án

### 1.3.1. Trong phạm vi (In Scope)

#### A. Chức năng nghiệp vụ

✅ **Quản lý người dùng và phân quyền**

- Đăng ký, đăng nhập, xác thực email
- 4 vai trò: Admin, Recruiter, Interviewer, Candidate
- Quản lý profile cá nhân

✅ **Quản lý tin tuyển dụng**

- Tạo, sửa, xóa tin tuyển dụng
- Thiết lập quy trình tuyển dụng nhiều bước
- Quản lý trạng thái tin (Draft/Open/Closed/Filled)

✅ **Quản lý ứng viên**

- Nộp hồ sơ trực tuyến (upload CV)
- Xem danh sách ứng viên theo tin tuyển dụng
- Lọc và tìm kiếm ứng viên

✅ **Sàng lọc CV thông minh**

- Tự động phân tích CV bằng AI
- Đánh giá kỹ năng, kinh nghiệm, học vấn
- Cho điểm và xếp hạng ứng viên

✅ **Quản lý phỏng vấn**

- Tạo lịch phỏng vấn
- Phân công ban giám khảo
- Ghi nhận điểm đánh giá

✅ **Quản lý kết quả tuyển dụng**

- Lưu trữ quyết định (Hired/Rejected)
- Tạo thư mời nhận việc tự động
- Theo dõi trạng thái offer

✅ **Thông báo tự động**

- Email xác nhận đăng ký
- Thông báo trạng thái hồ sơ
- Nhắc lịch phỏng vấn
- Thông báo kết quả tuyển dụng

✅ **Báo cáo và thống kê**

- Dashboard tổng quan
- Biểu đồ phân tích (ứng viên theo trạng thái, tin tuyển dụng, thời gian)
- Export dữ liệu

#### B. Yêu cầu kỹ thuật

✅ Backend: Django 5.0, Django REST Framework, PostgreSQL
✅ Frontend: React 18, Tailwind CSS, React Router
✅ AI: Google Gemini API
✅ Background tasks: Celery + Redis
✅ Email: SMTP (Gmail)
✅ Storage: Cloud storage cho CV/documents
✅ Security: JWT, RBAC, HTTPS
✅ Deployment: Docker, CI/CD ready

### 1.3.2. Ngoài phạm vi (Out of Scope)

❌ **Tích hợp hệ thống kế toán**: Tính lương, phúc lợi
❌ **Onboarding nhân viên**: Quy trình sau khi nhận việc
❌ **Quản lý nhân sự hiện tại**: Chấm công, đánh giá hiệu suất
❌ **Video interview**: Phỏng vấn trực tuyến qua video call
❌ **Chatbot tư vấn**: Trả lời câu hỏi ứng viên tự động
❌ **Tích hợp mạng xã hội**: Đăng tin lên LinkedIn/Facebook
❌ **Background check**: Xác minh lý lịch, bằng cấp
❌ **Multi-language**: Chỉ hỗ trợ tiếng Việt và tiếng Anh
❌ **Mobile app**: Chỉ có web responsive
❌ **Payment gateway**: Không thu phí ứng viên

---

## 1.4. Đối Tượng Sử Dụng (Stakeholders)

### 1.4.1. Người dùng chính

#### 1. **Admin (Quản trị viên)**

- **Vai trò**: Quản lý toàn bộ hệ thống
- **Quyền hạn**:
  - Quản lý tất cả người dùng (CRUD)
  - Phân quyền vai trò
  - Xem tất cả dữ liệu
  - Cấu hình hệ thống
  - Xem báo cáo tổng quan
- **Lợi ích**:
  - Kiểm soát hoàn toàn hệ thống
  - Theo dõi hiệu suất tuyển dụng
  - Đảm bảo quy trình tuân thủ

#### 2. **Recruiter (Nhân viên tuyển dụng)**

- **Vai trò**: Quản lý quy trình tuyển dụng
- **Quyền hạn**:
  - CRUD tin tuyển dụng
  - Xem và quản lý hồ sơ ứng viên
  - Kích hoạt sàng lọc AI
  - Tạo lịch phỏng vấn
  - Gửi thông báo cho ứng viên
  - Xem báo cáo tuyển dụng
- **Lợi ích**:
  - Tiết kiệm 70% thời gian sàng lọc CV
  - Tập trung vào ứng viên chất lượng cao
  - Quản lý nhiều tin tuyển dụng đồng thời
  - Theo dõi tiến độ real-time

#### 3. **Interviewer (Giám khảo phỏng vấn)**

- **Vai trò**: Đánh giá ứng viên qua phỏng vấn
- **Quyền hạn**:
  - Xem lịch phỏng vấn được phân công
  - Xem hồ sơ ứng viên
  - Ghi nhận điểm và nhận xét
  - Nhận thông báo lịch phỏng vấn
- **Lợi ích**:
  - Xem thông tin ứng viên trước phỏng vấn
  - Quản lý lịch phỏng vấn dễ dàng
  - Ghi nhận đánh giá ngay sau phỏng vấn
  - Không bỏ lỡ lịch hẹn

#### 4. **Candidate (Ứng viên)**

- **Vai trò**: Nộp hồ sơ và theo dõi trạng thái
- **Quyền hạn**:
  - Đăng ký tài khoản
  - Tìm kiếm việc làm
  - Nộp hồ sơ (upload CV)
  - Xem trạng thái hồ sơ
  - Xem lịch phỏng vấn (nếu có)
  - Nhận thông báo qua email
- **Lợi ích**:
  - Nộp hồ sơ nhanh chóng (< 5 phút)
  - Theo dõi trạng thái real-time
  - Nhận phản hồi kịp thời
  - Trải nghiệm chuyên nghiệp

### 1.4.2. Người dùng gián tiếp

#### 5. **Hiring Manager (Trưởng phòng ban)**

- Xem báo cáo ứng viên
- Tham gia quyết định tuyển dụng
- Phê duyệt offer letter

#### 6. **IT Administrator**

- Triển khai và vận hành hệ thống
- Quản lý database, backup
- Xử lý sự cố kỹ thuật

---

## 1.5. Lợi Ích Dự Kiến

### 1.5.1. Lợi ích cho doanh nghiệp

1. **Tiết kiệm thời gian**: Giảm 70% thời gian sàng lọc CV
2. **Tiết kiệm chi phí**: Giảm 50% nhân lực cho quy trình tuyển dụng
3. **Nâng cao chất lượng**: Tăng 30% tỷ lệ tuyển đúng người
4. **Tối ưu quy trình**: Rút ngắn 40% thời gian tuyển dụng (time-to-hire)
5. **Dữ liệu tập trung**: Lưu trữ lịch sử tuyển dụng để phân tích

### 1.5.2. Lợi ích cho ứng viên

1. **Nộp hồ sơ dễ dàng**: Quy trình đơn giản, nhanh chóng
2. **Theo dõi trạng thái**: Biết được vị trí hồ sơ trong quy trình
3. **Phản hồi kịp thời**: Nhận thông báo trong vòng 24 giờ
4. **Trải nghiệm chuyên nghiệp**: Giao diện đẹp, thao tác mượt mà

### 1.5.3. Lợi ích công nghệ

1. **Scalable**: Xử lý được hàng nghìn ứng viên đồng thời
2. **Maintainable**: Code sạch, có tài liệu đầy đủ
3. **Secure**: Bảo mật thông tin cá nhân ứng viên
4. **Modern**: Sử dụng công nghệ AI, cloud, microservices

---

## 1.6. Ràng Buộc Dự Án

### 1.6.1. Ràng buộc thời gian

- **Tổng thời gian**: 16 tuần (4 tháng)
- **Phase 1**: Phân tích và thiết kế (3 tuần)
- **Phase 2**: Phát triển Backend (5 tuần)
- **Phase 3**: Phát triển Frontend (5 tuần)
- **Phase 4**: Testing và deployment (3 tuần)

### 1.6.2. Ràng buộc ngân sách

- **Ngân sách**: Dự án học thuật (miễn phí)
- **Sử dụng dịch vụ free tier**: Neon PostgreSQL, Google Gemini API, Vercel/Netlify
- **Giới hạn API calls**: 60 requests/minute (Gemini free tier)

### 1.6.3. Ràng buộc kỹ thuật

- **Backend**: Python 3.11+, Django 5.0+
- **Frontend**: Node.js 18+, React 18+
- **Database**: PostgreSQL 14+
- **Browser support**: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- **Mobile responsive**: Viewport 320px - 1920px

### 1.6.4. Ràng buộc pháp lý

- **GDPR compliance**: Bảo vệ thông tin cá nhân ứng viên
- **Luật lao động Việt Nam**: Quy trình tuyển dụng công bằng
- **Email spam**: Tuân thủ CAN-SPAM Act

---

## 1.7. Giả Định (Assumptions)

1. **Người dùng có kết nối Internet ổn định** (tối thiểu 1 Mbps)
2. **Ứng viên có email hợp lệ** để nhận thông báo
3. **CV được upload ở định dạng hỗ trợ** (PDF, DOCX)
4. **Doanh nghiệp có quy trình tuyển dụng chuẩn** (Screening → Interview → Offer)
5. **Google Gemini API luôn khả dụng** (99.9% uptime)
6. **Recruiter có kiến thức cơ bản về tuyển dụng**
7. **Interviewer trung thực trong đánh giá**

---

## 1.8. Rủi Ro Dự Án

| Rủi ro                                    | Mức độ     | Tác động                      | Giải pháp                                          |
| ----------------------------------------- | ---------- | ----------------------------- | -------------------------------------------------- |
| **Gemini API bị giới hạn rate limit**     | Cao        | Sàng lọc CV bị chậm           | Implement queue system, cache results              |
| **Database quá tải khi nhiều người dùng** | Trung bình | Hiệu suất giảm                | Optimize queries, add indexing, connection pooling |
| **CV không đúng định dạng**               | Trung bình | AI không parse được           | Validate file format, provide clear instructions   |
| **Email bị vào spam**                     | Thấp       | Ứng viên không nhận thông báo | Use authenticated SMTP, SPF/DKIM records           |
| **Lỗi bảo mật (data breach)**             | Cao        | Mất thông tin cá nhân         | Security audit, encryption, regular updates        |
| **Thiếu training data cho AI**            | Thấp       | Đánh giá CV không chính xác   | Use prompt engineering, few-shot learning          |

---

## 1.9. Tài Liệu Tham Khảo

1. **Django Documentation**: https://docs.djangoproject.com/
2. **React Documentation**: https://react.dev/
3. **Google Gemini API**: https://ai.google.dev/
4. **Celery Documentation**: https://docs.celeryq.dev/
5. **PostgreSQL Manual**: https://www.postgresql.org/docs/
6. **GDPR Guidelines**: https://gdpr.eu/
7. **OWASP Security Best Practices**: https://owasp.org/

---

_Tài liệu này là phần 1 trong bộ tài liệu Yêu cầu Nghiệp vụ. Xem tiếp:_

- **Phần 2**: Yêu cầu Chức năng (FR1-FR10)
- **Phần 3**: Yêu cầu Phi chức năng (NFR1-NFR5)
- **Phần 4**: Use Cases chi tiết
- **Phần 5**: Quy trình Nghiệp vụ
- **Phần 6**: Yêu cầu Kỹ thuật
