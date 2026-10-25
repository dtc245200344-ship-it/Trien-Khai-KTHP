@echo off
chcp 65001 >nul
echo ====================================================================
echo        KHỞI ĐỘNG HỆ THỐNG CRM CHĂM SÓC KHÁCH HÀNG (ĐỀ 4 KTHP)
echo ====================================================================

REM Kiểm tra file .env
if not exist ".env" (
    echo [!] Chưa tìm thấy file .env, đang tự động copy từ .env.example...
    copy .env.example .env
)

echo [*] Đang khởi động các dịch vụ qua Docker Compose...
docker-compose up -d --build

if %ERRORLEVEL% NEQ 0 (
    echo [X] Khởi động thất bại! Vui lòng đảm bảo Docker Desktop đang chạy.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ====================================================================
echo                   DANH SÁCH CÁC CỔNG DỊCH VỤ ĐÃ SẴN SÀNG
echo ====================================================================
echo 1. Ứng dụng CRM (Qua Nginx Gateway):   http://localhost:8080
echo 2. Ứng dụng CRM (Trực tiếp Port 3000): http://localhost:3000
echo 3. pgAdmin 4 (Quản trị PostgreSQL):    http://localhost:5050
echo    - Tài khoản: admin@crm.com / AdminPass@2026
echo 4. Grafana Dashboard (Giám sát):       http://localhost:3001
echo    - Tài khoản: admin / admin
echo 5. Prometheus Metrics:                 http://localhost:9090
echo 6. Grafana Loki (Log Aggregation):     http://localhost:3100
echo 7. CRM Metrics Endpoint:               http://localhost:8080/metrics
echo 8. CRM Healthcheck Endpoint:           http://localhost:8080/health
echo ====================================================================
echo.
echo Nhấn phím bất kỳ để mở giao diện CRM trên trình duyệt...
pause >nul
start http://localhost:8080

