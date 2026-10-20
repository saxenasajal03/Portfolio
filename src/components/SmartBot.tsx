import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  ExternalLink,
  Download,
  Mail,
  ChevronRight,
  Briefcase,
  Award,
  Layers,
  FileText,
  Terminal,
  Zap,
  Phone,
  MessageSquare,
  Compass,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ActionButton {
  label: string;
  icon?: 'download' | 'linkedin' | 'mail' | 'scroll';
  target?: string;
  onClick?: () => void;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  title?: string;
  text: string;
  timestamp: string;
  actions?: ActionButton[];
  category?: 'experience' | 'projects' | 'skills' | 'certs' | 'contact' | 'general' | 'greeting';
  tags?: string[];
}

interface ResponseVariant {
  title: string;
  category: Message['category'];
  reply: string;
  actions?: ActionButton[];
}

// Conversation Counter to rotate responses
let queryCounter = 0;

const GREETING_VARIANTS: ResponseVariant[] = [
  {
    title: 'Hello & Welcome',
    category: 'greeting',
    reply:
      "Hello! Great to connect with you. I'm Sajal's **Portfolio Copilot**.\n\nI can provide verified insights on his:\n• **Urban Company Role** (Central SBC Quality Team & Escalations)\n• **Core Projects** (Elexoplus ERP, ConnectX WebRTC, Plant Leaf CNN)\n• **Certified AI Expertise** (OCI 2025 GenAI Professional)\n• **Direct Contact Coordinates** & Resume download\n\nWhat would you like to explore first?",
    actions: [
      { label: 'Urban Company Role', icon: 'scroll', target: '#experience' },
      { label: 'Explore Projects', icon: 'scroll', target: '#projects' },
      { label: 'Download Resume', icon: 'download' },
    ],
  },
  {
    title: 'Greetings & Welcome',
    category: 'greeting',
    reply:
      "Hey there! Glad you stopped by Sajal Saxena's interactive 3D portfolio.\n\nSajal is an engineer driving **operational quality and SLA telemetry at Urban Company** while building scalable full-stack web applications and machine learning systems.\n\nFeel free to ask me anything about his technical stack, key accomplishments, or contact details!",
    actions: [
      { label: 'Technical Stack', icon: 'scroll', target: '#skills' },
      { label: 'Urban Company SLA', icon: 'scroll', target: '#experience' },
      { label: 'Contact Sajal', icon: 'mail', target: 'mailto:sajalsaxenagola@gmail.com' },
    ],
  },
  {
    title: 'Namaste & Welcome',
    category: 'greeting',
    reply:
      "Namaste! Sajal Saxena ke 3D portfolio mein aapka swagat hai.\n\nMain aapko Sajal ke:\n• **Urban Company experience** (SBC Quality & partner attendance >80%)\n• **Live full-stack projects** (Elexoplus ERP, ConnectX WebRTC)\n• **Oracle GenAI Professional Certification**\n\nke baare mein detailed insights de sakta hoon. Aap kya dekhna chahenge?",
    actions: [
      { label: 'Urban Company Experience', icon: 'scroll', target: '#experience' },
      { label: 'View Key Projects', icon: 'scroll', target: '#projects' },
      { label: 'Connect on LinkedIn', icon: 'linkedin' },
    ],
  },
];

const POLITE_VARIANTS: ResponseVariant[] = [
  {
    title: 'Glad to Help',
    category: 'general',
    reply:
      "You're very welcome! If you're reviewing candidates for full-stack engineering, AI systems, or operations analytics roles, Sajal is actively open to new high-impact opportunities.\n\nWould you like his direct contact coordinates or official resume?",
    actions: [
      { label: 'Email Directly', icon: 'mail', target: 'mailto:sajalsaxenagola@gmail.com' },
      { label: 'Download Resume PDF', icon: 'download' },
      { label: 'Connect on LinkedIn', icon: 'linkedin' },
    ],
  },
  {
    title: 'At Your Service',
    category: 'general',
    reply:
      "Happy to assist! Feel free to inspect any of his project deep dives, from the **Elexoplus dual-portal ERP** to the **ConnectX WebRTC engine**, or test the 3D controls in the hero section.",
    actions: [
      { label: 'Inspect Projects', icon: 'scroll', target: '#projects' },
      { label: 'Technical Skills', icon: 'scroll', target: '#skills' },
    ],
  },
];

