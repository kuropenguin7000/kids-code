"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { allGames, type MemoryGame } from "@/lib/curriculum";
import {
  Confetti,
  Decorations,
  RobotMeshes,
  SkySprites,
  WORLD_THEMES,
  getPatternTexture,
  getTextTexture,
  lerpAngle,
  useCanvasReady,
  type Burst,
  type WorldTheme,
} from "./three-shared";

/** Same treatment as the robot level: one world theme per memory game, and
 *  Robo the drummer evolves along with it. */
const MEMORY_GAME_IDS = allGames
  .filter((g) => g.kind === "memory")
  .map((g) => g.id);

/**
 * "Robo Says" — a Simon-style watch-and-repeat game for pre-readers. Robo
 * drums a short song (pads flash one by one), then the kid taps the same pads
 * in the same order. Wrong tap? No penalty: Robo simply plays the song again.
 * There is nothing to read — the demo IS the instruction.
 *
 * As with the other 3D engines, wall-clock timers commit every phase change;
 * the scene renders whatever pose belongs to "now".
 */

type Phase =
  | { kind: "demo"; at: number }
  | { kind: "input"; at: number }
  | { kind: "wrong"; at: number; pad: number }
  | { kind: "won"; at: number };

const INTRO_S = 0.7; // pause before the first beat of the demo
const STEP_S = 0.7; // one beat
const FLASH_S = 0.5; // how long a pad stays lit within a beat
const TAP_FLASH_S = 0.35;
const WRONG_S = 1.2; // sad-headshake time before the song replays
const WIN_S = 2.0; // celebration before the win is committed

const PAD_GAP = 1.35;

function demoTotalS(len: number) {
  return INTRO_S + len * STEP_S + 0.4;
}

/** Which pad is lit at demo-time t (seconds), or null between beats. */
function demoActivePad(sequence: number[], t: number): number | null {
  if (t < INTRO_S) return null;
  const k = Math.floor((t - INTRO_S) / STEP_S);
  if (k < 0 || k >= sequence.length) return null;
  return t - INTRO_S - k * STEP_S < FLASH_S ? sequence[k] : null;
}

function padX(index: number, count: number) {
  return (index - (count - 1) / 2) * PAD_GAP;
}

/* ------------------------------- 3D pieces ------------------------------- */

/** One drum pad: lights up for demo beats, taps, and the win dance. */
function Pad({
  pad,
  index,
  count,
  sequence,
  phase,
  lastTap,
}: {
  pad: { color: string; emoji: string };
  index: number;
  count: number;
  sequence: number[];
  phase: Phase;
  lastTap: { pad: number; at: number } | null;
}) {
  const group = useRef<THREE.Group>(null);
  const top = useRef<THREE.Mesh>(null);
  const face = useRef<THREE.Sprite>(null);
  const x = padX(index, count);

  useFrame(({ clock }) => {
    const g = group.current;
    const cap = top.current;
    if (!g || !cap) return;
    const now = performance.now();
    let lit = 0; // 0..1 emissive boost
    let press = 0; // 0..1 pressed-down dip
    let danceY = 0;

    if (phase.kind === "demo") {
      const t = (now - phase.at) / 1000;
      if (demoActivePad(sequence, t) === index) {
        lit = 1;
        press = 1;
      }
    } else if (phase.kind === "input") {
      // gentle inviting pulse: "these are tappable"
      lit = 0.2 + Math.sin(clock.elapsedTime * 3 + index * 1.3) * 0.12;
    } else if (phase.kind === "wrong") {
      if (phase.pad === index) {
        const t = (now - phase.at) / 1000;
        lit = Math.max(0, 1 - t * 1.5);
        press = Math.max(0, 1 - t * 3);
      }
    } else {
      // won: rainbow dance, staggered per pad
      const t = (now - phase.at) / 1000;
      lit = Math.abs(Math.sin(t * 6 - index * 0.9));
      danceY = Math.abs(Math.sin(t * 4 + index)) * 0.12;
    }

    if (lastTap && lastTap.pad === index) {
      const t = (now - lastTap.at) / 1000;
      if (t >= 0 && t < TAP_FLASH_S) {
        const k = 1 - t / TAP_FLASH_S;
        lit = Math.max(lit, k);
        press = Math.max(press, k);
      }
    }

    g.position.set(x, danceY - press * 0.07, 0.55);
    const material = cap.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = 0.12 + lit * 0.95;
    if (face.current) {
      face.current.position.y = 0.78 + Math.sin(clock.elapsedTime * 2 + index) * 0.04;
    }
  });

  return (
    <group ref={group} position={[x, 0, 0.55]}>
      {/* drum shell */}
      <mesh castShadow receiveShadow position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.52, 0.58, 0.24, 28]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      {/* glowing skin */}
      <mesh ref={top} castShadow position={[0, 0.27, 0]}>
        <cylinderGeometry args={[0.48, 0.52, 0.1, 28]} />
        <meshStandardMaterial
          color={pad.color}
          emissive={pad.color}
          emissiveIntensity={0.12}
        />
      </mesh>
      {/* emoji face floating above */}
      <sprite ref={face} position={[0, 0.78, 0]} scale={[0.46, 0.46, 1]}>
        <spriteMaterial
          map={getTextTexture(pad.emoji)}
          transparent
          depthWrite={false}
        />
      </sprite>
    </group>
  );
}

