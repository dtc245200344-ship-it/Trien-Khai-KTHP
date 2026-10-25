// Script giả lập tải người dùng truy cập để demo biểu đồ Grafana & Prometheus & Loki
const http = require('http');

const HOST = '127.0.0.1';
const PORT = 80; // Qua Nginx Reverse Proxy

function makeRequest(path, method = 'GET', postData = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: HOST,
      port: PORT,
      path: path,
      method: method,
      headers: {
        'User-Agent': 'Traffic-Generator-Simulator/1.0',
        ...(postData ? {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        } : {})
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', (err) => {
      resolve({ status: 'ERR', error: err.message });
    });

    if (postData) req.write(postData);
    req.end();
  });
}

const endpoints = [
  '/',
  '/customers.html',
  '/contacts.html',
  '/interactions.html',
  '/api/stats/overview',
  '/api/customers',
  '/api/contacts',
  '/api/interactions',
  '/health',
  '/metrics'
];

async function runTrafficLoop() {
  console.log('🚀 Bắt đầu tạo lưu lượng giả lập (Traffic Simulation)...');
  console.log('Nhấn Ctrl+C để dừng kịch bản.');

  let counter = 0;
  while (true) {
    counter++;
    const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    const res = await makeRequest(randomEndpoint);
    
    process.stdout.write(`[#${counter}] ${randomEndpoint} -> Status: ${res.status}\r`);

    // Thỉnh thoảng gửi tương tác mới để cập nhật Business Metric
    if (counter % 15 === 0) {
      const sampleInteraction = JSON.stringify({
        customer_id: 1,
        type: 'Cuộc gọi',
        direction: 'Chiều đi',
        title: `Cuộc gọi định kỳ kiểm tra hệ thống #${counter}`,
        summary: 'Kiểm tra độ trễ phản hồi qua Nginx và tình trạng ghi nhận log Loki.',
        outcome: 'Thành công',
        staff_name: 'Robot Tự Động'
      });
      await makeRequest('/api/interactions', 'POST', sampleInteraction);
      console.log(`\n✨ Đã tự động tạo 1 bản ghi tương tác mới vào CSDL!`);
    }

    // Delay ngẫu nhiên từ 100ms - 500ms
    await new Promise(r => setTimeout(r, 150 + Math.random() * 250));
  }
}

runTrafficLoop();