const URBAN_COMPANY_VARIANTS: ResponseVariant[] = [
  {
    title: 'Urban Company · Operational Leadership & Escalations',
    category: 'experience',
    reply:
      "**Business Development Associate – Central SBC Quality Team**\n*HQ: Ghitorni, New Delhi (Apr 2026 – Present)*\n\n• **Tier 1 & 2 Escalations**: Leads rigorous root-cause investigations resolving high-severity partner bottlenecks across North India cohorts.\n• **SLA Benchmark Execution**: Sustains Real-Time (RT) attendance thresholds consistently exceeding 80%.\n• **Continuous Quality Improvements**: Partners with cross-functional leadership on SLA compliance auditing and partner performance recovery.",
    actions: [
      { label: 'View Experience Section', icon: 'scroll', target: '#experience' },
      { label: 'Email Sajal', icon: 'mail', target: 'mailto:sajalsaxenagola@gmail.com' },
    ],
  },
  {
    title: 'Urban Company · Telemetry & Automation Pilot',
    category: 'experience',
    reply:
      "**Central SBC Quality Telemetry & Analytics**\n\n• **Jarvis Analytics & SQL**: Leverages internal Jarvis telemetry dashboards alongside structured SQL and advanced Excel modeling for cohort tracking.\n• **AI Handholding Pilot**: Actively contributes to cutting-edge internal pilot initiatives applying AI-assisted workflows to accelerate partner diagnostic checks.\n• **Partner Training**: Coordinates partner upgrades training modules to boost first-time resolution and service satisfaction.",
    actions: [
      { label: 'View Full Timeline', icon: 'scroll', target: '#experience' },
      { label: 'Download Resume PDF', icon: 'download' },
    ],
  },
  {
    title: 'Career Trajectory Overview',
    category: 'experience',
    reply:
      "**Complete Professional Engineering Timeline**:\n\n1. **Urban Company** *(Apr 2026 – Present)*: Central SBC Quality, Tier 1/2 Escalations, RT Attendance >80%\n2. **themrgamer.com** *(Jan 2025 – Mar 2025)*: Web Developer, optimized database schemas achieving reported 30% reduction in API latency\n3. **Feynn Labs** *(Aug 2024 – Oct 2024)*: AI/ML Intern, trained predictive models using Python, TensorFlow & automated ETL pipelines\n4. **CollegeDesire** *(Jan 2024 – Jun 2024)*: Web Developer, query optimization & technical SEO driving +25% organic search visibility",
    actions: [
      { label: 'Inspect Full Experience', icon: 'scroll', target: '#experience' },
      { label: 'Connect on LinkedIn', icon: 'linkedin' },
    ],
  },
];

const PROJECTS_VARIANTS: ResponseVariant[] = [
  {
    title: 'Core Engineering Systems',
    category: 'projects',
    reply:
      "**1. Elexoplus Commerce & ERP Suite** *(React, Node, Express, MySQL)*\nDual portal featuring D2C Storefront (elexoplus.com) and B2B Wholesale Portal (b2b.elexoplus.com) with role-based access control (RBAC) and automated inventory pipelines.\n\n**2. ConnectX Real-Time Video** *(React, WebRTC, Socket.io, MongoDB)*\nEncrypted peer-to-peer low-latency WebRTC media streams with tested concurrent room handling.\n\n**3. Plant Leaf Disease CNN** *(Python, TensorFlow/Keras, OpenCV)*\nDeep learning foliar classifier delivering over 95% validation accuracy across complex botanical datasets.\n\n**4. Electricity Bill Management** *(Java Swing, SQL Server)*\nNormalized relational billing ledger with ACID transactional consistency.",
    actions: [
      { label: 'Inspect Projects in Detail', icon: 'scroll', target: '#projects' },
      { label: 'Download Resume PDF', icon: 'download' },
    ],
  },
  {
    title: 'Deep Dive: Elexoplus Enterprise Suite',
    category: 'projects',
    reply:
      "**Elexoplus Commerce & ERP Architecture** *(React.js, Node.js, Express, MySQL)*:\n\n• **Dual Portal Deployment**: Seamless integration between direct retail buyers and high-volume B2B wholesale buyers.\n• **Role-Based Access Control**: Granular permission hierarchies securing pricing tiers, billing ledgers, and inventory manifests.\n• **Database Indexing**: Relational MySQL schema optimized with composite keys on order lookup tables for fast checkout execution.",
    actions: [
      { label: 'Explore Projects Section', icon: 'scroll', target: '#projects' },
      { label: 'Connect with Sajal', icon: 'mail', target: 'mailto:sajalsaxenagola@gmail.com' },
    ],
  },
  {
    title: 'Deep Dive: ConnectX & AI Systems',
    category: 'projects',
    reply:
      "**Real-Time & Neural Network Architectures**:\n\n• **ConnectX WebRTC Engine**: Sub-100ms media transmission with Socket.io signaling, ICE renegotiation, and dynamic device switching.\n• **Plant Leaf Pathology CNN**: Convolutional neural net with Batch Normalization and Dropout layers, achieving >95% accuracy for agricultural foliar diagnosis.\n• **Electricity Ledger**: ACID-compliant Java desktop ledger backed by Microsoft SQL Server stored procedures.",
    actions: [
      { label: 'Inspect Projects Section', icon: 'scroll', target: '#projects' },
      { label: 'View Technical Skills', icon: 'scroll', target: '#skills' },
    ],
  },
];

