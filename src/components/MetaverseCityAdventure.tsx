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
  Car
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
    position: [16, 0, -11],
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
    position: [-16, 0, -13],
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
    name: 'ConnectX Broadcast & Telecom Mast',
    codename: 'SECTOR-04 // TELECOM RADAR ARRAY',
    tagline: 'Sub-100ms Peer-to-Peer Mesh Audio/Video & Real-Time Messaging',
    color: '#eab308',
    accentHex: 0xeab308,
    buildingHeight: 17,
    position: [17, 0, 14],
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
    name: 'Rockford Academic Quad & Dome',
    codename: 'SECTOR-05 // CITADEL OF ENGINEERING',
    tagline: 'Dev Bhoomi Uttarakhand University (2021–2025) · UGC NEP Saarthi',
    color: '#38bdf8',
    accentHex: 0x38bdf8,
    buildingHeight: 11,
    position: [-16, 0, 14],
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
    name: 'Paleto Grid & Industrial Substation',
    codename: 'SECTOR-06 // POWER FOUNDRY',
    tagline: 'Gola Gokarannath Base (PIN: 262802) · Java Relational Ledger',
    color: '#ec4899',
    accentHex: 0xec4899,
    buildingHeight: 10,
    position: [0, 0, -22],
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

export const MetaverseCityAdventure: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeDistrict, setActiveDistrict] = useState<CityDistrict>(DISTRICTS[0]);
  const [isTourPlaying, setIsTourPlaying] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'city' | 'india-map'>('city');
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  const tourIndexRef = useRef<number>(0);
  const tourTimerRef = useRef<number>(0);
  const cameraTargetPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 15, 26));
  const cameraLookAtPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 5, 0));

  const goToDistrict = (district: CityDistrict, manual: boolean = true) => {
    soundEngine.playTick();
    setActiveDistrict(district);
    if (manual) {
      setIsTourPlaying(false);
    }
    const [dx, dy, dz] = district.position;
    cameraTargetPos.current.set(dx + 11, dy + district.buildingHeight * 0.75 + 6, dz + 16);
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

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 720;

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
    renderer.toneMappingExposure = 1.3;
    container.replaceChildren(renderer.domElement);

    // --- Scene & GTA Cinematic Atmosphere ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a1410, 0.013);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 350);
    camera.position.set(0, 18, 28);
    camera.lookAt(0, 4, 0);

    // --- GTA Sunny Lighting ---
    const skyLight = new THREE.HemisphereLight(0xfff5ea, 0x3a2c20, 2.2);
    scene.add(skyLight);

    const sunLight = new THREE.DirectionalLight(0xfffaec, 3.2);
    sunLight.position.set(30, 50, 25);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);

    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    const indiaMapGroup = new THREE.Group();
    scene.add(indiaMapGroup);
    indiaMapGroup.visible = false;

    // --- 1. GTA Streets, Highways & Crosswalks ---
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x1f1914, roughness: 0.9 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    cityGroup.add(ground);

    // Dark Asphalt Multi-Lane Roads
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x222224, roughness: 0.65 });
    const roadNS = new THREE.Mesh(new THREE.PlaneGeometry(18, 150), roadMat);
    roadNS.rotation.x = -Math.PI / 2;
    roadNS.position.set(0, 0.02, 0);
    roadNS.receiveShadow = true;
    cityGroup.add(roadNS);

    const roadEW = new THREE.Mesh(new THREE.PlaneGeometry(150, 18), roadMat);
    roadEW.rotation.x = -Math.PI / 2;
    roadEW.position.set(0, 0.02, 0);
    roadEW.receiveShadow = true;
    cityGroup.add(roadEW);

    // GTA Yellow Double Center Lines
    const yellowLineMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const addYellowDividers = (isNS: boolean) => {
      for (let i = -70; i <= 70; i += 6) {
        if (Math.abs(i) < 14) continue;
        const line1 = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 3.5), yellowLineMat);
        line1.rotation.x = -Math.PI / 2;
        if (isNS) {
          line1.position.set(-0.25, 0.04, i);
        } else {
          line1.rotation.z = Math.PI / 2;
          line1.position.set(i, 0.04, -0.25);
        }
        cityGroup.add(line1);

        const line2 = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 3.5), yellowLineMat);
        line2.rotation.x = -Math.PI / 2;
        if (isNS) {
          line2.position.set(0.25, 0.04, i);
        } else {
          line2.rotation.z = Math.PI / 2;
          line2.position.set(i, 0.04, 0.25);
        }
        cityGroup.add(line2);
      }
    };
    addYellowDividers(true);
    addYellowDividers(false);

    // White Zebra Crossings
    const zebraMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const addCrosswalk = (cx: number, cz: number, isV: boolean) => {
      const g = new THREE.Group();
      for (let i = -4; i <= 4; i++) {
        const stripe = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 4.2), zebraMat);
        stripe.rotation.x = -Math.PI / 2;
        if (isV) {
          stripe.rotation.z = Math.PI / 2;
          stripe.position.set(0, 0.05, i * 1.4);
        } else {
          stripe.position.set(i * 1.4, 0.05, 0);
        }
        g.add(stripe);
      }
      g.position.set(cx, 0, cz);
      cityGroup.add(g);
    };
    addCrosswalk(0, 13, false);
    addCrosswalk(0, -13, false);
    addCrosswalk(13, 0, true);
    addCrosswalk(-13, 0, true);

    // Sidewalk Curbs & Lawns
    const curbMat = new THREE.MeshStandardMaterial({ color: 0xd6d3cb, roughness: 0.5 });
    const lawnMat = new THREE.MeshStandardMaterial({ color: 0x42962e, roughness: 0.8 });

    const addCityBlockPodium = (px: number, pz: number, w: number, d: number) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(px, 0, pz);

      const curb = new THREE.Mesh(new THREE.BoxGeometry(w, 0.35, d), curbMat);
      curb.position.y = 0.175;
      curb.receiveShadow = true;
      bGroup.add(curb);

      const lawn = new THREE.Mesh(new THREE.BoxGeometry(w - 2.8, 0.42, d - 2.8), lawnMat);
      lawn.position.y = 0.21;
      lawn.receiveShadow = true;
      bGroup.add(lawn);

      cityGroup.add(bGroup);
    };

    addCityBlockPodium(20, -20, 22, 22);
    addCityBlockPodium(-20, -20, 22, 22);
    addCityBlockPodium(20, 20, 22, 22);
    addCityBlockPodium(-20, 20, 22, 22);

    // --- 2. GTA Street Props & Trees ---
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x583e28, roughness: 0.8 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x36a822, roughness: 0.6, flatShading: true });
    const foliageMatDark = new THREE.MeshStandardMaterial({ color: 0x1f7a18, roughness: 0.6, flatShading: true });

    const addAvenueTree = (tx: number, tz: number, scale = 1.0) => {
      const tree = new THREE.Group();
      tree.position.set(tx, 0, tz);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25 * scale, 0.35 * scale, 2.4 * scale, 6), trunkMat);
      trunk.position.y = 1.2 * scale;
      trunk.castShadow = true;
      tree.add(trunk);

      const fol1 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.4 * scale, 1), foliageMat);
      fol1.position.y = 2.6 * scale;
      fol1.castShadow = true;
      tree.add(fol1);

      const fol2 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1 * scale, 1), foliageMatDark);
      fol2.position.set(0.3 * scale, 3.4 * scale, 0);
      fol2.castShadow = true;
      tree.add(fol2);

      cityGroup.add(tree);
    };

    const treePositions = [
      [11, 12], [11, 19], [11, 26],
      [-11, 12], [-11, 19], [-11, 26],
      [11, -12], [11, -19], [11, -26],
      [-11, -12], [-11, -19], [-11, -26],
      [17, 11], [24, 11], [-17, 11], [-24, 11],
      [17, -11], [24, -11], [-17, -11], [-24, -11]
    ];
    treePositions.forEach(([tx, tz]) => addAvenueTree(tx, tz, 0.9 + Math.random() * 0.2));

    // GTA Street Lamps & Hydrants
    const postMat = new THREE.MeshStandardMaterial({ color: 0x374151, metalness: 0.8 });
    const lampGlowMat = new THREE.MeshBasicMaterial({ color: 0xfff2a3 });

    const addGtaStreetLamp = (lx: number, lz: number) => {
      const g = new THREE.Group();
      g.position.set(lx, 0, lz);

      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 3.8, 8), postMat);
      post.position.y = 1.9;
      post.castShadow = true;
      g.add(post);

      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.08), postMat);
      arm.position.set(lx > 0 ? -0.4 : 0.4, 3.8, 0);
      g.add(arm);

      const lightHead = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), lampGlowMat);
      lightHead.position.set(lx > 0 ? -0.7 : 0.7, 3.75, 0);
      g.add(lightHead);

      cityGroup.add(g);
    };

    addGtaStreetLamp(10.8, 6);
    addGtaStreetLamp(-10.8, 6);
    addGtaStreetLamp(10.8, -6);
    addGtaStreetLamp(-10.8, -6);

    // --- 3. GTA Developer-Grade Iconic Skyscrapers ---
    const districtMeshes: THREE.Group[] = [];

    // TOWER 1: Maze Bank / Urban Quality Tower (Stepped Cylindrical Icon with Helipad & Spire)
    const buildUrbanQualityTower = (dist: CityDistrict) => {
      const g = new THREE.Group();
      g.position.set(dist.position[0], 0, dist.position[2]);
      g.userData = { id: dist.id, district: dist };

      const glassMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.85, roughness: 0.2 });
      const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      const goldTrim = new THREE.MeshStandardMaterial({ color: 0xff9a3c, metalness: 0.8 });

      // Lower Rotunda Podium
      const podium = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.6, 3.5, 32), whiteMat);
      podium.position.y = 1.75;
      podium.castShadow = true;
      g.add(podium);

      // Main Soaring Tower Shaft
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.6, 9.5, 32), glassMat);
      shaft.position.y = 3.5 + 4.75;
      shaft.castShadow = true;
      g.add(shaft);

      // Stepped Executive Penthouse Level
      const penthouse = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.8, 4.0, 32), whiteMat);
      penthouse.position.y = 3.5 + 9.5 + 2.0;
      penthouse.castShadow = true;
      g.add(penthouse);

      // Helipad on Rooftop
      const helipad = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 0.4, 32), new THREE.MeshStandardMaterial({ color: 0x334155 }));
      helipad.position.y = 3.5 + 9.5 + 4.0 + 0.2;
      g.add(helipad);

      const hRing = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.5, 32), new THREE.MeshBasicMaterial({ color: 0xff9a3c, side: THREE.DoubleSide }));
      hRing.rotation.x = Math.PI / 2;
      hRing.position.y = 3.5 + 9.5 + 4.0 + 0.42;
      g.add(hRing);

      // GTA Maze Bank Antenna Mast with Obstruction Light
      const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.18, 5.5, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9 }));
      antenna.position.y = 3.5 + 9.5 + 4.0 + 2.75;
      g.add(antenna);

      const topLight = new THREE.PointLight(0xff9a3c, 4.5, 18);
      topLight.position.y = 3.5 + 9.5 + 4.0 + 5.5;
      g.add(topLight);

      cityGroup.add(g);
      districtMeshes.push(g);
    };

    // TOWER 2: Elexoplus Twin Towers with Suspended Skybridge
    const buildElexoplusTwinTowers = (dist: CityDistrict) => {
      const g = new THREE.Group();
      g.position.set(dist.position[0], 0, dist.position[2]);
      g.userData = { id: dist.id, district: dist };

      const cyanGlass = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.2 });
      const titanMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });

      // Tower A (D2C Wing)
      const towerA = new THREE.Mesh(new THREE.BoxGeometry(3.6, 14, 3.6), cyanGlass);
      towerA.position.set(-2.8, 7, 0);
      towerA.castShadow = true;
      g.add(towerA);

      // Tower B (B2B Wing)
      const towerB = new THREE.Mesh(new THREE.BoxGeometry(3.6, 12, 3.6), cyanGlass);
      towerB.position.set(2.8, 6, 0);
      towerB.castShadow = true;
      g.add(towerB);

      // Suspended Glass Skybridge connecting Twin Towers mid-air
      const skybridge = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.4, 2.0), titanMat);
      skybridge.position.set(0, 8.5, 0);
      skybridge.castShadow = true;
      g.add(skybridge);

      // Crown Bevels
      const crownA = new THREE.Mesh(new THREE.ConeGeometry(2.4, 2.5, 4), new THREE.MeshStandardMaterial({ color: 0x06b6d4 }));
      crownA.rotation.y = Math.PI / 4;
      crownA.position.set(-2.8, 14 + 1.25, 0);
      g.add(crownA);

      cityGroup.add(g);
      districtMeshes.push(g);
    };

    // TOWER 3: FIB / Neural AI Research Spire
    const buildNeuralLabsSpire = (dist: CityDistrict) => {
      const g = new THREE.Group();
      g.position.set(dist.position[0], 0, dist.position[2]);
      g.userData = { id: dist.id, district: dist };

      const darkSpireMat = new THREE.MeshStandardMaterial({ color: 0x022c22, metalness: 0.85, roughness: 0.3 });
      const emeraldGlow = new THREE.MeshBasicMaterial({ color: 0x10b981 });

      // Stepped Angular Research Block
      const lower = new THREE.Mesh(new THREE.BoxGeometry(7, 6, 7), darkSpireMat);
      lower.position.y = 3;
      lower.castShadow = true;
      g.add(lower);

      const upper = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 3.2, 7, 8), darkSpireMat);
      upper.position.y = 6 + 3.5;
      upper.castShadow = true;
      g.add(upper);

      // Radome Satellite Sphere
      const radome = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 16), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      radome.position.set(1.5, 6 + 7 + 1.2, 0);
      radome.castShadow = true;
      g.add(radome);

      // Green Laser Core Spire
      const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.2, 4.5, 8), emeraldGlow);
      spire.position.set(-1.0, 6 + 7 + 2.25, 0);
      g.add(spire);

      cityGroup.add(g);
      districtMeshes.push(g);
    };

    // TOWER 4: ConnectX Radio Broadcast & Telecom Array
    const buildConnectXBroadcast = (dist: CityDistrict) => {
      const g = new THREE.Group();
      g.position.set(dist.position[0], 0, dist.position[2]);
      g.userData = { id: dist.id, district: dist };

      const goldMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.2 });
      const redTowerMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });

      // Circular Rotunda Base
      const rotunda = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 4.2, 7.5, 24), goldMat);
      rotunda.position.y = 3.75;
      rotunda.castShadow = true;
      g.add(rotunda);

      // GTA Mount Chiliad-Style Lattice Broadcast Tower
      const lattice = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 1.6, 8.5, 4), redTowerMat);
      lattice.position.y = 7.5 + 4.25;
      lattice.castShadow = true;
      g.add(lattice);

      // Giant Satellite Dish
      const dish = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 0.4, 0.6, 16), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      dish.rotation.x = Math.PI / 3;
      dish.position.set(1.4, 7.5 + 2.5, 1.4);
      g.add(dish);

      cityGroup.add(g);
      districtMeshes.push(g);
    };

    // TOWER 5: Rockford Academic Quad & Terracotta Dome (Matching Reference Image)
    const buildAcademicQuad = (dist: CityDistrict) => {
      const g = new THREE.Group();
      g.position.set(dist.position[0], 0, dist.position[2]);
      g.userData = { id: dist.id, district: dist };

      const marbleMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.3 });
      const domeMat = new THREE.MeshStandardMaterial({ color: 0xe87a20, roughness: 0.4 });

      const hall = new THREE.Mesh(new THREE.BoxGeometry(7.5, 5.5, 7.5), marbleMat);
      hall.position.y = 2.75;
      hall.castShadow = true;
      g.add(hall);

      for (let c = -2.6; c <= 2.6; c += 1.3) {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 5.5, 12), marbleMat);
        col.position.set(c, 2.75, 4.0);
        col.castShadow = true;
        g.add(col);
      }

      const dome = new THREE.Mesh(new THREE.SphereGeometry(2.8, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
      dome.position.y = 5.5;
      dome.castShadow = true;
      g.add(dome);

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

      const core = new THREE.Mesh(new THREE.BoxGeometry(8, 5, 7), industrial);
      core.position.y = 2.5;
      core.castShadow = true;
      g.add(core);

      const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 5.5, 16), warningPink);
      stack.position.set(2, 5 + 2.75, 0);
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

    // --- 4. GTA Style Fleet of Sports Cars with Lit Headlights ---
    const carMatYellow = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 }); // Taxi
    const carMatRed = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 });    // Sports Car
    const carMatBlack = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.2 });  // Executive Sedan
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const taillightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

    const createGtaCar = (bodyMat: THREE.Material) => {
      const car = new THREE.Group();

      const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.65, 3.2), bodyMat);
      chassis.position.y = 0.5;
      chassis.castShadow = true;
      car.add(chassis);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.55, 1.7), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 }));
      cabin.position.set(0, 1.0, -0.2);
      car.add(cabin);

      // Glowing Headlights
      const hlL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.1), headlightMat);
      hlL.position.set(0.5, 0.55, 1.62);
      car.add(hlL);

      const hlR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.1), headlightMat);
      hlR.position.set(-0.5, 0.55, 1.62);
      car.add(hlR);

      // Glowing Red Taillights
      const tlL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.1), taillightMat);
      tlL.position.set(0.5, 0.55, -1.62);
      car.add(tlL);

      const tlR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.1), taillightMat);
      tlR.position.set(-0.5, 0.55, -1.62);
      car.add(tlR);

      return car;
    };

    const gtaTraffic: { group: THREE.Group; speed: number; direction: number; isNS: boolean }[] = [];

    for (let c = 0; c < 8; c++) {
      const mat = c % 3 === 0 ? carMatYellow : c % 3 === 1 ? carMatRed : carMatBlack;
      const car = createGtaCar(mat);
      const isNS = c % 2 === 0;

      if (isNS) {
        car.position.set(c % 4 === 0 ? 4.2 : -4.2, 0, (Math.random() - 0.5) * 80);
      } else {
        car.rotation.y = Math.PI / 2;
        car.position.set((Math.random() - 0.5) * 80, 0, c % 4 === 0 ? 4.2 : -4.2);
      }
      cityGroup.add(car);
      gtaTraffic.push({
        group: car,
        speed: 0.18 + Math.random() * 0.14,
        direction: Math.random() > 0.5 ? 1 : -1,
        isNS
      });
    }

    // --- 5. 3D Isometric Sovereign India Map Mode ---
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

    // --- Interactive Orbit Drag & Raycaster ---
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
        cameraTargetPos.current.y = Math.max(8, Math.min(30, cameraTargetPos.current.y - dy * 0.05));
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

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

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

      if (isTourPlaying && viewMode === 'city') {
        tourTimerRef.current += delta;
        if (tourTimerRef.current > 7.5) {
          tourTimerRef.current = 0;
          tourIndexRef.current = (tourIndexRef.current + 1) % DISTRICTS.length;
          const nextDist = DISTRICTS[tourIndexRef.current];
          setActiveDistrict(nextDist);
          const [nx, ny, nz] = nextDist.position;
          cameraTargetPos.current.set(nx + 11, ny + nextDist.buildingHeight * 0.75 + 6, nz + 16);
          cameraLookAtPos.current.set(nx, ny + nextDist.buildingHeight * 0.45, nz);
        }
      }

      if (viewMode === 'city') {
        camera.position.lerp(cameraTargetPos.current, 0.045);
        camera.lookAt(cameraLookAtPos.current);
      } else {
        camera.position.lerp(new THREE.Vector3(0, 24, 30), 0.045);
        camera.lookAt(0, 3, 0);
      }

      // Move GTA Traffic
      gtaTraffic.forEach((car) => {
        if (car.isNS) {
          car.group.position.z += car.speed * car.direction;
          if (car.group.position.z > 65) car.group.position.z = -65;
          if (car.group.position.z < -65) car.group.position.z = 65;
        } else {
          car.group.position.x += car.speed * car.direction;
          if (car.group.position.x > 65) car.group.position.x = -65;
          if (car.group.position.x < -65) car.group.position.x = 65;
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
      renderer.dispose();
    };
  }, [viewMode, isTourPlaying]);

  return (
    <div className="relative w-full h-[680px] sm:h-[760px] bg-[#0c0906] overflow-hidden select-none border-b border-white/10">
      {/* 3D WebGL Canvas Viewport */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD: GTA Adventure Interface */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pointer-events-none">
        
        {/* Active Quest / Target Landmark */}
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
            <span>3D ADVENTURE CITY</span>
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

          {/* REAL Working Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-white/10">
            <div className="flex flex-wrap gap-1.5">
              {activeDistrict.stack.slice(0, 3).map((tech, i) => (
                <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 border border-white/10 text-neutral-300">
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
