import os
import django
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from accounts.models import User
from jobs.models import Job
from applications.models import Application, Interview

# Danh sách 10 công ty với thông tin
COMPANIES = [
    {
        'email': 'mymymon109.dev+tech@gmail.com',
        'password': 'tech123',
        'field': 'Công nghệ thông tin',
        'company_name': 'Tech Solutions Vietnam',
        'categories': ['Lập trình viên', 'Kỹ sư phần mềm', 'DevOps Engineer'],
        'jobs': [
            {'title': 'Senior Full Stack Developer', 'category': 'Lập trình viên', 'salary_min': 20000000, 'salary_max': 35000000},
            {'title': 'Backend Developer (Node.js)', 'category': 'Lập trình viên', 'salary_min': 15000000, 'salary_max': 25000000},
            {'title': 'Frontend Developer (React)', 'category': 'Lập trình viên', 'salary_min': 15000000, 'salary_max': 25000000},
            {'title': 'Software Engineer', 'category': 'Kỹ sư phần mềm', 'salary_min': 18000000, 'salary_max': 30000000},
            {'title': 'DevOps Engineer', 'category': 'DevOps Engineer', 'salary_min': 20000000, 'salary_max': 35000000},
        ]
    },
    {
        'email': 'mymymon109.dev+finance@gmail.com',
        'password': 'finance123',
        'field': 'Tài chính - Ngân hàng',
        'company_name': 'Finance Group Asia',
        'categories': ['Kế toán', 'Phân tích tài chính', 'Tư vấn tài chính'],
        'jobs': [
            {'title': 'Kế toán trưởng', 'category': 'Kế toán', 'salary_min': 15000000, 'salary_max': 25000000},
            {'title': 'Chuyên viên phân tích tài chính', 'category': 'Phân tích tài chính', 'salary_min': 12000000, 'salary_max': 20000000},
            {'title': 'Kế toán viên', 'category': 'Kế toán', 'salary_min': 8000000, 'salary_max': 15000000},
            {'title': 'Tư vấn tài chính cá nhân', 'category': 'Tư vấn tài chính', 'salary_min': 10000000, 'salary_max': 18000000},
        ]
    },
    {
        'email': 'mymymon109.dev+education@gmail.com',
        'password': 'education123',
        'field': 'Giáo dục - Đào tạo',
        'company_name': 'EduTech Vietnam',
        'categories': ['Giáo viên', 'Quản lý đào tạo', 'Thiết kế chương trình'],
        'jobs': [
            {'title': 'Giáo viên Tiếng Anh', 'category': 'Giáo viên', 'salary_min': 10000000, 'salary_max': 18000000},
            {'title': 'Quản lý đào tạo', 'category': 'Quản lý đào tạo', 'salary_min': 12000000, 'salary_max': 20000000},
            {'title': 'Giáo viên Toán', 'category': 'Giáo viên', 'salary_min': 10000000, 'salary_max': 18000000},
            {'title': 'Thiết kế chương trình học', 'category': 'Thiết kế chương trình', 'salary_min': 15000000, 'salary_max': 25000000},
        ]
    },
    {
        'email': 'mymymon109.dev+healthcare@gmail.com',
        'password': 'healthcare123',
        'field': 'Y tế - Chăm sóc sức khỏe',
        'company_name': 'HealthCare Vietnam',
        'categories': ['Bác sĩ', 'Y tá', 'Quản lý y tế'],
        'jobs': [
            {'title': 'Bác sĩ đa khoa', 'category': 'Bác sĩ', 'salary_min': 20000000, 'salary_max': 40000000},
            {'title': 'Y tá điều dưỡng', 'category': 'Y tá', 'salary_min': 8000000, 'salary_max': 15000000},
            {'title': 'Quản lý phòng khám', 'category': 'Quản lý y tế', 'salary_min': 15000000, 'salary_max': 25000000},
            {'title': 'Bác sĩ chuyên khoa', 'category': 'Bác sĩ', 'salary_min': 25000000, 'salary_max': 50000000},
        ]
    },
    {
        'email': 'mymymon109.dev+logistics@gmail.com',
        'password': 'logistics123',
        'field': 'Vận tải - Logistics',
        'company_name': 'Logistics Express',
        'categories': ['Quản lý kho', 'Nhân viên vận chuyển', 'Điều phối logistics'],
        'jobs': [
            {'title': 'Quản lý kho hàng', 'category': 'Quản lý kho', 'salary_min': 10000000, 'salary_max': 18000000},
            {'title': 'Nhân viên vận chuyển', 'category': 'Nhân viên vận chuyển', 'salary_min': 7000000, 'salary_max': 12000000},
            {'title': 'Điều phối viên logistics', 'category': 'Điều phối logistics', 'salary_min': 12000000, 'salary_max': 20000000},
            {'title': 'Quản lý chuỗi cung ứng', 'category': 'Điều phối logistics', 'salary_min': 15000000, 'salary_max': 25000000},
        ]
    },
    {
        'email': 'mymymon109.dev+marketing@gmail.com',
        'password': 'marketing123',
        'field': 'Marketing - Truyền thông',
        'company_name': 'Marketing Pro Agency',
        'categories': ['Digital Marketing', 'Content Creator', 'Quan hệ công chúng'],
        'jobs': [
            {'title': 'Digital Marketing Manager', 'category': 'Digital Marketing', 'salary_min': 15000000, 'salary_max': 25000000},
            {'title': 'Content Creator', 'category': 'Content Creator', 'salary_min': 10000000, 'salary_max': 18000000},
            {'title': 'SEO Specialist', 'category': 'Digital Marketing', 'salary_min': 12000000, 'salary_max': 20000000},
            {'title': 'PR Manager', 'category': 'Quan hệ công chúng', 'salary_min': 15000000, 'salary_max': 25000000},
        ]
    },
    {
        'email': 'mymymon109.dev+construction@gmail.com',
        'password': 'construction123',
        'field': 'Xây dựng - Bất động sản',
        'company_name': 'Construction Builders',
        'categories': ['Kỹ sư xây dựng', 'Giám sát công trình', 'Kiến trúc sư'],
        'jobs': [
            {'title': 'Kỹ sư xây dựng dân dụng', 'category': 'Kỹ sư xây dựng', 'salary_min': 15000000, 'salary_max': 25000000},
            {'title': 'Giám sát công trình', 'category': 'Giám sát công trình', 'salary_min': 12000000, 'salary_max': 20000000},
            {'title': 'Kiến trúc sư', 'category': 'Kiến trúc sư', 'salary_min': 15000000, 'salary_max': 28000000},
            {'title': 'Kỹ sư kết cấu', 'category': 'Kỹ sư xây dựng', 'salary_min': 18000000, 'salary_max': 30000000},
        ]
    },
    {
        'email': 'mymymon109.dev+electronics@gmail.com',
        'password': 'electronics123',
        'field': 'Điện tử - Điện lạnh',
        'company_name': 'Electronics Tech',
        'categories': ['Kỹ sư điện tử', 'Kỹ thuật viên', 'Thiết kế mạch'],
        'jobs': [
            {'title': 'Kỹ sư điện tử', 'category': 'Kỹ sư điện tử', 'salary_min': 15000000, 'salary_max': 25000000},
            {'title': 'Kỹ thuật viên sửa chữa', 'category': 'Kỹ thuật viên', 'salary_min': 8000000, 'salary_max': 15000000},
            {'title': 'Thiết kế mạch điện tử', 'category': 'Thiết kế mạch', 'salary_min': 18000000, 'salary_max': 30000000},
            {'title': 'Kỹ sư tự động hóa', 'category': 'Kỹ sư điện tử', 'salary_min': 20000000, 'salary_max': 35000000},
        ]
    },
    {
        'email': 'mymymon109.dev+hospitality@gmail.com',
        'password': 'hospitality123',
        'field': 'Khách sạn - Nhà hàng',
        'company_name': 'Hospitality Group',
        'categories': ['Quản lý khách sạn', 'Nhân viên phục vụ', 'Đầu bếp'],
        'jobs': [
            {'title': 'Quản lý khách sạn', 'category': 'Quản lý khách sạn', 'salary_min': 15000000, 'salary_max': 25000000},
            {'title': 'Nhân viên phục vụ nhà hàng', 'category': 'Nhân viên phục vụ', 'salary_min': 6000000, 'salary_max': 10000000},
            {'title': 'Đầu bếp chính', 'category': 'Đầu bếp', 'salary_min': 12000000, 'salary_max': 20000000},
            {'title': 'Lễ tân khách sạn', 'category': 'Nhân viên phục vụ', 'salary_min': 7000000, 'salary_max': 12000000},
        ]
    },
    {
        'email': 'mymymon109.dev+fmcg@gmail.com',
        'password': 'fmcg123',
        'field': 'FMCG - Hàng tiêu dùng',
        'company_name': 'FMCG Distribution',
        'categories': ['Quản lý bán hàng', 'Nhân viên kinh doanh', 'Quản lý thương hiệu'],
        'jobs': [
            {'title': 'Quản lý bán hàng khu vực', 'category': 'Quản lý bán hàng', 'salary_min': 15000000, 'salary_max': 25000000},
            {'title': 'Nhân viên kinh doanh', 'category': 'Nhân viên kinh doanh', 'salary_min': 8000000, 'salary_max': 15000000},
            {'title': 'Brand Manager', 'category': 'Quản lý thương hiệu', 'salary_min': 18000000, 'salary_max': 30000000},
            {'title': 'Trưởng phòng kinh doanh', 'category': 'Quản lý bán hàng', 'salary_min': 20000000, 'salary_max': 35000000},
        ]
    },
]

