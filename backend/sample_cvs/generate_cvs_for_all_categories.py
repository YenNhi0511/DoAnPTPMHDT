"""
Script để tạo CV mẫu cho TẤT CẢ các ngành nghề trong hệ thống
Dựa trên job-categories.js từ frontend
Cần cài: pip install reportlab faker
Chạy: python generate_cvs_for_all_categories.py
"""
import os
import re
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from faker import Faker

fake = Faker('vi_VN')

def sanitize_filename(filename):
    """Loại bỏ các ký tự không hợp lệ trong tên file"""
    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    filename = re.sub(r'\s+', '_', filename)
    filename = re.sub(r'_+', '_', filename)
    return filename.strip('_')

def create_cv(filename, name, email, phone, experience_years, skills, job_title, job_group, profession):
    """Tạo một CV mẫu với thông tin chi tiết theo ngành nghề"""
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    doc = SimpleDocTemplate(filename, pagesize=A4)
    story = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=12,
        spaceBefore=12
    )
    
    # Header
    story.append(Paragraph(name, title_style))
    story.append(Paragraph(f"{email} | {phone}", styles['Normal']))
    story.append(Paragraph(f"Vị trí ứng tuyển: {job_title}", styles['Normal']))
    story.append(Spacer(1, 0.3*inch))
    
    # Objective
    story.append(Paragraph("Mục tiêu nghề nghiệp", heading_style))
    objective_text = get_objective_text(job_title, job_group, profession, experience_years)
    story.append(Paragraph(objective_text, styles['Normal']))
    story.append(Spacer(1, 0.2*inch))
    
    # Experience
    story.append(Paragraph("Kinh nghiệm làm việc", heading_style))
    experience_text = get_experience_text(job_title, job_group, profession, experience_years)
    story.append(Paragraph(experience_text, styles['Normal']))
    story.append(Spacer(1, 0.2*inch))
    
    # Skills
    story.append(Paragraph("Kỹ năng chuyên môn", heading_style))
    skills_text = get_skills_text(skills, job_title, job_group)
    story.append(Paragraph(skills_text, styles['Normal']))
    story.append(Spacer(1, 0.2*inch))
    
    # Education
    story.append(Paragraph("Học vấn", heading_style))
    education_text = get_education_text(job_group)
    story.append(Paragraph(education_text, styles['Normal']))
    story.append(Spacer(1, 0.2*inch))
    
    # Certifications (nếu có)
    if job_group in ['Công nghệ Thông tin', 'Kế toán/Tài chính', 'Marketing/PR/Quảng cáo']:
        story.append(Paragraph("Chứng chỉ", heading_style))
        cert_text = get_certifications_text(job_title, job_group)
        story.append(Paragraph(cert_text, styles['Normal']))
        story.append(Spacer(1, 0.2*inch))
    
    doc.build(story)
    print(f"✅ Created: {filename}")

def get_objective_text(job_title, job_group, profession, experience_years):
    """Tạo mục tiêu nghề nghiệp theo ngành nghề"""
    objectives = {
        'Kinh doanh/Bán hàng': f"Với {experience_years} năm kinh nghiệm trong lĩnh vực {profession}, tôi mong muốn đóng góp vào việc phát triển doanh số và mở rộng thị trường của công ty.",
        'Marketing/PR/Quảng cáo': f"Tìm kiếm cơ hội phát triển sự nghiệp trong lĩnh vực {profession} với {experience_years} năm kinh nghiệm. Mong muốn tạo ra các chiến dịch marketing hiệu quả và xây dựng thương hiệu mạnh.",
        'Chăm sóc khách hàng/Vận hành': f"Với {experience_years} năm kinh nghiệm trong {profession}, tôi mong muốn đóng góp vào việc nâng cao chất lượng dịch vụ khách hàng và tối ưu hóa quy trình vận hành.",
        'Nhân sự/Hành chính/Pháp chế': f"Tìm kiếm cơ hội làm việc tại vị trí {job_title} với {experience_years} năm kinh nghiệm trong lĩnh vực {profession}. Mong muốn đóng góp vào việc phát triển nguồn nhân lực và quản lý hiệu quả.",
        'Công nghệ Thông tin': f"Với {experience_years} năm kinh nghiệm trong lĩnh vực {profession}, tôi mong muốn tham gia vào các dự án công nghệ thú vị và đóng góp vào sự phát triển của công ty.",
        'Kế toán/Tài chính': f"Tìm kiếm cơ hội làm việc tại vị trí {job_title} với {experience_years} năm kinh nghiệm trong lĩnh vực {profession}. Mong muốn đóng góp vào việc quản lý tài chính hiệu quả.",
        'Sản xuất/Vận hành': f"Với {experience_years} năm kinh nghiệm trong {profession}, tôi mong muốn đóng góp vào việc tối ưu hóa quy trình sản xuất và nâng cao chất lượng sản phẩm.",
        'Lao động phổ thông': f"Tìm kiếm cơ hội làm việc ổn định tại vị trí {job_title}. Sẵn sàng học hỏi và làm việc chăm chỉ."
    }
    return objectives.get(job_group, f"Tìm kiếm cơ hội làm việc tại vị trí {job_title} với {experience_years} năm kinh nghiệm.")