const SKILLS_VARIANTS: ResponseVariant[] = [
  {
    title: 'Technical Stack by Engineering Layer',
    category: 'skills',
    reply:
      "• **Frontend & 3D**: React.js, TypeScript, JavaScript (ES6+), Three.js / WebGL, Tailwind CSS, HTML5/CSS3\n• **Backend & Real-Time**: Node.js, Express.js, PHP 8, REST APIs, WebRTC, Socket.io\n• **Databases & Query Tuning**: MySQL, MongoDB, Microsoft SQL Server, DB2, Stored Procedures & Triggers\n• **AI & Computer Vision**: TensorFlow, Keras, OpenCV, Python, NumPy, Pandas, ETL Automation\n• **Operational Tooling**: Jarvis Telemetry, Root-Cause Analysis, SLA Monitoring, Functional Testing",
    actions: [
      { label: 'View Technical Matrix', icon: 'scroll', target: '#skills' },
      { label: 'Download Resume PDF', icon: 'download' },
    ],
  },
  {
    title: 'Core Engineering Competencies & Strengths',
    category: 'skills',
    reply:
      "Sajal's core engineering strengths combine **rigorous algorithmic thinking** with **production system tuning**:\n\n• **Full-Stack Fluency**: Seamless bridging from reactive TypeScript/React frontends to high-throughput Node/MySQL backends.\n• **Data & Performance**: Experience reducing API latency by 30% through index optimization and profiling.\n• **Cross-Functional Operations**: Track record of diagnosing multi-stakeholder operational bottlenecks at Urban Company under strict SLA thresholds.",
    actions: [
      { label: 'Explore Skills Section', icon: 'scroll', target: '#skills' },
      { label: 'Email Sajal', icon: 'mail', target: 'mailto:sajalsaxenagola@gmail.com' },
    ],
  },
];

const CERTS_VARIANTS: ResponseVariant[] = [
  {
    title: 'Verified Certifications & Accreditations',
    category: 'certs',
    reply:
      "🏆 **Oracle Cloud Infrastructure (OCI) 2025 Certified Generative AI Professional**\n• Comprehensive mastery of LLM architectures, RAG pipelines, fine-tuning, and enterprise deployment on OCI.\n\n• **HackerRank**: Python & SQL Certifications\n• **Infosys & ICT Academy**: Java Enterprise Certification\n• **Tata Consultancy Services (TCS)**: ESG Virtual Experience\n• **Lakshagriha Hackathon 1.0 (DBUU)**: Top Finalist\n• **Flipkart GRiD 6.0**: Software Development Track Participant",
    actions: [
      { label: 'View Certifications', icon: 'scroll', target: '#skills' },
      { label: 'Connect on LinkedIn', icon: 'linkedin' },
    ],
  },
];

