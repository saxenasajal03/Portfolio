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
  Terminal,
  Zap,
  Phone,
  MessageSquare,
  Compass,
  Key,
  Volume2,
  VolumeX,
  Languages,
  Mic,
  CheckCircle2
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { getAssetUrl } from '../utils/assets';

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
  textHindi?: string;
  timestamp: string;
  actions?: ActionButton[];
  category?: 'experience' | 'projects' | 'skills' | 'certs' | 'contact' | 'general' | 'greeting';
}

const SAJAL_SYSTEM_KNOWLEDGE = `
You are the official AI Assistant & Copilot for Sajal Saxena.
You speak both English and natural, polite Hindi (शुद्ध एवं सहज हिंदी) fluently.
If the user asks in Hindi or asks you to speak in Hindi, respond in fluent, grammatically perfect Hindi.

Sajal Saxena's Complete Resume & Portfolio Knowledge Base:
- Current Role: Business Development Associate – Central SBC Quality Team at Urban Company (Apr 2026 – Present, HQ: Ghitorni, New Delhi).
  - Resolves Tier 1 and Tier 2 operational bottlenecks and partner escalations through structured root-cause analysis (RCA).
  - Monitors partner performance, compliance, and service-level agreements (SLAs) using Jarvis SQL analytics and advanced Excel modeling.
  - Maintains cohort Real-Time (RT) attendance compliance exceeding 80%.
  - Leads Partner Upgrades Training and AI Handholding pilot initiatives.
- Past Experience:
  - themrgamer.com (Jan 2025 – Mar 2025): Web Developer (React.js, PHP 8, MySQL, cPanel). Optimized backend APIs and relational queries, slashing latency by 30%.
  - Feynn Labs (Aug 2024 – Oct 2024): AI/ML Intern (Python, TensorFlow, Pandas). Built ML models and automated ETL data validation workflows.
  - CollegeDesire (Jan 2024 – Jun 2024): Web Developer (React.js, PHP, MySQL, Technical SEO). Correlated with +25% organic visibility growth.
- Key Projects:
  1. Elexoplus Commerce & ERP Suite: Dual D2C Storefront (elexoplus.com) and B2B Wholesale Portal (b2b.elexoplus.com) with RBAC, inventory tracking, and checkout reconciliation (React.js, Node.js, Express, MySQL).
  2. ConnectX: Real-Time Chat & Video Calling using WebRTC mesh (<100ms latency) and Socket.io signaling (React.js, Node.js, MongoDB).
  3. Plant Leaf Disease Identifier: Deep learning CNN model in Python/TensorFlow/OpenCV with over 95% validation accuracy for foliar pathology.
  4. Electricity Bill Management System: Enterprise desktop billing software in Java Swing/AWT with SQL Server stored procedures and ACID consistency.
- Education:
  - B.Tech in Computer Science and Engineering (2021 – 2025) from Dev Bhoomi Uttarakhand University (DBUU), Dehradun.
  - Class XII (PCM) & Class X from Children’s Academy Senior Secondary School, Gola Gokarannath (PIN: 262802).
  - Appointed NEP Saarthi Ambassador by University Grants Commission (UGC).
- Certifications & Honors:
  - Oracle Cloud Infrastructure (OCI) 2025 Certified Generative AI Professional
  - HackerRank 5-Star Python & SQL Certifications
  - Infosys & ICT Academy Java Enterprise Certification
  - TCS ESG Virtual Experience Program
  - Finalist in Lakshagriha Hackathon 1.0 (DBUU)
  - Flipkart GRiD 6.0 Track Participant
- Contact Coordinates:
  - Email: sajalsaxenagola@gmail.com
  - Phone / WhatsApp: +91 88408 10386
  - LinkedIn: https://www.linkedin.com/in/sajal-saxena-cse/
  - Base: Ghitorni, New Delhi / Gola Gokarannath, Uttar Pradesh (PIN: 262802)
`;

