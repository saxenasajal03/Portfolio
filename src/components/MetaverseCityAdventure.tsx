import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import {
  Compass,
  Play,
  Pause,
  RotateCcw,
  Navigation,
  ChevronRight,
  Shield,
  Layers,
  Award,
  Zap,
  Cpu,
  MapPin,
  ExternalLink,
  Crosshair,
  Volume2,
  VolumeX,
  Maximize2
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
  externalUrl?: string;
  actionText?: string;
}

const DISTRICTS: CityDistrict[] = [
  {
    id: 'urban-company',
    name: 'Central SBC Quality Spire',
    codename: 'SECTOR-01 // QUALITY HQ',
    tagline: 'Urban Company · Central SBC Quality Team · Ghitorni, New Delhi',
    color: '#ff9a3c',
    accentHex: 0xff9a3c,
    buildingHeight: 14,
    position: [0, 0, 0],
    questTitle: 'RESOLVE TIER 1 & 2 OPERATIONAL ESCALATIONS',
    questDescription:
      'Investigate complex partner bottlenecks through structured root-cause analysis (RCA). Track SLAs, partner compliance, and cohort Real-Time (RT) attendance exceeding 80% using Jarvis SQL analytics.',
    metrics: [
      'RT Attendance Compliance >80%',
      'Tier 1/2 Escalations Root-Cause Analysis',
      'Jarvis Analytics & High-Throughput SQL',
      'Lead: Partner Upgrades Training & AI Handholding Pilot'
    ],
    stack: ['Jarvis Analytics', 'SQL Queries', 'SLA Engineering', 'Advanced Excel', 'AI Handholding Pilot'],
    externalUrl: 'https://www.urbancompany.com',
    actionText: 'Inspect Urban Company Node'
  },
  {
    id: 'elexoplus',
    name: 'Elexoplus Commerce & ERP Citadel',
    codename: 'SECTOR-02 // COMMERCE HUB',
    tagline: 'Dual Architecture: D2C Storefront + B2B Wholesale Portal',
    color: '#06b6d4',
    accentHex: 0x06b6d4,
    buildingHeight: 11,
    position: [12, 0, -8],
    questTitle: 'SYNCHRONIZE MULTI-TIER WAREHOUSE INVENTORY',
    questDescription:
      'Architected unified commerce ecosystem (elexoplus.com & b2b.elexoplus.com) with role-based access control (RBAC), multi-warehouse stock synchronization, and automated order-dispatch workflows.',
    metrics: [
      'Dual Storefront: D2C + B2B Wholesale',
      'Role-Based Access Control (RBAC) & JWT Security',
      'Indexed Relational MySQL Schema for High-Frequency Orders',
      'Automated Inventory Reconciliation Pipeline'
    ],
    stack: ['React.js', 'Node.js', 'Express.js', 'MySQL', 'Tailwind CSS', 'REST APIs'],
    externalUrl: 'https://elexoplus.com',
    actionText: 'Launch Live Elexoplus Platform'
  },
  {
    id: 'neural-labs',
    name: 'Neural Vision & AI Research Spire',
    codename: 'SECTOR-03 // AI CORE',
    tagline: 'Oracle Cloud Certified GenAI Professional · Feynn Labs · Foliar CNN',
    color: '#10b981',
    accentHex: 0x10b981,
    buildingHeight: 12,
    position: [-13, 0, -10],
    questTitle: 'DEPLOY 95%+ ACCURACY BOTANICAL CNN CLASSIFIER',
    questDescription:
      'Trained deep convolutional neural network for foliar disease classification with OpenCV augmentations. Certified in Large Language Models (LLMs), RAG systems, and Vector Databases on Oracle Cloud (OCI 2025).',
    metrics: [
      '>95% Validation Accuracy on Botanical Pathology',
      'Oracle Cloud Infrastructure 2025 Certified GenAI Pro',
      'Automated ETL & Preprocessing Pipelines at Feynn Labs',
      'Optimized Lightweight Inference REST Endpoint'
    ],
    stack: ['Python', 'TensorFlow', 'Keras', 'OpenCV', 'OCI GenAI', 'Pandas'],
    externalUrl: 'https://github.com/saxenasajal03/Portfolio',
    actionText: 'Review Neural Model Architecture'
  },
  {
    id: 'connectx',
    name: 'ConnectX WebRTC Telecom Array',
    codename: 'SECTOR-04 // TELECOM NODE',
    tagline: 'Sub-100ms Peer-to-Peer Mesh Audio/Video & Real-Time Messaging',
    color: '#38bdf8',
    accentHex: 0x38bdf8,
    buildingHeight: 13,
    position: [14, 0, 10],
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
    externalUrl: 'https://github.com/saxenasajal03/Portfolio',
    actionText: 'Inspect WebRTC Protocols'
  },
  {
    id: 'academic-citadel',
    name: 'Academic Citadel & NEP Saarthi',
    codename: 'SECTOR-05 // CITADEL',
    tagline: 'Dev Bhoomi Uttarakhand University (2021–2025) · UGC NEP Saarthi',
    color: '#f59e0b',
    accentHex: 0xf59e0b,
    buildingHeight: 10,
    position: [-12, 0, 11],
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
    externalUrl: 'https://github.com/saxenasajal03/Portfolio',
    actionText: 'View Academic Credentials'
  },
  {
    id: 'origin-foundry',
    name: 'Origin Base & Power Ledger',
    codename: 'SECTOR-06 // FOUNDRY',
    tagline: 'Gola Gokarannath Base (PIN: 262802) · Java Relational Ledger',
    color: '#a855f7',
    accentHex: 0xa855f7,
    buildingHeight: 9,
    position: [0, 0, -18],
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
    externalUrl: 'https://github.com/saxenasajal03/Portfolio',
    actionText: 'Review Foundry Roots'
  }
];

