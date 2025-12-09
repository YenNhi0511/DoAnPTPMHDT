# BIÊN BẢN CUỘC HỌP KHỞI ĐỘNG DỰ ÁN

**Ngày:** 28/08/2024

**Tên dự án:** Xây dựng Hệ thống Quản lý Tuyển dụng (Recruitment Management System)

**Địa điểm:** Online Meeting (Google Meet)

**Thời gian:** 14:00 - 16:30 (2.5 giờ)

---

## 1. MỤC TIÊU CUỘC HỌP

Chính thức khởi động dự án, giới thiệu các thành viên chủ chốt, thống nhất mục tiêu, phạm vi, ngân sách và kế hoạch triển khai dự án để đảm bảo sự đồng thuận và cam kết từ tất cả các bên liên quan ngay từ giai đoạn đầu.

---

## 2. THÀNH PHẦN THAM DỰ

| STT | Họ và Tên         | Vai Trò                           | Ghi Chú |
| --- | ----------------- | --------------------------------- | ------- |
| 1   | Đinh Thị Yến Nhi  | Nhóm trưởng, Full-stack Developer | Có mặt  |
| 2   | Nguyễn Hoàng Vĩ   | Thành viên, Full-stack Developer  | Có mặt  |
| 3   | Thầy/Cô hướng dẫn | Người phê duyệt dự án             | Có mặt  |

---

## 3. NỘI DUNG CUỘC HỌP

### 3.1. Giới Thiệu Thành Viên

**Đinh Thị Yến Nhi (Nhóm trưởng):**

- Trách nhiệm: Quản lý dự án, phân tích yêu cầu, thiết kế hệ thống, full-stack development, deployment
- Kinh nghiệm: Web development với Django và React, có kinh nghiệm về database design và cloud deployment
- Thời gian cam kết: 12 tuần full-time

**Nguyễn Hoàng Vĩ (Thành viên):**

- Trách nhiệm: Hỗ trợ phân tích yêu cầu, thiết kế UI/UX, phát triển frontend, testing, documentation
- Kinh nghiệm: Frontend development với React, UI/UX design, có kiến thức về RESTful API
- Thời gian cam kết: 12 tuần full-time

### 3.2. Bối Cảnh Dự Án

**Vấn đề hiện tại:**

- Quy trình tuyển dụng truyền thống tốn nhiều thời gian và nhân lực
- Quản lý hồ sơ ứng viên thủ công dễ sai sót và khó theo dõi
- Thiếu công cụ hỗ trợ đánh giá và so sánh ứng viên một cách khách quan
- Khó khăn trong việc lên lịch và quản lý phỏng vấn
- Không có hệ thống tập trung để theo dõi toàn bộ recruitment pipeline

**Nhu cầu thực tế:**

- Doanh nghiệp cần digitalize quy trình tuyển dụng để tăng hiệu quả
- HR recruiters cần công cụ quản lý ứng viên từ application đến offer
- Candidates cần platform minh bạch để apply và theo dõi trạng thái
- Hiring managers cần dashboard để monitor và make data-driven decisions

**Giải pháp đề xuất:**
Xây dựng hệ thống quản lý tuyển dụng toàn diện hỗ trợ:

- Đăng tin tuyển dụng và quản lý job postings
- Tiếp nhận và quản lý hồ sơ ứng tuyển
- Lên lịch và quản lý phỏng vấn
- Đánh giá ứng viên và ra quyết định tuyển dụng
- Gửi offer letter và onboarding workflow
- Analytics và reporting

### 3.3. Xem Xét Tài Liệu Dự Án

**Đã thông qua:**

- ✅ Project Charter (Hiến chương dự án)
- ✅ Preliminary Scope Statement (Phạm vi sơ bộ)
- ✅ Stakeholder Analysis (Phân tích bên liên quan)

**Đang xem xét:**

- 📝 Work Breakdown Structure (WBS) - Sẽ hoàn thiện trong tuần 1
- 📝 Detailed Requirements Document - Sẽ hoàn thiện trong tuần 2
- 📝 System Architecture Design - Sẽ hoàn thiện trong tuần 3-4

**Kế hoạch:**

- Timeline chi tiết 12 tuần với milestones rõ ràng
- Risk Management Plan để identify và mitigate risks
- Quality Assurance Plan để ensure code quality

### 3.4. Cơ Cấu Tổ Chức và Quy Trình Làm Việc

**Cơ cấu nhóm:**

- Nhóm phát triển: 2 thành viên
- Vai trò linh hoạt: Cả hai đều tham gia full-stack development
- Phân công công việc theo tuần và theo module

**Quy trình làm việc:**

- Áp dụng Agile/Scrum methodology đơn giản hóa
- Sprint duration: 1 tuần
- Daily standup: Trao đổi nhanh qua Zalo mỗi sáng
- Sprint planning: Đầu mỗi tuần (thứ 2)
- Sprint review & retrospective: Cuối mỗi tuần (thứ 7)

**Cơ chế báo cáo:**

