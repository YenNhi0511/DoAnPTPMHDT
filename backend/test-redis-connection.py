"""
Script để test kết nối Redis
Chạy: python test-redis-connection.py
"""
import sys
import os

# Fix encoding for Windows console
if sys.platform == 'win32':
    os.system('chcp 65001 >nul 2>&1')

try:
    import redis
    print("[OK] Redis package installed")
except ImportError:
    print("[ERROR] Redis package not found")
    print("Installing redis package...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "redis"])
    import redis

try:
    # Test connection
    r = redis.Redis(host='localhost', port=6379, db=0, socket_connect_timeout=5)
    result = r.ping()
    
    if result:
        print("[OK] Redis connection successful!")
        print(f"   Host: localhost")
        print(f"   Port: 6379")
        print(f"   Database: 0")
        
        # Test set/get
        r.set('test_key', 'test_value')
        value = r.get('test_key')
        if value == b'test_value':
            print("[OK] Redis read/write test successful!")
        r.delete('test_key')
        
    else:
        print("[ERROR] Redis connection failed")
        sys.exit(1)
        
except redis.ConnectionError as e:
    print("[ERROR] Cannot connect to Redis!")
    print(f"   Error: {e}")
    print("\nSolutions:")
    print("   1. Install Redis/Memurai")
    print("   2. Start Redis service")
    print("   3. Check if Redis is running on port 6379")
    print("\n   For Windows:")
    print("   - Option 1: Install Memurai (https://www.memurai.com/get-memurai)")
    print("   - Option 2: Use Docker: docker run -d -p 6379:6379 redis:latest")
    print("   - Option 3: Use WSL: wsl redis-server")
    sys.exit(1)
except Exception as e:
    print(f"[ERROR] Error: {e}")
    sys.exit(1)

print("\n[SUCCESS] Redis is ready for Celery!")

