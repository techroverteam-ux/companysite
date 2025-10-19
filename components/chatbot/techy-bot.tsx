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
        const langData = getCurrentLanguageData()
        addBotMessage(`👋 ${langData.welcomeMessage} I'm here to help you!`)
        setHasGreeted(true)
      }, 2000) // 2 second delay after page load
      
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
      if (input.includes('ai') || input.includes('artificial intelligence')) {
        return `Our AI services: Customer Support Agents (₹299/month), Sales Assistant (₹499/month), Data Processing (₹399/month), Content Creation (₹199/month). Custom AI development starts at ₹4,17,000. We use Python, TensorFlow, OpenAI. Recent AI projects: TechCorp USA chatbot, FinanceFlow automation. Want to see our AI calculator?`
      }
      if (input.includes('web') || input.includes('website')) {
        return `Web Development services: Custom websites (₹2,50,000+), E-commerce platforms, Progressive Web Apps, API development. Technologies: Next.js, React, TypeScript, Tailwind CSS. Recent projects: Digital Solutions UK (₹51,65,000), MarketHub E-commerce (8 months, 12 developers). Timeline: 4-12 weeks. Want a quote?`
      }
      if (input.includes('erp') || input.includes('enterprise')) {
        return `ERP Systems (₹12,50,000+): Custom ERP development, CRM integration, inventory management, financial systems. Technologies: React, Node.js, PostgreSQL, AWS. Success story: SecureLife Insurance ERP (₹70,83,000) - improved efficiency by 60%. Timeline: 8-24 weeks. Need ERP consultation?`
      }
    }
    
    if (category === 'team') {
      const teamInfo = Array.isArray(teamData) ? teamData.slice(0, 4).map((member: any) => `${member.name} (${member.role})`).join(', ') : 'Our team'
      return `Our leadership team: ${teamInfo}. Total 20+ professionals with 100+ certifications. Ashok Verma (Founder, IIT Delhi, Forbes 30 Under 30), Rahul Singh (CTO, BITS Pilani, Tech Innovation Award 2022). We've managed 500+ projects, 50+ global clients, 99% satisfaction rate.`
    }
    
    if (category === 'pricing') {
      const services = Array.isArray(servicesData) ? servicesData.map((s: any) => `${s.title}: ${s.startingPrice}`).join(', ') : 'Our services'
      return `Current pricing: ${services}. Hourly rates: Senior Developer ₹3,500/hr, Project Manager ₹2,000/hr, Designer ₹2,500/hr, QA ₹1,800/hr. Use our calculator at /calculator for instant estimates with team allocation and timeline!`
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
        const clients = Array.isArray(clientsData) ? clientsData.slice(0, 3).map((c: any) => `${c.name} (${c.country}, ${c.totalValue})`).join(', ') : 'Various clients'
        return `Our recent clients: ${clients}. We serve 50+ global clients across 15+ countries with 99% satisfaction. Industries: Technology, Fintech, Healthcare, Insurance, Manufacturing. Want to see our portfolio?`
      }
      
      if (input.includes('portfolio') || input.includes('project')) {
        const projects = Array.isArray(portfolioData) ? portfolioData.slice(0, 2).map((p: any) => `${p.title} (${p.industry}, ${p.projectDuration})`).join(', ') : 'Various projects'
        return `Recent projects: ${projects}. We've completed 500+ projects including Insurance ERP, AI Chatbot Platform, E-commerce Marketplace, Hospital Management System. All with 5-star client reviews. Want to see detailed case studies?`
      }
      
      if (input.includes('calculator') || input.includes('estimate')) {
        return `Use our cost calculator at /calculator! Get instant estimates with: Real-time pricing based on complexity, Team allocation with actual member names, Timeline calculation (2-16 weeks), Hourly breakdowns, Downloadable quotes. It includes all our services: AI (₹4,17,000+), ERP (₹12,50,000+), Web (₹2,50,000+), Marketing (₹1,67,000+), Branding (₹1,25,000+).`
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
        addHumanMessage("Thanks for your question! Our team will get back to you shortly. You can also call us at +91 98765 43210 for immediate assistance.")
      } else {
        const response = getBotResponse(input)
        addBotMessage(response)
      }
    }, 1500)
  }

  const handleTransferToHuman = () => {
    setIsHumanMode(true)
    addHumanMessage("Hello! I'm connecting you with our human expert. How can I assist you today?")
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
        className="fixed bottom-6 right-6 z-50"
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
              className="absolute bottom-20 -left-80 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-3 w-72"
            >
              <div className="text-sm text-white">
                {messages[0]?.text}
              </div>
              <div className="absolute -bottom-2 right-8 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-purple-600" />
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
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border z-50 flex flex-col"
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
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-gray-100 text-gray-800'
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
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
              {uploadedFiles.length > 0 && (
                <div className="mb-3 p-2 bg-blue-50 rounded text-xs">
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
                          currentLanguage === code ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
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