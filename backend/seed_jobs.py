"""
Script để seed jobs với JD chi tiết
Chạy: python manage.py shell < seed_jobs.py
Hoặc: python seed_jobs.py (sau khi setup Django)
"""
import os
import django
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from accounts.models import User
from jobs.models import Job, RecruitmentProcess

# Lấy hoặc tạo user để làm created_by
admin_user, _ = User.objects.get_or_create(
    email='admin@recruitment.com',
    defaults={
        'username': 'admin',
        'first_name': 'Admin',
        'last_name': 'User',
        'role': User.Role.ADMIN
    }
)

# Lấy hoặc tạo default recruitment process
default_process, _ = RecruitmentProcess.objects.get_or_create(
    name='Quy trình tuyển dụng mặc định',
    defaults={
        'description': 'Quy trình tuyển dụng chuẩn cho các vị trí',
        'is_default': True,
        'created_by': admin_user
    }
)

# Danh sách các tỉnh/thành phố để phân bổ đều
provinces = [
    'Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng',
    'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
    'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
    'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông',
    'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang',
    'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang', 'Hòa Bình',
    'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu',
    'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định',
    'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên',
    'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị',
    'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên',
    'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang',
    'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
]

# Kinh nghiệm từ 1-5 năm để phân bổ đều
experience_years_list = [1, 2, 3, 4, 5]

