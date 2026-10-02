# Techrover Website

A modern, responsive website for Techrover - a global technology solutions provider specializing in AI, ERP, Web Development, and Digital Marketing services.

## 🚀 Features

- **Next.js 15** with App Router
- **Responsive Design** with Tailwind CSS
- **Component-driven Architecture** with ShadCN/UI
- **Framer Motion Animations**
- **Admin Panel** for content management
- **SEO Optimized** with Next SEO
- **TypeScript** for type safety
- **JSON-based Data Management**

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, ShadCN/UI
- **Animations**: Framer Motion
- **Data**: Local JSON files
- **Deployment**: Vercel

## 📁 Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel
│   ├── api/               # API routes
│   ├── services/          # Services page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── home/             # Home page components
│   ├── navbar/           # Navigation
│   └── footer/           # Footer
├── data/                 # JSON data files
│   ├── home.json
│   ├── services.json
│   ├── portfolio.json
│   └── reviews.json
└── lib/                  # Utility functions
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set environment variables** — copy `.env.example` to `.env.local` and fill in
   `MONGODB_URI`, `AUTH_SECRET`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` (see comments in the file).

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Admin Panel & Team Workspace

Log in at `/admin/login`. The first time, use `ADMIN_EMAIL` / `ADMIN_PASSWORD` from the environment —
that creates the **owner** account. Then add your team under **Staff & Roles**.
Data lives in **MongoDB**; uploaded files live in **Vercel Blob**. All settings are listed in `.env.example`.

| Role | Can do |
| --- | --- |
| Owner | Everything, including adding owners, deleting projects and leads |
| Manager | All projects, assign work, approve leave, leads, clients, proposals, invoices, reviews, reports with cost |
| Team member | Only projects they are on; their own tasks, time, attendance and leave |

**Staff**
- **My Work** — check in with today's plan, my tasks (overdue / this week / later), timer, quick time entry; managers see team workload.
- **Task Board** — Kanban with drag and drop. Tasks are numbered `TR-12`; mention that in a commit or PR and it shows on the task (GitHub webhook).
- **Timesheets** — weekly grid and reports (by member, project, day; cost for managers; CSV).
- **Attendance & Leave** — check-in/out with plan and summary, team grid, leave requests and approvals.
- **Notifications** — bell in the top bar: assignments, mentions (`@Name` in comments), approvals, client actions, payments.
- **Staff & Roles** — accounts, roles, hourly cost, weekly capacity, password resets.

**Client workflow** (Lead → Proposal → Onboarding → Development → QA & UAT → Delivery → Review)
- **Inquiries & Leads** — every website form; follow-up dates; *Convert & propose* creates the client and a proposal.
- **Proposals** — line items, discount, GST, payment milestones; a private link (`/p/…`) lets the client accept online.
  Acceptance creates the project, its milestones and the advance invoice.
- **Projects** — stage, health, value, onboarding checklist, milestones (client approves at `/portal/…`),
  change requests (estimate → client approves → task), invoices, files (Vercel Blob uploads or links), client links.
- **Invoices** — GST invoices per milestone, printable view (`/admin/invoices/<id>`), Razorpay payment links, mark paid.
- **Client portal** `/portal/<token>` — progress, milestone approvals, change requests, invoices with *Pay now*, file uploads, delivery sign-off.
- **Client Reviews** — one-time review links (`/review/<token>`, 14 days). 4–5★ wait for approval, then show on `/reviews`
  marked verified (with schema.org rating data); 3★ or less go privately to the owner.

Website content (services, portfolio, team bios) is still edited from the JSON files in `/data`.

## 🎨 Design System

### Colors
- **Primary**: #004AAD (Royal Blue)
- **Secondary**: #00C6AE (Teal)
- **Background**: #F8FAFC

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, gradient text effects
- **Body**: Regular weight, optimized readability

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🔧 Customization

### Adding New Services
1. Edit `data/services.json`
2. Add service object with required fields
3. Update will reflect automatically

### Modifying Components
- All components are in `/components` directory
- Use TypeScript for type safety
- Follow existing patterns for consistency

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Configure domain: techrover.co.in
3. Deploy automatically on push

### Manual Build
```bash
npm run build
npm start
```

## 📈 SEO Features

- Optimized meta tags
- Open Graph support
- Twitter Cards
- Structured data
- Sitemap generation
- Fast loading times

## 🔒 Security

- Staff log in with their own email and a bcrypt-hashed password; sessions are signed, httpOnly cookies (`AUTH_SECRET`)
- `/admin` pages and `/api/admin/*` require a session (see `proxy.ts`); every API also re-checks the user and role in the database
- Public forms are validated (zod), rate-limited per IP and have a honeypot field
- Only an allow-list of content files is readable through `/api/data/*`; form submissions are never stored in the repo
- Secure headers on admin pages

## 📞 Support

For technical support or customization requests:
- Email: hello@techrover.co.in
- Website: https://techrover.co.in

## 📄 License

© 2025 Techrover. All rights reserved.