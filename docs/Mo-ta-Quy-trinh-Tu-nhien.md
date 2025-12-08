# MÔ TẢ QUY TRÌNH NGHIỆP VỤ TUYỂN DỤNG

Tài liệu này mô tả các quy trình nghiệp vụ chính của hệ thống tuyển dụng bằng ngôn ngữ tự nhiên, dễ hiểu.

---

## 1️⃣ QUY TRÌNH ĐĂNG TIN TUYỂN DỤNG

### 📝 Bước 1: Nhà tuyển dụng điền thông tin

Nhà tuyển dụng vào trang tạo tin tuyển dụng mới và điền các thông tin:

- Tiêu đề công việc (ví dụ: "Lập trình viên Java Senior")
- Mô tả công việc chi tiết
- Yêu cầu ứng viên (kinh nghiệm, kỹ năng...)
- Mức lương (từ bao nhiêu đến bao nhiêu)
- Địa điểm làm việc
- Hạn nộp hồ sơ

### ✅ Bước 2: Hệ thống kiểm tra thông tin

Hệ thống tự động kiểm tra:

- Tất cả thông tin bắt buộc đã điền chưa?
- Hạn nộp hồ sơ có hợp lệ không? (phải từ hôm nay trở về sau)
- Mức lương có hợp lý không?

**Nếu có lỗi:** Hiển thị thông báo lỗi để nhà tuyển dụng sửa lại.

**Nếu hợp lệ:** Chuyển sang bước tiếp theo.

### 💾 Bước 3: Lưu tin tuyển dụng dạng nháp

- Hệ thống tự động liên kết thông tin công ty của nhà tuyển dụng
- Nếu công ty chưa có trong hệ thống, tự động tạo mới
- Lưu tin tuyển dụng với trạng thái "Bản nháp"
- Hiển thị thông báo: "Tin tuyển dụng đã được lưu dạng bản nháp"

### 📢 Bước 4: Đăng tin công khai

Khi nhà tuyển dụng nhấn nút "Đăng tin":

1. **Kiểm tra lần cuối:**

   - Tất cả thông tin đã đầy đủ chưa?
   - Hạn nộp hồ sơ còn hiệu lực chưa?

2. **Đăng tin:**
   - Chuyển trạng thái từ "Bản nháp" sang "Đang tuyển"
   - Thời gian đăng tin được ghi lại

### 🔍 Bước 5: Hệ thống xử lý tự động (chạy đồng thời)

**Xử lý 1 - Tạo chỉ mục tìm kiếm:**

- Hệ thống tự động tạo chỉ mục để ứng viên dễ tìm kiếm tin này
- Lập chỉ mục cho tiêu đề và mô tả công việc

**Xử lý 2 - Gửi thông báo email:**

- Tìm các ứng viên đã đăng ký nhận thông báo theo khu vực/kỹ năng phù hợp
- Tự động gửi email thông báo có tin tuyển dụng mới

### ✨ Hoàn thành

Nhà tuyển dụng nhận thông báo:

- "Tin tuyển dụng đã được đăng thành công"
- Link để xem tin đã đăng

---

## 2️⃣ QUY TRÌNH LÊN LỊCH PHỎNG VẤN

### 👤 Bước 1: Chọn ứng viên

- Nhà tuyển dụng vào danh sách ứng viên đã qua vòng sàng lọc CV
- Chọn ứng viên cần phỏng vấn
- Hệ thống hiển thị thông tin chi tiết của ứng viên đó

### 📅 Bước 2: Điền thông tin lịch phỏng vấn

Nhà tuyển dụng điền:

- Vòng phỏng vấn (vòng 1, 2, 3, hay vòng cuối)
- Hình thức: Video, Điện thoại, hay Trực tiếp tại văn phòng
- Ngày giờ bắt đầu và kết thúc
- Địa điểm (nếu phỏng vấn trực tiếp)
- Chọn những người sẽ phỏng vấn
- Ghi chú thêm (nếu có)

### ✅ Bước 3: Kiểm tra dữ liệu

Hệ thống kiểm tra:

- Thời gian phỏng vấn phải cách hiện tại ít nhất 2 giờ
- Giờ kết thúc phải sau giờ bắt đầu
- Phải chọn ít nhất 1 người phỏng vấn

**Nếu có lỗi:** Hiển thị thông báo lỗi.

### 🔍 Bước 4: Kiểm tra xung đột lịch

Hệ thống tự động kiểm tra:

- Các người phỏng vấn đã chọn có bận trong khung giờ này không?
- Phòng họp có trống không? (nếu phỏng vấn trực tiếp)

