# Google Map Store Management

Ứng dụng quản lý store với giao diện Bootstrap, kết nối PostgreSQL database.

## Tính năng

- ✅ Hiển thị danh sách store (name, phone)
- ✅ Tìm kiếm và lọc dữ liệu (theo tên, SĐT, hoặc từ khóa)
- ✅ Phân trang dữ liệu
- ✅ Xóa store
- ✅ Giao diện Bootstrap responsive

## Công nghệ

- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Frontend**: HTML + Bootstrap 5
- **Container**: Docker & Docker Compose

## Cài đặt và chạy

### Cách 1: Chạy với Docker (Khuyến nghị)

#### Production

1. Tạo file `.env` từ template:
```bash
cp .env.example .env
```

2. Cập nhật thông tin database trong file `.env`

3. Build và chạy container:
```bash
docker-compose up -d --build
```

4. Truy cập ứng dụng: `http://localhost:5000`

#### Development

```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Cách 2: Chạy trực tiếp (không Docker)

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` và cấu hình database

3. Chạy server:
```bash
# Production
npm start

# Development (với auto-reload)
npm run dev
```

4. Truy cập: `http://localhost:5000`

## Cấu hình Database

File `.env` cần có các biến sau:

```env
DB_HOST=your_db_host
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_SSL_MODE=disable
DB_MAX_OPEN_CONNS=100
DB_MAX_IDLE_CONNS=10
DB_CONN_MAX_LIFETIME=3600
DB_TABLE_NAME=stores
PORT=5000
```

## Docker Commands

```bash
# Build image
docker-compose build

# Start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Rebuild và restart
docker-compose up -d --build

# Xóa containers và volumes
docker-compose down -v
```

## API Endpoints

- `GET /` - Giao diện web
- `GET /health` - Health check
- `GET /stores` - Lấy danh sách store (có filter và pagination)
  - Query params: `name`, `phone`, `search_keyword`, `page`, `limit`
- `DELETE /stores/:id` - Xóa store theo ID
- `GET /debug/tables` - Debug: Liệt kê các bảng trong database

## Scripts

```bash
# Kiểm tra các bảng trong database
npm run check-tables

# Kiểm tra cấu trúc bảng
node src/check-table-structure.js
```

## Cấu trúc dự án

```
.
├── src/
│   ├── server.js          # Express server
│   ├── db.js              # Database connection
│   ├── check-tables.js    # Script kiểm tra bảng
│   └── check-table-structure.js
├── public/
│   └── index.html         # Frontend UI
├── Dockerfile             # Production Docker image
├── Dockerfile.dev         # Development Docker image
├── docker-compose.yml     # Production compose
├── docker-compose.dev.yml # Development compose
└── .env                   # Environment variables
```

## License

ISC