const CONTACT_VARIANTS: ResponseVariant[] = [
  {
    title: 'Direct Contact Coordinates',
    category: 'contact',
    reply:
      "• **Email**: sajalsaxenagola@gmail.com\n• **Phone / WhatsApp**: +91 88408 10386\n• **LinkedIn**: linkedin.com/in/sajal-saxena-cse\n• **Current Base**: Ghitorni, New Delhi\n• **Permanent Base**: Gola Gokarannath, Uttar Pradesh (PIN: 262802)\n\nSajal is actively available for Full-Stack Software Engineering, AI Systems, and Technical Operations roles.",
    actions: [
      { label: 'Email Directly', icon: 'mail', target: 'mailto:sajalsaxenagola@gmail.com' },
      { label: 'Connect on LinkedIn', icon: 'linkedin' },
      { label: 'Download Resume PDF', icon: 'download' },
    ],
  },
];

const FALLBACK_VARIANTS: ResponseVariant[] = [
  {
    title: 'Portfolio Index Guide',
    category: 'general',
    reply:
      "I can provide verified information on Sajal's engineering background:\n\n• **Urban Company Role**: Central SBC Quality Team & partner attendance >80%\n• **Featured Projects**: Elexoplus ERP, ConnectX WebRTC, Plant Leaf CNN\n• **Tech Stack**: React, TypeScript, Node, SQL, Three.js, Python\n• **Accreditations**: OCI 2025 GenAI Professional, HackerRank\n• **Direct Contact**: Email, Phone, or Resume download\n\nWhich area would you like to explore?",
    actions: [
      { label: 'Urban Company Role', icon: 'scroll', target: '#experience' },
      { label: 'Featured Projects', icon: 'scroll', target: '#projects' },
      { label: 'Contact Coordinates', icon: 'mail', target: 'mailto:sajalsaxenagola@gmail.com' },
    ],
  },
  {
    title: 'Portfolio Directory',
    category: 'general',
    reply:
      "Here are the most frequently requested areas in Sajal's portfolio:\n\n1. **Operations & Quality**: How Sajal tracks SLAs and partner adherence at Urban Company.\n2. **Full-Stack Systems**: Details on the Elexoplus dual-portal B2B/D2C architecture.\n3. **Generative AI**: Information on his 2025 Oracle Cloud Generative AI Professional certification.\n4. **Get in Touch**: Direct phone, email, or LinkedIn connection.",
    actions: [
      { label: 'Explore Projects', icon: 'scroll', target: '#projects' },
      { label: 'View Skills', icon: 'scroll', target: '#skills' },
      { label: 'Email Directly', icon: 'mail', target: 'mailto:sajalsaxenagola@gmail.com' },
    ],
  },
  {
    title: 'Copilot Assistance',
    category: 'general',
    reply:
      "I'm here to answer any specific questions about Sajal Saxena! Try asking:\n• *'Tell me about his Urban Company role'*\n• *'What is Elexoplus ERP?'*\n• *'What certifications does he hold?'*\n• *'How can I get in touch with him?'*",
    actions: [
      { label: 'Urban Company Experience', icon: 'scroll', target: '#experience' },
      { label: 'Technical Stack', icon: 'scroll', target: '#skills' },
      { label: 'Download Resume PDF', icon: 'download' },
    ],
  },
];