/** Robo the drummer: sings toward each flashing pad, shakes its head on a
 *  wrong tap, spins and hops when the song is played back right. */
function RoboBuddy({
  padCount,
  sequence,
  phase,
  stage,
}: {
  padCount: number;
  sequence: number[];
  phase: Phase;
  stage: number;
}) {
  const group = useRef<THREE.Group>(null);
  const HOME_Z = -1.15;

  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const now = performance.now();

    if (phase.kind === "won") {
      const t = (now - phase.at) / 1000;
      g.rotation.y += delta * 7;
      g.position.set(0, Math.abs(Math.sin(t * Math.PI * 3)) * 0.35, HOME_Z);
      g.rotation.z = 0;
      return;
    }

    let targetYaw = 0;
    let y = Math.abs(Math.sin(clock.elapsedTime * 2)) * 0.03;

    if (phase.kind === "demo") {
      const t = (now - phase.at) / 1000;
      const active = demoActivePad(sequence, t);
      if (active !== null) {
        // face the pad being played and give a little drummer's hop
        targetYaw = Math.atan2(padX(active, padCount), 0.55 - HOME_Z);
        y = 0.09;
      }
    } else if (phase.kind === "wrong") {
      const t = (now - phase.at) / 1000;
      const decay = Math.max(0, 1 - t / (WRONG_S * 0.75));
      targetYaw = Math.sin(t * 14) * 0.4 * decay; // "no no no"
    }

    g.rotation.y = lerpAngle(g.rotation.y, targetYaw, Math.min(1, delta * 10));
    g.rotation.z = 0;
    g.position.set(0, y, HOME_Z);
  });

  return (
    <group ref={group} position={[0, 0, HOME_Z]} scale={1.15}>
      <RobotMeshes stage={stage} />
    </group>
  );
}

/** Themed stage floor on the world's ground disc + shadow catcher. */
function Stage({ padCount, theme }: { padCount: number; theme: WorldTheme }) {
  const width = padCount * PAD_GAP + 1.8;
  const floorTex = getPatternTexture(
    theme.tilePattern,
    theme.tileA,
    theme.tileAccent
  );
  return (
    <group>
      {/* the world floor the stage sits on */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.26, -0.2]}>
        <circleGeometry args={[width / 2 + 2.2, 48]} />
        <meshStandardMaterial color={theme.ground} />
      </mesh>
      <mesh receiveShadow position={[0, -0.11, -0.2]}>
        <boxGeometry args={[width, 0.2, 3.6]} />
        <meshStandardMaterial map={floorTex} />
      </mesh>
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.215, -0.2]}
      >
        <planeGeometry args={[width + 3, 7]} />
        <shadowMaterial opacity={0.18} />
      </mesh>
    </group>
  );
}

/* ------------------------------ main component ---------------------------- */

