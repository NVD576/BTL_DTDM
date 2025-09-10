## BTL_DTDM – Hệ thống Chat (Django + React)

Dự án gồm 2 phần:
- **HeThongChat**: Backend viết bằng Django (REST + template) lưu dữ liệu SQLite, quản lý người dùng, phòng chat, media.
- **fun-chat**: Frontend viết bằng React, tích hợp Firebase (Auth/Firestore/Storage) để realtime/chat UI.

### Cấu trúc thư mục
```
BTL_DTDM/
  ├─ HeThongChat/        # Backend Django
  └─ fun-chat/           # Frontend React
```

### Yêu cầu hệ thống
- Python 3.10+ (khuyến nghị 3.11)
- Node.js 18+ và npm hoặc Yarn
- Git (tùy chọn)

### 1) Thiết lập Backend (Django)
1. Mở terminal tại thư mục `HeThongChat`.
2. (Khuyến nghị) Tạo môi trường ảo và kích hoạt:
```bash
python -m venv .venv
.venv\Scripts\activate
```
3. Cài đặt phụ thuộc:
```bash
pip install -r requirements.txt
```
4. Áp dụng migration và khởi tạo DB:
```bash
python manage.py migrate
```
5. (Tùy chọn) Tạo superuser để truy cập admin:
```bash
python manage.py createsuperuser
```
6. Chạy server phát triển:
```bash
python manage.py runserver
```
- Mặc định chạy tại `http://127.0.0.1:8000/`.
- Media được lưu trong `HeThongChat/media/`.

### 2) Thiết lập Frontend (React)
1. Mở terminal tại thư mục `fun-chat`.
2. Cài đặt phụ thuộc:
```bash
npm install
# hoặc
yarn
```
3. Chạy ứng dụng:
```bash
npm start
# hoặc
yarn start
```
- Mặc định chạy tại `http://localhost:3000/`.

### 3) Cấu hình Firebase cho Frontend
Ứng dụng React sử dụng Firebase, cấu hình tại `fun-chat/src/firebase/config.js`.

- Nếu bạn đã có file cấu hình, đảm bảo các khóa (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId) chính xác.
- Nếu chưa, tạo project Firebase, bật Authentication (Email/Password hoặc phương thức bạn dùng), Firestore Database và Storage, rồi cập nhật `config.js` theo mẫu:
```javascript
// fun-chat/src/firebase/config.js (ví dụ)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "<YOUR_API_KEY>",
  authDomain: "<YOUR_AUTH_DOMAIN>",
  projectId: "<YOUR_PROJECT_ID>",
  storageBucket: "<YOUR_STORAGE_BUCKET>",
  messagingSenderId: "<YOUR_SENDER_ID>",
  appId: "<YOUR_APP_ID>"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

Lưu ý: Kiểm tra các file liên quan trong `fun-chat/src/firebase/` và các hook/services để đồng bộ cấu hình.

### 4) Chạy toàn bộ hệ thống
- Chạy backend Django trước (cổng 8000).
- Chạy frontend React sau (cổng 3000).
- Kiểm tra CORS (nếu có gọi API giữa 2 phần). Mặc định dự án này chủ yếu dùng Firebase cho realtime; nếu bạn mở rộng gọi API Django, hãy cấu hình CORS trong `HeThongChat/Cloud/settings.py` với `django-cors-headers`.

### 5) Tác vụ thường dùng
```bash
# Backend (tại HeThongChat)
python manage.py makemigrations
python manage.py migrate
python manage.py runserver

# Frontend (tại fun-chat)
npm start
npm run build
```

### 6) Ghi chú triển khai
- Prod/Docker: Chưa thiết lập sẵn. Bạn có thể bổ sung Dockerfile và reverse proxy (Nginx) nếu cần.
- Bảo mật: Không commit khóa Firebase nhạy cảm lên repo công khai. Dùng biến môi trường nếu triển khai thật.
- Tệp media: Với Django dùng local storage mặc định; nếu triển khai thật cân nhắc S3/GCS…

### 7) Liên hệ/Báo lỗi
- Tạo issue mô tả bước tái hiện, log và ảnh chụp màn hình (nếu có).

# Triển khai ứng dụng Chat lên AWS

> **Mục tiêu:** Hướng dẫn triển khai ứng dụng Chat (Django back-end, React front-end, MySQL) lên AWS theo kiến trúc do bạn cung cấp.

---

## Tổng quan kiến trúc

* VPC: `vpc-chat` (172.16.0.0/16)
* Subnets: `subnet-django` (172.16.1.0/24), `subnet-data` (172.16.2.0/24)
* EC2:

  * `WebServer1`, `WebServer2` (chạy Django application / gunicorn + nginx)
  * `DataInstances` (dùng để SSH/SSH tunnel kết nối RDS từ máy cục bộ / MySQL Workbench)
* RDS: MySQL (`chatdb`)
* Load Balancer: ALB cho 2 WebServer (target group: `target-django`)
* Elastic IPs: gán cho EC2 nếu cần IP tĩnh
* S3: lưu trữ front-end build (folder `build`) hoặc dùng CloudFront
* GitHub repo: `https://github.com/NVD576/BTL_DTDM.git`

