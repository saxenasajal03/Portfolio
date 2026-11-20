import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Compass,
  Play,
  Pause,
  Layers,
  ExternalLink,
  Volume2,
  VolumeX,
  Building2,
  Sun,
  Moon,
  Sparkles,
  Navigation
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { getAssetUrl } from '../utils/assets';

export interface CityDistrict {
  id: string;
  name: string;
  codename: string;
  tagline: string;
  color: string;
  accentHex: number;
  buildingHeight: number;
  position: [number, number, number]; // x, y, z
  questTitle: string;
  questDescription: string;
  metrics: string[];
  stack: string[];
  realUrl: string;
  secondaryUrl?: string;
  actionText: string;
  secondaryActionText?: string;
}

const DISTRICTS: CityDistrict[] = [
  {
    id: 'urban-company',
    name: 'Maze Bank / Urban Quality Tower',
    codename: 'SECTOR-01 // URBAN COMPANY HQ',
    tagline: 'Urban Company · Central SBC Quality Team · Ghitorni, New Delhi',
    color: '#ff9a3c',
    accentHex: 0xff9a3c,
    buildingHeight: 18,
    position: [0, 0, 0],
    questTitle: 'RESOLVE TIER 1 & 2 OPERATIONAL ESCALATIONS',
    questDescription:
      'Investigate complex partner bottlenecks through structured root-cause analysis (RCA). Track SLAs, partner compliance, and cohort Real-Time (RT) attendance exceeding 80% using Jarvis SQL analytics.',
    metrics: [
      'RT Attendance Compliance >80%',
      'Tier 1 & Tier 2 Escalations Root-Cause Analysis',
      'Jarvis Analytics & High-Throughput SQL Telemetry',
      'Lead: Partner Upgrades Training & AI Handholding Pilot'
    ],
    stack: ['Jarvis Analytics', 'SQL Queries', 'SLA Engineering', 'Advanced Excel', 'AI Handholding Pilot'],
    realUrl: 'https://www.urbancompany.com/',
    secondaryUrl: 'https://www.linkedin.com/in/sajal-saxena-cse/',
    actionText: 'Visit Urban Company Portal',
    secondaryActionText: 'View Role on LinkedIn'
  },
  {
    id: 'elexoplus',
    name: 'Elexoplus Twin Commerce Towers',
    codename: 'SECTOR-02 // ELEXOPLUS ERP PLAZA',
    tagline: 'Dual Architecture: D2C Storefront + B2B Wholesale Portal',
    color: '#06b6d4',
    accentHex: 0x06b6d4,
    buildingHeight: 15,
    position: [18, 0, -12],
    questTitle: 'SYNCHRONIZE MULTI-TIER WAREHOUSE INVENTORY',
    questDescription:
      'Architected enterprise commerce ecosystem comprising high-converting D2C Storefront (elexoplus.com) and B2B Wholesale Portal (b2b.elexoplus.com) with role-based access control (RBAC), multi-warehouse stock synchronization, and automated order-dispatch workflows.',
    metrics: [
      'Dual Storefront: D2C (elexoplus.com) + B2B Wholesale',
      'Role-Based Access Control (RBAC) & JWT Security',
      'Indexed Relational MySQL Schema for High-Frequency Orders',
      'Automated Inventory Reconciliation Pipeline'
    ],
    stack: ['React.js', 'Node.js', 'Express.js', 'MySQL', 'Tailwind CSS', 'REST APIs'],
    realUrl: 'https://elexoplus.com',
    secondaryUrl: 'https://b2b.elexoplus.com',
    actionText: 'Launch D2C Storefront (elexoplus.com)',
    secondaryActionText: 'Open B2B Portal (b2b.elexoplus.com)'
  },
  {
    id: 'neural-labs',
    name: 'FIB / Neural AI Research Spire',
    codename: 'SECTOR-03 // AI RESEARCH CORE',
    tagline: 'Oracle Cloud Certified GenAI Professional · Feynn Labs · Foliar CNN',
    color: '#10b981',
    accentHex: 0x10b981,
    buildingHeight: 16,
    position: [-18, 0, -14],
    questTitle: 'DEPLOY 95%+ ACCURACY BOTANICAL CNN CLASSIFIER',
    questDescription:
      'Trained deep convolutional neural network for foliar disease classification with OpenCV augmentations. Certified in Large Language Models (LLMs), RAG systems, and Vector Databases on Oracle Cloud Infrastructure (OCI 2025).',
    metrics: [
      '>95% Validation Accuracy on Botanical Pathology',
      'Oracle Cloud Infrastructure 2025 Certified GenAI Pro',
      'Automated ETL & Preprocessing Pipelines at Feynn Labs',
      'Lakshagriha Hackathon 1.0 Finalist'
    ],
    stack: ['Python', 'TensorFlow', 'OpenCV', 'Keras', 'Oracle OCI GenAI', 'NumPy'],
    realUrl: 'https://github.com/saxenasajal03/Portfolio',
    secondaryUrl: 'https://www.linkedin.com/in/sajal-saxena-cse/',
    actionText: 'View CNN Classifier Source',
    secondaryActionText: 'Verify Oracle GenAI Cert'
  },
  {
    id: 'connectx',
    name: 'ConnectX Telecom & Broadcast Array',
    codename: 'SECTOR-04 // WEBRTC BROADCAST',
    tagline: 'Real-Time P2P Video Mesh · Socket.io Signaling · Sub-100ms Latency',
    color: '#8b5cf6',
    accentHex: 0x8b5cf6,
    buildingHeight: 17,
    position: [18, 0, 14],
    questTitle: 'STREAM ULTRA LOW-LATENCY P2P VIDEO SESSIONS',
    questDescription:
      'Engineered real-time interactive peer-to-peer audio and video communication platform with encrypted Socket.io signaling, automatic ICE candidate renegotiation, and responsive viewport grid switching.',
    metrics: [
      '<100ms Peer-to-Peer Media Latency',
      'Full-Duplex Socket.io Signaling Architecture',
      'Dynamic Device Enumeration (Mute/Screen Share)',
      'Responsive Video Grid with Zero Frame Tearing'
    ],
    stack: ['WebRTC', 'React.js', 'Socket.io', 'Node.js', 'Express.js', 'Tailwind CSS'],
    realUrl: 'https://github.com/saxenasajal03/Portfolio',
    secondaryUrl: 'https://www.linkedin.com/in/sajal-saxena-cse/',
    actionText: 'Inspect WebRTC Architecture',
    secondaryActionText: 'Review System Design'
  },
  {
    id: 'academic-quad',
    name: 'Rockford Academic Quad & Capitol Dome',
    codename: 'SECTOR-05 // DBUU & UGC NEP SAARTHI',
    tagline: 'Dev Bhoomi Uttarakhand University · B.Tech CSE · UGC Ambassador',
    color: '#f59e0b',
    accentHex: 0xf59e0b,
    buildingHeight: 12,
    position: [-16, 0, 14],
    questTitle: 'LEAD ACADEMIC POLICY AS UGC NEP SAARTHI AMBASSADOR',
    questDescription:
      'Selected as prestigious NEP Saarthi Student Ambassador by University Grants Commission (UGC) to champion National Education Policy reforms across university cohorts. Completed B.Tech in Computer Science & Engineering with 7.72 CGPA.',
    metrics: [
      'B.Tech Computer Science & Engineering (7.72 CGPA)',
      'UGC Nominated NEP Saarthi Student Ambassador',
      'HackerRank 5-Star: Python & SQL Problem Solving',
      'Infosys Java SE & TCS ESG Program Certifications'
    ],
    stack: ['Computer Science', 'Java Enterprise', 'Data Structures', 'Database Systems', 'Operating Systems'],
    realUrl: 'https://www.dbuu.ac.in/',
    secondaryUrl: 'https://www.linkedin.com/in/sajal-saxena-cse/',
    actionText: 'Explore University Profile',
    secondaryActionText: 'Review Academic Credentials'
  },
  {
    id: 'power-grid',
    name: 'Paleto Energy Substation & Ledger',
    codename: 'SECTOR-06 // INDUSTRIAL LEDGER',
    tagline: 'Electricity Bill Management · Java Swing / JDBC · SQL Server',
    color: '#ec4899',
    accentHex: 0xec4899,
    buildingHeight: 10,
    position: [0, 0, -26],
    questTitle: 'EXECUTE ACID-COMPLIANT MUNICIPAL BILLING RUNS',
    questDescription:
      'Engineered desktop utility in Java Swing & JDBC to manage multi-consumer utility accounts, meter-reading calculation algorithms, automated invoice generation, and relational schema integrity.',
    metrics: [
      'ACID-Compliant Relational SQL Transactions',
      'Desktop GUI with Custom Swing / AWT Graphics',
      'Automated Meter Calculations & PDF Statements',
      'Optimized JDBC Connection Pooling'
    ],
    stack: ['Java', 'Swing / AWT', 'Microsoft SQL Server', 'JDBC', 'Relational Schemas'],
    realUrl: 'https://github.com/saxenasajal03/Portfolio',
    secondaryUrl: 'https://www.linkedin.com/in/sajal-saxena-cse/',
    actionText: 'View Java Desktop Repo',
    secondaryActionText: 'Review SQL Relational Model'
  }
];

