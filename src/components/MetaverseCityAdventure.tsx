import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Compass,
  Play,
  Pause,
  Navigation,
  Layers,
  Award,
  Zap,
  Cpu,
  MapPin,
  ExternalLink,
  Crosshair,
  Volume2,
  VolumeX,
  Building2,
  FileText,
  Mail,
  Linkedin
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
    name: 'Central SBC Quality Spire',
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
    name: 'Elexoplus Commerce & ERP Citadel',
    codename: 'SECTOR-02 // ELEXOPLUS ERP',
    tagline: 'Dual Architecture: D2C Storefront + B2B Wholesale Portal',
    color: '#06b6d4',
    accentHex: 0x06b6d4,
    buildingHeight: 15,
    position: [14, 0, -9],
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
    name: 'Neural Vision & AI Research Spire',
    codename: 'SECTOR-03 // AI CORE',
    tagline: 'Oracle Cloud Certified GenAI Professional · Feynn Labs · Foliar CNN',
    color: '#10b981',
    accentHex: 0x10b981,
    buildingHeight: 16,
    position: [-15, 0, -11],
    questTitle: 'DEPLOY 95%+ ACCURACY BOTANICAL CNN CLASSIFIER',
    questDescription:
      'Trained deep convolutional neural network for foliar disease classification with OpenCV augmentations. Certified in Large Language Models (LLMs), RAG systems, and Vector Databases on Oracle Cloud Infrastructure (OCI 2025).',
    metrics: [
      '>95% Validation Accuracy on Botanical Pathology',
      'Oracle Cloud Infrastructure 2025 Certified GenAI Pro',
      'Automated ETL & Preprocessing Pipelines at Feynn Labs',
      'Optimized Lightweight Inference REST Endpoint'
    ],
    stack: ['Python', 'TensorFlow', 'Keras', 'OpenCV', 'OCI GenAI', 'Pandas'],
    realUrl: 'https://github.com/saxenasajal03/Portfolio',
    secondaryUrl: 'https://www.oracle.com/cloud/',
    actionText: 'Inspect Neural Code on GitHub',
    secondaryActionText: 'Oracle OCI Verification'
  },
  {
    id: 'connectx',
    name: 'ConnectX WebRTC Telecom Array',
    codename: 'SECTOR-04 // TELECOM NODE',
    tagline: 'Sub-100ms Peer-to-Peer Mesh Audio/Video & Real-Time Messaging',
    color: '#38bdf8',
    accentHex: 0x38bdf8,
    buildingHeight: 17,
    position: [16, 0, 11],
    questTitle: 'STREAM ENCRYPTED MESH VIDEO UNDER CONCURRENT LOAD',
    questDescription:
      'Engineered distributed peer-to-peer real-time communication platform utilizing WebRTC ICE negotiation and Socket.io room orchestration with sub-100ms media streaming.',
    metrics: [
      'Sub-100ms Low-Latency WebRTC Media Mesh',
      'Bidirectional Socket.io Concurrent Room Orchestration',
      'MongoDB Dynamic Document Schemas & State Caching',
      'Dynamic Hardware Device Switching (Camera/Mic/Screen)'
    ],
    stack: ['React.js', 'WebRTC', 'Socket.io', 'Node.js', 'MongoDB', 'STUN/TURN'],
    realUrl: 'https://github.com/saxenasajal03/Portfolio',
    secondaryUrl: 'mailto:sajalsaxenagola@gmail.com',
    actionText: 'View ConnectX Code on GitHub',
    secondaryActionText: 'Request Live Demo'
  },
  {
    id: 'academic-citadel',
    name: 'Academic Citadel & NEP Saarthi',
    codename: 'SECTOR-05 // CITADEL',
    tagline: 'Dev Bhoomi Uttarakhand University (2021–2025) · UGC NEP Saarthi',
    color: '#f59e0b',
    accentHex: 0xf59e0b,
    buildingHeight: 14,
    position: [-14, 0, 12],
    questTitle: 'LEAD NATIONAL EDUCATION INITIATIVES & HACKATHONS',
    questDescription:
      'Graduated B.Tech in Computer Science & Engineering. Appointed NEP Saarthi Ambassador by University Grants Commission (UGC). Finalist in 36-hour Lakshagriha Hackathon 1.0 & Flipkart GRiD 6.0 track.',
    metrics: [
      'B.Tech in Computer Science & Engineering (2021 – 2025)',
      'Appointed UGC NEP Saarthi Student Ambassador',
      'Lakshagriha Hackathon 1.0 Finalist',
      'Flipkart GRiD 6.0 Software Development Track'
    ],
    stack: ['Distributed Systems', 'Algorithms', 'DBMS', 'Operating Systems', 'Agile/Scrum'],
    realUrl: 'https://www.dbuu.ac.in/',
    secondaryUrl: getAssetUrl('assets/resource/SAJAL_SAXENA_RESUME_3b56c39e.pdf'),
    actionText: 'Visit University Portal (DBUU)',
    secondaryActionText: 'Download Official Resume PDF'
  },
  {
    id: 'origin-foundry',
    name: 'Origin Base & Power Ledger',
    codename: 'SECTOR-06 // FOUNDRY',
    tagline: 'Gola Gokarannath Base (PIN: 262802) · Java Relational Ledger',
    color: '#a855f7',
    accentHex: 0xa855f7,
    buildingHeight: 13,
    position: [0, 0, -20],
    questTitle: 'EXECUTE ACID TRANSACTIONS & MULTI-TABLE STORED PROCEDURES',
    questDescription:
      'Root origins in Gola Gokarannath (UP). Architected enterprise desktop billing management software with SQL Server relational schemas, stored procedures, and ACID compliance.',
    metrics: [
      'Bharat Bhushan Colony, Gola Gokarannath (PIN: 262802)',
      'Children’s Academy Senior Secondary School (PCM & Science)',
      'Java Swing/AWT Desktop Application with JDBC Engine',
      'Multi-Table Stored Procedures & Transactional Safety'
    ],
    stack: ['Java Swing/AWT', 'SQL Server', 'JDBC', 'Stored Procedures', 'Relational DBs'],
    realUrl: 'https://github.com/saxenasajal03/Portfolio',
    secondaryUrl: 'tel:+918840810386',
    actionText: 'Review Foundry Codebase',
    secondaryActionText: 'Direct Call / Telemetry'
  }
];

