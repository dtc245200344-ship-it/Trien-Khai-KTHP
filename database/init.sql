-- ====================================================================
-- HỆ THỐNG CRM CHĂM SÓC KHÁCH HÀNG - ĐỀ 4 KTHP
-- Database Init Script (PostgreSQL 16)
-- ====================================================================

-- 1. Tạo extension nếu cần
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1.1 Tạo bảng Người dùng & Phân quyền (Users & Roles)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'staff', -- 'admin', 'manager', 'staff'
    department VARCHAR(50) DEFAULT 'Kinh doanh',
    phone VARCHAR(25),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tạo bảng Khách hàng (Customers)
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

-- 3. Tạo bảng Người liên hệ (Contacts)
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) DEFAULT 'Nhân viên đại diện',
    email VARCHAR(100),
    phone VARCHAR(25),
    is_primary BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tạo bảng Lịch sử tương tác (Interactions)
CREATE TABLE IF NOT EXISTS interactions (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    contact_id INTEGER REFERENCES contacts(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL, -- 'Cuộc gọi', 'Email', 'Gặp mặt trực tiếp', 'Nhắn tin Zalo', 'Demo giải pháp'
    direction VARCHAR(20) DEFAULT 'Chiều đi', -- 'Chiều đi', 'Chiều đến'
    title VARCHAR(200) NOT NULL,
    summary TEXT,
    outcome VARCHAR(50) DEFAULT 'Đang xử lý', -- 'Thành công', 'Khách quan tâm', 'Cần theo dõi', 'Hẹn lại', 'Từ chối'
    interaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    next_follow_up TIMESTAMP WITH TIME ZONE,
    staff_name VARCHAR(100) DEFAULT 'Quản trị viên',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Trigger cập nhật updated_at tự động
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trg_customers_updated ON customers;
CREATE TRIGGER trg_customers_updated
BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

DROP TRIGGER IF EXISTS trg_contacts_updated ON contacts;
CREATE TRIGGER trg_contacts_updated
BEFORE UPDATE ON contacts
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- 6. Indexes tối ưu hiệu năng truy vấn
CREATE INDEX IF NOT EXISTS idx_customers_code ON customers(customer_code);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_contacts_customer_id ON contacts(customer_id);
CREATE INDEX IF NOT EXISTS idx_interactions_customer_id ON interactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_interactions_date ON interactions(interaction_date);

-- ====================================================================
-- DỮ LIỆU MẪU (SEED DATA)
-- ====================================================================

INSERT INTO customers (customer_code, company_name, contact_name, email, phone, address, industry, status, notes, total_spent, created_at)
VALUES
('KH-2026-001', 'Tập đoàn Công nghệ FPT', 'Nguyễn Văn An', 'an.nguyen@fpt.com.vn', '0901234567', 'Tòa nhà FPT, Cầu Giấy, Hà Nội', 'Công nghệ thông tin', 'Khách hàng thân thiết', 'Đối tác chiến lược hạ tầng Cloud & DevOps', 250000000.00, NOW() - INTERVAL '30 days'),
('KH-2026-002', 'Tập đoàn Vingroup', 'Trần Thị Mai', 'mai.tran@vingroup.net', '0912345678', 'Khu đô thị Times City, Hai Bà Trưng, Hà Nội', 'Đa ngành / Bất động sản', 'Đang tư vấn', 'Khách hàng quan tâm giải pháp giám sát hệ thống tập trung', 180000000.00, NOW() - INTERVAL '25 days'),
('KH-2026-003', 'Viettel Telecom', 'Lê Hoàng Nam', 'nam.le@viettel.com.vn', '0988776655', 'Số 1 Giang Văn Minh, Ba Đình, Hà Nội', 'Viễn thông', 'Khách hàng thân thiết', 'Đã ký hợp đồng bảo trì hạ tầng 1 năm', 320000000.00, NOW() - INTERVAL '20 days'),
('KH-2026-004', 'Chuỗi Bách Hóa Xanh', 'Phạm Minh Đức', 'duc.pm@bachhoaxanh.com', '0977112233', 'Khu Công Nghệ Cao, TP. Thủ Đức, TP.HCM', 'Bán lẻ & Tiêu dùng', 'Tiềm năng', 'Đang khảo sát nhu cầu quản lý chuỗi phân phối', 45000000.00, NOW() - INTERVAL '15 days'),
('KH-2026-005', 'Công ty Cổ phần MISA', 'Đỗ Quỳnh Chi', 'chi.dq@misa.vn', '0966554433', 'Tòa nhà Technosoft, Duy Tân, Cầu Giấy, Hà Nội', 'Phần mềm kế toán', 'Khách hàng thân thiết', 'Đang dùng gói Premium và gia hạn', 95000000.00, NOW() - INTERVAL '12 days'),
('KH-2026-006', 'Highlands Coffee Việt Nam', 'Vũ Quốc Bảo', 'bao.vu@highlandscoffee.com.vn', '0933221100', 'Quận 1, TP. Hồ Chí Minh', 'F&B', 'Mới tiếp cận', 'Gửi email báo giá và hồ sơ năng lực', 0.00, NOW() - INTERVAL '8 days'),
('KH-2026-007', 'Ngân hàng TMCP Quân Đội (MBBank)', 'Hoàng Thu Hương', 'huong.ht@mbbank.com.vn', '0944118899', 'Số 63 Lê Văn Lương, Cầu Giấy, Hà Nội', 'Tài chính - Ngân hàng', 'Đang tư vấn', 'Yêu cầu kiểm thử an toàn bảo mật cao (SOC2/ISO27001)', 520000000.00, NOW() - INTERVAL '5 days'),
('KH-2026-008', 'Trường Đại học Bách Khoa', 'TS. Nguyễn Hữu Dũng', 'dung.nh@hust.edu.vn', '0922334455', 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', 'Giáo dục & Đào tạo', 'Tiềm năng', 'Triển khai phòng Lab thực hành ảo hóa', 60000000.00, NOW() - INTERVAL '3 days')
ON CONFLICT (customer_code) DO NOTHING;

-- Thêm người liên hệ (Contacts)
INSERT INTO contacts (customer_id, name, role, email, phone, is_primary, notes)
VALUES
(1, 'Nguyễn Văn An', 'Giám đốc Công nghệ (CTO)', 'an.nguyen@fpt.com.vn', '0901234567', TRUE, 'Người ra quyết định cuối cùng về ngân sách IT'),
(1, 'Trần Minh Tuấn', 'Trưởng phòng Hạ tầng', 'tuan.tm@fpt.com.vn', '0909988776', FALSE, 'Đầu mối kỹ thuật liên hệ triển khai'),
(2, 'Trần Thị Mai', 'Trưởng ban Chuyển đổi số', 'mai.tran@vingroup.net', '0912345678', TRUE, 'Phụ trách lựa chọn giải pháp CRM & Monitoring'),
(2, 'Lê Văn Khang', 'Chuyên viên Mua hàng IT', 'khang.lv@vingroup.net', '0911223344', FALSE, 'Đầu mối thủ tục hợp đồng và thanh toán'),
(3, 'Lê Hoàng Nam', 'Phó Trưởng phòng Khai thác', 'nam.le@viettel.com.vn', '0988776655', TRUE, 'Quản lý hợp đồng bảo trì hệ thống'),
(4, 'Phạm Minh Đức', 'Giám đốc Vận hành', 'duc.pm@bachhoaxanh.com', '0977112233', TRUE, 'Quan tâm đến tốc độ phản hồi và tính sẵn sàng'),
(5, 'Đỗ Quỳnh Chi', 'Trưởng nhóm Quan hệ Đối tác', 'chi.dq@misa.vn', '0966554433', TRUE, 'Liên hệ rất cởi mở, hỗ trợ tích hợp API'),
(6, 'Vũ Quốc Bảo', 'Trưởng phòng Marketing', 'bao.vu@highlandscoffee.com.vn', '0933221100', TRUE, 'Đang so sánh tính năng với các nhà cung cấp khác'),
(7, 'Hoàng Thu Hương', 'Trưởng phòng An toàn Thông tin', 'huong.ht@mbbank.com.vn', '0944118899', TRUE, 'Rất kỹ tính về các tiêu chí Logging, Loki và Hardening'),
(8, 'TS. Nguyễn Hữu Dũng', 'Chủ nhiệm Bộ môn Mạng & Hệ thống', 'dung.nh@hust.edu.vn', '0922334455', TRUE, 'Cần tài liệu hướng dẫn sinh viên chi tiết')
ON CONFLICT DO NOTHING;

-- Thêm lịch sử tương tác (Interactions)
INSERT INTO interactions (customer_id, contact_id, type, direction, title, summary, outcome, interaction_date, next_follow_up, staff_name)
VALUES
(1, 1, 'Gặp mặt trực tiếp', 'Chiều đi', 'Họp nghiệm thu giai đoạn 1 hạ tầng CRM', 'Đã trao đổi về tiến độ triển khai Docker, Prometheus và Grafana. Khách hàng đánh giá giao diện trực quan và phản hồi rất nhanh.', 'Thành công', NOW() - INTERVAL '15 days', NOW() + INTERVAL '10 days', 'Kỹ sư Trưởng'),
(1, 2, 'Cuộc gọi', 'Chiều đi', 'Hỗ trợ cấu hình tích hợp Promtail đẩy log sang Loki', 'Hướng dẫn kỹ thuật viên FPT cách phân tích LogQL và tạo alert rule trên Grafana.', 'Thành công', NOW() - INTERVAL '7 days', NOW() + INTERVAL '14 days', 'Chuyên viên DevOps'),
(2, 3, 'Demo giải pháp', 'Chiều đi', 'Demo trực tuyến Dashboard CRM và Nginx Reverse Proxy', 'Trình diễn khả năng chống chịu tải và cân bằng tải của Nginx, cũng như hệ số rate limit bảo vệ dịch vụ.', 'Khách quan tâm', NOW() - INTERVAL '10 days', NOW() + INTERVAL '4 days', 'Trưởng nhóm Tư vấn'),
(2, 4, 'Email', 'Chiều đến', 'Yêu cầu gửi bảng báo giá gói bảo mật Hardening hệ thống', 'Khách hàng gửi mẫu phụ lục an toàn thông tin theo chuẩn doanh nghiệp lớn.', 'Cần theo dõi', NOW() - INTERVAL '3 days', NOW() + INTERVAL '2 days', 'Nhân viên Kinh doanh'),
(3, 5, 'Cuộc gọi', 'Chiều đến', 'Xác nhận gia hạn gói dịch vụ giám sát 24/7', 'Hai bên đã thống nhất gia hạn hợp đồng quản trị cơ sở dữ liệu PostgreSQL và pgAdmin.', 'Thành công', NOW() - INTERVAL '18 days', NULL, 'Chuyên viên CSKH'),
(4, 6, 'Nhắn tin Zalo', 'Chiều đi', 'Gửi tài liệu giới thiệu hệ thống CRM cho chuỗi bán lẻ', 'Đã gửi file PDF tài liệu kiến trúc microservices và hướng dẫn sử dụng.', 'Cần theo dõi', NOW() - INTERVAL '5 days', NOW() + INTERVAL '3 days', 'Nhân viên Kinh doanh'),
(5, 7, 'Gặp mặt trực tiếp', 'Chiều đi', 'Ký kết biên bản bàn giao và đối soát chi phí', 'Mọi hạng mục đã hoàn thành đạt chuẩn SLA 99.9%.', 'Thành công', NOW() - INTERVAL '6 days', NULL, 'Giám đốc Dự án'),
(6, 8, 'Email', 'Chiều đi', 'Gửi thư ngỏ đề xuất giải pháp chăm sóc khách hàng F&B', 'Giới thiệu các chức năng lưu vết lịch sử tương tác, phân loại nhóm khách hàng VIP.', 'Hẹn lại', NOW() - INTERVAL '2 days', NOW() + INTERVAL '5 days', 'Nhân viên Kinh doanh'),
(7, 9, 'Họp trực tiếp', 'Chiều đi', 'Thuyết trình giải pháp Hardening và Bảo mật Container', 'Trình bày cơ chế multi-stage Docker build, non-root user, Nginx security headers và LogQL audit trail.', 'Khách quan tâm', NOW() - INTERVAL '4 days', NOW() + INTERVAL '1 days', 'Chuyên gia An ninh mạng'),
(8, 10, 'Cuộc gọi', 'Chiều đi', 'Trao đổi về đề tài KTHP Triển khai và Quản trị Hệ thống', 'Hướng dẫn sinh viên làm quen với kiến trúc Prometheus, Loki, PostgreSQL, pgAdmin và Nginx.', 'Thành công', NOW() - INTERVAL '1 days', NOW() + INTERVAL '7 days', 'Giảng viên Hướng dẫn');

-- Thêm tài khoản người dùng và phân quyền mẫu
INSERT INTO users (username, password_hash, full_name, email, role, department, phone)
VALUES
('admin', '7c871eb0080345665a70e73e0ae07a639fe26a446f2f3fd350a9d777a0c71e8f', 'Nguyễn Văn Quản Trị', 'admin@crm.vn', 'admin', 'Ban Giám Đốc & Quản Trị Hệ Thống', '0901112233'),
('manager', 'b2b0e0f3bd08c6d323141fd0c490077ab453fa71295238c01e2fc1c670883fc7', 'Trần Thị Trưởng Phòng', 'manager@crm.vn', 'manager', 'Phòng Kinh Doanh & CSKH', '0912223344'),
('sale', '0e5dccb1c00ca9f1e6c2dcae033c33c539484ca918409f13ec3e1ca614631f55', 'Lê Hoàng Nhân Viên', 'sale@crm.vn', 'staff', 'Tổ Chăm Sóc Khách Hàng', '0983334455')
ON CONFLICT (username) DO NOTHING;