def get_experience_text(job_title, job_group, profession, years):
    """Tạo kinh nghiệm làm việc theo ngành nghề"""
    companies = [fake.company() for _ in range(min(years, 3))]
    experience_items = []
    
    for i, company in enumerate(companies):
        year = 2024 - (years - i)
        exp_detail = get_experience_detail(job_title, job_group, profession, company)
        experience_items.append(f"<b>{job_title}</b> - {company} ({year} - {year + 1})<br/>{exp_detail}")
    
    return "<br/>".join(experience_items)

def get_experience_detail(job_title, job_group, profession, company):
    """Chi tiết kinh nghiệm theo ngành nghề"""
    details_map = {
        'Kinh doanh/Bán hàng': [
            f"- Phát triển và quản lý kênh bán hàng, đạt doanh số {fake.random_int(500, 2000)} triệu/tháng",
            f"- Xây dựng mối quan hệ với {fake.random_int(20, 100)} khách hàng tiềm năng",
            f"- Tham gia đàm phán và ký kết hợp đồng với giá trị {fake.random_int(100, 500)} triệu"
        ],
        'Marketing/PR/Quảng cáo': [
            f"- Xây dựng và triển khai chiến dịch marketing, tăng {fake.random_int(20, 50)}% traffic",
            f"- Quản lý {fake.random_int(3, 10)} kênh social media với {fake.random_int(10, 50)}K followers",
            f"- Tạo nội dung và quản lý ngân sách quảng cáo {fake.random_int(50, 200)} triệu/tháng"
        ],
        'Công nghệ Thông tin': [
            f"- Phát triển và bảo trì hệ thống với {fake.random_int(5, 20)} dự án thành công",
            f"- Làm việc với team {fake.random_int(3, 10)} người, áp dụng Agile/Scrum",
            f"- Tối ưu hóa hiệu suất hệ thống, giảm {fake.random_int(30, 60)}% thời gian xử lý"
        ],
        'Kế toán/Tài chính': [
            f"- Quản lý sổ sách kế toán cho {fake.random_int(50, 200)} giao dịch/tháng",
            f"- Lập báo cáo tài chính và phân tích ngân sách {fake.random_int(500, 2000)} triệu/năm",
            f"- Phối hợp với cơ quan thuế và kiểm toán"
        ],
        'Nhân sự/Hành chính/Pháp chế': [
            f"- Tuyển dụng và quản lý {fake.random_int(10, 50)} nhân viên",
            f"- Xây dựng chính sách nhân sự và đào tạo nội bộ",
            f"- Xử lý các vấn đề pháp lý và tuân thủ quy định"
        ],
        'Chăm sóc khách hàng/Vận hành': [
            f"- Xử lý {fake.random_int(50, 200)} yêu cầu khách hàng/tháng",
            f"- Duy trì tỷ lệ hài lòng khách hàng {fake.random_int(85, 98)}%",
            f"- Tối ưu hóa quy trình vận hành, giảm {fake.random_int(20, 40)}% thời gian xử lý"
        ],
        'Sản xuất/Vận hành': [
            f"- Quản lý dây chuyền sản xuất với {fake.random_int(20, 100)} công nhân",
            f"- Đảm bảo chất lượng sản phẩm đạt {fake.random_int(95, 99)}%",
            f"- Tối ưu hóa quy trình, giảm {fake.random_int(15, 30)}% chi phí sản xuất"
        ],
        'Lao động phổ thông': [
            f"- Thực hiện các công việc được giao một cách chăm chỉ và hiệu quả",
            f"- Tuân thủ quy định an toàn lao động",
            f"- Hỗ trợ đồng nghiệp và cải thiện năng suất làm việc"
        ]
    }
    
    details = details_map.get(job_group, [
        f"- Thực hiện các nhiệm vụ chuyên môn tại {company}",
        f"- Đóng góp vào việc cải thiện quy trình làm việc",
        f"- Phối hợp với các phòng ban liên quan"
    ])
    
    return "<br/>".join(fake.random_elements(elements=details, length=2, unique=True))

