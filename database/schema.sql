-- ============================================
-- RECRUITMENT SYSTEM - Database Schema
-- PostgreSQL Database Schema
-- ============================================
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- ============================================
-- TABLES
-- ============================================
-- Users table (extends Django auth_user)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    password VARCHAR(128) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
    username VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(150) NOT NULL DEFAULT '',
    last_name VARCHAR(150) NOT NULL DEFAULT '',
    email VARCHAR(255) NOT NULL UNIQUE,
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    date_joined TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(20) NOT NULL DEFAULT 'CANDIDATE' CHECK (
        role IN ('ADMIN', 'RECRUITER', 'INTERVIEWER', 'CANDIDATE')
    ),
    avatar VARCHAR(100),
    phone VARCHAR(20),
    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_username_unique UNIQUE (username)
);
-- Recruitment Processes table
CREATE TABLE IF NOT EXISTS recruitment_processes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Process Steps table
CREATE TABLE IF NOT EXISTS process_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    process_id UUID NOT NULL REFERENCES recruitment_processes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    step_type VARCHAR(30) NOT NULL CHECK (
        step_type IN (
            'SCREENING',
            'PHONE_INTERVIEW',
            'TECHNICAL_TEST',
            'INTERVIEW',
            'FINAL_INTERVIEW',
            'OFFER',
            'ONBOARDING'
        )
    ),
    "order" INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    duration_days INTEGER NOT NULL DEFAULT 7,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT process_steps_process_order_unique UNIQUE (process_id, "order")
);
-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    salary_min NUMERIC(15, 0),
    salary_max NUMERIC(15, 0),
    salary VARCHAR(100),
    location VARCHAR(255) NOT NULL,
    employment_type VARCHAR(20) NOT NULL DEFAULT 'FULLTIME' CHECK (
        employment_type IN ('FULLTIME', 'PARTTIME', 'CONTRACT', 'INTERN')
    ),
    positions_count INTEGER NOT NULL DEFAULT 1,
    experience_years INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (
        status IN ('DRAFT', 'OPEN', 'CLOSED', 'CANCELLED')
    ),
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    recruitment_process_id UUID REFERENCES recruitment_processes(id) ON DELETE
    SET NULL,
        created_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cv_file VARCHAR(100) NOT NULL,
    cover_letter TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (
        status IN (
            'PENDING',
            'SCREENING',
            'INTERVIEW',
            'OFFER',
            'REJECTED',
            'ACCEPTED'
        )
    ),
    ai_score DOUBLE PRECISION CHECK (
        ai_score >= 0
        AND ai_score <= 100
    ),
    ai_analysis JSONB,
    screener_notes TEXT,
    applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT applications_job_candidate_unique UNIQUE (job_id, candidate_id)
);
-- Interviews table
CREATE TABLE IF NOT EXISTS interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER NOT NULL,
    location VARCHAR(500),
    interview_type VARCHAR(20) NOT NULL DEFAULT 'VIDEO' CHECK (interview_type IN ('PHONE', 'VIDEO', 'ONSITE')),
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED' CHECK (
        status IN (
            'SCHEDULED',
            'COMPLETED',
            'CANCELLED',
            'RESCHEDULED'
        )
    ),
    feedback TEXT,
    result VARCHAR(20) DEFAULT 'PENDING' CHECK (result IN ('PASS', 'FAIL', 'PENDING')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Interview Panels table
CREATE TABLE IF NOT EXISTS interview_panels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    interviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL DEFAULT 'MEMBER' CHECK (role IN ('LEAD', 'MEMBER', 'OBSERVER')),
    feedback TEXT,
    score DOUBLE PRECISION CHECK (
        score >= 0
        AND score <= 100
    ),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT interview_panels_interview_interviewer_unique UNIQUE (interview_id, interviewer_id)
);
-- Recruitment Results table
CREATE TABLE IF NOT EXISTS recruitment_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
    final_decision VARCHAR(20) NOT NULL CHECK (final_decision IN ('OFFER', 'REJECT')),
    offer_letter_file VARCHAR(100),
    salary VARCHAR(100),
    start_date DATE,
    notes TEXT,
    decided_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    decided_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(20) NOT NULL DEFAULT 'SYSTEM' CHECK (notification_type IN ('EMAIL', 'SYSTEM')),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    related_id UUID,
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- ============================================
-- INDEXES
-- ============================================
-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
-- Jobs indexes
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON jobs(deadline);
CREATE INDEX IF NOT EXISTS idx_jobs_created_by ON jobs(created_by_id);
-- Applications indexes
CREATE INDEX IF NOT EXISTS idx_applications_job_status ON applications(job_id, status);
CREATE INDEX IF NOT EXISTS idx_applications_candidate ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_ai_score ON applications(ai_score);
-- Interviews indexes
CREATE INDEX IF NOT EXISTS idx_interviews_scheduled_status ON interviews(scheduled_at, status);
CREATE INDEX IF NOT EXISTS idx_interviews_application ON interviews(application_id);
-- Interview Panels indexes
CREATE INDEX IF NOT EXISTS idx_interview_panels_interview ON interview_panels(interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_panels_interviewer ON interview_panels(interviewer_id);
-- Recruitment Results indexes
CREATE INDEX IF NOT EXISTS idx_recruitment_results_application ON recruitment_results(application_id);
CREATE INDEX IF NOT EXISTS idx_recruitment_results_decided_by ON recruitment_results(decided_by_id);
CREATE INDEX IF NOT EXISTS idx_recruitment_results_decided_at ON recruitment_results(decided_at);
-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_read_created ON notifications(user_id, is_read, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- Insert sample users (passwords are hashed - use Django's password hashing in production)
-- Password: admin123 (hashed with pbkdf2_sha256)
INSERT INTO users (
        id,
        username,
        email,
        password,
        first_name,
        last_name,
        role,
        is_superuser,
        is_staff,
        is_active,
        date_joined
    )
VALUES (
        '00000000-0000-0000-0000-000000000001',
        'admin',
        'admin@recruitment.com',
        'pbkdf2_sha256$600000$dummy$dummy=',
        'Admin',
        'User',
        'ADMIN',
        TRUE,
        TRUE,
        TRUE,
        CURRENT_TIMESTAMP
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'recruiter',
        'recruiter@recruitment.com',
        'pbkdf2_sha256$600000$dummy$dummy=',
        'Recruiter',
        'User',
        'RECRUITER',
        FALSE,
        FALSE,
        TRUE,
        CURRENT_TIMESTAMP
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        'candidate',
        'candidate@recruitment.com',
        'pbkdf2_sha256$600000$dummy$dummy=',
        'Candidate',
        'User',
        'CANDIDATE',
        FALSE,
        FALSE,
        TRUE,
        CURRENT_TIMESTAMP
    ) ON CONFLICT (email) DO NOTHING;
-- ============================================
-- VIEWS (Optional - for reporting)
-- ============================================
-- View: Job Applications Summary
CREATE OR REPLACE VIEW v_job_applications_summary AS
SELECT j.id AS job_id,
    j.title AS job_title,
    j.status AS job_status,
    COUNT(a.id) AS total_applications,
    COUNT(
        CASE
            WHEN a.status = 'PENDING' THEN 1
        END
    ) AS pending_count,
    COUNT(
        CASE
            WHEN a.status = 'SCREENING' THEN 1
        END
    ) AS screening_count,
    COUNT(
        CASE
            WHEN a.status = 'INTERVIEW' THEN 1
        END
    ) AS interview_count,
    COUNT(
        CASE
            WHEN a.status = 'OFFER' THEN 1
        END
    ) AS offer_count,
    COUNT(
        CASE
            WHEN a.status = 'ACCEPTED' THEN 1
        END
    ) AS accepted_count,
    COUNT(
        CASE
            WHEN a.status = 'REJECTED' THEN 1
        END
    ) AS rejected_count,
    AVG(a.ai_score) AS avg_ai_score
FROM jobs j
    LEFT JOIN applications a ON j.id = a.job_id
GROUP BY j.id,
    j.title,
    j.status;
-- View: Candidate Application Status
CREATE OR REPLACE VIEW v_candidate_applications AS
SELECT u.id AS candidate_id,
    u.email AS candidate_email,
    u.first_name || ' ' || u.last_name AS candidate_name,
    a.id AS application_id,
    j.title AS job_title,
    a.status AS application_status,
    a.ai_score,
    a.applied_at,
    rr.final_decision
FROM users u
    JOIN applications a ON u.id = a.candidate_id
    JOIN jobs j ON a.job_id = j.id
    LEFT JOIN recruitment_results rr ON a.id = rr.application_id
WHERE u.role = 'CANDIDATE';
-- ============================================
-- FUNCTIONS (Optional - for business logic)
-- ============================================
-- Function: Get upcoming interviews
CREATE OR REPLACE FUNCTION get_upcoming_interviews(days_ahead INTEGER DEFAULT 7) RETURNS TABLE (
        interview_id UUID,
        candidate_name VARCHAR,
        job_title VARCHAR,
        scheduled_at TIMESTAMP WITH TIME ZONE,
        interview_type VARCHAR,
        location VARCHAR
    ) AS $$ BEGIN RETURN QUERY
SELECT i.id,
    u.first_name || ' ' || u.last_name AS candidate_name,
    j.title AS job_title,
    i.scheduled_at,
    i.interview_type,
    i.location
FROM interviews i
    JOIN applications a ON i.application_id = a.id
    JOIN users u ON a.candidate_id = u.id
    JOIN jobs j ON a.job_id = j.id
WHERE i.status = 'SCHEDULED'
    AND i.scheduled_at BETWEEN CURRENT_TIMESTAMP
    AND CURRENT_TIMESTAMP + (days_ahead || ' days')::INTERVAL
ORDER BY i.scheduled_at;
END;
$$ LANGUAGE plpgsql;
-- Function: Get application statistics
CREATE OR REPLACE FUNCTION get_application_stats(job_id_param UUID DEFAULT NULL) RETURNS TABLE (
        total_applications BIGINT,
        pending_count BIGINT,
        screening_count BIGINT,
        interview_count BIGINT,
        offer_count BIGINT,
        accepted_count BIGINT,
        rejected_count BIGINT,
        avg_ai_score NUMERIC
    ) AS $$ BEGIN RETURN QUERY
SELECT COUNT(*) AS total_applications,
    COUNT(*) FILTER (
        WHERE status = 'PENDING'
    ) AS pending_count,
    COUNT(*) FILTER (
        WHERE status = 'SCREENING'
    ) AS screening_count,
    COUNT(*) FILTER (
        WHERE status = 'INTERVIEW'
    ) AS interview_count,
    COUNT(*) FILTER (
        WHERE status = 'OFFER'
    ) AS offer_count,
    COUNT(*) FILTER (
        WHERE status = 'ACCEPTED'
    ) AS accepted_count,
    COUNT(*) FILTER (
        WHERE status = 'REJECTED'
    ) AS rejected_count,
    AVG(ai_score) AS avg_ai_score
FROM applications
WHERE (
        job_id_param IS NULL
        OR job_id = job_id_param
    );
END;
$$ LANGUAGE plpgsql;
-- ============================================
-- COMMENTS (Documentation)
-- ============================================
COMMENT ON TABLE users IS 'Người dùng hệ thống (Admin, Recruiter, Interviewer, Candidate)';
COMMENT ON TABLE jobs IS 'Vị trí tuyển dụng';
COMMENT ON TABLE applications IS 'Hồ sơ ứng tuyển';
COMMENT ON TABLE interviews IS 'Lịch phỏng vấn';
COMMENT ON TABLE interview_panels IS 'Hội đồng phỏng vấn';
COMMENT ON TABLE recruitment_results IS 'Kết quả tuyển dụng cuối cùng';
COMMENT ON TABLE notifications IS 'Thông báo hệ thống';
COMMENT ON TABLE recruitment_processes IS 'Quy trình tuyển dụng';
COMMENT ON TABLE process_steps IS 'Các bước trong quy trình tuyển dụng';
-- ============================================
-- END OF SCHEMA
-- ============================================