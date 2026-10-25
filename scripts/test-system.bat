@echo off
chcp 65001 >nul
echo ====================================================================
echo        KIỂM TRA TỰ ĐỘNG SỨC KHỎE CÁC DỊCH VỤ TRONG HỆ THỐNG
echo ====================================================================

echo [*] 1. Kiểm tra Nginx Reverse Proxy (Port 80)...
curl -s -o nul -w "HTTP Code: %%{http_code}\n" http://localhost/

echo [*] 2. Kiểm tra CRM Healthcheck Endpoint (/health)...
curl -s http://localhost/health
echo.

echo [*] 3. Kiểm tra CRM Prometheus Metrics (/metrics)...
curl -s http://localhost/metrics | findstr "http_requests_total"

echo [*] 4. Kiểm tra pgAdmin 4 (Port 5050)...
curl -s -o nul -w "HTTP Code: %%{http_code}\n" http://localhost:5050/

echo [*] 5. Kiểm tra Prometheus Server (Port 9090)...
curl -s -o nul -w "HTTP Code: %%{http_code}\n" http://localhost:9090/-/healthy

echo [*] 6. Kiểm tra Grafana Dashboard (Port 3001)...
curl -s -o nul -w "HTTP Code: %%{http_code}\n" http://localhost:3001/api/health

echo [*] 7. Kiểm tra Grafana Loki (Port 3100)...
curl -s http://localhost:3100/ready
echo.

echo ====================================================================
echo Hoàn thành kiểm tra.
pause
