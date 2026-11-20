import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Send,
  Sparkles,
  ExternalLink,
  Download,
  Mail,
  ChevronRight,
  Phone,
  MessageSquare,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  CheckCircle2,
  Copy,
  Radio,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  RotateCcw
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { getAssetUrl } from '../utils/assets';

interface ActionButton {
  label: string;
  icon?: 'download' | 'linkedin' | 'mail' | 'scroll' | 'phone';
  target?: string;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  title?: string;
  badge?: string;
  text: string;
  kpis?: { label: string; value: string }[];
  highlights?: string[];
  timestamp: string;
  actions?: ActionButton[];
}

export const SmartBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'live' | 'cards'>('live'); // 'live' is the Gemini Live Orb mode
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null);

  // Live Speech Recognition & Audio State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [botState, setBotState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const recognitionRef = useRef<any>(null);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Canvas ref for fluid audio wave orb
  const orbCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const orbAnimIdRef = useRef<number | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-msg',
      sender: 'bot',
      title: "Sajal's Personal Dossier",
      badge: 'Portfolio Intelligence Console',
      text:
        "नमस्ते! I am **Sajal's Assistant**.\n\n" +
        "Sajal Saxena is a **Full-Stack Software Engineer** and **Business Development Associate** in Urban Company's Central SBC Quality team in New Delhi. He specializes in enterprise React/Node architecture, operational root-cause analysis (RCA), and SLA compliance.\n\n" +
        "You can speak or query directly about:\n" +
        "• **Urban Company Operations** (SLA Governance, Real-Time Attendance >80%, Jarvis SQL)\n" +
        "• **Production Systems** (Elexoplus D2C/B2B ERP, ConnectX WebRTC, Plant Leaf CNN Classifier)\n" +
        "• **Technical Credentials** (Oracle Cloud 2025 GenAI Pro, React 19, TypeScript, Three.js, Python)",
      kpis: [
        { label: 'RT Attendance', value: '> 80% SLA' },
        { label: 'Latency Drop', value: '-30% Latency' },
        { label: 'ML Accuracy', value: '> 95% CNN' },
        { label: 'GenAI Credential', value: 'Oracle 2025' }
      ],
      highlights: [
        'Urban Company: Central SBC Quality Team (Ghitorni, New Delhi)',
        'Full-Stack Architecture: React 19, Three.js, Node.js, Express, MySQL',
        'Certified Generative AI Professional (Oracle Cloud OCI 2025)'
      ],
      timestamp: 'Online',
      actions: [
        { label: 'Download Resume PDF', icon: 'download' },
        { label: 'Review Urban Company Role', icon: 'scroll', target: '#experience' },
        { label: 'Direct Email', icon: 'mail', target: 'mailto:sajalsaxenagola@gmail.com' }
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'cards') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen, activeTab]);

  // Female Hindi-Toned Speech Synthesizer
  const speakFemaleHindiTone = useCallback((text: string, messageId: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (currentSpeakingId === messageId && isSpeaking) {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
      setBotState('idle');
      return;
    }

    const cleanSpeech = text
      .replace(/[#*`_~]/g, '')
      .replace(/\(https?:\/\/[^\)]+\)/g, '')
      .replace(/\[([^\]]+)\]/g, '$1')
      .replace(/•/g, ', ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    // Natural female Hindi tone configuration
    utterance.lang = 'hi-IN';
    utterance.pitch = 1.2; // Natural pleasant sweet female voice register
    utterance.rate = 0.94; // Clear, polite pacing

    const voices = window.speechSynthesis.getVoices();
    const femaleVoice =
      voices.find(
        (v) =>
          (v.lang.includes('hi') || v.lang.includes('IN')) &&
          (v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('kalpana') ||
            v.name.toLowerCase().includes('swara') ||
            v.name.toLowerCase().includes('aditi') ||
            v.name.toLowerCase().includes('zira') ||
            v.name.toLowerCase().includes('google हिन्दी'))
      ) || voices.find((v) => v.lang.includes('hi') || v.lang.includes('IN'));

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakingId(messageId);
      setBotState('speaking');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
      setBotState('idle');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
      setBotState('idle');
    };

    window.speechSynthesis.speak(utterance);
  }, [currentSpeakingId, isSpeaking]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
      setBotState('idle');
    }
  }, []);

  const copyMessageText = (text: string, id: string) => {
    soundEngine.playTick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- Dynamic Animated Fluid Sound Orb (Gemini Live Style) ---
  useEffect(() => {
    if (!isOpen || activeTab !== 'live') {
      if (orbAnimIdRef.current) cancelAnimationFrame(orbAnimIdRef.current);
      return;
    }

    const canvas = orbCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const renderOrb = () => {
      time += 0.035;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Amplitude based on botState
      let baseRadius = 55;
      let waveAmp = 8;
      let ringCount = 4;
      let colorPrimary = 'rgba(6, 182, 212, 0.85)'; // cyan
      let colorSecondary = 'rgba(255, 154, 60, 0.85)'; // amber
      let colorTertiary = 'rgba(139, 92, 246, 0.75)'; // purple

      if (botState === 'listening') {
        baseRadius = 65 + Math.sin(time * 6) * 12;
        waveAmp = 18;
        colorPrimary = 'rgba(255, 154, 60, 0.95)';
        colorSecondary = 'rgba(239, 68, 68, 0.85)';
      } else if (botState === 'thinking') {
        baseRadius = 58;
        waveAmp = 6;
        colorPrimary = 'rgba(139, 92, 246, 0.95)';
        colorSecondary = 'rgba(59, 130, 246, 0.9)';
      } else if (botState === 'speaking') {
        baseRadius = 60 + Math.sin(time * 8) * 14;
        waveAmp = 22;
        colorPrimary = 'rgba(16, 185, 129, 0.95)';
        colorSecondary = 'rgba(6, 182, 212, 0.9)';
      }

      // Outer radial glow
      const glowGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.4, cx, cy, baseRadius * 2.2);
      glowGrad.addColorStop(0, colorPrimary);
      glowGrad.addColorStop(0.5, colorSecondary);
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Fluid Multi-Harmonic Sound Orb Core
      for (let r = 0; r < ringCount; r++) {
        ctx.beginPath();
        const numPoints = 64;
        const currentR = baseRadius - r * 6;

        for (let i = 0; i <= numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2;
          const harmonic1 = Math.sin(angle * 3 + time * 2 + r) * waveAmp;
          const harmonic2 = Math.cos(angle * 5 - time * 3) * (waveAmp * 0.6);
          const rad = currentR + harmonic1 + harmonic2;

          const px = cx + Math.cos(angle) * rad;
          const py = cy + Math.sin(angle) * rad;

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }

        ctx.closePath();
        ctx.strokeStyle = r === 0 ? colorPrimary : r === 1 ? colorSecondary : colorTertiary;
        ctx.lineWidth = 3 - r * 0.6;
        ctx.stroke();

        if (r === 0) {
          const innerGrad = ctx.createRadialGradient(cx - 15, cy - 15, 5, cx, cy, currentR);
          innerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          innerGrad.addColorStop(0.4, colorPrimary);
          innerGrad.addColorStop(0.8, colorSecondary);
          innerGrad.addColorStop(1, 'rgba(10, 10, 20, 0.9)');
          ctx.fillStyle = innerGrad;
          ctx.fill();
        }
      }

      // Orbiting energy particles
      for (let p = 0; p < 6; p++) {
        const pAngle = time * (1.2 + p * 0.2) + (p * Math.PI) / 3;
        const pDist = baseRadius * 1.35 + Math.sin(time * 3 + p) * 12;
        const px = cx + Math.cos(pAngle) * pDist;
        const py = cy + Math.sin(pAngle) * pDist;

        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      orbAnimIdRef.current = requestAnimationFrame(renderOrb);
    };

    renderOrb();

    return () => {
      if (orbAnimIdRef.current) cancelAnimationFrame(orbAnimIdRef.current);
    };
  }, [isOpen, activeTab, botState]);

  // Comprehensive Knowledge Engine for Sajal's Portfolio
  const generateDossierResponse = (query: string): Partial<Message> => {
    const lq = query.toLowerCase();
    const isHindi =
      /[\u0900-\u097F]/.test(query) ||
      lq.includes('kaun') ||
      lq.includes('kya') ||
      lq.includes('batao') ||
      lq.includes('kaise') ||
      lq.includes('kahan') ||
      lq.includes('hai');

    // Urban Company Experience
    if (
      lq.includes('urban') ||
      lq.includes('experience') ||
      lq.includes('job') ||
      lq.includes('role') ||
      lq.includes('quality') ||
      lq.includes('sla') ||
      lq.includes('अर्बन') ||
      lq.includes('काम')
    ) {
      if (isHindi) {
        return {
          title: 'अर्बन कंपनी: मुख्य रोल और जिम्मेदारियाँ',
          badge: 'Central SBC Quality Team · New Delhi',
          text:
            'सजल सक्सेना अर्बन कंपनी की सेंट्रल SBC क्वालिटी टीम में Business Development Associate हैं (अप्रैल 2026 – वर्तमान):\n\n' +
            '• **Tier 1 और Tier 2 एस्केलेशंस**: ऑपरेशन्स की जटिल समस्याओं का रूट-कॉज़ एनालिसिस (RCA) द्वारा तुरंत समाधान निकालते हैं।\n' +
            '• **80%+ रियल-टाइम अटेंडेंस**: संपूर्ण रीजन में सर्विस पार्टनर्स की रियल-टाइम (RT) अटेंडेंस को निरंतर 80% से ऊपर बनाए रखते हैं।\n' +
            '• **जार्विस एनालिटिक्स व SQL**: आधुनिक SQL क्वेरीज़ और जार्विस डैशबोर्ड द्वारा SLA कम्प्लायंस की लाइव ट्रैकिंग करते हैं।\n' +
            '• **AI हैंडहोल्डिंग पायलट लीड**: पार्टनर ट्रेनिंग और AI ऑटोमेशन इनिशिएटिव्स का सफल संचालन करते हैं।',
          kpis: [
            { label: 'RT Attendance', value: '> 80% SLA' },
            { label: 'Escalations', value: 'Tier 1/2 RCA' },
            { label: 'Telemetry', value: 'Jarvis SQL' }
          ],
          highlights: [
            'ऑपरेशनल बॉटलनेक्स का डेटा-आधारित रूट-कॉज़ एनालिसिस',
            'SLA कम्प्लायंस और पार्टनर रिटेंशन में सिद्ध योगदान',
            'AI हैंडहोल्डिंग पायलट का सफल नेतृत्व'
          ],
          actions: [
            { label: 'View Experience Timeline', icon: 'scroll', target: '#experience' },
            { label: 'Connect on LinkedIn', icon: 'linkedin' }
          ]
        };
      }

      return {
        title: 'Urban Company Operations & SLA Engineering',
        badge: 'Central SBC Quality Team · Ghitorni, New Delhi',
        text:
          'Sajal serves as **Business Development Associate** in Urban Company\'s Central SBC Quality team (Apr 2026 – Present):\n\n' +
          '• **Tier 1 & Tier 2 Escalation Governance**: Deconstructs high-severity operational bottlenecks through structured Root-Cause Analysis (RCA) and cross-functional corrective workflows.\n' +
          '• **Cohort Reliability (>80% RT Attendance)**: Maintains operational service cohort health above strict Real-Time attendance compliance thresholds exceeding 80%.\n' +
          '• **Jarvis Analytics & High-Throughput SQL**: Executes relational queries and telemetry dashboards to govern partner Service Level Agreements (SLAs).\n' +
          '• **AI Handholding Pilot & Partner Training**: Drives training modules and pilot testing for internal AI diagnostic tools to accelerate partner enablement.',
        kpis: [
          { label: 'Cohort Reliability', value: '> 80% RT Attendance' },
          { label: 'Problem Solving', value: 'Tier 1/2 RCA' },
          { label: 'Analytics Engine', value: 'Jarvis SQL Telemetry' }
        ],
        highlights: [
          'Direct ownership of partner SLA benchmarks and operational compliance',
          'Analytical bridge between category operations and software telemetry',
          'Active leader in AI-assisted partner support workflows'
        ],
        actions: [
          { label: 'Inspect Experience Section', icon: 'scroll', target: '#experience' },
          { label: 'Download Resume PDF', icon: 'download' },
          { label: 'Schedule an Interview', icon: 'mail', target: 'mailto:sajalsaxenagola@gmail.com' }
        ]
      };
    }

    // Projects (Elexoplus, ConnectX, CNN, Electricity Ledger)
    if (
      lq.includes('project') ||
      lq.includes('elexoplus') ||
      lq.includes('connectx') ||
      lq.includes('cnn') ||
      lq.includes('billing') ||
      lq.includes('erp') ||
      lq.includes('webrtc') ||
      lq.includes('प्रोजेक्ट')
    ) {
      if (isHindi) {
        return {
          title: 'सजल के प्रमुख 4 इंजीनियरिंग सिस्टम्स',
          badge: 'Production Systems & Full-Stack',
          text:
            'सजल सक्सेना द्वारा निर्मित 4 मुख्य इंजीनियरिंग प्रोजेक्ट्स:\n\n' +
            '1. **Elexoplus Commerce & ERP Suite** *(React, Node, Express, MySQL)*:\n   D2C स्टोर (`elexoplus.com`) और B2B होलसेल पोर्टल (`b2b.elexoplus.com`) का एकीकृत ईआरपी सिस्टम।\n\n' +
            '2. **ConnectX Real-Time Video Calling** *(React, WebRTC, Socket.io, MongoDB)*:\n   सब-100ms लेटेंसी वाला एन्क्रिप्टेड पीयर-टू-पीयर वीडियो व चैट प्लेटफॉर्म।\n\n' +
            '3. **Plant Leaf Disease Identifier (CNN)** *(Python, TensorFlow, OpenCV)*:\n   पौधों की पत्तियों के रोगों की 95%+ सटीकता से पहचान करने वाला डीप लर्निंग मॉडल।\n\n' +
            '4. **Electricity Bill Management System** *(Java Swing, SQL Server)*:\n   ACID कम्प्लायंट डेस्कटॉप बिलिंग सॉफ्टवेयर।',
          kpis: [
            { label: 'Architecture', value: 'Dual D2C + B2B' },
            { label: 'Media Latency', value: '< 100ms WebRTC' },
            { label: 'AI Accuracy', value: '> 95% CNN' }
          ],
          highlights: [
            'Elexoplus: लाइव एंटरप्राइज ई-कॉमर्स व होलसेल ईआरपी',
            'ConnectX: लो-लेटेंसी WebRTC मेश नेटवर्किंग',
            'Plant Pathology: 95%+ टेस्टेड एक्यूरेसी'
          ],
          actions: [
            { label: 'Explore Projects Section', icon: 'scroll', target: '#projects' },
            { label: 'Tour 3D Adventure City', icon: 'scroll', target: '#metaverse-city' }
          ]
        };
      }

      return {
        title: 'Core Systems & Full-Stack Architecture',
        badge: 'Enterprise ERP, WebRTC & Deep Learning',
        text:
          'Sajal has engineered 4 flagship production-grade systems:\n\n' +
          '1. **Elexoplus Commerce & ERP Suite** *(React.js, Node.js, Express, MySQL)*:\n   Unified D2C Storefront (`elexoplus.com`) and B2B Wholesale Portal (`b2b.elexoplus.com`). Features Granular Role-Based Access Control (RBAC), multi-warehouse inventory telemetry, and automated order reconciliation.\n\n' +
          '2. **ConnectX Real-Time Video Engine** *(React.js, WebRTC, Socket.io, MongoDB)*:\n   Sub-100ms peer-to-peer audio/video streaming mesh with encrypted Socket.io signaling, ICE renegotiation, and dynamic media device switching.\n\n' +
          '3. **Plant Leaf Pathology CNN Classifier** *(Python, TensorFlow, OpenCV)*:\n   Deep convolutional neural network achieving >95% validation accuracy across botanical disease datasets with lightweight REST inference endpoints.\n\n' +
          '4. **Electricity Bill Management System** *(Java Swing/AWT, SQL Server, JDBC)*:\n   Enterprise desktop utility with multi-table relational schema joins, automated invoice generation, and ACID transaction safety.',
        kpis: [
          { label: 'Elexoplus Model', value: 'D2C + B2B ERP' },
          { label: 'WebRTC Latency', value: '< 100ms P2P' },
          { label: 'Computer Vision', value: '> 95% Precision' }
        ],
        highlights: [
          'Full lifecycle delivery from database schema design to production deployment',
          'Production-tested across low-latency WebRTC and scalable relational MySQL',
          'Direct codebases available on GitHub for technical review'
        ],
        actions: [
          { label: 'Inspect Projects in Detail', icon: 'scroll', target: '#projects' },
          { label: 'Explore 3D City Metaverse', icon: 'scroll', target: '#metaverse-city' },
          { label: 'Download Resume PDF', icon: 'download' }
        ]
      };
    }

    // Skills, Tech Stack & Certifications
    if (
      lq.includes('skill') ||
      lq.includes('stack') ||
      lq.includes('cert') ||
      lq.includes('oracle') ||
      lq.includes('genai') ||
      lq.includes('technology') ||
      lq.includes('tech') ||
      lq.includes('हुनर')
    ) {
      if (isHindi) {
        return {
          title: 'सजल का टेक्निकल स्टैक व सर्टिफिकेशन्स',
          badge: 'Enterprise Engineering Stack',
          text:
            'सजल का मुख्य टेक्निकल स्टैक:\n\n' +
            '• **Frontend & 3D**: React 19, TypeScript, Three.js WebGL, Tailwind CSS v4\n' +
            '• **Backend & Real-Time**: Node.js, Express.js, PHP 8, REST APIs, WebRTC, Socket.io\n' +
            '• **Databases & Telemetry**: MySQL, MongoDB, Microsoft SQL Server, DB2, Jarvis SQL, Advanced Excel\n' +
            '• **AI & Machine Learning**: Python, TensorFlow, Keras, OpenCV, Oracle Cloud GenAI (OCI 2025)\n\n' +
            '**सर्टिफिकेशन्स**:\n' +
            '• **Oracle Cloud Infrastructure 2025 Certified Generative AI Professional**\n' +
            '• **HackerRank 5-Star**: Python व SQL Problem Solving\n' +
            '• **Infosys Java SE Enterprise Certification**\n' +
            '• **UGC NEP Saarthi Student Ambassador**',
          kpis: [
            { label: 'Generative AI', value: 'Oracle OCI 2025' },
            { label: 'HackerRank', value: '5-Star SQL/Python' },
            { label: 'Frontend & 3D', value: 'React 19 / Three.js' }
          ],
          highlights: [
            'Oracle OCI 2025 GenAI प्रोफेशनल सर्टिफाइड',
            'Full-Stack और हाई-परफॉरमेंस 3D WebGL में महारत',
            'डेटा-ड्रिवेन ऑपरेशन्स व SQL टेलीमेट्री में विशेषज्ञ'
          ],
          actions: [
            { label: 'View Skills Section', icon: 'scroll', target: '#skills' },
            { label: 'Connect on LinkedIn', icon: 'linkedin' }
          ]
        };
      }

      return {
        title: 'Technical Arsenal & Industry Certifications',
        badge: 'Enterprise Engineering Stack',
        text:
          'Sajal\'s technical stack spans modern frontends, high-throughput backends, and enterprise AI:\n\n' +
          '• **Frontend & Spatial Web**: React 19, TypeScript, JavaScript (ES6+), Three.js WebGL, Tailwind CSS v4\n' +
          '• **Backend & Real-Time**: Node.js, Express.js, PHP 8, REST APIs, WebRTC, Socket.io\n' +
          '• **Databases & Telemetry**: MySQL, MongoDB, Microsoft SQL Server, DB2, Jarvis Analytics, Advanced Excel\n' +
          '• **AI, Machine Learning & Vision**: TensorFlow, Keras, OpenCV, Python (NumPy, Pandas), LLMs & RAG\n\n' +
          '**Verified Accolades & Certifications**:\n' +
          '• **Oracle Cloud Infrastructure (OCI) 2025 Certified Generative AI Professional**\n' +
          '• **HackerRank 5-Star**: Python & SQL Problem Solving\n' +
          '• **Infosys & ICT Academy**: Java Enterprise SE Certification\n' +
          '• **TCS**: ESG Virtual Experience Program\n' +
          '• **Lakshagriha Hackathon 1.0 Finalist** (DBUU)',
        kpis: [
          { label: 'Generative AI', value: 'Oracle OCI 2025' },
          { label: 'HackerRank', value: '5-Star SQL/Python' },
          { label: 'Frontend & 3D', value: 'React 19 / Three.js' }
        ],
        highlights: [
          'Certified in LLM fine-tuning, RAG pipelines, and Vector DBs on Oracle Cloud',
          'Demonstrated 30% API latency reduction in production gaming infrastructure',
          'Proven fluency across frontend UX, backend services, and cloud telemetry'
        ],
        actions: [
          { label: 'View Technical Matrix', icon: 'scroll', target: '#skills' },
          { label: 'Connect on LinkedIn', icon: 'linkedin' }
        ]
      };
    }

    // Contact & Coordinates
    if (
      lq.includes('contact') ||
      lq.includes('email') ||
      lq.includes('phone') ||
      lq.includes('hire') ||
      lq.includes('interview') ||
      lq.includes('reach') ||
      lq.includes('संपर्क') ||
      lq.includes('बात')
    ) {
      if (isHindi) {
        return {
          title: 'सजल सक्सेना से संपर्क सूत्र',
          badge: 'Direct Communication Channels',
          text:
            'सजल से सीधे संपर्क करने के विवरण:\n\n' +
            '• **ईमेल**: `sajalsaxenagola@gmail.com`\n' +
            '• **मोबाइल**: `+91-8840428247`\n' +
            '• **स्थान**: घिटोरनी, नई दिल्ली / गोला गोकर्णनाथ, उत्तर प्रदेश (PIN: 262802)\n' +
            '• **लिंक्डइन**: `linkedin.com/in/sajal-saxena-cse/`\n' +
            '• **उपलब्धता**: नए अवसरों के लिए तत्काल उपलब्ध (Full-time / Hybrid / Remote)।',
          kpis: [
            { label: 'Response SLA', value: '< 2 Hours' },
            { label: 'Notice Period', value: 'Immediate' },
            { label: 'Base Location', value: 'Delhi NCR' }
          ],
          highlights: [
            'ईमेल व फोन पर तुरंत उपलब्ध',
            'इंजीनियरिंग व ऑपरेशन्स दोनों रोल्स के लिए तैयार',
            'सत्यापित रिज्यूमे पीडीएफ डाउनलोड उपलब्ध'
          ],
          actions: [
            { label: 'Send Direct Email', icon: 'mail', target: 'mailto:sajalsaxenagola@gmail.com' },
            { label: 'Call on Phone', icon: 'phone', target: 'tel:+918840428247' },
            { label: 'Download Resume PDF', icon: 'download' }
          ]
        };
      }

      return {
        title: 'Direct Contact Coordinates & Coordinates',
        badge: 'Direct Communication Channels',
        text:
          'Reach Sajal directly for software engineering, quality operations, or technical interviews:\n\n' +
          '• **Email**: `sajalsaxenagola@gmail.com`\n' +
          '• **Phone**: `+91-8840428247`\n' +
          '• **Location**: Ghitorni, New Delhi / Gola Gokarannath, Uttar Pradesh (PIN: 262802)\n' +
          '• **LinkedIn**: `linkedin.com/in/sajal-saxena-cse/`\n' +
          '• **Availability**: Immediate joining / flexible for High-Growth Startups & Product MNCs.',
        kpis: [
          { label: 'Response SLA', value: '< 2 Hours' },
          { label: 'Notice Period', value: 'Immediate' },
          { label: 'Base Location', value: 'Delhi NCR' }
        ],
        highlights: [
          'Direct calendar dispatch & interview scheduling',
          'Open to Full-Time, Remote, or Hybrid opportunities in Delhi NCR / Bengaluru',
          'Verified resume PDF downloadable below'
        ],
        actions: [
          { label: 'Compose Direct Email', icon: 'mail', target: 'mailto:sajalsaxenagola@gmail.com' },
          { label: 'Call via Phone', icon: 'phone', target: 'tel:+918840428247' },
          { label: 'Download Resume PDF', icon: 'download' }
        ]
      };
    }

    // Default Overview
    if (isHindi) {
      return {
        title: 'सजल सक्सेना — संक्षेप विवरण',
        badge: 'Portfolio Intelligence Console',
        text:
          'सजल सक्सेना एक **Full-Stack Software Engineer** और **Business Development Associate** हैं (अर्बन कंपनी, नई दिल्ली):\n\n' +
          '• **अर्बन कंपनी**: 80%+ रियल-टाइम अटेंडेंस, Tier 1/2 एस्केलेशंस का समाधान, जार्विस SQL एनालिटिक्स।\n' +
          '• **इंजीनियरिंग**: React 19, TypeScript, Node.js, WebRTC (ConnectX), Enterprise ERP (Elexoplus), Deep Learning (CNN)।\n' +
          '• **सर्टिफाइड**: Oracle Cloud Infrastructure 2025 GenAI Professional और UGC NEP Saarthi Ambassador।\n\n' +
          'आप मुझसे सजल के काम, प्रोजेक्ट्स, या संपर्क के बारे में कुछ भी पूछ सकते हैं।',
        kpis: [
          { label: 'RT Attendance', value: '> 80% SLA' },
          { label: 'Engineering', value: 'Full-Stack' },
          { label: 'Credentials', value: 'Oracle GenAI' }
        ],
        highlights: [
          'अर्बन कंपनी सेंट्रल SBC क्वालिटी टीम में सक्रिय',
          'D2C व B2B एंटरप्राइज ईआरपी आर्किटेक्ट',
          'त्वरित जॉइनिंग व इंटरव्यू के लिए उपलब्ध'
        ],
        actions: [
          { label: 'Download Resume PDF', icon: 'download' },
          { label: 'Direct Email', icon: 'mail', target: 'mailto:sajalsaxenagola@gmail.com' },
          { label: 'Connect on LinkedIn', icon: 'linkedin' }
        ]
      };
    }

    return {
      title: 'Sajal Saxena — Executive Dossier Summary',
      badge: 'Portfolio Intelligence Console',
      text:
        'Sajal Saxena is a **Full-Stack Software Engineer** and **Business Development Associate** at Urban Company in New Delhi:\n\n' +
        '• **Operational Rigor**: Central SBC Quality team, maintaining >80% Real-Time partner attendance SLA and leading Tier 1/2 escalation Root-Cause Analysis (RCA).\n' +
        '• **Full-Stack Production**: Engineered Elexoplus (dual D2C + B2B ERP), ConnectX (<100ms WebRTC Video Engine), and Plant Pathology CNN (>95% precision).\n' +
        '• **Certified Credentials**: Oracle Cloud Infrastructure 2025 GenAI Professional, UGC NEP Saarthi Ambassador, HackerRank 5-Star (Python & SQL).\n\n' +
        'Feel free to ask questions or tap the action buttons below to connect directly.',
      kpis: [
        { label: 'RT Attendance', value: '> 80% SLA' },
        { label: 'Engineering', value: 'Full-Stack' },
        { label: 'Credentials', value: 'Oracle GenAI' }
      ],
      highlights: [
        'Central SBC Quality Team at Urban Company (Ghitorni, New Delhi)',
        'Full-Stack Developer: React 19, Three.js, Node.js, Express, MySQL',
        'Certified Generative AI Professional (Oracle Cloud OCI 2025)'
      ],
      actions: [
        { label: 'Download Resume PDF', icon: 'download' },
        { label: 'Inspect Projects', icon: 'scroll', target: '#projects' },
        { label: 'Schedule an Interview', icon: 'mail', target: 'mailto:sajalsaxenagola@gmail.com' }
      ]
    };
  };

  const processQuery = useCallback((queryText: string) => {
    if (!queryText.trim()) return;

    soundEngine.playTick();
    setBotState('thinking');
    setIsTyping(true);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLiveTranscript('');

    setTimeout(() => {
      const respData = generateDossierResponse(queryText);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        title: respData.title,
        badge: respData.badge,
        text: respData.text || '',
        kpis: respData.kpis,
        highlights: respData.highlights,
        actions: respData.actions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      if (voiceEnabled) {
        speakFemaleHindiTone(botMsg.text, botMsg.id);
      } else {
        setBotState('idle');
      }
    }, 450);
  }, [voiceEnabled, speakFemaleHindiTone]);

  // Live Speech Recognition Toggle (Gemini Live Microphone)
  const toggleListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setBotState('idle');
      setLiveTranscript('');
      return;
    }

    stopSpeaking();
    soundEngine.playResonance();
    setIsListening(true);
    setBotState('listening');
    setLiveTranscript('Listening live...');

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const finalTranscript = event.results[i][0].transcript;
          setLiveTranscript(finalTranscript);
          setIsListening(false);
          processQuery(finalTranscript);
          return;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setLiveTranscript(interim || 'Listening...');
    };

    recognition.onerror = () => {
      setIsListening(false);
      setBotState('idle');
      setLiveTranscript('');
    };

    recognition.onend = () => {
      setIsListening(false);
      if (botState === 'listening') setBotState('idle');
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isListening, botState, stopSpeaking, processQuery]);

  const handleActionClick = (action: ActionButton) => {
    soundEngine.playTick();
    if (action.icon === 'download') {
      const link = document.createElement('a');
      link.href = getAssetUrl('assets/resource/SAJAL_SAXENA_RESUME_3b56c39e.pdf');
      link.download = 'Sajal_Saxena_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    if (action.target?.startsWith('#')) {
      const el = document.querySelector(action.target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
      return;
    }

    if (action.target) {
      window.open(action.target, '_blank', 'noopener,noreferrer');
    }
  };

  const quickPills = [
    { label: 'Urban Company Role', query: 'Tell me about Sajal at Urban Company and SLA metrics' },
    { label: 'Elexoplus ERP', query: 'Explain the Elexoplus D2C and B2B ERP project architecture' },
    { label: 'Oracle GenAI', query: 'What are Sajals GenAI credentials and certifications?' },
    { label: 'All 4 Projects', query: 'Give an overview of all 4 major projects' },
    { label: 'Direct Contact', query: 'How can I contact Sajal for an interview?' },
    { label: 'सजल का परिचय', query: 'सजल सक्सेना के अनुभव और प्रोजेक्ट्स के बारे में बताएं' }
  ];

  return (
    <div className="fixed bottom-5 right-5 z-40 font-mono">
      {/* Bot Chat & Live Voice Console */}
      {isOpen && (
        <div className="mb-3 w-[94vw] sm:w-[480px] h-[640px] max-h-[88vh] bg-[#100b08]/96 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(255,154,60,0.25)] flex flex-col overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#1c120a] via-[#140d08] to-[#1c120a] border-b border-white/15 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff9a3c] to-[#ea580c] text-[#130e09] font-black flex items-center justify-center text-sm shadow-lg">
                  <Sparkles size={18} className="text-[#130e09]" />
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#140d08] transition-colors ${
                    botState === 'listening'
                      ? 'bg-amber-400 animate-ping'
                      : botState === 'speaking'
                      ? 'bg-emerald-400'
                      : 'bg-emerald-500'
                  }`}
                />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white tracking-wide flex items-center gap-2 font-mono">
                  Sajal&apos;s Assistant
                </h4>
                <p className="text-[11px] text-neutral-400 font-sans flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>
                    {botState === 'listening'
                      ? 'Listening live...'
                      : botState === 'speaking'
                      ? 'Speaking...'
                      : botState === 'thinking'
                      ? 'Processing query...'
                      : 'Voice & Intelligence Ready'}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Mode Switcher: Live Voice Orb vs Dossier Cards */}
              <div className="flex bg-white/5 border border-white/10 rounded-xl p-0.5">
                <button
                  onClick={() => {
                    soundEngine.playTick();
                    setActiveTab('live');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                    activeTab === 'live'
                      ? 'bg-[#ff9a3c] text-[#120e0a] shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Live Voice Mode (Sound Orb)"
                >
                  <Radio size={12} />
                  <span>Live</span>
                </button>
                <button
                  onClick={() => {
                    soundEngine.playTick();
                    setActiveTab('cards');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                    activeTab === 'cards'
                      ? 'bg-[#ff9a3c] text-[#120e0a] shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Dossier Cards History"
                >
                  <MessageSquare size={12} />
                  <span>Cards</span>
                </button>
              </div>

              {/* Voice Speech Audio Toggle */}
              <button
                onClick={() => {
                  soundEngine.playTick();
                  if (isSpeaking) stopSpeaking();
                  setVoiceEnabled((prev) => !prev);
                }}
                className={`p-2 rounded-xl border text-xs transition-all flex items-center gap-1 ${
                  voiceEnabled
                    ? 'bg-[#ff9a3c]/20 border-[#ff9a3c]/60 text-[#ff9a3c]'
                    : 'bg-white/5 border-white/10 text-neutral-500'
                }`}
                title={voiceEnabled ? 'Voice narration active' : 'Voice narration muted'}
              >
                {voiceEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  soundEngine.playTick();
                  stopSpeaking();
                  if (isListening) toggleListening();
                  setIsOpen(false);
                }}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-4 py-2 bg-[#160f0a] border-b border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => processQuery(pill.query)}
                className="px-2.5 py-1 rounded-lg bg-white/6 hover:bg-[#ff9a3c]/20 hover:border-[#ff9a3c]/50 text-[10px] font-mono text-neutral-300 hover:text-white border border-white/10 whitespace-nowrap transition-all shrink-0"
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* MODE 1: GEMINI LIVE VOICE ORB MODE */}
          {activeTab === 'live' && (
            <div className="flex-1 flex flex-col items-center justify-between p-6 overflow-hidden relative">
              {/* Status Header */}
              <div className="text-center space-y-1 z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-neutral-300 font-mono">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      botState === 'listening'
                        ? 'bg-amber-400 animate-ping'
                        : botState === 'speaking'
                        ? 'bg-emerald-400 animate-pulse'
                        : 'bg-cyan-400'
                    }`}
                  />
                  <span>
                    {botState === 'listening'
                      ? 'Listening to your voice...'
                      : botState === 'speaking'
                      ? 'Speaking in sweet Hindi register...'
                      : botState === 'thinking'
                      ? 'Analyzing query...'
                      : 'Tap mic or speak anytime'}
                  </span>
                </div>
              </div>

              {/* Fluid Sound Wave Orb Canvas Centerpiece */}
              <div
                className="relative my-auto flex items-center justify-center cursor-pointer group"
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  } else {
                    toggleListening();
                  }
                }}
                title={isSpeaking ? 'Tap to interrupt speech' : 'Tap to speak'}
              >
                <canvas
                  ref={orbCanvasRef}
                  width={280}
                  height={280}
                  className="rounded-full transition-transform duration-300 group-hover:scale-105"
                />

                {/* Center Mic Icon Indicator inside Orb */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {isListening ? (
                    <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md border border-amber-400/60 flex items-center justify-center text-amber-300 animate-pulse">
                      <Mic size={26} />
                    </div>
                  ) : isSpeaking ? (
                    <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md border border-emerald-400/60 flex items-center justify-center text-emerald-300 animate-bounce">
                      <Volume2 size={26} />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Mic size={22} />
                    </div>
                  )}
                </div>
              </div>

              {/* Real-Time Live Transcript Stream */}
              <div className="w-full max-w-sm text-center min-h-[54px] flex items-center justify-center z-10 px-3">
                {liveTranscript ? (
                  <p className="text-xs sm:text-sm text-neutral-200 font-sans leading-relaxed animate-pulse">
                    &ldquo;{liveTranscript}&rdquo;
                  </p>
                ) : messages.length > 0 ? (
                  <p className="text-xs text-neutral-400 line-clamp-2 font-sans">
                    {messages[messages.length - 1].text.slice(0, 110)}...
                  </p>
                ) : (
                  <p className="text-xs text-neutral-500 font-sans">
                    Ask: &ldquo;Tell me about Sajal&apos;s role at Urban Company&rdquo;
                  </p>
                )}
              </div>

              {/* Bottom Quick Voice Controls */}
              <div className="w-full flex items-center justify-center gap-4 pt-2 z-10">
                <button
                  onClick={toggleListening}
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all ${
                    isListening
                      ? 'bg-amber-400 text-black shadow-[0_0_25px_rgba(251,191,36,0.6)] scale-110'
                      : 'bg-gradient-to-r from-[#ff9a3c] to-[#ea580c] text-black hover:scale-105 shadow-[0_0_20px_rgba(255,154,60,0.4)]'
                  }`}
                  title={isListening ? 'Stop listening' : 'Start voice conversation'}
                >
                  {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                </button>

                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="px-4 py-2 rounded-full bg-red-500/20 border border-red-500/50 text-red-300 text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-red-500/30 transition-all"
                  >
                    <VolumeX size={14} />
                    <span>Interrupt</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* MODE 2: DOSSIER CARDS HISTORY VIEW */}
          {activeTab === 'cards' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {msg.sender === 'user' ? (
                    <div className="max-w-[85%] bg-gradient-to-r from-[#ff9a3c] to-[#ea580c] text-[#120e0a] px-4 py-3 rounded-2xl rounded-tr-xs text-xs font-mono font-bold shadow-lg">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="max-w-[95%] bg-[#1a120c] border border-white/15 rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-2xl space-y-3">
                      {msg.badge && (
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-[10px] font-mono font-bold text-[#ff9a3c] uppercase tracking-wider">
                            {msg.badge}
                          </span>
                          <span className="text-[10px] text-neutral-500">{msg.timestamp}</span>
                        </div>
                      )}

                      {msg.title && (
                        <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                          <Sparkles size={14} className="text-[#ff9a3c]" />
                          <span>{msg.title}</span>
                        </h4>
                      )}

                      <div className="text-xs text-neutral-300 font-sans leading-relaxed whitespace-pre-line">
                        {msg.text}
                      </div>

                      {/* Structured KPI Callout Grid */}
                      {msg.kpis && msg.kpis.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                          {msg.kpis.map((kpi, kIdx) => (
                            <div
                              key={kIdx}
                              className="bg-white/5 border border-white/10 p-2 rounded-xl text-center"
                            >
                              <div className="text-xs font-mono font-black text-[#ff9a3c]">
                                {kpi.value}
                              </div>
                              <div className="text-[9px] font-mono text-neutral-400 mt-0.5">
                                {kpi.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Highlight Chips */}
                      {msg.highlights && msg.highlights.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          {msg.highlights.map((hl, hIdx) => (
                            <div
                              key={hIdx}
                              className="flex items-start gap-2 text-[11px] text-neutral-300 font-sans"
                            >
                              <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                              <span>{hl}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Interactive Action Buttons */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                          {msg.actions.map((act, aIdx) => (
                            <button
                              key={aIdx}
                              onClick={() => handleActionClick(act)}
                              className="px-3 py-1.5 rounded-xl bg-white/8 hover:bg-[#ff9a3c] hover:text-[#120e0a] border border-white/15 text-[11px] font-mono text-neutral-200 transition-all flex items-center gap-1.5 shadow-sm"
                            >
                              {act.icon === 'download' && <Download size={12} />}
                              {act.icon === 'mail' && <Mail size={12} />}
                              {act.icon === 'phone' && <Phone size={12} />}
                              {act.icon === 'scroll' && <ChevronRight size={12} />}
                              <span>{act.label}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Footer: Voice Narration & Copy */}
                      <div className="flex items-center justify-between pt-2 text-[10px] text-neutral-500 border-t border-white/5">
                        <button
                          onClick={() => speakFemaleHindiTone(msg.text, msg.id)}
                          className={`flex items-center gap-1.5 transition-colors ${
                            currentSpeakingId === msg.id && isSpeaking
                              ? 'text-emerald-400 font-bold'
                              : 'hover:text-[#ff9a3c]'
                          }`}
                        >
                          {currentSpeakingId === msg.id && isSpeaking ? (
                            <>
                              <VolumeX size={12} />
                              <span>Stop Voice</span>
                            </>
                          ) : (
                            <>
                              <Volume2 size={12} />
                              <span>Listen in Voice</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => copyMessageText(msg.text, msg.id)}
                          className="flex items-center gap-1 hover:text-white transition-colors"
                        >
                          <Copy size={11} />
                          <span>{copiedId === msg.id ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-2xl max-w-[140px]">
                  <span className="w-2 h-2 rounded-full bg-[#ff9a3c] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#ff9a3c] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#ff9a3c] animate-bounce [animation-delay:0.4s]" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Bottom Chat Input Bar */}
          <div className="p-3 bg-[#160f0a] border-t border-white/15 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                processQuery(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Urban Company, Elexoplus, GenAI, projects..."
                className="flex-1 bg-black/60 border border-white/15 focus:border-[#ff9a3c] rounded-2xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 outline-none font-mono transition-colors"
              />

              {/* Mic Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-2xl transition-all ${
                  isListening
                    ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                    : 'bg-white/8 text-neutral-300 hover:text-white hover:bg-white/15 border border-white/10'
                }`}
                title={isListening ? 'Listening...' : 'Voice input'}
              >
                <Mic size={16} />
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 rounded-2xl bg-[#ff9a3c] hover:bg-[#ea580c] disabled:opacity-40 disabled:hover:bg-[#ff9a3c] text-[#120e0a] font-black transition-all shadow-md"
                title="Send query"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Launcher Pill */}
      {!isOpen && (
        <button
          onClick={() => {
            soundEngine.playWhoosh();
            setIsOpen(true);
          }}
          className="group relative flex items-center gap-3 px-5 py-3.5 rounded-3xl bg-gradient-to-r from-[#1c120a]/95 via-[#140d08]/95 to-[#1c120a]/95 backdrop-blur-2xl border border-white/20 hover:border-[#ff9a3c]/60 shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(255,154,60,0.3)] transition-all hover:scale-105 active:scale-95"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#ff9a3c] to-[#ea580c] flex items-center justify-center text-[#120e0a] font-black shadow-md">
              <Sparkles size={17} className="text-[#120e0a]" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#140d08] animate-pulse" />
          </div>

          <div className="text-left">
            <div className="text-xs font-extrabold text-white tracking-wide font-mono flex items-center gap-1.5">
              <span>Sajal&apos;s Assistant</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff9a3c]" />
            </div>
            <div className="text-[10px] text-neutral-400 font-sans">
              Voice & Portfolio Intelligence
            </div>
          </div>
        </button>
      )}
    </div>
  );
};

export default SmartBot;