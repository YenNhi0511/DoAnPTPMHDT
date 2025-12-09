# Mô Tả Sơ Đồ Sequence: Quy Trình Đánh Giá Ứng Viên

## Tổng Quan

Sơ đồ sequence này mô tả quy trình đánh giá ứng viên sau khi hoàn thành buổi phỏng vấn trong hệ thống quản lý tuyển dụng. Quy trình bao gồm việc interviewer submit feedback, hệ thống tự động tính toán kết quả, cập nhật trạng thái và gửi thông báo cho recruiter.

## Các Thành Phần (Actors & Components)

1. **Interviewer (Người phỏng vấn):** Người thực hiện đánh giá ứng viên sau buổi phỏng vấn
2. **Feedback Form:** Giao diện form để interviewer nhập đánh giá
3. **InterviewController:** Controller xử lý business logic của quy trình đánh giá
4. **Database:** Cơ sở dữ liệu lưu trữ thông tin interview, feedback, và application
5. **NotificationService:** Service gửi thông báo email/push notification

## Quy Trình Chi Tiết

### **Bước 1: Truy Cập và Gửi Đánh Giá**

**1. Mở form đánh giá**

- Interviewer truy cập vào form đánh giá của buổi phỏng vấn đã được assigned
- Hệ thống hiển thị form với các thông tin cần thiết

**2. getInterviewDetails(id)**

- InterviewController gọi đến Database để lấy thông tin chi tiết của buổi phỏng vấn
- Bao gồm: thông tin ứng viên, vị trí apply, panel members, thời gian phỏng vấn

**3. Load Interview & Panel Info**

- Controller load thông tin interview và danh sách panel members (những người tham gia phỏng vấn)
- Chuẩn bị dữ liệu để hiển thị trên form

**4. Data Return**

- Database trả về dữ liệu cho Controller
- Controller format và gửi về Feedback Form

**5. Hiển thị thông tin ứng viên**

- Form hiển thị đầy đủ thông tin ứng viên để interviewer có context khi đánh giá
- Bao gồm: tên, CV, vị trí apply, kinh nghiệm

**6. Nhập điểm & Feedback (Tech, Comm, Cultural, etc.)**

- Interviewer điền các tiêu chí đánh giá:
  - **Technical Skills:** Kỹ năng chuyên môn (điểm số)
  - **Communication:** Kỹ năng giao tiếp (điểm số)
  - **Cultural Fit:** Phù hợp văn hóa công ty (điểm số)
  - **Feedback:** Nhận xét chi tiết bằng văn bản
  - Các tiêu chí khác tùy theo vị trí tuyển dụng

**7. Validate Input (Range 0-100)**

- Hệ thống kiểm tra dữ liệu nhập vào:
  - Điểm số phải nằm trong khoảng 0-100
  - Các trường bắt buộc phải được điền
  - Format dữ liệu phải đúng

**8. submitFeedback(data)**

- Sau khi validate thành công, form gửi dữ liệu feedback về Controller
- Dữ liệu bao gồm: interview_id, interviewer_id, scores, comments

### **Transaction: Lưu Đánh Giá Cá Nhân**

**9. saveInterviewPanel (Score & Feedback)**

- Controller lưu đánh giá của từng interviewer vào bảng InterviewPanel
- Mỗi panel member có feedback riêng được lưu độc lập
- Đảm bảo tính toàn vẹn dữ liệu với database transaction

**10. Success**

- Database confirm đã lưu thành công
- Transaction được commit

### **Bước 2: Xử Lý Kết Quả Chung**

**11. Check completion status**

- Controller kiểm tra xem tất cả panel members đã submit feedback chưa
- Query database để đếm số feedback đã nhận vs số panel members

**12. [Vẫn còn người chưa chấm]**

- **Alternative flow:** Nếu còn interviewer chưa submit feedback
- Hệ thống chờ đợi, không tính toán kết quả cuối cùng
- Hiển thị thông báo "Đã lưu. Chờ các interviewer khác submit feedback"

**13. [Tất cả đã hoàn thành (100%)]**

- **Main flow:** Khi tất cả panel members đã submit feedback
- Hệ thống tiến hành tính toán kết quả tổng hợp

#### **Tính Toán & Quyết Định**

**14. Calculate Average Score**

- Controller tính điểm trung bình từ tất cả feedback:
  - Technical Score Average
  - Communication Score Average
  - Cultural Fit Score Average
  - Overall Average Score

**15. Determine Result (Pass/Fail)**

- Hệ thống áp dụng business rules để quyết định kết quả:
  - **AVG >= 70:** PASS (Đạt)
  - **AVG < 50:** FAIL (Không đạt)
  - **50 ≤ AVG < 70:** PENDING (Cần xem xét thêm)

#### **Cập Nhật Trạng Thái (Batch Update)**

**16. Update Interview (Status=COMPLETED)**

- Cập nhật trạng thái của Interview record thành COMPLETED
- Đánh dấu buổi phỏng vấn đã hoàn tất và có kết quả

**17. Update Application (SCREENING_PASSED / REJECTED)**

- Cập nhật trạng thái Application của ứng viên:
  - **SCREENING_PASSED:** Nếu pass, chuyển sang vòng tiếp theo
  - **REJECTED:** Nếu fail, kết thúc quy trình tuyển dụng
  - **PENDING_REVIEW:** Nếu pending, cần hiring manager review

**18. notifyRecruiter(Result)**

- Controller trigger NotificationService để gửi thông báo
- Thông báo gửi đến recruiter phụ trách về kết quả phỏng vấn

**19. Email Sent**

