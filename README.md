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

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Admin Panel

Access the admin panel at `/admin/dashboard` to manage:
- Services and pricing
- Portfolio projects
- Client reviews
- Website settings

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

- Input validation
- XSS protection
- CSRF protection
- Secure headers

## 📞 Support

For technical support or customization requests:
- Email: hello@techrover.co.in
- Website: https://techrover.co.in

## 📄 License

© 2025 Techrover. All rights reserved.