function queryCopilot(input: string): ResponseVariant {
  const clean = input.toLowerCase().trim();
  queryCounter += 1;

  // 1. GREETINGS & INTRODUCTIONS
  if (/^(hi|hello|hey|hola|namaste|kem cho|kya haal|kaise ho|ram ram|good morning|good evening|good afternoon|sup|yo|greetings|welcome|bonjour)\b/i.test(clean) || clean === 'hi' || clean === 'hello' || clean === 'hey') {
    return GREETING_VARIANTS[queryCounter % GREETING_VARIANTS.length];
  }

  // 2. POLITENESS & THANKS
  if (/^(thanks|thank you|shukriya|dhanyawad|dhanyavad|nice|cool|awesome|great|well done|good job|superb)\b/i.test(clean)) {
    return POLITE_VARIANTS[queryCounter % POLITE_VARIANTS.length];
  }

  // 3. WHO IS SAJAL / ABOUT ME
  if (/who (is|are) (sajal|you)|about sajal|introduce|bio|background|profile|summary|overview/i.test(clean)) {
    return {
      title: 'About Sajal Saxena',
      category: 'general',
      reply:
        "Sajal Saxena is a **Full-Stack Software Engineer** and **Business Development Associate** at Urban Company's Central SBC Quality Team in New Delhi.\n\nHe holds a **B.Tech. in Computer Science and Engineering** (2021–2025) and is an **Oracle Cloud Infrastructure 2025 Certified Generative AI Professional**.\n\nHe specializes in building high-performance web systems (React, Node, MySQL, WebRTC) and applying quantitative telemetry and root-cause analysis to optimize operations.",
      actions: [
        { label: 'Urban Company Role', icon: 'scroll', target: '#experience' },
        { label: 'Key Projects', icon: 'scroll', target: '#projects' },
        { label: 'Download Resume', icon: 'download' },
      ],
    };
  }

  // 4. URBAN COMPANY / EXPERIENCE
  if (/(urban|company|job|work|role|escalation|sla|jarvis|sbc|quality|operations|experience|career)/i.test(clean)) {
    return URBAN_COMPANY_VARIANTS[queryCounter % URBAN_COMPANY_VARIANTS.length];
  }

  // 5. SPECIFIC PROJECTS: ELEXOPLUS
  if (/(elexoplus|erp|commerce|b2b|d2c|storefront|wholesale)/i.test(clean)) {
    return PROJECTS_VARIANTS[1];
  }

  // 6. SPECIFIC PROJECTS: CONNECTX / WEBRTC
  if (/(connectx|webrtc|video|chat|socket|calling|stream)/i.test(clean)) {
    return PROJECTS_VARIANTS[2];
  }

  // 7. SPECIFIC PROJECTS: PLANT LEAF / CNN / AI
  if (/(plant|leaf|disease|cnn|classifier|foliar|cv|opencv)/i.test(clean)) {
    return {
      title: 'Plant Leaf Disease CNN Classifier',
      category: 'projects',
      reply:
        "**Plant Leaf Disease Identifier (CNN)** *(Python, TensorFlow/Keras, OpenCV)*:\n\n• **High Precision Pathology**: Built an automated computer vision classifier delivering over 95% validation accuracy across foliar disease datasets.\n• **Data Augmentation**: Applied OpenCV preprocessing pipelines (Gaussian filtering, normalization, morphological rotation) to strengthen feature extraction.\n• **Lightweight Deployment**: Exported optimized inference weights integrated into a responsive web dashboard.",
      actions: [
        { label: 'Inspect Projects', icon: 'scroll', target: '#projects' },
        { label: 'Technical Stack', icon: 'scroll', target: '#skills' },
      ],
    };
  }

  // 8. GENERAL PROJECTS
  if (/(project|projects|built|portfolio|app|apps|software|build)/i.test(clean)) {
    return PROJECTS_VARIANTS[queryCounter % PROJECTS_VARIANTS.length];
  }

  // 9. CERTIFICATIONS & ACCREDITATIONS
  if (/(cert|certification|oracle|oci|genai|generative|ai cert|hackerrank|infosys|tcs|hackathon|flipkart)/i.test(clean)) {
    return CERTS_VARIANTS[0];
  }

  // 10. TECHNICAL SKILLS & STACK
  if (/(skill|skills|stack|tech|languages|react|node|python|sql|mysql|typescript|three|webgl|database)/i.test(clean)) {
    return SKILLS_VARIANTS[queryCounter % SKILLS_VARIANTS.length];
  }

  // 11. EDUCATION & UNIVERSITY
  if (/(education|college|degree|university|btech|school|cbse|saarthi|nep|dehradun|dbuu)/i.test(clean)) {
    return {
      title: 'Academic Foundation & Honors',
      category: 'general',
      reply:
        "🎓 **Bachelor of Technology (B.Tech.) in Computer Science & Engineering** (2021 – 2025)\n• Dev Bhoomi Uttarakhand University (DBUU), Dehradun\n• Rigorous coursework in Algorithms, DBMS, Operating Systems, Networks, and AI\n\n🏫 **Children’s Academy Senior Secondary School, Gola**\n• Class XII (PCM) & Class X (Science) – CBSE Board\n\n🏛️ **UGC NEP Saarthi Ambassador**\n• Appointed student representative by UGC for National Education Policy student outreach.",
      actions: [
        { label: 'Academic Section', icon: 'scroll', target: '#education' },
        { label: 'Download Resume PDF', icon: 'download' },
      ],
    };
  }

  // 12. CONTACT / HIRE / EMAIL / PHONE
  if (/(contact|email|phone|call|hire|reach|resume|pdf|cv|linkedin|address|location|gola|delhi|whatsapp)/i.test(clean)) {
    return CONTACT_VARIANTS[0];
  }

  // 13. DYNAMIC FALLBACK
  return FALLBACK_VARIANTS[queryCounter % FALLBACK_VARIANTS.length];
}

