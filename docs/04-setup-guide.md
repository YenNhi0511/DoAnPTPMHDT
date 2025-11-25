# Hướng dẫn Setup và Bắt đầu Project

## 📋 Prerequisites (Yêu cầu cài đặt)

### 1. Cài đặt phần mềm cần thiết:

- **Node.js** v18+ : https://nodejs.org/
- **PostgreSQL** v15+ : https://www.postgresql.org/download/
- **Git** : https://git-scm.com/
- **VS Code** (khuyến nghị) : https://code.visualstudio.com/

### 2. Tài khoản dịch vụ (miễn phí):

- **Vercel** : https://vercel.com/ (hosting)
- **Neon** : https://neon.tech/ (PostgreSQL cloud)
- **Google AI Studio** : https://makersuite.google.com/app/apikey (Gemini API key - free)
- **Resend** : https://resend.com/ (email service)

---

## 🚀 Các bước setup

### Bước 1: Clone hoặc tạo project mới

```cmd
cd d:\DoAnPTPMHDT

# Kiểm tra nếu chưa có .git
git init
```

### Bước 2: Init Next.js project

```cmd
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
```

Chọn options:

- ✅ TypeScript
- ✅ ESLint
- ✅ Tailwind CSS
- ✅ App Router
- ❌ src/ directory
- ✅ Import alias (@/\*)

### Bước 3: Cài đặt dependencies

```cmd
# Core dependencies
npm install @prisma/client next-auth@beta bcryptjs zod
npm install @google/generative-ai pdf-parse mammoth
npm install bullmq ioredis

# Dev dependencies
npm install -D prisma @types/bcryptjs @types/node

# UI libraries
npm install react-hook-form @hookform/resolvers
npm install recharts react-big-calendar date-fns
npm install jspdf lucide-react
```

### Bước 4: Setup Prisma

File `prisma/schema.prisma` đã có sẵn. Giờ init database:

```cmd
# Generate Prisma Client
npx prisma generate

# Tạo .env file
echo DATABASE_URL="postgresql://user:password@localhost:5432/recruitment_db" > .env
echo NEXTAUTH_SECRET="your-secret-key-change-this" >> .env
echo NEXTAUTH_URL="http://localhost:3000" >> .env
echo GEMINI_API_KEY="your-gemini-api-key" >> .env
```

**Nếu dùng Neon (cloud PostgreSQL):**

1. Đăng ký tại https://neon.tech/
2. Tạo project mới
3. Copy connection string vào `.env`:
   ```
   DATABASE_URL="postgresql://user:password@ep-xxx.region.neon.tech/neondb?sslmode=require"
   ```

### Bước 5: Chạy migration đầu tiên

```cmd
npx prisma migrate dev --name init
```

Lệnh này sẽ:

- Tạo database schema
- Tạo migration files
- Generate Prisma Client

### Bước 6: Seed data (optional - test data)

Tạo file `prisma/seed.ts`:

```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Tạo admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@recruitment.com",
      password: hashedPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  });

  console.log("✅ Created admin user:", admin.email);

  // Tạo sample job
  const job = await prisma.job.create({
    data: {
      title: "Senior Java Developer",
      description: "We are looking for an experienced Java developer...",
      requirements:
        "- 5+ years Java\n- Spring Boot experience\n- MySQL/PostgreSQL",
      salary: "1000-2000 USD",
      location: "Ha Noi",
      employmentType: "FULLTIME",
      status: "OPEN",
      deadline: new Date("2025-12-31"),
      createdById: admin.id,
    },
  });

  console.log("✅ Created sample job:", job.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Chạy seed:

```cmd
npx tsx prisma/seed.ts
```

### Bước 7: Tạo cấu trúc thư mục cơ bản

```cmd
mkdir app\api\auth app\api\jobs app\api\applications
mkdir app\(dashboard) app\(public)
mkdir lib components types
```

Cấu trúc folder:

```
d:\DoAnPTPMHDT\
├── app/
│   ├── api/              # API Routes
│   │   ├── auth/
│   │   ├── jobs/
│   │   ├── applications/
│   │   └── interviews/
│   ├── (public)/         # Public pages (jobs listing)
│   ├── (dashboard)/      # Protected pages (admin, recruiter)
│   └── layout.tsx
├── components/           # React components
├── lib/                  # Utilities, Prisma client
├── prisma/
│   └── schema.prisma
├── docs/                 # Documentation (đã có)
└── .env
```

### Bước 8: Tạo Prisma Client singleton

Tạo file `lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### Bước 9: Chạy development server

```cmd
npm run dev
```

Mở browser: http://localhost:3000

---

## 🗂️ File structure dự kiến (sau khi hoàn thiện)