---

## Yêu cầu trước khi bắt đầu

1. Tài khoản AWS với quyền tạo VPC, EC2, RDS, S3, ELB.
2. AWS CLI đã cấu hình (optional, tiện cho upload S3, cấp quyền).
3. Keypair: `key-project.pem` (được tạo trong AWS)
4. Cài đặt trên máy local: `git`, `ssh`.

---

## 1) Tạo VPC và Subnet

(Thực hiện trong AWS Console: VPC)

1. Tạo VPC: CIDR `172.16.0.0/16`, tên `vpc-chat`.
2. Tạo 2 Subnet trong VPC `vpc-chat`:

   * `subnet-django` — `172.16.1.0/24`
   * `subnet-data` — `172.16.2.0/24`
3. Tạo Route Table `route-table-chat`, liên kết (Edit subnet associations) cả 2 subnet.
4. Tạo Internet Gateway `internet-gateway-chat`, attach vào VPC.
5. Trong `route-table-chat` thêm route: `0.0.0.0/0` -> `internet-gateway-chat`.

---

## 2) Tạo EC2 Instances

(Launch 3 instances - Ubuntu recommended)

* Khi Launch:

  * AMI: Ubuntu (Quick Start)
  * Key pair: tạo `key-project.pem` và download (giữ an toàn)
  * Network settings: chọn VPC `vpc-chat`, chọn subnet tương ứng
  * Security Groups:

    * `DataInstances` (subnet-data): cho phép `SSH(22)` từ IP của bạn, `HTTP(80)` nếu cần, `Custom TCP(3306)` từ internal nếu muốn (hoặc hạn chế chỉ từ IP của DataInstances)
    * `WebServer1`, `WebServer2` (subnet-django): `HTTP(80)` và `Custom TCP(8000)` (nếu dùng runserver) — sau này sẽ dùng nginx/gunicorn qua 80.

**Gợi ý:** giới hạn SSH chỉ cho IP của bạn (CIDR /32) hoặc qua `DataInstances` làm bastion.

### Cấu hình cơ bản cho mỗi WebServer

SSH vào mỗi WebServer:

```bash
ssh -i key-project.pem ubuntu@<PUBLIC_IP_WEB>
# cập nhật
sudo apt update && sudo apt upgrade -y
# cài python3, venv, pip, nginx, git
sudo apt install -y python3-pip python3-venv nginx git build-essential
```

Tạo virtualenv, clone repo và cài dependencies:

