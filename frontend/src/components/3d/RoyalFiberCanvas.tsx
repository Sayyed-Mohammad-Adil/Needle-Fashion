'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ============================================================================
// 1. SILK RIBBON BACKGROUND ANIMATION
// Inspired by Aleksei Vasileika's Dribbble Shot 24971663 (Background animation)
// Elegant sweeping parallel liquid-metallic silk threads undulating across space
// Available for use on the Homepage Hero / Heritage sections!
// ============================================================================
export function SilkRibbonBackground({ lineCount = 38, pointsPerLine = 55 }: { lineCount?: number; pointsPerLine?: number }) {
  const linesGroupRef = useRef<THREE.Group>(null!);
  const lineGeometries = useRef<(THREE.BufferGeometry | null)[]>([]);

  // Base line data: parallel flowing curves across screen space
  const linesData = useMemo(() => {
    const data = [];
    const colors = [
      '#FFFFFF', // Pure Sterling White Glint
      '#EAECEC', // User Shiny Silver (#EAECEC)
      '#BBC2CC', // Glossy Silver
      '#BF953F', // 24K Gold
      '#A8A9AD', // Metallic Silver
      '#FCF6BA', // Champagne Gold
      '#C0C0C0', // Standard Silver
      '#B38728', // Antique Gold
    ];

    for (let i = 0; i < lineCount; i++) {
      const positions = new Float32Array(pointsPerLine * 3);
      const baseY = ((i / (lineCount - 1)) - 0.5) * 8.5;
      const baseZ = -1.2 + Math.sin(i * 0.18) * 0.5;
      const color = new THREE.Color(colors[i % colors.length]);
      const opacity = 0.32 + ((i % 3) === 0 ? 0.4 : 0.18);

      for (let j = 0; j < pointsPerLine; j++) {
        const u = j / (pointsPerLine - 1);
        const x = (u - 0.5) * 16;
        positions[j * 3] = x;
        positions[j * 3 + 1] = baseY;
        positions[j * 3 + 2] = baseZ;
      }

      data.push({
        basePositions: new Float32Array(positions),
        positions,
        color,
        opacity,
        phaseOffset: i * 0.22,
        speedFactor: 0.8 + (i % 3) * 0.15,
      });
    }
    return data;
  }, [lineCount, pointsPerLine]);

  // Ambient Floating Zari Micro-dust Motes
  const dustParticles = useMemo(() => {
    const count = 350;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const pal = [
      new THREE.Color('#FFFFFF'),
      new THREE.Color('#EAECEC'),
      new THREE.Color('#FCF6BA'),
      new THREE.Color('#BF953F'),
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 9;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3 - 0.5;

      const c = pal[i % pal.length];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { pos, col };
  }, []);

  const dustRef = useRef<THREE.Points>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < lineCount; i++) {
      const line = linesData[i];
      const geom = lineGeometries.current[i];
      if (!geom) continue;

      const posAttr = geom.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      const base = line.basePositions;

      for (let j = 0; j < pointsPerLine; j++) {
        const x = base[j * 3];
        const baseY = base[j * 3 + 1];
        const baseZ = base[j * 3 + 2];

        const wave1 = Math.sin(x * 0.45 + time * line.speedFactor * 0.9 + line.phaseOffset) * 0.38;
        const wave2 = Math.cos(x * 0.85 - time * 0.6 + line.phaseOffset * 1.5) * 0.18;
        const wave3 = Math.sin(x * 0.25 + time * 0.4) * 0.22;

        arr[j * 3] = x;
        arr[j * 3 + 1] = baseY + wave1 + wave2;
        arr[j * 3 + 2] = baseZ + wave3 + Math.sin(x * 0.4 + time * 0.5) * 0.25;
      }
      posAttr.needsUpdate = true;
    }

    if (dustRef.current) {
      dustRef.current.rotation.y = time * 0.04;
      dustRef.current.position.y = Math.sin(time * 0.2) * 0.08;
    }
  });

  return (
    <group ref={linesGroupRef}>
      {linesData.map((line, idx) => (
        <line key={idx}>
          <bufferGeometry
            ref={(el) => {
              if (el) (lineGeometries.current as any)[idx] = el;
            }}
          >
            <bufferAttribute
              attach="attributes-position"
              args={[line.positions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={line.color}
            transparent
            opacity={line.opacity}
            blending={THREE.AdditiveBlending}
            linewidth={1}
            depthWrite={false}
          />
        </line>
      ))}

      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustParticles.pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[dustParticles.col, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.042}
          vertexColors
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

// ============================================================================
// 2. DYNAMIC SPECULAR SILVER GLINT LIGHT
// Roving spotlight creating dazzling mirror-chrome specular highlights on the silver ring
// ============================================================================
function DynamicSilverGlint() {
  const lightRef = useRef<THREE.PointLight>(null!);
  const secondLightRef = useRef<THREE.PointLight>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(t * 1.4) * 3.2;
      lightRef.current.position.y = Math.cos(t * 1.4) * 2.8;
      lightRef.current.position.z = 2.4 + Math.sin(t * 2.8) * 0.8;
    }
    if (secondLightRef.current) {
      secondLightRef.current.position.x = -Math.sin(t * 1.1) * 3.5;
      secondLightRef.current.position.y = -Math.cos(t * 1.1) * 2.6;
      secondLightRef.current.position.z = 2.6 + Math.cos(t * 2.2) * 0.6;
    }
  });

  return (
    <>
      <pointLight ref={lightRef} color="#FFFFFF" intensity={4.2} distance={9} />
      <pointLight ref={secondLightRef} color="#EAECEC" intensity={3.5} distance={9} />
    </>
  );
}

