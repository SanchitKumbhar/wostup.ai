import React, { Suspense, useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Edges } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';

// ─── CONSTANTS ──────────────────────────────────────────────────────────────────
const PROBLEMS = [
  'Missed Deadlines', 'Scope Creep', 'Budget Overruns', 'Team Burnout',
  'Poor Communication', 'Resource Conflicts', 'Unclear Goals', 'Task Overload',
  'No Visibility', 'Status Chaos', 'Manual Tracking', 'Lost Priorities',
  'Bottlenecks', 'Rework Cycles', 'Siloed Teams', 'Delayed Feedback',
  'Risk Blindness', 'Context Switching', 'Approval Delays', 'Data Silos',
  'Broken Workflows', 'Misaligned Sprints', 'Dependency Hell', 'Untracked Bugs',
];

const BRAND_COLOR_A = '#5B5FFB';
const BRAND_COLOR_B = '#B24DFF';
const BRAND_COLOR_C = '#00C292';

// ─── HELPER: Generate cube layout in 3D space ──────────────────────────────────
function generateCubePositions(count) {
  const positions = [];
  const cols = 6;
  const rows = Math.ceil(count / cols);
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = (col - cols / 2 + 0.5) * 2.2;
    const y = (row - rows / 2 + 0.5) * 1.8;
    const z = ((i * 7) % 5 - 2) * 0.3;
    const rotX = ((i * 13) % 30 - 15) * (Math.PI / 180);
    const rotZ = ((i * 17) % 24 - 12) * (Math.PI / 180);
    positions.push({ x, y, z, rotX, rotZ, delay: i * 0.04 });
  }
  return positions;
}

// ─── SUB-COMPONENT: CameraRig for Parallax ──────────────────────────────────────
function CameraRig() {
  useFrame(({ camera, pointer }) => {
    const targetX = pointer.x * 0.4;
    const targetY = pointer.y * 0.4;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ─── SUB-COMPONENT: ProblemCube ─────────────────────────────────────────────────
function ProblemCube({ text, target, cubeRef }) {
  const meshRef = useRef();

  useEffect(() => {
    if (cubeRef) cubeRef.current = meshRef.current;
  }, [cubeRef]);

  return (
    <mesh
      ref={meshRef}
      position={[target.x, target.y + 14, target.z]}
      rotation={[target.rotX, 0, target.rotZ]}
      scale={0}
    >
      <boxGeometry args={[1.6, 0.9, 0.15]} />
      <meshStandardMaterial
        color="#2a0808"
        emissive="#ff2222"
        emissiveIntensity={0.15}
        transparent
        opacity={0.92}
        roughness={0.4}
        metalness={0.2}
      />
      <Edges scale={1} threshold={15} color="#ff4444" />
      <Text
        position={[0.08, 0, 0.09]}
        fontSize={0.16}
        color="#ffaaaa"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.3}
        textAlign="center"
        letterSpacing={0.02}
      >
        {text}
      </Text>
      <Text
        position={[-0.58, 0, 0.09]}
        fontSize={0.18}
        anchorX="center"
        anchorY="middle"
      >
        ⚠
      </Text>
    </mesh>
  );
}

// ─── SUB-COMPONENT: SolutionButton3D ────────────────────────────────────────────
function SolutionButton3D({ buttonRef }) {
  const groupRef = useRef();
  const glowRef = useRef();
  const ringRef = useRef();

  useEffect(() => {
    if (buttonRef) buttonRef.current = groupRef.current;
  }, [buttonRef]);

  useFrame(({ clock }) => {
    if (glowRef.current) {
      const s = 1 + Math.sin(clock.elapsedTime * 2.5) * 0.12;
      glowRef.current.scale.set(s, s, s);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0.5]} scale={0} visible={false}>
      <mesh ref={glowRef} scale={1.8}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={BRAND_COLOR_A}
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={ringRef}>
        <torusGeometry args={[1.1, 0.03, 16, 64]} />
        <meshStandardMaterial
          color={BRAND_COLOR_B}
          emissive={BRAND_COLOR_B}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.12, 48]} />
        <meshStandardMaterial
          color={BRAND_COLOR_A}
          emissive={BRAND_COLOR_A}
          emissiveIntensity={1.5}
          roughness={0.2}
          metalness={0.6}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0, 0.08]} rotation={[0, 0, Math.PI / 4]}>
        <ringGeometry args={[0.12, 0.22, 4]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>

      <Text
        position={[0, -1.0, 0]}
        fontSize={0.28}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        SOLUTION
      </Text>
    </group>
  );
}

