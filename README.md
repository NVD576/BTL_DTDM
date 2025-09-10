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


