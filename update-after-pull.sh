#!/bin/bash

echo "========================================"
echo "  CẬP NHẬT CODE SAU KHI PULL TỪ GITHUB"
echo "========================================"
echo ""

echo "[1/5] Cập nhật Backend dependencies..."
cd backend
source venv/bin/activate
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ LỖI: Không thể cài đặt backend dependencies!"
    exit 1
fi
echo "✓ Backend dependencies đã được cập nhật"
echo ""

echo "[2/5] Chạy migrations..."
python manage.py migrate
if [ $? -ne 0 ]; then
    echo "⚠️ CẢNH BÁO: Có thể có lỗi migrations, kiểm tra lại!"
fi
echo "✓ Migrations đã được chạy"
echo ""

echo "[3/5] Cập nhật Frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ LỖI: Không thể cài đặt frontend dependencies!"
    exit 1
fi
echo "✓ Frontend dependencies đã được cập nhật"
echo ""

echo "[4/5] Kiểm tra file .env..."
cd ../backend
if [ ! -f .env ]; then
    echo "⚠️ CẢNH BÁO: File .env không tồn tại!"
    echo "Vui lòng tạo file .env trong thư mục backend"
    echo "Xem HUONG-DAN-CAI-DAT.md để biết chi tiết"
else
    echo "✓ File .env đã tồn tại"
fi
echo ""

echo "[5/5] Kiểm tra database connection..."
python check_database_connection.py
if [ $? -ne 0 ]; then
    echo "⚠️ CẢNH BÁO: Có thể có vấn đề với database!"
    echo "Kiểm tra lại DATABASE_URL trong file .env"
fi
echo ""

echo "========================================"
echo "  CẬP NHẬT HOÀN TẤT!"
echo "========================================"
echo ""
echo "Bạn có thể chạy project bằng các lệnh sau:"
echo ""
echo "Backend:  cd backend && source venv/bin/activate && python manage.py runserver"
echo "Frontend: cd frontend && npm start"
echo ""