// Helper to create architectural illuminated window textures
function createSkyscraperWindowTexture(accentHexStr: string, isWarm: boolean = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Dark metallic façade background
  ctx.fillStyle = '#0f0b08';
  ctx.fillRect(0, 0, 256, 512);

  // Vertical structural columns
  ctx.fillStyle = '#1c1510';
  for (let c = 0; c < 256; c += 32) {
    ctx.fillRect(c, 0, 4, 512);
  }

  // Windows grid
  const rows = 32;
  const cols = 8;
  const w = 18;
  const h = 8;
  const padX = 14;
  const padY = 8;

  for (let r = 0; r < rows; r++) {
    // Floor separator
    ctx.fillStyle = '#080604';
    ctx.fillRect(0, r * (h + padY), 256, 2);

    for (let c = 0; c < cols; c++) {
      const seed = Math.sin(r * 17 + c * 23);
      if (seed > -0.2) {
        if (seed > 0.6) {
          ctx.fillStyle = accentHexStr;
          ctx.shadowColor = accentHexStr;
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = isWarm ? '#ffe6cc' : '#cceeff';
          ctx.shadowColor = isWarm ? '#ffe6cc' : '#cceeff';
          ctx.shadowBlur = 3;
        }
      } else {
        ctx.fillStyle = '#18120d';
        ctx.shadowBlur = 0;
      }
      ctx.fillRect(c * (w + padX) + 8, r * (h + padY) + 3, w, h);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  return texture;
}

export const MetaverseCityAdventure: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeDistrict, setActiveDistrict] = useState<CityDistrict>(DISTRICTS[0]);
  const [isTourPlaying, setIsTourPlaying] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'city' | 'india-map'>('city');
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  // Animation controller refs
  const tourIndexRef = useRef<number>(0);
  const tourTimerRef = useRef<number>(0);
  const cameraTargetPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 12, 28));
  const cameraLookAtPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 7, 0));

  const goToDistrict = (district: CityDistrict, manual: boolean = true) => {
    soundEngine.playTick();
    setActiveDistrict(district);
    if (manual) {
      setIsTourPlaying(false);
    }
    const [dx, dy, dz] = district.position;
    cameraTargetPos.current.set(dx + 9, dy + district.buildingHeight * 0.75 + 6, dz + 16);
    cameraLookAtPos.current.set(dx, dy + district.buildingHeight * 0.5, dz);
  };

  const toggleTour = () => {
    soundEngine.playTick();
    setIsTourPlaying((prev) => !prev);
  };

  const toggleSound = () => {
    soundEngine.toggleMute();
    setSoundMuted((prev) => !prev);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 700;

    // --- WebGL Renderer ---
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.replaceChildren(renderer.domElement);

    // --- Scene & Volumetric Cyber Fog ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060403, 0.02);

    // --- Perspective Camera ---
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 350);
    camera.position.set(0, 18, 30);
    camera.lookAt(0, 6, 0);

    // --- Environmental Lights ---
    const ambientLight = new THREE.AmbientLight(0x281d16, 1.9);
    scene.add(ambientLight);

    const sunKeyLight = new THREE.DirectionalLight(0xfff3e6, 3.0);
    sunKeyLight.position.set(30, 50, 25);
    sunKeyLight.castShadow = true;
    sunKeyLight.shadow.mapSize.width = 2048;
    sunKeyLight.shadow.mapSize.height = 2048;
    sunKeyLight.shadow.bias = -0.0004;
    scene.add(sunKeyLight);

    const cyanCyberLight = new THREE.DirectionalLight(0x06b6d4, 1.8);
    cyanCyberLight.position.set(-30, 25, -25);
    scene.add(cyanCyberLight);

    // Master City Group
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    // Master India Map Group (Toggled in map mode)
    const indiaMapGroup = new THREE.Group();
    scene.add(indiaMapGroup);
    indiaMapGroup.visible = false;

    // --- 1. Realistic Multi-Tiered Architectural Skyscrapers ---
    const districtMeshes: THREE.Group[] = [];
    const beaconRays: THREE.Mesh[] = [];
    const skyBridges: THREE.Mesh[] = [];

    // Realistic Plaza Ground with road markings
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0a0705,
      roughness: 0.9,
      metalness: 0.1
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    cityGroup.add(groundMesh);

    // Glowing Roadway Grid
    const gridHelper = new THREE.GridHelper(120, 60, 0xff9a3c, 0x1f1610);
    gridHelper.position.y = 0.02;
    cityGroup.add(gridHelper);

    DISTRICTS.forEach((dist) => {
      const distGroup = new THREE.Group();
      distGroup.position.set(dist.position[0], 0, dist.position[2]);
      distGroup.userData = { id: dist.id, district: dist };

      const totalH = dist.buildingHeight;
      const windowTex = createSkyscraperWindowTexture(dist.color, dist.id === 'urban-company');

      // TIER 1: Grand Plaza Podium (Wide Base)
      const baseW = 6.8;
      const baseH = totalH * 0.22;
      const baseGeo = new THREE.BoxGeometry(baseW, baseH, baseW);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x140e0a,
        roughness: 0.4,
        metalness: 0.7,
        map: windowTex || undefined
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = baseH / 2;
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      distGroup.add(baseMesh);

      // TIER 2: Mid-Rise Office Block (Stepped Inward)
      const midW = 5.2;
      const midH = totalH * 0.52;
      const midGeo = new THREE.BoxGeometry(midW, midH, midW);
      const midMat = new THREE.MeshStandardMaterial({
        color: 0x110c08,
        roughness: 0.3,
        metalness: 0.85,
        map: windowTex || undefined
      });
      const midMesh = new THREE.Mesh(midGeo, midMat);
      midMesh.position.y = baseH + midH / 2;
      midMesh.castShadow = true;
      midMesh.receiveShadow = true;
      distGroup.add(midMesh);

      // TIER 3: High-Rise Executive Penthouse (Narrow Sleek Tower)
      const topW = 3.8;
      const topH = totalH * 0.26;
      const topGeo = new THREE.BoxGeometry(topW, topH, topW);
      const topMat = new THREE.MeshStandardMaterial({
        color: 0x0d0906,
        roughness: 0.2,
        metalness: 0.9,
        emissive: dist.accentHex,
        emissiveIntensity: 0.15,
        map: windowTex || undefined
      });
      const topMesh = new THREE.Mesh(topGeo, topMat);
      topMesh.position.y = baseH + midH + topH / 2;
      topMesh.castShadow = true;
      topMesh.receiveShadow = true;
      distGroup.add(topMesh);

      // TIER 4: Rooftop Helipad & Mechanical Crown
      const helipadGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.4, 24);
      const helipadMat = new THREE.MeshStandardMaterial({
        color: 0x1a120c,
        metalness: 0.8
      });
      const helipadMesh = new THREE.Mesh(helipadGeo, helipadMat);
      helipadMesh.position.y = totalH + 0.2;
      distGroup.add(helipadMesh);

      // Helipad 'H' Glowing Circle
      const hRingGeo = new THREE.RingGeometry(1.2, 1.45, 32);
      const hRingMat = new THREE.MeshBasicMaterial({
        color: dist.accentHex,
        side: THREE.DoubleSide
      });
      const hRing = new THREE.Mesh(hRingGeo, hRingMat);
      hRing.rotation.x = Math.PI / 2;
      hRing.position.y = totalH + 0.42;
      distGroup.add(hRing);

      // Architectural Crown Spire / Antenna Mast
      const antennaH = 5.5;
      const antennaGeo = new THREE.CylinderGeometry(0.06, 0.2, antennaH, 8);
      const antennaMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.95
      });
      const antennaMesh = new THREE.Mesh(antennaGeo, antennaMat);
      antennaMesh.position.y = totalH + antennaH / 2;
      distGroup.add(antennaMesh);

      // Obstruction Warning Light on Top of Antenna
      const lightCapGeo = new THREE.SphereGeometry(0.35, 12, 12);
      const lightCapMat = new THREE.MeshBasicMaterial({ color: dist.accentHex });
      const lightCap = new THREE.Mesh(lightCapGeo, lightCapMat);
      lightCap.position.y = totalH + antennaH;
      distGroup.add(lightCap);

      // Volumetric Laser Beacon Ray
      const laserGeo = new THREE.CylinderGeometry(0.12, 0.12, 45, 8);
      const laserMat = new THREE.MeshBasicMaterial({
        color: dist.accentHex,
        transparent: true,
        opacity: 0.65
      });
      const laserMesh = new THREE.Mesh(laserGeo, laserMat);
      laserMesh.position.y = totalH + antennaH + 22.5;
      distGroup.add(laserMesh);
      beaconRays.push(laserMesh);

      // Rooftop Point Light
      const roofLight = new THREE.PointLight(dist.accentHex, 4.0, 25);
      roofLight.position.y = totalH + 2;
      distGroup.add(roofLight);

      // Surrounding Dense Architectural Sub-Towers
      for (let s = 0; s < 4; s++) {
        const angle = (s * Math.PI) / 2 + 0.35;
        const distR = 6.2;
        const subH = totalH * (0.35 + (s % 3) * 0.15);
        const subW = 2.8;
        const subGeo = new THREE.BoxGeometry(subW, subH, subW);
        const subMat = new THREE.MeshStandardMaterial({
          color: 0x100b07,
          roughness: 0.4,
          metalness: 0.7,
          map: windowTex || undefined
        });
        const subMesh = new THREE.Mesh(subGeo, subMat);
        subMesh.position.set(Math.cos(angle) * distR, subH / 2, Math.sin(angle) * distR);
        subMesh.castShadow = true;
        subMesh.receiveShadow = true;
        distGroup.add(subMesh);
      }

      cityGroup.add(distGroup);
      districtMeshes.push(distGroup);
    });

    // Elevated Skybridges Connecting Adjacent Towers
    const bridgeGeo = new THREE.BoxGeometry(10, 0.8, 1.4);
    const bridgeMat = new THREE.MeshStandardMaterial({
      color: 0x140e0a,
      metalness: 0.8,
      roughness: 0.3
    });
    const bridge1 = new THREE.Mesh(bridgeGeo, bridgeMat);
    bridge1.position.set(7, 9, -4.5);
    bridge1.rotation.y = Math.PI / 4.2;
    cityGroup.add(bridge1);

    const bridge2 = new THREE.Mesh(bridgeGeo, bridgeMat);
    bridge2.position.set(-7, 8, -5.5);
    bridge2.rotation.y = -Math.PI / 4.5;
    cityGroup.add(bridge2);

    // --- 2. High-Speed Cyber Traffic Streams ---
    const trafficCount = 42;
    const trafficGeo = new THREE.BoxGeometry(0.7, 0.22, 1.4);
    const trafficMatCyan = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const trafficMatAmber = new THREE.MeshBasicMaterial({ color: 0xff9a3c });

    const trafficVehicles: { mesh: THREE.Mesh; speed: number; direction: number }[] = [];

    for (let t = 0; t < trafficCount; t++) {
      const isCyan = t % 2 === 0;
      const mesh = new THREE.Mesh(trafficGeo, isCyan ? trafficMatCyan : trafficMatAmber);
      const z = (Math.random() - 0.5) * 80;
      const y = 0.5 + Math.random() * 3.5;
      const x = (Math.random() - 0.5) * 80;
      mesh.position.set(x, y, z);
      cityGroup.add(mesh);

      trafficVehicles.push({
        mesh,
        speed: 0.2 + Math.random() * 0.25,
        direction: Math.random() > 0.5 ? 1 : -1
      });
    }

    // --- 3. Ambient Atmospheric Cyber Particles ---
    const starCount = 450;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 140;
      starPos[i + 1] = Math.random() * 50 + 1;
      starPos[i + 2] = (Math.random() - 0.5) * 140;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffedd5,
      size: 0.4,
      transparent: true,
      opacity: 0.85
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    cityGroup.add(starPoints);

    // --- 4. 3D Isometric Sovereign India Map Mode ---
    const textureLoader = new THREE.TextureLoader();
    const mapTextureUrl = getAssetUrl('assets/resource/india_map_3d.png');

    textureLoader.load(
      mapTextureUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        const mapPlaneGeo = new THREE.PlaneGeometry(38, 28);
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

        // 3D Beacons for Delhi, Dehradun, Gola
        const addMapBeacon = (pos: [number, number, number], hex: number) => {
          const bGroup = new THREE.Group();
          bGroup.position.set(pos[0], pos[1], pos[2]);

          const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 6.5, 8);
          const poleMat = new THREE.MeshBasicMaterial({ color: hex });
          const pole = new THREE.Mesh(poleGeo, poleMat);
          pole.position.y = 3.25;
          bGroup.add(pole);

          const ringGeo = new THREE.RingGeometry(0.35, 0.7, 16);
          const ringMat = new THREE.MeshBasicMaterial({ color: hex, side: THREE.DoubleSide });
          const ring = new THREE.Mesh(ringGeo, ringMat);
          ring.rotation.x = Math.PI / 2;
          ring.position.y = 0.1;
          bGroup.add(ring);

          const beaconLight = new THREE.PointLight(hex, 3.5, 12);
          beaconLight.position.y = 6.5;
          bGroup.add(beaconLight);

          indiaMapGroup.add(bGroup);
        };

        addMapBeacon([-2.3, 3.8, -1.2], 0xff9a3c); // Delhi
        addMapBeacon([-1.7, 4.4, -3.2], 0x38bdf8); // Dehradun
        addMapBeacon([0.5, 3.6, -1.4], 0x10b981);  // Gola UP
      },
      undefined,
      (err) => console.warn('3D India Map asset warning:', err)
    );

    // --- 5. Interactive Raycaster to Click Skyscrapers ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
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

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // --- Handle Resize ---
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || 700;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // --- Main 60 FPS Render Loop ---
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Display toggle
      if (viewMode === 'city') {
        cityGroup.visible = true;
        indiaMapGroup.visible = false;
      } else {
        cityGroup.visible = false;
        indiaMapGroup.visible = true;
        indiaMapGroup.rotation.y = Math.sin(elapsed * 0.2) * 0.12;
      }

      // Autopilot Story Tour
      if (isTourPlaying && viewMode === 'city') {
        tourTimerRef.current += delta;
        if (tourTimerRef.current > 7.5) {
          tourTimerRef.current = 0;
          tourIndexRef.current = (tourIndexRef.current + 1) % DISTRICTS.length;
          const nextDist = DISTRICTS[tourIndexRef.current];
          setActiveDistrict(nextDist);
          const [nx, ny, nz] = nextDist.position;
          cameraTargetPos.current.set(nx + 9, ny + nextDist.buildingHeight * 0.75 + 6, nz + 16);
          cameraLookAtPos.current.set(nx, ny + nextDist.buildingHeight * 0.5, nz);
        }
      }

      // Exponential Damping Camera Transition
      if (viewMode === 'city') {
        camera.position.lerp(cameraTargetPos.current, 0.045);
        camera.lookAt(cameraLookAtPos.current);
      } else {
        camera.position.lerp(new THREE.Vector3(0, 24, 30), 0.045);
        camera.lookAt(0, 3, 0);
      }

      // Animate Vehicles
      trafficVehicles.forEach((car) => {
        car.mesh.position.x += car.speed * car.direction;
        if (car.mesh.position.x > 55) car.mesh.position.x = -55;
        if (car.mesh.position.x < -55) car.mesh.position.x = 55;
      });

      // Pulse Laser Beacons
      beaconRays.forEach((ray, i) => {
        const s = 1 + Math.sin(elapsed * 3.5 + i) * 0.25;
        ray.scale.set(s, 1, s);
      });

      // Ambient Cyber Dust
      starPoints.rotation.y = elapsed * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.dispose();
    };
  }, [viewMode, isTourPlaying]);

  return (
    <div className="relative w-full h-[660px] sm:h-[760px] bg-[#070503] overflow-hidden select-none border-b border-white/10">
      {/* 3D WebGL Canvas Viewport */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD: Metaverse Adventure Game Interface */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pointer-events-none">
        
        {/* Active Quest Tracker */}
        <div className="pointer-events-auto bg-[#120e0a]/95 backdrop-blur-md border border-white/15 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3.5 max-w-lg">
          <div className="w-10 h-10 rounded-lg bg-[#ff9a3c]/15 border border-[#ff9a3c]/40 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-[#ff9a3c]" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#ff9a3c] uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
              <span>{activeDistrict.codename}</span>
            </div>
            <h4 className="text-white text-xs sm:text-sm font-bold tracking-tight line-clamp-1 mt-0.5">
              {activeDistrict.questTitle}
            </h4>
          </div>
        </div>

        {/* View Mode & Audio Controls */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#120e0a]/95 backdrop-blur-md border border-white/15 p-1.5 rounded-xl shadow-xl">
          <button
            onClick={() => {
              soundEngine.playTick();
              setViewMode('city');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'city'
                ? 'bg-[#ff9a3c] text-[#120e0a] shadow-[0_0_15px_rgba(255,154,60,0.4)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers size={13} />
            <span>3D ARCHITECTURAL CITY</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playTick();
              setViewMode('india-map');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'india-map'
                ? 'bg-[#06b6d4] text-[#120e0a] shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Compass size={13} />
            <span>3D INDIA MAP</span>
          </button>

          <button
            onClick={toggleTour}
            className={`p-2 rounded-lg border text-xs font-mono transition-colors ${
              isTourPlaying
                ? 'bg-[#10b981]/20 border-[#10b981]/50 text-[#10b981]'
                : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
            }`}
            title={isTourPlaying ? 'Pause Story Tour' : 'Resume Story Tour'}
          >
            {isTourPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-colors"
            title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {soundMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      </div>

      {/* Floating Bottom District Console / Telemetry HUD */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex flex-col md:flex-row items-end justify-between gap-4">
        
        {/* District Detail Card with REAL CTA Links */}
        <div className="pointer-events-auto w-full md:max-w-xl bg-[#120e0a]/95 backdrop-blur-xl border border-white/15 p-5 sm:p-6 rounded-2xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span
                className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded uppercase"
                style={{
                  backgroundColor: `${activeDistrict.color}20`,
                  color: activeDistrict.color,
                  border: `1px solid ${activeDistrict.color}40`
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
              <div key={i} className="flex items-start gap-2 text-[11px] text-neutral-200 bg-white/5 p-2 rounded-lg border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: activeDistrict.color }} />
                <span>{metric}</span>
              </div>
            ))}
          </div>

          {/* REAL CTA Action Links & Stack */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-white/10">
            <div className="flex flex-wrap gap-1.5">
              {activeDistrict.stack.slice(0, 3).map((tech, i) => (
                <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 border border-white/10 text-neutral-300">
                  {tech}
                </span>
              ))}
            </div>

            {/* REAL Working Action CTA Buttons */}
            <div className="flex items-center gap-2">
              <a
                href={activeDistrict.realUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEngine.playTick()}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95"
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
                  className="px-3 py-1.5 rounded-lg text-xs font-medium font-mono text-neutral-200 bg-white/10 hover:bg-white/20 transition-all flex items-center gap-1 border border-white/15"
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
                className={`px-3 py-2 rounded-xl text-left font-mono transition-all border shrink-0 flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-[#120e0a] text-white shadow-xl scale-102'
                    : 'bg-black/60 text-neutral-400 hover:text-white hover:bg-black/80'
                }`}
                style={{
                  borderColor: isSelected ? d.color : 'rgba(255,255,255,0.1)'
                }}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
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