**Nếu có xung đột:**

- Hiển thị thông báo: "Người A đang bận trong khung giờ này"
- Đề xuất các khung giờ khác

**Nếu không xung đột:** Chuyển sang bước tiếp theo.

### 💾 Bước 5: Tạo lịch phỏng vấn

- Lưu thông tin lịch phỏng vấn với trạng thái "Đã lên lịch"
- Ghi lại thông tin tất cả người tham gia phỏng vấn

### 🎥 Bước 6: Tạo link họp video (nếu phỏng vấn video)

Nếu chọn hình thức phỏng vấn qua video:

- Hệ thống tự động tạo phòng họp Zoom/Google Meet
- Lưu link phòng họp vào lịch phỏng vấn

### 📆 Bước 7: Tạo sự kiện lịch

Hệ thống tự động:

- Tạo sự kiện trên lịch (Google Calendar/Outlook)
- Tiêu đề: "Phỏng vấn - [Tên ứng viên]"
- Thêm tất cả người tham gia: ứng viên + những người phỏng vấn
- Thêm địa điểm hoặc link video
- Gửi lời mời lịch đến tất cả

### 📧 Bước 8: Gửi email thông báo (chạy đồng thời)

**Email cho ứng viên:**

- Thông tin lịch phỏng vấn
- Thời gian và địa điểm/link
- Tên những người sẽ phỏng vấn
- Hướng dẫn chuẩn bị

**Email cho những người phỏng vấn:**

- Thông tin ứng viên
- CV đính kèm
- Lịch phỏng vấn
- Các tiêu chí đánh giá

### 🔔 Bước 9: Cập nhật trạng thái và tạo nhắc nhở

- Cập nhật trạng thái hồ sơ ứng viên: "Đang trong quá trình phỏng vấn"
- Hệ thống tự động tạo nhắc nhở:
  - 24 giờ trước phỏng vấn: Gửi email nhắc nhở
  - 1 giờ trước phỏng vấn: Gửi email nhắc nhở lần nữa

### ✨ Hoàn thành

Nhà tuyển dụng nhận thông báo:

- "Lịch phỏng vấn đã được tạo thành công"
- Chi tiết lịch phỏng vấn

---

## 3️⃣ QUY TRÌNH ĐÁNH GIÁ ỨNG VIÊN (SAU PHỎNG VẤN)

### 📋 Bước 1: Truy cập form đánh giá

Sau khi phỏng vấn xong:

- Người phỏng vấn vào trang đánh giá ứng viên
- Hệ thống hiển thị thông tin ứng viên vừa phỏng vấn
- Hiển thị form đánh giá

### ✍️ Bước 2: Nhập đánh giá

Người phỏng vấn điền vào form:

- **Kỹ năng chuyên môn:** Cho điểm từ 0-100
- **Kỹ năng giao tiếp:** Cho điểm từ 0-100
- **Kỹ năng giải quyết vấn đề:** Cho điểm từ 0-100
- **Phù hợp văn hóa công ty:** Cho điểm từ 0-100
- **Đánh giá tổng thể:** PASS (đạt), FAIL (không đạt), hoặc PENDING (cần xem xét thêm)
- **Nhận xét chi tiết:** Viết nhận xét bằng văn bản
- **Đề xuất:** (nếu có)

### ✅ Bước 3: Kiểm tra thông tin

Hệ thống kiểm tra:

- Tất cả điểm số trong khoảng 0-100
- Nhận xét không để trống
- Đã chọn kết quả (PASS/FAIL/PENDING)

**Nếu có lỗi:** Hiển thị thông báo.

**Nếu hợp lệ:** Chuyển sang bước tiếp theo.

### 💾 Bước 4: Lưu đánh giá

- Hệ thống tự động tính điểm trung bình: (Chuyên môn + Giao tiếp + Giải quyết vấn đề + Văn hóa) / 4
- Lưu tất cả thông tin đánh giá
- Ghi lại thời gian đánh giá

### 🔍 Bước 5: Kiểm tra tất cả người phỏng vấn đã đánh giá chưa

Hệ thống kiểm tra:

- Có bao nhiêu người phỏng vấn?
- Bao nhiêu người đã nộp đánh giá?

**Trường hợp 1: Chưa đủ người đánh giá**

- Hiển thị thông báo: "Đánh giá của bạn đã được lưu. Đang chờ đánh giá từ người phỏng vấn khác."
- Kết thúc (chờ người khác đánh giá)