def reset_data():
    """Xóa tất cả dữ liệu hiện có"""
    print("Đang xóa dữ liệu cũ...")
    
    # Xóa interviews
    Interview.objects.all().delete()
    print("✓ Đã xóa tất cả interviews")
    
    # Xóa applications
    Application.objects.all().delete()
    print("✓ Đã xóa tất cả applications")
    
    # Xóa jobs
    Job.objects.all().delete()
    print("✓ Đã xóa tất cả jobs")
    
    # Xóa users (trừ admin)
    User.objects.filter(role=User.Role.RECRUITER).delete()
    print("✓ Đã xóa tất cả recruiter users")
    
    print("Hoàn tất xóa dữ liệu!\n")

def create_companies_and_jobs():
    """Tạo lại 10 công ty và jobs"""
    print("Đang tạo dữ liệu mới...\n")
    
    for idx, company_data in enumerate(COMPANIES, 1):
        # Tạo user cho công ty
        email = company_data['email']
        username = email.split('@')[0].replace('+', '_')
        
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': username,
                'first_name': company_data['company_name'].split()[0],
                'last_name': ' '.join(company_data['company_name'].split()[1:]) if len(company_data['company_name'].split()) > 1 else '',
                'role': User.Role.RECRUITER,
                'company_name': company_data['company_name'],
                'field_of_activity': company_data['field'],
                'company_email': email,
                'is_email_verified': True,  # Tự động verify để test
            }
        )
        
        if created:
            user.set_password(company_data['password'])
            user.save()
            print(f"{idx}. ✓ Đã tạo công ty: {company_data['company_name']} ({email})")
        else:
            user.set_password(company_data['password'])
            user.company_name = company_data['company_name']
            user.field_of_activity = company_data['field']
            user.company_email = email
            user.is_email_verified = True
            user.save()
            print(f"{idx}. ✓ Đã cập nhật công ty: {company_data['company_name']} ({email})")
        
        # Tạo jobs cho công ty
        job_descriptions = {
            'Lập trình viên': 'Chúng tôi đang tìm kiếm lập trình viên có kinh nghiệm phát triển ứng dụng web và mobile. Yêu cầu thành thạo các ngôn ngữ lập trình hiện đại.',
            'Kỹ sư phần mềm': 'Tuyển dụng kỹ sư phần mềm có khả năng thiết kế và phát triển hệ thống phần mềm quy mô lớn.',
            'DevOps Engineer': 'Tìm kiếm DevOps Engineer có kinh nghiệm triển khai và quản lý hệ thống cloud, CI/CD.',
            'Kế toán': 'Tuyển dụng kế toán viên có kinh nghiệm xử lý sổ sách, báo cáo tài chính và quản lý ngân sách.',
            'Phân tích tài chính': 'Tìm kiếm chuyên viên phân tích tài chính có khả năng đánh giá và tư vấn các quyết định đầu tư.',
            'Tư vấn tài chính': 'Tuyển dụng tư vấn viên tài chính có kinh nghiệm tư vấn cho khách hàng cá nhân và doanh nghiệp.',
            'Giáo viên': 'Tuyển dụng giáo viên có trình độ chuyên môn cao, nhiệt huyết với nghề giáo dục.',
            'Quản lý đào tạo': 'Tìm kiếm quản lý đào tạo có khả năng xây dựng và quản lý chương trình đào tạo hiệu quả.',
            'Thiết kế chương trình': 'Tuyển dụng chuyên viên thiết kế chương trình học có kinh nghiệm phát triển giáo trình.',
            'Bác sĩ': 'Tuyển dụng bác sĩ có trình độ chuyên môn cao, tận tâm với bệnh nhân.',
            'Y tá': 'Tìm kiếm y tá điều dưỡng có kinh nghiệm chăm sóc bệnh nhân.',
            'Quản lý y tế': 'Tuyển dụng quản lý y tế có khả năng quản lý và điều hành cơ sở y tế.',
            'Quản lý kho': 'Tìm kiếm quản lý kho có kinh nghiệm quản lý hàng hóa và logistics.',
            'Nhân viên vận chuyển': 'Tuyển dụng nhân viên vận chuyển có bằng lái xe và kinh nghiệm giao hàng.',
            'Điều phối logistics': 'Tìm kiếm điều phối viên logistics có khả năng quản lý chuỗi cung ứng.',
            'Digital Marketing': 'Tuyển dụng chuyên viên digital marketing có kinh nghiệm SEO, SEM, social media marketing.',
            'Content Creator': 'Tìm kiếm content creator có khả năng sáng tạo nội dung hấp dẫn cho các nền tảng digital.',
            'Quan hệ công chúng': 'Tuyển dụng PR manager có kinh nghiệm xây dựng hình ảnh thương hiệu.',
            'Kỹ sư xây dựng': 'Tìm kiếm kỹ sư xây dựng có kinh nghiệm thiết kế và giám sát công trình.',
            'Giám sát công trình': 'Tuyển dụng giám sát công trình có khả năng quản lý và kiểm soát chất lượng.',
            'Kiến trúc sư': 'Tìm kiếm kiến trúc sư có khả năng thiết kế và tư vấn kiến trúc.',
            'Kỹ sư điện tử': 'Tuyển dụng kỹ sư điện tử có kinh nghiệm thiết kế và phát triển sản phẩm điện tử.',
            'Kỹ thuật viên': 'Tìm kiếm kỹ thuật viên có khả năng sửa chữa và bảo trì thiết bị.',
            'Thiết kế mạch': 'Tuyển dụng kỹ sư thiết kế mạch điện tử có kinh nghiệm với PCB design.',
            'Quản lý khách sạn': 'Tìm kiếm quản lý khách sạn có kinh nghiệm điều hành và quản lý dịch vụ khách sạn.',
            'Nhân viên phục vụ': 'Tuyển dụng nhân viên phục vụ có thái độ phục vụ tốt, nhiệt tình.',
            'Đầu bếp': 'Tìm kiếm đầu bếp có tay nghề cao, sáng tạo trong ẩm thực.',
            'Quản lý bán hàng': 'Tuyển dụng quản lý bán hàng có kinh nghiệm phát triển thị trường và quản lý đội ngũ.',
            'Nhân viên kinh doanh': 'Tìm kiếm nhân viên kinh doanh có khả năng giao tiếp và thuyết phục khách hàng.',
            'Quản lý thương hiệu': 'Tuyển dụng brand manager có kinh nghiệm xây dựng và phát triển thương hiệu.',
        }
        
        job_requirements = {
            'Lập trình viên': '- Kinh nghiệm 2+ năm với JavaScript/TypeScript\n- Thành thạo React, Node.js\n- Hiểu biết về database (PostgreSQL, MongoDB)\n- Có portfolio hoặc GitHub',
            'Kỹ sư phần mềm': '- Kinh nghiệm 3+ năm phát triển phần mềm\n- Thành thạo ít nhất 2 ngôn ngữ lập trình\n- Kinh nghiệm với hệ thống phân tán\n- Kỹ năng giải quyết vấn đề tốt',
            'DevOps Engineer': '- Kinh nghiệm với Docker, Kubernetes\n- Thành thạo AWS/Azure/GCP\n- Kinh nghiệm CI/CD (Jenkins, GitLab CI)\n- Scripting (Bash, Python)',
            'Kế toán': '- Bằng đại học chuyên ngành kế toán\n- Kinh nghiệm 2+ năm\n- Thành thạo Excel và phần mềm kế toán\n- Có chứng chỉ kế toán viên',
            'Phân tích tài chính': '- Bằng đại học tài chính/kinh tế\n- Kinh nghiệm phân tích tài chính\n- Thành thạo Excel, Power BI\n- Tư duy phân tích tốt',
            'Tư vấn tài chính': '- Chứng chỉ tư vấn tài chính\n- Kinh nghiệm tư vấn khách hàng\n- Kỹ năng giao tiếp tốt\n- Hiểu biết về các sản phẩm tài chính',
            'Giáo viên': '- Bằng đại học sư phạm\n- Kinh nghiệm giảng dạy\n- Nhiệt huyết với nghề giáo\n- Kỹ năng truyền đạt tốt',
            'Quản lý đào tạo': '- Kinh nghiệm quản lý đào tạo\n- Kỹ năng lãnh đạo\n- Khả năng xây dựng chương trình\n- Giao tiếp tốt',
            'Thiết kế chương trình': '- Kinh nghiệm thiết kế giáo trình\n- Hiểu biết về phương pháp giảng dạy\n- Kỹ năng viết và biên soạn\n- Sáng tạo',
            'Bác sĩ': '- Bằng bác sĩ đa khoa/chuyên khoa\n- Giấy phép hành nghề\n- Kinh nghiệm lâm sàng\n- Đạo đức nghề nghiệp tốt',
            'Y tá': '- Bằng điều dưỡng\n- Kinh nghiệm chăm sóc bệnh nhân\n- Tận tâm, cẩn thận\n- Kỹ năng giao tiếp tốt',
            'Quản lý y tế': '- Kinh nghiệm quản lý cơ sở y tế\n- Kỹ năng lãnh đạo\n- Hiểu biết về quy định y tế\n- Quản lý nhân sự',
            'Quản lý kho': '- Kinh nghiệm quản lý kho hàng\n- Hiểu biết về logistics\n- Kỹ năng quản lý\n- Cẩn thận, tỉ mỉ',
            'Nhân viên vận chuyển': '- Bằng lái xe B2 trở lên\n- Kinh nghiệm giao hàng\n- Sức khỏe tốt\n- Trung thực, trách nhiệm',
            'Điều phối logistics': '- Kinh nghiệm logistics\n- Kỹ năng quản lý chuỗi cung ứng\n- Giao tiếp tốt\n- Giải quyết vấn đề',
            'Digital Marketing': '- Kinh nghiệm digital marketing 2+ năm\n- Thành thạo SEO, SEM, social media\n- Analytics và reporting\n- Sáng tạo trong chiến dịch',
            'Content Creator': '- Kinh nghiệm sáng tạo nội dung\n- Kỹ năng viết và chỉnh sửa\n- Hiểu biết về các nền tảng social\n- Portfolio sáng tạo',
            'Quan hệ công chúng': '- Kinh nghiệm PR 3+ năm\n- Kỹ năng giao tiếp xuất sắc\n- Mạng lưới quan hệ rộng\n- Xử lý khủng hoảng',
            'Kỹ sư xây dựng': '- Bằng kỹ sư xây dựng\n- Kinh nghiệm thiết kế/giám sát\n- Thành thạo AutoCAD\n- Hiểu biết quy chuẩn xây dựng',
            'Giám sát công trình': '- Kinh nghiệm giám sát công trình\n- Hiểu biết về quy trình xây dựng\n- Kỹ năng quản lý\n- Cẩn thận, trách nhiệm',
            'Kiến trúc sư': '- Bằng kiến trúc sư\n- Kinh nghiệm thiết kế\n- Thành thạo phần mềm thiết kế\n- Sáng tạo, thẩm mỹ tốt',
            'Kỹ sư điện tử': '- Bằng kỹ sư điện tử\n- Kinh nghiệm thiết kế mạch\n- Thành thạo phần mềm thiết kế\n- Hiểu biết về linh kiện',
            'Kỹ thuật viên': '- Kinh nghiệm sửa chữa thiết bị\n- Kỹ năng kỹ thuật tốt\n- Cẩn thận, tỉ mỉ\n- Học hỏi nhanh',
            'Thiết kế mạch': '- Kinh nghiệm thiết kế PCB\n- Thành thạo Altium/KiCad\n- Hiểu biết về EMC/EMI\n- Kỹ năng debug',
            'Quản lý khách sạn': '- Kinh nghiệm quản lý khách sạn\n- Kỹ năng lãnh đạo\n- Giao tiếp tốt\n- Hiểu biết về dịch vụ',
            'Nhân viên phục vụ': '- Thái độ phục vụ tốt\n- Ngoại hình ưa nhìn\n- Giao tiếp tốt\n- Chịu được áp lực',
            'Đầu bếp': '- Kinh nghiệm nấu ăn\n- Tay nghề cao\n- Sáng tạo trong ẩm thực\n- Vệ sinh an toàn thực phẩm',
            'Quản lý bán hàng': '- Kinh nghiệm bán hàng 3+ năm\n- Kỹ năng lãnh đạo\n- Phát triển thị trường\n- Quản lý đội ngũ',
            'Nhân viên kinh doanh': '- Kỹ năng giao tiếp tốt\n- Thuyết phục khách hàng\n- Chịu được áp lực\n- Mục tiêu bán hàng',
            'Quản lý thương hiệu': '- Kinh nghiệm brand management\n- Hiểu biết về marketing\n- Chiến lược thương hiệu\n- Phân tích thị trường',
        }
        
        for job_data in company_data['jobs']:
            category = job_data['category']
            description = job_descriptions.get(category, f'Mô tả công việc cho vị trí {job_data["title"]}')
            requirements = job_requirements.get(category, f'Yêu cầu cho vị trí {job_data["title"]}')
            
            job = Job.objects.create(
                title=job_data['title'],
                department=category,
                description=description,
                requirements=requirements,
                salary_min=job_data['salary_min'],
                salary_max=job_data['salary_max'],
                salary=f"{job_data['salary_min']//1000000}-{job_data['salary_max']//1000000} triệu",
                location='Hồ Chí Minh',
                employment_type=Job.EmploymentType.FULLTIME,
                status=Job.Status.OPEN,
                experience_years=2 if 'Senior' in job_data['title'] or 'Trưởng' in job_data['title'] or 'Manager' in job_data['title'] else 1,
                deadline=timezone.now() + timedelta(days=30),
                created_by=user
            )
        
        print(f"   ✓ Đã tạo {len(company_data['jobs'])} việc làm cho {company_data['company_name']}\n")
    
    print(f"\n✓ Hoàn tất! Đã tạo {len(COMPANIES)} công ty và tổng cộng {sum(len(c['jobs']) for c in COMPANIES)} việc làm")

if __name__ == '__main__':
    print("=" * 60)
    print("RESET VÀ TẠO LẠI DỮ LIỆU")
    print("=" * 60)
    print()
    
    reset_data()
    create_companies_and_jobs()
    
    print("\n" + "=" * 60)
    print("HOÀN TẤT!")
    print("=" * 60)

