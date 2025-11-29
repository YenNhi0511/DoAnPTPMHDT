"""
Script để seed đầy đủ companies theo TẤT CẢ các ngành nghề
Chạy: python seed_companies_full.py
"""
import os
import django
from datetime import timedelta
from django.utils import timezone
from faker import Faker

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from accounts.models import User
from jobs.models import Job, RecruitmentProcess

fake = Faker('vi_VN')

# Lấy hoặc tạo default recruitment process
default_process, _ = RecruitmentProcess.objects.get_or_create(
    name='Quy trình tuyển dụng mặc định',
    defaults={
        'description': 'Quy trình tuyển dụng chuẩn cho các vị trí',
        'is_default': True,
        'created_by': User.objects.filter(role=User.Role.ADMIN).first() or User.objects.first()
    }
)

# Mapping ngành nghề với jobs
industry_jobs_mapping = {
    'Kinh doanh/Bán hàng': [
        {
            'title': 'Sales Manager - Xuất nhập khẩu',
            'department': 'Sales Xuất nhập khẩu/Logistics',
            'description': '''Công ty chúng tôi đang tìm kiếm Sales Manager có kinh nghiệm trong lĩnh vực xuất nhập khẩu và logistics.

Trách nhiệm:
- Phát triển và quản lý kênh bán hàng xuất nhập khẩu
- Tìm kiếm và phát triển khách hàng mới
- Đàm phán hợp đồng với đối tác quốc tế
- Quản lý quy trình logistics và vận chuyển
- Đạt chỉ tiêu doanh số được giao

Môi trường làm việc:
- Làm việc với đội ngũ chuyên nghiệp
- Cơ hội đi công tác nước ngoài
- Lương + hoa hồng hấp dẫn''',
            'requirements': '''Yêu cầu:
- Tối thiểu 3 năm kinh nghiệm sales xuất nhập khẩu
- Hiểu biết về thủ tục hải quan, logistics
- Kỹ năng đàm phán và giao tiếp tốt
- Tiếng Anh thành thạo (TOEIC 700+)
- Có network trong ngành logistics

Ưu tiên:
- Kinh nghiệm với thị trường Trung Quốc, Mỹ, EU
- Có bằng đại học chuyên ngành Kinh tế/Thương mại quốc tế''',
            'salary_min': 15,
            'salary_max': 25,
            'location': 'TP. Hồ Chí Minh',
            'employment_type': Job.EmploymentType.FULLTIME,
            'positions_count': 2,
            'experience_years': 3,
        },
        {
            'title': 'Sales Bất động sản',
            'department': 'Sales Bất động sản',
            'description': '''Tuyển dụng nhân viên kinh doanh bất động sản có kinh nghiệm.

Công việc:
- Tư vấn và bán các dự án bất động sản
- Tìm kiếm khách hàng tiềm năng
- Chăm sóc khách hàng sau bán hàng
- Tham gia các sự kiện marketing

Thu nhập:
- Lương cứng + hoa hồng không giới hạn
- Thưởng theo doanh số
- Cơ hội thăng tiến nhanh''',
            'requirements': '''Yêu cầu:
- 1+ năm kinh nghiệm sales bất động sản
- Kỹ năng giao tiếp và thuyết phục tốt
- Ngoại hình ưa nhìn, tự tin
- Có xe máy

Ưu tiên:
- Có giấy phép môi giới bất động sản
- Kinh nghiệm với dự án căn hộ, đất nền''',
            'salary_min': 8,
            'salary_max': 15,
            'location': 'Hà Nội',
            'employment_type': Job.EmploymentType.FULLTIME,
            'positions_count': 5,
            'experience_years': 1,
        },
    ],
    'Marketing/PR/Quảng cáo': [
        {
            'title': 'Digital Marketing Manager',
            'department': 'Digital Marketing',
            'description': '''Tuyển dụng Digital Marketing Manager để phát triển và thực thi chiến lược marketing online.

Trách nhiệm:
- Xây dựng và thực thi chiến lược digital marketing
- Quản lý các kênh marketing: SEO, SEM, Social Media, Email
- Phân tích và báo cáo hiệu quả campaigns
- Quản lý ngân sách marketing
- Làm việc với agencies và partners

Môi trường:
- Startup công nghệ năng động
- Cơ hội học hỏi và phát triển
- Lương cạnh tranh + thưởng theo KPI''',
            'requirements': '''Yêu cầu:
- 4+ năm kinh nghiệm digital marketing
- Thành thạo Google Ads, Facebook Ads
- Kinh nghiệm với Google Analytics, SEO tools
- Kỹ năng phân tích dữ liệu tốt
- Tiếng Anh tốt

Ưu tiên:
- Kinh nghiệm với e-commerce
- Certifications (Google Ads, Facebook Blueprint)
- Kinh nghiệm quản lý team''',
            'salary_min': 18,
            'salary_max': 30,
            'location': 'TP. Hồ Chí Minh',
            'employment_type': Job.EmploymentType.FULLTIME,
            'positions_count': 1,
            'experience_years': 4,
        },
        {
            'title': 'Content Marketing Specialist',
            'department': 'Content Marketing',
            'description': '''Tuyển dụng Content Marketing Specialist để tạo nội dung marketing chất lượng cao.

Công việc:
- Viết blog posts, articles, social media content
- Tạo content cho email marketing
- Phối hợp với design team để tạo visual content
- SEO content optimization
- Phân tích hiệu quả content

Thu nhập:
- Lương cạnh tranh
- Thưởng theo performance
- Cơ hội thăng tiến''',
            'requirements': '''Yêu cầu:
- 2+ năm kinh nghiệm content marketing
- Kỹ năng viết tốt, sáng tạo
- Hiểu biết về SEO
- Kinh nghiệm với CMS (WordPress, etc.)
- Tiếng Anh tốt

Ưu tiên:
- Portfolio ấn tượng
- Kinh nghiệm với video content
- Kinh nghiệm với graphic design tools''',
            'salary_min': 12,
            'salary_max': 20,
            'location': 'Hà Nội',
            'employment_type': Job.EmploymentType.FULLTIME,
            'positions_count': 2,
            'experience_years': 2,
        },
    ],
    'Chăm sóc khách hàng/Vận hành': [
        {
            'title': 'Customer Success Manager',
            'department': 'Customer Service',
            'description': '''Tuyển dụng Customer Success Manager để đảm bảo khách hàng hài lòng và thành công.

Trách nhiệm:
- Chăm sóc và hỗ trợ khách hàng
- Onboarding khách hàng mới
- Thu thập feedback và cải thiện dịch vụ
- Giảm tỷ lệ churn
- Upsell và cross-sell

Môi trường:
- SaaS company với khách hàng quốc tế
- Làm việc với team đa quốc gia
- Cơ hội phát triển sự nghiệp''',
            'requirements': '''Yêu cầu:
- 3+ năm kinh nghiệm customer success/support
- Kỹ năng giao tiếp xuất sắc
- Tiếng Anh thành thạo
- Kỹ năng giải quyết vấn đề tốt
- Hiểu biết về SaaS products

Ưu tiên:
- Kinh nghiệm với CRM tools (Salesforce, HubSpot)
- Technical background
- Kinh nghiệm quản lý team''',
            'salary_min': 15,
            'salary_max': 25,
            'location': 'TP. Hồ Chí Minh',
            'employment_type': Job.EmploymentType.FULLTIME,
            'positions_count': 2,
            'experience_years': 3,
        },
    ],
    'Nhân sự/Hành chính/Pháp chế': [
        {
            'title': 'HR Manager',
            'department': 'Nhân sự',
            'description': '''Tuyển dụng HR Manager để quản lý toàn bộ hoạt động nhân sự.

Trách nhiệm:
- Xây dựng và thực thi chiến lược nhân sự
- Quản lý tuyển dụng và onboarding
- Quản lý chính sách lương thưởng, phúc lợi
- Quản lý quan hệ lao động
- Phát triển và đào tạo nhân viên

Môi trường:
- Công ty công nghệ quy mô 100+ nhân viên
- Môi trường làm việc chuyên nghiệp
- Cơ hội thăng tiến''',
            'requirements': '''Yêu cầu:
- 5+ năm kinh nghiệm HR
- Hiểu biết về luật lao động Việt Nam
- Kỹ năng quản lý và leadership
- Kinh nghiệm với HRIS
- Tiếng Anh tốt

Ưu tiên:
- Có bằng đại học chuyên ngành Nhân sự/Quản trị kinh doanh
- Certifications (SHRM, PHR)
- Kinh nghiệm với công ty công nghệ''',
            'salary_min': 20,
            'salary_max': 35,
            'location': 'Hà Nội',
            'employment_type': Job.EmploymentType.FULLTIME,
            'positions_count': 1,
            'experience_years': 5,
        },
        {
            'title': 'Recruiter',
            'department': 'Nhân sự',
            'description': '''Tuyển dụng Recruiter để tìm kiếm và tuyển dụng nhân tài.

Công việc:
- Tìm kiếm ứng viên qua nhiều kênh
- Sàng lọc và phỏng vấn ứng viên
- Phối hợp với hiring managers
- Quản lý quy trình tuyển dụng
- Onboarding nhân viên mới

Thu nhập:
- Lương cạnh tranh
- Thưởng theo số lượng tuyển dụng thành công
- Cơ hội thăng tiến''',
            'requirements': '''Yêu cầu:
- 2+ năm kinh nghiệm recruitment
- Kỹ năng giao tiếp và đàm phán tốt
- Hiểu biết về thị trường lao động
- Kinh nghiệm với ATS
- Tiếng Anh tốt

Ưu tiên:
- Kinh nghiệm tuyển dụng IT/Engineering
- Network rộng trong ngành
- Certifications (CIR, AIRS)''',
            'salary_min': 12,
            'salary_max': 20,
            'location': 'TP. Hồ Chí Minh',
            'employment_type': Job.EmploymentType.FULLTIME,
            'positions_count': 3,
            'experience_years': 2,
        },
    ],
    'Công nghệ Thông tin': [
        {
            'title': 'Senior Full Stack Developer',
            'department': 'Lập trình viên',
            'description': '''Tuyển dụng Senior Full Stack Developer để phát triển sản phẩm công nghệ.

Công việc:
- Phát triển ứng dụng web full stack
- Thiết kế và implement APIs
- Tối ưu hiệu suất và scalability
- Code review và mentoring junior developers
- Làm việc với team Agile/Scrum

Môi trường:
- Công ty công nghệ hàng đầu
- Tech stack hiện đại
- Cơ hội học hỏi và phát triển''',
            'requirements': '''Yêu cầu:
- 5+ năm kinh nghiệm full stack development
- Thành thạo JavaScript/TypeScript, React, Node.js
- Kinh nghiệm với Python/Django hoặc Java/Spring Boot
- Hiểu biết về database (PostgreSQL, MongoDB)
- Kinh nghiệm với Docker, Kubernetes

Ưu tiên:
- Kinh nghiệm với microservices
- Kinh nghiệm với AWS/GCP
- Có portfolio/GitHub ấn tượng''',
            'salary_min': 25,
            'salary_max': 40,
            'location': 'Hà Nội',
            'employment_type': Job.EmploymentType.FULLTIME,
            'positions_count': 2,
            'experience_years': 5,
        },
        {
            'title': 'DevOps Engineer',
            'department': 'DevOps/System Admin',
            'description': '''Tuyển dụng DevOps Engineer để quản lý infrastructure và CI/CD.

Công việc:
- Quản lý cloud infrastructure (AWS/GCP)
- Xây dựng và maintain CI/CD pipelines
- Monitoring và troubleshooting
- Automation và optimization
- Security và compliance

Môi trường:
- Startup công nghệ năng động
- Tech stack hiện đại
- Cơ hội học hỏi và phát triển''',
            'requirements': '''Yêu cầu:
- 3+ năm kinh nghiệm DevOps
- Thành thạo AWS hoặc GCP
- Kinh nghiệm với Kubernetes, Docker
- Kinh nghiệm với Terraform, Ansible
- Kinh nghiệm với CI/CD tools

Ưu tiên:
- Certifications (AWS, GCP, Kubernetes)
- Kinh nghiệm với monitoring tools
- Scripting skills (Python, Bash)''',
            'salary_min': 20,
            'salary_max': 35,
            'location': 'TP. Hồ Chí Minh',
            'employment_type': Job.EmploymentType.FULLTIME,
            'positions_count': 1,
            'experience_years': 3,
        },
        {
            'title': 'Data Engineer',
            'department': 'Data/AI',
            'description': '''Tuyển dụng Data Engineer để xây dựng data pipelines.

Công việc:
- Xây dựng và maintain data pipelines
- ETL processes
- Data warehouse design
- Phối hợp với data scientists
- Data quality và monitoring

Môi trường:
- Fintech company
- Làm việc với big data
- Cơ hội phát triển sự nghiệp''',
            'requirements': '''Yêu cầu:
- 3+ năm kinh nghiệm data engineering
- Thành thạo Python, SQL
- Kinh nghiệm với Apache Airflow, dbt
- Kinh nghiệm với data warehouses
- Kinh nghiệm với Spark, Pandas

Ưu tiên:
- Kinh nghiệm với financial data
- Kinh nghiệm với real-time streaming
- Certifications (AWS Data Analytics)''',
            'salary_min': 17,
            'salary_max': 28,
            'location': 'TP. Hồ Chí Minh',
            'employment_type': Job.EmploymentType.FULLTIME,
            'positions_count': 1,
            'experience_years': 3,
        },
    ],
    'Kế toán/Tài chính': [
        {
            'title': 'Kế toán tổng hợp',
            'department': 'Kế toán',
            'description': '''Tuyển dụng Kế toán tổng hợp có kinh nghiệm.

Công việc:
- Ghi sổ kế toán, lập báo cáo tài chính
- Quản lý công nợ, thanh toán
- Làm việc với cơ quan thuế
- Phối hợp với các bộ phận khác
- Kiểm tra và đối chiếu số liệu

Môi trường:
- Công ty sản xuất quy mô lớn
- Môi trường làm việc ổn định
- Lương cạnh tranh + thưởng''',
            'requirements': '''Yêu cầu:
- 3+ năm kinh nghiệm kế toán tổng hợp
- Hiểu biết về luật thuế, kế toán
- Thành thạo Excel, phần mềm kế toán
- Cẩn thận, tỉ mỉ, trung thực
- Có bằng đại học chuyên ngành Kế toán

Ưu tiên:
- Có chứng chỉ kế toán viên
- Kinh nghiệm với ERP systems
- Tiếng Anh tốt''',
            'salary_min': 12,
            'salary_max': 20,
            'location': 'Hà Nội',
            'employment_type': Job.EmploymentType.FULLTIME,
            'positions_count': 2,
            'experience_years': 3,
        },
        {
            'title': 'Financial Analyst',
            'department': 'Tài chính',
            'description': '''Tuyển dụng Financial Analyst để phân tích tài chính và hỗ trợ ra quyết định.

Công việc:
- Phân tích báo cáo tài chính
- Lập ngân sách và forecast
- Phân tích hiệu quả đầu tư
- Báo cáo cho management
- Phối hợp với các bộ phận

Môi trường:
- Công ty đa quốc gia
- Làm việc với team quốc tế
- Cơ hội thăng tiến''',
            'requirements': '''Yêu cầu:
- 3+ năm kinh nghiệm financial analysis
- Thành thạo Excel, financial modeling
- Hiểu biết về accounting principles
- Kỹ năng phân tích tốt
- Tiếng Anh thành thạo

Ưu tiên:
- Có bằng đại học chuyên ngành Tài chính/Kế toán
- Certifications (CFA, CPA)
- Kinh nghiệm với BI tools''',
            'salary_min': 15,
            'salary_max': 25,
            'location': 'TP. Hồ Chí Minh',
            'employment_type': Job.EmploymentType.FULLTIME,
            'positions_count': 1,
            'experience_years': 3,
        },
    ],
    'Sản xuất/Vận hành': [
        {
            'title': 'Production Manager',
            'department': 'Sản xuất',
            'description': '''Tuyển dụng Production Manager để quản lý sản xuất.

Trách nhiệm:
- Quản lý quy trình sản xuất
- Đảm bảo chất lượng sản phẩm
- Tối ưu hiệu suất sản xuất
- Quản lý nhân viên sản xuất
- Tuân thủ an toàn lao động

Môi trường:
- Nhà máy sản xuất quy mô lớn
- Làm việc với đội ngũ chuyên nghiệp
- Cơ hội thăng tiến''',
            'requirements': '''Yêu cầu:
- 5+ năm kinh nghiệm quản lý sản xuất
- Hiểu biết về quy trình sản xuất
- Kỹ năng quản lý và leadership
- Kinh nghiệm với lean manufacturing
- Tiếng Anh tốt

Ưu tiên:
- Có bằng đại học chuyên ngành Kỹ thuật
- Certifications (Six Sigma, Lean)
- Kinh nghiệm với ERP/MES systems''',
            'salary_min': 20,
            'salary_max': 35,
            'location': 'Bình Dương',
            'employment_type': Job.EmploymentType.FULLTIME,
            'positions_count': 1,
            'experience_years': 5,
        },
    ],
    'Lao động phổ thông': [
        {
            'title': 'Bảo vệ',
            'department': 'Bảo vệ',
            'description': '''Tuyển dụng nhân viên bảo vệ.

Công việc:
- Bảo vệ tài sản và an ninh
- Kiểm soát ra vào
- Tuần tra và giám sát
- Xử lý sự cố an ninh
- Báo cáo định kỳ

Môi trường:
- Làm việc tại tòa nhà văn phòng
- Ca làm việc linh hoạt
- Lương ổn định''',
            'requirements': '''Yêu cầu:
- Sức khỏe tốt, không mắc bệnh mãn tính
- Trung thực, có trách nhiệm
- Có thể làm ca đêm
- Tuổi từ 18-45

Ưu tiên:
- Có kinh nghiệm bảo vệ
- Có giấy phép bảo vệ
- Có bằng tốt nghiệp THPT''',
            'salary_min': 6,
            'salary_max': 9,
            'location': 'Hà Nội',
            'employment_type': Job.EmploymentType.FULLTIME,
            'positions_count': 3,
            'experience_years': 0,
        },
    ],
}