```bash
git clone https://github.com/NVD576/BTL_DTDM.git
cd BTL_DTDM
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Lưu ý:** file `requirements.txt` phải nằm trong repo — nếu không, thêm `Django`, `mysqlclient`/`PyMySQL`, `gunicorn`, `django-storages[boto3]`, ...

### Thiết lập DB trong Django

Trong `settings.py`, dùng biến môi trường để cấu hình DB (không hardcode):

```py
DATABASES = {
  'default': {
    'ENGINE': 'django.db.backends.mysql',
    'NAME': os.environ.get('DB_NAME', 'chatdb'),
    'USER': os.environ.get('DB_USER', 'admin'),
    'PASSWORD': os.environ.get('DB_PASSWORD'),
    'HOST': os.environ.get('DB_HOST'), # endpoint RDS
    'PORT': '3306',
  }
}
```

Export môi trường hoặc dùng systemd/service file để đặt biến môi trường.

### Chạy migrations & collectstatic

```bash
python manage.py migrate
python manage.py collectstatic --noinput
```

### Tạo systemd service cho gunicorn

Tạo file `/etc/systemd/system/gunicorn.service` (ví dụ):

```
[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/BTL_DTDM
Environment="PATH=/home/ubuntu/BTL_DTDM/venv/bin"
Environment="DB_HOST=<RDS_ENDPOINT>"
Environment="DB_USER=admin"
Environment="DB_PASSWORD=Admin123"
ExecStart=/home/ubuntu/BTL_DTDM/venv/bin/gunicorn --workers 3 --bind unix:/run/gunicorn.sock projectname.wsgi:application

[Install]
WantedBy=multi-user.target
```

Start & enable:

```bash
sudo systemctl daemon-reload
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
```

### Cấu hình Nginx làm reverse proxy

Tạo site config `/etc/nginx/sites-available/chat` và link tới `sites-enabled` — proxy pass tới unix socket gunicorn hoặc localhost:8000. Reload nginx.

---

## 3) Load Balancer (ALB)

1. Tạo Target Group `target-django` (protocol HTTP, port 80), đăng ký 2 EC2 `WebServer1` & `WebServer2` (target type: instance)
2. Tạo Load Balancer (Application Load Balancer) với listener HTTP:80 -> forward tới `target-django`.
3. Health check path: `/health/` hoặc `/` (đảm bảo trả 200).

---

## 4) RDS (MySQL) & Kết nối bằng MySQL Workbench qua SSH

1. Trong RDS console, tạo DB instance MySQL:

   * DB identifier: `chatdb`
   * Master username: `admin`
   * Master password: `Admin123` (hãy đổi cho production)
2. Đảm bảo RDS thuộc cùng VPC `vpc-chat` và security group cho phép truy cập từ `DataInstances` (hoặc subnet-data).

### Kết nối MySQL Workbench (SSH tunneling)

* Connection Method: `Standard TCP/IP over SSH`
* SSH Hostname: `<PUBLIC_IP_DataInstances>:22`
* SSH Username: `ubuntu`
* SSH Key File: `key-project.pem`
* MySQL Hostname: `<chatdb endpoint>`
* MySQL Server Port: `3306`
* Username: `admin`
* Password: `Admin123`

> Khi kết nối thành công, bạn có thể truy cập DB từ MySQL Workbench thông qua tunnel SSH.

---

## 5) Front-end (React) — build & upload lên S3

1. Trên máy local hoặc 1 EC2 dùng Node:

```bash
cd <react-project>
npm install
npm run build
# folder build/ sẽ được tạo
```

2. Tạo S3 bucket (ví dụ `chat-frontend-build`) — bật `Block public access` tùy chọn nếu dùng CloudFront. Nếu muốn host tĩnh trực tiếp từ S3, phải cho phép public read hoặc dùng CloudFront.
3. Upload folder `build` lên S3:

```bash
aws s3 cp build/ s3://chat-frontend-build/ --recursive
```

4. (Tuỳ chọn) Dùng CloudFront để cache, thêm domain/SSL.

---

## Elastic IP

* Tạo Elastic IPs và gán vào EC2 `DataInstances` (hoặc WebServer nếu cần IP tĩnh) để dễ quản lý IP public.

---

## Bảo mật & Lưu ý

* **Đổi password mặc định** `Admin123` trước khi public.
* SSH Key (`key-project.pem`) cần giữ an toàn; phân quyền `chmod 400 key-project.pem`.
* Giới hạn SSH trong Security Group chỉ cho IP của bạn.
* Không commit `settings.py` chứa mật khẩu vào GitHub. Dùng biến môi trường hoặc AWS Secrets Manager.
* Xem xét dùng AWS Systems Manager Session Manager để SSH không cần mở port 22.

---

## Biến môi trường cần thiết (ví dụ)

* `DB_HOST` — endpoint RDS
* `DB_NAME` — chatdb
* `DB_USER` — admin
* `DB_PASSWORD` — Admin123 (không dùng production)
* `SECRET_KEY` — Django secret key
* `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_STORAGE_BUCKET_NAME` — nếu dùng S3 cho static/media

---

## Kịch bản nhanh (tóm tắt các bước triển khai)

1. Tạo VPC, subnets, IGW, route table.
2. Launch 3 EC2 (2 web, 1 data/bastion), tạo key pair.
3. Tạo RDS MySQL, cấu hình SG cho phép truy cập từ `DataInstances`.
4. Cài đặt Python env, clone repo, setup Django trên `WebServer1` & `WebServer2`.
5. Tạo target group và ALB, đăng ký 2 web servers.
6. Build React, upload `build/` lên S3, cấu hình frontend hosting hoặc CloudFront.
7. Test ứng dụng qua DNS của ALB (hoặc domain trỏ tới CloudFront/S3).


---

## Tham khảo nhanh lệnh hữu ích

* SSH: `ssh -i key-project.pem ubuntu@<PUBLIC_IP>`
* Clone: `git clone https://github.com/NVD576/BTL_DTDM.git`
* Upload S3: `aws s3 cp build/ s3://<bucket-name>/ --recursive`
* Systemd: `sudo systemctl start|stop|status gunicorn`

---



