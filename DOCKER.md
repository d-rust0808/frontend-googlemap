# Hướng dẫn chạy với Docker

## Yêu cầu

- Docker Engine >= 20.10
- Docker Compose >= 2.0

## Quick Start

### 1. Tạo file .env

Tạo file `.env` trong thư mục gốc với nội dung:

```env
DB_HOST=163.223.8.12
DB_PORT=5432
DB_USER=cdudu.com
DB_PASSWORD=Trucphuong0610@
DB_NAME=data_google_map
DB_SSL_MODE=disable
DB_MAX_OPEN_CONNS=100
DB_MAX_IDLE_CONNS=10
DB_CONN_MAX_LIFETIME=3600
DB_TABLE_NAME=stores
PORT=5000
```

### 2. Chạy Production

```bash
# Build và chạy
docker-compose up -d --build

# Xem logs
docker-compose logs -f

# Dừng
docker-compose down
```

Truy cập: http://localhost:5000

### 3. Chạy Development (với hot-reload)

```bash
docker-compose -f docker-compose.dev.yml up --build
```

## Các lệnh thường dùng

```bash
# Build lại image
docker-compose build

# Khởi động containers
docker-compose up -d

# Xem logs
docker-compose logs -f app

# Dừng containers
docker-compose down

# Dừng và xóa volumes
docker-compose down -v

# Rebuild từ đầu
docker-compose build --no-cache
docker-compose up -d
```

## Kiểm tra container

```bash
# Xem containers đang chạy
docker ps

# Xem logs của container
docker logs google-map-store-app

# Vào trong container
docker exec -it google-map-store-app sh

# Kiểm tra health
curl http://localhost:5000/health
```

## Troubleshooting

### Container không start

```bash
# Xem logs chi tiết
docker-compose logs app

# Kiểm tra .env file
cat .env
```

### Port đã được sử dụng

Sửa port trong `docker-compose.yml`:

```yaml
ports:
  - "5001:5000" # Thay 5000 thành 5001
```

### Database connection error

- Kiểm tra DB_HOST có đúng không
- Kiểm tra firewall/network có chặn không
- Kiểm tra credentials trong .env
