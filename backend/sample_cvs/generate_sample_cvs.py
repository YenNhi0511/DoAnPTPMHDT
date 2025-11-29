"""
Script để tạo CV mẫu (PDF) cho testing
Cần cài: pip install reportlab faker
"""
import os
import re
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from faker import Faker

fake = Faker('vi_VN')  # Vietnamese locale

def sanitize_filename(filename):
    """Loại bỏ các ký tự không hợp lệ trong tên file"""
    # Thay thế các ký tự không hợp lệ bằng underscore
    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    # Loại bỏ khoảng trắng thừa
    filename = re.sub(r'\s+', '_', filename)
    # Loại bỏ underscore thừa
    filename = re.sub(r'_+', '_', filename)
    return filename.strip('_')

def create_cv(filename, name, email, phone, experience_years, skills, job_title):
    """Tạo một CV mẫu"""
    # Đảm bảo thư mục tồn tại
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
    story.append(Spacer(1, 0.3*inch))
    
    # Objective
    story.append(Paragraph("Mục tiêu nghề nghiệp", heading_style))
    story.append(Paragraph(
        f"Tìm kiếm cơ hội làm việc tại vị trí {job_title} với {experience_years} năm kinh nghiệm "
        f"trong lĩnh vực công nghệ thông tin. Mong muốn đóng góp và phát triển cùng công ty.",
        styles['Normal']
    ))
    story.append(Spacer(1, 0.2*inch))
    
    # Experience
    story.append(Paragraph("Kinh nghiệm làm việc", heading_style))
    for i in range(experience_years):
        company = fake.company()
        position = fake.job()
        story.append(Paragraph(f"<b>{position}</b> - {company}", styles['Normal']))
        story.append(Paragraph(f"{fake.date_between(start_date='-5y', end_date='today').strftime('%Y')} - Hiện tại", 
                              styles['Normal']))
        story.append(Paragraph(f"- {fake.text(max_nb_chars=100)}", styles['Normal']))
        story.append(Spacer(1, 0.1*inch))
    
    # Skills
    story.append(Paragraph("Kỹ năng", heading_style))
    skills_text = ", ".join(skills)
    story.append(Paragraph(skills_text, styles['Normal']))
    story.append(Spacer(1, 0.2*inch))
    
    # Education
    story.append(Paragraph("Học vấn", heading_style))
    story.append(Paragraph(f"<b>{fake.random_element(elements=('Đại học Bách Khoa', 'Đại học Công nghệ', 'Đại học FPT'))}</b>", 
                          styles['Normal']))
    story.append(Paragraph(f"Chuyên ngành: {fake.random_element(elements=('Công nghệ thông tin', 'Khoa học máy tính', 'Kỹ thuật phần mềm'))}", 
                          styles['Normal']))
    story.append(Paragraph(f"Tốt nghiệp: {fake.year()}", styles['Normal']))
    
    doc.build(story)
    print(f"✅ Created: {filename}")

# Tạo 20 CVs mẫu
if __name__ == '__main__':
    # Lấy đường dẫn tuyệt đối của script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    cv_dir = os.path.join(script_dir, 'sample_cvs')
    os.makedirs(cv_dir, exist_ok=True)
    
    # Đổi working directory để tạo file trong đúng thư mục
    original_dir = os.getcwd()
    os.chdir(script_dir)
    
    # Job titles và skills tương ứng
    job_configs = [
        ('Senior Full Stack Developer', ['JavaScript', 'React', 'Node.js', 'Python', 'Django', 'PostgreSQL', 'Docker']),
        ('Frontend Developer', ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Redux']),
        ('Backend Developer', ['Python', 'Django', 'PostgreSQL', 'Redis', 'Celery', 'Docker', 'REST API']),
        ('DevOps Engineer', ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Linux', 'Monitoring']),
        ('Mobile Developer', ['React Native', 'JavaScript', 'iOS', 'Android', 'Redux', 'Firebase']),
        ('UI/UX Designer', ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research', 'Design System']),
        ('Data Engineer', ['Python', 'SQL', 'Apache Airflow', 'BigQuery', 'Spark', 'ETL', 'Data Pipeline']),
        ('Product Manager', ['Product Strategy', 'Agile', 'Scrum', 'Analytics', 'User Research', 'Roadmap']),
        ('QA Engineer', ['Testing', 'Selenium', 'Cypress', 'API Testing', 'Test Automation', 'Jira']),
        ('Marketing Manager', ['Digital Marketing', 'SEO', 'SEM', 'Google Analytics', 'Content Marketing']),
    ]
    
    # Tạo 2 CVs cho mỗi job type
    cv_count = 0
    for job_title, skills in job_configs:
        for i in range(2):
            cv_count += 1
            name = fake.name()
            email = fake.email()
            phone = fake.phone_number()
            experience = fake.random_int(min=2, max=8)
            
            # Sanitize tên file để loại bỏ ký tự đặc biệt
            safe_name = sanitize_filename(name)
            safe_job_title = sanitize_filename(job_title)
            # Sử dụng absolute path để đảm bảo tạo file đúng vị trí
            filename = os.path.join(cv_dir, f"CV_{cv_count:02d}_{safe_name}_{safe_job_title}.pdf")
            create_cv(filename, name, email, phone, experience, skills, job_title)
    
    # Trả về thư mục gốc
    os.chdir(original_dir)
    print(f"\n🎉 Đã tạo {cv_count} CVs mẫu trong thư mục {cv_dir}/")