**Trường hợp 2: Tất cả đã đánh giá** → Chuyển sang bước tiếp theo

### 📊 Bước 6: Tính điểm tổng hợp

Khi tất cả đã đánh giá:

**Tính điểm trung bình từ tất cả người phỏng vấn:**

Ví dụ:

- Người phỏng vấn A cho điểm trung bình: 79.5
- Người phỏng vấn B cho điểm trung bình: 82.5
- Người phỏng vấn C cho điểm trung bình: 75.8

→ Điểm tổng hợp = (79.5 + 82.5 + 75.8) / 3 = **79.3 điểm**

Cũng tính điểm trung bình cho từng tiêu chí:

- Điểm chuyên môn trung bình
- Điểm giao tiếp trung bình
- Điểm giải quyết vấn đề trung bình
- Điểm văn hóa trung bình

### 🎯 Bước 7: Xác định kết quả cuối cùng

Dựa trên điểm tổng hợp:

- **Điểm >= 70:** **ĐẠT** ✅
- **Điểm < 50:** **KHÔNG ĐẠT** ❌
- **Điểm từ 50-70:** **CẦN XEM XÉT THÊM** ⚠️

### 📝 Bước 8: Cập nhật kết quả

**Nếu ứng viên ĐẠT (>= 70 điểm):**

1. Cập nhật kết quả phỏng vấn: "Hoàn thành - Đạt"
2. Cập nhật trạng thái hồ sơ: "Đã qua phỏng vấn"
3. Gửi email thông báo cho nhà tuyển dụng:
   - "Ứng viên [Tên] đã đạt phỏng vấn"
   - Link xem chi tiết đánh giá

**Nếu ứng viên KHÔNG ĐẠT (< 50 điểm):**

1. Cập nhật kết quả phỏng vấn: "Hoàn thành - Không đạt"
2. Cập nhật trạng thái hồ sơ: "Bị từ chối"
3. Gửi email thông báo cho nhà tuyển dụng:
   - "Ứng viên [Tên] không đạt phỏng vấn"

**Nếu ứng viên CẦN XEM XÉT (50-70 điểm):**

1. Cập nhật kết quả: "Cần xem xét thêm"
2. Gửi thông báo cho nhà tuyển dụng để quyết định thủ công

### ✨ Hoàn thành

Người phỏng vấn nhận thông báo:

- "Đánh giá đã được lưu"
- "Tất cả người phỏng vấn đã đánh giá"
- "Kết quả: ĐẠT/KHÔNG ĐẠT/CẦN XEM XÉT"

---

## 4️⃣ QUY TRÌNH GỬI THƯ MỜI NHẬN VIỆC (OFFER LETTER)

### 📋 Bước 1: Xem danh sách ứng viên đạt yêu cầu

- HR Manager vào danh sách ứng viên đã đạt phỏng vấn
- Hệ thống hiển thị danh sách ứng viên có thể tạo offer

### 👤 Bước 2: Chọn ứng viên

- Chọn ứng viên cần gửi thư mời
- Nhấn nút "Tạo offer letter"
- Hệ thống tự động lấy thông tin ứng viên và công việc

### 📝 Bước 3: Điền thông tin offer

Hệ thống hiển thị form với thông tin đã điền sẵn:

- Thông tin ứng viên
- Tên công việc và mô tả
- Mức lương đề xuất (có thể điều chỉnh)
- Phúc lợi
- Ngày bắt đầu làm việc
- Hạn phản hồi
- Các điều khoản khác

HR Manager có thể điều chỉnh:

- **Lương:** 50,000,000 VND/tháng
- **Phúc lợi:** Bảo hiểm sức khỏe, lương tháng 13, ...
- **Ngày bắt đầu:** 01/06/2024
- **Hạn phản hồi:** 20/05/2024
- **Loại hợp đồng:** Toàn thời gian
- **Thử việc:** 2 tháng
- **Điều khoản bổ sung**

### ✅ Bước 4: Kiểm tra thông tin

Hệ thống kiểm tra:

- Lương phải lớn hơn 0
- Ngày bắt đầu phải sau ngày hiện tại
- Hạn phản hồi phải trước ngày bắt đầu
- Các trường bắt buộc không được để trống

**Nếu có lỗi:** Hiển thị thông báo.

**Nếu hợp lệ:** Chuyển sang bước tiếp theo.

### 💾 Bước 5: Tạo bản ghi kết quả tuyển dụng

Hệ thống lưu thông tin:

