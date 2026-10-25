const fs = require('fs');
const path = require('path');

const dashboard = {
  "annotations": {
    "list": [
      {
        "builtIn": 1,
        "datasource": { "type": "grafana", "uid": "-- Grafana --" },
        "enable": true,
        "hide": true,
        "name": "Annotations & Alerts",
        "type": "dashboard"
      }
    ]
  },
  "editable": true,
  "fiscalYearStartMonth": 0,
  "graphTooltip": 1,
  "id": null,
  "links": [],
  "liveNow": true,
  "panels": [
    // -------------------------------------------------------------
    // ROW 1: TÌNH TRẠNG DỊCH VỤ & CHỈ SỐ NHANH
    // -------------------------------------------------------------
    {
      "collapsed": false,
      "gridPos": { "h": 1, "w": 24, "x": 0, "y": 0 },
      "id": 100,
      "title": "🟢 1. TRẠNG THÁI SẴN SÀNG & CHỈ SỐ NHANH (HEALTH & OVERVIEW)",
      "type": "row"
    },
    {
      "datasource": { "type": "prometheus", "uid": "Prometheus" },
      "fieldConfig": {
        "defaults": {
          "color": { "mode": "thresholds" },
          "mappings": [
            { "options": { "0": { "color": "red", "text": "DOWN" }, "1": { "color": "green", "text": "UP" } }, "type": "value" }
          ],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              { "color": "red", "value": null },
              { "color": "green", "value": 1 }
            ]
          }
        }
      },
      "gridPos": { "h": 3, "w": 4, "x": 0, "y": 1 },
      "id": 1,
      "options": {
        "colorMode": "background",
        "graphMode": "none",
        "justifyMode": "center",
        "reduceOptions": { "calcs": ["lastNotNull"], "values": false }
      },
      "targets": [
        {
          "datasource": { "type": "prometheus", "uid": "Prometheus" },
          "expr": "up{job=\"crm-app\"}",
          "legendFormat": "CRM App",
          "refId": "A"
        }
      ],
      "title": "CRM Application",
      "type": "stat"
    },
    {
      "datasource": { "type": "prometheus", "uid": "Prometheus" },
      "fieldConfig": {
        "defaults": {
          "color": { "mode": "thresholds" },
          "mappings": [
            { "options": { "0": { "color": "red", "text": "DOWN" }, "1": { "color": "green", "text": "UP" } }, "type": "value" }
          ],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              { "color": "red", "value": null },
              { "color": "green", "value": 1 }
            ]
          }
        }
      },
      "gridPos": { "h": 3, "w": 4, "x": 4, "y": 1 },
      "id": 2,
      "options": {
        "colorMode": "background",
        "graphMode": "none",
        "justifyMode": "center",
        "reduceOptions": { "calcs": ["lastNotNull"], "values": false }
      },
      "targets": [
        {
          "datasource": { "type": "prometheus", "uid": "Prometheus" },
          "expr": "up{job=\"prometheus\"}",
          "legendFormat": "Prometheus",
          "refId": "A"
        }
      ],
      "title": "Prometheus Server",
      "type": "stat"
    },
    {
      "datasource": { "type": "prometheus", "uid": "Prometheus" },
      "fieldConfig": {
        "defaults": {
          "color": { "mode": "thresholds" },
          "mappings": [
            { "options": { "0": { "color": "red", "text": "DOWN" }, "1": { "color": "green", "text": "UP" } }, "type": "value" }
          ],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              { "color": "red", "value": null },
              { "color": "green", "value": 1 }
            ]
          }
        }
      },
      "gridPos": { "h": 3, "w": 4, "x": 8, "y": 1 },
      "id": 3,
      "options": {
        "colorMode": "background",
        "graphMode": "none",
        "justifyMode": "center",
        "reduceOptions": { "calcs": ["lastNotNull"], "values": false }
      },
      "targets": [
        {
          "datasource": { "type": "prometheus", "uid": "Prometheus" },
          "expr": "up{job=\"loki\"}",
          "legendFormat": "Loki",
          "refId": "A"
        }
      ],
      "title": "Loki Log Engine",
      "type": "stat"
    },
    {
      "datasource": { "type": "prometheus", "uid": "Prometheus" },
      "fieldConfig": {
        "defaults": {
          "color": { "mode": "palette-classic" },
          "unit": "s"
        }
      },
      "gridPos": { "h": 3, "w": 4, "x": 12, "y": 1 },
      "id": 4,
      "options": {
        "colorMode": "value",
        "graphMode": "none",
        "justifyMode": "auto",
        "reduceOptions": { "calcs": ["lastNotNull"], "values": false }
      },
      "targets": [
        {
          "datasource": { "type": "prometheus", "uid": "Prometheus" },
          "expr": "node_process_uptime_seconds{app=\"crm-system\"}",
          "legendFormat": "Uptime",
          "refId": "A"
        }
      ],
      "title": "Thời Gian Hoạt Động (Uptime)",
      "type": "stat"
    },
    {
      "datasource": { "type": "prometheus", "uid": "Prometheus" },
      "fieldConfig": {
        "defaults": {
          "color": { "mode": "palette-classic" },
          "unit": "reqps"
        }
      },
      "gridPos": { "h": 3, "w": 4, "x": 16, "y": 1 },
      "id": 5,
      "options": {
        "colorMode": "value",
        "graphMode": "area",
        "justifyMode": "auto",
        "reduceOptions": { "calcs": ["lastNotNull"], "values": false }
      },
      "targets": [
        {
          "datasource": { "type": "prometheus", "uid": "Prometheus" },
          "expr": "sum(rate(http_requests_total{app=\"crm-system\"}[1m])) or vector(0)",
          "legendFormat": "Tần suất",
          "refId": "A"
        }
      ],
      "title": "Tần Suất HTTP Request",
      "type": "stat"
    },
    {
      "datasource": { "type": "prometheus", "uid": "Prometheus" },
      "fieldConfig": {
        "defaults": {
          "color": { "mode": "thresholds" },
          "thresholds": {
            "mode": "absolute",
            "steps": [
              { "color": "green", "value": null },
              { "color": "yellow", "value": 0.2 },
              { "color": "red", "value": 0.5 }
            ]
          },
          "unit": "s"
        }
      },
      "gridPos": { "h": 3, "w": 4, "x": 20, "y": 1 },
      "id": 6,
      "options": {
        "colorMode": "value",
        "graphMode": "area",
        "reduceOptions": { "calcs": ["mean"], "values": false }
      },
      "targets": [
        {
          "datasource": { "type": "prometheus", "uid": "Prometheus" },
          "expr": "rate(http_request_duration_seconds_sum{app=\"crm-system\"}[1m]) / rate(http_request_duration_seconds_count{app=\"crm-system\"}[1m]) or vector(0)",
          "legendFormat": "Độ trễ trung bình",
          "refId": "A"
        }
      ],
      "title": "Độ Trễ Trung Bình (Avg Latency)",
      "type": "stat"
    },

    // -------------------------------------------------------------
    // ROW 2: LƯU LƯỢNG HTTP VÀ ĐỘ TRỄ
    // -------------------------------------------------------------
    {
      "collapsed": false,
      "gridPos": { "h": 1, "w": 24, "x": 0, "y": 4 },
      "id": 101,
      "title": "📈 2. LƯU LƯỢNG HTTP VÀ PHÂN BỔ MÃ TRẠNG THÁI (STATUS CODES)",
      "type": "row"
    },
    {
      "datasource": { "type": "prometheus", "uid": "Prometheus" },
      "fieldConfig": {
        "defaults": {
          "color": { "mode": "palette-classic" },
          "custom": {
            "drawStyle": "line",
            "fillOpacity": 20,
            "lineInterpolation": "smooth",
            "showPoints": "auto",
            "stacking": { "mode": "normal" }
          },
          "unit": "reqps"
        }
      },
      "gridPos": { "h": 8, "w": 14, "x": 0, "y": 5 },
      "id": 7,
      "options": {
        "legend": { "displayMode": "table", "placement": "bottom" }
      },
      "targets": [
        {
          "datasource": { "type": "prometheus", "uid": "Prometheus" },
          "expr": "sum by (status_code) (rate(http_requests_total{app=\"crm-system\"}[1m]))",
          "legendFormat": "Mã HTTP {{status_code}}",
          "refId": "A"
        }
      ],
      "title": "Lưu Lượng Request Phân Bổ Theo Mã Phản Hồi (2xx, 4xx, 5xx)",
      "type": "timeseries"
    },
    {
      "datasource": { "type": "prometheus", "uid": "Prometheus" },
      "fieldConfig": {
        "defaults": {
          "color": { "mode": "palette-classic" },
          "custom": { "drawStyle": "line", "lineInterpolation": "smooth" },
          "unit": "s"
        }
      },
      "gridPos": { "h": 8, "w": 10, "x": 14, "y": 5 },
      "id": 8,
      "options": {
        "legend": { "displayMode": "list", "placement": "bottom" }
      },
      "targets": [
        {
          "datasource": { "type": "prometheus", "uid": "Prometheus" },
          "expr": "histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket{app=\"crm-system\"}[5m])))",
          "legendFormat": "P95 Latency",
          "refId": "A"
        },
        {
          "datasource": { "type": "prometheus", "uid": "Prometheus" },
          "expr": "histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket{app=\"crm-system\"}[5m])))",
          "legendFormat": "P99 Latency",
          "refId": "B"
        }
      ],
      "title": "Thời Gian Đáp Ứng P95 & P99 (Response Latency)",
      "type": "timeseries"
    },

    // -------------------------------------------------------------
    // ROW 3: TÀI NGUYÊN CONTAINER & POSTGRESQL
    // -------------------------------------------------------------
    {
      "collapsed": false,
      "gridPos": { "h": 1, "w": 24, "x": 0, "y": 13 },
      "id": 102,
      "title": "⚙️ 3. TÀI NGUYÊN CONTAINER VÀ CƠ SỞ DỮ LIỆU POSTGRESQL",
      "type": "row"
    },
    {
      "datasource": { "type": "prometheus", "uid": "Prometheus" },
      "fieldConfig": {
        "defaults": {
          "color": { "mode": "palette-classic" },
          "custom": { "drawStyle": "line", "fillOpacity": 15, "lineInterpolation": "smooth" },
          "unit": "percent"
        }
      },
      "gridPos": { "h": 7, "w": 8, "x": 0, "y": 14 },
      "id": 9,
      "options": {
        "legend": { "displayMode": "table", "placement": "bottom" }
      },
      "targets": [
        {
          "datasource": { "type": "prometheus", "uid": "Prometheus" },
          "expr": "rate(node_process_cpu_seconds_total{app=\"crm-system\"}[1m]) * 100",
          "legendFormat": "CPU Usage (%)",
          "refId": "A"
        }
      ],
      "title": "Tỷ Lệ Sử Dụng CPU (CPU Utilization)",
      "type": "timeseries"
    },
    {
      "datasource": { "type": "prometheus", "uid": "Prometheus" },
      "fieldConfig": {
        "defaults": {
          "color": { "mode": "palette-classic" },
          "custom": { "drawStyle": "line", "fillOpacity": 15, "lineInterpolation": "smooth" },
          "unit": "bytes"
        }
      },
      "gridPos": { "h": 7, "w": 8, "x": 8, "y": 14 },
      "id": 10,
      "options": {
        "legend": { "displayMode": "table", "placement": "bottom" }
      },
      "targets": [
        {
          "datasource": { "type": "prometheus", "uid": "Prometheus" },
          "expr": "node_process_resident_memory_bytes{app=\"crm-system\"}",
          "legendFormat": "Bộ nhớ RSS",
          "refId": "A"
        },
        {
          "datasource": { "type": "prometheus", "uid": "Prometheus" },
          "expr": "node_nodejs_heap_size_used_bytes{app=\"crm-system\"}",
          "legendFormat": "Bộ nhớ Heap đã dùng",
          "refId": "B"
        }
      ],
      "title": "Mức Tiêu Thụ RAM / Bộ Nhớ (Memory Usage)",
      "type": "timeseries"
    },
    {
      "datasource": { "type": "prometheus", "uid": "Prometheus" },
      "fieldConfig": {
        "defaults": {
          "color": { "mode": "palette-classic" },
          "custom": { "drawStyle": "line", "lineInterpolation": "smooth" },
          "unit": "s"
        }
      },
      "gridPos": { "h": 7, "w": 8, "x": 16, "y": 14 },
      "id": 11,
      "options": {
        "legend": { "displayMode": "table", "placement": "bottom" }
      },
      "targets": [
        {
          "datasource": { "type": "prometheus", "uid": "Prometheus" },
          "expr": "rate(crm_db_query_duration_seconds_sum[1m]) / rate(crm_db_query_duration_seconds_count[1m]) or vector(0)",
          "legendFormat": "Độ trễ SQL",
          "refId": "A"
        }
      ],
      "title": "Thời Gian Thực Thi SQL PostgreSQL",
      "type": "timeseries"
    },

    // -------------------------------------------------------------
    // ROW 4: METRICS NGHIỆP VỤ CRM
    // -------------------------------------------------------------
    {
      "collapsed": false,
      "gridPos": { "h": 1, "w": 24, "x": 0, "y": 21 },
      "id": 103,
      "title": "💼 4. CHỈ SỐ NGHIỆP VỤ KHÁCH HÀNG (BUSINESS METRICS)",
      "type": "row"
    },
    {
      "datasource": { "type": "prometheus", "uid": "Prometheus" },
      "fieldConfig": {
        "defaults": {
          "color": { "mode": "palette-classic" }
        }
      },
      "gridPos": { "h": 7, "w": 12, "x": 0, "y": 22 },
      "id": 12,
      "options": {
        "displayMode": "gradient",
        "orientation": "horizontal",
        "reduceOptions": { "calcs": ["lastNotNull"], "values": false }
      },
      "targets": [
        {
          "datasource": { "type": "prometheus", "uid": "Prometheus" },
          "expr": "crm_customers_total{app=\"crm-system\"}",
          "legendFormat": "{{status}}",
          "refId": "A"
        }
      ],
      "title": "Số Lượng Khách Hàng Phân Loại Theo Trạng Thái",
      "type": "bargauge"
    },
    {
      "datasource": { "type": "prometheus", "uid": "Prometheus" },
      "fieldConfig": {
        "defaults": {
          "color": { "mode": "palette-classic" },
          "custom": { "drawStyle": "bars", "fillOpacity": 80 }
        }
      },
      "gridPos": { "h": 7, "w": 12, "x": 12, "y": 22 },
      "id": 13,
      "options": {
        "legend": { "displayMode": "table", "placement": "right" }
      },
      "targets": [
        {
          "datasource": { "type": "prometheus", "uid": "Prometheus" },
          "expr": "sum by (type) (crm_interactions_total{app=\"crm-system\"})",
          "legendFormat": "{{type}}",
          "refId": "A"
        }
      ],
      "title": "Tổng Số Lượt Tương Tác Theo Hình Thức Chăm Sóc",
      "type": "timeseries"
    },

    // -------------------------------------------------------------
    // ROW 5: NHẬT KÝ LOKI & LOGQL
    // -------------------------------------------------------------
    {
      "collapsed": false,
      "gridPos": { "h": 1, "w": 24, "x": 0, "y": 29 },
      "id": 104,
      "title": "📜 5. TRUY VẤN VÀ GIÁM SÁT NHẬT KÝ LOG (GRAFANA LOKI & LOGQL)",
      "type": "row"
    },
    {
      "datasource": { "type": "loki", "uid": "Loki" },
      "gridPos": { "h": 10, "w": 24, "x": 0, "y": 30 },
      "id": 14,
      "options": {
        "dedupStrategy": "none",
        "enableLogDetails": true,
        "prettifyLogMessage": true,
        "showCommonLabels": false,
        "showLabels": false,
        "sortOrder": "Descending",
        "wrapLogMessage": true
      },
      "targets": [
        {
          "datasource": { "type": "loki", "uid": "Loki" },
          "expr": "{job=~\"crm-app|nginx\"}",
          "refId": "A"
        }
      ],
      "title": "Nhật Ký Tập Trung Thời Gian Thực (Live Log Stream từ Loki)",
      "type": "logs"
    }
  ],
  "refresh": "5s",
  "schemaVersion": 38,
  "style": "dark",
  "tags": ["crm", "kthp", "prometheus", "loki", "docker", "postgresql"],
  "time": { "from": "now-15m", "to": "now" },
  "timepicker": { "refresh_intervals": ["5s", "10s", "30s", "1m", "5m"] },
  "timezone": "browser",
  "title": "CRM System Monitoring Dashboard",
  "uid": "crm-overview-kthp",
  "version": 2
};

const filePath = path.join(__dirname, '..', 'monitoring', 'grafana', 'provisioning', 'dashboards', 'crm-overview.json');
fs.writeFileSync(filePath, JSON.stringify(dashboard, null, 2), 'utf8');
console.log('Successfully written upgraded dashboard JSON to:', filePath);