- NotificationService gửi email thông báo với nội dung:
  - Tên ứng viên và vị trí apply
  - Kết quả đánh giá (Pass/Fail/Pending)
  - Điểm trung bình các tiêu chí
  - Link để xem chi tiết feedback
  - Next actions cần thực hiện

**20. Hoàn tất. Kết quả [RESULT]**

- Hệ thống hiển thị thông báo thành công cho interviewer
- Interviewer thấy message confirm đã submit và kết quả tổng hợp (nếu là người cuối)

**21. Hiển thị thông báo thành công**

- Feedback Form hiển thị notification:
  - "Đánh giá đã được gửi thành công"
  - Kết quả tổng hợp (nếu có)
  - Trạng thái của application

## Luồng Thay Thế (Alternative Flow)

### Alt: [Vẫn còn người chưa chấm]

Nếu chưa đủ 100% panel members submit feedback:

1. Hệ thống lưu feedback của interviewer hiện tại
2. Không tính toán kết quả cuối cùng
3. Không cập nhật trạng thái application
4. Không gửi notification cho recruiter
5. Hiển thị message: "Đã lưu. Chờ các interviewer khác hoàn thành đánh giá"

## Business Rules

### Scoring Rules:

- **Thang điểm:** 0-100 cho mỗi tiêu chí
- **Các tiêu chí chính:**
  - Technical Skills (40% weight)
  - Communication Skills (30% weight)
  - Cultural Fit (30% weight)
- **Điểm tổng:** Weighted average của các tiêu chí

### Decision Rules:

- **PASS:** Average Score ≥ 70
  - Chuyển ứng viên sang vòng tiếp theo hoặc offer stage
  - Application status: SCREENING_PASSED
- **FAIL:** Average Score < 50

  - Kết thúc quy trình với ứng viên này
  - Application status: REJECTED
  - Gửi email từ chối lịch sự cho ứng viên

- **PENDING:** 50 ≤ Average Score < 70
  - Cần hiring manager hoặc HR director review
  - Application status: PENDING_REVIEW
  - Schedule meeting để discuss

### Completion Rules:

- **100% Completion:** Tất cả panel members đã submit
- **Partial Completion:** Một số đã submit, một số chưa
- **Timeout Rule:** Nếu sau 48 giờ vẫn chưa đủ feedback, auto-remind hoặc escalate

## Notifications

### Email to Recruiter (khi hoàn tất):

```
Subject: Kết quả phỏng vấn - [Tên ứng viên] - [Vị trí]

Xin chào [Tên Recruiter],

Buổi phỏng vấn với ứng viên [Tên] cho vị trí [Job Title] đã hoàn tất.

Kết quả đánh giá:
- Technical Skills: [Score]/100
- Communication: [Score]/100
- Cultural Fit: [Score]/100
- Overall Average: [Score]/100

Kết luận: [PASS/FAIL/PENDING]

Các feedback chi tiết từ interviewer:
[Xem chi tiết tại đây: Link]

Next Steps:
[Hướng dẫn action tiếp theo]

Trân trọng,
Recruitment System
```

## Error Handling

### Validation Errors:

- **Score out of range:** "Điểm số phải từ 0-100"
- **Missing required fields:** "Vui lòng điền đầy đủ các trường bắt buộc"
- **Invalid interview ID:** "Không tìm thấy thông tin phỏng vấn"

### System Errors:

- **Database connection failed:** Retry logic với exponential backoff
- **Email sending failed:** Queue notification để retry sau
- **Transaction rollback:** Đảm bảo không có partial updates

## Security Considerations

1. **Authorization Check:**

   - Chỉ panel members được assigned mới có quyền submit feedback
   - Không được xem/edit feedback của người khác

2. **Data Privacy:**

   - Feedback chỉ visible cho authorized users (recruiter, hiring manager)
   - Ứng viên không được xem raw feedback scores

3. **Audit Trail:**
   - Log mọi action: who submitted, when, what scores
   - Immutable audit log để compliance và dispute resolution

## Performance Considerations

1. **Database Optimization:**

   - Index trên interview_id, panel_id để query nhanh
   - Aggregate scores được cache để không tính lại mỗi lần

2. **Async Processing:**

   - Email notification được gửi async qua queue (Celery)
   - Không block user trong khi sending email

3. **Transaction Management:**
   - Keep transactions short và focused
   - Use database-level constraints để ensure data integrity

## Testing Scenarios

### Happy Path:

1. Interviewer submit feedback hợp lệ
2. Là người cuối cùng submit
3. Average score = 75 → PASS
4. Application status updated
5. Notification sent successfully

### Edge Cases:

1. **Duplicate submission:** System prevents re-submission
2. **Concurrent submissions:** Transaction isolation handles race conditions
3. **Score exactly 50 or 70:** Boundary testing cho decision logic
4. **Network failure during submit:** Transaction rollback, user retry

### Negative Cases:

1. Invalid scores (negative, > 100)
2. Missing feedback text
3. Unauthorized access attempt
4. Database unavailable

## Improvements & Future Enhancements

1. **Real-time Updates:**

   - WebSocket để notify panel members khi có người submit
   - Live progress bar showing completion percentage

2. **AI-Assisted:**

   - Natural Language Processing để analyze feedback text
   - Suggest scores based on sentiment analysis

3. **Advanced Analytics:**

   - Inter-rater reliability metrics
   - Bias detection trong scoring patterns

4. **Mobile Support:**

   - Mobile-optimized form để submit feedback on-the-go
   - Push notifications thay vì chỉ email

5. **Video Integration:**
   - Link feedback với recorded interview video
   - Timestamp comments để refer back

---

**Ghi chú:** Sơ đồ này thể hiện happy path và main alternative flow. Trong thực tế, còn nhiều edge cases và error scenarios khác cần được handle trong implementation.