- ID hồ sơ ứng viên
- ID nhà tuyển dụng
- Quyết định cuối: "Đề nghị nhận việc"
- Lương đề xuất
- Phúc lợi
- Ngày bắt đầu
- Hạn phản hồi
- Loại hợp đồng
- Trạng thái: "Đang chờ phản hồi"

### 📄 Bước 6: Tạo file PDF thư mời

Hệ thống tự động:

1. Lấy mẫu thư mời nhận việc
2. Điền thông tin vào mẫu:
   - Logo công ty
   - Tên ứng viên
   - Chi tiết công việc
   - Lương và phúc lợi
   - Điều khoản và điều kiện
   - Phần ký tên
3. Tạo file PDF
4. Lưu file lên hệ thống lưu trữ (cloud)
5. Lấy link để tải file PDF

### 📧 Bước 7: Gửi email thư mời

Hệ thống tự động tạo và gửi email:

**Đến:** Email ứng viên

**Tiêu đề:** "Thư mời nhận việc - [Tên công việc]"

**Nội dung:**

- Lời chúc mừng
- Tóm tắt thông tin offer
- File PDF thư mời đính kèm
- Hướng dẫn chấp nhận/từ chối
- Link đến trang phản hồi
- Nhắc nhở về hạn phản hồi

### 🔄 Bước 8: Cập nhật trạng thái hồ sơ

- Cập nhật trạng thái hồ sơ ứng viên: "Đã gửi offer"

### ✨ Hoàn thành

HR Manager nhận thông báo:

- "Offer letter đã được gửi thành công"
- Link xem trước file PDF

---

## 📱 PHẢN HỒI CỦA ỨNG VIÊN (SAU KHI NHẬN OFFER)

### Tình huống A: Ứng viên chấp nhận 🎉

1. Ứng viên nhấn nút "Chấp nhận" trong email
2. Hệ thống cập nhật:
   - Phản hồi ứng viên: "Đã chấp nhận"
   - Trạng thái hồ sơ: "Đã tuyển dụng"
3. Gửi email thông báo cho HR
4. Bắt đầu quy trình nhập việc (onboarding)

### Tình huống B: Ứng viên từ chối 😔

1. Ứng viên nhấn nút "Từ chối"
2. Ứng viên có thể nhập lý do (tùy chọn)
3. Hệ thống cập nhật:
   - Phản hồi ứng viên: "Đã từ chối"
   - Trạng thái hồ sơ: "Từ chối offer"
4. Gửi email thông báo cho HR kèm lý do
5. HR có thể:
   - Thương lượng lại (điều chỉnh lương, ngày bắt đầu, ...)
   - Chọn ứng viên khác

### Tình huống C: Không có phản hồi ⏰

1. Hệ thống kiểm tra hàng ngày
2. **3 ngày trước hạn:** Gửi email nhắc nhở tự động
3. **Đến hạn nhưng vẫn chưa phản hồi:**
   - Cập nhật trạng thái: "Hết hạn"
   - Phản hồi: "Không phản hồi"
   - Gửi thông báo cho HR
4. HR quyết định:
   - Gia hạn thời gian phản hồi
   - Chọn ứng viên khác

---

## 📝 TÓM TẮT CÁC QUY TRÌNH

| Quy trình               | Người thực hiện | Kết quả                                           |
| ----------------------- | --------------- | ------------------------------------------------- |
| **Đăng tin tuyển dụng** | Nhà tuyển dụng  | Tin được đăng công khai, gửi thông báo tự động    |
| **Lên lịch phỏng vấn**  | Nhà tuyển dụng  | Lịch được tạo, gửi email + lời mời lịch tự động   |
| **Đánh giá ứng viên**   | Người phỏng vấn | Điểm số được tính tự động, xác định đạt/không đạt |
| **Gửi thư mời**         | HR Manager      | File PDF tự động, gửi email, theo dõi phản hồi    |

---

## 💡 LỢI ÍCH CỦA HỆ THỐNG TỰ ĐỘNG HÓA

✅ **Tiết kiệm thời gian:** Không phải gửi email thủ công, tạo lịch thủ công

✅ **Không bỏ sót:** Hệ thống tự động nhắc nhở, kiểm tra xung đột lịch

✅ **Minh bạch:** Tất cả đánh giá được lưu lại, có thể xem lại

✅ **Công bằng:** Điểm số được tính tự động theo công thức cố định

✅ **Nhanh chóng:** Kết quả phỏng vấn được tính ngay khi tất cả người đánh giá xong

✅ **Chuyên nghiệp:** Email và tài liệu được tạo tự động theo mẫu chuẩn

---

**Ngày cập nhật:** 09/12/2025
