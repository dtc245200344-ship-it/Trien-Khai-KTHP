# KỊCH BẢN THUYẾT TRÌNH VÀ DEMO KẾT THÚC HỌC PHẦN
### ĐỀ TÀI 4: HỆ THỐNG CRM CHĂM SÓC KHÁCH HÀNG
**Môn học:** Triển khai và Quản trị Hệ thống Phần mềm (KTHP)

---

## 🎯 MỤC TIÊU CẦN ĐẠT TRONG BUỔI BẢO VỆ
1. Chứng minh hệ thống được đóng gói hoàn chỉnh bằng **Docker Compose** và khởi động chỉ với 1 câu lệnh.
2. Trình diễn đầy đủ các chức năng nghiệp vụ của ứng dụng **CRM Chăm sóc Khách hàng**.
3. Thao tác quản trị trực quan cơ sở dữ liệu **PostgreSQL** qua **pgAdmin 4**.
4. Giải thích cơ chế điều phối và bảo mật của **Nginx Reverse Proxy**.
5. Thuyết minh hệ thống đo kiểm **Prometheus** và dashboard trực quan **Grafana**.
6. Viết câu truy vấn **LogQL** trực tiếp trên **Grafana Loki** để truy xuất log thời gian thực.
7. Giải thích các giải pháp **Bảo mật và Hardening** đã triển khai trong mã nguồn và hạ tầng container.

---

## ⏱️ KỊCH BẢN THỰC HIỆN TỪNG BƯỚC (STEP-BY-STEP)

### BƯỚC 1: KHỞI ĐỘNG HỆ THỐNG TRƯỚC HỘI ĐỒNG (1 phút)
Mở cửa sổ PowerShell hoặc CMD tại thư mục dự án và gõ:
```bash
docker-compose up -d
```
Sau đó kiểm tra trạng thái hoạt động:
```bash
docker-compose ps
```
> **Lời thoại thuyết trình:** *"Thưa thầy/cô, toàn bộ hệ thống của nhóm gồm 8 dịch vụ: PostgreSQL, pgAdmin, CRM App, Nginx, Prometheus, Grafana, Loki và Promtail đã được cấu hình tự động hoàn toàn qua Docker Compose, cô lập theo 3 phân vùng mạng và hiện tại tất cả đều đang ở trạng thái UP và Healthy."*

---

### BƯỚC 2: DEMO XÁC THỰC & PHÂN QUYỀN VAI TRÒ (RBAC) (2 phút - "Điểm Cộng Lớn")
Truy cập trình duyệt tại địa chỉ: `http://localhost:8080/login.html` (hoặc `http://localhost:8080`)

1. **Thuyết minh cơ chế bảo mật xác thực:**
   - Hệ thống áp dụng mô hình phân quyền dựa trên vai trò (Role-Based Access Control - RBAC) với mã hóa HMAC-SHA256 và Stateless JWT Token.
   - Giao diện có sẵn 3 nút "Đăng nhập nhanh theo vai trò" để thầy/cô kiểm chứng trực tiếp:
     - 🔴 **Admin (`admin` / `admin123`)**: Quản trị viên tối cao.
     - 🟣 **Manager (`manager` / `manager123`)**: Trưởng phòng kinh doanh.
     - 🔵 **Staff (`sale` / `sale123`)**: Chuyên viên chăm sóc khách hàng.

2. **Demo tài khoản Quản trị viên (Admin):**
   - Đăng nhập `admin`: Thanh Navbar hiển thị huy hiệu đỏ **`ADMIN`**.
   - Xuất hiện menu đặc quyền **"Phân Quyền (RBAC)"** (`/users.html`).
   - Thầy/cô thấy Admin có thể xem toàn bộ nhân viên, tạo tài khoản mới, cấp quyền, đổi mật khẩu và xóa/khóa tài khoản.
   - Vào trang Khách hàng (`/customers.html`): Nút **Xóa (Delete)** màu đỏ hoạt động bình thường.

3. **Demo chuyển đổi sang Chuyên viên CSKH (Staff):**
   - Bấm vào Avatar góc phải Navbar &rarr; Chọn *"3. Quyền Staff (sale)"*: Hệ thống tự động chuyển đổi sang quyền nhân viên ngay lập tức.
   - Menu *"Phân Quyền (RBAC)"* lập tức **biến mất**.
   - Vào trang Khách hàng (`/customers.html`): Nút **Xóa** bị khóa bằng biểu tượng ổ khóa 🔒. Nếu cố tình gọi API xóa thì server trả về lỗi `HTTP 403 Forbidden` (được bảo vệ từ backend).

---

### BƯỚC 3: DEMO ỨNG DỤNG CRM CHĂM SÓC KHÁCH HÀNG (2 phút)
Truy cập: `http://localhost:8080`

