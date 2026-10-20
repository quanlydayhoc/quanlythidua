# Sổ đầu bài điện tử v4 — Trường THPT Bình Thạnh Đông

| File | Đặt ở đâu | Ghi chú |
|---|---|---|
| `index.html` | GitHub Pages (thay file cũ) | **Đã gắn sẵn URL máy chủ** `…/AKfycbw5Ga2co…/exec` |
| `Code.gs` | Apps Script của Google Sheet đang dùng | **Bắt buộc cập nhật** để có các tính năng mới |
| `mau/*.xlsx` | Máy tính | File mẫu: thời khoá biểu, học sinh, phân công, tài khoản |

---

## 1. Nâng cấp từ bản trước (khoảng 5 phút, dữ liệu cũ giữ nguyên)

**Bước 1 – Cập nhật máy chủ (Code.gs).** Chỉ thay `index.html` là chưa đủ, vì thời khoá biểu, phân môn, điểm danh, chữ ký, cảnh báo sửa sổ và sao lưu đều cần máy chủ mới.

1. Mở Google Sheet của sổ đầu bài → **Tiện ích mở rộng → Apps Script**.
2. Xoá toàn bộ nội dung `Code.gs` cũ, dán `Code.gs` mới, rồi bấm **Lưu**.
3. Ở thanh trên, chọn hàm **`caiDatSaoLuu`** → bấm **Chạy** → cấp quyền (Google Drive + chạy theo lịch).
   Bước này tự bổ sung các cột và trang tính mới (TKB, ChuKy…), bật sao lưu hằng ngày lúc 1 giờ sáng và tạo bản sao đầu tiên.
4. **Triển khai → Quản lý triển khai** → biểu tượng bút chì → *Phiên bản*: **Phiên bản mới** → **Triển khai**.
   Làm đúng cách này thì URL `/exec` **giữ nguyên**, không cần sửa `index.html`.

**Bước 2 – Thay `index.html` trên GitHub.** Mở repository → bấm vào `index.html` → biểu tượng thùng rác (xoá) → **Add file → Upload files** → kéo `index.html` mới vào → **Commit changes**. Sau 1–2 phút trang cập nhật. Nếu thấy giao diện cũ, nhấn **Ctrl + F5**.

> Nếu quản trị đăng nhập mà thấy dải đỏ "Máy chủ Apps Script đang chạy phiên bản cũ", nghĩa là chưa làm Bước 1.4 (chưa triển khai phiên bản mới).

---

## 2. Quản trị cấu hình (Cấu hình)

| Tab | Việc cần làm |
|---|---|
| **Trường & năm học** | Tên trường, Hiệu trưởng, Bí thư Đoàn, logo, thứ Hai đầu tuần 1 (khớp vnEdu), đổi mật khẩu quản trị |
| **Điểm & xếp loại** | Điểm chuẩn 100, ngưỡng hạnh kiểm, điểm thi đua theo xếp loại tiết |
| **Quy tắc sổ & cảnh báo** | Số **giờ được sửa mà vẫn hiện chữ đen** (mặc định 24 giờ). Cho phép giáo viên **xoá để ký lại**. Danh sách **môn có phân môn**. Ngưỡng **học sinh cần quan tâm**. |
| **Danh mục vi phạm** | Nội dung và điểm trừ (học sinh / thi đua lớp), khen thưởng |
| **Tài khoản & phân công** | Nhập tài khoản. **Nhập file phân công giảng dạy** (bấm "Tải phân công hiện tại" để có file sửa). Đặt **chữ ký** cho từng giáo viên. |
| **Thời khoá biểu** | Chọn **Áp dụng từ tuần** → chọn file TKB (theo `mau/Mau_ThoiKhoaBieu.xlsx`). Có thể tự cập nhật lớp giảng dạy theo TKB. TKB đổi thì nhập bản mới với tuần mới; các tuần trước vẫn giữ bản cũ. |
| **Lớp & học sinh** | Nhập học sinh toàn trường (Lớp, STT, Họ tên, Ngày sinh, Phụ huynh, SĐT) |
| **Sao lưu & dữ liệu** | Chọn chu kỳ sao lưu (ngày / tuần / tháng) và số bản giữ lại, bấm **Sao lưu ngay**, mở thư mục sao lưu trên Drive, tải file .json |

## 3. Giáo viên ký sổ

- Tiết trống có **sọc mờ** kèm môn và giáo viên theo **thời khoá biểu**. Bấm vào tiết thì môn và phân môn được điền sẵn.
- **Phân môn**: chỉ hiện với các môn quản trị khai báo (Công nghệ, GDQP-AN…). **Bỏ trống nghĩa là không có phân môn.**
- **Điểm danh**: danh sách lớp hiện sẵn. Bấm tên lần 1 = vắng có phép (P), lần 2 = vắng không phép (KP), lần 3 = có mặt.
- Chọn học sinh vi phạm / khen thưởng từ danh mục, xếp loại tiết, đánh dấu xác nhận rồi bấm **Lưu và ký**.
- **Chữ đen**: ghi bình thường, hoặc sửa trong số giờ quản trị cho phép.
- **Chữ đỏ đậm**: sửa, hoặc **xoá rồi ký lại**, sau thời hạn đó. Dòng ghi rõ tên người và ngày giờ, đồng thời báo về chuông của Ban giám hiệu và GVCN.
- **Tài khoản** (góc trên): tải ảnh chữ ký (ký trên giấy trắng rồi chụp) hoặc **vẽ chữ ký** bằng chuột / ngón tay; đổi mật khẩu.

## 4. Cảnh báo

- **Chuông** (Ban giám hiệu, quản trị, GVCN): danh sách tiết bị sửa / xoá / ký lại trong 14 ngày. Chuông đổi màu đỏ khi có thay đổi quá hạn. Bấm một dòng để mở đúng sổ.
- **Học sinh cần quan tâm**: khung viền đỏ trên Sổ đầu bài và Học sinh lớp. Ban giám hiệu và Đoàn trường thấy khung toàn trường ở mục Nề nếp & thi đua. Tiêu chí do quản trị đặt (số lần vi phạm, điểm bị trừ, số tiết vắng không phép trong N ngày, hoặc điểm tháng thấp).

## 5. GVCN báo phụ huynh

**Báo cáo → Thông báo phụ huynh**: chọn **từ ngày – đến ngày**, rồi chọn lớp và học sinh (những em có vi phạm / vắng, tất cả, hoặc một em).

- **Xem**: danh sách kèm **tin nhắn soạn sẵn**, bấm **Sao chép** để dán vào Zalo / SMS.
- **Bản in**: mỗi em một **phiếu thông báo** có quốc hiệu, logo, bảng vi phạm, vắng, khen thưởng, chỗ phụ huynh ghi ý kiến và ký, cùng **chữ ký ảnh của GVCN**.
- **Xuất Excel**: danh sách phụ huynh, SĐT, nội dung vi phạm và cột tin nhắn.

Ở mục **Học sinh lớp**, bấm vào tên một em để xem chi tiết và sao chép tin nhắn của tháng.

## 6. Sao lưu định kỳ

Máy chủ tự tạo **bản sao Google Sheet** trong thư mục `SaoLuu_<tên bảng tính>` trên Google Drive theo chu kỳ đã chọn, giữ đủ số bản gần nhất và tự xoá bản cũ hơn. Kiểm tra trạng thái ở **Cấu hình → Sao lưu & dữ liệu**.

---
Thiết kế: Lương Khánh Tường — Trường THPT Bình Thạnh Đông, An Giang · ĐT/Zalo 0916780807