```
d:\DoAnPTPMHDT\
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts
│   │   │   ├── register/route.ts
│   │   │   └── login/route.ts
│   │   ├── jobs/
│   │   │   ├── route.ts                 # GET, POST /api/jobs
│   │   │   └── [id]/
│   │   │       ├── route.ts             # GET, PATCH, DELETE
│   │   │       ├── apply/route.ts       # POST /api/jobs/:id/apply
│   │   │       └── screen-batch/route.ts
│   │   ├── applications/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── screen/route.ts
│   │   ├── interviews/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── feedback/route.ts
│   │   ├── results/route.ts
│   │   ├── notifications/route.ts
│   │   └── reports/
│   │       ├── dashboard/route.ts
│   │       └── job/[id]/route.ts
│   ├── (public)/
│   │   ├── page.tsx                     # Homepage (job listing)
│   │   ├── jobs/[id]/page.tsx           # Job detail + apply
│   │   └── login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                   # Sidebar layout
│   │   ├── dashboard/page.tsx           # Overview
│   │   ├── jobs/
│   │   │   ├── page.tsx                 # Job list
│   │   │   ├── new/page.tsx             # Create job
│   │   │   └── [id]/page.tsx            # Job detail + applications
│   │   ├── applications/
│   │   │   ├── page.tsx                 # All applications
│   │   │   └── [id]/page.tsx            # Application detail
│   │   ├── interviews/
│   │   │   ├── page.tsx                 # Calendar view
│   │   │   └── [id]/page.tsx            # Interview detail
│   │   ├── reports/page.tsx
│   │   └── settings/page.tsx
│   ├── layout.tsx                       # Root layout
│   └── globals.css
├── components/
│   ├── ui/                              # shadcn/ui components
│   ├── forms/
│   │   ├── JobForm.tsx
│   │   ├── ApplicationForm.tsx
│   │   └── InterviewForm.tsx
│   ├── tables/
│   │   ├── ApplicationsTable.tsx
│   │   └── InterviewsTable.tsx
│   ├── charts/
│   │   └── DashboardCharts.tsx
│   └── Navbar.tsx
├── lib/
│   ├── prisma.ts                        # Prisma singleton
│   ├── auth.ts                          # NextAuth config
│   ├── validators.ts                    # Zod schemas
│   ├── ai/
│   │   ├── gemini.ts                    # Gemini AI client
│   │   └── screening.ts                 # CV screening logic
│   ├── pdf/
│   │   ├── parser.ts                    # Parse PDF/DOCX
│   │   └── generator.ts                 # Generate offer letter
│   ├── queue/
│   │   ├── queue.ts                     # BullMQ setup
│   │   └── workers.ts                   # Background workers
│   └── utils.ts                         # Helper functions
├── types/
│   └── index.ts                         # TypeScript types
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── docs/
│   ├── 01-database-design.md
│   ├── 02-system-architecture.md
│   ├── 03-api-endpoints.md
│   └── 04-setup-guide.md (file này)
├── .env
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔧 VS Code Extensions (khuyến nghị)

1. **Prisma** (prisma.prisma)
2. **ESLint** (dbaeumer.vscode-eslint)
3. **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
4. **Error Lens** (usernamehw.errorlens)
5. **GitHub Copilot** (github.copilot)

---

## 📝 Git setup

```cmd
# Tạo .gitignore
echo node_modules/ > .gitignore
echo .next/ >> .gitignore
echo .env >> .gitignore
echo .env.local >> .gitignore
echo *.log >> .gitignore

# First commit
git add .
git commit -m "Initial setup: Next.js + Prisma + Database schema"

# Link to GitHub (nếu có repo)
git remote add origin https://github.com/your-username/recruitment-system.git
git push -u origin main
```

---

## 🎯 Next Steps (các bước tiếp theo)

1. ✅ Setup project (hoàn tất)
2. ⏳ Implement Authentication (NextAuth.js)
3. ⏳ Tạo Job Management module
4. ⏳ Tạo Application module + CV upload
5. ⏳ Tích hợp AI screening (Gemini)
6. ⏳ Tạo Interview scheduling
7. ⏳ Tạo Reports & Dashboard
8. ⏳ Deploy lên Vercel

---

## 🐛 Troubleshooting

### Lỗi: `Cannot find module '@prisma/client'`

```cmd
npx prisma generate
```

### Lỗi: Database connection failed

- Kiểm tra PostgreSQL đã chạy: `pg_isready`
- Kiểm tra DATABASE_URL trong `.env` đúng format
- Nếu dùng Neon, đảm bảo có `?sslmode=require`

### Lỗi: Port 3000 đã được sử dụng

```cmd
# Đổi port
$env:PORT=3001; npm run dev
```

---

## 📚 Tài liệu tham khảo

- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- NextAuth.js: https://next-auth.js.org/
- Gemini API: https://ai.google.dev/docs
- Tailwind CSS: https://tailwindcss.com/docs
