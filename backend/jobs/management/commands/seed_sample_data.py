"""
Management command to seed sample data for recruitment system
Usage: python manage.py seed_sample_data
Or on Railway: railway run --service backend python manage.py seed_sample_data
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from accounts.models import User
from jobs.models import Job
from applications.models import Application, Interview, InterviewPanel


class Command(BaseCommand):
    help = 'Seed sample data for recruitment system (users, companies, jobs)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before seeding',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('🌱 Starting to seed sample data...'))

        if options['clear']:
            self.stdout.write(self.style.WARNING('⚠️  Clearing existing data...'))
            Job.objects.all().delete()
            Application.objects.all().delete()
            # Don't delete users in production
            
        # 1. Create Users
        self.stdout.write('📝 Creating users...')
        admin, created = User.objects.get_or_create(
            email='admin@recruitmentpro.live',
            defaults={
                'username': 'admin',
                'first_name': 'Admin',
                'last_name': 'System',
                'role': User.Role.ADMIN,
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin.set_password('Admin@123456')
            admin.save()
            self.stdout.write(self.style.SUCCESS(f'✅ Created admin: {admin.email}'))
        else:
            self.stdout.write(f'ℹ️  Admin already exists: {admin.email}')

        recruiter, created = User.objects.get_or_create(
            email='recruiter@recruitmentpro.live',
            defaults={
                'username': 'recruiter',
                'first_name': 'John',
                'last_name': 'Recruiter',
                'role': User.Role.RECRUITER,
            }
        )
        if created:
            recruiter.set_password('Recruiter@123')
            recruiter.save()
            self.stdout.write(self.style.SUCCESS(f'✅ Created recruiter: {recruiter.email}'))
        else:
            self.stdout.write(f'ℹ️  Recruiter already exists: {recruiter.email}')

        candidate, created = User.objects.get_or_create(
            email='candidate@recruitmentpro.live',
            defaults={
                'username': 'candidate',
                'first_name': 'Jane',
                'last_name': 'Candidate',
                'role': User.Role.CANDIDATE,
            }
        )
        if created:
            candidate.set_password('Candidate@123')
            candidate.save()
            self.stdout.write(self.style.SUCCESS(f'✅ Created candidate: {candidate.email}'))
        else:
            self.stdout.write(f'ℹ️  Candidate already exists: {candidate.email}')

        # 2. Create Jobs
        self.stdout.write('\n💼 Creating jobs...')
        jobs_data = [
            {
                'title': 'Senior Full Stack Developer - FPT Software',
                'description': 'We are looking for an experienced Full Stack Developer to join our team at FPT Software. You will work on building scalable web applications using modern technologies for enterprise clients.',
                'requirements': '• 5+ years of experience in web development\n• Strong knowledge of React, Node.js\n• Experience with PostgreSQL, Redis\n• Good understanding of RESTful APIs\n• Experience with Docker, CI/CD',
                'salary': '2000-3500 USD',
                'location': 'Hanoi',
                'employment_type': Job.EmploymentType.FULLTIME,
                'department': 'FPT Software',
            },
            {
                'title': 'Senior Java Backend Developer - FPT Software',
                'description': 'Join our backend team at FPT to build high-performance microservices. Work with Spring Boot, Kafka, and cloud technologies.',
                'requirements': '• 5+ years Java development\n• Expert in Spring Boot, Spring Cloud\n• Experience with Kafka, RabbitMQ\n• Knowledge of AWS or Azure\n• Microservices architecture',
                'salary': '1800-3000 USD',
                'location': 'Ho Chi Minh City',
                'employment_type': Job.EmploymentType.FULLTIME,
                'department': 'FPT Software',
            },
            {
                'title': 'Frontend React Developer - VNG Corporation',
                'description': 'Build beautiful and responsive user interfaces using React for VNG gaming and social platforms.',
                'requirements': '• 3+ years React development\n• Expert in TypeScript, Redux\n• Experience with Next.js\n• Good understanding of CSS, Tailwind\n• UI/UX design sense',
                'salary': '1200-2000 USD',
                'location': 'Hanoi',
                'employment_type': Job.EmploymentType.FULLTIME,
                'department': 'VNG Corporation',
            },
            {
                'title': 'Python Backend Engineer - VNG Corporation',
                'description': 'Develop scalable backend services for VNG products using Python and Django. Work with data pipelines and APIs.',
                'requirements': '• 3+ years Python development\n• Strong knowledge of Django/Flask\n• Experience with PostgreSQL, MongoDB\n• RESTful API design\n• Experience with Celery, Redis',
                'salary': '1500-2500 USD',
                'location': 'Ho Chi Minh City',
                'employment_type': Job.EmploymentType.FULLTIME,
                'department': 'VNG Corporation',
            },
            {
                'title': 'DevOps Engineer - Tiki',
                'description': 'Build and maintain CI/CD pipelines for Tiki e-commerce platform, manage cloud infrastructure, and ensure system reliability.',
                'requirements': '• 3+ years DevOps experience\n• Expert in Docker, Kubernetes\n• Experience with AWS/Azure/GCP\n• Knowledge of Terraform, Ansible\n• Strong scripting skills (Bash, Python)',
                'salary': '1800-2800 USD',
                'location': 'Hanoi',
                'employment_type': Job.EmploymentType.FULLTIME,
                'department': 'Tiki',
            },
            {
                'title': 'Mobile Developer (React Native) - Tiki',
                'description': 'Develop cross-platform mobile applications for Tiki shopping app using React Native. Work closely with design and backend teams.',
                'requirements': '• 3+ years mobile development\n• Expert in React Native\n• Experience with iOS and Android\n• Knowledge of native modules\n• App Store and Play Store deployment',
                'salary': '1500-2500 USD',
                'location': 'Ho Chi Minh City',
                'employment_type': Job.EmploymentType.FULLTIME,
                'department': 'Tiki',
            },
            {
                'title': 'Data Engineer - Viettel Digital',
                'description': 'Build and optimize data pipelines for Viettel digital services, work with big data technologies, and ensure data quality.',
                'requirements': '• 3+ years data engineering\n• Expert in Python, SQL\n• Experience with Spark, Airflow\n• Knowledge of data warehousing\n• ETL pipeline development',
                'salary': '1800-2800 USD',
                'location': 'Hanoi',
                'employment_type': Job.EmploymentType.FULLTIME,
                'department': 'Viettel Digital',
            },
            {
                'title': 'QA Automation Engineer - Viettel Digital',
                'description': 'Design and implement automated testing frameworks for Viettel products. Ensure software quality through comprehensive testing.',
                'requirements': '• 3+ years QA automation\n• Expert in Selenium, Cypress\n• Experience with CI/CD integration\n• Knowledge of API testing\n• Performance testing experience',
                'salary': '1000-1800 USD',
                'location': 'Ho Chi Minh City',
                'employment_type': Job.EmploymentType.FULLTIME,
                'department': 'Viettel Digital',
            },
            {
                'title': 'UI/UX Designer - Momo',
                'description': 'Create beautiful and intuitive user experiences for Momo fintech platform. Work with product and engineering teams.',
                'requirements': '• 3+ years UI/UX design\n• Expert in Figma, Adobe XD\n• Strong portfolio\n• Understanding of user research\n• Mobile and web design experience',
                'salary': '800-1500 USD',
                'location': 'Hanoi',
                'employment_type': Job.EmploymentType.FULLTIME,
                'department': 'Momo',
            },
            {
                'title': 'Product Manager - Momo',
                'description': 'Lead product development for Momo financial services from ideation to launch. Work with cross-functional teams.',
                'requirements': '• 3+ years product management\n• Strong analytical skills\n• Experience with Agile/Scrum\n• Good technical background\n• Excellent communication skills',
                'salary': '1500-2500 USD',
                'location': 'Ho Chi Minh City',
                'employment_type': Job.EmploymentType.FULLTIME,
                'department': 'Momo',
            },
            {
                'title': 'Security Engineer - FPT Software',
                'description': 'Ensure application security for enterprise clients, perform penetration testing, and implement security best practices.',
                'requirements': '• 3+ years security experience\n• Knowledge of OWASP Top 10\n• Experience with security tools\n• Penetration testing skills\n• Security certifications preferred',
                'salary': '2000-3000 USD',
                'location': 'Hanoi',
                'employment_type': Job.EmploymentType.FULLTIME,
                'department': 'FPT Software',
            },
            {
                'title': 'Junior Frontend Developer - VNG',
                'description': 'Join VNG team as a junior developer. Learn from experienced engineers and grow your skills in gaming and social platforms.',
                'requirements': '• 1+ year web development\n• Basic knowledge of React\n• HTML, CSS, JavaScript\n• Willingness to learn\n• Good teamwork skills',
                'salary': '500-800 USD',
                'location': 'Ho Chi Minh City',
                'employment_type': Job.EmploymentType.FULLTIME,
                'department': 'VNG Corporation',
            },
            {
                'title': 'Marketing Intern - Tiki',
                'description': 'Support Tiki marketing campaigns, content creation, and social media management for e-commerce platform.',
                'requirements': '• Final year student or fresh graduate\n• Interest in digital marketing\n• Good writing skills\n• Creative mindset\n• Social media savvy',
                'salary': '200-400 USD',
                'location': 'Hanoi',
                'employment_type': Job.EmploymentType.INTERN,
                'department': 'Tiki',
            },
            {
                'title': 'Business Analyst - Viettel Digital',
                'description': 'Analyze business requirements for digital transformation projects, create documentation, and work with development teams.',
                'requirements': '• 2+ years BA experience\n• Strong analytical skills\n• Experience with requirement gathering\n• Knowledge of Agile methodology\n• Good communication skills',
                'salary': '800-1500 USD',
                'location': 'Ho Chi Minh City',
                'employment_type': Job.EmploymentType.FULLTIME,
                'department': 'Viettel Digital',
            },
            {
                'title': 'Scrum Master - Momo',
                'description': 'Facilitate Agile ceremonies for Momo fintech teams, remove blockers, and help teams achieve their goals.',
                'requirements': '• 2+ years Scrum Master experience\n• Scrum certification preferred\n• Strong facilitation skills\n• Experience with Jira\n• Servant leadership mindset',
                'salary': '1000-1800 USD',
                'location': 'Hanoi',
                'employment_type': Job.EmploymentType.FULLTIME,
                'department': 'Momo',
            },
        ]

        jobs = []
        for job_data in jobs_data:
            job, created = Job.objects.get_or_create(
                title=job_data['title'],
                defaults={
                    **job_data,
                    'status': Job.Status.OPEN,
                    'deadline': timezone.now() + timedelta(days=30),
                    'created_by': recruiter,
                }
            )
            jobs.append(job)
            if created:
                self.stdout.write(self.style.SUCCESS(f'✅ Created job: {job.title}'))
            else:
                self.stdout.write(f'ℹ️  Job already exists: {job.title}')

        # 4. Create Sample Applications
        self.stdout.write('\n📋 Creating sample applications...')
        if jobs:
            app1, created = Application.objects.get_or_create(
                job=jobs[0],
                candidate=candidate,
                defaults={
                    'cover_letter': 'I am very interested in this Full Stack Developer position. I have 5+ years of experience working with React, Node.js, and PostgreSQL. I believe I would be a great fit for your team.',
                    'status': Application.Status.PENDING,
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✅ Created application for: {jobs[0].title}'))
            
            app2, created = Application.objects.get_or_create(
                job=jobs[2],
                candidate=candidate,
                defaults={
                    'cover_letter': 'I would like to apply for the Frontend React Developer position. I have strong experience with React, TypeScript, and modern frontend technologies.',
                    'status': Application.Status.REVIEWING,
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✅ Created application for: {jobs[2].title}'))

                # Create interview for this application
                interview = Interview.objects.create(
                    application=app2,
                    scheduled_at=timezone.now() + timedelta(days=7),
                    duration=60,
                    location='Google Meet',
                    interview_type=Interview.Type.VIDEO,
                    status=Interview.Status.SCHEDULED,
                )
                InterviewPanel.objects.create(
                    interview=interview,
                    interviewer=recruiter,
                    role=InterviewPanel.Role.LEAD
                )
                self.stdout.write(self.style.SUCCESS(f'✅ Created interview for application'))

        # Summary
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS('🎉 Seed data created successfully!'))
        self.stdout.write('='*60)
        self.stdout.write('\n📊 Summary:')
        self.stdout.write(f'  • Users: {User.objects.count()}')
        self.stdout.write(f'  • Jobs: {Job.objects.count()}')
        self.stdout.write(f'  • Applications: {Application.objects.count()}')
        
        self.stdout.write('\n🔑 Test Accounts:')
        self.stdout.write(f'  • Admin: admin@recruitmentpro.live / Admin@123456')
        self.stdout.write(f'  • Recruiter: recruiter@recruitmentpro.live / Recruiter@123')
        self.stdout.write(f'  • Candidate: candidate@recruitmentpro.live / Candidate@123')
        
        self.stdout.write('\n🌐 Access:')
        self.stdout.write(f'  • Website: https://www.recruitmentpro.live')
        self.stdout.write(f'  • Admin Panel: https://api.recruitmentpro.live/admin')
        self.stdout.write(f'  • API: https://api.recruitmentpro.live/api')
        self.stdout.write('')
