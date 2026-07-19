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

/**
 * @react-three/fiber (9.6.x) still constructs a THREE.Clock internally, and
 * three r183+ prints a deprecation warning from the Clock CONSTRUCTOR on
 * every Canvas mount — nothing in our code or Canvas props can prevent it.
 * Route three's logging through its official setConsoleFunction hook and drop
 * only that one known upstream message; everything else passes through.
 * Remove once r3f migrates to THREE.Timer.
 */
THREE.setConsoleFunction((type, message, ...params) => {
  if (type === "warn" && message.startsWith("THREE.Clock: This module has been deprecated")) return;
  console[type](message, ...params);
});

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

/** Robo's colors per evolution stage. */
const ROBOT_STAGES = [
  { body: "#38bdf8", head: "#7dd3fc", arms: "#0284c7", screen: "#0ea5e9", screenGlow: "#22d3ee", bulb: "#f472b6", bulbGlow: "#ec4899" },
  { body: "#34d399", head: "#6ee7b7", arms: "#059669", screen: "#10b981", screenGlow: "#a7f3d0", bulb: "#fbbf24", bulbGlow: "#f59e0b" },
  { body: "#fb923c", head: "#fdba74", arms: "#ea580c", screen: "#f97316", screenGlow: "#fed7aa", bulb: "#22d3ee", bulbGlow: "#06b6d4" },
  { body: "#a78bfa", head: "#c4b5fd", arms: "#7c3aed", screen: "#8b5cf6", screenGlow: "#ddd6fe", bulb: "#fde047", bulbGlow: "#facc15" },
  { body: "#facc15", head: "#fde047", arms: "#ca8a04", screen: "#eab308", screenGlow: "#fef9c3", bulb: "#f472b6", bulbGlow: "#ec4899" },
];

/** How much bigger Robo gets at each stage. */
const ROBOT_SCALE = [1, 1.07, 1.15, 1.24, 1.34];

/**
 * The KidsCode robot character (wrap in a group to animate). Front points
 * toward +z. `stage` (0..4) is a real evolution, not a palette swap — the
 * silhouette changes each stage and Robo grows:
 *   0 Rookie:   small boxy bot on treads, one antenna.
 *   1 Scout:    jetpack + twin antennas + a smile.
 *   2 Explorer: walks on LEGS, helmet dome, chest badge, claw hands.
 *   3 Ranger:   HOVERS on a glow disc, glowing visor face, back fins,
 *               shoulder lights.
 *   4 Champion: bigger hover bot, gold, wide wings, crown, pulsing chest core.
 * The float/pulse accents animate off the render clock (visual only — no
 * game state ever depends on them, per the wall-clock architecture rule).
 */
