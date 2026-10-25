#!/bin/bash
set -e

echo "===================================================================="
echo "       KHỞI ĐỘNG HỆ THỐNG CRM CHĂM SÓC KHÁCH HÀNG (ĐỀ 4 KTHP)"
echo "===================================================================="

# Tự động tạo .env nếu chưa có
if [ ! -f .env ]; then
    echo "[!] Đang sao chép cấu hình từ .env.example sang .env..."
    cp .env.example .env
fi

echo "[*] Đang khởi động hệ thống Container..."
docker compose up -d --build || docker-compose up -d --build

echo ""
echo "===================================================================="
echo "               CÁC DỊCH VỤ ĐÃ HOẠT ĐỘNG THÀNH CÔNG"
echo "===================================================================="
echo "1. Giao diện CRM (Nginx Reverse Proxy): http://localhost"
echo "2. Giao diện pgAdmin 4:                 http://localhost:5050"
echo "   - Email: admin@crm.local | Pass: AdminPass@2026"
echo "3. Bảng điều khiển Grafana:             http://localhost:3001"
echo "   - User: admin | Pass: admin"
echo "4. Máy chủ Prometheus:                  http://localhost:9090"
echo "5. Máy chủ Loki:                        http://localhost:3100"
echo "6. Healthcheck:                         http://localhost/health"
echo "7. Prometheus Metrics:                  http://localhost/metrics"
echo "===================================================================="

