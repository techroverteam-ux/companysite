'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bot, Send, X, User, Phone } from 'lucide-react'
import chatbotData from '@/data/chatbot.json'
import servicesData from '@/data/services.json'
import portfolioData from '@/data/portfolio.json'
import teamData from '@/data/team.json'
import clientsData from '@/data/clients.json'
import calculatorData from '@/data/calculator.json'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot' | 'human'
  timestamp: Date
}

export function TechyBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isHumanMode, setIsHumanMode] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [hasGreeted, setHasGreeted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getCurrentLanguageData = () => {
    return chatbotData.languages[currentLanguage as keyof typeof chatbotData.languages]
  }

  const detectLanguage = (text: string) => {
    const lowerText = text.toLowerCase()
    
    // Hindi detection
    if (/[ऀ-ॿ]/.test(text) || ['namaste', 'namaskar', 'kya hal', 'kaise ho'].some(word => lowerText.includes(word))) {
      return 'hi'
    }
    
    // Spanish detection  
    if (['hola', 'buenos dias', 'buenas tardes', 'como estas', 'gracias'].some(word => lowerText.includes(word))) {
      return 'es'
    }
    
    // French detection
    if (['bonjour', 'salut', 'bonsoir', 'comment allez', 'merci'].some(word => lowerText.includes(word))) {
      return 'fr'
    }
    
    return 'en'
  }

  // Auto-greet when component mounts (user lands on site)
  useEffect(() => {
    if (!hasGreeted) {
      const timer = setTimeout(() => {
        addBotMessage(`👋 Hey there! I'm here to help you with any questions about our services.`)
        setHasGreeted(true)
        
        // Auto-hide greeting bubble after 5 seconds
        setTimeout(() => {
          setHasGreeted(false)
        }, 5000)
      }, 3000) // 3 second delay after page load
      
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (isOpen && messages.length === 0 && hasGreeted) {
      const langData = getCurrentLanguageData()
      addBotMessage(langData.welcomeMessage)
    }
  }, [isOpen, currentLanguage, hasGreeted])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addBotMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date()
    }])
  }

  const addHumanMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      sender: 'human',
      timestamp: new Date()
    }])
  }

  const getIntelligentResponse = (userInput: string) => {
    const input = userInput.toLowerCase()
    
    // Contact form assistance
    if (input.includes('contact') && (input.includes('form') || input.includes('submit') || input.includes('send'))) {
      return `I can help you submit a contact form! Let me gather your details:

📝 **Contact Form Assistance**
I'll help you fill out our contact form with:
• Your name and email
• Company details
• Service you're interested in
• Project description

🚀 **Quick Submit Options:**
• Tell me your details and I'll help format them
• Or visit our contact page: /contact

What's your name and which service interests you?`
    }
    
    // Schedule form assistance
    if (input.includes('schedule') && (input.includes('call') || input.includes('meeting') || input.includes('appointment'))) {
      return `Perfect! I can help you schedule a consultation call:

📅 **Schedule Meeting Assistance**
Available meeting types:
• Free Consultation (30 min)
• Technical Discussion (45 min)
• Project Planning (60 min)

⏰ **Available Times:**
• Mon-Fri: 9:00 AM - 6:00 PM IST
• Same day or future dates

🎯 **I can help you:**
• Choose the right meeting type
• Find available time slots
• Submit your booking details

Visit: /schedule or tell me your preferred date/time!`
    }
    
    // Stone factory specific response
    if (input.includes('stone') && (input.includes('factory') || input.includes('website') || input.includes('build'))) {
      return `Perfect! For a stone factory website, here's what I recommend:

🏢 **Stone Factory Website Package**
• Product Catalog with high-res stone images
• Inventory Management System  
• Quote Request & Inquiry Forms
• Customer Portal & Order Tracking
• Mobile-responsive Design
• SEO Optimization for local search

💰 **Cost Estimate: ₹4,50,000 - ₹7,00,000**
🕰️ **Timeline: 8-12 weeks**
👥 **Team: Project Manager (Ashok Verma), Senior Developer (Rahul Singh), Designer (Neha Patel)**

Similar project: Radhika Machine Tools - 40% increase in inquiries!

Want detailed breakdown? Use our calculator: /calculator
Ready to start? Schedule call: /schedule`
    }
    
    // Website building general response
    if ((input.includes('website') || input.includes('web')) && (input.includes('build') || input.includes('create') || input.includes('develop'))) {
      return `Great! I can help you build a professional website. Here's our approach:

🌐 **Website Development Services:**
• Custom Design & Development
• Mobile-Responsive Design
• CMS Integration
• SEO Optimization
• Performance Optimization

💰 **Pricing by Complexity:**
• Simple Website: ₹2,50,000 (4-6 weeks)
• Medium Website: ₹4,00,000 (6-8 weeks) 
• Complex Website: ₹6,50,000 (8-12 weeks)

👥 **Your Team:**
• Project Manager: ₹2,000/hr
• Senior Developer: ₹3,500/hr
• UI/UX Designer: ₹2,500/hr

Get instant estimate: /calculator
Schedule consultation: /schedule

What type of website do you need?`
    }
    
    return null
  }

  const getEnhancedResponse = (category: string, userInput: string) => {
    const input = userInput.toLowerCase()
    
    // Check for intelligent responses first
    const intelligentResponse = getIntelligentResponse(userInput)
    if (intelligentResponse) return intelligentResponse
    
    // Enhanced responses with real data
    if (category === 'services') {
      if (input.includes('ai') || input.includes('artificial intelligence') || input.includes('machine learning') || input.includes('chatbot')) {
        return `🤖 **AI Development Services by Techrover**

**Our AI Solutions:**
• Custom AI Chatbots (₹25,000+)
• Machine Learning Models
• Natural Language Processing
• Computer Vision Solutions
• Predictive Analytics
• AI Integration & Deployment

**Technologies:** Python, TensorFlow, PyTorch, OpenAI, Hugging Face, AWS AI

**AI Team Expert:** Yashashvi Parihar (AI Developer, IIT Jodhpur, TensorFlow Certified)

**Recent AI Projects:**
• Healthcare AI Chatbot - 40% faster patient queries
• Manufacturing Image Recognition - Reduced defects by 35%
• Custom ML Pipeline - 40% processing time reduction

**Pricing:** Starting ₹25,000 | Custom solutions ₹4,17,000+
**Timeline:** 4-12 weeks

Want AI consultation? Visit /schedule or use /calculator for instant estimate!`
      }
      if (input.includes('web') || input.includes('website')) {
        return `🌐 **Web Development by Techrover**

**Services:**
• Custom Website Development (₹15,000+)
• E-commerce Platforms
• Progressive Web Apps
• API Development
• Database Design
• Performance Optimization

**Technologies:** Next.js, React, TypeScript, Tailwind CSS, Node.js, Vercel

**Team:** Arjun Nagar (Full Stack, 7+ years, React Certified), Naresh Kansara (Backend Expert)

**Recent Projects:**
• Digital Solutions UK - ₹51,65,000 (8 months)
• MarketHub E-commerce - 12 developers
• TechCorp Website - 99% performance score

**Timeline:** 4-12 weeks | **Satisfaction:** 99%

Ready to build? Contact us at /contact or get estimate at /calculator!`
      }
      if (input.includes('erp') || input.includes('enterprise')) {
        return `🏢 **ERP Systems by Techrover**

**Complete ERP Solutions:**
• Custom ERP Development (₹75,000+)
• CRM Integration
• Inventory Management
• Financial Management
• HR Management System
• Supply Chain Management

**Technologies:** React, Node.js, PostgreSQL, MongoDB, AWS, Docker

**Success Story:** SecureLife Insurance ERP (₹70,83,000) - 60% efficiency improvement

**Team:** Full-stack developers + DevOps (Saksham Tolambia - AWS Certified)

**Timeline:** 8-24 weeks
**ROI:** Average 300% within 12 months

Need ERP consultation? Schedule call: /schedule`
      }
      if (input.includes('shopify') || input.includes('ecommerce') || input.includes('e-commerce')) {
        return `🛒 **Shopify Development by Techrover**

**Shopify Services:**
• Custom Shopify Store Development (₹5,000+)
• WordPress to Shopify Migration
• Theme Customization
• App Integration & Development
• Payment Gateway Setup
• SEO & Performance Optimization

**Expert:** Naresh Kansara (Shopify Partner Developer, 5+ years)

**Technologies:** Shopify Liquid, JavaScript, CSS3, HTML5, Shopify APIs

**Success:** 30+ e-commerce stores, 100% client satisfaction

**Migration Special:** WordPress to Shopify in 2-4 weeks

Start your store: /contact or calculate cost: /calculator`
      }
    }
    
    if (category === 'team') {
      return `👥 **Techrover Team Excellence**

**Leadership:**
• Navdeep Bhati - Founder & CEO (6+ years, MBA IIM Bangalore, AWS Certified)
• Yogesh Sharma - UI/UX Designer (5+ years, NIFT Delhi, Google UX Certified)
• Yashshvi Singh - Digital Marketing (4+ years, MBA Delhi University)

**Technical Experts:**
• Yashashvi Parihar - AI Developer (IIT Jodhpur, TensorFlow Certified)
• Arjun Nagar - Full Stack (7+ years, React/Node.js Expert)
• Naresh Kansara - Shopify/WordPress (5+ years, Shopify Partner)
• Saksham Tolambia - DevOps (AWS Solutions Architect)
• Dushyan Singh - International Client Manager (MBA International Business)

**Stats:** 500+ projects, 50+ global clients, 99% satisfaction, 15+ countries

Meet our team: /team`
    }
    
    if (category === 'pricing') {
      return `💰 **Techrover Pricing Guide**

**Service Pricing:**
• AI Development: ₹25,000+
• ERP Systems: ₹75,000+
• Web Development: ₹15,000+
• Mobile Apps: ₹35,000+
• Cloud Solutions: ₹20,000+
• Digital Marketing: ₹10,000+
• Branding & Design: ₹8,000+
• Shopify Development: ₹5,000+

**Hourly Rates:**
• Senior Developer: ₹3,500/hr
• AI Specialist: ₹4,000/hr
• Project Manager: ₹2,000/hr
• Designer: ₹2,500/hr
• DevOps Engineer: ₹3,000/hr

**Get Instant Quote:** /calculator
**Custom Pricing:** /contact
**Schedule Discussion:** /schedule`
    }
    
    return null
  }

  const getBotResponse = (userInput: string) => {
    // Detect and switch language if needed
    const detectedLang = detectLanguage(userInput)
    if (detectedLang !== currentLanguage) {
      setCurrentLanguage(detectedLang)
    }
    
    const langData = getCurrentLanguageData()
    const input = userInput.toLowerCase()
    
    for (const [category, keywords] of Object.entries(langData.keywords)) {
      if (keywords.some(keyword => input.includes(keyword))) {
        // Try enhanced response first (only for English)
        if (currentLanguage === 'en') {
          const enhancedResponse = getEnhancedResponse(category, userInput)
          if (enhancedResponse) return enhancedResponse
        }
        
        // Fallback to standard responses
        const responses = langData.responses[category as keyof typeof langData.responses]
        if (Array.isArray(responses)) {
          return responses[Math.floor(Math.random() * responses.length)]
        }
      }
    }
    
    // Special queries with real data
    if (currentLanguage === 'en') {
      // Intelligent response first
      const intelligentResponse = getIntelligentResponse(userInput)
      if (intelligentResponse) return intelligentResponse
      
      if (input.includes('client') || input.includes('customer')) {
        return `🌍 **Techrover Global Clients**

**Client Portfolio:**
• TechCorp (USA) - AI Automation Platform
• Digital Solutions (UK) - ₹51,65,000 Web Project
• SecureLife Insurance - ₹70,83,000 ERP System
• MarketHub - E-commerce Marketplace
• FinanceFlow - AI-powered Analytics
• MediCare - Healthcare Management System

**Global Reach:**
• 50+ clients across 15+ countries
• Industries: Technology, Fintech, Healthcare, Insurance, Manufacturing
• 99% client satisfaction rate
• 500+ successful projects delivered

**Headquarters:** Mumbai, India
**International Offices:** New York, London, Toronto

See our work: /portfolio | Join our clients: /contact`
      }
      
      if (input.includes('portfolio') || input.includes('project')) {
        return `🏆 **Techrover Project Portfolio**

**Featured Projects:**
• **SecureLife Insurance ERP** - ₹70,83,000, 60% efficiency boost
• **AI Healthcare Chatbot** - 40% faster patient query resolution
• **Manufacturing Vision AI** - 35% defect reduction
• **E-commerce Platform** - 1M+ users, scalable architecture
• **Digital Solutions UK** - ₹51,65,000, 8-month delivery

**Project Stats:**
• 500+ projects completed
• 15+ countries served
• 99% client satisfaction
• 5-star average rating

**Industries:** Healthcare, Insurance, Manufacturing, E-commerce, Fintech, Education

**Technologies:** AI/ML, React, Node.js, AWS, Shopify, WordPress

Explore portfolio: /portfolio | Start your project: /contact`
      }
      
      if (input.includes('calculator') || input.includes('estimate') || input.includes('cost') || input.includes('price')) {
        return `🧮 **Techrover Cost Calculator - Get Instant Estimates!**

**How It Works:**
1️⃣ Select your service (AI, Web, ERP, Mobile, etc.)
2️⃣ Choose complexity (Simple/Medium/Complex)
3️⃣ Add optional features
4️⃣ Get instant cost & timeline estimate

**What You Get:**
✅ **Total Project Cost** - Accurate pricing
✅ **Team Allocation** - Real team member names
✅ **Timeline Estimate** - Weeks/months breakdown
✅ **Hourly Breakdown** - Role-wise cost distribution
✅ **Downloadable Quote** - PDF/JSON export

**Service Ranges:**
• 🤖 AI Development: ₹25,000 - ₹4,17,000+
• 🏢 ERP Systems: ₹75,000 - ₹12,50,000+
• 🌐 Web Development: ₹15,000 - ₹2,50,000+
• 📱 Mobile Apps: ₹35,000 - ₹3,00,000+
• 🛒 Shopify Development: ₹5,000 - ₹50,000+
• 📊 Digital Marketing: ₹10,000 - ₹1,67,000+

**Try Now:** /calculator
**Need Help?** I can guide you through it!`
      }
      
      // Admin and management queries
      if (input.includes('admin') || input.includes('dashboard') || input.includes('management')) {
        return `🔧 **Techrover Admin & Management**

**Admin Dashboard Features:**
• 📊 Project Management & Tracking
• 👥 Team Performance Analytics
• 💰 Financial Reports & Billing
• 📈 Client Progress Monitoring
• 🎯 Goal Setting & KPI Tracking

**Management Services:**
• **Project Management** - Dedicated PMs for each project
• **Quality Assurance** - Multi-stage testing & review
• **Client Communication** - Regular updates & meetings
• **Resource Planning** - Optimal team allocation
• **Risk Management** - Proactive issue resolution

**Admin Access:** /admin/dashboard
**Management Team:**
• Navdeep Bhati - CEO & Project Oversight
• Dushyan Singh - International Client Manager
• Arjun Nagar - Technical Lead & Architecture

**Need admin assistance?** Contact our management team!`
      }
      
      // Form submission assistance
      if (input.includes('submit') || input.includes('send message') || input.includes('contact form')) {
        return `📝 **Techrover Form Assistance**

**Available Forms:**
• **Contact Form** (/contact) - Project inquiries & general questions
• **Schedule Call** (/schedule) - Free consultation booking
• **Hire Team** (/hire-team) - Dedicated team requests
• **Cost Calculator** (/calculator) - Instant project estimates

**I can help you:**
✅ Fill out form details correctly
✅ Choose the right service category
✅ Format your project requirements
✅ Submit forms on your behalf
✅ Connect you with the right team member

**Quick Actions:**
• Say "Help me contact" for contact form
• Say "Schedule a call" for consultation booking
• Say "Get estimate" for cost calculator

**Response Time:** Within 2 hours during business hours (9 AM - 6 PM IST)

How can I help you get started?`
      }
      
      // Company information
      if (input.includes('about') || input.includes('company') || input.includes('techrover')) {
        return `🚀 **About Techrover**

**Company Overview:**
• Founded: 2019 (5+ years of excellence)
• From freelancing to global technology partner
• 500+ projects delivered across 15+ countries
• Headquarters: Mumbai, India
• International offices: New York, London, Toronto

**Mission:** Empower businesses with cutting-edge technology solutions
**Vision:** Most trusted global technology partner for AI-powered solutions

**Core Values:**
• Innovation - Future-ready solutions
• Quality - Meticulous attention to detail
• Transparency - Clear communication
• Global Mindset - Culturally relevant solutions

**Achievements:**
• ISO 9001:2015 Certified
• Google Partner Certification
• AWS Solution Provider
• 99% client satisfaction rate

Learn more: /about | Meet our team: /team`
      }
    }
    
    setTimeout(() => {
      setIsHumanMode(true)
      const humanMsg = currentLanguage === 'hi' ? 
        "नमस्ते! मैं टेकरोवर की टीम का सदस्य हूं। मैं आपकी मदद करूंगा।" :
        currentLanguage === 'es' ? 
        "¡Hola! Soy un miembro del equipo de Techrover. Te ayudaré con tu pregunta." :
        currentLanguage === 'fr' ?
        "Salut! Je suis un membre de l'équipe Techrover. Je vais vous aider." :
        "Hi! I'm a human team member from Techrover. I'll help you with your question."
      addHumanMessage(humanMsg)
    }, 2000)
    
    return langData.responses.fallback[0]
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      if (isHumanMode) {
        // Check if user wants specific assistance
        if (input.includes('calculator') || input.includes('estimate') || input.includes('cost') || input.includes('price')) {
          addHumanMessage("Perfect! Our cost calculator at /calculator gives instant estimates. Select your service, complexity, and features to get: Total cost, timeline, team allocation with real member names, and downloadable quotes. Services range from ₹5,000 (Shopify) to ₹12,50,000+ (ERP). Want me to guide you through it?")
        } else if (input.includes('admin') || input.includes('dashboard') || input.includes('management')) {
          addHumanMessage("I can help with admin access! Our dashboard at /admin provides project tracking, team analytics, financial reports, and client management. For admin assistance, contact Navdeep Bhati (CEO) or Dushyan Singh (Client Manager). Need specific admin help or project management support?")
        } else if (input.includes('ai') || input.includes('artificial intelligence') || input.includes('machine learning')) {
          addHumanMessage("Great! I can help with AI development. We offer custom AI chatbots (₹25,000+), ML models, NLP, computer vision. Our AI expert Yashashvi Parihar (IIT Jodhpur) leads projects. Use /calculator for instant AI project estimates or /schedule for consultation.")
        } else {
          addHumanMessage("Thanks for your question! Our team will get back to you shortly. You can also call us at +91 98765 43210 for immediate assistance.")
        }
      } else {
        const response = getBotResponse(input)
        addBotMessage(response)
      }
    }, 1500)
  }

  const handleTransferToHuman = () => {
    setIsHumanMode(true)
    addHumanMessage("Hello! I'm from Techrover's expert team. I can help with: 🧮 Cost calculator guidance, 🤖 AI development projects, 🏢 ERP system planning, 🌐 Web development quotes, 📝 Form submissions, 📅 Scheduling consultations, or 🔧 Admin assistance. What interests you most?")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter(file => file.size <= 1024 * 1024) // 1MB limit
    
    if (validFiles.length !== files.length) {
      alert('Some files exceed 1MB limit and were not uploaded.')
    }
    
    setUploadedFiles(prev => [...prev, ...validFiles])
    
    if (validFiles.length > 0) {
      const fileNames = validFiles.map(f => f.name).join(', ')
      addBotMessage(`Files uploaded successfully: ${fileNames}. I can see your requirements better now. How can I help with your project?`)
    }
  }

  const clearChat = () => {
    setMessages([])
    setIsHumanMode(false)
    setUploadedFiles([])
    const langData = getCurrentLanguageData()
    addBotMessage(langData.welcomeMessage)
  }

  return (
    <>
      <motion.div
        className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      >
        <div className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full gradient-bg shadow-lg hover:shadow-xl transition-all duration-300"
            style={{ display: isOpen ? 'none' : 'flex' }}
          >
            <Bot className="h-8 w-8 text-white" />
          </Button>
          
          {/* Active notification bubble */}
          {hasGreeted && !isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center"
            >
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </motion.div>
          )}
          
          {/* Greeting message bubble */}
          {hasGreeted && !isOpen && messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className="absolute bottom-20 right-0 w-64 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-3 shadow-lg sm:w-72"
            >
              <div className="text-sm text-white">
                {messages[0]?.text}
              </div>
              <div className="absolute -bottom-2 right-6 h-0 w-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-purple-600" />
            </motion.div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-4 right-4 z-50 flex h-[78vh] w-[calc(100vw-2rem)] max-w-[24rem] flex-col rounded-lg border border-border bg-background shadow-2xl sm:bottom-6 sm:right-6 sm:h-[500px]"
          >
            <div className="gradient-bg text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  {isHumanMode ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-semibold">{isHumanMode ? 'Human Expert' : chatbotData.botName}</h3>
                  <p className="text-xs text-white/80">
                    {isHumanMode ? 'Team Member' : 'AI Assistant'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-primary text-white'
                        : message.sender === 'human'
                        ? 'border border-green-200 bg-green-100 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-100'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-gray-100 p-3 dark:bg-slate-800">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-slate-400"></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-slate-400" style={{ animationDelay: '0.1s' }}></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-slate-400" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-4 dark:border-slate-700">
              {uploadedFiles.length > 0 && (
                <div className="mb-3 rounded bg-blue-50 p-2 text-xs dark:bg-blue-950/60 dark:text-blue-100">
                  Files: {uploadedFiles.map(f => f.name).join(', ')}
                </div>
              )}
              
              {!isHumanMode && (
                <>
                  <div className="flex gap-1 mb-2">
                    {Object.entries(chatbotData.languages).map(([code, lang]) => (
                      <button
                        key={code}
                        onClick={() => setCurrentLanguage(code)}
                        className={`px-2 py-1 text-xs rounded ${
                          currentLanguage === code ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex gap-1 mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = '/contact'}
                      className="flex-1 text-xs"
                    >
                      📝 Contact
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = '/schedule'}
                      className="flex-1 text-xs"
                    >
                      📅 Schedule
                    </Button>
                  </div>
                  
                  <div className="flex gap-2 mb-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTransferToHuman}
                      className="flex-1 text-xs"
                    >
                      <Phone className="mr-1 h-3 w-3" />
                      {currentLanguage === 'hi' ? 'विशेषज्ञ' :
                       currentLanguage === 'es' ? 'Experto' :
                       currentLanguage === 'fr' ? 'Expert' :
                       'Human'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 text-xs"
                    >
                      📁 Upload
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearChat}
                      className="flex-1 text-xs"
                    >
                      🗑️ Clear
                    </Button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </>
              )}
              
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1"
                />
                <Button onClick={handleSend} size="sm" variant="gradient">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}