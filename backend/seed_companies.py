"""
Script để seed nhiều doanh nghiệp với jobs từ nhiều ngành nghề khác nhau
Chạy: python seed_companies.py
"""
import os
import django
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from accounts.models import User
from jobs.models import Job, RecruitmentProcess

# Lấy hoặc tạo default recruitment process
default_process, _ = RecruitmentProcess.objects.get_or_create(
    name='Quy trình tuyển dụng mặc định',
    defaults={
        'description': 'Quy trình tuyển dụng chuẩn cho các vị trí',
        'is_default': True,
        'created_by': User.objects.filter(role=User.Role.ADMIN).first() or User.objects.first()
    }
)

# Danh sách doanh nghiệp và jobs của họ
companies_data = [
    {
        'company': {
            'email': 'techcorp@example.com',
            'username': 'techcorp',
            'first_name': 'Tech',
            'last_name': 'Corp',
            'phone': '0901234567',
            'role': User.Role.ADMIN,
        },
        'jobs': [
            {
                'title': 'Senior Full Stack Developer',
                'department': 'Engineering',
                'description': '''TechCorp đang tìm kiếm Senior Full Stack Developer có kinh nghiệm để tham gia đội ngũ phát triển sản phẩm công nghệ hàng đầu.

Về TechCorp:
- Công ty công nghệ hàng đầu với hơn 200 nhân viên
- Môi trường làm việc năng động, sáng tạo
- Cơ hội thăng tiến và phát triển kỹ năng
- Lương cạnh tranh và nhiều phúc lợi hấp dẫn''',
                'requirements': '''Yêu cầu:
- Tối thiểu 5 năm kinh nghiệm phát triển web
- Thành thạo JavaScript/TypeScript, React, Node.js
- Kinh nghiệm với Python/Django hoặc Java/Spring Boot
- Hiểu biết về database (PostgreSQL, MongoDB)
- Kinh nghiệm với Docker, Kubernetes
- Có khả năng làm việc độc lập và theo nhóm

Ưu tiên:
- Kinh nghiệm với microservices architecture
- Kinh nghiệm với AWS/GCP
- Có portfolio hoặc GitHub profile ấn tượng''',
                'salary': '2500-4000 USD',
                'salary_min': 2500,
                'salary_max': 4000,
                'location': 'Hà Nội',
                'employment_type': Job.EmploymentType.FULLTIME,
                'positions_count': 2,
                'experience_years': 5,
            },
            {
                'title': 'DevOps Engineer',
                'department': 'Engineering',
                'description': '''Tuyển dụng DevOps Engineer để quản lý infrastructure, CI/CD pipeline và đảm bảo hệ thống hoạt động ổn định.''',
                'requirements': '''Yêu cầu:
- 3+ năm kinh nghiệm DevOps
- Thành thạo AWS hoặc GCP
- Kinh nghiệm với Kubernetes, Docker
- Kinh nghiệm với Terraform, Ansible
- Kinh nghiệm với CI/CD (GitLab CI, GitHub Actions)''',
                'salary': '2000-3500 USD',
                'salary_min': 2000,
                'salary_max': 3500,
                'location': 'Hà Nội / Remote',
                'employment_type': Job.EmploymentType.FULLTIME,
                'positions_count': 1,
                'experience_years': 3,
            },
        ]
    },
    {
        'company': {
            'email': 'fintech@example.com',
            'username': 'fintech',
            'first_name': 'FinTech',
            'last_name': 'Solutions',
            'phone': '0902234567',
            'role': User.Role.ADMIN,
        },
        'jobs': [
            {
                'title': 'Backend Developer (Python/Django)',
                'department': 'Engineering',
                'description': '''FinTech Solutions tuyển dụng Backend Developer có kinh nghiệm với Python/Django để phát triển các API và hệ thống backend cho nền tảng tài chính.

Dự án:
- Xây dựng RESTful API cho ứng dụng fintech
- Tối ưu hiệu suất database và caching
- Phát triển microservices architecture
- Tích hợp với các dịch vụ thanh toán''',
                'requirements': '''Yêu cầu:
- 4+ năm kinh nghiệm với Python
- Thành thạo Django/Django REST Framework
- Kinh nghiệm với PostgreSQL, Redis
- Hiểu biết về Celery, RabbitMQ
- Kinh nghiệm với Docker, CI/CD
- Kiến thức về system design và scalability

Bonus:
- Kinh nghiệm với FastAPI
- Kinh nghiệm với payment gateways
- Kinh nghiệm với security (PCI-DSS)''',
                'salary': '1800-3000 USD',
                'salary_min': 1800,
                'salary_max': 3000,
                'location': 'TP. Hồ Chí Minh',
                'employment_type': Job.EmploymentType.FULLTIME,
                'positions_count': 2,
                'experience_years': 4,
            },
            {
                'title': 'Data Engineer',
                'department': 'Data',
                'description': '''Tuyển dụng Data Engineer để xây dựng data pipeline, data warehouse và hỗ trợ team data science trong lĩnh vực fintech.''',
                'requirements': '''Yêu cầu:
- 3+ năm kinh nghiệm Data Engineering
- Thành thạo Python, SQL
- Kinh nghiệm với Apache Airflow, dbt
- Kinh nghiệm với data warehouses (BigQuery, Redshift)
- Kinh nghiệm với Spark, Pandas

Bonus:
- Kinh nghiệm với financial data
- Kinh nghiệm với real-time streaming''',
                'salary': '1700-2800 USD',
                'salary_min': 1700,
                'salary_max': 2800,
                'location': 'TP. Hồ Chí Minh',
                'employment_type': Job.EmploymentType.FULLTIME,
                'positions_count': 1,
                'experience_years': 3,
            },
        ]
    },
    {
        'company': {
            'email': 'designstudio@example.com',
            'username': 'designstudio',
            'first_name': 'Creative',
            'last_name': 'Design Studio',
            'phone': '0903234567',
            'role': User.Role.ADMIN,
        },
        'jobs': [
            {
                'title': 'UI/UX Designer',
                'department': 'Design',
                'description': '''Creative Design Studio tuyển dụng UI/UX Designer để thiết kế giao diện và trải nghiệm người dùng cho các sản phẩm web và mobile.

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
                'salary': '1200-2200 USD',
                'salary_min': 1200,
                'salary_max': 2200,
                'location': 'Hà Nội',
                'employment_type': Job.EmploymentType.FULLTIME,
                'positions_count': 2,
                'experience_years': 3,
            },
        ]
    },
    {
        'company': {
            'email': 'ecommerce@example.com',
            'username': 'ecommerce',
            'first_name': 'E-Commerce',
            'last_name': 'Platform',
            'phone': '0904234567',
            'role': User.Role.ADMIN,
        },
        'jobs': [
            {
                'title': 'Frontend Developer (React)',
                'department': 'Engineering',
                'description': '''E-Commerce Platform tuyển dụng Frontend Developer để phát triển các ứng dụng web hiện đại cho nền tảng thương mại điện tử.

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

Kỹ năng mềm:
- Tư duy sáng tạo, chú ý đến chi tiết
- Khả năng làm việc nhóm tốt
- Tiếng Anh giao tiếp tốt''',
                'salary': '1500-2500 USD',
                'salary_min': 1500,
                'salary_max': 2500,
                'location': 'TP. Hồ Chí Minh',
                'employment_type': Job.EmploymentType.FULLTIME,
                'positions_count': 3,
                'experience_years': 3,
            },
            {
                'title': 'Product Manager',
                'department': 'Product',
                'description': '''Tuyển dụng Product Manager để quản lý sản phẩm e-commerce, định hướng chiến lược và làm việc với các team engineering, design, marketing.''',
                'requirements': '''Yêu cầu:
- 4+ năm kinh nghiệm Product Management
- Kinh nghiệm với agile/scrum methodology
- Kỹ năng phân tích dữ liệu tốt
- Kỹ năng giao tiếp và leadership
- Tiếng Anh thành thạo

Ưu tiên:
- Kinh nghiệm với e-commerce products
- Technical background (engineering degree)
- MBA hoặc tương đương''',
                'salary': '2200-3800 USD',
                'salary_min': 2200,
                'salary_max': 3800,
                'location': 'TP. Hồ Chí Minh',
                'employment_type': Job.EmploymentType.FULLTIME,
                'positions_count': 1,
                'experience_years': 4,
            },
        ]
    },
    {
        'company': {
            'email': 'healthcare@example.com',
            'username': 'healthcare',
            'first_name': 'HealthCare',
            'last_name': 'Tech',
            'phone': '0905234567',
            'role': User.Role.ADMIN,
        },
        'jobs': [
            {
                'title': 'Mobile Developer (React Native)',
                'department': 'Engineering',
                'description': '''HealthCare Tech tuyển dụng Mobile Developer để phát triển ứng dụng mobile cho hệ thống quản lý y tế.

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
- Kinh nghiệm với healthcare apps
- Có app đã publish trên App Store/Play Store''',
                'salary': '1300-2000 USD',
                'salary_min': 1300,
                'salary_max': 2000,
                'location': 'Hà Nội',
                'employment_type': Job.EmploymentType.FULLTIME,
                'positions_count': 2,
                'experience_years': 2,
            },
        ]
    },
    {
        'company': {
            'email': 'marketing@example.com',
            'username': 'marketing',
            'first_name': 'Digital',
            'last_name': 'Marketing Agency',
            'phone': '0906234567',
            'role': User.Role.ADMIN,
        },
        'jobs': [
            {
                'title': 'Marketing Manager',
                'department': 'Marketing',
                'description': '''Digital Marketing Agency tuyển dụng Marketing Manager để phát triển và thực thi chiến lược marketing, tăng trưởng client base và brand awareness.

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
- Kinh nghiệm với B2B marketing
- Kinh nghiệm với growth hacking
- Certifications (Google Ads, Facebook Blueprint)''',
                'salary': '1500-2500 USD',
                'salary_min': 1500,
                'salary_max': 2500,
                'location': 'TP. Hồ Chí Minh',
                'employment_type': Job.EmploymentType.FULLTIME,
                'positions_count': 1,
                'experience_years': 4,
            },
            {
                'title': 'Content Writer',
                'department': 'Marketing',
                'description': '''Tuyển dụng Content Writer để tạo nội dung marketing, blog posts, social media content cho các chiến dịch marketing.''',
                'requirements': '''Yêu cầu:
- 2+ năm kinh nghiệm content writing
- Kỹ năng viết tốt, sáng tạo
- Hiểu biết về SEO
- Kinh nghiệm với social media
- Tiếng Anh tốt

Bonus:
- Kinh nghiệm với video content
- Kinh nghiệm với graphic design''',
                'salary': '800-1500 USD',
                'salary_min': 800,
                'salary_max': 1500,
                'location': 'Remote',
                'employment_type': Job.EmploymentType.FULLTIME,
                'positions_count': 2,
                'experience_years': 2,
            },
        ]
    },
    {
        'company': {
            'email': 'education@example.com',
            'username': 'education',
            'first_name': 'EdTech',
            'last_name': 'Solutions',
            'phone': '0907234567',
            'role': User.Role.ADMIN,
        },
        'jobs': [
            {
                'title': 'Full Stack Developer',
                'department': 'Engineering',
                'description': '''EdTech Solutions tuyển dụng Full Stack Developer để phát triển nền tảng giáo dục trực tuyến.

Dự án:
- Phát triển LMS (Learning Management System)
- Tích hợp video streaming
- Xây dựng hệ thống đánh giá và quiz
- Phát triển mobile app''',
                'requirements': '''Yêu cầu:
- 3+ năm kinh nghiệm full stack
- Thành thạo React, Node.js
- Kinh nghiệm với MongoDB hoặc PostgreSQL
- Kinh nghiệm với video streaming
- Hiểu biết về e-learning platforms

Bonus:
- Kinh nghiệm với LMS
- Kinh nghiệm với educational technology''',
                'salary': '1600-2800 USD',
                'salary_min': 1600,
                'salary_max': 2800,
                'location': 'Hà Nội',
                'employment_type': Job.EmploymentType.FULLTIME,
                'positions_count': 2,
                'experience_years': 3,
            },
        ]
    },
    {
        'company': {
            'email': 'logistics@example.com',
            'username': 'logistics',
            'first_name': 'Logistics',
            'last_name': 'Pro',
            'phone': '0908234567',
            'role': User.Role.ADMIN,
        },
        'jobs': [
            {
                'title': 'Backend Developer (Java/Spring)',
                'department': 'Engineering',
                'description': '''Logistics Pro tuyển dụng Backend Developer để phát triển hệ thống quản lý logistics và vận chuyển.

Dự án:
- Xây dựng API cho hệ thống tracking
- Tích hợp với các dịch vụ vận chuyển
- Phát triển hệ thống quản lý kho
- Tối ưu hiệu suất và scalability''',
                'requirements': '''Yêu cầu:
- 4+ năm kinh nghiệm với Java
- Thành thạo Spring Boot, Spring Framework
- Kinh nghiệm với MySQL, PostgreSQL
- Kinh nghiệm với microservices
- Hiểu biết về logistics systems

Bonus:
- Kinh nghiệm với logistics software
- Kinh nghiệm với IoT integration''',
                'salary': '1800-3000 USD',
                'salary_min': 1800,
                'salary_max': 3000,
                'location': 'Hà Nội',
                'employment_type': Job.EmploymentType.FULLTIME,
                'positions_count': 2,
                'experience_years': 4,
            },
            {
                'title': 'QA Engineer',
                'department': 'Quality Assurance',
                'description': '''Tuyển dụng QA Engineer để đảm bảo chất lượng sản phẩm logistics software.''',
                'requirements': '''Yêu cầu:
- 2+ năm kinh nghiệm QA/Testing
- Kinh nghiệm với automated testing tools
- Hiểu biết về testing methodologies
- Kinh nghiệm với API testing
- Kinh nghiệm với bug tracking tools

Bonus:
- Kinh nghiệm với performance testing
- Kinh nghiệm với logistics systems''',
                'salary': '1000-1800 USD',
                'salary_min': 1000,
                'salary_max': 1800,
                'location': 'Hà Nội',
                'employment_type': Job.EmploymentType.FULLTIME,
                'positions_count': 1,
                'experience_years': 2,
            },
        ]
    },
]

# Tạo companies và jobs
created_companies = 0
created_jobs = 0

for company_data in companies_data:
    # Tạo hoặc lấy company user
    company_info = company_data['company']
    company, created = User.objects.get_or_create(
        email=company_info['email'],
        defaults={
            'username': company_info['username'],
            'first_name': company_info['first_name'],
            'last_name': company_info['last_name'],
            'phone': company_info['phone'],
            'role': company_info['role'],
        }
    )
    
    if created:
        company.set_password('Company@123')  # Password mặc định cho tất cả
        company.save()
        created_companies += 1
        print(f"✅ Created company: {company_info['first_name']} {company_info['last_name']}")
    else:
        print(f"⏭️  Company already exists: {company_info['first_name']} {company_info['last_name']}")
    
    # Tạo jobs cho company
    for job_data in company_data['jobs']:
        job, created = Job.objects.get_or_create(
            title=job_data['title'],
            created_by=company,
            defaults={
                **job_data,
                'status': Job.Status.OPEN,
                'deadline': timezone.now() + timedelta(days=30),
                'recruitment_process': default_process,
            }
        )
        
        if created:
            created_jobs += 1
            print(f"  ✅ Created job: {job_data['title']}")
        else:
            print(f"  ⏭️  Job already exists: {job_data['title']}")

print(f"\n🎉 Hoàn thành!")
print(f"📊 Đã tạo {created_companies} companies mới")
print(f"📊 Đã tạo {created_jobs} jobs mới")
print(f"📊 Tổng số companies: {User.objects.filter(role=User.Role.ADMIN).count()}")
print(f"📊 Tổng số jobs: {Job.objects.count()}")

print(f"\n📋 Danh sách companies và credentials:")
print("=" * 60)
for company_data in companies_data:
    company_info = company_data['company']
    print(f"\n🏢 {company_info['first_name']} {company_info['last_name']}")
    print(f"   Email: {company_info['email']}")
    print(f"   Password: Company@123")
    print(f"   Jobs: {len(company_data['jobs'])}")