- Họp tiến độ: Tối thứ 7 hằng tuần (2 giờ)
- Status report: Email/document gửi giảng viên hướng dẫn mỗi tuần
- Emergency meeting: Khi có vấn đề critical cần giải quyết ngay

**Code review process:**

- Mọi code phải được review trước khi merge vào main branch
- Pull Request (PR) bắt buộc cho mọi feature
- Code standards và conventions được document trong project

### 3.5. Phạm Vi Dự Án

**Các chức năng chính (In-scope):**

1. **Module Authentication & Authorization**

   - Đăng ký, đăng nhập với email verification
   - Phân quyền 3 roles: Admin, Recruiter, Candidate
   - Quản lý profile và password recovery

2. **Module Job Management**

   - CRUD operations cho job postings
   - Search và filter jobs (location, salary, type)
   - Job categories và tags
   - Job status management (draft, open, closed)

3. **Module Application Management**

   - Submit application với CV upload
   - Track application status workflow
   - Application review và screening
   - Bulk actions cho recruiters

4. **Module Interview Management**

   - Schedule interviews với calendar integration
   - Manage interview panels và interviewers
   - Interview scorecard và evaluation
   - Email notifications tự động

5. **Module Decision & Offer**

   - Candidate evaluation và comparison
   - Offer letter generation và sending
   - Offer acceptance/rejection workflow
   - Onboarding checklist

6. **Module Admin & Analytics**
   - User management (CRUD)
   - Dashboard với statistics và charts
   - Reports (time-to-hire, source effectiveness)
   - System configuration

**Tính năng nâng cao (Nice-to-have):**

- AI-powered CV parsing (nếu có thời gian)
- Real-time notifications với WebSocket
- Advanced analytics với custom reports

**Không thuộc phạm vi (Out-of-scope):**

- Mobile native apps (chỉ responsive web)
- Payment integration
- Multi-language support (chỉ tiếng Việt/Anh)
- Third-party job board integrations

### 3.6. Thời Gian Triển Khai

**Tổng thời gian:** 12 tuần (84 ngày)

**Ngày bắt đầu:** 28/08/2024

**Ngày kết thúc dự kiến:** 20/11/2024

**Các mốc quan trọng (Milestones):**

| Tuần | Milestone                         | Ngày Hoàn Thành |
| ---- | --------------------------------- | --------------- |
| 2    | Requirements Analysis Complete    | 08/09/2024      |
| 4    | System Design Complete            | 22/09/2024      |
| 6    | Core Modules Development Complete | 06/10/2024      |
| 8    | Advanced Features Complete        | 20/10/2024      |
| 10   | Testing & Bug Fixing Complete     | 03/11/2024      |
| 11   | Deployment to Production          | 10/11/2024      |
| 12   | Documentation & Final Report      | 20/11/2024      |

**Buffer time:**

- Dự phòng 5 ngày cho unplanned work và contingency
- Tuần 11-12 có thời gian linh hoạt để polish và fix issues

### 3.7. Ngân Sách Dự Án

**Chi phí nhân lực:**

| Vai Trò     | Số Người | Giờ/Tuần | Số Tuần | Tổng Giờ | Đơn Giá (VNĐ/h) | Thành Tiền (VNĐ) |
| ----------- | -------- | -------- | ------- | -------- | --------------- | ---------------- |
| Nhóm trưởng | 1        | 40       | 12      | 480      | 60,000          | 28,800,000       |
| Thành viên  | 1        | 40       | 12      | 480      | 50,000          | 24,000,000       |
| **Tổng**    | **2**    |          |         | **960**  |                 | **52,800,000**   |

**Chi phí công cụ và dịch vụ:**

| Hạng Mục           | Mô Tả                                | Chi Phí (VNĐ) |
| ------------------ | ------------------------------------ | ------------- |
| Domain & Hosting   | Railway.app (3 tháng)                | 900,000       |
| Database           | PostgreSQL managed service           | Included      |
| Cloud Storage      | Media files storage                  | 300,000       |
| Development Tools  | VS Code, Postman, Git (Free)         | 0             |
| Communication      | Zalo, Google Meet (Free)             | 0             |
| Project Management | GitHub, Google Drive (Free)          | 0             |
| Testing Tools      | Pytest, React Testing Library (Free) | 0             |
| **Tổng phụ**       |                                      | **1,200,000** |

**Tổng ngân sách dự án:** **54,000,000 VNĐ**

**Phân bổ theo giai đoạn:**

- Phân tích & Thiết kế (20%): 10,800,000 VNĐ
- Phát triển (50%): 27,000,000 VNĐ
- Testing & QA (15%): 8,100,000 VNĐ
- Deployment & Documentation (15%): 8,100,000 VNĐ

### 3.8. Công Nghệ và Công Cụ

**Technology Stack:**

- **Backend:** Django 5.0, Django REST Framework, Python 3.10+
- **Frontend:** React 18, React Router, Axios, Tailwind CSS
- **Database:** PostgreSQL 15
- **Cache:** Redis 7
- **Task Queue:** Celery với Redis broker
- **Deployment:** Railway.app (PaaS)
- **Version Control:** Git, GitHub

**Development Tools:**