export function MemoryGameView({
  game,
  onSuccess,
}: {
  game: MemoryGame;
  onSuccess: () => void;
}) {
  const t = useTranslations("game");
  // `at: 0` = "long expired" placeholder for prerender; the mount effect
  // starts the real demo.
  const [phase, setPhase] = useState<Phase>({ kind: "demo", at: 0 });
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "win">("idle");
  const [lastTap, setLastTap] = useState<{ pad: number; at: number } | null>(
    null
  );
  const [burst, setBurst] = useState<Burst | null>(null);
  const mounted = useCanvasReady();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function startDemo() {
    setProgress(0);
    setLastTap(null);
    setPhase({ kind: "demo", at: performance.now() });
    timers.current.push(
      setTimeout(
        () => setPhase({ kind: "input", at: performance.now() }),
        demoTotalS(game.sequence.length) * 1000
      )
    );
  }

  useEffect(() => {
    startDemo();
    const timersAtMount = timers.current;
    return () => timersAtMount.forEach(clearTimeout);
    // mount only: the game data never changes within one page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function tapPad(index: number) {
    if (status === "win" || phase.kind !== "input") return;
    const now = performance.now();
    setLastTap({ pad: index, at: now });
    if (game.sequence[progress] === index) {
      const next = progress + 1;
      setProgress(next);
      if (next === game.sequence.length) {
        setPhase({ kind: "won", at: now });
        setBurst({ id: now, pos: [0, 0.9, 0], at: now });
        timers.current.push(
          setTimeout(() => {
            setStatus("win");
            onSuccess();
          }, WIN_S * 1000)
        );
      }
    } else {
      setPhase({ kind: "wrong", at: now, pad: index });
      timers.current.push(setTimeout(() => startDemo(), WRONG_S * 1000));
    }
  }

  const themeIndex = Math.max(0, MEMORY_GAME_IDS.indexOf(game.id));
  const theme = WORLD_THEMES[themeIndex % WORLD_THEMES.length];
  const padCount = game.pads.length;
  const cameraZ = Math.max(4.8, padCount * 1.15 + 1.8);
  const cameraPosition: [number, number, number] = [0, cameraZ * 0.66, cameraZ];

  const hint =
    phase.kind === "won" || status === "win"
      ? "🎉"
      : phase.kind === "input"
        ? `👉 ${t("yourTurn")}`
        : phase.kind === "wrong"
          ? `🙈 ${t("watchAgain")}`
          : `👀 ${t("watch")}`;

  return (
    <div className="space-y-4">
      {/* 3D stage */}
      <div
        className={`relative h-[clamp(12rem,38dvh,18rem)] w-full overflow-hidden rounded-2xl border-4 ${theme.frame}`}
      >
        {mounted && (
          <Canvas
            shadows="percentage"
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true }}
            camera={{ position: cameraPosition, fov: 42 }}
            onCreated={({ camera }) => camera.lookAt(0, 0.35, -0.2)}
          >
            <ambientLight intensity={0.8} />
            <directionalLight
              position={[4, 8, 5]}
              intensity={1.1}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-left={-padCount - 2}
              shadow-camera-right={padCount + 2}
              shadow-camera-top={padCount + 2}
              shadow-camera-bottom={-padCount - 2}
            />
            <SkySprites
              theme={theme}
              width={padCount * PAD_GAP}
              depth={3.4}
            />
            <Decorations
              theme={theme}
              width={padCount * PAD_GAP + 0.8}
              depth={3}
            />
            <Stage padCount={padCount} theme={theme} />
            <RoboBuddy
              padCount={padCount}
              sequence={game.sequence}
              phase={phase}
              stage={themeIndex}
            />
            {game.pads.map((pad, i) => (
              <Pad
                key={i}
                pad={pad}
                index={i}
                count={padCount}
                sequence={game.sequence}
                phase={phase}
                lastTap={lastTap}
              />
            ))}
            <Confetti burst={burst} />
          </Canvas>
        )}
      </div>

      {/* wordless status: emoji hint + progress dots */}
      <p className="text-center font-display text-lg font-semibold">{hint}</p>
      <div className="flex justify-center gap-1.5">
        {game.sequence.map((_, i) => (
          <span
            key={i}
            className={`h-3 w-3 rounded-full transition-colors ${
              i < progress ? "bg-emerald-400" : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      {/* big tappable pads mirroring the 3D drums */}
      <div className="flex items-center justify-center gap-4">
        {game.pads.map((pad, i) => (
          <button
            key={i}
            onClick={() => tapPad(i)}
            disabled={phase.kind !== "input" || status === "win"}
            aria-label={pad.emoji}
            className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white text-4xl shadow-lg transition hover:-translate-y-1 active:scale-90 disabled:opacity-50 disabled:hover:translate-y-0 sm:h-24 sm:w-24 sm:text-5xl"
            style={{ backgroundColor: pad.color }}
          >
            {pad.emoji}
          </button>
        ))}
        <button
          onClick={() => phase.kind === "input" && startDemo()}
          disabled={phase.kind !== "input" || status === "win"}
          aria-label={t("watchAgain")}
          title={t("watchAgain")}
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-xl shadow-sm transition hover:border-brand-light active:scale-90 disabled:opacity-40"
        >
          🔁
        </button>
      </div>
    </div>
  );
}