export const MetaverseCityAdventure: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeDistrict, setActiveDistrict] = useState<CityDistrict>(DISTRICTS[0]);
  const [viewMode, setViewMode] = useState<'city' | 'india-map'>('city');
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('day');
  const [isTourPlaying, setIsTourPlaying] = useState<boolean>(true);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  const cameraTargetPos = useRef<THREE.Vector3>(new THREE.Vector3(12, 18, 22));
  const cameraLookAtPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 5, 0));
  const tourTimerRef = useRef<number>(0);
  const tourIndexRef = useRef<number>(0);

  // Smooth camera glide to district
  const goToDistrict = (district: CityDistrict, userInteracted = true) => {
    if (userInteracted) {
      soundEngine.playWhoosh();
      setIsTourPlaying(false);
    }
    setActiveDistrict(district);
    const [dx, dy, dz] = district.position;
    cameraTargetPos.current.set(dx + 12, dy + district.buildingHeight * 0.72 + 6, dz + 16);
    cameraLookAtPos.current.set(dx, dy + district.buildingHeight * 0.45, dz);
  };

  const toggleTour = () => {
    soundEngine.playTick();
    setIsTourPlaying((prev) => !prev);
  };

  const toggleSound = () => {
    soundEngine.toggleMute();
    setSoundMuted((prev) => !prev);
  };

  const cycleTimeOfDay = () => {
    soundEngine.playTick();
    setTimeOfDay((curr) => (curr === 'day' ? 'sunset' : curr === 'sunset' ? 'night' : 'day'));
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 720;

    // --- WebGL Renderer ---
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.replaceChildren(renderer.domElement);

    // --- Scene & Vibrant Daylight Atmosphere (Matching Reference Photo) ---
    const scene = new THREE.Scene();
    
    // Lighting theme config based on timeOfDay
    let skyBgColor = 0xdbeafe;
    let hemiSky = 0xffffff;
    let hemiGround = 0xa3b8cc;
    let dirColor = 0xfff8ee;
    let dirIntensity = 3.2;
    let fogDensity = 0.0035;

    if (timeOfDay === 'sunset') {
      skyBgColor = 0xfdba74;
      hemiSky = 0xffedd5;
      hemiGround = 0x7c2d12;
      dirColor = 0xff7733;
      dirIntensity = 3.6;
      fogDensity = 0.004;
    } else if (timeOfDay === 'night') {
      skyBgColor = 0x090d16;
      hemiSky = 0x1e293b;
      hemiGround = 0x020617;
      dirColor = 0x38bdf8;
      dirIntensity = 1.2;
      fogDensity = 0.006;
    }

    scene.background = new THREE.Color(skyBgColor);
    scene.fog = new THREE.FogExp2(skyBgColor, fogDensity);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 400);
    camera.position.set(0, 22, 32);
    camera.lookAt(0, 4, 0);

    // --- Lighting ---
    const skyLight = new THREE.HemisphereLight(hemiSky, hemiGround, 2.6);
    scene.add(skyLight);

    const sunLight = new THREE.DirectionalLight(dirColor, dirIntensity);
    sunLight.position.set(45, 65, 35);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 160;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    sunLight.shadow.bias = -0.0002;
    scene.add(sunLight);

    // Subtle warm ambient bounce
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    const indiaMapGroup = new THREE.Group();
    scene.add(indiaMapGroup);
    indiaMapGroup.visible = false;

    // --- 1. Clean Pavements, Plazas & Streets (Matching Reference Photo) ---
    // Clean concrete plaza base
    const basePlazaGeo = new THREE.PlaneGeometry(180, 180);
    const basePlazaMat = new THREE.MeshStandardMaterial({
      color: timeOfDay === 'night' ? 0x0f172a : 0xedebe4,
      roughness: 0.6,
      metalness: 0.05
    });
    const basePlaza = new THREE.Mesh(basePlazaGeo, basePlazaMat);
    basePlaza.rotation.x = -Math.PI / 2;
    basePlaza.receiveShadow = true;
    cityGroup.add(basePlaza);

    // Smooth Dark Slate Asphalt Roads (North-South & East-West Highways)
    const asphaltMat = new THREE.MeshStandardMaterial({
      color: timeOfDay === 'night' ? 0x0a0e17 : 0x242a35,
      roughness: 0.55
    });
    const roadNS = new THREE.Mesh(new THREE.PlaneGeometry(16, 170), asphaltMat);
    roadNS.rotation.x = -Math.PI / 2;
    roadNS.position.set(0, 0.02, 0);
    roadNS.receiveShadow = true;
    cityGroup.add(roadNS);

    const roadEW = new THREE.Mesh(new THREE.PlaneGeometry(170, 16), asphaltMat);
    roadEW.rotation.x = -Math.PI / 2;
    roadEW.position.set(0, 0.02, 0);
    roadEW.receiveShadow = true;
    cityGroup.add(roadEW);

    // Outer Ring Boulevard Roads
    const roadRingN = new THREE.Mesh(new THREE.PlaneGeometry(170, 10), asphaltMat);
    roadRingN.rotation.x = -Math.PI / 2;
    roadRingN.position.set(0, 0.02, -40);
    roadRingN.receiveShadow = true;
    cityGroup.add(roadRingN);

    const roadRingS = new THREE.Mesh(new THREE.PlaneGeometry(170, 10), asphaltMat);
    roadRingS.rotation.x = -Math.PI / 2;
    roadRingS.position.set(0, 0.02, 40);
    roadRingS.receiveShadow = true;
    cityGroup.add(roadRingS);

    // Bright Yellow Double Dividers & White Lane Dashes
    const yellowDividerMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const whiteDashMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const addRoadMarkings = () => {
      // NS Double Center Yellow
      for (let z = -75; z <= 75; z += 5) {
        if (Math.abs(z) < 12 || Math.abs(z - 40) < 8 || Math.abs(z + 40) < 8) continue;
        const line1 = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 3.2), yellowDividerMat);
        line1.rotation.x = -Math.PI / 2;
        line1.position.set(-0.2, 0.04, z);
        cityGroup.add(line1);

        const line2 = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 3.2), yellowDividerMat);
        line2.rotation.x = -Math.PI / 2;
        line2.position.set(0.2, 0.04, z);
        cityGroup.add(line2);

        // White Lane Dashes on flanks
        const dashL = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 2.2), whiteDashMat);
        dashL.rotation.x = -Math.PI / 2;
        dashL.position.set(-3.8, 0.04, z);
        cityGroup.add(dashL);

        const dashR = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 2.2), whiteDashMat);
        dashR.rotation.x = -Math.PI / 2;
        dashR.position.set(3.8, 0.04, z);
        cityGroup.add(dashR);
      }

      // EW Double Center Yellow
      for (let x = -75; x <= 75; x += 5) {
        if (Math.abs(x) < 12) continue;
        const line1 = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 3.2), yellowDividerMat);
        line1.rotation.x = -Math.PI / 2;
        line1.rotation.z = Math.PI / 2;
        line1.position.set(x, 0.04, -0.2);
        cityGroup.add(line1);

        const line2 = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 3.2), yellowDividerMat);
        line2.rotation.x = -Math.PI / 2;
        line2.rotation.z = Math.PI / 2;
        line2.position.set(x, 0.04, 0.2);
        cityGroup.add(line2);

        const dashT = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 2.2), whiteDashMat);
        dashT.rotation.x = -Math.PI / 2;
        dashT.rotation.z = Math.PI / 2;
        dashT.position.set(x, 0.04, -3.8);
        cityGroup.add(dashT);

        const dashB = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 2.2), whiteDashMat);
        dashB.rotation.x = -Math.PI / 2;
        dashB.rotation.z = Math.PI / 2;
        dashB.position.set(x, 0.04, 3.8);
        cityGroup.add(dashB);
      }
    };
    addRoadMarkings();

    // Bold White Zebra Crosswalks (Matching Reference Photo)
    const addZebraCrosswalk = (cx: number, cz: number, isVertical: boolean) => {
      const g = new THREE.Group();
      for (let i = -5; i <= 5; i++) {
        const stripe = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 3.8), whiteDashMat);
        stripe.rotation.x = -Math.PI / 2;
        if (isVertical) {
          stripe.rotation.z = Math.PI / 2;
          stripe.position.set(0, 0.05, i * 1.3);
        } else {
          stripe.position.set(i * 1.3, 0.05, 0);
        }
        g.add(stripe);
      }
      g.position.set(cx, 0, cz);
      cityGroup.add(g);
    };

    addZebraCrosswalk(0, 11, false);
    addZebraCrosswalk(0, -11, false);
    addZebraCrosswalk(11, 0, true);
    addZebraCrosswalk(-11, 0, true);

    // Raised Sidewalk Curbs & Vibrant Lawns
    const curbMat = new THREE.MeshStandardMaterial({ color: 0xd8d6cf, roughness: 0.5 });
    const grassMat = new THREE.MeshStandardMaterial({
      color: timeOfDay === 'night' ? 0x064e3b : 0x22c55e,
      roughness: 0.8
    });

    const addCityBlockPodium = (px: number, pz: number, w: number, d: number) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(px, 0, pz);

      const curb = new THREE.Mesh(new THREE.BoxGeometry(w, 0.35, d), curbMat);
      curb.position.y = 0.175;
      curb.receiveShadow = true;
      bGroup.add(curb);

      const lawn = new THREE.Mesh(new THREE.BoxGeometry(w - 3.2, 0.42, d - 3.2), grassMat);
      lawn.position.y = 0.21;
      lawn.receiveShadow = true;
      bGroup.add(lawn);

      cityGroup.add(bGroup);
    };

    addCityBlockPodium(22, -22, 24, 24);
    addCityBlockPodium(-22, -22, 24, 24);
    addCityBlockPodium(22, 22, 24, 24);
    addCityBlockPodium(-22, 22, 24, 24);

    // --- 2. Low-Poly Trees, Bushes & Street Elements (Matching Reference Photo) ---
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3e26, roughness: 0.85 });
    const foliageBrightMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.65, flatShading: true });
    const foliageDarkMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.65, flatShading: true });
    const foliageAutumnMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.65, flatShading: true });

    // Stylized Faceted Tree
    const addStylizedTree = (tx: number, tz: number, scale = 1.0, type = 0) => {
      const tree = new THREE.Group();
      tree.position.set(tx, 0, tz);

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22 * scale, 0.32 * scale, 2.2 * scale, 6),
        trunkMat
      );
      trunk.position.y = 1.1 * scale;
      trunk.castShadow = true;
      tree.add(trunk);

      if (type === 0) {
        // Round Deciduous Tree
        const mat = Math.random() > 0.2 ? foliageBrightMat : foliageAutumnMat;
        const crown1 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.4 * scale, 1), mat);
        crown1.position.y = 2.6 * scale;
        crown1.castShadow = true;
        tree.add(crown1);

        const crown2 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.0 * scale, 1), foliageDarkMat);
        crown2.position.set(0.3 * scale, 3.4 * scale, 0.1 * scale);
        crown2.castShadow = true;
        tree.add(crown2);
      } else if (type === 1) {
        // Conical Pine Tree
        const cone1 = new THREE.Mesh(new THREE.ConeGeometry(1.6 * scale, 2.2 * scale, 6), foliageDarkMat);
        cone1.position.y = 2.4 * scale;
        cone1.castShadow = true;
        tree.add(cone1);

        const cone2 = new THREE.Mesh(new THREE.ConeGeometry(1.2 * scale, 1.8 * scale, 6), foliageBrightMat);
        cone2.position.y = 3.6 * scale;
        cone2.castShadow = true;
        tree.add(cone2);
      } else {
        // Manicured Conical Topiary
        const topiary = new THREE.Mesh(new THREE.ConeGeometry(0.8 * scale, 2.4 * scale, 8), foliageBrightMat);
        topiary.position.y = 1.4 * scale;
        topiary.castShadow = true;
        tree.add(topiary);
      }

      cityGroup.add(tree);
    };

    // Tree coordinates along avenues and plazas
    const treeCoords = [
      [10.5, 14], [10.5, 21], [10.5, 28],
      [-10.5, 14], [-10.5, 21], [-10.5, 28],
      [10.5, -14], [10.5, -21], [10.5, -28],
      [-10.5, -14], [-10.5, -21], [-10.5, -28],
      [16, 10.5], [23, 10.5], [30, 10.5],
      [-16, 10.5], [-23, 10.5], [-30, 10.5],
      [16, -10.5], [23, -10.5], [30, -10.5],
      [-16, -10.5], [-23, -10.5], [-30, -10.5]
    ];
    treeCoords.forEach(([x, z], idx) => {
      addStylizedTree(x, z, 0.85 + (idx % 3) * 0.15, idx % 2);
    });

    // Decorative Conical Topiaries around Central Quadrangles
    const topiaryCoords = [
      [-12, 10], [-13.5, 10], [-15, 10],
      [12, 10], [13.5, 10], [15, 10]
    ];
    topiaryCoords.forEach(([x, z]) => addStylizedTree(x, z, 0.75, 2));

    // Outdoor Cafe with Red-and-White Parasols (Matching Reference Photo)
    const addOutdoorCafe = (cx: number, cz: number) => {
      const cafe = new THREE.Group();
      cafe.position.set(cx, 0, cz);

      const tableMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      const chairMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
      const umbrellaStripeRed = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
      const umbrellaStripeWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc });

      for (let t = -1; t <= 1; t++) {
        const tableGroup = new THREE.Group();
        tableGroup.position.set(t * 2.8, 0, 0);

        // Table
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 8), tableMat);
        pole.position.y = 0.5;
        tableGroup.add(pole);

        const top = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.06, 16), tableMat);
        top.position.y = 1.0;
        tableGroup.add(top);

        // Parasol Umbrella
        const uPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8), tableMat);
        uPole.position.y = 1.1;
        tableGroup.add(uPole);

        const umbrella = new THREE.Mesh(
          new THREE.ConeGeometry(1.4, 0.65, 8),
          t % 2 === 0 ? umbrellaStripeRed : umbrellaStripeWhite
        );
        umbrella.position.y = 2.3;
        umbrella.castShadow = true;
        tableGroup.add(umbrella);

        // Chairs around table
        for (let ch = 0; ch < 3; ch++) {
          const chair = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.45, 0.4), chairMat);
          const angle = (ch / 3) * Math.PI * 2;
          chair.position.set(Math.cos(angle) * 0.9, 0.225, Math.sin(angle) * 0.9);
          tableGroup.add(chair);
        }

        cafe.add(tableGroup);
      }

      cityGroup.add(cafe);
    };
    addOutdoorCafe(25, 9);

    // Street Props: Modern Glass Bus Shelter, Red British Phone Booth, Fire Hydrant
    const addStreetProps = () => {
      // Glass Bus Shelter
      const shelter = new THREE.Group();
      shelter.position.set(10.2, 0, 2);

      const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1
      });

      const roof = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.1, 1.6), frameMat);
      roof.position.set(0, 2.3, 0);
      shelter.add(roof);

      const glassBack = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.2, 0.08), glassMat);
      glassBack.position.set(0, 1.1, -0.7);
      shelter.add(glassBack);

      const bench = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 0.4), new THREE.MeshStandardMaterial({ color: 0x854d0e }));
      bench.position.set(0, 0.4, -0.3);
      shelter.add(bench);

      cityGroup.add(shelter);

      // Red Phone Booth (GTA / London Style)
      const phoneBooth = new THREE.Group();
      phoneBooth.position.set(-10.2, 0, 8);

      const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 });
      const boothBody = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.5, 0.9), redMat);
      boothBody.position.y = 1.25;
      boothBody.castShadow = true;
      phoneBooth.add(boothBody);

      const boothDome = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.25, 12), redMat);
      boothDome.position.y = 2.6;
      phoneBooth.add(boothDome);

      cityGroup.add(phoneBooth);

      // Red Fire Hydrants on street corners
      const hydrantMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
      const addHydrant = (hx: number, hz: number) => {
        const hyd = new THREE.Group();
        hyd.position.set(hx, 0, hz);
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.6, 8), hydrantMat);
        col.position.y = 0.3;
        hyd.add(col);
        const top = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), hydrantMat);
        top.position.y = 0.62;
        hyd.add(top);
        cityGroup.add(hyd);
      };
      addHydrant(9.5, 9.5);
      addHydrant(-9.5, 9.5);
      addHydrant(9.5, -9.5);
      addHydrant(-9.5, -9.5);
    };
    addStreetProps();

    // Street Lamps with warm amber glow
    const lampPostMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
    const lampGlowMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    const addStreetLamp = (lx: number, lz: number) => {
      const g = new THREE.Group();
      g.position.set(lx, 0, lz);

      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 4.2, 8), lampPostMat);
      post.position.y = 2.1;
      post.castShadow = true;
      g.add(post);

      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.08), lampPostMat);
      arm.position.set(lx > 0 ? -0.45 : 0.45, 4.2, 0);
      g.add(arm);

      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), lampGlowMat);
      bulb.position.set(lx > 0 ? -0.8 : 0.8, 4.15, 0);
      g.add(bulb);

      if (timeOfDay === 'night') {
        const lampLight = new THREE.PointLight(0xfef08a, 2.5, 14);
        lampLight.position.set(lx > 0 ? -0.8 : 0.8, 4.0, 0);
        g.add(lampLight);
      }

      cityGroup.add(g);
    };

    addStreetLamp(9.8, 5);
    addStreetLamp(-9.8, 5);
    addStreetLamp(9.8, -5);
    addStreetLamp(-9.8, -5);

    // Modern Curved Golden Showroom Building (Matching Reference Photo)
    const addCurvedShowroom = (cx: number, cz: number) => {
      const g = new THREE.Group();
      g.position.set(cx, 0, cz);

      const goldGlassMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.8,
        roughness: 0.2
      });
      const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

      // Curved Cylindrical Core
      const core = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 8.5, 32), goldGlassMat);
      core.position.y = 4.25;
      core.castShadow = true;
      g.add(core);

      // Horizontal Sunshade Rings
      for (let r = 1; r <= 3; r++) {
        const ring = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.6, 0.2, 32), whiteMat);
        ring.position.y = r * 2.2;
        g.add(ring);
      }

      // Rooftop Dome Cap
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4.4, 1.2, 32), whiteMat);
      cap.position.y = 8.5 + 0.6;
      g.add(cap);

      cityGroup.add(g);
    };
    addCurvedShowroom(32, 22);

    // --- 3. GTA Landmark Skyscrapers & Sector Towers ---
    const districtMeshes: THREE.Group[] = [];

    // TOWER 1: Maze Bank / Urban Quality Tower (Stepped Cylindrical Icon with Helipad)
    const buildUrbanQualityTower = (dist: CityDistrict) => {
      const g = new THREE.Group();
      g.position.set(dist.position[0], 0, dist.position[2]);
      g.userData = { id: dist.id, district: dist };

      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x1d4ed8,
        metalness: 0.85,
        roughness: 0.15
      });
      const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      const goldTrim = new THREE.MeshStandardMaterial({ color: 0xff9a3c, metalness: 0.8 });

      // Tier 1: Grand Rotunda Base
      const podium = new THREE.Mesh(new THREE.CylinderGeometry(5.4, 5.8, 3.8, 32), whiteMat);
      podium.position.y = 1.9;
      podium.castShadow = true;
      g.add(podium);

      // Tier 2: Main Blue Mirrored Shaft
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.8, 10.5, 32), glassMat);
      shaft.position.y = 3.8 + 5.25;
      shaft.castShadow = true;
      g.add(shaft);

      // Floor Divider Rings
      for (let f = 1; f <= 4; f++) {
        const fRing = new THREE.Mesh(new THREE.CylinderGeometry(4.55, 4.55, 0.18, 32), whiteMat);
        fRing.position.y = 3.8 + f * 2.1;
        g.add(fRing);
      }

      // Tier 3: Executive Penthouse Tier
      const penthouse = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 4.0, 4.2, 32), whiteMat);
      penthouse.position.y = 3.8 + 10.5 + 2.1;
      penthouse.castShadow = true;
      g.add(penthouse);

      // Helipad on Rooftop
      const helipad = new THREE.Mesh(
        new THREE.CylinderGeometry(2.8, 2.8, 0.45, 32),
        new THREE.MeshStandardMaterial({ color: 0x334155 })
      );
      helipad.position.y = 3.8 + 10.5 + 4.2 + 0.22;
      g.add(helipad);

      const hRing = new THREE.Mesh(
        new THREE.RingGeometry(1.4, 1.7, 32),
        new THREE.MeshBasicMaterial({ color: 0xff9a3c, side: THREE.DoubleSide })
      );
      hRing.rotation.x = Math.PI / 2;
      hRing.position.y = 3.8 + 10.5 + 4.2 + 0.46;
      g.add(hRing);

      // Maze Bank Antenna Mast with Warning Beacon
      const antenna = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.18, 6.2, 8),
        new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9 })
      );
      antenna.position.y = 3.8 + 10.5 + 4.2 + 3.1;
      g.add(antenna);

      const topLight = new THREE.PointLight(0xff9a3c, 4.5, 20);
      topLight.position.y = 3.8 + 10.5 + 4.2 + 6.2;
      g.add(topLight);

      cityGroup.add(g);
      districtMeshes.push(g);
    };

    // TOWER 2: Elexoplus Twin Towers with Suspended Skybridge
    const buildElexoplusTwinTowers = (dist: CityDistrict) => {
      const g = new THREE.Group();
      g.position.set(dist.position[0], 0, dist.position[2]);
      g.userData = { id: dist.id, district: dist };

      const cyanGlass = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        metalness: 0.8,
        roughness: 0.2
      });
      const titanMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
      const whiteFrames = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

      // Tower A (D2C Wing)
      const towerA = new THREE.Mesh(new THREE.BoxGeometry(4.0, 15, 4.0), cyanGlass);
      towerA.position.set(-3.2, 7.5, 0);
      towerA.castShadow = true;
      g.add(towerA);

      // Tower B (B2B Wing)
      const towerB = new THREE.Mesh(new THREE.BoxGeometry(4.0, 13, 4.0), cyanGlass);
      towerB.position.set(3.2, 6.5, 0);
      towerB.castShadow = true;
      g.add(towerB);

      // Suspended Glass Skybridge connecting Twin Towers mid-air
      const skybridge = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.8, 2.2), titanMat);
      skybridge.position.set(0, 9.2, 0);
      skybridge.castShadow = true;
      g.add(skybridge);

      // Crown Bevels & Antennas
      const crownA = new THREE.Mesh(new THREE.ConeGeometry(2.6, 2.8, 4), new THREE.MeshStandardMaterial({ color: 0x06b6d4 }));
      crownA.rotation.y = Math.PI / 4;
      crownA.position.set(-3.2, 15 + 1.4, 0);
      g.add(crownA);

      const crownB = new THREE.Mesh(new THREE.ConeGeometry(2.6, 2.4, 4), new THREE.MeshStandardMaterial({ color: 0x06b6d4 }));
      crownB.rotation.y = Math.PI / 4;
      crownB.position.set(3.2, 13 + 1.2, 0);
      g.add(crownB);

      cityGroup.add(g);
      districtMeshes.push(g);
    };

    // TOWER 3: FIB / Neural AI Research Spire
    const buildNeuralLabsSpire = (dist: CityDistrict) => {
      const g = new THREE.Group();
      g.position.set(dist.position[0], 0, dist.position[2]);
      g.userData = { id: dist.id, district: dist };

      const darkSpireMat = new THREE.MeshStandardMaterial({
        color: 0x022c22,
        metalness: 0.85,
        roughness: 0.25
      });
      const emeraldGlow = new THREE.MeshBasicMaterial({ color: 0x10b981 });

      const lower = new THREE.Mesh(new THREE.BoxGeometry(7.5, 6.5, 7.5), darkSpireMat);
      lower.position.y = 3.25;
      lower.castShadow = true;
      g.add(lower);

      const upper = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 3.6, 7.5, 8), darkSpireMat);
      upper.position.y = 6.5 + 3.75;
      upper.castShadow = true;
      g.add(upper);

      // Geodesic Radome Satellite Sphere
      const radome = new THREE.Mesh(new THREE.SphereGeometry(1.8, 16, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }));
      radome.position.set(1.6, 6.5 + 7.5 + 1.4, 0);
      radome.castShadow = true;
      g.add(radome);

      // Laser Core Spire
      const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.22, 5.0, 8), emeraldGlow);
      spire.position.set(-1.0, 6.5 + 7.5 + 2.5, 0);
      g.add(spire);

      cityGroup.add(g);
      districtMeshes.push(g);
    };

    // TOWER 4: ConnectX Radio Broadcast Array
    const buildConnectXBroadcast = (dist: CityDistrict) => {
      const g = new THREE.Group();
      g.position.set(dist.position[0], 0, dist.position[2]);
      g.userData = { id: dist.id, district: dist };

      const goldMat = new THREE.MeshStandardMaterial({ color: 0x7c3aed, metalness: 0.8, roughness: 0.2 });
      const redTowerMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.6 });

      const rotunda = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.6, 8.0, 24), goldMat);
      rotunda.position.y = 4.0;
      rotunda.castShadow = true;
      g.add(rotunda);

      // Lattice Telecom Mast
      const lattice = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 1.8, 9.5, 4), redTowerMat);
      lattice.position.y = 8.0 + 4.75;
      lattice.castShadow = true;
      g.add(lattice);

      // Giant Satellite Dish
      const dish = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 0.4, 0.6, 16), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      dish.rotation.x = Math.PI / 3;
      dish.position.set(1.5, 8.0 + 3.0, 1.5);
      g.add(dish);

      cityGroup.add(g);
      districtMeshes.push(g);
    };

    // TOWER 5: Rockford Academic Quad & Terracotta Dome (DIRECTLY Matching Reference Photo)
    const buildAcademicQuad = (dist: CityDistrict) => {
      const g = new THREE.Group();
      g.position.set(dist.position[0], 0, dist.position[2]);
      g.userData = { id: dist.id, district: dist };

      const marbleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25 });
      const blueGlass = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.2 });
      const domeMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.35 });
      const goldTrim = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7 });

      // Raised Stepped Entrance Podium
      const podium = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.6, 9.0), marbleMat);
      podium.position.y = 0.3;
      podium.receiveShadow = true;
      g.add(podium);

      // Central Classical Hall
      const hall = new THREE.Mesh(new THREE.BoxGeometry(7.8, 5.8, 7.8), marbleMat);
      hall.position.y = 0.6 + 2.9;
      hall.castShadow = true;
      g.add(hall);

      // Front Classical Colonnade Pillars
      for (let c = -2.8; c <= 2.8; c += 1.4) {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 5.8, 16), marbleMat);
        pillar.position.set(c, 0.6 + 2.9, 4.15);
        pillar.castShadow = true;
        g.add(pillar);
      }

      // Triangular Pediment Portico above pillars
      const pediment = new THREE.Mesh(new THREE.ConeGeometry(4.4, 1.6, 4), goldTrim);
      pediment.rotation.y = Math.PI / 4;
      pediment.position.set(0, 0.6 + 5.8 + 0.8, 4.15);
      g.add(pediment);

      // Royal Blue Entrance Doorway
      const door = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 3.8), blueGlass);
      door.position.set(0, 0.6 + 1.9, 3.92);
      g.add(door);

      // Grand Terracotta Ribbed Dome (Exact Match to Reference Photo)
      const domeDrum = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.4, 1.2, 24), marbleMat);
      domeDrum.position.y = 0.6 + 5.8 + 0.6;
      g.add(domeDrum);

      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(3.1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        domeMat
      );
      dome.position.y = 0.6 + 5.8 + 1.2;
      dome.castShadow = true;
      g.add(dome);

      // Golden Cupola Finial
      const finial = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.25, 1.2, 8), goldTrim);
      finial.position.y = 0.6 + 5.8 + 1.2 + 3.1 + 0.6;
      g.add(finial);

      cityGroup.add(g);
      districtMeshes.push(g);
    };

    // TOWER 6: Paleto Energy Substation & Power Ledger
    const buildPowerSubstation = (dist: CityDistrict) => {
      const g = new THREE.Group();
      g.position.set(dist.position[0], 0, dist.position[2]);
      g.userData = { id: dist.id, district: dist };

      const industrial = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 });
      const warningPink = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.4 });

      const core = new THREE.Mesh(new THREE.BoxGeometry(8.5, 5.2, 7.5), industrial);
      core.position.y = 2.6;
      core.castShadow = true;
      g.add(core);

      const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.3, 6.0, 16), warningPink);
      stack.position.set(2.2, 5.2 + 3.0, 0);
      stack.castShadow = true;
      g.add(stack);

      cityGroup.add(g);
      districtMeshes.push(g);
    };

    buildUrbanQualityTower(DISTRICTS[0]);
    buildElexoplusTwinTowers(DISTRICTS[1]);
    buildNeuralLabsSpire(DISTRICTS[2]);
    buildConnectXBroadcast(DISTRICTS[3]);
    buildAcademicQuad(DISTRICTS[4]);
    buildPowerSubstation(DISTRICTS[5]);

    // --- 4. Cruising Vehicles with Lit Headlights & Smooth Traffic ---
    const carMatYellow = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 }); // Taxi
    const carMatRed = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 });    // Sports Car
    const carMatBlue = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3 });   // Sedan
    const carMatWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });  // Cruiser
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const taillightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

    const createCruisingCar = (bodyMat: THREE.Material) => {
      const car = new THREE.Group();

      const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.65, 3.4), bodyMat);
      chassis.position.y = 0.5;
      chassis.castShadow = true;
      car.add(chassis);

      const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 0.55, 1.8),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 })
      );
      cabin.position.set(0, 1.0, -0.2);
      car.add(cabin);

      // Wheels
      const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.25, 12);
      const wFL = new THREE.Mesh(wheelGeo, wheelMat);
      wFL.rotation.z = Math.PI / 2;
      wFL.position.set(0.85, 0.3, 1.1);
      car.add(wFL);

      const wFR = new THREE.Mesh(wheelGeo, wheelMat);
      wFR.rotation.z = Math.PI / 2;
      wFR.position.set(-0.85, 0.3, 1.1);
      car.add(wFR);

      const wBL = new THREE.Mesh(wheelGeo, wheelMat);
      wBL.rotation.z = Math.PI / 2;
      wBL.position.set(0.85, 0.3, -1.1);
      car.add(wBL);

      const wBR = new THREE.Mesh(wheelGeo, wheelMat);
      wBR.rotation.z = Math.PI / 2;
      wBR.position.set(-0.85, 0.3, -1.1);
      car.add(wBR);

      // Headlights
      const hlL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.08), headlightMat);
      hlL.position.set(0.5, 0.55, 1.72);
      car.add(hlL);

      const hlR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.08), headlightMat);
      hlR.position.set(-0.5, 0.55, 1.72);
      car.add(hlR);

      // Taillights
      const tlL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.08), taillightMat);
      tlL.position.set(0.5, 0.55, -1.72);
      car.add(tlL);

      const tlR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.08), taillightMat);
      tlR.position.set(-0.5, 0.55, -1.72);
      car.add(tlR);

      return car;
    };

    const gtaTraffic: { group: THREE.Group; speed: number; direction: number; isNS: boolean }[] = [];

    for (let c = 0; c < 10; c++) {
      const mat =
        c % 4 === 0
          ? carMatYellow
          : c % 4 === 1
          ? carMatRed
          : c % 4 === 2
          ? carMatBlue
          : carMatWhite;
      const car = createCruisingCar(mat);
      const isNS = c % 2 === 0;

      if (isNS) {
        const laneOffset = c % 4 === 0 ? 3.8 : -3.8;
        car.position.set(laneOffset, 0, (Math.random() - 0.5) * 110);
        car.rotation.y = laneOffset > 0 ? 0 : Math.PI;
      } else {
        const laneOffset = c % 4 === 0 ? 3.8 : -3.8;
        car.position.set((Math.random() - 0.5) * 110, 0, laneOffset);
        car.rotation.y = laneOffset > 0 ? Math.PI / 2 : -Math.PI / 2;
      }

      cityGroup.add(car);
      gtaTraffic.push({
        group: car,
        speed: 0.22 + Math.random() * 0.16,
        direction: (c % 4 === 0 ? 1 : -1),
        isNS
      });
    }

    // --- 5. Sovereign India Map Mode ---
    const textureLoader = new THREE.TextureLoader();
    const mapTextureUrl = getAssetUrl('assets/resource/india_map_3d.png');

    textureLoader.load(
      mapTextureUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        const mapPlaneGeo = new THREE.PlaneGeometry(40, 30);
        const mapPlaneMat = new THREE.MeshStandardMaterial({
          map: tex,
          transparent: true,
          roughness: 0.35,
          metalness: 0.15,
          side: THREE.DoubleSide
        });
        const mapMesh = new THREE.Mesh(mapPlaneGeo, mapPlaneMat);
        mapMesh.rotation.x = -Math.PI / 2.3;
        mapMesh.rotation.z = -Math.PI / 18;
        mapMesh.position.set(0, 3, 0);
        mapMesh.receiveShadow = true;
        indiaMapGroup.add(mapMesh);

        const addMapBeacon = (pos: [number, number, number], hex: number) => {
          const bGroup = new THREE.Group();
          bGroup.position.set(pos[0], pos[1], pos[2]);

          const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 6.5, 8);
          const pole = new THREE.Mesh(poleGeo, new THREE.MeshBasicMaterial({ color: hex }));
          pole.position.y = 3.25;
          bGroup.add(pole);

          const ringGeo = new THREE.RingGeometry(0.35, 0.7, 16);
          const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: hex, side: THREE.DoubleSide }));
          ring.rotation.x = Math.PI / 2;
          ring.position.y = 0.1;
          bGroup.add(ring);

          const beaconLight = new THREE.PointLight(hex, 3.5, 14);
          beaconLight.position.y = 6.5;
          bGroup.add(beaconLight);

          indiaMapGroup.add(bGroup);
        };

        addMapBeacon([-2.3, 3.8, -1.2], 0xff9a3c); // Delhi
        addMapBeacon([-1.7, 4.4, -3.2], 0x38bdf8); // Dehradun
        addMapBeacon([0.5, 3.6, -1.4], 0x10b981);  // Gola UP
      },
      undefined,
      (err) => console.warn('3D India Map warning:', err)
    );

    // --- Interactive Orbit Controls & Raycasting ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let prevPointerPos = { x: 0, y: 0 };
    let hasMoved = false;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      hasMoved = false;
      prevPointerPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevPointerPos.x;
      const dy = e.clientY - prevPointerPos.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMoved = true;
      }
      prevPointerPos = { x: e.clientX, y: e.clientY };

      cityGroup.rotation.y += dx * 0.006;
      if (viewMode === 'city') {
        cameraTargetPos.current.y = Math.max(8, Math.min(32, cameraTargetPos.current.y - dy * 0.05));
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      if (hasMoved) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(districtMeshes, true);

      if (intersects.length > 0) {
        let curr: THREE.Object3D | null = intersects[0].object;
        while (curr && curr.parent && curr.parent !== cityGroup) {
          if (curr.userData && curr.userData.district) {
            goToDistrict(curr.userData.district, true);
            break;
          }
          curr = curr.parent;
        }
      }
    };

    // Zoom on wheel
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.02;
      cameraTargetPos.current.y = Math.max(6, Math.min(45, cameraTargetPos.current.y + zoomFactor));
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || 720;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // --- 60 FPS Render Loop ---
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (viewMode === 'city') {
        cityGroup.visible = true;
        indiaMapGroup.visible = false;
      } else {
        cityGroup.visible = false;
        indiaMapGroup.visible = true;
        indiaMapGroup.rotation.y = Math.sin(elapsed * 0.2) * 0.12;
      }

      // Auto Story Tour
      if (isTourPlaying && viewMode === 'city') {
        tourTimerRef.current += delta;
        if (tourTimerRef.current > 7.5) {
          tourTimerRef.current = 0;
          tourIndexRef.current = (tourIndexRef.current + 1) % DISTRICTS.length;
          const nextDist = DISTRICTS[tourIndexRef.current];
          setActiveDistrict(nextDist);
          const [nx, ny, nz] = nextDist.position;
          cameraTargetPos.current.set(nx + 12, ny + nextDist.buildingHeight * 0.72 + 6, nz + 16);
          cameraLookAtPos.current.set(nx, ny + nextDist.buildingHeight * 0.45, nz);
        }
      }

      // Smooth Camera Interpolation
      if (viewMode === 'city') {
        camera.position.lerp(cameraTargetPos.current, 0.045);
        camera.lookAt(cameraLookAtPos.current);
      } else {
        camera.position.lerp(new THREE.Vector3(0, 24, 30), 0.045);
        camera.lookAt(0, 3, 0);
      }

      // Move GTA Traffic smoothly
      gtaTraffic.forEach((car) => {
        if (car.isNS) {
          car.group.position.z += car.speed * car.direction;
          if (car.group.position.z > 80) car.group.position.z = -80;
          if (car.group.position.z < -80) car.group.position.z = 80;
        } else {
          car.group.position.x += car.speed * car.direction;
          if (car.group.position.x > 80) car.group.position.x = -80;
          if (car.group.position.x < -80) car.group.position.x = 80;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, [viewMode, isTourPlaying, timeOfDay]);

  return (
    <div className="relative w-full h-[700px] sm:h-[780px] bg-[#0c0906] overflow-hidden select-none border-b border-white/10">
      {/* 3D WebGL Canvas Viewport */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD: Adventure Interface */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pointer-events-none">
        
        {/* Active Quest / Target Landmark */}
        <div className="pointer-events-auto bg-[#120e0a]/92 backdrop-blur-md border border-white/15 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-lg">
          <div className="w-10 h-10 rounded-xl bg-[#ff9a3c]/15 border border-[#ff9a3c]/40 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-[#ff9a3c]" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#ff9a3c] uppercase tracking-widest font-bold">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
              <span>{activeDistrict.codename}</span>
            </div>
            <h4 className="text-white text-xs sm:text-sm font-extrabold tracking-tight line-clamp-1 mt-0.5">
              {activeDistrict.questTitle}
            </h4>
          </div>
        </div>

        {/* View Mode, Lighting & Audio Controls */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#120e0a]/92 backdrop-blur-md border border-white/15 p-1.5 rounded-2xl shadow-xl">
          <button
            onClick={() => {
              soundEngine.playTick();
              setViewMode('city');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'city'
                ? 'bg-[#ff9a3c] text-[#120e0a] shadow-[0_0_15px_rgba(255,154,60,0.4)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers size={13} />
            <span>3D ADVENTURE CITY</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playTick();
              setViewMode('india-map');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'india-map'
                ? 'bg-[#06b6d4] text-[#120e0a] shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Compass size={13} />
            <span>3D INDIA MAP</span>
          </button>

          {/* Time of Day Cycle Button */}
          <button
            onClick={cycleTimeOfDay}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:text-white transition-all flex items-center gap-1 text-xs font-mono font-bold"
            title={`Current lighting: ${timeOfDay}. Click to change atmosphere.`}
          >
            {timeOfDay === 'day' ? (
              <Sun size={14} className="text-amber-400" />
            ) : timeOfDay === 'sunset' ? (
              <Sparkles size={14} className="text-orange-400" />
            ) : (
              <Moon size={14} className="text-blue-400" />
            )}
            <span className="capitalize hidden md:inline">{timeOfDay}</span>
          </button>

          {/* Story Tour Play/Pause */}
          <button
            onClick={toggleTour}
            className={`p-2 rounded-xl border text-xs font-mono transition-colors ${
              isTourPlaying
                ? 'bg-[#10b981]/20 border-[#10b981]/50 text-[#10b981]'
                : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
            }`}
            title={isTourPlaying ? 'Pause Story Tour' : 'Resume Story Tour'}
          >
            {isTourPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          {/* Audio Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-colors"
            title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {soundMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      </div>

      {/* Floating Bottom District Console / Telemetry HUD */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex flex-col md:flex-row items-end justify-between gap-4">
        
        {/* District Detail Card with REAL Working CTA Links */}
        <div className="pointer-events-auto w-full md:max-w-xl bg-[#120e0a]/95 backdrop-blur-xl border border-white/15 p-5 sm:p-6 rounded-3xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span
                className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-lg uppercase"
                style={{
                  backgroundColor: `${activeDistrict.color}25`,
                  color: activeDistrict.color,
                  border: `1px solid ${activeDistrict.color}50`
                }}
              >
                {activeDistrict.codename}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                {activeDistrict.name}
              </h3>
            </div>
            <span className="text-xs font-mono text-neutral-400 hidden sm:block">
              {activeDistrict.tagline.split('·')[0]}
            </span>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
            {activeDistrict.questDescription}
          </p>

          {/* Key Metrics Bullet Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {activeDistrict.metrics.map((metric, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] text-neutral-200 bg-white/5 p-2 rounded-xl border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: activeDistrict.color }} />
                <span>{metric}</span>
              </div>
            ))}
          </div>

          {/* REAL Working Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-white/10">
            <div className="flex flex-wrap gap-1.5">
              {activeDistrict.stack.slice(0, 3).map((tech, i) => (
                <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/60 border border-white/10 text-neutral-300">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <a
                href={activeDistrict.realUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEngine.playTick()}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: activeDistrict.color,
                  color: '#120e0a'
                }}
              >
                <span>{activeDistrict.actionText}</span>
                <ExternalLink size={12} />
              </a>

              {activeDistrict.secondaryUrl && (
                <a
                  href={activeDistrict.secondaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundEngine.playTick()}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium font-mono text-neutral-200 bg-white/10 hover:bg-white/20 transition-all flex items-center gap-1 border border-white/15"
                >
                  <span>{activeDistrict.secondaryActionText || 'More Details'}</span>
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Quick District Selector Carousel */}
        <div className="pointer-events-auto flex flex-row md:flex-col gap-2 overflow-x-auto max-w-full pb-2 md:pb-0">
          {DISTRICTS.map((d) => {
            const isSelected = activeDistrict.id === d.id;
            return (
              <button
                key={d.id}
                onClick={() => goToDistrict(d, true)}
                className={`px-3 py-2 rounded-2xl text-left font-mono transition-all border shrink-0 flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-[#120e0a] text-white shadow-xl scale-102'
                    : 'bg-black/60 text-neutral-400 hover:text-white hover:bg-black/80'
                }`}
                style={{
                  borderColor: isSelected ? d.color : 'rgba(255,255,255,0.1)'
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <div className="text-left">
                  <div className="text-xs font-bold tracking-tight text-white whitespace-nowrap">
                    {d.name.split(' ')[0]} {d.name.split(' ')[1] || ''}
                  </div>
                  <div className="text-[9px] text-neutral-400 uppercase tracking-wider">
                    {d.codename.split('//')[1] || d.id}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* Cyber Corner HUD Accents */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#ff9a3c] pointer-events-none" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#ff9a3c] pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#ff9a3c] pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#ff9a3c] pointer-events-none" />
    </div>
  );
};

export default MetaverseCityAdventure;