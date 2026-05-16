# 🌸 MamaTrack

**MamaTrack** là sản phẩm web hỗ trợ theo dõi thai kỳ, giúp mẹ bầu ghi nhận tình trạng sức khỏe theo từng tuần, quản lý việc cần làm, nhận lịch khám từ bác sĩ và trò chuyện cùng trợ lý AI đồng hành.

Ứng dụng tập trung vào hai nhóm người dùng chính:

- **Mẹ bầu**
- **Bác sĩ**

> ⚠️ MamaTrack là công cụ hỗ trợ theo dõi và ghi chú. Ứng dụng không thay thế tư vấn, chẩn đoán hoặc điều trị từ bác sĩ.

---

## 1. Tổng quan sản phẩm

MamaTrack giúp quá trình theo dõi thai kỳ trở nên rõ ràng và thuận tiện hơn bằng cách kết nối dữ liệu giữa mẹ bầu và bác sĩ.

Mẹ bầu có thể ghi nhận thông tin sức khỏe, quản lý các việc cần làm và xem lịch khám.  
Bác sĩ có thể quản lý bệnh nhân, xem lịch sử thai kỳ, xem biểu đồ theo dõi và tạo lịch khám cho từng bệnh nhân.

Hệ thống cũng tích hợp xác thực OTP qua email, phân quyền theo vai trò và trợ lý AI hỗ trợ trò chuyện cùng mẹ bầu.

---

## 2. Nhóm người dùng

### 2.1. Mẹ bầu

Mẹ bầu là người sử dụng chính để theo dõi thai kỳ cá nhân.

Các chức năng chính:

- Đăng ký tài khoản bằng email và OTP.
- Đăng nhập với vai trò **Bà bầu**.
- Theo dõi thông tin thai kỳ theo từng tuần.
- Quản lý danh sách việc cần làm.
- Xem lịch khám sắp tới do bác sĩ tạo.
- Trò chuyện với trợ lý AI.
- Cung cấp mã bệnh nhân cho bác sĩ để được theo dõi.

### 2.2. Bác sĩ

Bác sĩ là người theo dõi và hỗ trợ quản lý hồ sơ thai kỳ của bệnh nhân.

Các chức năng chính:

- Đăng nhập với vai trò **Bác sĩ**.
- Thêm bệnh nhân vào danh sách quản lý bằng mã bệnh nhân.
- Tìm kiếm bệnh nhân.
- Xem hồ sơ thai kỳ của bệnh nhân.
- Xem biểu đồ cân nặng theo tuần.
- Xem lịch sử thai kỳ.
- Tạo lịch khám cho bệnh nhân.

---

## 3. Chức năng chung

### 3.1. Trang giới thiệu sản phẩm

Trang chính của MamaTrack giới thiệu tổng quan về sản phẩm, bao gồm:

- Lợi ích dành cho mẹ bầu.
- Lợi ích dành cho bác sĩ.
- Quy trình sử dụng đơn giản.
- Khu vực đăng nhập / đăng ký.
- Phân luồng vai trò:
  - Bà bầu
  - Bác sĩ

### 3.2. Đăng ký tài khoản

Người dùng có thể đăng ký tài khoản theo vai trò đã chọn.

Thông tin đăng ký gồm:

- Email
- Mật khẩu
- Vai trò
- Mã OTP xác thực email

Quy trình đăng ký:

1. Người dùng chọn vai trò.
2. Nhập email và mật khẩu.
3. Bấm nhận mã OTP.
4. Hệ thống gửi mã OTP về email.
5. Người dùng nhập OTP.
6. Nếu OTP hợp lệ, hệ thống tạo tài khoản.

### 3.3. Đăng nhập

Người dùng đăng nhập bằng:

- Email
- Mật khẩu
- Vai trò đã chọn

Hệ thống kiểm tra đúng vai trò đăng nhập:

- Nếu tài khoản là mẹ bầu nhưng chọn bác sĩ, hệ thống không cho đăng nhập.
- Nếu tài khoản là bác sĩ nhưng chọn mẹ bầu, hệ thống không cho đăng nhập.

### 3.4. Đăng xuất

Người dùng có thể đăng xuất khỏi hệ thống.

Khi bấm đăng xuất, hệ thống hiển thị xác nhận:

> Bạn có chắc chắn muốn đăng xuất không?

Nếu người dùng xác nhận, phiên đăng nhập sẽ bị xóa.

### 3.5. Đồng bộ phiên đăng nhập nhiều tab

Hệ thống xử lý trường hợp người dùng mở nhiều tab trên cùng một trình duyệt.

Các tình huống được xử lý:

- Đăng xuất ở một tab thì các tab khác cũng tự mất phiên.
- Đăng nhập bằng vai trò khác ở tab mới thì tab cũ không còn hợp lệ.
- Tránh việc một trình duyệt duy trì nhiều trạng thái đăng nhập khác nhau cùng lúc.

---

## 4. Chức năng dành cho mẹ bầu

### 4.1. Dashboard mẹ bầu

Sau khi đăng nhập, mẹ bầu được chuyển đến dashboard cá nhân.

Dashboard hiển thị:

- Lời chào.
- Mã bệnh nhân.
- Tuần thai hiện tại.
- Cân nặng gần nhất.
- Huyết áp gần nhất.
- Số việc cần làm.
- Số lịch khám sắp tới.

### 4.2. Mã bệnh nhân

Mỗi tài khoản mẹ bầu có một mã bệnh nhân riêng.

Mã này được dùng để:

- Bác sĩ thêm mẹ bầu vào danh sách quản lý.
- Liên kết dữ liệu thai kỳ giữa mẹ bầu và bác sĩ.
- Tạo lịch khám đúng cho từng bệnh nhân.

### 4.3. Theo dõi thai kỳ theo tuần

Mẹ bầu có thể nhập dữ liệu thai kỳ theo từng tuần.

Các trường dữ liệu gồm:

- Tuần thai
- Cân nặng
- Huyết áp
- Ghi chú
- Tâm trạng
- Thai máy

Hệ thống dùng dữ liệu này để tạo lịch sử thai kỳ và hỗ trợ bác sĩ theo dõi tình trạng của bệnh nhân.

### 4.4. Thêm bản ghi thai kỳ

Mẹ bầu có thể thêm dữ liệu cho tuần thai tiếp theo.

Hệ thống kiểm tra:

- Tuần thai được nhập đúng thứ tự.
- Không nhập trùng tuần đã tồn tại.
- Dữ liệu được lưu vào hồ sơ của đúng bệnh nhân.

### 4.5. Sửa bản ghi thai kỳ

Mẹ bầu có thể chỉnh sửa thông tin đã nhập.

Các thông tin có thể sửa:

- Cân nặng
- Huyết áp
- Ghi chú
- Tâm trạng
- Thai máy

### 4.6. Xóa bản ghi thai kỳ

Mẹ bầu có thể xóa bản ghi thai kỳ.

Hệ thống có kiểm tra để hạn chế xóa sai dữ liệu và yêu cầu xác nhận trước khi xóa.

### 4.7. Lịch sử thai kỳ

Hệ thống hiển thị lịch sử thai kỳ dạng bảng.

Bảng lịch sử có các thông tin:

- Tuần
- Cân nặng
- Huyết áp
- Tâm trạng
- Thai máy
- Ghi chú
- Thao tác

Bảng giúp mẹ bầu dễ dàng xem lại quá trình theo dõi của mình qua từng tuần.

### 4.8. Quản lý việc cần làm

Mẹ bầu có thể quản lý danh sách các việc cần làm trong thai kỳ.

Mỗi việc cần làm gồm:

- Tên việc
- Ngày làm
- Thời gian làm
- Trạng thái hoàn thành

Các thao tác hỗ trợ:

- Thêm việc cần làm.
- Sửa việc cần làm.
- Xóa việc cần làm.
- Đánh dấu hoàn thành.

### 4.9. Hoàn thành việc cần làm

Khi mẹ bầu bấm hoàn thành một việc:

- Việc đó được lưu trạng thái hoàn thành.
- Nội dung hiển thị có hiệu ứng gạch ngang / làm mờ.
- Hệ thống hiển thị thông báo chúc mừng.

### 4.10. Lịch khám sắp tới

Mẹ bầu có thể xem lịch khám do bác sĩ tạo.

Thông tin lịch khám gồm:

- Tên lịch khám
- Ngày khám
- Giờ khám
- Địa điểm khám

Mẹ bầu chỉ có quyền xem lịch khám, không được sửa hoặc xóa.

### 4.11. MamaAI

MamaAI là trợ lý AI đồng hành cùng mẹ bầu.

Chức năng:

- Trả lời câu hỏi bằng tiếng Việt.
- Dựa vào lịch sử thai kỳ để phản hồi sát ngữ cảnh hơn.
- Động viên tinh thần mẹ bầu.
- Nhắc người dùng tham khảo bác sĩ nếu vấn đề liên quan đến sức khỏe nghiêm trọng.

MamaAI không thay thế bác sĩ và không đưa ra chẩn đoán y tế chính thức.

---

## 5. Chức năng dành cho bác sĩ

### 5.1. Dashboard bác sĩ

Sau khi đăng nhập, bác sĩ được chuyển đến dashboard quản lý.