export const SmartBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('sajal_gemini_api_key') || '');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKeyInput, setTempKeyInput] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'bot',
      title: 'नमस्ते & Welcome',
      text:
        "नमस्ते! I am Sajal's AI Copilot powered by Google AI Studio Gemini.\n\n" +
        "सजल सक्सेना के पोर्टफोलियो में आपका स्वागत है। मैं हिंदी और अंग्रेजी दोनों में सजल के प्रोजेक्ट्स, अर्बन कंपनी अनुभव और स्किल्स के बारे में विस्तार से बता सकता हूँ।\n\n" +
        "• **Urban Company Role** (Central SBC Quality, RT Attendance >80%)\n" +
        "• **Projects** (Elexoplus D2C/B2B ERP, ConnectX WebRTC, 95% Foliar CNN)\n" +
        "• **Certifications** (OCI 2025 GenAI Pro, HackerRank, Infosys)\n\n" +
        "आप मुझसे हिंदी या इंग्लिश में कुछ भी पूछ सकते हैं!",
      textHindi:
        "नमस्ते! मैं सजल सक्सेना का एआई कॉपायलट हूँ। आप मुझसे सजल के अर्बन कंपनी अनुभव, एलेक्सोप्लस ईआरपी प्रोजेक्ट्स, और ओरेकल जेन-एआई सर्टिफिकेशन के बारे में हिंदी में पूछ सकते हैं।",
      timestamp: 'Active',
      actions: [
        { label: 'Urban Company Role', icon: 'scroll', target: '#experience' },
        { label: '3D Cyber City', icon: 'scroll', target: '#metaverse-city' },
        { label: 'Download Resume', icon: 'download' },
      ],
      category: 'greeting',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Live Hindi / English Speech Synthesizer
  const speakText = (text: string, messageId: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (currentSpeakingId === messageId && isSpeaking) {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
      return;
    }

    // Clean markdown characters for crystal-clear natural speech
    const cleanSpeech = text
      .replace(/[#*`_~]/g, '')
      .replace(/\(https?:\/\/[^\)]+\)/g, '')
      .replace(/\[([^\]]+)\]/g, '$1')
      .replace(/•/g, ', ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);

    // Detect if text contains Hindi Devanagari characters
    const hasHindi = /[\u0900-\u097F]/.test(cleanSpeech);
    utterance.lang = hasHindi ? 'hi-IN' : 'en-US';
    utterance.rate = hasHindi ? 0.95 : 1.0;
    utterance.pitch = 1.0;

    // Pick best matching Hindi or natural voice if available
    const voices = window.speechSynthesis.getVoices();
    if (hasHindi) {
      const hindiVoice = voices.find((v) => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('hemant'));
      if (hindiVoice) utterance.voice = hindiVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakingId(messageId);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    }
  };

  const handleSaveApiKey = () => {
    const trimmed = tempKeyInput.trim();
    setApiKey(trimmed);
    localStorage.setItem('sajal_gemini_api_key', trimmed);
    setShowKeyModal(false);
    soundEngine.playResonance();
  };

  // Google AI Studio Gemini API Caller
  const callGoogleAIStudio = async (prompt: string): Promise<string | null> => {
    const key = apiKey || (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
    if (!key) return null;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SAJAL_SYSTEM_KNOWLEDGE }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600,
          },
        }),
      });

      if (!response.ok) return null;
      const data = await response.json();
      const generated = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return generated || null;
    } catch (err) {
      console.warn('Google AI Studio API call error:', err);
      return null;
    }
  };

  // High-accuracy fallback knowledge generator
  const getLocalKnowledgeReply = (q: string): { reply: string; title: string; actions?: ActionButton[] } => {
    const lq = q.toLowerCase();
    const isHindi = /[\u0900-\u097F]/.test(q) || lq.includes('hindi') || lq.includes('हिंदी') || lq.includes('kahan') || lq.includes('kaun');

    if (lq.includes('urban') || lq.includes('experience') || lq.includes('job') || lq.includes('काम') || lq.includes('अर्बन')) {
      return {
        title: isHindi ? 'अर्बन कंपनी अनुभव' : 'Urban Company Central SBC Quality',
        reply: isHindi
          ? "सजल सक्सेना अर्बन कंपनी (Ghitorni, New Delhi) में **Business Development Associate (Central SBC Quality Team)** के पद पर कार्यरत हैं (अप्रैल 2026 से वर्तमान):\n\n" +
            "• **Tier 1 और Tier 2 एस्केलेशंस**: ऑपरेशन्स की समस्याओं का रूट-कॉज़ एनालिसिस (RCA) द्वारा समाधान करते हैं।\n" +
            "• **रियल-टाइम अटेंडेंस**: 80% से अधिक RT अटेंडेंस बेंचमार्क बनाए रखते हैं।\n" +
            "• **जार्विस एनालिटिक्स और SQL**: सर्विस लेवल एग्रीमेंट्स (SLAs) और पार्टनर परफॉरमेंस की लाइव मॉनिटरिंग करते हैं।\n" +
            "• **AI हैंडहोल्डिंग पायलट**: पार्टनर ट्रेनिंग और एआई ऑटोमेशन इनिशिएटिव का नेतृत्व करते हैं।"
          : "Sajal is currently working as a **Business Development Associate** in Urban Company's **Central SBC Quality Team** in Ghitorni, New Delhi (Apr 2026 – Present):\n\n" +
            "• **Tier 1 & 2 Escalations**: Resolves complex partner bottlenecks through structured root-cause analysis (RCA).\n" +
            "• **SLA & Real-Time Attendance**: Sustains partner Real-Time (RT) attendance exceeding 80%.\n" +
            "• **Jarvis Analytics & SQL**: High-throughput telemetry and SLA compliance tracking.\n" +
            "• **AI Handholding Pilot**: Drives partner upgrade training and AI workflow optimization.",
        actions: [
          { label: 'View Experience Section', icon: 'scroll', target: '#experience' },
          { label: 'Download Resume', icon: 'download' },
        ],
      };
    }

    if (lq.includes('elexoplus') || lq.includes('project') || lq.includes('connectx') || lq.includes('cnn') || lq.includes('प्रोजेक्ट')) {
      return {
        title: isHindi ? 'सजल के प्रमुख प्रोजेक्ट्स' : 'Flagship Systems & Projects',
        reply: isHindi
          ? "सजल सक्सेना के 4 मुख्य इंजीनियरिंग प्रोजेक्ट्स:\n\n" +
            "1. **Elexoplus Commerce & ERP Suite** *(React, Node, Express, MySQL)*: D2C स्टोर (elexoplus.com) और B2B होलसेल पोर्टल (b2b.elexoplus.com) का सम्पूर्ण ईआरपी सिस्टम।\n" +
            "2. **ConnectX Real-Time Video Calling** *(React, WebRTC, Socket.io, MongoDB)*: 100ms से कम लेटेंसी वाला पीयर-टू-पीयर वीडियो व चैट प्लेटफॉर्म।\n" +
            "3. **Plant Leaf Disease Identifier (CNN)** *(Python, TensorFlow, OpenCV)*: पौधों की बीमारियों की 95%+ सटीकता से पहचान करने वाला डीप लर्निंग मॉडल।\n" +
            "4. **Electricity Bill Management System** *(Java Swing/AWT, SQL Server)*: ACID कम्प्लायंट डेस्कटॉप बिलिंग सिस्टम।"
          : "Sajal has architected 4 major engineering systems:\n\n" +
            "1. **Elexoplus Commerce & ERP Suite** *(React, Node, Express, MySQL)*: Dual D2C Storefront (elexoplus.com) and B2B Wholesale Portal (b2b.elexoplus.com) with RBAC and automated inventory pipelines.\n" +
            "2. **ConnectX Video Calling Engine** *(React, WebRTC, Socket.io, MongoDB)*: Sub-100ms low latency peer-to-peer media mesh.\n" +
            "3. **Plant Leaf Disease Identifier** *(Python, TensorFlow, OpenCV)*: Convolutional Neural Network with >95% validation accuracy.\n" +
            "4. **Electricity Bill Management** *(Java Swing, SQL Server)*: ACID-compliant relational billing software.",
        actions: [
          { label: 'Inspect Projects', icon: 'scroll', target: '#projects' },
          { label: '3D Adventure City', icon: 'scroll', target: '#metaverse-city' },
        ],
      };
    }

    if (lq.includes('skill') || lq.includes('tech') || lq.includes('stack') || lq.includes('हुनर') || lq.includes('तकनीक')) {
      return {
        title: isHindi ? 'तकनीकी कौशल (Technical Stack)' : 'Technical Matrix & Arsenal',
        reply: isHindi
          ? "सजल का मुख्य टेक स्टैक:\n\n" +
            "• **Frontend**: React 19, TypeScript, JavaScript (ES6+), Three.js / WebGL, Tailwind CSS v4\n" +
            "• **Backend**: Node.js, Express.js, PHP 8, REST APIs, WebRTC, Socket.io\n" +
            "• **Databases**: MySQL, MongoDB, Microsoft SQL Server, DB2, Stored Procedures\n" +
            "• **AI & ML**: TensorFlow, Keras, OpenCV, Python, Oracle Cloud GenAI (OCI 2025)\n" +
            "• **Operations**: Jarvis Analytics, Root-Cause Analysis, SLA Monitoring"
          : "Sajal's core technical arsenal:\n\n" +
            "• **Spatial & Frontend**: React 19, TypeScript, JavaScript, Three.js WebGL, Tailwind CSS\n" +
            "• **Backend & Real-Time**: Node.js, Express.js, PHP 8, WebRTC, Socket.io, REST APIs\n" +
            "• **Databases & Telemetry**: MySQL, MongoDB, MS SQL Server, Jarvis Analytics, Advanced Excel\n" +
            "• **AI & Vision**: TensorFlow, OpenCV, Python, Oracle Cloud (OCI) 2025 GenAI Pro",
        actions: [
          { label: 'View Skills Section', icon: 'scroll', target: '#skills' },
          { label: 'Connect on LinkedIn', icon: 'linkedin' },
        ],
      };
    }

    if (lq.includes('contact') || lq.includes('email') || lq.includes('phone') || lq.includes('संपर्क') || lq.includes('फोन')) {
      return {
        title: isHindi ? 'सजल से सीधा संपर्क' : 'Direct Contact Coordinates',
        reply: isHindi
          ? "सजल सक्सेना से आप सीधे संपर्क कर सकते हैं:\n\n" +
            "• **ईमेल**: sajalsaxenagola@gmail.com\n" +
            "• **फोन / व्हाट्सऐप**: +91 88408 10386\n" +
            "• **लिंक्डइन**: linkedin.com/in/sajal-saxena-cse/\n" +
            "• **स्थान**: घिटोरनी, नई दिल्ली / गोला गोकर्णनाथ, उत्तर प्रदेश (पिन: 262802)"
          : "You can reach Sajal Saxena directly via:\n\n" +
            "• **Email**: sajalsaxenagola@gmail.com\n" +
            "• **Phone / WhatsApp**: +91 88408 10386\n" +
            "• **LinkedIn**: linkedin.com/in/sajal-saxena-cse/\n" +
            "• **Coordinates**: Ghitorni, New Delhi / Gola Gokarannath, UP (PIN: 262802)",
        actions: [
          { label: 'Send Direct Email', icon: 'mail', target: 'mailto:sajalsaxenagola@gmail.com' },
          { label: 'LinkedIn Profile', icon: 'linkedin' },
        ],
      };
    }

    // Default intelligent greeting & overview
    return {
      title: isHindi ? 'सजल सक्सेना का परिचय' : 'Sajal Saxena Overview',
      reply: isHindi
        ? "सजल सक्सेना एक **Full-Stack Software Engineer** और अर्बन कंपनी की **Central SBC Quality Team** में **Business Development Associate** हैं।\n\n" +
          "वे ओरेकल क्लाउड सर्टिफाइड जेनेरेटिव एआई प्रोफेशनल (OCI 2025) हैं और उन्होंने बी.टेक कंप्यूटर साइंस (2021-2025) देव भूमि उत्तराखंड यूनिवर्सिटी से किया है।\n\n" +
          "आप मुझसे सजल के किसी भी प्रोजेक्ट (Elexoplus, ConnectX), काम के अनुभव या सर्टिफिकेशन्स के बारे में पूछ सकते हैं!"
        : "Sajal Saxena is a **Full-Stack Software Engineer** and **Business Development Associate** at Urban Company's Central SBC Quality Team in New Delhi.\n\n" +
          "He is an **Oracle Cloud Infrastructure (OCI) 2025 Certified Generative AI Professional** and holds a B.Tech in CSE from Dev Bhoomi Uttarakhand University.\n\n" +
          "Ask me anything about his projects (Elexoplus ERP, ConnectX WebRTC), Urban Company operations, or technical skills in English or Hindi!",
      actions: [
        { label: 'Urban Company Role', icon: 'scroll', target: '#experience' },
        { label: 'Key Projects', icon: 'scroll', target: '#projects' },
      ],
    };
  };

  const handleSend = async () => {
    const raw = input.trim();
    if (!raw) return;

    soundEngine.playTick();
    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: raw,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    let replyText = '';
    let title = 'Copilot';
    let actions: ActionButton[] | undefined = undefined;

    // 1. Try Google AI Studio Gemini API first
    const geminiReply = await callGoogleAIStudio(raw);
    if (geminiReply) {
      replyText = geminiReply;
      title = 'Gemini AI Studio';
    } else {
      // 2. High accuracy fallback local portfolio knowledge engine
      const local = getLocalKnowledgeReply(raw);
      replyText = local.reply;
      title = local.title;
      actions = local.actions;
    }

    const botMsgId = String(Date.now() + 1);
    const botMsg: Message = {
      id: botMsgId,
      sender: 'bot',
      title,
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions,
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
    soundEngine.playTick();

    // Auto-speak live in Hindi or English if voice narration is active
    if (voiceEnabled) {
      setTimeout(() => {
        speakText(replyText, botMsgId);
      }, 250);
    }
  };

  const handleActionClick = (action: ActionButton) => {
    soundEngine.playTick();
    if (action.target?.startsWith('#')) {
      const el = document.querySelector(action.target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (action.icon === 'download') {
      window.open(getAssetUrl('assets/resource/SAJAL_SAXENA_RESUME_3b56c39e.pdf'), '_blank');
    } else if (action.icon === 'linkedin') {
      window.open('https://www.linkedin.com/in/sajal-saxena-cse/', '_blank');
    } else if (action.target?.startsWith('mailto:')) {
      window.location.href = action.target;
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 font-mono">
      {/* Bot Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[94vw] sm:w-[460px] h-[580px] max-h-[86vh] bg-[#120d09]/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(255,154,60,0.2)] flex flex-col overflow-hidden animate-fadeIn">
          
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
                  COPILOT AI
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#ff9a3c]/20 text-[#ff9a3c] border border-[#ff9a3c]/30 font-normal">
                    {apiKey ? 'GOOGLE AI STUDIO' : 'PORTFOLIO ENGINE'}
                  </span>
                </h4>
                <p className="text-[10px] text-neutral-400 font-sans">
                  Live Hindi / English Speech Enabled
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Google AI Studio API Key Button */}
              <button
                onClick={() => {
                  soundEngine.playTick();
                  setShowKeyModal((prev) => !prev);
                }}
                className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center gap-1 ${
                  apiKey
                    ? 'bg-[#10b981]/20 border-[#10b981]/50 text-[#10b981]'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                }`}
                title="Google AI Studio Gemini API Key"
              >
                <Key size={14} />
              </button>

              {/* Voice Speech Toggle Button */}
              <button
                onClick={() => {
                  soundEngine.playTick();
                  if (isSpeaking) stopSpeaking();
                  setVoiceEnabled((prev) => !prev);
                }}
                className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center gap-1 ${
                  voiceEnabled
                    ? 'bg-[#ff9a3c]/20 border-[#ff9a3c]/50 text-[#ff9a3c]'
                    : 'bg-white/5 border-white/10 text-neutral-500'
                }`}
                title={voiceEnabled ? 'Live Voice On (Speaking Hindi/English)' : 'Live Voice Muted'}
              >
                {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </button>

              <button
                onClick={() => {
                  soundEngine.playTick();
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close Copilot"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Google AI Studio API Key Modal Overlay */}
          {showKeyModal && (
            <div className="p-4 bg-[#1e150f] border-b border-white/15 text-xs font-mono space-y-3">
              <div className="flex items-center justify-between text-white font-bold">
                <span className="flex items-center gap-1.5 text-[#ff9a3c]">
                  <Key size={14} />
                  Google AI Studio Free Gemini Key
                </span>
                <button onClick={() => setShowKeyModal(false)} className="text-neutral-400 hover:text-white">
                  <X size={14} />
                </button>
              </div>
              <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                Connect your free API key from{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#ff9a3c] underline"
                >
                  aistudio.google.com
                </a>{' '}
                for live Gemini 2.5 Flash responses. The key is stored safely only in your browser&apos;s local storage.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={tempKeyInput}
                  onChange={(e) => setTempKeyInput(e.target.value)}
                  placeholder={apiKey ? '••••••••••••••••••••' : 'AIzaSy...'}
                  className="flex-1 bg-black/60 border border-white/20 rounded px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff9a3c]"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="px-3 py-1.5 rounded bg-[#ff9a3c] text-[#120e0a] font-bold text-xs hover:bg-[#ffb066] transition-colors"
                >
                  Save Key
                </button>
              </div>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-[#ff9a3c]/20 border border-[#ff9a3c]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={12} className="text-[#ff9a3c]" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-xl p-3.5 space-y-2 relative ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-[#ff9a3c] to-[#e66a1f] text-[#130e09] font-medium shadow-md'
                      : 'bg-[#18110b] border border-white/10 text-neutral-200'
                  }`}
                >
                  {/* Card Title & Audio Trigger */}
                  {m.sender === 'bot' && (
                    <div className="border-b border-white/10 pb-2 mb-1 flex items-center justify-between gap-2">
                      <span className="font-bold text-[#ff9a3c] text-xs font-mono tracking-tight flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff9a3c]" />
                        {m.title || 'Copilot AI'}
                      </span>

                      {/* Live Speech Action Button */}
                      <button
                        onClick={() => speakText(m.text, m.id)}
                        className={`p-1 rounded text-[10px] flex items-center gap-1 transition-colors ${
                          currentSpeakingId === m.id
                            ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 animate-pulse'
                            : 'text-neutral-400 hover:text-white bg-white/5'
                        }`}
                        title="Live Speech in Hindi / English"
                      >
                        <Volume2 size={11} />
                        <span>{currentSpeakingId === m.id ? 'बोल रहे हैं...' : 'सुनें (Listen)'}</span>
                      </button>
                    </div>
                  )}

                  {/* Formatted Content */}
                  <div className="text-xs space-y-1.5 leading-relaxed font-sans whitespace-pre-wrap">
                    {m.text}
                  </div>

                  {/* Interactive Action Buttons */}
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
              <div className="flex gap-2 items-center text-xs text-neutral-400 italic font-mono pl-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff9a3c] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff9a3c] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff9a3c] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] ml-1">AI सोच रहा है (Processing)...</span>
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
              maxLength={300}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything in English or हिंदी (e.g. Urban Company, projects)..."
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
          <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1 font-mono">
            AI COPILOT
            <Sparkles size={11} className="text-[#ff9a3c]" />
          </span>
          <span className="text-[10px] text-neutral-400 font-sans">Google AI Studio · Live Hindi</span>
        </div>
      </button>
    </div>
  );
};

export default SmartBot;