export const MetaverseCityAdventure: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeDistrict, setActiveDistrict] = useState<CityDistrict>(DISTRICTS[0]);
  const [isTourPlaying, setIsTourPlaying] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'city' | 'india-map'>('city');
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [hudMinimized, setHudMinimized] = useState<boolean>(false);

  // References for animation loop
  const tourIndexRef = useRef<number>(0);
  const tourTimerRef = useRef<number>(0);
  const cameraTargetPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 8, 22));
  const cameraLookAtPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 4, 0));
  const controlsActiveRef = useRef<boolean>(false);

  // Switch to specific district
  const goToDistrict = (district: CityDistrict, manual: boolean = true) => {
    soundEngine.playTick();
    setActiveDistrict(district);
    if (manual) {
      setIsTourPlaying(false);
    }
    // Calculate cinematic camera vantage relative to district building
    const [dx, dy, dz] = district.position;
    cameraTargetPos.current.set(dx + 6, dy + district.buildingHeight * 0.8 + 5, dz + 12);
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
    const height = container.clientHeight || 650;

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
    renderer.toneMappingExposure = 1.35;
    container.replaceChildren(renderer.domElement);

    // --- Scene & Fog ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070503, 0.024);

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 300);
    camera.position.set(0, 16, 26);
    camera.lookAt(0, 4, 0);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0x241d18, 1.8);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffecd4, 2.8);
    mainKeyLight.position.set(25, 40, 20);
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 1024;
    mainKeyLight.shadow.mapSize.height = 1024;
    mainKeyLight.shadow.bias = -0.0005;
    scene.add(mainKeyLight);

    const cyberRimLight = new THREE.DirectionalLight(0x06b6d4, 1.6);
    cyberRimLight.position.set(-25, 20, -20);
    scene.add(cyberRimLight);

    // Master City Group
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    // Master India Map Group (Toggled in map mode)
    const indiaMapGroup = new THREE.Group();
    indiaMapGroup.position.set(0, 0, 0);
    scene.add(indiaMapGroup);
    indiaMapGroup.visible = false;

    // --- 1. Procedural Cyber Grid Ground ---
    const gridHelper = new THREE.GridHelper(90, 45, 0xff9a3c, 0x1f1610);
    gridHelper.position.y = -0.05;
    cityGroup.add(gridHelper);

    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0a0705,
      roughness: 0.85,
      metalness: 0.2
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    cityGroup.add(groundMesh);

    // --- 2. Construct City Districts & Skyscraper Clusters ---
    const districtMeshes: THREE.Group[] = [];
    const beaconRays: THREE.Mesh[] = [];

    DISTRICTS.forEach((dist) => {
      const distGroup = new THREE.Group();
      distGroup.position.set(dist.position[0], 0, dist.position[2]);
      distGroup.userData = { id: dist.id, district: dist };

      // Central Hero Skyscraper
      const bW = 4.2;
      const bD = 4.2;
      const bH = dist.buildingHeight;
      const buildingGeo = new THREE.BoxGeometry(bW, bH, bD);
      const buildingMat = new THREE.MeshStandardMaterial({
        color: 0x120e0a,
        roughness: 0.35,
        metalness: 0.8,
        emissive: dist.accentHex,
        emissiveIntensity: 0.12
      });
      const buildingMesh = new THREE.Mesh(buildingGeo, buildingMat);
      buildingMesh.position.y = bH / 2;
      buildingMesh.castShadow = true;
      buildingMesh.receiveShadow = true;
      distGroup.add(buildingMesh);

      // Window Glass Grid Texture & Neon Vertical Edges
      const edgeGeo = new THREE.BoxGeometry(bW + 0.1, bH + 0.1, bD + 0.1);
      const edgeWire = new THREE.WireframeGeometry(edgeGeo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: dist.accentHex,
        transparent: true,
        opacity: 0.45
      });
      const edgeLines = new THREE.LineSegments(edgeWire, edgeMat);
      edgeLines.position.y = bH / 2;
      distGroup.add(edgeLines);

      // Glowing Rooftop Beacon Light & Spire
      const spireH = 3.5;
      const spireGeo = new THREE.ConeGeometry(0.8, spireH, 6);
      const spireMat = new THREE.MeshBasicMaterial({ color: dist.accentHex });
      const spireMesh = new THREE.Mesh(spireGeo, spireMat);
      spireMesh.position.y = bH + spireH / 2;
      distGroup.add(spireMesh);

      // Pulsing Vertical Laser Ray shooting into sky
      const beamGeo = new THREE.CylinderGeometry(0.12, 0.12, 35, 8);
      const beamMat = new THREE.MeshBasicMaterial({
        color: dist.accentHex,
        transparent: true,
        opacity: 0.65
      });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamMesh.position.y = bH + 17.5;
      distGroup.add(beamMesh);
      beaconRays.push(beamMesh);

      // Point Light on Rooftop
      const rooftopLight = new THREE.PointLight(dist.accentHex, 3.5, 18);
      rooftopLight.position.y = bH + 2;
      distGroup.add(rooftopLight);

      // Surrounding Satellite Buildings for density
      for (let s = 0; s < 4; s++) {
        const angle = (s * Math.PI) / 2 + 0.3;
        const rad = 4.8;
        const sH = bH * (0.35 + Math.random() * 0.4);
        const sW = 2.2;
        const sGeo = new THREE.BoxGeometry(sW, sH, sW);
        const sMat = new THREE.MeshStandardMaterial({
          color: 0x0c0906,
          roughness: 0.6,
          metalness: 0.6
        });
        const sMesh = new THREE.Mesh(sGeo, sMat);
        sMesh.position.set(Math.cos(angle) * rad, sH / 2, Math.sin(angle) * rad);
        sMesh.castShadow = true;
        sMesh.receiveShadow = true;
        distGroup.add(sMesh);
      }

      cityGroup.add(distGroup);
      districtMeshes.push(distGroup);
    });

    // --- 3. Dynamic Moving Traffic (Flying Cars / Light Streams) ---
    const trafficCount = 36;
    const trafficGeo = new THREE.BoxGeometry(0.6, 0.15, 1.2);
    const trafficMatCyan = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const trafficMatAmber = new THREE.MeshBasicMaterial({ color: 0xff9a3c });

    const trafficVehicles: { mesh: THREE.Mesh; speed: number; laneZ: number; direction: number }[] = [];

    for (let t = 0; t < trafficCount; t++) {
      const isCyan = t % 2 === 0;
      const mesh = new THREE.Mesh(trafficGeo, isCyan ? trafficMatCyan : trafficMatAmber);
      const laneZ = (Math.random() - 0.5) * 60;
      const y = 0.6 + Math.random() * 2.8;
      const x = (Math.random() - 0.5) * 60;
      mesh.position.set(x, y, laneZ);
      cityGroup.add(mesh);

      trafficVehicles.push({
        mesh,
        speed: 0.18 + Math.random() * 0.22,
        laneZ,
        direction: Math.random() > 0.5 ? 1 : -1
      });
    }

    // --- 4. Ambient Cyber Dust & Starfield ---
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 120;
      starPos[i + 1] = Math.random() * 45 + 1;
      starPos[i + 2] = (Math.random() - 0.5) * 120;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffedd5,
      size: 0.35,
      transparent: true,
      opacity: 0.75
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    cityGroup.add(starPoints);

    // --- 5. 3D Isometric Sovereign India Map Mode (Accurate relief with reference image) ---
    const textureLoader = new THREE.TextureLoader();
    const mapTextureUrl = getAssetUrl('assets/resource/india_map_3d.png');

    textureLoader.load(
      mapTextureUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        // Extruded Isometric Base Plane with accurate sovereign India texture
        const mapPlaneGeo = new THREE.PlaneGeometry(36, 27);
        const mapPlaneMat = new THREE.MeshStandardMaterial({
          map: tex,
          transparent: true,
          roughness: 0.4,
          metalness: 0.15,
          side: THREE.DoubleSide
        });
        const mapMesh = new THREE.Mesh(mapPlaneGeo, mapPlaneMat);
        mapMesh.rotation.x = -Math.PI / 2.3;
        mapMesh.rotation.z = -Math.PI / 16;
        mapMesh.position.set(0, 3, 0);
        mapMesh.receiveShadow = true;
        indiaMapGroup.add(mapMesh);

        // 3D Holographic Spire Beacons on the India Map
        const createMapBeacon = (name: string, pos: [number, number, number], hex: number) => {
          const bGroup = new THREE.Group();
          bGroup.position.set(pos[0], pos[1], pos[2]);

          const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 6, 8);
          const poleMat = new THREE.MeshBasicMaterial({ color: hex });
          const pole = new THREE.Mesh(poleGeo, poleMat);
          pole.position.y = 3;
          bGroup.add(pole);

          const ringGeo = new THREE.RingGeometry(0.3, 0.6, 16);
          const ringMat = new THREE.MeshBasicMaterial({ color: hex, side: THREE.DoubleSide });
          const ring = new THREE.Mesh(ringGeo, ringMat);
          ring.rotation.x = Math.PI / 2;
          ring.position.y = 0.1;
          bGroup.add(ring);

          const pinLight = new THREE.PointLight(hex, 3, 10);
          pinLight.position.y = 6;
          bGroup.add(pinLight);

          indiaMapGroup.add(bGroup);
        };

        // Delhi (Urban Company HQ), Dehradun (DBUU), Gola (Roots)
        createMapBeacon('Delhi', [-2.2, 3.8, -1.2], 0xff9a3c);
        createMapBeacon('Dehradun', [-1.6, 4.4, -3.2], 0x38bdf8);
        createMapBeacon('Gola UP', [0.4, 3.6, -1.4], 0x10b981);
      },
      undefined,
      (err) => console.warn('3D India Map texture load warning:', err)
    );

    // --- Interactive Raycaster for Clicking Districts in 3D City ---
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
      const newH = container.clientHeight || 650;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // --- Main Animation Engine (60 FPS Smooth Damping) ---
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // View Mode Toggle Display
      if (viewMode === 'city') {
        cityGroup.visible = true;
        indiaMapGroup.visible = false;
      } else {
        cityGroup.visible = false;
        indiaMapGroup.visible = true;
        // Slow majestic orbital rotation in map mode
        indiaMapGroup.rotation.y = Math.sin(elapsed * 0.2) * 0.15;
      }

      // Autopilot Story Tour Controller
      if (isTourPlaying && viewMode === 'city') {
        tourTimerRef.current += delta;
        if (tourTimerRef.current > 7.5) {
          tourTimerRef.current = 0;
          tourIndexRef.current = (tourIndexRef.current + 1) % DISTRICTS.length;
          const nextDist = DISTRICTS[tourIndexRef.current];
          setActiveDistrict(nextDist);
          const [nx, ny, nz] = nextDist.position;
          cameraTargetPos.current.set(nx + 7, ny + nextDist.buildingHeight * 0.8 + 5, nz + 13);
          cameraLookAtPos.current.set(nx, ny + nextDist.buildingHeight * 0.5, nz);
        }
      }

      // Camera Smooth Exponential Interpolation (Lerp)
      if (viewMode === 'city') {
        camera.position.lerp(cameraTargetPos.current, 0.045);
        const currentLookAt = new THREE.Vector3();
        camera.getWorldDirection(currentLookAt);
        // Smooth target lookAt
        const dummy = new THREE.Vector3();
        dummy.copy(camera.position).add(currentLookAt);
        dummy.lerp(cameraLookAtPos.current, 0.05);
        camera.lookAt(cameraLookAtPos.current);
      } else {
        // Satellite map view position
        camera.position.lerp(new THREE.Vector3(0, 22, 28), 0.045);
        camera.lookAt(0, 3, 0);
      }

      // Animate Traffic Streams
      trafficVehicles.forEach((car) => {
        car.mesh.position.x += car.speed * car.direction;
        if (car.mesh.position.x > 45) car.mesh.position.x = -45;
        if (car.mesh.position.x < -45) car.mesh.position.x = 45;
      });

      // Pulse Laser Beacons
      beaconRays.forEach((ray, i) => {
        const s = 1 + Math.sin(elapsed * 4 + i) * 0.2;
        ray.scale.set(s, 1, s);
      });

      // Subtle atmospheric starfield drift
      starPoints.rotation.y = elapsed * 0.012;

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
    <div className="relative w-full h-[620px] sm:h-[720px] bg-[#070503] overflow-hidden select-none border-b border-white/10">
      {/* 3D WebGL Canvas Viewport */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD: Metaverse Adventure Game Interface */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pointer-events-none">
        
        {/* Active Quest Tracker */}
        <div className="pointer-events-auto bg-[#120e0a]/90 backdrop-blur-md border border-white/15 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3.5 max-w-lg">
          <div className="w-10 h-10 rounded-lg bg-[#ff9a3c]/15 border border-[#ff9a3c]/40 flex items-center justify-center shrink-0">
            <Crosshair className="w-5 h-5 text-[#ff9a3c] animate-spin" style={{ animationDuration: '12s' }} />
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
        <div className="pointer-events-auto flex items-center gap-2 bg-[#120e0a]/90 backdrop-blur-md border border-white/15 p-1.5 rounded-xl shadow-xl">
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
            <span>3D CYBER CITY</span>
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
            title={soundMuted ? 'Unmute Procedural Audio' : 'Mute Procedural Audio'}
          >
            {soundMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      </div>

      {/* Floating Bottom District Console / Telemetry HUD */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex flex-col md:flex-row items-end justify-between gap-4">
        
        {/* District Detail Card */}
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

          {/* Action Links & Stack */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
            <div className="flex flex-wrap gap-1.5">
              {activeDistrict.stack.slice(0, 4).map((tech, i) => (
                <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 border border-white/10 text-neutral-300">
                  {tech}
                </span>
              ))}
            </div>

            {activeDistrict.externalUrl && (
              <a
                href={activeDistrict.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEngine.playTick()}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-md"
                style={{
                  backgroundColor: activeDistrict.color,
                  color: '#120e0a'
                }}
              >
                <span>{activeDistrict.actionText || 'Inspect Sector'}</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

        {/* Quick District Selector Carousel / Map Node Jump */}
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

      {/* Cyber Corner Grid Overlay */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#ff9a3c] pointer-events-none" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#ff9a3c] pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#ff9a3c] pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#ff9a3c] pointer-events-none" />
    </div>
  );
};

export default MetaverseCityAdventure;