// ============================================================================
// 3. WAVY CONCENTRIC CIRCLES ANIMATION
// Inspired by Aleksei Vasileika's Dribbble Shot 24631195 (Wavy circle animation)
// 3 Intertwined organic, undulating liquid-metallic wavy concentric rings
// ============================================================================
interface SingleWavyRingProps {
  baseRadius: number;
  tubeRadius: number;
  color: string;
  emissive: string;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
  clearcoat?: number;
  waveFreq1: number;
  waveFreq2: number;
  waveFreq3: number;
  ampR: number;
  ampZ: number;
  speed: number;
  phase: number;
}

function SingleWavyRing({
  baseRadius,
  tubeRadius,
  color,
  emissive,
  emissiveIntensity = 0.5,
  metalness = 0.98,
  roughness = 0.08,
  clearcoat = 1.0,
  waveFreq1,
  waveFreq2,
  waveFreq3,
  ampR,
  ampZ,
  speed,
  phase,
}: SingleWavyRingProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const geomRef = useRef<THREE.TorusGeometry>(null!);
  const basePosRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    if (geomRef.current && !basePosRef.current) {
      const arr = geomRef.current.attributes.position.array as Float32Array;
      basePosRef.current = new Float32Array(arr);
    }
  }, []);

  useFrame((state) => {
    if (!geomRef.current || !basePosRef.current) return;
    const time = state.clock.getElapsedTime();
    const posAttr = geomRef.current.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const base = basePosRef.current;
    const count = posAttr.count;

    for (let i = 0; i < count; i++) {
      const x0 = base[i * 3];
      const y0 = base[i * 3 + 1];
      const z0 = base[i * 3 + 2];

      const theta = Math.atan2(y0, x0);
      const r0 = Math.sqrt(x0 * x0 + y0 * y0);

      const waveR =
        Math.sin(theta * waveFreq1 + time * speed + phase) * ampR +
        Math.cos(theta * waveFreq2 - time * speed * 0.8 + phase * 1.5) * (ampR * 0.6);

      const waveZ =
        Math.sin(theta * waveFreq3 + time * speed * 1.1 + phase) * ampZ +
        Math.cos(theta * waveFreq1 - time * speed * 0.7) * (ampZ * 0.5);

      const rNew = r0 + waveR;
      arr[i * 3] = rNew * Math.cos(theta);
      arr[i * 3 + 1] = rNew * Math.sin(theta);
      arr[i * 3 + 2] = z0 + waveZ;
    }

    posAttr.needsUpdate = true;
    geomRef.current.computeVertexNormals();

    if (meshRef.current) {
      meshRef.current.rotation.z = time * (speed * 0.08);
      meshRef.current.rotation.x = Math.sin(time * 0.2 + phase) * 0.05;
      meshRef.current.rotation.y = Math.cos(time * 0.18 + phase) * 0.06;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry ref={geomRef} args={[baseRadius, tubeRadius, 24, 140]} />
      <meshPhysicalMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        metalness={metalness}
        roughness={roughness}
        clearcoat={clearcoat}
        clearcoatRoughness={0.03}
        reflectivity={1.0}
      />
    </mesh>
  );
}

// Luminous Translucent Sapphire Glass Crystal Disc (NO harsh black!)
function WavyCrystalDisc({ radius = 2.22 }: { radius?: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const geomRef = useRef<THREE.CircleGeometry>(null!);
  const basePosRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    if (geomRef.current && !basePosRef.current) {
      const arr = geomRef.current.attributes.position.array as Float32Array;
      basePosRef.current = new Float32Array(arr);
    }
  }, []);

  useFrame((state) => {
    if (!geomRef.current || !basePosRef.current) return;
    const time = state.clock.getElapsedTime();
    const posAttr = geomRef.current.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const base = basePosRef.current;
    const count = posAttr.count;

    for (let i = 0; i < count; i++) {
      const x0 = base[i * 3];
      const y0 = base[i * 3 + 1];
      const z0 = base[i * 3 + 2];

      const r0 = Math.sqrt(x0 * x0 + y0 * y0);
      if (r0 < 0.001) continue;

      const theta = Math.atan2(y0, x0);
      const rRatio = Math.min(1, r0 / radius);
      const edgeWeight = Math.pow(rRatio, 2.2);

      const waveR =
        (Math.sin(theta * 5 + time * 1.35 + Math.PI * 1.25) * 0.1 +
          Math.cos(theta * 4 - time * 1.1) * 0.04) * edgeWeight;

      const waveZ =
        Math.sin(theta * 6 + time * 1.35) * 0.07 * edgeWeight;

      const rNew = r0 + waveR;
      arr[i * 3] = rNew * Math.cos(theta);
      arr[i * 3 + 1] = rNew * Math.sin(theta);
      arr[i * 3 + 2] = z0 + waveZ;
    }

    posAttr.needsUpdate = true;
    geomRef.current.computeVertexNormals();

    if (meshRef.current) {
      meshRef.current.rotation.z = time * 0.04;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -0.06]}>
      <circleGeometry ref={geomRef} args={[radius, 96]} />
      <meshPhysicalMaterial
        color="#12141C"
        emissive="#0D0F14"
        emissiveIntensity={0.25}
        roughness={0.12}
        metalness={0.3}
        transmission={0.4}
        transparent
        opacity={0.85}
        clearcoat={1.0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ============================================================================
// 4. SHIMMERING ZARI DUST PARTICLES (Dot / Box motes floating in 3D space)
// ============================================================================
function RoyalStardustParticles({ count = 380 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#FFFFFF'), // Pure Specular White
      new THREE.Color('#EAECEC'), // User Shiny Silver
      new THREE.Color('#BBC2CC'), // Glossy Silver
      new THREE.Color('#FCF6BA'), // Champagne Gold
      new THREE.Color('#BF953F'), // 24K Gold
      new THREE.Color('#B38728'), // Antique Gold
    ];

    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 10;
      const radius = 1.6 + Math.sin(i * 0.12) * 1.5 + Math.random() * 0.8;

      pos[i * 3] = Math.cos(theta) * radius + (Math.random() - 0.5) * 0.6;
      pos[i * 3 + 1] = ((i / count) - 0.5) * 6.5 + Math.sin(theta * 1.5) * 0.5;
      pos[i * 3 + 2] = Math.sin(theta) * (radius * 0.5) + (Math.random() - 0.5) * 1.2;

      const c = palette[i % palette.length];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.08;
    pointsRef.current.rotation.z = t * 0.03;
    pointsRef.current.rotation.x = Math.sin(t * 0.15) * 0.08;
    pointsRef.current.position.y = Math.sin(t * 0.4) * 0.06;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.052}
        vertexColors
        transparent
        opacity={0.92}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// 3 Concentric Wavy Rings System
// FULLY RESPONSIVE with automatic viewport adaptation for Mobile, Tablet, and Desktop
function WavyRingsSystem() {
  const { viewport } = useThree();
  const markersRef = useRef<THREE.Points>(null!);
  const dialPipsRef = useRef<THREE.Points>(null!);

  const responsiveScale = useMemo(() => {
    const targetScale = (viewport.width * 0.86) / 5.04;
    return Math.min(1.0, Math.max(0.36, targetScale));
  }, [viewport.width]);

  // 60 Rolex/Horological Chronometer Bezel Marker Box/Dots
  const [markerPositions, markerColors] = useMemo(() => {
    const count = 60;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const radius = 2.42;

    const pureSilver = new THREE.Color('#FFFFFF');
    const shinySilver = new THREE.Color('#EAECEC');
    const goldColor = new THREE.Color('#FCF6BA');
    const deepGold = new THREE.Color('#BF953F');

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = 0;

      const c = i % 5 === 0 ? pureSilver : i % 2 === 0 ? shinySilver : i % 4 === 1 ? goldColor : deepGold;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  // 12 Interior Royal Hour Marker Dots (Dial Pips)
  const [pipPositions, pipColors] = useMemo(() => {
    const count = 12;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const radius = 1.84;

    const pureSilver = new THREE.Color('#FFFFFF');
    const shinySilver = new THREE.Color('#EAECEC');
    const gold = new THREE.Color('#BF953F');

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = -0.01;

      const c = i % 2 === 0 ? pureSilver : i % 4 === 1 ? shinySilver : gold;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (markersRef.current) {
      markersRef.current.rotation.z = t * 0.05;
      markersRef.current.rotation.x = Math.sin(t * 0.22) * 0.04;
      markersRef.current.rotation.y = Math.cos(t * 0.2) * 0.05;
    }
    if (dialPipsRef.current) {
      dialPipsRef.current.rotation.z = -t * 0.03;
    }
  });

  return (
    <group position={[0, 0, 0]} scale={[responsiveScale, responsiveScale, responsiveScale]}>

      {/* Subtle Inner Concentric Hairline Traces in 24K Gold & Silver */}
      <mesh position={[0, 0, -0.04]}>
        <torusGeometry args={[1.72, 0.008, 16, 96]} />
        <meshStandardMaterial
          color="#BF953F"
          emissive="#B38728"
          emissiveIntensity={0.5}
          metalness={0.95}
          roughness={0.15}
          transparent
          opacity={0.65}
        />
      </mesh>

      <mesh position={[0, 0, -0.04]}>
        <torusGeometry args={[1.22, 0.007, 16, 96]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          emissive="#EAECEC"
          emissiveIntensity={0.8}
          metalness={1.0}
          roughness={0.03}
          clearcoat={1.0}
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* 1. OUTER WAVY RING: 24K Polished Gold (Fluid 4-lobed wave harmonics) */}
      <SingleWavyRing
        baseRadius={2.52}
        tubeRadius={0.034}
        color="#BF953F"
        emissive="#B38728"
        emissiveIntensity={0.65}
        metalness={0.98}
        roughness={0.08}
        clearcoat={1.0}
        waveFreq1={4}
        waveFreq2={3}
        waveFreq3={5}
        ampR={0.12}
        ampZ={0.14}
        speed={1.2}
        phase={0}
      />

      {/* 2. MIDDLE WAVY RING: ULTRA SHINY SILVER (#EAECEC & Pure Mirror Chrome) */}
      <SingleWavyRing
        baseRadius={2.36}
        tubeRadius={0.03}
        color="#FFFFFF"
        emissive="#EAECEC"
        emissiveIntensity={0.92}
        metalness={1.0}
        roughness={0.02}
        clearcoat={1.0}
        waveFreq1={3}
        waveFreq2={5}
        waveFreq3={4}
        ampR={0.14}
        ampZ={0.16}
        speed={1.05}
        phase={Math.PI * 0.65}
      />

      {/* 3. INNER WAVY RING: Rolesor Champagne Gold & Glossy Silver (Delicate 5-lobed ripple harmonics) */}
      <SingleWavyRing
        baseRadius={2.2}
        tubeRadius={0.022}
        color="#FCF6BA"
        emissive="#BBC2CC"
        emissiveIntensity={0.65}
        metalness={0.98}
        roughness={0.06}
        clearcoat={1.0}
        waveFreq1={5}
        waveFreq2={4}
        waveFreq3={6}
        ampR={0.1}
        ampZ={0.11}
        speed={1.35}
        phase={Math.PI * 1.25}
      />

      {/* 4. 60 Chronometer Bezel Marker Box/Dots (Alternating Shiny Silver & Gold) */}
      <points ref={markersRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[markerPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[markerColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.048}
          vertexColors
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 5. 12 Interior Royal Hour Marker Dots (Dial Pips) */}
      <points ref={dialPipsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pipPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[pipColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.068}
          vertexColors
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

// ============================================================================
// MAIN COMPONENT EXPORT
// ============================================================================
interface RoyalFiberCanvasProps {
  className?: string;
  particleCount?: number;
  showRing?: boolean;
  showBackgroundRibbon?: boolean;
}

export default function RoyalFiberCanvas({
  className = 'w-full h-full',
  particleCount = 900,
  showRing = true,
  showBackgroundRibbon = false, // Clean by default: no background clutter in intro!
}: RoyalFiberCanvasProps) {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`relative pointer-events-none ${className}`} />;
  }

  return (
    <div className={`relative pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.85} />
        {/* Warm 24K Gold Specular Lights */}
        <pointLight position={[5, 5, 5]} color="#FCF6BA" intensity={2.5} />
        <pointLight position={[-5, -5, -2]} color="#BF953F" intensity={1.8} />

        {/* User-Specified Shiny Silver Specular Rim Lights */}
        <pointLight position={[0, 6, 4.5]} color="#FFFFFF" intensity={4.5} />
        <pointLight position={[-4, 4, 3.5]} color="#EAECEC" intensity={3.8} />
        <pointLight position={[4, -4, 3.5]} color="#BBC2CC" intensity={3.0} />

        {/* Dynamic Orbiting Specular Glint for high-gleam mirror chrome shimmer */}
        {showRing && <DynamicSilverGlint />}

        {/* Shimmering Zari Dust Particles (3D Box/Dot Motes floating in space) */}
        {showRing && <RoyalStardustParticles count={380} />}

        {/* Silk Ribbon Background: ONLY rendered when explicitly enabled (used on Home page!) */}
        {showBackgroundRibbon && <SilkRibbonBackground lineCount={38} pointsPerLine={55} />}

        {/* Wavy Concentric Circle System (Auto-Responsive, Clean, Translucent) */}
        {showRing && <WavyRingsSystem />}
      </Canvas>
    </div>
  );
}