# Danh sách jobs với JD chi tiết
jobs_data = [
    {
        'title': 'Senior Full Stack Developer',
        'department': 'Engineering',
        'description': '''Chúng tôi đang tìm kiếm một Senior Full Stack Developer có kinh nghiệm để tham gia vào đội ngũ phát triển sản phẩm của chúng tôi. Bạn sẽ làm việc trên các dự án thú vị, sử dụng công nghệ mới nhất và có cơ hội phát triển nghề nghiệp trong môi trường năng động.

Về công ty:
- Startup công nghệ hàng đầu với hơn 100 nhân viên
- Môi trường làm việc linh hoạt, hỗ trợ remote
- Cơ hội thăng tiến và phát triển kỹ năng
- Lương cạnh tranh và nhiều phúc lợi hấp dẫn''',
        'requirements': '''Yêu cầu:
- Tối thiểu 5 năm kinh nghiệm phát triển web
- Thành thạo JavaScript/TypeScript, React, Node.js
- Kinh nghiệm với Python/Django hoặc Java/Spring Boot
- Hiểu biết về database (PostgreSQL, MongoDB)
- Kinh nghiệm với Docker, Kubernetes
- Có khả năng làm việc độc lập và theo nhóm
- Kỹ năng giao tiếp tốt, tiếng Anh khá

Ưu tiên:
- Kinh nghiệm với microservices architecture
- Kinh nghiệm với AWS/GCP
- Có portfolio hoặc GitHub profile ấn tượng''',
        'salary': '2000-3500 USD',
        'salary_min': 2000,
        'salary_max': 3500,
        'location': 'Hà Nội / Remote',
        'employment_type': Job.EmploymentType.FULLTIME,
        'positions_count': 2,
        'experience_years': 5,
        'status': Job.Status.OPEN,
        'deadline': timezone.now() + timedelta(days=30),
    },
    {
        'title': 'Frontend Developer (React)',
        'department': 'Engineering',
        'description': '''Vị trí Frontend Developer tại công ty công nghệ hàng đầu. Bạn sẽ tham gia phát triển các ứng dụng web hiện đại, tối ưu trải nghiệm người dùng và làm việc với đội ngũ thiết kế tài năng.

Môi trường làm việc:
- Team nhỏ gọn, năng động, cởi mở
- Công nghệ mới nhất: React 18, Next.js, TypeScript
- Design system hiện đại với Tailwind CSS
- Code review và pair programming thường xuyên''',
        'requirements': '''Yêu cầu:
- 3+ năm kinh nghiệm với React
- Thành thạo TypeScript, JavaScript ES6+
- Kinh nghiệm với state management (Redux, Zustand)
- Hiểu biết về RESTful API và GraphQL
- Kinh nghiệm với testing (Jest, React Testing Library)
- Có portfolio hoặc dự án open source

Kỹ năng mềm:
- Tư duy sáng tạo, chú ý đến chi tiết
- Khả năng làm việc nhóm tốt
- Tiếng Anh giao tiếp tốt''',
        'salary': '1200-2000 USD',
        'salary_min': 1200,
        'salary_max': 2000,
        'location': 'TP. Hồ Chí Minh',
        'employment_type': Job.EmploymentType.FULLTIME,
        'positions_count': 3,
        'experience_years': 3,
        'status': Job.Status.OPEN,
        'deadline': timezone.now() + timedelta(days=45),
    },
    {
        'title': 'Backend Developer (Python/Django)',
        'department': 'Engineering',
        'description': '''Tuyển dụng Backend Developer có kinh nghiệm với Python/Django để phát triển các API và hệ thống backend mạnh mẽ, scalable.

Dự án bạn sẽ làm:
- Xây dựng RESTful API cho các ứng dụng web/mobile
- Tối ưu hiệu suất database và caching
- Phát triển microservices architecture
- Tích hợp với các dịch vụ bên thứ ba (payment, email, SMS)''',
        'requirements': '''Yêu cầu:
- 4+ năm kinh nghiệm với Python
- Thành thạo Django/Django REST Framework
- Kinh nghiệm với PostgreSQL, Redis
- Hiểu biết về Celery, RabbitMQ
- Kinh nghiệm với Docker, CI/CD
- Kiến thức về system design và scalability

Bonus:
- Kinh nghiệm với FastAPI
- Kinh nghiệm với Elasticsearch
- Kinh nghiệm với message queues (Kafka, RabbitMQ)''',
        'salary': '1500-2500 USD',
        'salary_min': 1500,
        'salary_max': 2500,
        'location': 'Hà Nội',
        'employment_type': Job.EmploymentType.FULLTIME,
        'positions_count': 2,
        'experience_years': 4,
        'status': Job.Status.OPEN,
        'deadline': timezone.now() + timedelta(days=35),
    },
    {
        'title': 'DevOps Engineer',
        'department': 'Engineering',
        'description': '''Tuyển dụng DevOps Engineer để quản lý infrastructure, CI/CD pipeline và đảm bảo hệ thống hoạt động ổn định, hiệu quả.

Trách nhiệm:
- Quản lý cloud infrastructure (AWS/GCP)
- Xây dựng và duy trì CI/CD pipelines
- Monitoring và logging (Prometheus, Grafana, ELK)
- Security và compliance
- Tối ưu chi phí cloud''',
        'requirements': '''Yêu cầu:
- 3+ năm kinh nghiệm DevOps
- Thành thạo AWS hoặc GCP
- Kinh nghiệm với Kubernetes, Docker
- Kinh nghiệm với Terraform, Ansible
- Kinh nghiệm với CI/CD (GitLab CI, GitHub Actions, Jenkins)
- Kinh nghiệm với monitoring tools

Ưu tiên:
- Certifications (AWS, GCP, Kubernetes)
- Kinh nghiệm với serverless (Lambda, Cloud Functions)
- Kinh nghiệm với security (WAF, DDoS protection)''',
        'salary': '1800-3000 USD',
        'salary_min': 1800,
        'salary_max': 3000,
        'location': 'Remote',
        'employment_type': Job.EmploymentType.FULLTIME,
        'positions_count': 1,
        'experience_years': 3,
        'status': Job.Status.OPEN,
        'deadline': timezone.now() + timedelta(days=40),
    },
    {
        'title': 'Mobile Developer (React Native)',
        'department': 'Engineering',
        'description': '''Tuyển dụng Mobile Developer để phát triển ứng dụng mobile cross-platform với React Native.

Dự án:
- Phát triển ứng dụng iOS và Android
- Tích hợp với backend API
- Tối ưu hiệu suất và trải nghiệm người dùng
- Làm việc với team design và backend''',
        'requirements': '''Yêu cầu:
- 2+ năm kinh nghiệm với React Native
- Kinh nghiệm với Redux hoặc MobX
- Hiểu biết về iOS và Android platform
- Kinh nghiệm với native modules
- Kinh nghiệm với app store deployment

Bonus:
- Kinh nghiệm với Flutter
- Kinh nghiệm với native development (Swift, Kotlin)
- Có app đã publish trên App Store/Play Store''',
        'salary': '1000-1800 USD',
        'salary_min': 1000,
        'salary_max': 1800,
        'location': 'TP. Hồ Chí Minh',
        'employment_type': Job.EmploymentType.FULLTIME,
        'positions_count': 2,
        'experience_years': 2,
        'status': Job.Status.OPEN,
        'deadline': timezone.now() + timedelta(days=50),
    },
    {
        'title': 'UI/UX Designer',
        'department': 'Design',
        'description': '''Tuyển dụng UI/UX Designer để thiết kế giao diện và trải nghiệm người dùng cho các sản phẩm web và mobile.

Công việc:
- Thiết kế wireframes, mockups, prototypes
- User research và usability testing
- Làm việc với developers để implement designs
- Xây dựng design system và component library''',
        'requirements': '''Yêu cầu:
- 3+ năm kinh nghiệm UI/UX design
- Thành thạo Figma, Sketch, Adobe XD
- Portfolio ấn tượng với các dự án thực tế
- Hiểu biết về design principles và best practices
- Kinh nghiệm với responsive design

Ưu tiên:
- Kinh nghiệm với animation (After Effects, Principle)
- Kinh nghiệm với frontend development (HTML/CSS)
- Kinh nghiệm với accessibility design''',
        'salary': '1000-2000 USD',
        'salary_min': 1000,
        'salary_max': 2000,
        'location': 'Hà Nội',
        'employment_type': Job.EmploymentType.FULLTIME,
        'positions_count': 1,
        'experience_years': 3,
        'status': Job.Status.OPEN,
        'deadline': timezone.now() + timedelta(days=30),
    },
    {
        'title': 'Data Engineer',
        'department': 'Data',
        'description': '''Tuyển dụng Data Engineer để xây dựng data pipeline, data warehouse và hỗ trợ team data science.

Trách nhiệm:
- Xây dựng ETL/ELT pipelines
- Quản lý data warehouse (BigQuery, Snowflake)
- Tối ưu data processing performance
- Đảm bảo data quality và governance''',
        'requirements': '''Yêu cầu:
- 3+ năm kinh nghiệm Data Engineering
- Thành thạo Python, SQL
- Kinh nghiệm với Apache Airflow, dbt
- Kinh nghiệm với data warehouses (BigQuery, Redshift, Snowflake)
- Kinh nghiệm với Spark, Pandas

Bonus:
- Kinh nghiệm với Kafka, streaming data
- Kinh nghiệm với machine learning pipelines
- Certifications (GCP, AWS Data Engineering)''',
        'salary': '1500-2800 USD',
        'salary_min': 1500,
        'salary_max': 2800,
        'location': 'Hà Nội / Remote',
        'employment_type': Job.EmploymentType.FULLTIME,
        'positions_count': 1,
        'experience_years': 3,
        'status': Job.Status.OPEN,
        'deadline': timezone.now() + timedelta(days=45),
    },
    {
        'title': 'Product Manager',
        'department': 'Product',
        'description': '''Tuyển dụng Product Manager để quản lý sản phẩm, định hướng chiến lược và làm việc với các team engineering, design, marketing.

Trách nhiệm:
- Xây dựng product roadmap và strategy
- Phân tích user needs và market trends
- Làm việc với stakeholders để define requirements
- Quản lý product backlog và prioritization
- Track metrics và KPIs''',
        'requirements': '''Yêu cầu:
- 4+ năm kinh nghiệm Product Management
- Kinh nghiệm với agile/scrum methodology
- Kỹ năng phân tích dữ liệu tốt
- Kỹ năng giao tiếp và leadership
- Tiếng Anh thành thạo

Ưu tiên:
- Kinh nghiệm với B2B SaaS products
- Technical background (engineering degree)
- MBA hoặc tương đương''',
        'salary': '2000-3500 USD',
        'salary_min': 2000,
        'salary_max': 3500,
        'location': 'TP. Hồ Chí Minh',
        'employment_type': Job.EmploymentType.FULLTIME,
        'positions_count': 1,
        'experience_years': 4,
        'status': Job.Status.OPEN,
        'deadline': timezone.now() + timedelta(days=40),
    },
    {
        'title': 'QA Engineer',
        'department': 'Quality Assurance',
        'description': '''Tuyển dụng QA Engineer để đảm bảo chất lượng sản phẩm thông qua testing và quality assurance processes.

Công việc:
- Viết và thực thi test cases
- Automated testing với Selenium, Cypress
- Manual testing cho các features mới
- Bug tracking và reporting
- Làm việc với developers để fix bugs''',
        'requirements': '''Yêu cầu:
- 2+ năm kinh nghiệm QA/Testing
- Kinh nghiệm với automated testing tools
- Hiểu biết về testing methodologies
- Kinh nghiệm với API testing (Postman, REST Assured)
- Kinh nghiệm với bug tracking tools (Jira, Bugzilla)

Bonus:
- Kinh nghiệm với performance testing
- Kinh nghiệm với security testing
- Programming skills (Python, JavaScript)''',
        'salary': '800-1500 USD',
        'salary_min': 800,
        'salary_max': 1500,
        'location': 'Hà Nội',
        'employment_type': Job.EmploymentType.FULLTIME,
        'positions_count': 2,
        'experience_years': 2,
        'status': Job.Status.OPEN,
        'deadline': timezone.now() + timedelta(days=35),
    },
    {
        'title': 'Marketing Manager',
        'department': 'Marketing',
        'description': '''Tuyển dụng Marketing Manager để phát triển và thực thi chiến lược marketing, tăng trưởng user base và brand awareness.

Trách nhiệm:
- Xây dựng marketing strategy và campaigns
- Quản lý digital marketing (SEO, SEM, social media)
- Content marketing và copywriting
- Phân tích metrics và ROI
- Làm việc với agencies và partners''',
        'requirements': '''Yêu cầu:
- 4+ năm kinh nghiệm Marketing
- Kinh nghiệm với digital marketing
- Kinh nghiệm với Google Analytics, Facebook Ads
- Kỹ năng content writing tốt
- Tiếng Anh thành thạo

Ưu tiên:
- Kinh nghiệm với B2B SaaS marketing
- Kinh nghiệm với growth hacking
- Certifications (Google Ads, Facebook Blueprint)''',
        'salary': '1200-2200 USD',
        'salary_min': 1200,
        'salary_max': 2200,
        'location': 'TP. Hồ Chí Minh',
        'employment_type': Job.EmploymentType.FULLTIME,
        'positions_count': 1,
        'experience_years': 4,
        'status': Job.Status.OPEN,
        'deadline': timezone.now() + timedelta(days=30),
    },
]

# Tạo jobs với phân bổ đều địa điểm và kinh nghiệm
created_count = 0
province_index = 0
experience_index = 0

for job_data in jobs_data:
    # Phân bổ đều địa điểm
    job_data['location'] = provinces[province_index % len(provinces)]
    province_index += 1
    
    # Phân bổ đều kinh nghiệm từ 1-5 năm
    job_data['experience_years'] = experience_years_list[experience_index % len(experience_years_list)]
    experience_index += 1
    
    job, created = Job.objects.get_or_create(
        title=job_data['title'],
        defaults={
            **job_data,
            'created_by': admin_user,
            'recruitment_process': default_process,
        }
    )
    if created:
        created_count += 1
        print(f"✅ Created: {job.title} - {job.location} - {job.experience_years} năm")
    else:
        print(f"⏭️  Already exists: {job.title}")

print(f"\n🎉 Hoàn thành! Đã tạo {created_count} jobs mới.")
print(f"📊 Tổng số jobs trong hệ thống: {Job.objects.count()}")