def get_skills_text(skills, job_title, job_group):
    """Tạo kỹ năng theo ngành nghề"""
    base_skills = ", ".join(skills)
    
    # Thêm kỹ năng đặc thù theo ngành
    additional_skills = {
        'Kinh doanh/Bán hàng': "Giao tiếp, Đàm phán, CRM, Quản lý khách hàng",
        'Marketing/PR/Quảng cáo': "SEO/SEM, Google Analytics, Facebook Ads, Content Creation",
        'Công nghệ Thông tin': "Git, Docker, CI/CD, Database Design, System Architecture",
        'Kế toán/Tài chính': "Excel nâng cao, Phần mềm kế toán, Phân tích tài chính",
        'Nhân sự/Hành chính/Pháp chế': "HRIS, Tuyển dụng, Đào tạo, Quan hệ lao động",
        'Chăm sóc khách hàng/Vận hành': "Customer Service, Zendesk, Communication, Problem Solving",
        'Sản xuất/Vận hành': "Quản lý sản xuất, Lean Manufacturing, Quality Control",
        'Lao động phổ thông': "Làm việc chăm chỉ, Tuân thủ quy định, Học hỏi nhanh"
    }
    
    additional = additional_skills.get(job_group, "Kỹ năng chuyên môn, Làm việc nhóm")
    return f"{base_skills}, {additional}"

def get_education_text(job_group):
    """Tạo học vấn theo ngành nghề"""
    universities = {
        'Công nghệ Thông tin': ['Đại học Bách Khoa', 'Đại học Công nghệ', 'Đại học FPT'],
        'Kế toán/Tài chính': ['Đại học Kinh tế', 'Đại học Tài chính', 'Học viện Tài chính'],
        'Marketing/PR/Quảng cáo': ['Đại học Kinh tế', 'Đại học Văn hóa', 'Học viện Báo chí'],
        'Kinh doanh/Bán hàng': ['Đại học Kinh tế', 'Đại học Thương mại', 'Đại học Ngoại thương'],
        'Nhân sự/Hành chính/Pháp chế': ['Đại học Luật', 'Đại học Kinh tế', 'Đại học Quốc gia'],
        'Chăm sóc khách hàng/Vận hành': ['Đại học Kinh tế', 'Đại học Thương mại', 'Cao đẳng'],
        'Sản xuất/Vận hành': ['Đại học Bách Khoa', 'Cao đẳng Kỹ thuật', 'Trung cấp'],
        'Lao động phổ thông': ['Trung học phổ thông', 'Trung cấp', 'Cao đẳng']
    }
    
    majors = {
        'Công nghệ Thông tin': ['Công nghệ thông tin', 'Khoa học máy tính', 'Kỹ thuật phần mềm'],
        'Kế toán/Tài chính': ['Kế toán', 'Tài chính - Ngân hàng', 'Kinh tế'],
        'Marketing/PR/Quảng cáo': ['Marketing', 'Truyền thông', 'Quan hệ công chúng'],
        'Kinh doanh/Bán hàng': ['Quản trị kinh doanh', 'Kinh doanh quốc tế', 'Thương mại'],
        'Nhân sự/Hành chính/Pháp chế': ['Quản trị nhân lực', 'Luật', 'Hành chính công'],
        'Chăm sóc khách hàng/Vận hành': ['Quản trị kinh doanh', 'Thương mại', 'Dịch vụ'],
        'Sản xuất/Vận hành': ['Kỹ thuật công nghiệp', 'Cơ khí', 'Điện'],
        'Lao động phổ thông': ['Không yêu cầu', 'Trung học', 'Cao đẳng']
    }
    
    uni_list = universities.get(job_group, ['Đại học Tổng hợp', 'Đại học Kinh tế'])
    major_list = majors.get(job_group, ['Quản trị kinh doanh', 'Kinh tế'])
    
    university = fake.random_element(elements=uni_list)
    major = fake.random_element(elements=major_list)
    year = fake.random_int(2015, 2020)
    
    return f"<b>{university}</b><br/>Chuyên ngành: {major}<br/>Tốt nghiệp: {year}<br/>Xếp loại: {fake.random_element(elements=('Giỏi', 'Khá', 'Trung bình Khá'))}"

