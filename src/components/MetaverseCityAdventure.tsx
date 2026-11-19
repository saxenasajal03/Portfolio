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
    name: 'Central Quality Capitol',
    codename: 'SECTOR-01 // URBAN COMPANY HQ',
    tagline: 'Urban Company · Central SBC Quality Team · Ghitorni, New Delhi',
    color: '#ff9a3c',
    accentHex: 0xff9a3c,
    buildingHeight: 12,
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
    name: 'Elexoplus Commercial Complex',
    codename: 'SECTOR-02 // ELEXOPLUS ERP',
    tagline: 'Dual Architecture: D2C Storefront + B2B Wholesale Portal',
    color: '#06b6d4',
    accentHex: 0x06b6d4,
    buildingHeight: 10,
    position: [15, 0, -10],
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
    name: 'Neural AI & Helipad Tower',
    codename: 'SECTOR-03 // AI CORE',
    tagline: 'Oracle Cloud Certified GenAI Professional · Feynn Labs · Foliar CNN',
    color: '#10b981',
    accentHex: 0x10b981,
    buildingHeight: 11,
    position: [-16, 0, -12],
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
    name: 'ConnectX Golden Rotunda',
    codename: 'SECTOR-04 // TELECOM ROTUNDA',
    tagline: 'Sub-100ms Peer-to-Peer Mesh Audio/Video & Real-Time Messaging',
    color: '#eab308',
    accentHex: 0xeab308,
    buildingHeight: 11,
    position: [16, 0, 13],
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
    name: 'Academic Quad & NEP Pavilion',
    codename: 'SECTOR-05 // ACADEMIC CITADEL',
    tagline: 'Dev Bhoomi Uttarakhand University (2021–2025) · UGC NEP Saarthi',
    color: '#38bdf8',
    accentHex: 0x38bdf8,
    buildingHeight: 9,
    position: [-15, 0, 13],
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
    name: 'Gola Foundry & Power Ledger',
    codename: 'SECTOR-06 // FOUNDRY HUB',
    tagline: 'Gola Gokarannath Base (PIN: 262802) · Java Relational Ledger',
    color: '#ec4899',
    accentHex: 0xec4899,
    buildingHeight: 9,
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
  const cameraTargetPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 14, 26));
  const cameraLookAtPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 5, 0));

  const goToDistrict = (district: CityDistrict, manual: boolean = true) => {
    soundEngine.playTick();
    setActiveDistrict(district);
    if (manual) {
      setIsTourPlaying(false);
    }
    const [dx, dy, dz] = district.position;
    cameraTargetPos.current.set(dx + 10, dy + district.buildingHeight * 0.8 + 6, dz + 15);
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

    // --- WebGL Renderer with High-Quality Isometric Stylized Lighting ---
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
    renderer.toneMappingExposure = 1.25;
    container.replaceChildren(renderer.domElement);

    // --- Scene with Sunny Ambient Sky ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a1410, 0.014);

    // --- Isometric Adventure Perspective Camera ---
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 350);
    camera.position.set(0, 18, 28);
    camera.lookAt(0, 4, 0);

    // --- Sunny Stylized Lighting matching reference image ---
    const skyLight = new THREE.HemisphereLight(0xfff6ea, 0x3d3128, 2.0);
    scene.add(skyLight);

    const sunLight = new THREE.DirectionalLight(0xfffaec, 2.8);
    sunLight.position.set(25, 45, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);

    const softFill = new THREE.DirectionalLight(0xbadfff, 1.2);
    softFill.position.set(-25, 25, -20);
    scene.add(softFill);

    // Master City Group
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    // Master India Map Group
    const indiaMapGroup = new THREE.Group();
    scene.add(indiaMapGroup);
    indiaMapGroup.visible = false;

    // --- 1. Realistic Streets, Crosswalks & Sidewalks ---
    // Ground Base
    const groundGeo = new THREE.PlaneGeometry(150, 150);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x221a14,
      roughness: 0.9,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    cityGroup.add(groundMesh);

    // Asphalt Roads (Intersection Cross Roads)
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x242426, roughness: 0.7 });
    const roadNS = new THREE.Mesh(new THREE.PlaneGeometry(16, 140), roadMat);
    roadNS.rotation.x = -Math.PI / 2;
    roadNS.position.set(0, 0.02, 0);
    roadNS.receiveShadow = true;
    cityGroup.add(roadNS);

    const roadEW = new THREE.Mesh(new THREE.PlaneGeometry(140, 16), roadMat);
    roadEW.rotation.x = -Math.PI / 2;
    roadEW.position.set(0, 0.02, 0);
    roadEW.receiveShadow = true;
    cityGroup.add(roadEW);

    // White Zebra Crossings & Center Lines
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const zebraGeo = new THREE.PlaneGeometry(1.0, 3.8);

    const addZebraGroup = (cx: number, cz: number, isVertical: boolean) => {
      const zGroup = new THREE.Group();
      for (let i = -3; i <= 3; i++) {
        const stripe = new THREE.Mesh(zebraGeo, lineMat);
        stripe.rotation.x = -Math.PI / 2;
        if (isVertical) {
          stripe.rotation.z = Math.PI / 2;
          stripe.position.set(0, 0.04, i * 1.5);
        } else {
          stripe.position.set(i * 1.5, 0.04, 0);
        }
        zGroup.add(stripe);
      }
      zGroup.position.set(cx, 0, cz);
      cityGroup.add(zGroup);
    };

    // 4 Crosswalks at central intersection
    addZebraGroup(0, 11, false);
    addZebraGroup(0, -11, false);
    addZebraGroup(11, 0, true);
    addZebraGroup(-11, 0, true);

    // Sidewalk Curbs & Lawns (Blocks)
    const curbMat = new THREE.MeshStandardMaterial({ color: 0xdfdfdb, roughness: 0.6 });
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x48a832, roughness: 0.8 });

    const createBlockPodium = (px: number, pz: number, w: number, d: number) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(px, 0, pz);

      // Sidewalk concrete curb
      const curb = new THREE.Mesh(new THREE.BoxGeometry(w, 0.25, d), curbMat);
      curb.position.y = 0.125;
      curb.receiveShadow = true;
      pGroup.add(curb);

      // Inner manicured grass lawn
      const lawn = new THREE.Mesh(new THREE.BoxGeometry(w - 2.5, 0.3, d - 2.5), grassMat);
      lawn.position.y = 0.15;
      lawn.receiveShadow = true;
      pGroup.add(lawn);

      cityGroup.add(pGroup);
    };

    createBlockPodium(18, -18, 20, 20);
    createBlockPodium(-18, -18, 20, 20);
    createBlockPodium(18, 18, 20, 20);
    createBlockPodium(-18, 18, 20, 20);

    // --- 2. Low-Poly Foliage Trees & Props (Matching Image Style) ---
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3d28, roughness: 0.8 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x38b024, roughness: 0.7, flatShading: true });
    const foliageMatDark = new THREE.MeshStandardMaterial({ color: 0x228b22, roughness: 0.7, flatShading: true });

    const addStylizedTree = (tx: number, tz: number, scale: number = 1.0) => {
      const tree = new THREE.Group();
      tree.position.set(tx, 0, tz);

      // Trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25 * scale, 0.35 * scale, 2.2 * scale, 6), trunkMat);
      trunk.position.y = 1.1 * scale;
      trunk.castShadow = true;
      tree.add(trunk);

      // Segmented Foliage Spheres
      const fol1 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.3 * scale, 1), foliageMat);
      fol1.position.y = 2.4 * scale;
      fol1.castShadow = true;
      tree.add(fol1);

      const fol2 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.0 * scale, 1), foliageMatDark);
      fol2.position.set(0.3 * scale, 3.2 * scale, 0);
      fol2.castShadow = true;
      tree.add(fol2);

      cityGroup.add(tree);
    };

    // Plant Avenue Trees along curbs
    const treeCoords = [
      [9.5, 10], [9.5, 17], [9.5, 24],
      [-9.5, 10], [-9.5, 17], [-9.5, 24],
      [9.5, -10], [9.5, -17], [9.5, -24],
      [-9.5, -10], [-9.5, -17], [-9.5, -24],
      [14, 9.5], [21, 9.5], [-14, 9.5], [-21, 9.5],
      [14, -9.5], [21, -9.5], [-14, -9.5], [-21, -9.5]
    ];
    treeCoords.forEach(([tx, tz]) => addStylizedTree(tx, tz, 0.85 + Math.random() * 0.25));

    // Street Lamps & Red Telephone Booths
    const lampMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.8 });
    const boothMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });

    const addStreetProps = (px: number, pz: number) => {
      // Lamp Post
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 3.2, 8), lampMat);
      post.position.set(px, 1.6, pz);
      post.castShadow = true;
      cityGroup.add(post);

      const lampHead = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), new THREE.MeshBasicMaterial({ color: 0xfff4cc }));
      lampHead.position.set(px, 3.3, pz);
      cityGroup.add(lampHead);
    };

    addStreetProps(9.5, 4);
    addStreetProps(-9.5, 4);
    addStreetProps(9.5, -4);
    addStreetProps(-9.5, -4);

    // --- 3. Construct Stylized Buildings for Districts ---
    const districtMeshes: THREE.Group[] = [];

    // SECTOR 1: Central Quality Capitol (Orange Dome with White Greek Columns) - Exactly like user image!
    const createCentralCapitol = (dist: CityDistrict) => {
      const g = new THREE.Group();
      g.position.set(dist.position[0], 0, dist.position[2]);
      g.userData = { id: dist.id, district: dist };

      const marbleMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.3 });
      const columnMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
      const domeMat = new THREE.MeshStandardMaterial({ color: 0xe87a20, roughness: 0.4 }); // Terracotta Orange Dome
      const glassMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.7, roughness: 0.2 });
      const roofBlueMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4 });

      // Plinth Base with Steps
      const base = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.8, 8.5), marbleMat);
      base.position.y = 0.4;
      base.castShadow = true;
      base.receiveShadow = true;
      g.add(base);

      // Main Classical Hall Body
      const hall = new THREE.Mesh(new THREE.BoxGeometry(7.2, 5.5, 7.2), marbleMat);
      hall.position.y = 0.8 + 2.75;
      hall.castShadow = true;
      hall.receiveShadow = true;
      g.add(hall);

      // Front Blue Glass Portal Entrance
      const door = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.8, 0.4), glassMat);
      door.position.set(0, 0.8 + 1.9, 3.65);
      g.add(door);

      // 6 Front Classical Columns
      for (let c = -2.5; c <= 2.5; c += 1.25) {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 5.5, 12), columnMat);
        col.position.set(c, 0.8 + 2.75, 3.85);
        col.castShadow = true;
        g.add(col);
      }

      // Classical Triangular Pediment Roof
      const pediment = new THREE.Mesh(new THREE.ConeGeometry(5.4, 2.2, 4), marbleMat);
      pediment.rotation.y = Math.PI / 4;
      pediment.position.y = 0.8 + 5.5 + 1.1;
      pediment.castShadow = true;
      g.add(pediment);

      // Grand Terracotta Orange Dome (Signature feature matching image!)
      const dome = new THREE.Mesh(new THREE.SphereGeometry(2.8, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
      dome.position.y = 0.8 + 5.5 + 1.6;
      dome.castShadow = true;
      g.add(dome);

      // Lantern Cupola on Top of Dome
      const cupola = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 1.2, 12), marbleMat);
      cupola.position.y = 0.8 + 5.5 + 1.6 + 2.8 + 0.6;
      g.add(cupola);

      const beaconLight = new THREE.PointLight(0xff9a3c, 3.5, 15);
      beaconLight.position.y = 12;
      g.add(beaconLight);

      cityGroup.add(g);
      districtMeshes.push(g);
    };

    // SECTOR 2: Elexoplus Commercial Complex (Blue-roofed office with awnings)
    const createCommercialComplex = (dist: CityDistrict) => {
      const g = new THREE.Group();
      g.position.set(dist.position[0], 0, dist.position[2]);
      g.userData = { id: dist.id, district: dist };

      const wallMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
      const blueRoofMat = new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.3 });
      const winMat = new THREE.MeshStandardMaterial({ color: 0x60a5fa, metalness: 0.6 });

      // Main Wing
      const wing1 = new THREE.Mesh(new THREE.BoxGeometry(8, 6.5, 6), wallMat);
      wing1.position.y = 3.25;
      wing1.castShadow = true;
      g.add(wing1);

      // Blue Mansard Roof
      const roof = new THREE.Mesh(new THREE.BoxGeometry(8.4, 1.8, 6.4), blueRoofMat);
      roof.position.y = 6.5 + 0.9;
      roof.castShadow = true;
      g.add(roof);

      // Windows Array
      for (let f = 1; f <= 2; f++) {
        for (let w = -2.6; w <= 2.6; w += 1.6) {
          const win = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.4), winMat);
          win.position.set(w, f * 2.2, 3.05);
          g.add(win);
        }
      }

      cityGroup.add(g);
      districtMeshes.push(g);
    };

    // SECTOR 3: Neural Labs Helipad Building (Red-and-white flat-roof with helipad from image)
    const createHelipadBuilding = (dist: CityDistrict) => {
      const g = new THREE.Group();
      g.position.set(dist.position[0], 0, dist.position[2]);
      g.userData = { id: dist.id, district: dist };

      const whiteWall = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.3 });
      const redTrim = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
      const padMat = new THREE.MeshStandardMaterial({ color: 0x334155 });

      // Main 2-story Tech Block
      const block = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 7), whiteWall);
      block.position.y = 3;
      block.castShadow = true;
      g.add(block);

      // Red Parapet Trim
      const trim = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.8, 7.2), redTrim);
      trim.position.y = 6.4;
      g.add(trim);

      // Octagonal Helipad on Roof (Matching image!)
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 0.3, 8), padMat);
      pad.position.y = 6.9;
      g.add(pad);

      // Yellow/Amber 'H' Ring on Helipad
      const hRing = new THREE.Mesh(new THREE.RingGeometry(1.4, 1.7, 8), new THREE.MeshBasicMaterial({ color: 0xeab308, side: THREE.DoubleSide }));
      hRing.rotation.x = Math.PI / 2;
      hRing.position.y = 7.06;
      g.add(hRing);

      cityGroup.add(g);
      districtMeshes.push(g);
    };

    // SECTOR 4: ConnectX Golden Curved Rotunda (Circular golden glass building from image)
    const createGoldenRotunda = (dist: CityDistrict) => {
      const g = new THREE.Group();
      g.position.set(dist.position[0], 0, dist.position[2]);
      g.userData = { id: dist.id, district: dist };

      const goldGlass = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
      const frameGold = new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.9 });

      // Curved Rotunda Tower
      const rotunda = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 7.5, 24), goldGlass);
      rotunda.position.y = 3.75;
      rotunda.castShadow = true;
      g.add(rotunda);

      // Roof Disc Crown
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 0.6, 24), frameGold);
      disc.position.y = 7.8;
      disc.castShadow = true;
      g.add(disc);

      cityGroup.add(g);
      districtMeshes.push(g);
    };

    // SECTOR 5: Academic Pavilion
    const createAcademicPavilion = (dist: CityDistrict) => {
      const g = new THREE.Group();
      g.position.set(dist.position[0], 0, dist.position[2]);
      g.userData = { id: dist.id, district: dist };

      const mat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 });
      const bld = new THREE.Mesh(new THREE.BoxGeometry(7, 5.5, 7), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      bld.position.y = 2.75;
      bld.castShadow = true;
      g.add(bld);

      const roof = new THREE.Mesh(new THREE.ConeGeometry(5.2, 2.5, 4), mat);
      roof.rotation.y = Math.PI / 4;
      roof.position.y = 5.5 + 1.25;
      g.add(roof);

      cityGroup.add(g);
      districtMeshes.push(g);
    };

    // SECTOR 6: Gola Foundry Pavilion
    const createFoundryPavilion = (dist: CityDistrict) => {
      const g = new THREE.Group();
      g.position.set(dist.position[0], 0, dist.position[2]);
      g.userData = { id: dist.id, district: dist };

      const mat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.4 });
      const bld = new THREE.Mesh(new THREE.BoxGeometry(7.5, 5.5, 6.5), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
      bld.position.y = 2.75;
      bld.castShadow = true;
      g.add(bld);

      const trim = new THREE.Mesh(new THREE.BoxGeometry(8, 0.8, 7), mat);
      trim.position.y = 5.9;
      g.add(trim);

      cityGroup.add(g);
      districtMeshes.push(g);
    };

    // Build all 6 districts
    createCentralCapitol(DISTRICTS[0]);
    createCommercialComplex(DISTRICTS[1]);
    createHelipadBuilding(DISTRICTS[2]);
    createGoldenRotunda(DISTRICTS[3]);
    createAcademicPavilion(DISTRICTS[4]);
    createFoundryPavilion(DISTRICTS[5]);

    // --- 4. Moving Stylized Vehicles on Roads ---
    const carMatYellow = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
    const carMatRed = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
    const carMatBlue = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.4 });

    const createCar = (mat: THREE.Material) => {
      const car = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.7, 3.2), mat);
      body.position.y = 0.55;
      body.castShadow = true;
      car.add(body);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.6, 1.6), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
      cabin.position.set(0, 1.1, -0.2);
      car.add(cabin);

      return car;
    };

    const cars: { group: THREE.Group; speed: number; direction: number; isNS: boolean }[] = [];

    for (let c = 0; c < 6; c++) {
      const mat = c % 3 === 0 ? carMatYellow : c % 3 === 1 ? carMatRed : carMatBlue;
      const car = createCar(mat);
      const isNS = c % 2 === 0;
      if (isNS) {
        car.position.set(c % 4 === 0 ? 3.5 : -3.5, 0, (Math.random() - 0.5) * 60);
      } else {
        car.rotation.y = Math.PI / 2;
        car.position.set((Math.random() - 0.5) * 60, 0, c % 3 === 0 ? 3.5 : -3.5);
      }
      cityGroup.add(car);
      cars.push({
        group: car,
        speed: 0.16 + Math.random() * 0.12,
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

    // --- Interactive Raycaster for Clicking Buildings ---
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
          cameraTargetPos.current.set(nx + 10, ny + nextDist.buildingHeight * 0.8 + 6, nz + 15);
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

      // Move Cars on Roads
      cars.forEach((car) => {
        if (car.isNS) {
          car.group.position.z += car.speed * car.direction;
          if (car.group.position.z > 50) car.group.position.z = -50;
          if (car.group.position.z < -50) car.group.position.z = 50;
        } else {
          car.group.position.x += car.speed * car.direction;
          if (car.group.position.x > 50) car.group.position.x = -50;
          if (car.group.position.x < -50) car.group.position.x = 50;
        }
      });

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
    <div className="relative w-full h-[680px] sm:h-[760px] bg-[#0c0906] overflow-hidden select-none border-b border-white/10">
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
