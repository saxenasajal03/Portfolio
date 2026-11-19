import React, { useState, useRef, useEffect } from 'react';
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
  Sparkle,
  Copy
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
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null);

  // Live Speech Recognition (Microphone like Gemini Live)
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcriptPreview, setTranscriptPreview] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-msg',
      sender: 'bot',
      title: "Hello! Welcome to Sajal Saxena's Dossier",
      badge: "Professional Portfolio Intelligence",
      text:
        "नमस्ते! I am **Sajal's Assistant**.\n\n" +
        "Sajal Saxena is a **Full-Stack Software Engineer** and **Business Development Associate** in Urban Company's Central SBC Quality team in New Delhi. He specializes in enterprise React/Node architecture, operational root-cause analysis (RCA), and SLA compliance.\n\n" +
        "You can explore:\n" +
        "• **Urban Company Operations** (SLA Governance, Real-Time Attendance >80%, Jarvis SQL)\n" +
        "• **Flagship Engineering Systems** (Elexoplus D2C/B2B ERP, ConnectX WebRTC, Plant Leaf CNN Classifier)\n" +
        "• **Credentials** (Oracle 2025 GenAI Professional, React 19, TypeScript, Three.js, Python)",
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
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Female Hindi-Toned Speech Synthesizer
  const speakFemaleHindiTone = (text: string, messageId: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (currentSpeakingId === messageId && isSpeaking) {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
      return;
    }

    const cleanSpeech = text
      .replace(/[#*`_~]/g, '')
      .replace(/\(https?:\/\/[^\)]+\)/g, '')
      .replace(/\[([^\]]+)\]/g, '$1')
      .replace(/•/g, ', ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    // Use Hindi or Indian female voice synthesis
    utterance.lang = 'hi-IN';
    utterance.pitch = 1.2; // Natural pleasant sweet female voice register
    utterance.rate = 0.94; // Clear, polite pacing

    const voices = window.speechSynthesis.getVoices();
    // Prioritize female Hindi or Indian voices
    const femaleVoice = voices.find(
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

  const copyMessageText = (text: string, id: string) => {
    soundEngine.playTick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Live Speech Recognition
  const toggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setTranscriptPreview('');
      return;
    }

    stopSpeaking();
    soundEngine.playResonance();
    setIsListening(true);
    setTranscriptPreview('Listening live...');

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const finalTranscript = event.results[i][0].transcript;
          setIsListening(false);
          setTranscriptPreview('');
          processQuery(finalTranscript);
          return;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setTranscriptPreview(interim);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setTranscriptPreview('');
    };

    recognition.onend = () => {
      setIsListening(false);
      setTranscriptPreview('');
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const generateResponse = (query: string): Omit<Message, 'id' | 'sender' | 'timestamp'> => {
    const lq = query.toLowerCase();
    const isHindi = /[\u0900-\u097F]/.test(query) || lq.includes('kaun') || lq.includes('kya') || lq.includes('batao') || lq.includes('kaise');

    // Urban Company
    if (lq.includes('urban') || lq.includes('experience') || lq.includes('job') || lq.includes('role') || lq.includes('quality') || lq.includes('sla') || lq.includes('अर्बन') || lq.includes('काम')) {
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

    // Projects
    if (lq.includes('project') || lq.includes('elexoplus') || lq.includes('connectx') || lq.includes('cnn') || lq.includes('billing') || lq.includes('प्रोजेक्ट')) {
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

    // Skills & Certifications
    if (lq.includes('skill') || lq.includes('stack') || lq.includes('cert') || lq.includes('oracle') || lq.includes('genai') || lq.includes('हुनर')) {
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

    // Contact
    if (lq.includes('contact') || lq.includes('email') || lq.includes('phone') || lq.includes('hire') || lq.includes('interview') || lq.includes('संपर्क') || lq.includes('बात')) {
      return {
        title: 'Direct Coordinates & Availability',
        badge: 'Available for Discussions',
        text:
          'Sajal Saxena is available for engineering and cross-functional operations discussions:\n\n' +
          '• **Primary Email**: [sajalsaxenagola@gmail.com](mailto:sajalsaxenagola@gmail.com)\n' +
          '• **Direct Phone / WhatsApp**: [+91 88408 10386](tel:+918840810386)\n' +
          '• **LinkedIn**: [linkedin.com/in/sajal-saxena-cse/](https://www.linkedin.com/in/sajal-saxena-cse/)\n' +
          '• **Current Hub**: Ghitorni, New Delhi (Urban Company HQ) / Gola Gokarannath, UP (PIN: 262802)',
        kpis: [
          { label: 'Response Time', value: '< 2 Hours' },
          { label: 'Direct Phone', value: '+91 88408 10386' },
          { label: 'Location', value: 'New Delhi / Remote' }
        ],
        highlights: [
          'Immediate availability for technical discussions',
          'One-click official resume PDF download below',
          'Direct calendar and email triggers active'
        ],
        actions: [
          { label: 'Send Direct Email', icon: 'mail', target: 'mailto:sajalsaxenagola@gmail.com' },
          { label: 'Call on Phone', icon: 'phone', target: 'tel:+918840810386' },
          { label: 'Download Resume PDF', icon: 'download' }
        ]
      };
    }

    // Default Overview
    return {
      title: 'Candidate Profile & Executive Summary',
      badge: 'Full-Stack Engineer & BDA · Urban Company',
      text:
        'Sajal Saxena bridges high-level web engineering with operational analytical rigor:\n\n' +
        '• **Engineering Rigor**: B.Tech CSE (2021–2025) from Dev Bhoomi Uttarakhand University (DBUU); certified Generative AI Professional by Oracle Cloud (OCI 2025).\n' +
        '• **Operational Leadership**: Manages Tier 1/2 escalations and governs service cohort performance exceeding 80% Real-Time Attendance at Urban Company.\n' +
        '• **Systems Portfolio**: Delivered full-stack commerce suites (Elexoplus), sub-100ms WebRTC communication (ConnectX), and 95%+ computer vision classifiers (Plant Leaf CNN).',
      kpis: [
        { label: 'Primary Role', value: 'BDA · Central Quality' },
        { label: 'Company', value: 'Urban Company' },
        { label: 'Education', value: 'B.Tech CSE (DBUU)' }
      ],
      highlights: [
        'Balanced competency across technical design and data-driven operations',
        'Demonstrated leadership as appointed UGC NEP Saarthi Student Ambassador',
        'Available for full-time engineering and cross-functional operations roles'
      ],
      actions: [
        { label: 'View Experience Section', icon: 'scroll', target: '#experience' },
        { label: 'Inspect Projects', icon: 'scroll', target: '#projects' },
        { label: 'Download Official Resume', icon: 'download' }
      ]
    };
  };

  const processQuery = async (queryText: string) => {
    const raw = queryText.trim();
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

    const answer = generateResponse(raw);

    setTimeout(() => {
      const botMsgId = String(Date.now() + 1);
      const botMsg: Message = {
        id: botMsgId,
        sender: 'bot',
        title: answer.title,
        badge: answer.badge,
        text: answer.text,
        kpis: answer.kpis,
        highlights: answer.highlights,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: answer.actions,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      soundEngine.playTick();

      if (voiceEnabled) {
        setTimeout(() => {
          speakFemaleHindiTone(answer.text, botMsgId);
        }, 300);
      }
    }, 320);
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
    } else if (action.target?.startsWith('mailto:') || action.target?.startsWith('tel:')) {
      window.location.href = action.target;
    }
  };

  const quickPills = [
    { label: 'Urban Company SLA & Role', query: 'Tell me about Sajal\'s experience and SLA metrics at Urban Company' },
    { label: 'Full-Stack Projects & ERP', query: 'What are Sajal\'s main projects and tech stacks?' },
    { label: 'Oracle GenAI Certification', query: 'What are Sajal\'s technical skills and Oracle GenAI certification?' },
    { label: 'Direct Contacts & Resume', query: 'How can I contact Sajal and download resume?' }
  ];

  return (
    <div className="fixed bottom-5 right-5 z-40 font-mono">
      {/* Bot Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[94vw] sm:w-[480px] h-[630px] max-h-[88vh] bg-[#120d09]/96 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(255,154,60,0.25)] flex flex-col overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#1c130d] via-[#160f0a] to-[#1c130d] border-b border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff9a3c] to-[#e66a1f] text-[#130e09] font-black flex items-center justify-center text-sm shadow-lg">
                  <Sparkles size={18} className="text-[#130e09]" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#160f0a]" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white tracking-wide flex items-center gap-2 font-mono">
                  Sajal&apos;s Assistant
                </h4>
                <p className="text-[11px] text-neutral-400 font-sans">
                  Portfolio Intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Voice Speech Toggle */}
              <button
                onClick={() => {
                  soundEngine.playTick();
                  if (isSpeaking) stopSpeaking();
                  setVoiceEnabled((prev) => !prev);
                }}
                className={`p-2 rounded-xl border text-xs transition-all flex items-center gap-1.5 ${
                  voiceEnabled
                    ? 'bg-[#ff9a3c]/25 border-[#ff9a3c] text-[#ff9a3c] shadow-[0_0_12px_rgba(255,154,60,0.3)]'
                    : 'bg-white/5 border-white/10 text-neutral-500'
                }`}
                title={voiceEnabled ? 'Voice narration active' : 'Voice narration muted'}
              >
                {voiceEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                <span className="text-[10px] font-bold hidden sm:inline">
                  {voiceEnabled ? 'Voice ON' : 'Muted'}
                </span>
              </button>

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
          <div className="px-4 py-2 bg-[#18110b] border-b border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
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

          {/* Live Microphone Listening Banner */}
          {isListening && (
            <div className="p-4 bg-gradient-to-r from-[#2a1708] via-[#1e130c] to-[#2a1708] border-b border-[#ff9a3c]/40 flex items-center gap-3 animate-pulse">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#ff9a3c]/20">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff9a3c] opacity-75"></span>
                <Mic size={18} className="text-[#ff9a3c] relative z-10" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] text-[#ff9a3c] font-bold uppercase tracking-wider flex items-center gap-2">
                  <span>Listening Live (Speak naturally)...</span>
                </div>
                <div className="text-xs text-white italic font-sans truncate">
                  {transcriptPreview || 'Awaiting voice input...'}
                </div>
              </div>
              <button
                onClick={toggleListening}
                className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 text-[11px] hover:bg-red-500/30 font-mono"
              >
                Stop
              </button>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-[#ff9a3c]/20 border border-[#ff9a3c]/40 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Sparkle size={14} className="text-[#ff9a3c]" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-2xl p-4 space-y-3 relative ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-[#ff9a3c] to-[#e66a1f] text-[#130e09] font-semibold shadow-lg'
                      : 'bg-[#18110b] border border-white/12 text-neutral-200 shadow-md'
                  }`}
                >
                  {/* Bot Message Header */}
                  {m.sender === 'bot' && (
                    <div className="border-b border-white/10 pb-2 mb-1 flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-[#ff9a3c] uppercase tracking-wider block font-bold">
                          {m.badge || "Sajal's Assistant"}
                        </span>
                        <h5 className="font-bold text-white text-xs sm:text-sm font-sans tracking-tight mt-0.5">
                          {m.title}
                        </h5>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Copy Button */}
                        <button
                          onClick={() => copyMessageText(m.text, m.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white bg-white/5 border border-white/10"
                          title="Copy response"
                        >
                          {copiedId === m.id ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        </button>

                        {/* Read Aloud Button */}
                        <button
                          onClick={() => speakFemaleHindiTone(m.text, m.id)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1.5 transition-all ${
                            currentSpeakingId === m.id
                              ? 'bg-[#10b981]/25 text-[#10b981] border border-[#10b981]/50 animate-pulse font-bold'
                              : 'text-neutral-400 hover:text-white bg-white/5 border border-white/10 hover:border-white/20'
                          }`}
                          title="Listen with voice narration"
                        >
                          <Volume2 size={12} />
                          <span>{currentSpeakingId === m.id ? 'Speaking...' : 'Listen'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="text-xs sm:text-[13px] space-y-2 leading-relaxed font-sans whitespace-pre-wrap text-neutral-200">
                    {m.text}
                  </div>

                  {/* KPI Tiles */}
                  {m.kpis && m.kpis.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-2 border-t border-white/10">
                      {m.kpis.map((kpi, kIdx) => (
                        <div key={kIdx} className="bg-black/50 border border-white/10 p-2 rounded-xl text-center">
                          <span className="text-[9px] font-mono text-neutral-400 uppercase block">{kpi.label}</span>
                          <span className="text-xs font-bold text-[#ff9a3c] font-mono">{kpi.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Key Highlights Bullet Cards */}
                  {m.highlights && m.highlights.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      <span className="text-[10px] font-mono uppercase text-[#ff9a3c] block font-bold">
                        KEY HIGHLIGHTS:
                      </span>
                      {m.highlights.map((h, hIdx) => (
                        <div
                          key={hIdx}
                          className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/8 text-[11px] text-white"
                        >
                          <CheckCircle2 size={13} className="text-[#10b981] shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Interactive Action Buttons */}
                  {m.actions && m.actions.length > 0 && (
                    <div className="pt-2.5 border-t border-white/10 flex flex-wrap gap-2 font-mono">
                      {m.actions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => handleActionClick(act)}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#ff9a3c] hover:text-[#130e09] text-[11px] text-neutral-200 transition-all flex items-center gap-1.5 border border-white/15 hover:border-[#ff9a3c] shadow-sm font-semibold"
                        >
                          {act.icon === 'download' && <Download size={12} />}
                          {act.icon === 'linkedin' && <ExternalLink size={12} />}
                          {act.icon === 'mail' && <Mail size={12} />}
                          {act.icon === 'phone' && <Phone size={12} />}
                          {act.icon === 'scroll' && <ChevronRight size={12} className="text-[#ff9a3c]" />}
                          <span>{act.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <span
                    className={`block text-[9px] mt-1.5 text-right font-mono ${
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
                <span className="w-2 h-2 rounded-full bg-[#ff9a3c] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#ff9a3c] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#ff9a3c] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] ml-1">Reviewing portfolio knowledge...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3.5 bg-[#18110b] border-t border-white/15 space-y-2">
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
                maxLength={300}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Urban Company, projects, or hire Sajal..."
                className="flex-1 bg-white/6 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#ff9a3c] transition-colors"
              />

              {/* Live Microphone Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-xl border transition-all ${
                  isListening
                    ? 'bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-bounce'
                    : 'bg-white/10 text-[#ff9a3c] border-white/15 hover:bg-white/20'
                }`}
                title="Speak to Assistant (Voice Input)"
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-[#ff9a3c] text-[#130e09] hover:bg-[#ffb066] disabled:opacity-40 disabled:hover:bg-[#ff9a3c] transition-colors font-bold shadow-md"
                title="Send query"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Launcher Button - Simple & Elegant */}
      <button
        onClick={() => {
          soundEngine.playTick();
          setIsOpen((prev) => !prev);
        }}
        className="group flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-[#1c130d] via-[#261910] to-[#1c130d] hover:from-[#261910] hover:to-[#332115] border border-white/20 hover:border-[#ff9a3c] text-white shadow-[0_12px_30px_rgba(0,0,0,0.85),0_0_25px_rgba(255,154,60,0.3)] transition-all duration-300 active:scale-95"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-[#ff9a3c] text-[#130e09] flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-110 transition-transform">
            <MessageSquare size={16} />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black animate-pulse" />
        </div>
        <div className="flex flex-col text-left font-mono">
          <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
            Sajal&apos;s Assistant
            <Sparkles size={12} className="text-[#ff9a3c]" />
          </span>
          <span className="text-[10px] text-neutral-300 font-sans">Voice AI Active</span>
        </div>
      </button>
    </div>
  );
};

export default SmartBot;
