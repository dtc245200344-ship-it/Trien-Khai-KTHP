# ====================================================================
# DOCKERFILE CHO CRM APPLICATION (HARDENED & MULTI-STAGE BUILD)
# ====================================================================

# STAGE 1: Tải dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Cài đặt libc6-compat nếu cần và copy package
RUN apk add --no-cache libc6-compat
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts

# STAGE 2: Runner (Ảnh chạy thực tế siêu nhẹ và an toàn)
FROM node:20-alpine AS runner
WORKDIR /app

# Thiết lập biến môi trường chạy production
ENV NODE_ENV=production
ENV PORT=3000

# Tạo thư mục và phân quyền cho người dùng non-root 'node'
RUN chown -R node:node /app

# Copy thư viện từ stage deps và mã nguồn
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .

# Chuyển quyền thực thi sang user non-root 'node' (Nguyên tắc Security Hardening)
USER node

# Expose cổng ứng dụng
EXPOSE 3000

# Healthcheck giám sát trạng thái container tự động
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Khởi động ứng dụng
CMD ["node", "server.js"]