1. **Trang Bảng Điều Khiển (Dashboard):**
   - Chỉ vào các thẻ KPI: Tổng khách hàng, Người liên hệ, Lượt tương tác, Doanh số ghi nhận.
   - Thuyết minh 3 biểu đồ Chart.js: Biểu đồ tròn phân bổ trạng thái (Khách thân thiết, Đang tư vấn, Tiềm năng), Biểu đồ cột hình thức tương tác và Biểu đồ ngành nghề.
   - Giới thiệu danh sách Lịch hẹn (Follow-up reminders) sắp tới.
2. **Trang Quản lý Khách hàng (`/customers.html`):**
   - Demo bộ lọc trạng thái và tìm kiếm nhanh (gõ "FPT", "Vingroup" hoặc "0901234567").
   - Nhấn nút **"+ Thêm Khách Hàng Mới"**, nhập thông tin một công ty mới và bấm Lưu &rarr; Khách hàng xuất hiện ngay trên bảng và thông báo Toast màu xanh hiện lên.
   - Nhấn nút **Xem chi tiết (icon con mắt)**: Thầy/cô sẽ thấy toàn bộ hồ sơ khách hàng, danh sách người liên hệ và timeline toàn bộ các cuộc gọi, email của khách hàng đó.
3. **Trang Lịch sử Tương tác (`/interactions.html`):**
   - Nhấn **"+ Ghi Nhận Tương Tác Mới"**: Chọn khách hàng vừa tạo, chọn hình thức "Cuộc gọi", kết quả "Khách quan tâm", đặt lịch hẹn ngày mai &rarr; Bấm Lưu.

---

### BƯỚC 3: DEMO QUẢN TRỊ POSTGRESQL BẰNG PGADMIN 4 (1 - 2 phút)
1. Mở tab mới: `http://localhost:5050`
2. Đăng nhập:
   - **Email:** `admin@crm.local`
   - **Password:** `AdminPass@2026`
3. Nhìn vào menu cây bên trái: Server `CRM-PostgreSQL-Server` đã được cấu hình tự động (auto-provisioning qua file `servers.json`).
4. Mở rộng: `Databases` &rarr; `crm_db` &rarr; `Schemas` &rarr; `public` &rarr; `Tables`.
5. Mở bảng `customers` hoặc `interactions` và nhấn biểu tượng **View/Edit Data** để thầy cô thấy dữ liệu vừa thêm ở Bước 2 đã được lưu an toàn trong PostgreSQL.

---

### BƯỚC 4: DEMO NGINX REVERSE PROXY & HARDENING (1 - 2 phút)
Mở một cửa sổ dòng lệnh và chạy lệnh kiểm tra HTTP Headers của Nginx:
```bash
curl -I http://localhost
```
Chỉ cho thầy cô thấy các Header bảo mật (Security Headers):
- `server: nginx` (Không hiển thị số phiên bản vì đã bật `server_tokens off`).
- `X-Frame-Options: SAMEORIGIN` (Chống clickjacking).
- `X-Content-Type-Options: nosniff` (Chống MIME-type sniffing).
- `X-XSS-Protection: 1; mode=block` (Chống tấn công XSS).

Giải thích thêm: Cổng vào duy nhất từ bên ngoài là Nginx (Port 80). Nginx định tuyến `/` vào CRM App, `/pgadmin/` vào pgAdmin và áp dụng Rate Limiting 30 requests/s chống flood.

---

### BƯỚC 5: TẠO LƯU LƯỢNG GIẢ LẬP ĐỂ DEMO GIÁM SÁT (Quan trọng!)
Mở một terminal riêng và chạy:
```bash
node scripts/generate-traffic.js
```
Script sẽ gửi liên tục các request và tự động ghi thêm tương tác vào hệ thống. Để terminal này chạy nền trong suốt quá trình demo Prometheus, Grafana và Loki.

---

### BƯỚC 6: DEMO PROMETHEUS METRICS (1 - 2 phút)
1. Mở endpoint metrics của CRM: `http://localhost/metrics` (hoặc `http://localhost:3000/metrics`)
   - Thuyết minh: Ứng dụng tích hợp thư viện `prom-client` xuất các metrics chuẩn: `http_requests_total`, `http_request_duration_seconds`, `crm_customers_total`, `crm_interactions_total`.
2. Mở Web UI của Prometheus: `http://localhost:9090`
   - Vào menu **Status** &rarr; **Targets**: Cho thấy target `crm-app` và `loki` đang ở trạng thái **UP** màu xanh lá.
   - Chuyển sang tab **Graph**, gõ câu lệnh PromQL:
     ```promql
     sum by (status_code) (rate(http_requests_total[1m]))
     ```
     Bấm **Execute** và chọn hiển thị Graph: Thấy rõ biểu đồ tốc độ request theo từng status code 200, 304, 404...

---