export function RobotMeshes({ stage = 0 }: { stage?: number }) {
  const s = Math.min(Math.max(stage, 0), ROBOT_STAGES.length - 1);
  const look = ROBOT_STAGES[s];
  const hovering = s >= 3;
  const inner = useRef<THREE.Group>(null);
  const coreMat = useRef<THREE.MeshStandardMaterial>(null);
  const visorMat = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (inner.current) {
      // hover stages float on their glow disc; ground stages sit still
      inner.current.position.y = hovering ? 0.14 + Math.sin(t * 2.1) * 0.045 : 0;
    }
    if (coreMat.current) {
      coreMat.current.emissiveIntensity = 0.55 + Math.sin(t * 3.2) * 0.3;
    }
    if (visorMat.current) {
      visorMat.current.emissiveIntensity = 0.5 + Math.sin(t * 1.7) * 0.2;
    }
  });

  return (
    <group scale={ROBOT_SCALE[s]}>
      {/* under-glow disc for hover stages */}
      {hovering && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <circleGeometry args={[0.3, 24]} />
          <meshBasicMaterial color={look.bulbGlow} transparent opacity={0.35} />
        </mesh>
      )}

      <group ref={inner}>
        {/* --- ground contact: treads → legs → hover (nothing) --- */}
        {s <= 1 && (
          <mesh castShadow position={[0, 0.12, 0]}>
            <boxGeometry args={[0.42, 0.14, 0.34]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        )}
        {s === 2 && (
          <>
            {[-0.13, 0.13].map((x) => (
              <group key={x}>
                <mesh castShadow position={[x, 0.14, 0]}>
                  <boxGeometry args={[0.13, 0.2, 0.16]} />
                  <meshStandardMaterial color="#334155" />
                </mesh>
                <mesh castShadow position={[x, 0.04, 0.03]}>
                  <boxGeometry args={[0.15, 0.08, 0.24]} />
                  <meshStandardMaterial color="#1e293b" />
                </mesh>
              </group>
            ))}
          </>
        )}

        {/* --- body --- */}
        <mesh castShadow position={[0, 0.42, 0]}>
          <boxGeometry args={[0.52, 0.46, 0.4]} />
          <meshStandardMaterial
            color={look.body}
            metalness={s >= 4 ? 0.45 : 0}
            roughness={s >= 4 ? 0.35 : 0.9}
          />
        </mesh>

        {/* belly: screen (0-2) → glowing round core (3-4) */}
        {s <= 2 ? (
          <mesh position={[0, 0.44, 0.205]}>
            <boxGeometry args={[0.3, 0.22, 0.01]} />
            <meshStandardMaterial
              color={look.screen}
              emissive={look.screenGlow}
              emissiveIntensity={0.35}
            />
          </mesh>
        ) : (
          <mesh position={[0, 0.44, 0.21]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial
              ref={coreMat}
              color={look.screen}
              emissive={look.screenGlow}
              emissiveIntensity={0.55}
            />
          </mesh>
        )}

        {/* stage 2+: chest badge */}
        {s >= 2 && (
          <mesh position={[0.17, 0.55, 0.205]}>
            <cylinderGeometry args={[0.045, 0.045, 0.02, 6]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={0.4}
            />
          </mesh>
        )}

        {/* --- arms: plain (0-1) → claw hands (2+) --- */}
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh castShadow position={[side * 0.33, 0.45, 0]}>
              <boxGeometry args={[0.1, 0.3, 0.14]} />
              <meshStandardMaterial color={look.arms} />
            </mesh>
            {s >= 2 && (
              <mesh castShadow position={[side * 0.33, 0.27, 0.03]}>
                <boxGeometry args={[0.12, 0.09, 0.18]} />
                <meshStandardMaterial color="#334155" />
              </mesh>
            )}
            {/* stage 3+: glowing shoulder lights */}
            {s >= 3 && (
              <mesh position={[side * 0.33, 0.64, 0]}>
                <sphereGeometry args={[0.06, 12, 12]} />
                <meshStandardMaterial
                  color={look.bulb}
                  emissive={look.bulbGlow}
                  emissiveIntensity={0.7}
                />
              </mesh>
            )}
          </group>
        ))}

        {/* --- back gear: jetpack (1-2) → fins (3) → wide wings (4) --- */}
        {s >= 1 && s <= 2 && (
          <>
            {[-0.13, 0.13].map((x) => (
              <group key={x}>
                <mesh castShadow position={[x, 0.42, -0.26]}>
                  <cylinderGeometry args={[0.07, 0.09, 0.3, 10]} />
                  <meshStandardMaterial color="#64748b" />
                </mesh>
                <mesh position={[x, 0.25, -0.26]}>
                  <coneGeometry args={[0.055, 0.1, 10]} />
                  <meshStandardMaterial
                    color="#fb923c"
                    emissive="#f97316"
                    emissiveIntensity={0.5}
                  />
                </mesh>
              </group>
            ))}
          </>
        )}
        {s >= 3 &&
          [-1, 1].map((side) => (
            <mesh
              key={side}
              castShadow
              position={[side * (s >= 4 ? 0.34 : 0.26), 0.58, -0.24]}
              rotation={[0.15, 0, side * (s >= 4 ? 0.8 : 0.55)]}
            >
              <boxGeometry args={s >= 4 ? [0.5, 0.1, 0.03] : [0.3, 0.09, 0.03]} />
              <meshStandardMaterial
                color={s >= 4 ? "#fbbf24" : look.arms}
                emissive={s >= 4 ? "#f59e0b" : "#000000"}
                emissiveIntensity={s >= 4 ? 0.3 : 0}
              />
            </mesh>
          ))}

        {/* --- head --- */}
        <mesh castShadow position={[0, 0.82, 0]}>
          <boxGeometry args={[0.4, 0.32, 0.36]} />
          <meshStandardMaterial
            color={look.head}
            metalness={s >= 4 ? 0.45 : 0}
            roughness={s >= 4 ? 0.35 : 0.9}
          />
        </mesh>

        {/* face: round eyes + smile (0-2) → glowing visor (3-4) */}
        {s <= 2 ? (
          <>
            <mesh position={[-0.09, 0.84, 0.185]}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0.09, 0.84, 0.185]}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            {s >= 1 && (
              <mesh position={[0, 0.75, 0.185]}>
                <boxGeometry args={[0.12, 0.025, 0.01]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
            )}
          </>
        ) : (
          <mesh position={[0, 0.84, 0.185]}>
            <boxGeometry args={[0.28, 0.09, 0.02]} />
            <meshStandardMaterial
              ref={visorMat}
              color="#0f172a"
              emissive={look.screenGlow}
              emissiveIntensity={0.5}
            />
          </mesh>
        )}

        {/* stage 2: explorer helmet dome */}
        {s === 2 && (
          <mesh castShadow position={[0, 0.97, 0]} scale={[1, 0.55, 1]}>
            <sphereGeometry args={[0.24, 16, 12]} />
            <meshStandardMaterial color={look.arms} />
          </mesh>
        )}

        {/* top: one antenna (0) → twin antennas (1-3) → crown (4) */}
        {s <= 3 &&
          (s === 0 ? [0] : [-0.1, 0.1]).map((x) => (
            <group key={x}>
              <mesh position={[x, s === 2 ? 1.12 : 1.05, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
                <meshStandardMaterial color="#475569" />
              </mesh>
              <mesh position={[x, s === 2 ? 1.23 : 1.16, 0]}>
                <sphereGeometry args={[0.055, 12, 12]} />
                <meshStandardMaterial
                  color={look.bulb}
                  emissive={look.bulbGlow}
                  emissiveIntensity={0.6}
                />
              </mesh>
            </group>
          ))}
        {s >= 4 && (
          <>
            <mesh castShadow position={[0, 1.04, 0]}>
              <cylinderGeometry args={[0.15, 0.17, 0.09, 10]} />
              <meshStandardMaterial
                color="#fbbf24"
                emissive="#f59e0b"
                emissiveIntensity={0.4}
              />
            </mesh>
            {[-0.1, 0, 0.1].map((x) => (
              <mesh key={x} position={[x, 1.12, 0.08]}>
                <coneGeometry args={[0.03, 0.08, 6]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  emissive="#f59e0b"
                  emissiveIntensity={0.4}
                />
              </mesh>
            ))}
          </>
        )}
      </group>
    </group>
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

/** Deterministic pseudo-random in [0,1) so generated textures are stable. */
function prand(n: number) {
  return Math.abs(Math.sin(n * 127.1 + 311.7) * 43758.5453) % 1;
}

export type SurfacePattern =
  | "grass"
  | "waves"
  | "sand"
  | "ice"
  | "candy"
  | "wood"
  | "coral"
  | "brick"
  | "stripes";

/** Canvas-drawn surface textures for tiles/walls, cached per pattern+colors. */
export function getPatternTexture(
  pattern: SurfacePattern,
  base: string,
  accent: string
): THREE.CanvasTexture {
  const key = `pat|${pattern}|${base}|${accent}`;
  const cached = textureCache.get(key);
  if (cached) return cached;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = accent;
  ctx.fillStyle = accent;
  ctx.lineCap = "round";

  if (pattern === "grass") {
    // short blades scattered about
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 42; i++) {
      const x = prand(i) * size;
      const y = prand(i + 50) * size;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (prand(i + 100) - 0.5) * 6, y - 6 - prand(i + 150) * 6);
      ctx.stroke();
    }
  } else if (pattern === "waves") {
    ctx.lineWidth = 4;
    ctx.globalAlpha = 0.45;
    for (let row = 0; row < 4; row++) {
      const y0 = (row + 0.5) * (size / 4);
      ctx.beginPath();
      for (let x = 0; x <= size; x += 4) {
        const y = y0 + Math.sin((x / size) * Math.PI * 4 + row) * 5;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  } else if (pattern === "sand") {
    ctx.globalAlpha = 0.4;
    for (let i = 0; i < 90; i++) {
      ctx.beginPath();
      ctx.arc(prand(i) * size, prand(i + 90) * size, 1.6 + prand(i + 180) * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pattern === "ice") {
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 7; i++) {
      const x = prand(i) * size;
      const y = prand(i + 30) * size;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 18 + prand(i + 60) * 22, y - 14 - prand(i + 90) * 18);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.7;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.arc(prand(i + 7) * size, prand(i + 77) * size, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pattern === "candy") {
    ctx.globalAlpha = 0.55;
    for (let i = 0; i < 14; i++) {
      ctx.beginPath();
      ctx.arc(prand(i) * size, prand(i + 40) * size, 4.5 + prand(i + 80) * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pattern === "wood") {
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.55;
    for (let row = 1; row < 4; row++) {
      const y = row * (size / 4) + (prand(row) - 0.5) * 4;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.7;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(prand(i + 3) * size, prand(i + 33) * size, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pattern === "coral") {
    ctx.globalAlpha = 0.45;
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.arc(prand(i) * size, prand(i + 20) * size, 4 + prand(i + 40) * 6, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pattern === "brick") {
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.55;
    const rowH = size / 4;
    for (let row = 0; row < 4; row++) {
      const y = row * rowH;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
      const offset = row % 2 === 0 ? 0 : size / 4;
      for (let col = 0; col < 2; col++) {
        const x = offset + col * (size / 2);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + rowH);
        ctx.stroke();
      }
    }
  } else if (pattern === "stripes") {
    ctx.lineWidth = 12;
    ctx.globalAlpha = 0.5;
    for (let i = -1; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 24 - 12, size + 8);
      ctx.lineTo(i * 24 + size / 2, -8);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(key, texture);
  return texture;
}

/* ----------------------- world themes (shared by all engines) ----------------------- */

export type WorldTheme = {
  /** Full literal class strings so Tailwind sees them at build time. */
  frame: string;
  tileA: string;
  tileB: string;
  goalTile: string;
  tilePattern: SurfacePattern;
  tileAccent: string;
  wall: string;
  wallLid: string;
  wallPattern: SurfacePattern;
  wallAccent: string;
  ground: string;
  /** Animated sky sprites: what floats around and how it moves. */
  sky: { emoji: string; count: number; mode: "drift" | "fall" | "twinkle" | "rise" };
  /** Little emoji props standing at the scene corners. */
  deco: string[];
};

/** One world per game in a level: meadow → ocean → desert → snow → candy night. */
export const WORLD_THEMES: WorldTheme[] = [
  {
    // meadow morning
    frame:
      "border-violet-100 bg-gradient-to-b from-sky-100 via-violet-50 to-fuchsia-50",
    tileA: "#d9f99d",
    tileB: "#bef264",
    goalTile: "#fde047",
    tilePattern: "grass",
    tileAccent: "#65a30d",
    wall: "#c9884b",
    wallLid: "#a9713a",
    wallPattern: "wood",
    wallAccent: "#8a5a2b",
    ground: "#ecfccb",
    sky: { emoji: "☁️", count: 4, mode: "drift" },
    deco: ["🌼", "🌳", "🌷", "🍄"],
  },
  {
    // ocean shore
    frame:
      "border-cyan-100 bg-gradient-to-b from-cyan-100 via-sky-50 to-emerald-50",
    tileA: "#cffafe",
    tileB: "#a5f3fc",
    goalTile: "#fde047",
    tilePattern: "waves",
    tileAccent: "#ffffff",
    wall: "#fb7185",
    wallLid: "#e11d48",
    wallPattern: "coral",
    wallAccent: "#be123c",
    ground: "#99f6e4",
    sky: { emoji: "🫧", count: 7, mode: "rise" },
    deco: ["🐚", "⛵", "🦀", "🌴"],
  },
  {
    // sunset desert
    frame:
      "border-amber-100 bg-gradient-to-b from-amber-100 via-orange-50 to-rose-50",
    tileA: "#fef3c7",
    tileB: "#fde68a",
    goalTile: "#f472b6",
    tilePattern: "sand",
    tileAccent: "#d97706",
    wall: "#d97706",
    wallLid: "#92400e",
    wallPattern: "brick",
    wallAccent: "#92400e",
    ground: "#fed7aa",
    sky: { emoji: "☁️", count: 2, mode: "drift" },
    deco: ["🌵", "🪨", "🌵", "🦎"],
  },
  {
    // snow world
    frame:
      "border-indigo-100 bg-gradient-to-b from-indigo-100 via-sky-50 to-cyan-50",
    tileA: "#e0f2fe",
    tileB: "#bae6fd",
    goalTile: "#fde047",
    tilePattern: "ice",
    tileAccent: "#ffffff",
    wall: "#93c5fd",
    wallLid: "#3b82f6",
    wallPattern: "ice",
    wallAccent: "#ffffff",
    ground: "#f0f9ff",
    sky: { emoji: "❄️", count: 10, mode: "fall" },
    deco: ["⛄", "🌲", "🌲", "🏔️"],
  },
  {
    // candy night
    frame:
      "border-purple-200 bg-gradient-to-b from-violet-200 via-purple-100 to-pink-100",
    tileA: "#ddd6fe",
    tileB: "#c4b5fd",
    goalTile: "#fde047",
    tilePattern: "candy",
    tileAccent: "#ffffff",
    wall: "#a855f7",
    wallLid: "#7e22ce",
    wallPattern: "stripes",
    wallAccent: "#f5d0fe",
    ground: "#e9d5ff",
    sky: { emoji: "⭐", count: 8, mode: "twinkle" },
    deco: ["🍭", "🍬", "🧁", "🍩"],
  },
];

/** Animated sky: clouds drift, bubbles rise, snow falls, stars twinkle.
 *  `width`/`depth` are the scene's playfield extents in world units. Every
 *  position is a pure function of wall time — visual only. */
export function SkySprites({
  theme,
  width,
  depth,
}: {
  theme: WorldTheme;
  width: number;
  depth: number;
}) {
  const { emoji, count, mode } = theme.sky;
  const texture = getTextTexture(emoji, { size: 96 });
  const refs = useRef<(THREE.Sprite | null)[]>([]);
  const w = width + 6;
  const backZ = -depth / 2 - 1.6;
  const baseScale =
    mode === "drift" ? 0.9 : mode === "fall" ? 0.3 : mode === "rise" ? 0.32 : 0.4;

  useFrame(() => {
    const t = performance.now() / 1000;
    for (let i = 0; i < count; i++) {
      const spr = refs.current[i];
      if (!spr) continue;
      const sx = prand(i * 3 + 1);
      const sy = prand(i * 3 + 2);
      const sp = prand(i * 3 + 3);
      if (mode === "drift") {
        const x = ((sx * w + t * (0.18 + sp * 0.22)) % w) - w / 2;
        spr.position.set(x, 1.1 + sy * 1.6, backZ - sp * 1.5);
        spr.scale.setScalar(baseScale * (0.8 + sp * 0.5));
      } else if (mode === "fall") {
        const h = 3.4;
        const y = h - ((sy * h + t * (0.35 + sp * 0.4)) % h);
        const x = (sx - 0.5) * (width + 2) + Math.sin(t * 0.8 + sp * 7) * 0.4;
        spr.position.set(x, y, (sp - 0.5) * (depth + 1.5));
        spr.scale.setScalar(baseScale * (0.7 + sp * 0.6));
      } else if (mode === "rise") {
        const h = 2.8;
        const y = (sy * h + t * (0.25 + sp * 0.3)) % h;
        const x = (sx - 0.5) * w * 0.9 + Math.sin(t + sp * 6) * 0.2;
        spr.position.set(x, y, backZ - sp);
        spr.scale.setScalar(baseScale * (0.6 + y / h));
      } else {
        // twinkle: fixed spot, pulsing size
        spr.position.set((sx - 0.5) * w, 1.2 + sy * 1.8, backZ - sp * 1.5);
        spr.scale.setScalar(baseScale * (0.75 + Math.sin(t * 2 + sp * 12) * 0.3));
      }
    }
  });

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <sprite
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <spriteMaterial map={texture} transparent depthWrite={false} opacity={0.9} />
        </sprite>
      ))}
    </>
  );
}

/** Emoji props (trees, cacti, snowmen…) standing at the playfield corners. */
export function Decorations({
  theme,
  width,
  depth,
}: {
  theme: WorldTheme;
  width: number;
  depth: number;
}) {
  const corners: [number, number][] = [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ];
  return (
    <>
      {theme.deco.map((emoji, i) => {
        const [cx, cz] = corners[i % corners.length];
        const scale = 0.55 + prand(i + 21) * 0.25;
        return (
          <sprite
            key={i}
            position={[
              cx * (width / 2 + 0.9 + prand(i) * 0.5),
              scale * 0.45,
              cz * (depth / 2 + 0.55 + prand(i + 9) * 0.4),
            ]}
            scale={[scale, scale, 1]}
          >
            <spriteMaterial
              map={getTextTexture(emoji, { size: 96 })}
              transparent
              depthWrite={false}
            />
          </sprite>
        );
      })}
    </>
  );
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