Dashboard bác sĩ hỗ trợ:

- Quản lý bệnh nhân.
- Tìm kiếm bệnh nhân.
- Xem hồ sơ thai kỳ.
- Xem biểu đồ.
- Tạo lịch khám.

### 5.2. Quản lý danh sách bệnh nhân

Bác sĩ có thể thêm bệnh nhân vào danh sách quản lý bằng mã bệnh nhân.

Quy trình:

1. Bác sĩ nhập mã bệnh nhân.
2. Hệ thống kiểm tra mã có tồn tại không.
3. Hệ thống kiểm tra tài khoản đó có vai trò là mẹ bầu không.
4. Nếu hợp lệ, bệnh nhân được thêm vào danh sách quản lý.

### 5.3. Chống thêm trùng bệnh nhân

Nếu bác sĩ thêm lại một bệnh nhân đã có trong danh sách, hệ thống sẽ không thêm trùng và hiển thị thông báo phù hợp.

### 5.4. Tìm kiếm bệnh nhân

Bác sĩ có thể tìm kiếm bệnh nhân theo mã bệnh nhân.

Chức năng này giúp bác sĩ nhanh chóng lọc danh sách bệnh nhân đang quản lý.

### 5.5. Xóa bệnh nhân khỏi danh sách quản lý

Bác sĩ có thể xóa bệnh nhân khỏi danh sách quản lý.

Trước khi xóa, hệ thống hiển thị xác nhận để tránh thao tác nhầm.

Việc xóa khỏi danh sách quản lý không đồng nghĩa với xóa tài khoản bệnh nhân.

### 5.6. Xem hồ sơ thai kỳ bệnh nhân

Khi bác sĩ bấm vào một bệnh nhân, hệ thống hiển thị hồ sơ thai kỳ của bệnh nhân đó.

Thông tin bao gồm:

- Lịch sử thai kỳ.
- Cân nặng theo tuần.
- Huyết áp.
- Ghi chú.
- Tâm trạng.
- Thai máy.

### 5.7. Biểu đồ cân nặng

Bác sĩ có thể xem biểu đồ cân nặng của bệnh nhân theo từng tuần.

Biểu đồ giúp bác sĩ quan sát xu hướng thay đổi cân nặng trong thai kỳ.

### 5.8. Lịch sử thai kỳ

Bác sĩ có thể xem lại các bản ghi thai kỳ mà mẹ bầu đã nhập.

Bảng lịch sử giúp bác sĩ nắm được quá trình theo dõi của bệnh nhân một cách trực quan.

### 5.9. Tạo lịch khám

Bác sĩ có thể tạo lịch khám cho bệnh nhân.

Thông tin lịch khám gồm:

- Mã bệnh nhân
- Tên lịch khám
- Ngày khám
- Giờ khám
- Địa điểm khám

Sau khi tạo thành công, lịch khám sẽ hiển thị ở dashboard của mẹ bầu.

### 5.10. Kiểm tra quyền tạo lịch

Bác sĩ chỉ được tạo lịch khám cho bệnh nhân đang nằm trong danh sách quản lý của mình.

Nếu bệnh nhân không thuộc danh sách quản lý, hệ thống không cho tạo lịch.

### 5.11. Kiểm tra trùng lịch khám

Hệ thống kiểm tra lịch khám theo:

- Mã bệnh nhân
- Ngày khám
- Giờ khám

Nếu đã có lịch khám trùng thời gian, hệ thống sẽ thông báo và không tạo thêm lịch mới.

---

## 6. Chức năng backend

### 6.1. Xác thực và phân quyền

Backend xử lý:

- Đăng ký.
- Đăng nhập.
- Kiểm tra role.
- Kiểm tra email.
- Kiểm tra mật khẩu.
- Hash mật khẩu.
- Không trả password về frontend.
- Chặn đăng nhập sai vai trò.

### 6.2. OTP email

Backend xử lý:

- Tạo OTP 6 số.
- Hash OTP trước khi lưu.
- Lưu OTP vào database.
- Ghi đè OTP cũ khi gửi lại.
- Giới hạn thời gian hiệu lực OTP.
- Cooldown gửi lại OTP.
- Gọi Google Apps Script để gửi email.

### 6.3. Quản lý dữ liệu thai kỳ

Backend cung cấp API để:

- Lấy dữ liệu thai kỳ.
- Thêm bản ghi.
- Sửa bản ghi.
- Xóa bản ghi.
- Kiểm tra tuần thai đúng thứ tự.
- Hạn chế trùng dữ liệu.

### 6.4. Quản lý việc cần làm

Backend cung cấp API để:

