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
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  CheckCircle2,
  Building2,
  GraduationCap,
  Sparkle
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
  const recognitionRef = useRef<any>(null);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      title: 'नमस्ते जी! सजल के AI कॉपायलट में आपका स्वागत है',
      badge: 'सजल सक्सेना · पर्सनल AI असिस्टेंट',
      text:
        'नमस्ते! मैं सजल सक्सेना की पर्सनल AI असिस्टेंट हूँ। मैं आपको सजल के काम, उनकी स्किल्स, और उनके प्रोजेक्ट्स के बारे में बहुत ही आसान और स्पष्ट हिंदी में बताऊँगी।\n\nआप मुझसे बोलकर या लिखकर कुछ भी पूछ सकते हैं, जैसे कि:\n• सजल अर्बन कंपनी में क्या काम करते हैं?\n• उनके बनाए मुख्य प्रोजेक्ट्स (Elexoplus, ConnectX) क्या हैं?\n• उनके पास कौन-कौन से मुख्य सर्टिफिकेशन्स हैं?',
      highlights: [
        'अर्बन कंपनी: सेंट्रल SBC क्वालिटी टीम (RT Attendance >80%)',
        'प्रोजेक्ट्स: Elexoplus ई-कॉमर्स व ERP, ConnectX वीडियो कॉलिंग',
        'शिक्षा व सर्टिफिकेशन: B.Tech CSE (DBUU) · Oracle 2025 GenAI Pro',
      ],
      timestamp: 'Active',
      actions: [
        { label: 'अर्बन कंपनी का काम', icon: 'scroll', target: '#experience' },
        { label: '3D एडवेंचर सिटी देखें', icon: 'scroll', target: '#metaverse-city' },
        { label: 'रिज्यूमे डाउनलोड करें', icon: 'download' },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Female Hindi Speech Synthesizer
  const speakFemaleHindi = (text: string, messageId: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (currentSpeakingId === messageId && isSpeaking) {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
      return;
    }

    // Clean text for sweet, natural pronunciation
    const cleanSpeech = text
      .replace(/[#*`_~]/g, '')
      .replace(/\(https?:\/\/[^\)]+\)/g, '')
      .replace(/\[([^\]]+)\]/g, '$1')
      .replace(/•/g, ', ')
      .replace(/Elexoplus/gi, 'एलेक्सो-प्लस')
      .replace(/ConnectX/gi, 'कनेक्ट-एक्स')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.lang = 'hi-IN';
    // Slightly elevated pitch & natural smooth rate for a sweet, polite female voice
    utterance.pitch = 1.18;
    utterance.rate = 0.94;

    const voices = window.speechSynthesis.getVoices();
    // Prioritize female Hindi voices if available
    const femaleHindi = voices.find(
      (v) =>
        (v.lang.includes('hi') || v.lang.includes('Hindi')) &&
        (v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('kalpana') ||
          v.name.toLowerCase().includes('swara') ||
          v.name.toLowerCase().includes('zira') ||
          v.name.toLowerCase().includes('google हिन्दी'))
    ) || voices.find((v) => v.lang.includes('hi') || v.lang.includes('Hindi'));

    if (femaleHindi) {
      utterance.voice = femaleHindi;
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

  // Live Speech-to-Text Recognition (Gemini Live Microphone UI)
  const toggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('आपके ब्राउज़र में माइक्रोफ़ोन स्पीच रिकॉग्निशन सपोर्ट नहीं है। कृपया टाइप करके पूछें।');
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
    setTranscriptPreview('सुन रही हूँ, कृपया बोलिए...');

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Prioritize Hindi voice input
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

  // High-accuracy clear Hindi knowledge generator
  const generateClearHindiAnswer = (q: string): Omit<Message, 'id' | 'sender' | 'timestamp'> => {
    const lq = q.toLowerCase();

    // Urban Company Experience Query
    if (lq.includes('urban') || lq.includes('कंपनी') || lq.includes('काम') || lq.includes('job') || lq.includes('experience') || lq.includes('quality') || lq.includes('sla')) {
      return {
        title: 'अर्बन कंपनी में सजल का रोल और जिम्मेदारियाँ',
        badge: 'वर्तमान पद · घिटोरनी, नई दिल्ली',
        text:
          'सजल सक्सेना वर्तमान में अर्बन कंपनी की सेंट्रल SBC क्वालिटी टीम में Business Development Associate के रूप में कार्यरत हैं (अप्रैल 2026 से वर्तमान):\n\n' +
          '• **Tier 1 व Tier 2 एस्केलेशंस का समाधान**: पार्टनर्स और सर्विस से जुड़ी गंभीर समस्याओं का रूट-कॉज़ एनालिसिस (RCA) करके तुरंत समाधान निकालते हैं।\n' +
          '• **पार्टनर अटेंडेंस 80%+**: अपने पूरे रीजन में सर्विस पार्टनर्स की रियल-टाइम (RT) अटेंडेंस हमेशा 80% से ऊपर बनाए रखते हैं।\n' +
          '• **जार्विस एनालिटिक्स व SQL**: आधुनिक SQL क्वेरीज़ और जार्विस डैशबोर्ड द्वारा SLA और क्वालिटी मैट्रिक्स की 24/7 निगरानी करते हैं।\n' +
          '• **AI हैंडहोल्डिंग पायलट लीड**: पार्टनर्स की डिजिटल ट्रेनिंग और एआई ऑटोमेशन प्रोजेक्ट्स का नेतृत्व करते हैं।',
        highlights: [
          '80% से अधिक रियल-टाइम अटेंडेंस का रिकॉर्ड',
          'SLA और क्वालिटी की डेटा-ड्रिवन मॉनिटरिंग',
          'पार्टनर अपग्रेड्स और AI हैंडहोल्डिंग का सफल संचालन',
        ],
        actions: [
          { label: 'अर्बन कंपनी सेक्शन देखें', icon: 'scroll', target: '#experience' },
          { label: 'लिंक्डइन प्रोफाइल देखें', icon: 'linkedin' },
        ],
      };
    }

    // Projects Query
    if (lq.includes('project') || lq.includes('elexoplus') || lq.includes('connectx') || lq.includes('leaf') || lq.includes('प्रोजेक्ट') || lq.includes('सिस्टम')) {
      return {
        title: 'सजल के 4 मुख्य इंजीनियरिंग प्रोजेक्ट्स',
        badge: 'फुल-स्टैक, AI और रियल-टाइम सिस्टम्स',
        text:
          'सजल ने इंडस्ट्री-लेवल के 4 बेहतरीन प्रोजेक्ट्स बनाए हैं:\n\n' +
          '1. **Elexoplus Commerce & ERP Suite**:\nयह एक कम्प्लीट ई-कॉमर्स व होलसेल ईआरपी सिस्टम है जिसमें D2C स्टोर (elexoplus.com) और B2B होलसेल पोर्टल (b2b.elexoplus.com) दोनों शामिल हैं।\n\n' +
          '2. **ConnectX Real-Time Video Calling**:\nWebRTC और Socket.io पर आधारित हाई-स्पीड पीयर-टू-पीयर वीडियो कॉलिंग व चैटिंग ऐप (लेटेंसी 100ms से भी कम)।\n\n' +
          '3. **Plant Leaf Disease Identifier (CNN)**:\nपौधों की पत्तियों के रोगों की 95%+ सटीकता से पहचान करने वाला डीप लर्निंग AI मॉडल (TensorFlow/Python/OpenCV)।\n\n' +
          '4. **Electricity Bill Management System**:\nजावा (Swing/AWT) और माइक्रोसॉफ्ट SQL सर्वर पर बना सिक्योर डेस्कटॉप बिलिंग सॉफ्टवेयर।',
        highlights: [
          'Elexoplus: लाइव D2C व B2B ईआरपी सिस्टम',
          'ConnectX: सब-100ms लेटेंसी वाला वीडियो मेश',
          'AI प्लांट मॉडल: 95% से अधिक टेस्टेड एक्यूरेसी',
        ],
        actions: [
          { label: 'प्रोजेक्ट्स सेक्शन देखें', icon: 'scroll', target: '#projects' },
          { label: '3D सिटी में घूमें', icon: 'scroll', target: '#metaverse-city' },
        ],
      };
    }

    // Skills & Certifications Query
    if (lq.includes('skill') || lq.includes('tech') || lq.includes('cert') || lq.includes('ज्ञान') || lq.includes('हुनर') || lq.includes('ओरेकल') || lq.includes('oracle')) {
      return {
        title: 'तकनीकी दक्षता एवं राष्ट्रीय सर्टिफिकेशन्स',
        badge: 'वेब, AI व डेटाबेस स्पेशलिस्ट',
        text:
          'सजल के पास मॉडर्न सॉफ्टवेयर इंजीनियरिंग और ऑपरेशन्स का मजबूत अनुभव है:\n\n' +
          '• **प्रोग्रामिंग भाषाएँ**: JavaScript (ES6+), TypeScript, Python, Java, PHP 8, HTML5, CSS3\n' +
          '• **फ्रेमवर्क्स**: React 19, Node.js, Express.js, Tailwind CSS v4, Three.js WebGL, TensorFlow\n' +
          '• **डेटाबेस व एनालिटिक्स**: MySQL, MongoDB, Microsoft SQL Server, जार्विस एनालिटिक्स, एडवांस्ड एक्सेल\n' +
          '• **प्रमुख सर्टिफिकेशन्स**:\n  - Oracle Cloud (OCI) 2025 Certified Generative AI Professional\n  - HackerRank 5-Star Python व SQL सर्टिफाइड\n  - Infosys व ICT Academy Java सर्टिफाइड\n  - Lakshagriha हैकथॉन 1.0 फाइनलिस्ट (DBUU)',
        highlights: [
          'Oracle Certified GenAI Professional (2025)',
          'HackerRank 5-स्टार वेरिफाइड कोडर',
          'फुल-स्टैक व Three.js 3D वेब का गहरा अनुभव',
        ],
        actions: [
          { label: 'स्किल्स मैट्रिक्स देखें', icon: 'scroll', target: '#skills' },
          { label: 'सर्टिफिकेशन्स देखें', icon: 'scroll', target: '#skills' },
        ],
      };
    }

    // Education & Roots Query
    if (lq.includes('college') || lq.includes('study') || lq.includes('education') || lq.includes('school') || lq.includes('पढ़ाई') || lq.includes('कॉलेज') || lq.includes('कहाँ') || lq.includes('रहते')) {
      return {
        title: 'सजल का शैक्षणिक बैकग्राउंड एवं मूल स्थान',
        badge: 'B.Tech CSE (2021-2025) · UGC NEP सारथी',
        text:
          'सजल की शैक्षणिक यात्रा और मूल निवास:\n\n' +
          '• **B.Tech (कंप्यूटर साइंस इंजीनियरिंग)**: देव भूमि उत्तराखंड यूनिवर्सिटी (DBUU), देहरादून से 2021-2025 में पूर्ण।\n' +
          '• **UGC NEP सारथी**: विश्वविद्यालय अनुदान आयोग (UGC) द्वारा राष्ट्रीय शिक्षा नीति (NEP 2020) के नियुक्त स्टूडेंट एंबेसडर।\n' +
          '• **स्कूली शिक्षा**: चिल्ड्रन्स एकेडमी सीनियर सेकेंडरी स्कूल, गोला गोकर्णनाथ से 10वीं और 12वीं (PCM/साइंस) सीबीएसई से पूर्ण।\n' +
          '• **मूल स्थान**: गोला गोकर्णनाथ (लखीमपुर खीरी), उत्तर प्रदेश (पिन: 262802)। वर्तमान में घिटोरनी, नई दिल्ली में अर्बन कंपनी के लिए कार्यरत।',
        highlights: [
          'देव भूमि उत्तराखंड यूनिवर्सिटी से B.Tech CSE',
          'UGC नियुक्त NEP सारथी एंबेसडर',
          'मूल निवासी: गोला गोकर्णनाथ, यूपी (262802)',
        ],
        actions: [
          { label: '3D इंडिया मैप पर देखें', icon: 'scroll', target: '#spatial-india' },
          { label: 'एजुकेशन सेक्शन देखें', icon: 'scroll', target: '#education' },
        ],
      };
    }

    // Contact Coordinates Query
    if (lq.includes('contact') || lq.includes('email') || lq.includes('phone') || lq.includes('बात') || lq.includes('संपर्क') || lq.includes('फोन') || lq.includes('नंबर')) {
      return {
        title: 'सजल सक्सेना से सीधा संपर्क',
        badge: '24/7 डायरेक्ट टेलीमेट्री',
        text:
          'आप सजल से सीधे इन माध्यमों से जुड़ सकते हैं:\n\n' +
          '• **ईमेल**: sajalsaxenagola@gmail.com\n' +
          '• **फोन / व्हाट्सऐप**: +91 88408 10386\n' +
          '• **लिंक्डइन**: linkedin.com/in/sajal-saxena-cse/\n' +
          '• **स्थान**: घिटोरनी, नई दिल्ली / गोला गोकर्णनाथ, उत्तर प्रदेश (पिन: 262802)',
        highlights: [
          'ईमेल पर सीधा संदेश भेजें',
          'व्हाट्सऐप या कॉल द्वारा तत्काल संपर्क',
          'लिंक्डइन नेटवर्क पर 1-क्लिक कनेक्शन',
        ],
        actions: [
          { label: 'ईमेल भेजें', icon: 'mail', target: 'mailto:sajalsaxenagola@gmail.com' },
          { label: 'सीधे कॉल करें', icon: 'phone', target: 'tel:+918840810386' },
        ],
      };
    }

    // General Natural Overview Response
    return {
      title: 'सजल सक्सेना का संक्षिप्त परिचय',
      badge: 'सॉफ्टवेयर इंजीनियर व BDA (अर्बन कंपनी)',
      text:
        'सजल सक्सेना एक बेहद प्रतिभाशाली **Full-Stack Software Engineer** और अर्बन कंपनी की **Central SBC Quality Team** में **Business Development Associate** हैं।\n\n' +
        'वे ऑपरेशन्स में जटिल समस्याओं का RCA द्वारा तुरंत समाधान निकालते हैं, 80%+ अटेंडेंस बनाए रखते हैं, और साथ ही रिएक्ट, नोड, थ्री-डी Three.js और जनरेटिव AI (Oracle OCI 2025 Certified) के विशेषज्ञ हैं।\n\n' +
        'आप मुझसे उनके प्रोजेक्ट्स (Elexoplus, ConnectX), काम के अनुभव या किसी भी अन्य विषय पर खुलकर पूछ सकते हैं!',
      highlights: [
        'अर्बन कंपनी: सेंट्रल SBC क्वालिटी ऑपरेशन्स',
        'Oracle Cloud OCI GenAI 2025 सर्टिफाइड',
        'B.Tech CSE (देव भूमि उत्तराखंड यूनिवर्सिटी)',
      ],
      actions: [
        { label: 'अर्बन कंपनी का अनुभव', icon: 'scroll', target: '#experience' },
        { label: 'रिज्यूमे डाउनलोड करें', icon: 'download' },
      ],
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

    const answer = generateClearHindiAnswer(raw);

    setTimeout(() => {
      const botMsgId = String(Date.now() + 1);
      const botMsg: Message = {
        id: botMsgId,
        sender: 'bot',
        title: answer.title,
        badge: answer.badge,
        text: answer.text,
        highlights: answer.highlights,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: answer.actions,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      soundEngine.playTick();

      // Automatically speak aloud in the female Hindi voice!
      if (voiceEnabled) {
        setTimeout(() => {
          speakFemaleHindi(answer.text, botMsgId);
        }, 300);
      }
    }, 350);
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

  return (
    <div className="fixed bottom-5 right-5 z-40 font-mono">
      {/* Bot Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[94vw] sm:w-[470px] h-[610px] max-h-[88vh] bg-[#120d09]/96 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(255,154,60,0.25)] flex flex-col overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-[#1c130d] via-[#160f0a] to-[#1c130d] border-b border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff9a3c] to-[#e66a1f] text-[#130e09] font-black flex items-center justify-center text-sm shadow-lg">
                  <Sparkles size={18} className="text-[#130e09]" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#160f0a]" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white tracking-wide flex items-center gap-2 font-mono">
                  सजल AI कॉपायलट
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ff9a3c]/20 text-[#ff9a3c] border border-[#ff9a3c]/40 font-semibold">
                    लाइव हिंदी आवाज़
                  </span>
                </h4>
                <p className="text-[11px] text-neutral-400 font-sans">
                  सजल सक्सेना · पर्सनल असिस्टेंट
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
                title={voiceEnabled ? 'हिंदी आवाज़ चालू है' : 'आवाज़ बंद है'}
              >
                {voiceEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                <span className="text-[10px] font-bold hidden sm:inline">
                  {voiceEnabled ? 'आवाज़ ON' : 'म्यूट'}
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
                title="बंद करें"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Gemini Live Listening Bubble Banner */}
          {isListening && (
            <div className="p-4 bg-gradient-to-r from-[#2a1708] via-[#1e130c] to-[#2a1708] border-b border-[#ff9a3c]/40 flex items-center gap-3 animate-pulse">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#ff9a3c]/20">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff9a3c] opacity-75"></span>
                <Mic size={18} className="text-[#ff9a3c] relative z-10" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] text-[#ff9a3c] font-bold uppercase tracking-wider flex items-center gap-2">
                  <span>लाइव सुन रही हूँ (बोलिए)...</span>
                </div>
                <div className="text-xs text-white italic font-sans truncate">
                  {transcriptPreview || 'आपकी आवाज़ की प्रतीक्षा है...'}
                </div>
              </div>
              <button
                onClick={toggleListening}
                className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 text-[11px] hover:bg-red-500/30"
              >
                रुकें
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
                  <div className="w-7 h-7 rounded-full bg-[#ff9a3c]/20 border border-[#ff9a3c]/40 flex items-center justify-center shrink-0 mt-1">
                    <Sparkle size={14} className="text-[#ff9a3c]" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-2xl p-4 space-y-2.5 relative ${
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
                          {m.badge || 'सजल AI'}
                        </span>
                        <h5 className="font-bold text-white text-xs sm:text-sm font-sans tracking-tight mt-0.5">
                          {m.title}
                        </h5>
                      </div>

                      {/* Listen in sweet female Hindi voice */}
                      <button
                        onClick={() => speakFemaleHindi(m.text, m.id)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1.5 transition-all shrink-0 ${
                          currentSpeakingId === m.id
                            ? 'bg-[#10b981]/25 text-[#10b981] border border-[#10b981]/50 animate-pulse font-bold'
                            : 'text-neutral-400 hover:text-white bg-white/5 border border-white/10 hover:border-white/20'
                        }`}
                        title="मधुर हिंदी आवाज़ में सुनें"
                      >
                        <Volume2 size={12} />
                        <span>{currentSpeakingId === m.id ? 'बोल रही हूँ...' : 'हिंदी में सुनें'}</span>
                      </button>
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="text-xs sm:text-[13px] space-y-2 leading-relaxed font-sans whitespace-pre-wrap text-neutral-200">
                    {m.text}
                  </div>

                  {/* Formatted Key Highlight Cards */}
                  {m.highlights && m.highlights.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      <span className="text-[10px] font-mono uppercase text-[#ff9a3c] block font-bold">
                        मुख्य बिंदु (KEY TELEMETRY):
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

                  {/* Interactive Quick Action Buttons */}
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
                <span className="text-[11px] ml-1">सोच रही हूँ (Processing)...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Gemini Live Listening Wave & Input Bar */}
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
                placeholder="हिंदी या English में पूछें (जैसे: अर्बन कंपनी, प्रोजेक्ट्स)..."
                className="flex-1 bg-white/6 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#ff9a3c] transition-colors"
              />

              {/* Live Gemini Microphone Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-xl border transition-all ${
                  isListening
                    ? 'bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-bounce'
                    : 'bg-white/10 text-[#ff9a3c] border-white/15 hover:bg-white/20'
                }`}
                title="बोलकर पूछें (Live Speech Input)"
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-[#ff9a3c] text-[#130e09] hover:bg-[#ffb066] disabled:opacity-40 disabled:hover:bg-[#ff9a3c] transition-colors font-bold shadow-md"
                title="संदेश भेजें"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Launcher Button */}
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
            सजल AI कॉपायलट
            <Sparkles size={12} className="text-[#ff9a3c]" />
          </span>
          <span className="text-[10px] text-neutral-300 font-sans">लाइव हिंदी आवाज़ में बात करें</span>
        </div>
      </button>
    </div>
  );
};

export default SmartBot;