// ─── SUB-COMPONENT: AnimatedCursor ──────────────────────────────────────────────
function AnimatedCursor({ cursorRef }) {
  const groupRef = useRef();

  useEffect(() => {
    if (cursorRef) cursorRef.current = groupRef.current;
  }, [cursorRef]);

  return (
    <group ref={groupRef} position={[5, -4, 3]} scale={0} visible={false}>
      <mesh rotation={[0, 0, Math.PI / 6]}>
        <coneGeometry args={[0.15, 0.4, 3]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      <mesh position={[0.05, -0.15, 0]}>
        <ringGeometry args={[0.06, 0.1, 16]} />
        <meshBasicMaterial
          color={BRAND_COLOR_A}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ─── SUB-COMPONENT: ShockwaveRing ───────────────────────────────────────────────
function ShockwaveRing({ shockwaveRef }) {
  const meshRef = useRef();

  useEffect(() => {
    if (shockwaveRef) shockwaveRef.current = meshRef.current;
  }, [shockwaveRef]);

  return (
    <mesh ref={meshRef} position={[0, 0, 0.5]} scale={0} visible={false}>
      <ringGeometry args={[0.8, 1.0, 64]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

// ─── SUB-COMPONENT: ExplosionParticles ──────────────────────────────────────────
function ExplosionParticles({ particlesRef }) {
  const pointsRef = useRef();
  const count = 200;

  const { positions, colors, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = [];
    const colorChoices = [
      new THREE.Color(BRAND_COLOR_A),
      new THREE.Color(BRAND_COLOR_B),
      new THREE.Color(BRAND_COLOR_C),
      new THREE.Color('#ffffff'),
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0.5;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 3 + Math.random() * 6;
      velocities.push({
        x: Math.sin(phi) * Math.cos(theta) * speed,
        y: Math.sin(phi) * Math.sin(theta) * speed,
        z: Math.cos(phi) * speed * 0.5,
      });

      const c = colorChoices[i % colorChoices.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors, velocities };
  }, []);

  useEffect(() => {
    if (particlesRef) {
      particlesRef.current = {
        points: pointsRef.current,
        velocities,
      };
    }
  }, [particlesRef, velocities]);

  useEffect(() => {
    if (pointsRef.current) {
      const geo = pointsRef.current.geometry;
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }
  }, [positions, colors]);

  return (
    <points ref={pointsRef} visible={false}>
      <bufferGeometry />
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={1}
        depthWrite={false}
        sizeAttenuation
        toneMapped={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── SUB-COMPONENT: BrandReveal3D ───────────────────────────────────────────────
function BrandReveal3D({ brandRef }) {
  const groupRef = useRef();
  const orbitRingRef = useRef();
  const haloRef = useRef();

  useEffect(() => {
    if (brandRef) brandRef.current = groupRef.current;
  }, [brandRef]);

  useFrame(({ clock }) => {
    if (orbitRingRef.current) {
      orbitRingRef.current.rotation.y = clock.elapsedTime * 0.5;
      orbitRingRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.2;
    }
    if (haloRef.current) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 1.5) * 0.05;
      haloRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={groupRef} scale={0} visible={false}>
      <mesh ref={haloRef} position={[0, 0, -0.5]}>
        <circleGeometry args={[3.5, 64]} />
        <meshBasicMaterial
          color={BRAND_COLOR_A}
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={orbitRingRef}>
        <torusGeometry args={[2.8, 0.02, 16, 100]} />
        <meshStandardMaterial
          color={BRAND_COLOR_B}
          emissive={BRAND_COLOR_B}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      <group position={[0, 1.6, 0]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <ringGeometry args={[0.25, 0.4, 4]} />
          <meshStandardMaterial
            color={BRAND_COLOR_A}
            emissive={BRAND_COLOR_A}
            emissiveIntensity={2}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color={BRAND_COLOR_B}
            emissive={BRAND_COLOR_B}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      </group>

      <Text
        position={[0, 0, 0]}
        fontSize={1.4}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
        color="#e8e8ff"
        fontWeight="bold"
      >
        WOSTUP
      </Text>

      <Text
        position={[2.6, 0.35, 0]}
        fontSize={0.35}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
        color={BRAND_COLOR_B}
        fontWeight="bold"
      >
        AI
      </Text>

      <group position={[-0.55, -0.95, 0]}>
        <mesh>
          <planeGeometry args={[0.8, 0.3]} />
          <meshBasicMaterial
            color={BRAND_COLOR_A}
            transparent
            opacity={0.12}
          />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.14}
          color={BRAND_COLOR_A}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
        >
          V2.0
        </Text>
      </group>

      <Text
        position={[0.55, -0.95, 0]}
        fontSize={0.14}
        color="#666688"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.04}
      >
        Workspace Engine
      </Text>

      <Text
        position={[0, -1.5, 0]}
        fontSize={0.2}
        color="#666688"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.03}
        maxWidth={8}
        textAlign="center"
      >
        Every problem, one intelligent solution.
      </Text>
    </group>
  );
}

// ─── SUB-COMPONENT: AmbientParticles ──────────────────────────────────────────
function AmbientParticles() {
  const pointsRef = useRef();
  const count = 80;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  useEffect(() => {
    if (pointsRef.current) {
      pointsRef.current.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      );
    }
  }, [positions]);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const attr = pointsRef.current.geometry.attributes.position;
      if (!attr) return;
      const arr = attr.array;
      for (let i = 0; i < count; i++) {
        arr[i * 3 + 1] += Math.sin(clock.elapsedTime * 0.3 + i) * 0.002;
      }
      attr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial
        size={0.03}
        color="#5B5FFB"
        transparent
        opacity={0.3}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── SCENE ORCHESTRATOR ─────────────────────────────────────────────────────────
function SceneOrchestrator({ onComplete, skipTriggered }) {
  const cubeRefs = useRef([]);
  const buttonRef = useRef();
  const cursorRef = useRef();
  const shockwaveRef = useRef();
  const particlesRef = useRef();
  const brandRef = useRef();
  const timelineRef = useRef(null);
  const hasCompletedRef = useRef(false);

  const cubePositions = useMemo(() => generateCubePositions(PROBLEMS.length), []);

  if (cubeRefs.current.length !== PROBLEMS.length) {
    cubeRefs.current = Array(PROBLEMS.length).fill(null).map(() => ({ current: null }));
  }

  const explosionActiveRef = useRef(false);
  const explosionProgressRef = useRef(0);

  useFrame((_, delta) => {
    if (explosionActiveRef.current && particlesRef.current?.points) {
      explosionProgressRef.current += delta * 1.5;
      const progress = Math.min(explosionProgressRef.current, 1);
      const pts = particlesRef.current.points;
      const vels = particlesRef.current.velocities;
      const posAttr = pts.geometry.attributes.position;
      if (!posAttr) return;
      const posArr = posAttr.array;

      for (let i = 0; i < vels.length; i++) {
        posArr[i * 3] = vels[i].x * progress;
        posArr[i * 3 + 1] = vels[i].y * progress;
        posArr[i * 3 + 2] = 0.5 + vels[i].z * progress;
      }
      posAttr.needsUpdate = true;
      pts.material.opacity = 1 - progress * 0.8;

      if (progress >= 1) {
        explosionActiveRef.current = false;
      }
    }
  });

  useEffect(() => {
    const initTimeout = setTimeout(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            onComplete();
          }
        },
      });
      timelineRef.current = tl;

      // PHASE 1: Problem Cubes Drop In
      cubeRefs.current.forEach((ref, i) => {
        const mesh = ref.current;
        if (!mesh) return;
        const target = cubePositions[i];

        tl.to(mesh.position, {
          y: target.y,
          duration: 0.7,
          ease: 'bounce.out',
        }, 0.15 + target.delay);

        tl.to(mesh.scale, {
          x: 1, y: 1, z: 1,
          duration: 0.5,
          ease: 'back.out(1.7)',
        }, 0.15 + target.delay);
      });

      // PHASE 2: Solution Button Appears
      const btnGroup = buttonRef.current;
      if (btnGroup) {
        tl.call(() => { btnGroup.visible = true; }, [], 1.8);
        tl.to(btnGroup.scale, {
          x: 1, y: 1, z: 1,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)',
        }, 1.8);
      }

      // PHASE 3: Cursor Animates Toward Button
      const cursorGroup = cursorRef.current;
      if (cursorGroup) {
        tl.call(() => { cursorGroup.visible = true; }, [], 2.6);
        tl.to(cursorGroup.scale, {
          x: 1, y: 1, z: 1,
          duration: 0.4,
          ease: 'back.out(2)',
        }, 2.6);
        tl.to(cursorGroup.position, {
          x: 0.3, y: -0.3, z: 1.5,
          duration: 0.9,
          ease: 'power2.inOut',
        }, 2.7);
      }

      // PHASE 4: Click + Shockwave
      if (cursorGroup) {
        tl.to(cursorGroup.scale, {
          x: 0.7, y: 0.7, z: 0.7,
          duration: 0.08,
          ease: 'power2.in',
        }, 3.6);
        tl.to(cursorGroup.scale, {
          x: 1, y: 1, z: 1,
          duration: 0.1,
          ease: 'power2.out',
        }, 3.68);
      }

      const swMesh = shockwaveRef.current;
      if (swMesh) {
        tl.call(() => { swMesh.visible = true; }, [], 3.6);
        tl.to(swMesh.scale, {
          x: 15, y: 15, z: 15,
          duration: 0.7,
          ease: 'power2.out',
        }, 3.6);
        tl.to(swMesh.material, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
        }, 3.7);
      }

      cubeRefs.current.forEach((ref, i) => {
        const mesh = ref.current;
        if (!mesh) return;
        const offset = (i % 3 - 1) * 0.1;
        tl.to(mesh.position, {
          x: `+=${offset}`,
          y: `+=${offset * 0.5}`,
          duration: 0.08,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: 3,
        }, 3.6);
      });

      // PHASE 5: Vortex Convergence into Core
      if (btnGroup) {
        tl.to(btnGroup.scale, {
          x: 2.5, y: 2.5, z: 2.5,
          duration: 0.2,
          ease: 'power2.out',
        }, 3.85);
        tl.to(btnGroup.scale, {
          x: 0, y: 0, z: 0,
          duration: 0.15,
          ease: 'power2.in',
        }, 4.05);
        tl.call(() => { btnGroup.visible = false; }, [], 4.2);
      }
      if (cursorGroup) {
        tl.to(cursorGroup.scale, {
          x: 0, y: 0, z: 0,
          duration: 0.2,
        }, 3.85);
        tl.call(() => { cursorGroup.visible = false; }, [], 4.05);
      }

      cubeRefs.current.forEach((ref, i) => {
        const mesh = ref.current;
        if (!mesh) return;

        tl.to(mesh.position, {
          x: 0, y: 0, z: -1,
          duration: 0.5,
          ease: 'power3.in',
        }, 3.8 + (i * 0.01));

        tl.to(mesh.scale, {
          x: 0, y: 0, z: 0,
          duration: 0.2,
          ease: 'power2.in',
        }, 4.2);
      });

      tl.call(() => {
        if (particlesRef.current?.points) {
          particlesRef.current.points.visible = true;
          explosionActiveRef.current = true;
          explosionProgressRef.current = 0;
        }
      }, [], 3.9);

      // PHASE 6: Brand Reveal
      const brandGroup = brandRef.current;
      if (brandGroup) {
        tl.call(() => { brandGroup.visible = true; }, [], 4.4);
        tl.fromTo(brandGroup.scale,
          { x: 0, y: 0, z: 0 },
          { x: 1, y: 1, z: 1, duration: 1.2, ease: 'elastic.out(1, 0.5)' },
          4.4
        );
      }

      // PHASE 7: Hold for 2s then complete
      tl.to({}, { duration: 2.0 }, 5.8);

    }, 150);

    return () => {
      clearTimeout(initTimeout);
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [cubePositions, onComplete]);

  useEffect(() => {
    if (skipTriggered && timelineRef.current) {
      timelineRef.current.progress(1);
    }
  }, [skipTriggered]);

  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} color="#ffffff" />
      <pointLight position={[0, 0, 4]} intensity={1.2} color={BRAND_COLOR_A} distance={15} />
      <pointLight position={[-3, -2, 3]} intensity={0.5} color={BRAND_COLOR_B} distance={12} />

      <AmbientParticles />

      {PROBLEMS.map((text, i) => (
        <ProblemCube
          key={i}
          text={text}
          target={cubePositions[i]}
          cubeRef={cubeRefs.current[i]}
        />
      ))}

      <SolutionButton3D buttonRef={buttonRef} />
      <AnimatedCursor cursorRef={cursorRef} />
      <ShockwaveRing shockwaveRef={shockwaveRef} />
      <ExplosionParticles particlesRef={particlesRef} />
      <BrandReveal3D brandRef={brandRef} />

      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────────
export default function LandingIntro({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [skipTriggered, setSkipTriggered] = useState(false);

  const handleComplete = useCallback(() => {
    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 800);
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    if (!skipTriggered) {
      setSkipTriggered(true);
      setFadeOut(true);
      setTimeout(() => {
        onComplete();
      }, 600);
    }
  }, [skipTriggered, onComplete]);

  return (
    <div
      className={`landing-intro ${fadeOut ? 'landing-intro--fade-out' : ''}`}
      style={{ cursor: 'default' }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <color attach="background" args={['#0B0D14']} />
        <Suspense fallback={null}>
          <SceneOrchestrator
            onComplete={handleComplete}
            skipTriggered={skipTriggered}
          />
        </Suspense>
      </Canvas>

      <button
        className="landing-skip-btn"
        onClick={handleSkip}
        title="Skip animation"
      >
        Skip
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="13 17 18 12 13 7" />
          <polyline points="6 17 11 12 6 7" />
        </svg>
      </button>
    </div>
  );
}