- Lấy danh sách việc cần làm.
- Thêm việc.
- Sửa việc.
- Đổi trạng thái hoàn thành.
- Xóa việc.

### 6.5. Quản lý bệnh nhân

Backend cung cấp API để:

- Lấy danh sách bệnh nhân theo bác sĩ.
- Thêm bệnh nhân.
- Kiểm tra bệnh nhân tồn tại.
- Kiểm tra bệnh nhân có role mẹ bầu.
- Chống thêm trùng.
- Xóa bệnh nhân khỏi danh sách.

### 6.6. Quản lý lịch khám

Backend cung cấp API để:

- Lấy lịch khám theo bệnh nhân.
- Lấy lịch khám theo bác sĩ.
- Tạo lịch khám.
- Kiểm tra quyền tạo lịch.
- Kiểm tra trùng lịch.

### 6.7. AI Chat

Backend nhận tin nhắn của mẹ bầu và dữ liệu thai kỳ, sau đó gọi Gemini API để tạo phản hồi.

AI được định hướng trả lời:

- Bằng tiếng Việt.
- Ngắn gọn.
- Gần gũi.
- Có tính động viên.
- Không thay thế tư vấn y tế chuyên môn.

---

## 7. Cơ sở dữ liệu

Hệ thống sử dụng SQLite.

Các bảng chính:

- `users`
- `records`
- `otp_verifications`
- `otp_requests`
- `auth_attempts`
- `todos`
- `doctor_patients`
- `appointments`

### 7.1. users

Lưu thông tin tài khoản người dùng:

- Email
- Mật khẩu đã hash
- Vai trò
- Mã bệnh nhân nếu là mẹ bầu

### 7.2. records

Lưu lịch sử thai kỳ theo từng tuần:

- Mã bệnh nhân
- Tuần thai
- Cân nặng
- Huyết áp
- Ghi chú
- Tâm trạng
- Thai máy

### 7.3. otp_verifications

Lưu thông tin OTP:

- Email
- OTP đã hash
- Thời gian hết hạn
- Trạng thái xác thực

### 7.4. otp_requests

Lưu lịch sử gửi OTP để xử lý cooldown gửi lại.

### 7.5. auth_attempts

Lưu lịch sử đăng nhập để hỗ trợ chống đăng nhập sai nhiều lần.

### 7.6. todos

Lưu danh sách việc cần làm của mẹ bầu.

### 7.7. doctor_patients

Lưu quan hệ giữa bác sĩ và bệnh nhân.

### 7.8. appointments

Lưu lịch khám do bác sĩ tạo cho bệnh nhân.

---

## 8. Điểm mạnh của sản phẩm

- Giao diện thân thiện với mẹ bầu.
- Có phân quyền rõ ràng giữa mẹ bầu và bác sĩ.
- Có OTP email khi đăng ký.
- Có quản lý hồ sơ bệnh nhân cho bác sĩ.
- Có lịch khám kết nối giữa bác sĩ và mẹ bầu.
- Có quản lý việc cần làm trong thai kỳ.
- Có AI đồng hành hỗ trợ mẹ bầu.
- Có xử lý nhiều tab đăng nhập.
- Có lưu trạng thái dữ liệu bằng database.

---

## 9. Giới hạn hiện tại

- AI chỉ mang tính hỗ trợ, không thay thế bác sĩ.
- Dữ liệu y tế chưa có quy trình xác nhận chuyên môn chính thức.
- Chưa có tài khoản quản trị viên.
- Chưa có hệ thống thông báo tự động trước lịch khám.
- Chưa có xuất hồ sơ PDF.
- Chưa có upload hình ảnh siêu âm.
- Chưa có phân tích y tế nâng cao.

---

## 10. Hướng phát triển tiếp theo

- Thêm thông báo nhắc lịch khám qua email.
- Thêm xuất PDF hồ sơ thai kỳ.
- Thêm upload ảnh siêu âm.
- Thêm dashboard thống kê nâng cao cho bác sĩ.
- Thêm tài khoản quản trị viên.
- Thêm lịch sử hoạt động của người dùng.
- Thêm phân quyền chi tiết hơn.
- Tăng cường bảo mật phiên đăng nhập bằng session backend.
- Chuyển sang database mạnh hơn khi có nhiều người dùng thật.

---

## ❤️ Mục tiêu sản phẩm

MamaTrack được tạo ra để giúp mẹ bầu theo dõi thai kỳ dễ dàng hơn, đồng thời giúp bác sĩ có một nơi đơn giản để xem thông tin bệnh nhân và lên lịch khám.

**Theo dõi thai kỳ nhẹ nhàng hơn.  
Kết nối bác sĩ thuận tiện hơn.  
Mẹ bầu an tâm hơn.**