# Tạo companies theo từng ngành nghề
created_companies = 0
created_jobs = 0

for industry, jobs_list in industry_jobs_mapping.items():
    # Tạo 2-3 companies cho mỗi ngành nghề
    for i in range(2):
        company_name = fake.company()
        email = f"{company_name.lower().replace(' ', '').replace('.', '').replace(',', '')}@example.com"
        username = email.split('@')[0][:20]  # Limit username length
        
        # Tạo company user với đầy đủ thông tin
        province = fake.random_element(elements=('Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng'))
        districts_map = {
            'Hà Nội': ['Cầu Giấy', 'Đống Đa', 'Hoàn Kiếm', 'Hai Bà Trưng', 'Thanh Xuân'],
            'TP. Hồ Chí Minh': ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 7', 'Bình Thạnh'],
            'Đà Nẵng': ['Hải Châu', 'Thanh Khê', 'Sơn Trà']
        }
        district = fake.random_element(elements=districts_map.get(province, ['Quận 1']))
        
        company, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': username,
                'first_name': company_name.split()[0] if company_name.split() else 'Company',
                'last_name': ' '.join(company_name.split()[1:]) if len(company_name.split()) > 1 else 'Ltd',
                'phone': fake.phone_number(),
                'role': User.Role.ADMIN,
                'company_name': company_name,
                'gender': fake.random_element(elements=('MALE', 'FEMALE')),
                'work_location_province': province,
                'work_location_district': district,
                # Thông tin công ty đầy đủ
                'tax_id': fake.numerify(text='##########'),
                'website': f"https://www.{username}.com",
                'field_of_activity': industry,
                'scale': fake.random_element(elements=('10 - 50 nhân viên', '50 - 200 nhân viên', '200 - 500 nhân viên')),
                'address': fake.address(),
                'company_email': email,
                'company_description': f"{company_name} là công ty hoạt động trong lĩnh vực {industry}. Chúng tôi cam kết mang đến những giá trị tốt nhất cho khách hàng và nhân viên.",
            }
        )
        
        if created:
            company.set_password('Company@123')
            company.save()
            created_companies += 1
            print(f"✅ Created company: {company_name}")
        else:
            print(f"⏭️  Company already exists: {company_name}")
        
        # Tạo jobs cho company
        for job_data in jobs_list[:2]:  # Mỗi company có 1-2 jobs
            job, created = Job.objects.get_or_create(
                title=job_data['title'],
                created_by=company,
                defaults={
                    **job_data,
                    'salary': f"{job_data['salary_min']} - {job_data['salary_max']} triệu",
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
for company in User.objects.filter(role=User.Role.ADMIN).order_by('date_joined')[:20]:
    print(f"\n🏢 {company.company_name or company.get_full_name()}")
    print(f"   Email: {company.email}")
    print(f"   Password: Company@123")
    print(f"   Jobs: {Job.objects.filter(created_by=company).count()}")