export const SmartBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      title: 'Copilot',
      text: "Hello! Welcome to Sajal Saxena's portfolio. I can answer questions about his role at Urban Company, key engineering systems, AI certifications, or direct contact details.",
      timestamp: 'Just now',
      category: 'general',
      actions: [
        { label: 'Urban Company Role' },
        { label: 'Key Projects' },
        { label: 'Generative AI Cert' },
        { label: 'Contact Coordinates' },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleActionClick = (action: ActionButton) => {
    soundEngine.playTick();
    if (action.icon === 'download') {
      window.open('/assets/resource/SAJAL_SAXENA_RESUME_3b56c39e.pdf', '_blank');
      return;
    }
    if (action.icon === 'linkedin') {
      window.open('https://www.linkedin.com/in/sajal-saxena-cse/', '_blank');
      return;
    }
    if (action.icon === 'mail') {
      window.location.href = action.target || 'mailto:sajalsaxenagola@gmail.com';
      return;
    }
    if (action.icon === 'scroll' && action.target) {
      const el = document.querySelector(action.target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
      return;
    }

    handleSend(action.label);
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    soundEngine.playTick();
    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    let replyText = '';
    let category: Message['category'] = 'general';
    let title = 'Copilot';
    let actions: ActionButton[] | undefined = undefined;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7500);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.reply && !data.fallback) {
          replyText = data.reply;
          const localMatch = queryCopilot(query);
          actions = localMatch.actions;
          category = localMatch.category;
          title = localMatch.title || 'Copilot';
        }
      }
    } catch {
      // Graceful fallback to local engine if static host or network error
    }

    if (!replyText) {
      const localResult = queryCopilot(query);
      replyText = localResult.reply;
      title = localResult.title;
      category = localResult.category;
      actions = localResult.actions;
    }

    const botMsg: Message = {
      id: String(Date.now() + 1),
      sender: 'bot',
      title,
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category,
      actions,
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
    soundEngine.playTick();
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 font-mono">
      {/* Bot Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[92vw] sm:w-[440px] h-[560px] max-h-[84vh] bg-[#120d09]/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(255,154,60,0.15)] flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="px-4 py-3 bg-[#18110b] border-b border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff9a3c] via-[#e66a1f] to-[#ff9a3c] text-[#130e09] font-black flex items-center justify-center font-mono text-xs shadow-md">
                  <Terminal size={16} className="text-[#130e09]" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#18110b]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wider flex items-center gap-2 font-mono">
                  COPILOT
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#ff9a3c]/20 text-[#ff9a3c] border border-[#ff9a3c]/30 font-normal">
                    v2.5
                  </span>
                </h4>
                <p className="text-[10px] text-neutral-400 font-sans">
                  Sajal Saxena Portfolio Guide · Online
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playTick();
                setIsOpen(false);
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close console"
            >
              <X size={16} />
            </button>
          </div>

          {/* Quick Questions Strip */}
          <div className="px-3 py-2 bg-black/50 border-b border-white/10 flex items-center gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
            <Zap size={11} className="text-[#ff9a3c] shrink-0 ml-1 animate-pulse" />
            {[
              'Urban Company role',
              'Key projects',
              'AI & OCI Cert',
              'Contact & Resume',
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#ff9a3c]/20 hover:border-[#ff9a3c]/50 text-neutral-300 hover:text-white border border-white/10 whitespace-nowrap transition-colors shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-[#ff9a3c]/15 border border-[#ff9a3c]/40 flex items-center justify-center text-[#ff9a3c] shrink-0 mt-0.5 shadow-sm">
                    <Sparkles size={13} />
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-xl p-3.5 leading-relaxed space-y-2.5 ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-[#ff9a3c] to-[#e66a1f] text-[#130e09] font-medium rounded-tr-none shadow-lg'
                      : 'bg-[#18110b]/90 border border-white/15 hover:border-white/25 text-neutral-200 rounded-tl-none shadow-md backdrop-blur-sm'
                  }`}
                >
                  {/* Bot Card Title & Tag Badges */}
                  {m.sender === 'bot' && m.title && (
                    <div className="border-b border-white/10 pb-2 mb-1 flex items-center justify-between gap-2">
                      <span className="font-bold text-[#ff9a3c] text-xs font-mono tracking-tight flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff9a3c]" />
                        {m.title}
                      </span>
                      <span className="text-[9px] font-mono text-neutral-500 uppercase">
                        {m.category || 'INFO'}
                      </span>
                    </div>
                  )}

                  {/* Formatted Content */}
                  <div className="text-xs space-y-2">
                    {m.text.split('\n').map((line, lIdx) => {
                      if (line.startsWith('### ')) {
                        return (
                          <div
                            key={lIdx}
                            className="font-bold text-[#ff9a3c] text-xs font-mono uppercase tracking-wider pb-1 border-b border-white/10 mt-1 mb-1 flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff9a3c]" />
                            <span>{line.replace('### ', '')}</span>
                          </div>
                        );
                      }
                      if (line.startsWith('• ') || line.startsWith('* ')) {
                        return (
                          <div key={lIdx} className="flex items-start gap-2 pl-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff9a3c] shrink-0 mt-1.5" />
                            <span className="text-neutral-200 leading-relaxed">
                              {line.replace(/^[•*]\s+/, '')}
                            </span>
                          </div>
                        );
                      }
                      if (/^\d+\.\s/.test(line)) {
                        return (
                          <div key={lIdx} className="p-2 rounded bg-white/5 border border-white/10 text-neutral-200 my-1">
                            <span className="font-semibold text-white">{line}</span>
                          </div>
                        );
                      }
                      return (
                        <p key={lIdx} className={line.trim() === '' ? 'h-1' : ''}>
                          {line}
                        </p>
                      );
                    })}
                  </div>

                  {/* Interactive Action Cards */}
                  {m.actions && m.actions.length > 0 && (
                    <div className="pt-2 border-t border-white/10 flex flex-wrap gap-1.5 font-mono">
                      {m.actions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => handleActionClick(act)}
                          className="px-2.5 py-1.5 rounded-md bg-white/10 hover:bg-[#ff9a3c] hover:text-[#130e09] text-[10px] text-neutral-200 transition-all flex items-center gap-1.5 border border-white/15 hover:border-[#ff9a3c] shadow-sm font-medium"
                        >
                          {act.icon === 'download' && <Download size={11} />}
                          {act.icon === 'linkedin' && <ExternalLink size={11} />}
                          {act.icon === 'mail' && <Mail size={11} />}
                          {act.icon === 'scroll' && <ChevronRight size={11} className="text-[#ff9a3c]" />}
                          <span>{act.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <span
                    className={`block text-[9px] mt-1 text-right font-mono ${
                      m.sender === 'user' ? 'text-[#130e09]/80 font-bold' : 'text-neutral-500'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-neutral-400 italic font-mono pl-9">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff9a3c] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff9a3c] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff9a3c] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] ml-1">Analyzing portfolio data...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#18110b] border-t border-white/15 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g., Urban Company, projects, stack)..."
              className="flex-1 bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff9a3c] transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 rounded-lg bg-[#ff9a3c] text-[#130e09] hover:bg-[#ffb066] disabled:opacity-40 disabled:hover:bg-[#ff9a3c] transition-colors font-bold shadow-md"
              title="Send message"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        onClick={() => {
          soundEngine.playTick();
          setIsOpen((prev) => !prev);
        }}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#1c130d] to-[#261910] hover:from-[#261910] hover:to-[#332115] border border-white/20 hover:border-[#ff9a3c] text-white shadow-[0_10px_25px_rgba(0,0,0,0.8),0_0_20px_rgba(255,154,60,0.25)] transition-all duration-300 active:scale-95"
      >
        <div className="relative">
          <div className="w-7 h-7 rounded-full bg-[#ff9a3c] text-[#130e09] flex items-center justify-center font-bold text-xs shadow-md group-hover:scale-110 transition-transform">
            <MessageSquare size={14} />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black animate-pulse" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1">
            COPILOT
            <Sparkles size={11} className="text-[#ff9a3c]" />
          </span>
          <span className="text-[10px] text-neutral-400 font-sans">Ask anything</span>
        </div>
      </button>
    </div>
  );
};