def get_certifications_text(job_title, job_group):
    """Tạo chứng chỉ theo ngành nghề"""
    certs = {
        'Công nghệ Thông tin': [
            'AWS Certified Solutions Architect',
            'Google Cloud Professional',
            'Microsoft Certified: Azure Fundamentals',
            'Oracle Certified Professional'
        ],
        'Kế toán/Tài chính': [
            'Chứng chỉ Kế toán viên công chứng (CPA)',
            'Chứng chỉ Phân tích tài chính (CFA)',
            'Chứng chỉ Kiểm toán viên'
        ],
        'Marketing/PR/Quảng cáo': [
            'Google Analytics Certified',
            'Facebook Blueprint Certified',
            'HubSpot Content Marketing Certified'
        ]
    }
    
    cert_list = certs.get(job_group, [])
    if cert_list:
        selected = fake.random_elements(elements=cert_list, length=min(2, len(cert_list)), unique=True)
        return "<br/>".join([f"- {cert}" for cert in selected])
    return ""

# Định nghĩa tất cả các vị trí từ job-categories.js
job_positions = [
    # Kinh doanh/Bán hàng
    {'group': 'Kinh doanh/Bán hàng', 'profession': 'Sales Xuất nhập khẩu/Logistics', 'position': 'Sales Logistics', 'skills': ['Quản lý logistics', 'Xuất nhập khẩu', 'Đàm phán', 'Tiếng Anh']},
    {'group': 'Kinh doanh/Bán hàng', 'profession': 'Sales Bất động sản', 'position': 'Sales bất động sản/Môi giới bất động sản', 'skills': ['Môi giới BĐS', 'Tư vấn', 'Marketing BĐS', 'Pháp lý BĐS']},
    {'group': 'Kinh doanh/Bán hàng', 'profession': 'Sales IT/Phần mềm', 'position': 'Sales IT/Phần mềm', 'skills': ['Bán hàng IT', 'Tư vấn giải pháp', 'CRM', 'Cloud Computing']},
    
    # Marketing/PR/Quảng cáo
    {'group': 'Marketing/PR/Quảng cáo', 'profession': 'Digital Marketing', 'position': 'SEO/SEM Specialist', 'skills': ['SEO', 'SEM', 'Google Ads', 'Analytics']},
    {'group': 'Marketing/PR/Quảng cáo', 'profession': 'Digital Marketing', 'position': 'Social Media Marketing', 'skills': ['Facebook Ads', 'Instagram', 'Content Creation', 'Community Management']},
    {'group': 'Marketing/PR/Quảng cáo', 'profession': 'Brand Marketing', 'position': 'Brand Manager', 'skills': ['Brand Strategy', 'Market Research', 'Campaign Management']},
    {'group': 'Marketing/PR/Quảng cáo', 'profession': 'Creative/Design', 'position': 'Graphic Designer', 'skills': ['Photoshop', 'Illustrator', 'Figma', 'UI/UX Design']},
    
    # Chăm sóc khách hàng/Vận hành
    {'group': 'Chăm sóc khách hàng/Vận hành', 'profession': 'Customer Service', 'position': 'Customer Support', 'skills': ['Customer Service', 'Zendesk', 'Communication', 'Problem Solving']},
    {'group': 'Chăm sóc khách hàng/Vận hành', 'profession': 'Operations', 'position': 'Operations Manager', 'skills': ['Operations Management', 'Process Optimization', 'Team Leadership']},
    
    # Nhân sự/Hành chính/Pháp chế
    {'group': 'Nhân sự/Hành chính/Pháp chế', 'profession': 'Nhân sự', 'position': 'HR Manager', 'skills': ['Tuyển dụng', 'Quản lý nhân sự', 'HRIS', 'Đào tạo']},
    {'group': 'Nhân sự/Hành chính/Pháp chế', 'profession': 'Nhân sự', 'position': 'Recruiter', 'skills': ['Tuyển dụng', 'Sourcing', 'Interview', 'ATS']},
    {'group': 'Nhân sự/Hành chính/Pháp chế', 'profession': 'Pháp chế', 'position': 'Legal Advisor', 'skills': ['Luật doanh nghiệp', 'Hợp đồng', 'Tuân thủ pháp lý']},
    
    # Công nghệ Thông tin
    {'group': 'Công nghệ Thông tin', 'profession': 'Lập trình viên', 'position': 'Frontend Developer', 'skills': ['React', 'Vue.js', 'TypeScript', 'HTML/CSS']},
    {'group': 'Công nghệ Thông tin', 'profession': 'Lập trình viên', 'position': 'Backend Developer', 'skills': ['Python', 'Django', 'Node.js', 'PostgreSQL']},
    {'group': 'Công nghệ Thông tin', 'profession': 'Lập trình viên', 'position': 'Full Stack Developer', 'skills': ['React', 'Node.js', 'MongoDB', 'AWS']},
    {'group': 'Công nghệ Thông tin', 'profession': 'Lập trình viên', 'position': 'Mobile Developer', 'skills': ['React Native', 'Flutter', 'iOS', 'Android']},
    {'group': 'Công nghệ Thông tin', 'profession': 'DevOps/System Admin', 'position': 'DevOps Engineer', 'skills': ['Docker', 'Kubernetes', 'CI/CD', 'AWS']},
    {'group': 'Công nghệ Thông tin', 'profession': 'Data/AI', 'position': 'Data Engineer', 'skills': ['Python', 'SQL', 'ETL', 'Big Data']},
    {'group': 'Công nghệ Thông tin', 'profession': 'Data/AI', 'position': 'Data Analyst', 'skills': ['SQL', 'Python', 'Tableau', 'Excel']},
    {'group': 'Công nghệ Thông tin', 'profession': 'Data/AI', 'position': 'Data Scientist', 'skills': ['Python', 'Machine Learning', 'TensorFlow', 'Statistics']},
    {'group': 'Công nghệ Thông tin', 'profession': 'QA/Testing', 'position': 'QA Engineer', 'skills': ['Testing', 'Selenium', 'Jest', 'Test Automation']},
    {'group': 'Công nghệ Thông tin', 'profession': 'Product/Project Management', 'position': 'Product Manager', 'skills': ['Product Strategy', 'Agile', 'User Research', 'Roadmap']},
    {'group': 'Công nghệ Thông tin', 'profession': 'Product/Project Management', 'position': 'Project Manager', 'skills': ['Project Management', 'Agile', 'Scrum', 'Jira']},
    
    # Kế toán/Tài chính
    {'group': 'Kế toán/Tài chính', 'profession': 'Kế toán', 'position': 'Kế toán tổng hợp', 'skills': ['Kế toán', 'Excel', 'Phần mềm kế toán', 'Báo cáo tài chính']},
    {'group': 'Kế toán/Tài chính', 'profession': 'Kế toán', 'position': 'Kế toán thuế', 'skills': ['Kế toán thuế', 'Khai báo thuế', 'Quyết toán', 'HTKK']},
    {'group': 'Kế toán/Tài chính', 'profession': 'Tài chính', 'position': 'Financial Analyst', 'skills': ['Phân tích tài chính', 'Excel', 'Financial Modeling', 'Forecasting']},
    {'group': 'Kế toán/Tài chính', 'profession': 'Kiểm toán', 'position': 'Auditor', 'skills': ['Kiểm toán', 'Internal Audit', 'Risk Assessment', 'Compliance']},
    
    # Sản xuất/Vận hành
    {'group': 'Sản xuất/Vận hành', 'profession': 'Sản xuất', 'position': 'Production Manager', 'skills': ['Quản lý sản xuất', 'Lean Manufacturing', 'Quality Control']},
    {'group': 'Sản xuất/Vận hành', 'profession': 'Chất lượng', 'position': 'Quality Manager', 'skills': ['Quality Management', 'ISO', 'Quality Control', 'Six Sigma']},
]

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    cv_dir = os.path.join(script_dir, 'sample_cvs')
    os.makedirs(cv_dir, exist_ok=True)
    
    print(f"📝 Tạo CV mẫu cho {len(job_positions)} vị trí...")
    print(f"📁 Lưu tại: {cv_dir}\n")
    
    for idx, job in enumerate(job_positions, 1):
        # Tạo thông tin cá nhân
        name = fake.name()
        email = f"{sanitize_filename(name.lower().replace(' ', '.'))}@example.com"
        phone = fake.phone_number()
        experience_years = fake.random_int(1, 8)
        
        # Tạo tên file
        filename = f"CV_{idx:02d}_{sanitize_filename(name)}_{sanitize_filename(job['position'])}.pdf"
        filepath = os.path.join(cv_dir, filename)
        
        # Tạo CV
        create_cv(
            filepath,
            name,
            email,
            phone,
            experience_years,
            job['skills'],
            job['position'],
            job['group'],
            job['profession']
        )
    
    print(f"\n✅ Đã tạo {len(job_positions)} CV mẫu!")
    print(f"📁 Vị trí: {cv_dir}")