- IDE: Visual Studio Code
- API Testing: Postman/Insomnia
- Database Tool: pgAdmin 4
- Design: Figma (wireframes), Draw.io (diagrams)

**Communication & Management:**

- **Giao tiếp:** Zalo (daily), Google Meet (meetings)
- **Quản lý tiến độ:** GitHub Projects, Excel/Sheets
- **Tài liệu:** Google Drive, Markdown files trong repo
- **Quản lý mã nguồn:** GitHub với branch protection

---

## 4. QUYẾT ĐỊNH VÀ CAM KẾT

### 4.1. Các Quyết Định Chính

1. ✅ **Phê duyệt Project Charter** và bắt đầu chính thức dự án từ 28/08/2024

2. ✅ **Chọn Technology Stack:** Django + React + PostgreSQL + Railway deployment

3. ✅ **Xác nhận phạm vi:** Tập trung vào 6 modules chính theo WBS đã định nghĩa

4. ✅ **Thống nhất quy trình:** Agile/Scrum đơn giản hóa với weekly sprints

5. ✅ **Ngân sách:** Phê duyệt ngân sách 54,000,000 VNĐ cho 12 tuần

6. ✅ **Communication plan:** Zalo daily updates, weekly Saturday meetings

### 4.2. Cam Kết Của Các Bên

**Nhóm phát triển cam kết:**

- Đầu tư 40 giờ/tuần cho dự án (mỗi thành viên)
- Tuân thủ timeline và deliverables đã đề ra
- Maintain code quality với proper documentation
- Báo cáo tiến độ đúng hẹn và transparent về issues
- Hoàn thành hệ thống với đầy đủ chức năng theo phạm vi

**Giảng viên hướng dẫn cam kết:**

- Review và feedback về deliverables mỗi tuần
- Hỗ trợ giải đáp thắc mắc technical và process
- Phê duyệt các major decisions và scope changes
- Đánh giá quality và cung cấp guidance

### 4.3. Rủi Ro và Giải Pháp

**Rủi ro đã identify:**

1. **Technical risks:**

   - Thiếu kinh nghiệm với một số technologies
   - **Giải pháp:** Self-learning, online tutorials, documentation

2. **Schedule risks:**

   - Underestimate effort cho complex features
   - **Giải pháp:** Buffer time 5 ngày, weekly progress tracking

3. **Resource risks:**

   - Chỉ có 2 người, nếu 1 người sick có thể delay
   - **Giải pháp:** Cross-training, document everything, pair programming

4. **Scope risks:**
   - Scope creep với feature requests
   - **Giải pháp:** Strict scope control, change request process

---

## 5. NHIỆM VỤ TIẾP THEO

### Tuần 1 (28/08 - 03/09/2024):

**Đinh Thị Yến Nhi:**

- [ ] Finalize Project Charter document
- [ ] Research về các recruitment systems tương tự
- [ ] Setup GitHub repository với initial structure
- [ ] Tạo project management board
- [ ] Draft Requirements Document outline

**Nguyễn Hoàng Vĩ:**

- [ ] Research UI/UX best practices cho recruitment systems
- [ ] Collect sample data và use cases
- [ ] Setup development environment (Python, Node.js)
- [ ] Study Django và React tutorials
- [ ] Prepare questionnaire cho requirements gathering

**Chung:**

- [ ] Họp kick-off với giảng viên hướng dẫn
- [ ] Setup communication channels
- [ ] Thống nhất coding standards và conventions
- [ ] Create initial WBS detailed

### Sprint Planning Meeting: Thứ 2, 02/09/2024, 19:00

---

## 6. KẾT LUẬN

Cuộc họp khởi động dự án đã diễn ra thành công với sự tham gia đầy đủ của các thành viên. Tất cả các bên đã thống nhất về mục tiêu, phạm vi, thời gian và ngân sách của dự án. Project Charter đã được phê duyệt chính thức và dự án bắt đầu từ ngày 28/08/2024.

Nhóm phát triển cam kết hoàn thành dự án **Hệ thống Quản lý Tuyển dụng** trong 12 tuần với chất lượng cao, đáp ứng đầy đủ yêu cầu chức năng và phi chức năng đã đề ra. Quy trình làm việc Agile/Scrum sẽ được áp dụng để đảm bảo tính linh hoạt và khả năng phản hồi nhanh với thay đổi.

Cuộc họp tiếp theo sẽ diễn ra vào **tối thứ 7, 07/09/2024** để review tiến độ tuần 1 và plan cho tuần 2.

---

## 7. CHỮ KÝ XÁC NHẬN

| Vai Trò              | Họ Tên           | Chữ Ký | Ngày       |
| -------------------- | ---------------- | ------ | ---------- |
| Nhóm trưởng          | Đinh Thị Yến Nhi |        | 28/08/2024 |
| Thành viên           | Nguyễn Hoàng Vĩ  |        | 28/08/2024 |
| Giảng viên hướng dẫn |                  |        | 28/08/2024 |

---

**Người ghi biên bản:** Đinh Thị Yến Nhi

**Ngày hoàn thành biên bản:** 28/08/2024

**Phiên bản:** 1.0 - Final