### BƯỚC 7: DEMO GRAFANA DASHBOARDS (2 phút)
1. Mở tab mới: `http://localhost:3001`
   - Đăng nhập: User `admin` / Password `admin` (hoặc hệ thống đã tự động mở dashboard).
2. Vào **Dashboards** &rarr; Mở dashboard **CRM System Monitoring Dashboard** (đã được cấu hình tự động provisioning):
   - **Thẻ Uptime & Tần suất Request:** Nhảy số trực tiếp theo lưu lượng của script đang chạy.
   - **Biểu đồ HTTP Status Codes:** Hiển thị lưu lượng theo thời gian thực.
   - **Độ trễ P95 / P99 Latency:** Đánh giá chất lượng dịch vụ SLA.
   - **Tài nguyên:** Bộ nhớ Node.js Heap và CPU tiêu thụ.
   - **Business Metrics:** Thống kê khách hàng theo trạng thái và tương tác theo hình thức.
   - **Panel Live Logs:** Luồng log trực tiếp đổ về từ Loki ở phía dưới cùng!

---

### BƯỚC 8: DEMO GRAFANA LOKI & CÂU TRUY VẤN LOGQL (2 phút - "Điểm 10")
Tại thanh menu bên trái của Grafana, bấm vào biểu tượng **Explore** (hình chiếc la bàn):
1. Đảm bảo chọn nguồn dữ liệu là **Loki**.
2. **Truy vấn 1: Xem toàn bộ log của ứng dụng CRM:**
   ```logql
   {job="crm-app"}
   ```
   Bấm **Run query** &rarr; Xuất hiện các dòng log JSON có màu sắc rõ ràng (info, warn).
3. **Truy vấn 2: Phân tích JSON và lọc log theo cấp độ:**
   ```logql
   {job="crm-app"} | json | level="info"
   ```
4. **Truy vấn 3: Xem các request qua Nginx:**
   ```logql
   {job="nginx"} | json | status >= 200
   ```
5. **Truy vấn 4: Tìm kiếm thao tác nghiệp vụ:**
   ```logql
   {job="crm-app"} |= "khách hàng"
   ```
> **Lời thoại thuyết trình:** *"Loki sử dụng cơ chế indexing theo labels tương tự Prometheus, không đánh index toàn bộ nội dung text như Elasticsearch nên tiêu tốn rất ít RAM và CPU, kết hợp cùng Promtail thu thập log trực tiếp từ Nginx và Container stdout."*

---

## ❓ BỘ CÂU HỎI VẤN ĐÁP THƯỜNG GẶP (FAQ & TRẢ LỜI MẪU)

**Câu 1: Tại sao trong docker-compose.yml, PostgreSQL không mở cổng 5432 ra máy Host (`ports: - "5432:5432"`)?**
> **Trả lời:** Đây là nguyên tắc **Security Hardening (Bảo mật theo chiều sâu)**. Cơ sở dữ liệu chứa dữ liệu nhạy cảm nên chỉ cần phục vụ nội bộ cho CRM App và pgAdmin trong mạng `backend_net`. Việc không mở port ra máy host ngăn chặn hoàn toàn nguy cơ bị dò quét cổng hoặc tấn công brute-force mật khẩu DB từ ngoài Internet.

**Câu 2: Cơ chế thu thập Log của Loki và Promtail diễn ra như thế nào?**
> **Trả lời:** Nginx và ứng dụng CRM ghi log dạng cấu trúc JSON ra các file log/stdout. Promtail đóng vai trò là Log Shipper, liên tục giám sát và đọc các log này, gán nhãn metadata (job, level, service) rồi đẩy (HTTP POST) sang Loki theo luồng stream. Loki lưu trữ các chunks trên ổ đĩa và cung cấp API để Grafana truy vấn bằng cú pháp LogQL.

**Câu 3: Làm thế nào để hệ thống ngăn chặn tấn công từ chối dịch vụ (DoS)?**
> **Trả lời:** Em đã triển khai cơ chế **Rate Limiting** ngay tại tầng Nginx Gateway bằng directive `limit_req_zone` với giới hạn 30 requests/giây kèm burst=20. Mọi request vượt ngưỡng sẽ bị Nginx trả về mã lỗi HTTP 429 Too Many Requests ngay lập tức trước khi chạm vào server backend Node.js.

**Câu 4: Multi-stage build trong Dockerfile của ứng dụng mang lại lợi ích gì?**
> **Trả lời:** Multi-stage build giúp tách riêng quá trình cài đặt thư viện (`npm install`) và môi trường chạy (`runner`). Nhờ đó, ảnh Docker cuối cùng chỉ chứa các file thực sự cần thiết trên nền tảng `node:20-alpine`, dung lượng giảm từ hơn 1GB xuống dưới 150MB, đồng thời loại bỏ các công cụ build tiềm ẩn nguy cơ bảo mật và chạy dưới quyền user `node` phi đặc quyền (non-root).

