import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ProcessedImageResult } from '../utils/backgroundRemoval';

export type DisplayMode = 'studio' | 'hologram' | 'exploded' | 'wireframe';

interface Sajal3DCanvasProps {
  processedImage: ProcessedImageResult | null;
  displayMode: DisplayMode;
  explodedOffset?: number;
  autoRotate?: boolean;
  rotationSpeed?: number;
  glowIntensity?: number;
  onObjectClick?: () => void;
}

export const Sajal3DCanvas: React.FC<Sajal3DCanvasProps> = ({
  processedImage,
  displayMode,
  explodedOffset = 0,
  autoRotate = false,
  rotationSpeed = 0.8,
  glowIntensity = 1.2,
  onObjectClick,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    displayMode,
    explodedOffset,
    autoRotate,
    rotationSpeed,
    glowIntensity,
    onObjectClick,
  });

  useEffect(() => {
    stateRef.current = {
      displayMode,
      explodedOffset,
      autoRotate,
      rotationSpeed,
      glowIntensity,
      onObjectClick,
    };
  }, [displayMode, explodedOffset, autoRotate, rotationSpeed, glowIntensity, onObjectClick]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isDisposed = false;

    // Dimensions
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);

    // Scene & Environment
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x130e09, 0.07);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.05, 3.7);

    // Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xfff0e2, 0x0a0705, 0.8);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff8f0, 2.4);
    keyLight.position.set(3, 4, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x507090, 0.9);
    fillLight.position.set(-3.5, 1, 2);
    scene.add(fillLight);

    const amberRimLight = new THREE.PointLight(0xff9a3c, 4.0, 9);
    amberRimLight.position.set(0, 0.25, -0.5);
    scene.add(amberRimLight);

    // Master Hero 3D Group
    const heroGroup = new THREE.Group();
    heroGroup.position.set(0, -0.15, 0);
    scene.add(heroGroup);

    // 3D Subject Cutout Mesh (Pure isolated cutout, no cardboard backing!)
    let cutoutTexture: THREE.CanvasTexture | null = null;
    let cutoutMesh: THREE.Mesh | null = null;

    const aspect = processedImage ? processedImage.width / processedImage.height : 1.0;
    const planeH = 2.45;
    const planeW = planeH * aspect;

    const planeGeo = new THREE.PlaneGeometry(planeW, planeH, 32, 32);

    if (processedImage) {
      cutoutTexture = new THREE.CanvasTexture(processedImage.canvas);
      cutoutTexture.colorSpace = THREE.SRGBColorSpace;
      cutoutTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    }

    const cutoutMat = new THREE.MeshPhysicalMaterial({
      map: cutoutTexture,
      transparent: true,
      alphaTest: 0.02,
      roughness: 0.35,
      metalness: 0.08,
      clearcoat: 0.35,
      clearcoatRoughness: 0.2,
      side: THREE.DoubleSide,
    });
    cutoutMesh = new THREE.Mesh(planeGeo, cutoutMat);
    cutoutMesh.castShadow = true;
    cutoutMesh.receiveShadow = true;
    heroGroup.add(cutoutMesh);

    // Signature Amber Torus Arc curving directly behind Sajal's shoulders
    const arcCurve = new THREE.TorusGeometry(0.88, 0.02, 16, 80, Math.PI * 1.08);
    const arcMat = new THREE.MeshStandardMaterial({
      color: 0xff8c2b,
      emissive: 0xff6600,
      emissiveIntensity: 1.8,
      roughness: 0.2,
      metalness: 0.8,
    });
    const amberArc = new THREE.Mesh(arcCurve, arcMat);
    amberArc.rotation.z = -Math.PI * 0.035;
    amberArc.rotation.y = Math.PI;
    amberArc.position.set(0, 0.28, -0.12);
    heroGroup.add(amberArc);

    // Floating Depth Coordinate Holographic Rings
    const ringGroup = new THREE.Group();
    const ringGeo1 = new THREE.RingGeometry(1.05, 1.07, 64);
    const ringGeo2 = new THREE.RingGeometry(1.35, 1.365, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffaa44,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat);
    ring1.position.set(0, 0.1, -0.22);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat.clone());
    ring2.position.set(0, 0.1, 0.15);
    (ring2.material as THREE.MeshBasicMaterial).opacity = 0.14;
    ringGroup.add(ring1);
    ringGroup.add(ring2);
    heroGroup.add(ringGroup);

    // Ambient Golden Orbiting Particles (140 Photons)
    const particleCount = 140;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 0.6 + Math.random() * 1.6;
      particlePositions[i * 3] = Math.cos(theta) * radius;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 2.6;
      particlePositions[i * 3 + 2] = Math.sin(theta) * radius * 0.7 - 0.15;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Procedural Particle Glow Texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 205, 130, 1)');
      grad.addColorStop(0.5, 'rgba(255, 150, 50, 0.6)');
      grad.addColorStop(1, 'rgba(255, 120, 20, 0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const pTexture = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      map: pTexture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    heroGroup.add(particles);

    // Grounding Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(2.2, 1.1);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -1.25, 0);
    heroGroup.add(shadowPlane);

    // Interaction State
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      isDragging: false,
      prevX: 0,
      prevY: 0,
      dragRotX: 0,
      dragRotY: 0,
    };

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      mouse.targetX = (clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(clientY / window.innerHeight) * 2 + 1;

      if (mouse.isDragging) {
        const deltaX = clientX - mouse.prevX;
        const deltaY = clientY - mouse.prevY;
        mouse.dragRotY += deltaX * 0.008;
        mouse.dragRotX += deltaY * 0.008;
        mouse.prevX = clientX;
        mouse.prevY = clientY;
      }

      pointer.x = mouse.targetX;
      pointer.y = mouse.targetY;
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      mouse.isDragging = true;
      const clientX = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientY : (e as MouseEvent).clientY;
      mouse.prevX = clientX;
      mouse.prevY = clientY;
    };

    const handlePointerUp = (e: MouseEvent | TouchEvent) => {
      if (mouse.isDragging) {
        const clientX = 'changedTouches' in e && e.changedTouches.length > 0 ? e.changedTouches[0].clientX : (e as MouseEvent).clientX;
        const dist = Math.hypot(
          clientX - mouse.prevX,
          (('changedTouches' in e ? e.changedTouches[0].clientY : (e as MouseEvent).clientY) || 0) - mouse.prevY
        );
        if (dist < 6 && stateRef.current.onObjectClick) {
          raycaster.setFromCamera(pointer, camera);
          if (cutoutMesh) {
            const intersects = raycaster.intersectObject(cutoutMesh);
            if (intersects.length > 0) {
              stateRef.current.onObjectClick();
            }
          }
        }
      }
      mouse.isDragging = false;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    container.addEventListener('mousedown', handlePointerDown);
    container.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchend', handlePointerUp);

    const handleResize = () => {
      if (!container || isDisposed) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const clock = new THREE.Clock();
    let currentRotX = 0;
    let currentRotY = 0;
    let autoRotAngle = 0;

    const tick = () => {
      if (isDisposed) return;
      animationFrameId = requestAnimationFrame(tick);

      const delta = Math.min(clock.getDelta(), 0.1);
      const { displayMode: mode, autoRotate: isAutoRot, rotationSpeed: rotSpd, glowIntensity: glow } = stateRef.current;

      mouse.x += (mouse.targetX - mouse.x) * (1 - Math.exp(-6 * delta));
      mouse.y += (mouse.targetY - mouse.y) * (1 - Math.exp(-6 * delta));

      if (isAutoRot) {
        autoRotAngle += delta * rotSpd * 0.8;
      }

      const targetRotY = mouse.dragRotY + autoRotAngle + mouse.x * 0.45;
      const targetRotX = mouse.dragRotX - mouse.y * 0.28;

      currentRotY += (targetRotY - currentRotY) * (1 - Math.exp(-8 * delta));
      currentRotX += (targetRotX - currentRotX) * (1 - Math.exp(-8 * delta));

      // Lifelike levitation motion
      const elapsedTime = clock.getElapsedTime();
      heroGroup.position.y = -0.15 + Math.sin(elapsedTime * 1.5) * 0.03;
      arcMat.emissiveIntensity = (1.7 + Math.sin(elapsedTime * 2.0) * 0.35) * glow;

      heroGroup.rotation.y = currentRotY;
      heroGroup.rotation.x = currentRotX;

      // Rotate holographic depth rings in opposite directions
      ring1.rotation.z += delta * 0.2;
      ring2.rotation.z -= delta * 0.35;

      // Animate particle flow
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        arr[i * 3 + 1] += delta * 0.18;
        if (arr[i * 3 + 1] > 1.3) {
          arr[i * 3 + 1] = -1.3;
        }
      }
      posAttr.needsUpdate = true;
      particles.rotation.y += delta * 0.12;

      // Hologram / wireframe modes
      if (mode === 'hologram') {
        amberRimLight.color.setHex(0x00d2ff);
        arcMat.color.setHex(0x00f0ff);
        arcMat.emissive.setHex(0x0088cc);
        ringMat.color.setHex(0x00ffff);
      } else if (mode === 'wireframe') {
        cutoutMat.wireframe = true;
        arcMat.wireframe = true;
      } else {
        cutoutMat.wireframe = false;
        arcMat.wireframe = false;
        amberRimLight.color.setHex(0xff9a3c);
        arcMat.color.setHex(0xff8c2b);
        arcMat.emissive.setHex(0xff6600);
        ringMat.color.setHex(0xffaa44);
      }

      renderer.render(scene, camera);
    };

    tick();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);

      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      container.removeEventListener('mousedown', handlePointerDown);
      container.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('resize', handleResize);

      planeGeo.dispose();
      arcCurve.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      particleGeo.dispose();
      shadowGeo.dispose();

      cutoutMat.dispose();
      arcMat.dispose();
      ringMat.dispose();
      particleMat.dispose();
      shadowMat.dispose();

      if (cutoutTexture) cutoutTexture.dispose();
      pTexture.dispose();
      envTexture.dispose();

      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [processedImage]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full z-10 cursor-grab active:cursor-grabbing overflow-hidden pointer-events-auto"
      style={{ touchAction: 'none' }}
    />
  );
};
