# TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN & TRUYỀN THÔNG (ICTU)
## KHOA CÔNG NGHỆ THÔNG TIN

---

### BÁO CÁO KẾT THÚC HỌC PHẦN
### HỌC PHẦN: TRIỂN KHAI VÀ QUẢN TRỊ HỆ THỐNG PHẦN MỀM
### ĐỀ TÀI SỐ 4: HỆ THỐNG CRM CHĂM SÓC KHÁCH HÀNG

| Thông tin | Chi tiết |
| :--- | :--- |
| **Giảng viên hướng dẫn:** | ThS. Vũ Việt Dũng |
| **Sinh viên thực hiện:** | Long Minh Thành |
| **Mã sinh viên:** | DTC245200344 |
| **Lớp:** | CNTT K23I |

**Thái Nguyên, Năm 2026**

---

## MỤC LỤC

- [CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI VÀ YÊU CẦU BÀI TOÁN](#chương-1-tổng-quan-đề-tài-và-yêu-cầu-bài-toán)
  - [1.1. Mục tiêu và phạm vi đề tài](#11-mục-tiêu-và-phạm-vi-đề-tài)
  - [1.2. Phân tích yêu cầu chức năng phần mềm CRM](#12-phân-tích-yêu-cầu-chức-năng-phần-mềm-crm)
  - [1.3. Phân tích yêu cầu phi chức năng và hạ tầng kỹ thuật](#13-phân-tích-yêu-cầu-phi-chức-năng-và-hạ-tầng-kỹ-thuật)
  - [1.4. Quản lý mã nguồn và CI/CD trên GitHub](#14-quản-lý-mã-nguồn-và-cicd-trên-github)
- [CHƯƠNG 2: THIẾT KẾ KIẾN TRÚC HỆ THỐNG VÀ CƠ SỞ DỮ LIỆU](#chương-2-thiết-kế-kiến-trúc-hệ-thống-và-cơ-sở-dữ-liệu)
  - [2.1. Kiến trúc phân tầng và điều phối Container](#21-kiến-trúc-phân-tầng-và-điều-phối-container)
  - [2.2. Thiết kế Cơ sở dữ liệu quan hệ PostgreSQL](#22-thiết-kế-cơ-sở-dữ-liệu-quan-hệ-postgresql)
  - [2.3. Tự động kết nối cơ sở dữ liệu trên pgAdmin 4](#23-tự-động-kết-nối-cơ-sở-dữ-liệu-trên-pgadmin-4)
- [CHƯƠNG 3: CỔNG ĐIỀU PHỐI VÀ CÂN BẰNG TẢI NGINX REVERSE PROXY](#chương-3-cổng-điều-phối-và-cân-bằng-tải-nginx-reverse-proxy)
  - [3.1. Vai trò của Nginx Reverse Proxy](#31-vai-trò-của-nginx-reverse-proxy)
  - [3.2. Cấu hình định tuyến và Hardening](#32-cấu-hình-định-tuyến-và-hardening)
  - [3.3. Định dạng Log dạng JSON chuẩn cho Loki](#33-định-dạng-log-dạng-json-chuẩn-cho-loki)
- [CHƯƠNG 4: HỆ THỐNG GIÁM SÁT VÀ GHI NHẬT KÝ TẬP TRUNG](#chương-4-hệ-thống-giám-sát-và-ghi-nhật-ký-tập-trung)
  - [4.1. Giám sát chỉ số với Prometheus](#41-giám-sát-chỉ-số-với-prometheus)
  - [4.2. Trực quan hóa Dashboard tự động qua Grafana](#42-trực-quan-hóa-dashboard-tự-động-qua-grafana)
  - [4.3. Quản lý và phân tích nhật ký với Loki, Promtail và LogQL](#43-quản-lý-và-phân-tích-nhật-ký-với-loki-promtail-và-logql)
- [CHƯƠNG 5: TRIỂN KHAI BẢO MẬT VÀ TỐI ƯU HÓA HỆ THỐNG (HARDENING)](#chương-5-triển-khai-bảo-mật-và-tối-ưu-hóa-hệ-thống-hardening)
  - [5.1. Container Hardening trong Dockerfile](#51-container-hardening-trong-dockerfile)
  - [5.2. Phân vùng mạng độc lập (Network Segmentation)](#52-phân-vùng-mạng-độc-lập-network-segmentation)
  - [5.3. Giới hạn tài nguyên phần cứng (Resource Quotas)](#53-giới-hạn-tài-nguyên-phần-cứng-resource-quotas)
- [CHƯƠNG 6: KẾT QUẢ THỬ NGHIỆM, KỊCH BẢN DEMO VÀ ĐÁNH GIÁ](#chương-6-kết-quả-thử-nghiệm-kịch-bản-demo-và-đánh-giá)
  - [6.1. Bảng kết quả kiểm thử chức năng nghiệp vụ](#61-bảng-kết-quả-kiểm-thử-chức-năng-nghiệp-vụ)
  - [6.2. Kịch bản chạy kiểm thử giả lập tải (Traffic Simulation)](#62-kịch-bản-chạy-kiểm-thử-giả-lập-tải-traffic-simulation)
  - [6.3. Bảng tổng hợp cổng dịch vụ và thông tin đăng nhập](#63-bảng-tổng-hợp-cổng-dịch-vụ-và-thông-tin-đăng-nhập)
- [KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN](#kết-luận-và-hướng-phát-triển)

---

## CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI VÀ YÊU CẦU BÀI TOÁN

### 1.1. Mục tiêu và phạm vi đề tài
Mục tiêu trọng tâm của đề tài là xây dựng và triển khai một giải pháp phần mềm CRM Chăm sóc Khách hàng chuyên nghiệp, có thể vận hành ổn định trên nền tảng Docker với kiến trúc microservices. Hệ thống đáp ứng tính sẵn sàng cao (High Availability), khả năng chịu tải tốt và cung cấp đầy đủ công cụ cho kỹ sư DevOps quản trị vận hành.

### 1.2. Phân tích yêu cầu chức năng phần mềm CRM
Hệ thống CRM bao gồm 4 phân hệ chức năng nghiệp vụ cốt lõi:
- **Phân hệ Quản lý Khách hàng:** Cho phép thêm mới, sửa, xóa, xem chi tiết hồ sơ đối tác. Hỗ trợ phân loại trạng thái khách hàng theo 5 giai đoạn: *Mới tiếp cận*, *Tiềm năng*, *Đang tư vấn*, *Khách hàng thân thiết* và *Ngừng chăm sóc*. Tính toán doanh số hợp đồng đã ký kết.
- **Phân hệ Danh bạ Người liên hệ:** Lưu trữ nhiều người liên hệ trong cùng một doanh nghiệp đối tác (Giám đốc, Trưởng phòng Mua hàng, Kế toán trưởng, IT...). Cho phép gắn cờ người liên hệ chính (*Primary Contact*) làm đầu mối làm việc ưu tiên.
- **Phân hệ Lịch sử Tương tác:** Lưu vết mọi hoạt động chăm sóc: Cuộc gọi, Gửi email, Gặp mặt trực tiếp, Nhắn tin Zalo, Demo giải pháp. Ghi nhận chiều tương tác (*Inbound/Outbound*), kết quả tư vấn, nhân viên phụ trách và đặt lịch hẹn kế tiếp (*Follow-up Date*).
- **Phân hệ Thống kê Dashboard:** Cung cấp các thẻ KPI tổng quan, biểu đồ Doughnut phân bổ trạng thái, biểu đồ Bar phân loại ngành nghề, biểu đồ hình thức chăm sóc và danh sách công việc cần xử lý trong ngày.
- **Phân hệ Phân quyền người dùng (RBAC):** Phân chia 3 nhóm quyền rõ rệt:
  - `Admin`: Toàn quyền quản trị, thêm/sửa/xóa khách hàng và quản lý tài khoản người dùng.
  - `Manager`: Quyền quản lý, thêm/sửa thông tin và theo dõi báo cáo, không được phép xóa khách hàng.
  - `Staff`: Quyền nhân viên, chỉ được tạo khách hàng và ghi nhận lịch sử chăm sóc, không có quyền xóa dữ liệu.

### 1.3. Phân tích yêu cầu phi chức năng và hạ tầng kỹ thuật

| Thành phần | Công nghệ lựa chọn | Mục tiêu & Yêu cầu đáp ứng |
| :--- | :--- | :--- |
| **Ứng dụng CRM** | Node.js 20/24, Express, Bootstrap 5, Vanilla JS | REST API hiệu năng cao, giao diện web chuẩn SaaS hiện đại, tích hợp sẵn prom-client và Winston logger. |
| **Cơ sở dữ liệu** | PostgreSQL 16 Alpine | Hệ quản trị CSDL quan hệ tin cậy, lưu trữ ACID, có cơ chế trigger tự động cập nhật timestamp và index tối ưu truy vấn. |
| **Giao diện quản trị DB** | pgAdmin 4 (v8) | Giao diện web trực quan giúp kiểm tra bảng, quan hệ, truy vấn dữ liệu mà không cần cài thêm client ở máy trạm. |
| **Cổng Gateway Proxy** | Nginx 1.27 Alpine | Tiếp nhận cổng 8080/80, cân bằng tải, ẩn phiên bản máy chủ, rate limit 30 req/s, xuất access log dạng JSON cho Loki. |
| **Giám sát số liệu** | Prometheus v2.53.1 | Cào metrics từ ứng dụng định kỳ 5 giây, hỗ trợ chuẩn OpenMetrics. |
| **Trực quan hóa Dashboard** | Grafana 11.1.0 | Tự động nạp datasources và dashboards qua Provisioning, theo dõi Latency P95, Status codes, Resource usage. |
| **Quản lý Nhật ký tập trung** | Grafana Loki 3.1.0 + Promtail 3.1.0 | Thu thập log tập trung từ Nginx và Container stdout, truy vấn mạnh mẽ bằng ngôn ngữ LogQL. |
| **Bảo mật & Tự động hóa** | GitHub Actions, Multi-stage build, Non-root | Cách ly mạng Docker, chạy container dưới quyền user node, quét lỗ hổng bảo mật bằng Trivy. |

### 1.4. Quản lý mã nguồn và CI/CD trên GitHub

Để đảm bảo quy trình phát triển và triển khai phần mềm chuẩn DevOps, toàn bộ mã nguồn, cấu hình Docker Compose, hạ tầng giám sát và tài liệu bài báo cáo được quản lý tập trung trên GitHub.

- **Địa chỉ Repository chính thức:**  
  👉 `https://github.com/dtc245200344-ship-it/Trien-Khai-KTHP`
- **Tài khoản quản trị:** `dtc245200344-ship-it` (Long Minh Thành)
- **Nhánh chính thức:** `main`

#### Các commit tiêu biểu trong quá trình triển khai:
1. `201ea21` - **feat: configure Nginx reverse proxy, security headers and JSON logging**: Thiết lập Nginx làm Gateway, bổ sung các security headers (X-Frame-Options, CSP, nosniff), cấu hình rate limiting và định dạng JSON access log.
2. `ca5ed5a` - **feat: monitor containers and PostgreSQL with Prometheus Grafana**: Tích hợp prom-client vào ứng dụng Node.js, khai báo cấu hình scrape target trong `prometheus.yml` và tự động provisioning Dashboard Grafana.
3. `3d26c86` - **feat: centralize Nginx and App logs with Loki Promtail and verify LogQL**: Thiết lập cụm Promtail đọc file log từ volume chia sẻ và gửi sang Loki, xác thực truy vấn bằng LogQL.
4. `bdd9a90` - **feat(monitoring): upgrade Grafana dashboard with 5 comprehensive rows and 19 panels**: Hoàn thiện dashboard giám sát thời gian thực với 19 panels chuyên sâu.
5. `0c66bf2` - **feat: complete project Trien Khai KTHP - De 4 He thong CRM**: Hoàn thiện toàn bộ hệ sinh thái dự án và kịch bản kiểm thử giả lập tải.

#### Tích hợp tự động hóa CI/CD với GitHub Actions:
Tệp cấu hình `.github/workflows/ci.yml` được thiết lập nhằm kích hoạt quy trình kiểm tra tự động mỗi khi có thao tác `push` hoặc `pull_request` lên nhánh `main`:
- **Automated Syntax & Unit Test:** Kiểm tra cú pháp JavaScript và tính toàn vẹn của mã nguồn Express.
- **Docker Compose Verification:** Kiểm tra tính hợp lệ của tệp `docker-compose.yml` (`docker compose config`).
- **Security Audit:** Quét lỗ hổng của các gói phụ thuộc `npm audit --audit-level=high`.

---

## CHƯƠNG 2: THIẾT KẾ KIẾN TRÚC HỆ THỐNG VÀ CƠ SỞ DỮ LIỆU

### 2.1. Kiến trúc phân tầng và điều phối Container
Toàn bộ hệ sinh thái được triển khai dưới dạng 8 microservices độc lập được mô tả trong tệp cấu hình `docker-compose.yml`:
- **Tầng Tiếp nhận (Gateway Tier):** Nginx đóng vai trò Reverse Proxy tiếp nhận toàn bộ traffic HTTP từ cổng 8080/80 của máy Host.
- **Tầng Nghiệp vụ (Application Tier):** Ứng dụng CRM Node.js phục vụ giao diện người dùng và cung cấp các REST API tại cổng nội bộ 3000.
- **Tầng Lưu trữ (Data Tier):** PostgreSQL 16 lưu trữ dữ liệu bền vững qua Volume `pgdata` và pgAdmin 4 quản trị trực quan qua web tại cổng 5050.
- **Tầng Giám sát (Monitoring Tier):** Bộ tứ Prometheus (9090), Grafana (3001), Loki (3100) và Promtail đảm bảo khả năng quan sát toàn diện.

### 2.2. Thiết kế Cơ sở dữ liệu quan hệ PostgreSQL
Cơ sở dữ liệu `crm_db` được tổ chức chặt chẽ với lược đồ quan hệ chuẩn hóa:

```sql
-- Trích xuất cấu trúc bảng chính trong database/init.sql
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    customer_code VARCHAR(30) UNIQUE NOT NULL,
    company_name VARCHAR(150),
    contact_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(25) NOT NULL,
    address TEXT,
    industry VARCHAR(60) DEFAULT 'Khác',
    status VARCHAR(40) DEFAULT 'Tiềm năng',
    notes TEXT,
    total_spent NUMERIC(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) DEFAULT 'Nhân viên đại diện',
    email VARCHAR(100),
    phone VARCHAR(25),
    is_primary BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interactions (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    contact_id INTEGER REFERENCES contacts(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL,
    direction VARCHAR(20) DEFAULT 'Chiều đi',
    title VARCHAR(200) NOT NULL,
    summary TEXT,
    outcome VARCHAR(50) DEFAULT 'Đang xử lý',
    interaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    next_follow_up TIMESTAMP WITH TIME ZONE,
    staff_name VARCHAR(100) DEFAULT 'Quản trị viên'
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'staff',
    department VARCHAR(100) DEFAULT 'CSKH',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.3. Tự động kết nối cơ sở dữ liệu trên pgAdmin 4
Thông thường, khi triển khai pgAdmin 4, kỹ sư vận hành phải đăng nhập và tạo kết nối thủ công bằng cách nhập IP, cổng, tài khoản và mật khẩu của PostgreSQL. Trong đồ án này, nhóm đã cấu hình tự động hoàn toàn bằng tệp `servers.json` được mount vào thư mục `/pgadmin4/servers.json` của container:

```json
{
  "Servers": {
    "1": {
      "Name": "CRM-PostgreSQL-Server",
      "Group": "CRM Servers",
      "Host": "postgres",
      "Port": 5432,
      "MaintenanceDB": "crm_db",
      "Username": "crm_user",
      "SSLMode": "prefer"
    }
  }
}
```

Nhờ đó, ngay khi đăng nhập vào pgAdmin 4 tại cổng 5050, máy chủ cơ sở dữ liệu đã hiện diện sẵn sàng để quản trị.

---

## CHƯƠNG 3: CỔNG ĐIỀU PHỐI VÀ CÂN BẰNG TẢI NGINX REVERSE PROXY

### 3.1. Vai trò của Nginx Reverse Proxy
Nginx hoạt động như một bức tường trung gian bảo vệ các container phía sau. Mọi tương tác của người dùng bên ngoài chỉ chạm vào cổng tiếp nhận của Nginx. Nginx thực hiện:
- **Định tuyến tập trung:** Chuyển tiếp yêu cầu (Proxy Pass) tới các upstream tương ứng: `crm-app:3000` và `pgadmin:80`.
- **Giới hạn tần suất (Rate Limiting):** Bảo vệ backend chống tràn ngập yêu cầu bằng thuật toán Token Bucket / Leaky Bucket.
- **Nén dữ liệu Gzip:** Nén phản hồi dung lượng văn bản bằng Gzip giúp tối ưu băng thông mạng truyền tải.
- **Hardening HTTP Layer:** Thiết lập các HTTP Headers bảo mật chống lại các kiểu tấn công XSS, Clickjacking, MIME-sniffing.

### 3.2. Cấu hình định tuyến và Hardening
Trích xuất file cấu hình `nginx/conf.d/default.conf`:

```nginx
upstream crm_backend {
    server crm-app:3000 max_fails=3 fail_timeout=10s;
    keepalive 32;
}

server {
    listen 80;
    server_name localhost;

    # Cấu hình bảo mật HTTP Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "same-origin" always;
    add_header Content-Security-Policy "default-src 'self' 'unsafe-inline' https:; font-src 'self' https: data:; img-src 'self' data: https:;" always;
    server_tokens off;

    # Proxy tới ứng dụng CRM
    location / {
        proxy_pass http://crm_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Áp dụng Rate Limiting cho API
    location /api/ {
        limit_req zone=crm_limit burst=20 nodelay;
        proxy_pass http://crm_backend;
    }

    # Proxy tới giao diện pgAdmin
    location /pgadmin/ {
        proxy_pass http://pgadmin:80/;
        proxy_set_header X-Script-Name /pgadmin;
    }
}
```

### 3.3. Định dạng Log dạng JSON chuẩn cho Loki
Nginx được cấu hình chỉ thị `log_format` xuất cấu trúc JSON có định dạng:

```nginx
log_format json_analytics escape=json '{'
    '"time_local":"$time_iso8601",'
    '"remote_addr":"$remote_addr",'
    '"request_method":"$request_method",'
    '"request_uri":"$request_uri",'
    '"status":$status,'
    '"body_bytes_sent":$body_bytes_sent,'
    '"request_time":$request_time,'
    '"http_referrer":"$http_referer",'
    '"upstream_response_time":"$upstream_response_time"'
'}';
```

Định dạng này giúp Promtail và Loki lập tức giải mã các trường dữ liệu bằng cú pháp `| json` trong LogQL mà không cần viết các đoạn Regex phức tạp.

---

## CHƯƠNG 4: HỆ THỐNG GIÁM SÁT VÀ GHI NHẬT KÝ TẬP TRUNG

### 4.1. Giám sát chỉ số với Prometheus
Prometheus định kỳ mỗi 5 giây thu thập dữ liệu từ endpoint `/metrics` của ứng dụng CRM. Ứng dụng tích hợp thư viện `prom-client` cung cấp 3 nhóm chỉ số quan trọng:
1. **Chỉ số tài nguyên hệ thống (System Metrics):** `node_nodejs_heap_size_used_bytes` (Bộ nhớ Heap Node.js), `node_process_cpu_user_seconds_total` (CPU time) và `node_process_uptime_seconds` (Thời gian sống liên tục của tiến trình).
2. **Chỉ số hiệu năng mạng (Network & HTTP Metrics):** `http_requests_total` (Bộ đếm Counter đếm tổng số request theo method, route, status code) và `http_request_duration_seconds` (Histogram đo độ trễ xử lý request).
3. **Chỉ số đo kiểm nghiệp vụ (Business Metrics):** `crm_customers_total` (Gauge theo dõi số lượng khách hàng theo trạng thái), `crm_interactions_total` (Gauge theo dõi tương tác) và `crm_db_query_duration_seconds` (Thời gian câu lệnh SQL).

### 4.2. Trực quan hóa Dashboard tự động qua Grafana
Grafana được cấu hình cơ chế Provisioning tự động nạp sẵn Dashboard JSON mà không cần người dùng tự tạo biểu đồ bằng tay. Bảng điều khiển `crm-overview.json` bao gồm 5 phân vùng chuyên sâu với 19 panels:
- **Khu vực 1 - Trạng thái dịch vụ & Chỉ số nhanh:** Thẻ hiển thị trạng thái UP/DOWN của CRM App, Prometheus Server, Loki Log Engine, App Uptime, Tần suất Request (req/s) và Độ trễ trung bình.
- **Khu vực 2 - Chất lượng dịch vụ SLA:** Biểu đồ thời gian thực phân bổ lưu lượng theo các mã HTTP Status 2xx, 4xx, 5xx và biểu đồ đường thể hiện độ trễ phân vị P95 và P99.
- **Khu vực 3 - Tài nguyên Container & PostgreSQL:** Biểu đồ theo dõi tỷ lệ sử dụng CPU (%), mức tiêu thụ RAM (RSS & Heap) và thời gian thực thi các truy vấn SQL PostgreSQL.
- **Khu vực 4 - Nghiệp vụ CRM:** Thanh Bar Gauge hiển thị khách hàng theo trạng thái và biểu đồ cột thống kê hình thức chăm sóc (Gọi điện, Gặp mặt, Email, Zalo, Demo...).
- **Khu vực 5 - Nhật ký thời gian thực:** Khung cửa sổ Live Logs kết nối trực tiếp với Loki, hiển thị nhật ký truy cập và thông báo hệ thống liên tục.

### 4.3. Quản lý và phân tích nhật ký với Loki, Promtail và LogQL
Loki là giải pháp lưu trữ log phân tán được thiết kế theo triết lý của Prometheus: chỉ đánh chỉ mục (Index) các nhãn nhãn meta (Labels) thay vì lập chỉ mục toàn bộ nội dung văn bản. Promtail làm nhiệm vụ Log Shipper đọc file log từ Nginx và container stdout rồi đẩy sang Loki qua cổng 3100.

Các câu lệnh truy vấn LogQL mẫu phục vụ công tác giám sát và điều tra sự cố:
- **Truy vấn cơ bản:** `{job="crm-app"}` : Xem toàn bộ dòng log phát sinh từ ứng dụng CRM.
- **Lọc theo cấp độ:** `{job="crm-app"} | json | level =~ "error|warn"` : Bóc tách cấu trúc JSON và lọc các thông báo lỗi hoặc cảnh báo.
- **Giám sát lỗi HTTP:** `{job="nginx"} | json | status >= 400` : Phát hiện tức thì các request bị lỗi 4xx hoặc 5xx trên cổng Nginx Gateway.
- **Thống kê tổng hợp:** `sum by (status) (count_over_time({job="nginx"}[1m]))` : Tính tổng số lượng request theo từng mã trạng thái trong mỗi phút.

---

## CHƯƠNG 5: TRIỂN KHAI BẢO MẬT VÀ TỐI ƯU HÓA HỆ THỐNG (HARDENING)

### 5.1. Container Hardening trong Dockerfile
Mã nguồn Dockerfile của ứng dụng CRM được tối ưu hóa theo chuẩn công nghiệp với kỹ thuật Multi-stage Build và nguyên tắc quyền tối thiểu (Least Privilege):

```dockerfile
# STAGE 1: Tải dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts

# STAGE 2: Runner siêu nhẹ và an toàn
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Phân quyền cho người dùng non-root
RUN chown -R node:node /app
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .

# Chuyển quyền thực thi sang user 'node' (uid=1000)
USER node
EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
```

### 5.2. Phân vùng mạng độc lập (Network Segmentation)
Để ngăn chặn nguy cơ xâm nhập lan truyền ngang (Lateral Movement), `docker-compose.yml` phân chia 3 mạng nội bộ riêng biệt:
1. **Frontend Network (`crm_frontend_net`):** Dành riêng cho Nginx giao tiếp với thế giới bên ngoài và chuyển tiếp về App/pgAdmin.
2. **Backend Network (`crm_backend_net`):** Kết nối độc quyền giữa CRM App, pgAdmin và PostgreSQL với cờ `internal: true`. Điểm đặc biệt: Cơ sở dữ liệu PostgreSQL không mở cổng ra ngoài máy Host (không có chỉ thị `ports: 5432:5432`), ngăn ngừa hoàn toàn nguy cơ bị brute-force từ Internet.
3. **Monitoring Network (`crm_monitoring_net`):** Kết nối khép kín giữa Prometheus, Grafana, Loki và Promtail.

### 5.3. Giới hạn tài nguyên phần cứng (Resource Quotas)
Mọi container đều được khai báo trần tài nguyên (`deploy.resources.limits`) nhằm ngăn chặn việc một container bị lỗi rò rỉ bộ nhớ (Memory Leak) hoặc bị tấn công làm cạn kiệt tài nguyên của toàn bộ máy chủ vật lý:
- **PostgreSQL:** Giới hạn tối đa 1.0 CPU và 512MB RAM.
- **CRM Application:** Giới hạn tối đa 1.0 CPU và 512MB RAM.
- **Nginx Gateway:** Giới hạn tối đa 0.8 CPU và 256MB RAM.
- **Prometheus & Grafana:** Giới hạn tối đa 0.8 CPU và 512MB RAM.

---

## CHƯƠNG 6: KẾT QUẢ THỬ NGHIỆM, KỊCH BẢN DEMO VÀ ĐÁNH GIÁ

### 6.1. Bảng kết quả kiểm thử chức năng nghiệp vụ

| Chức năng kiểm thử | Dữ liệu đầu vào thử nghiệm | Kết quả thực tế ghi nhận | Đánh giá |
| :--- | :--- | :--- | :--- |
| **Quản lý mã nguồn Git** | `git remote -v; git push origin main` | Đẩy thành công mã nguồn lên GitHub `Trien-Khai-KTHP` | **ĐẠT (PASS)** |
| **Khởi động hệ thống** | Chạy lệnh: `docker compose up -d` | Toàn bộ 8 container đều chuyển sang trạng thái Up và Healthy | **ĐẠT (PASS)** |
| **Xác thực & Phân quyền RBAC** | Đăng nhập Admin, Manager, Staff | Phân định đúng menu và chặn quyền xóa đối với nhân viên | **ĐẠT (PASS)** |
| **Thêm mới khách hàng** | Thêm: "Công ty Cổ phần Công nghệ XYZ" | Lưu thành công vào DB, xuất hiện mã KH, Toast thông báo | **ĐẠT (PASS)** |
| **Xem hồ sơ chi tiết** | Nhấp icon xem chi tiết khách hàng | Hiển thị đầy đủ thông tin, liên hệ đại diện và timeline tương tác | **ĐẠT (PASS)** |
| **Ghi nhận tương tác** | Tạo cuộc gọi chăm sóc, kết quả "Thành công" | Bản ghi xuất hiện tức thì trong lịch sử, cập nhật metric | **ĐẠT (PASS)** |
| **Quản trị với pgAdmin** | Mở port 5050, xem bảng customers | Dữ liệu mới thêm ở ứng dụng web xuất hiện chính xác trong PostgreSQL | **ĐẠT (PASS)** |
| **Kiểm tra Nginx Security** | Chạy lệnh: `curl.exe -I http://localhost:8080` | Headers X-Frame-Options, X-Content-Type-Options xuất hiện đầy đủ | **ĐẠT (PASS)** |
| **Giới hạn Rate Limiting** | Gửi liên tiếp 50 requests/giây vào /api/ | Nginx trả về mã lỗi HTTP 429 Too Many Requests từ request thứ 31 | **ĐẠT (PASS)** |
| **Prometheus & Grafana** | Mở `http://localhost:3001` | Biểu đồ nhảy số trực tiếp theo lưu lượng của generate-traffic.js | **ĐẠT (PASS)** |
| **Truy vấn LogQL trên Loki** | Thực thi: `{job="crm-app"} \| json` | Hiển thị luồng log JSON có màu sắc phân loại level rõ ràng | **ĐẠT (PASS)** |

### 6.2. Kịch bản chạy kiểm thử giả lập tải (Traffic Simulation)
Để chứng minh khả năng đo lường theo thời gian thực trước hội đồng chấm thi, nhóm đã xây dựng script tự động `scripts/generate-traffic.js`. Khi khởi chạy, script sẽ gửi liên tục các request ngẫu nhiên tới các endpoint và tự động ghi thêm tương tác mới vào cơ sở dữ liệu:

```bash
node scripts/generate-traffic.js
# Kết quả hiển thị:
🚀 Bắt đầu tạo lưu lượng giả lập (Traffic Simulation)...
✅ Đã xác thực thành công tài khoản Admin cho bộ sinh tải!
[#14] /api/customers -> Status: 200
[#15] /api/interactions -> Status: 200
✨ Đã tự động tạo 1 bản ghi tương tác mới vào CSDL!
[#28] /health -> Status: 200
```

### 6.3. Bảng tổng hợp cổng dịch vụ và thông tin đăng nhập

| Dịch vụ | Cổng truy cập | Thông tin xác thực | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Ứng dụng CRM (Gateway)** | [http://localhost:8080](http://localhost:8080) | `admin` / `admin123`<br>`manager` / `manager123`<br>`sale` / `sale123` | Giao diện chính qua Nginx Reverse Proxy (Có RBAC) |
| **Ứng dụng CRM (Direct)** | [http://localhost:3000](http://localhost:3000) | Tương tự | Truy cập trực tiếp tầng Node.js |
| **pgAdmin 4** | [http://localhost:5050](http://localhost:5050) | `admin@crm.com` / `AdminPass@2026` | Quản trị CSDL PostgreSQL trực quan (tự kết nối server) |
| **Grafana Dashboard** | [http://localhost:3001](http://localhost:3001) | `admin` / `admin` | Giám sát tài nguyên, Uptime, Latency P95, Live Logs |
| **Prometheus Web UI** | [http://localhost:9090](http://localhost:9090) | Không yêu cầu | Kiểm tra trạng thái targets và câu lệnh PromQL |
| **Grafana Loki** | [http://localhost:3100](http://localhost:3100) | Không yêu cầu | Cổng nhận và xử lý dữ liệu log tập trung |
| **CRM Metrics** | [http://localhost:8080/metrics](http://localhost:8080/metrics) | Không yêu cầu | Endpoint OpenMetrics cho Prometheus cào dữ liệu |
| **CRM Healthcheck** | [http://localhost:8080/health](http://localhost:8080/health) | Không yêu cầu | Endpoint kiểm tra tình trạng App và PostgreSQL |
| **GitHub Repository** | `https://github.com/dtc245200344-ship-it/Trien-Khai-KTHP` |  Token / Git Credential  | Mã nguồn, Docker Compose, CI/CD Actions |

---

## KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

1. **Kết quả đạt được:**
   - Hoàn thành đầy đủ 100% các yêu cầu kỹ thuật của Đề tài số 4: Hệ thống CRM Chăm sóc Khách hàng.
   - Ứng dụng Node.js/Express chạy ổn định sau Nginx reverse proxy với các chính sách bảo mật HTTP nghiêm ngặt và phân quyền vai trò RBAC chặt chẽ.
   - Cơ sở dữ liệu PostgreSQL 16 được tổ chức khoa học, kết nối tự động với pgAdmin 4 và được cô lập trong mạng nội bộ.
   - Hệ thống giám sát (Prometheus & Grafana) và quản lý log tập trung (Loki & Promtail) được cấu hình tự động hoá qua cơ chế Provisioning, mang lại khả năng quan sát toàn diện theo tiêu chuẩn DevOps công nghiệp.
   - Toàn bộ dự án được quản lý phiên bản trên GitHub và đóng gói đồng bộ bằng Docker Compose.

2. **Hướng phát triển:**
   - Triển khai chứng chỉ bảo mật SSL/TLS (HTTPS) thông qua Let's Encrypt trên Nginx.
   - Nâng cấp mô hình điều phối lên cụm Kubernetes (K8s) hoặc Docker Swarm để tự động mở rộng (Auto-scaling) khi lưu lượng khách hàng tăng đột biến.
