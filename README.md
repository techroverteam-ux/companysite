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

| Role | Can do |
| --- | --- |
| Owner | Everything, including adding owners and deleting projects |
| Manager | All projects, create projects, assign tasks to anyone, team reports with cost, leads, website content |
| Team member | Only projects they are on; create tasks for themselves, move their tasks, log their own time |

**Workspace screens**
- **My Work** — my open tasks (overdue / this week / later), start-stop timer, quick time entry, recent activity; managers also see team workload vs weekly capacity.
- **Task Board** — Kanban (To do → In progress → Code review → QA → Done) with drag and drop, filters, list view. Each task has assignees, priority, due date, estimate, labels, a GitHub/Figma link, time log and discussion.
- **Projects** — client, team, lead, budget hours, progress and hours used vs budget.
- **Timesheets** — weekly grid per person, add/edit entries, and reports by member / project / day with CSV export (managers see cost from hourly rates).
- **Staff & Roles** — add people, set role, hourly cost and weekly capacity, reset passwords, deactivate.
- **Inquiries & Leads / Meetings** — every website form submission (stored in MongoDB) with status, owner and notes.

Website content (services, portfolio, reviews, team bios) is still edited from the JSON files in `/data`.

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