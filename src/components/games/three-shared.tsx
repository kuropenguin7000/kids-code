"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Bits shared by the 3D game engines (robot, pattern). The design rule for
 * all of them: outcomes are committed by wall-clock timers in the React layer,
 * and every 3D pose is a pure function of wall time — dropped frames (or a
 * throttled background tab) can only skip visuals, never wedge a game.
 */

/** Mount gate for <Canvas>: skips WebGL during static prerender, and nudges a
 *  resize right after mount because some embedded webviews miss the initial
 *  ResizeObserver tick. */
export function useCanvasReady() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const nudge = setTimeout(() => window.dispatchEvent(new Event("resize")), 60);
    return () => clearTimeout(nudge);
  }, []);
  return mounted;
}

/** Shortest-path angle interpolation (for smooth turning). */
export function lerpAngle(a: number, b: number, t: number) {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

/** The KidsCode robot character (static meshes; wrap in a group to animate).
 *  Front (face/screen) points toward +z. */
export function RobotMeshes() {
  return (
    <>
      {/* base / treads */}
      <mesh castShadow position={[0, 0.12, 0]}>
        <boxGeometry args={[0.42, 0.14, 0.34]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {/* body */}
      <mesh castShadow position={[0, 0.42, 0]}>
        <boxGeometry args={[0.52, 0.46, 0.4]} />
        <meshStandardMaterial color="#38bdf8" />
      </mesh>
      {/* glowing belly screen */}
      <mesh position={[0, 0.44, 0.205]}>
        <boxGeometry args={[0.3, 0.22, 0.01]} />
        <meshStandardMaterial
          color="#0ea5e9"
          emissive="#22d3ee"
          emissiveIntensity={0.35}
        />
      </mesh>
      {/* arms */}
      <mesh castShadow position={[-0.33, 0.45, 0]}>
        <boxGeometry args={[0.1, 0.3, 0.14]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>
      <mesh castShadow position={[0.33, 0.45, 0]}>
        <boxGeometry args={[0.1, 0.3, 0.14]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>
      {/* head */}
      <mesh castShadow position={[0, 0.82, 0]}>
        <boxGeometry args={[0.4, 0.32, 0.36]} />
        <meshStandardMaterial color="#7dd3fc" />
      </mesh>
      {/* eyes */}
      <mesh position={[-0.09, 0.84, 0.185]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.09, 0.84, 0.185]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* antenna */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[0, 1.16, 0]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial
          color="#f472b6"
          emissive="#ec4899"
          emissiveIntensity={0.6}
        />
      </mesh>
    </>
  );
}

/** Canvas-rendered emoji/text textures for sprites, cached per text+color. */
const textureCache = new Map<string, THREE.CanvasTexture>();

export function getTextTexture(
  text: string,
  opts?: { color?: string; size?: number }
): THREE.CanvasTexture {
  const color = opts?.color ?? "#0f172a";
  const size = opts?.size ?? 128;
  const key = `${text}|${color}|${size}`;
  const cached = textureCache.get(key);
  if (cached) return cached;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.font = `bold ${Math.round(size * 0.78)}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(text, size / 2, size / 2 + size * 0.04);
  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(key, texture);
  return texture;
}

export const CONFETTI_COLORS = [
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#38bdf8",
];
const CONFETTI_COUNT = 80;
const CONFETTI_LIFE = 1.8;

export type Burst = { id: number; pos: [number, number, number]; at: number };

/** One-shot confetti burst; particle positions are pure functions of time. */
export function Confetti({ burst }: { burst: Burst | null }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const particles = useRef<{ vel: Float32Array; rot: Float32Array } | null>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    if (!burst) {
      particles.current = null;
      m.count = 0;
      return;
    }
    const vel = new Float32Array(CONFETTI_COUNT * 3);
    const rot = new Float32Array(CONFETTI_COUNT * 3);
    const color = new THREE.Color();
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.4 + Math.random() * 1.4;
      vel[i * 3] = Math.cos(a) * r;
      vel[i * 3 + 1] = 2.2 + Math.random() * 2.4;
      vel[i * 3 + 2] = Math.sin(a) * r;
      rot[i * 3] = Math.random() * Math.PI;
      rot[i * 3 + 1] = Math.random() * Math.PI;
      rot[i * 3 + 2] = Math.random() * Math.PI;
      m.setColorAt(i, color.set(CONFETTI_COLORS[i % CONFETTI_COLORS.length]));
    }
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    particles.current = { vel, rot };
  }, [burst]);

  useFrame(() => {
    const m = mesh.current;
    const p = particles.current;
    if (!m) return;
    if (!p || !burst) {
      m.count = 0;
      return;
    }
    const t = (performance.now() - burst.at) / 1000;
    if (t >= CONFETTI_LIFE) {
      m.count = 0;
      return;
    }
    m.count = CONFETTI_COUNT;
    const fade = Math.max(0, 1 - t / CONFETTI_LIFE);
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const x = burst.pos[0] + p.vel[i * 3] * t;
      const y = burst.pos[1] + 0.5 + p.vel[i * 3 + 1] * t - 2.25 * t * t;
      const z = burst.pos[2] + p.vel[i * 3 + 2] * t;
      dummy.position.set(x, Math.max(y, 0.02), z);
      dummy.rotation.set(
        p.rot[i * 3] + t * 4,
        p.rot[i * 3 + 1],
        p.rot[i * 3 + 2] + t * 5
      );
      dummy.scale.setScalar(fade);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, CONFETTI_COUNT]}
      frustumCulled={false}
    >
      <boxGeometry args={[0.09, 0.02, 0.13]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
}
