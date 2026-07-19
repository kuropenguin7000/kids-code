"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { allGames, type SortGame } from "@/lib/curriculum";
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

/** Same treatment as the other levels: one world theme per sort game, and
 *  Robo the waiter evolves along with it. */
const SORT_GAME_IDS = allGames
  .filter((g) => g.kind === "sort")
  .map((g) => g.id);

/**
 * "Feed the Monsters" — a snack pops up and the kid taps the monster whose
 * sign matches it (IF it's a fruit THEN the fruit monster eats it: a first
 * taste of conditionals). The snack arcs into the chosen mouth; the right
 * monster gulps it with a happy bounce, the wrong one spits it straight back
 * with a head-shake — no penalty, the same snack is simply served again.
 * Zero-reading design: the signs above the monsters ARE the rule.
 *
 * As with the other 3D engines, wall-clock timers commit every phase change;
 * the scene renders whatever pose belongs to "now". Input is plain HTML
 * monster buttons under the canvas (like the memory game's pads).
 */

type Phase =
  | { kind: "pick" }
  | { kind: "fly"; target: number; at: number }
  | { kind: "chomp"; target: number; at: number }
  | { kind: "spit"; target: number; at: number }
  | { kind: "won"; at: number };

const FLY_S = 0.75; // snack's arc from the serving spot into the mouth
const CHOMP_S = 0.55; // gulp + happy bounce before the next snack
const SPIT_S = 0.85; // snack flies back + head-shake
const WIN_S = 2.2; // celebration before the win is committed

const MONSTER_GAP = 1.9;
const MONSTER_Z = -0.85;
const SERVE_POS: [number, number, number] = [0, 0.62, 1.25];

function monsterX(index: number, count: number) {
  return (index - (count - 1) / 2) * MONSTER_GAP;
}

function mouthPos(index: number, count: number): [number, number, number] {
  return [monsterX(index, count), 0.58, MONSTER_Z + 0.5];
}

/* ------------------------------- 3D pieces ------------------------------- */

/** One googly-eyed monster built from primitives: idle bob, mouth that opens
 *  wide as a snack flies in, happy gulp-bounce, disgusted head-shake, and a
 *  staggered victory hop. Its food sign floats above its head. */
function Monster({
  index,
  count,
  color,
  sign,
  phase,
}: {
  index: number;
  count: number;
  color: string;
  sign: string;
  phase: Phase;
}) {
  const group = useRef<THREE.Group>(null);
  const mouth = useRef<THREE.Mesh>(null);
  const signRef = useRef<THREE.Sprite>(null);
  const x = monsterX(index, count);
  const involved =
    (phase.kind === "fly" || phase.kind === "chomp" || phase.kind === "spit") &&
    phase.target === index;

  useFrame(({ clock }) => {
    const g = group.current;
    const m = mouth.current;
    if (!g || !m) return;
    const now = performance.now();

    let y = Math.abs(Math.sin(clock.elapsedTime * 2 + index * 1.4)) * 0.04;
    let yaw = 0;
    let squashY = 1;
    let open = 0.12 + Math.sin(clock.elapsedTime * 1.6 + index) * 0.06; // idle breathing

    if (phase.kind === "fly" && involved) {
      // mouth opens wide as the snack approaches
      const u = Math.min(1, (now - phase.at) / (FLY_S * 1000));
      open = 0.15 + u * 0.85;
    } else if (phase.kind === "chomp" && involved) {
      const u = Math.min(1, (now - phase.at) / (CHOMP_S * 1000));
      open = Math.max(0, 1 - u * 3); // snap shut
      squashY = 1 - Math.sin(u * Math.PI) * 0.18; // happy gulp squash
      y += Math.max(0, Math.sin(u * Math.PI * 2)) * 0.14; // little hop
    } else if (phase.kind === "spit" && involved) {
      const u = Math.min(1, (now - phase.at) / (SPIT_S * 1000));
      open = u < 0.25 ? 0.9 : Math.max(0.1, 0.9 - (u - 0.25) * 2);
      const decay = Math.max(0, 1 - u / 0.8);
      yaw = Math.sin(u * 22) * 0.35 * decay; // "yuck, no no"
    } else if (phase.kind === "won") {
      const t = (now - phase.at) / 1000;
      y = Math.abs(Math.sin(t * Math.PI * 3 - index * 0.9)) * 0.3;
      open = 0.5 + Math.sin(t * 8 + index) * 0.3; // cheering
    }

    g.position.set(x, y, MONSTER_Z);
    g.rotation.y = yaw;
    g.scale.set(1, squashY, 1);
    m.scale.set(1, Math.max(0.05, open), 1);
    if (signRef.current) {
      signRef.current.position.y =
        1.42 + Math.sin(clock.elapsedTime * 2.2 + index * 2) * 0.05;
    }
  });

  return (
    <group ref={group} position={[x, 0, MONSTER_Z]}>
      {/* body */}
      <mesh castShadow position={[0, 0.55, 0]} scale={[1, 1.08, 0.9]}>
        <sphereGeometry args={[0.48, 24, 20]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>
      {/* belly patch */}
      <mesh position={[0, 0.42, 0.36]} scale={[0.62, 0.5, 0.3]}>
        <sphereGeometry args={[0.42, 16, 14]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.9} />
      </mesh>
      {/* mouth: a dark cavity that scales open (pivot at its center) */}
      <mesh ref={mouth} position={[0, 0.58, 0.42]}>
        <sphereGeometry args={[0.2, 16, 12]} />
        <meshStandardMaterial color="#1e1b4b" roughness={1} />
      </mesh>
      {/* googly eyes */}
      {[-0.17, 0.17].map((ex) => (
        <group key={ex}>
          <mesh position={[ex, 0.92, 0.34]}>
            <sphereGeometry args={[0.11, 14, 12]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[ex, 0.92, 0.435]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
      ))}
      {/* stubby horns */}
      {[-0.22, 0.22].map((hx) => (
        <mesh key={hx} castShadow position={[hx, 1.12, 0]} rotation={[0, 0, hx > 0 ? -0.35 : 0.35]}>
          <coneGeometry args={[0.07, 0.18, 10]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
      ))}
      {/* feet */}
      {[-0.2, 0.2].map((fx) => (
        <mesh key={fx} castShadow position={[fx, 0.07, 0.12]}>
          <sphereGeometry args={[0.11, 12, 10]} />
          <meshStandardMaterial color={color} roughness={0.75} />
        </mesh>
      ))}
      {/* the food sign floating overhead */}
      <sprite ref={signRef} position={[0, 1.42, 0]} scale={[0.52, 0.52, 1]}>
        <spriteMaterial map={getTextTexture(sign)} transparent depthWrite={false} />
      </sprite>
    </group>
  );
}

/** The current snack: bobs at the serving spot, arcs into the tapped mouth,
 *  shrinks when gulped, and arcs back out when the wrong monster spits it. */
function Snack({
  emoji,
  count,
  phase,
}: {
  emoji: string;
  count: number;
  phase: Phase;
}) {
  const sprite = useRef<THREE.Sprite>(null);

  useFrame(({ clock }) => {
    const s = sprite.current;
    if (!s) return;
    const now = performance.now();
    let [px, py, pz] = SERVE_POS;
    let scale = 0.62;

    if (phase.kind === "pick") {
      py += Math.sin(clock.elapsedTime * 3) * 0.07;
      scale = 0.62 + Math.sin(clock.elapsedTime * 3) * 0.03;
    } else if (phase.kind === "fly" && "target" in phase) {
      const u = Math.min(1, (now - phase.at) / (FLY_S * 1000));
      const [mx, my, mz] = mouthPos(phase.target, count);
      px = SERVE_POS[0] + (mx - SERVE_POS[0]) * u;
      py = SERVE_POS[1] + (my - SERVE_POS[1]) * u + Math.sin(u * Math.PI) * 0.75;
      pz = SERVE_POS[2] + (mz - SERVE_POS[2]) * u;
    } else if (phase.kind === "chomp") {
      const u = Math.min(1, (now - phase.at) / (CHOMP_S * 1000));
      const [mx, my, mz] = mouthPos(phase.target, count);
      [px, py, pz] = [mx, my, mz];
      scale = Math.max(0.001, 0.62 * (1 - u * 4)); // gulped!
    } else if (phase.kind === "spit") {
      const u = Math.min(1, (now - phase.at) / (SPIT_S * 1000));
      const [mx, my, mz] = mouthPos(phase.target, count);
      px = mx + (SERVE_POS[0] - mx) * u;
      py = my + (SERVE_POS[1] - my) * u + Math.sin(u * Math.PI) * 0.9;
      pz = mz + (SERVE_POS[2] - mz) * u;
    } else {
      scale = 0.001; // won: everything is eaten
    }

    s.position.set(px, py, pz);
    s.scale.set(scale, scale, 1);
  });

  return (
    <sprite ref={sprite} position={SERVE_POS} scale={[0.62, 0.62, 1]}>
      <spriteMaterial map={getTextTexture(emoji)} transparent depthWrite={false} />
    </sprite>
  );
}

/** Robo the waiter, standing by the serving spot: watches the snack, shakes
 *  its head when a monster spits, spins and hops for the feast finale. */
function RoboWaiter({
  count,
  phase,
  stage,
}: {
  count: number;
  phase: Phase;
  stage: number;
}) {
  const group = useRef<THREE.Group>(null);
  // beside the serving spot, count-independent so it stays in frame on mobile
  const HOME: [number, number, number] = [-1.75, 0, 0.95];

  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const now = performance.now();

    if (phase.kind === "won") {
      const t = (now - phase.at) / 1000;
      g.rotation.y += delta * 7;
      g.position.set(HOME[0], Math.abs(Math.sin(t * Math.PI * 3)) * 0.35, HOME[2]);
      return;
    }

    let targetYaw = Math.atan2(SERVE_POS[0] - HOME[0], SERVE_POS[2] - HOME[2]);
    if (phase.kind === "fly" || phase.kind === "chomp") {
      const [mx, , mz] = mouthPos(phase.target, count);
      targetYaw = Math.atan2(mx - HOME[0], mz - HOME[2]);
    } else if (phase.kind === "spit") {
      const t = (now - phase.at) / 1000;
      const decay = Math.max(0, 1 - t / (SPIT_S * 0.9));
      targetYaw += Math.sin(t * 14) * 0.4 * decay;
    }

    g.rotation.y = lerpAngle(g.rotation.y, targetYaw, Math.min(1, delta * 10));
    g.position.set(HOME[0], Math.abs(Math.sin(clock.elapsedTime * 2)) * 0.03, HOME[2]);
  });

  return (
    <group ref={group} position={HOME} scale={1.05}>
      <RobotMeshes stage={stage} />
    </group>
  );
}

/** Themed picnic ground on the world's ground disc + shadow catcher. */
function Stage({ count, theme }: { count: number; theme: WorldTheme }) {
  const width = count * MONSTER_GAP + 2;
  const floorTex = getPatternTexture(theme.tilePattern, theme.tileA, theme.tileAccent);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.26, 0]}>
        <circleGeometry args={[width / 2 + 2, 48]} />
        <meshStandardMaterial color={theme.ground} />
      </mesh>
      <mesh receiveShadow position={[0, -0.11, 0.15]}>
        <boxGeometry args={[width, 0.2, 4.2]} />
        <meshStandardMaterial map={floorTex} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.215, 0]}>
        <planeGeometry args={[width + 3.5, 8]} />
        <shadowMaterial opacity={0.18} />
      </mesh>
    </group>
  );
}

/* ------------------------------ main component ---------------------------- */

export function SortGameView({
  game,
  onSuccess,
}: {
  game: SortGame;
  onSuccess: () => void;
}) {
  const t = useTranslations("game");
  const [phase, setPhase] = useState<Phase>({ kind: "pick" });
  const [progress, setProgress] = useState(0);
  const [burst, setBurst] = useState<Burst | null>(null);
  const mounted = useCanvasReady();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timersAtMount = timers.current;
    return () => timersAtMount.forEach(clearTimeout);
  }, []);

  const count = game.monsters.length;
  const total = game.items.length;
  const item = game.items[Math.min(progress, total - 1)];

  function tapMonster(index: number) {
    if (phase.kind !== "pick") return;
    const now = performance.now();
    const correct = game.items[progress].eats === index;
    setPhase({ kind: "fly", target: index, at: now });
    timers.current.push(
      setTimeout(() => {
        const arriveAt = performance.now();
        if (correct) {
          setPhase({ kind: "chomp", target: index, at: arriveAt });
          const nextProgress = progress + 1;
          timers.current.push(
            setTimeout(() => {
              setProgress(nextProgress);
              if (nextProgress === total) {
                const winAt = performance.now();
                setPhase({ kind: "won", at: winAt });
                setBurst({ id: winAt, pos: [0, 0.9, 0], at: winAt });
                timers.current.push(setTimeout(() => onSuccess(), WIN_S * 1000));
              } else {
                setPhase({ kind: "pick" });
              }
            }, CHOMP_S * 1000)
          );
        } else {
          setPhase({ kind: "spit", target: index, at: arriveAt });
          timers.current.push(
            setTimeout(() => setPhase({ kind: "pick" }), SPIT_S * 1000)
          );
        }
      }, FLY_S * 1000)
    );
  }

  const themeIndex = Math.max(0, SORT_GAME_IDS.indexOf(game.id));
  const theme = WORLD_THEMES[themeIndex % WORLD_THEMES.length];
  const cameraZ = Math.max(5.4, count * 1.35 + 2.2);
  const cameraPosition: [number, number, number] = [0, cameraZ * 0.6, cameraZ];

  const hint =
    phase.kind === "won"
      ? "🎉"
      : phase.kind === "spit"
        ? `🙈 ${t("wrongMonster")}`
        : `${item.emoji} ➜ ❓ ${t("whoEats")}`;

  return (
    <div className="space-y-4">
      {/* 3D picnic */}
      <div
        className={`relative h-[clamp(12rem,38dvh,18rem)] w-full overflow-hidden rounded-2xl border-4 ${theme.frame}`}
      >
        {mounted && (
          <Canvas
            shadows="percentage"
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true }}
            camera={{ position: cameraPosition, fov: 42 }}
            onCreated={({ camera }) => camera.lookAt(0, 0.45, 0)}
          >
            <ambientLight intensity={0.8} />
            <directionalLight
              position={[4, 8, 5]}
              intensity={1.1}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-left={-6}
              shadow-camera-right={6}
              shadow-camera-top={6}
              shadow-camera-bottom={-6}
            />
            <SkySprites theme={theme} width={count * MONSTER_GAP} depth={3.8} />
            <Decorations theme={theme} width={count * MONSTER_GAP + 1} depth={3.4} />
            <Stage count={count} theme={theme} />
            <RoboWaiter count={count} phase={phase} stage={themeIndex} />
            {game.monsters.map((monster, i) => (
              <Monster
                key={i}
                index={i}
                count={count}
                color={monster.color}
                sign={monster.sign}
                phase={phase}
              />
            ))}
            <Snack emoji={item.emoji} count={count} phase={phase} />
            <Confetti burst={burst} />
          </Canvas>
        )}
      </div>

      {/* wordless status: emoji hint + progress dots */}
      <p className="text-center font-display text-lg font-semibold">{hint}</p>
      <div className="flex justify-center gap-1.5">
        {game.items.map((_, i) => (
          <span
            key={i}
            className={`h-3 w-3 rounded-full transition-colors ${
              i < progress ? "bg-emerald-400" : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      {/* big monster buttons mirroring the 3D monsters */}
      <div className="flex items-center justify-center gap-4">
        {game.monsters.map((monster, i) => (
          <button
            key={i}
            data-monster={i + 1}
            onClick={() => tapMonster(i)}
            disabled={phase.kind !== "pick"}
            aria-label={monster.sign}
            className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white text-4xl shadow-lg transition hover:-translate-y-1 active:scale-90 disabled:opacity-50 disabled:hover:translate-y-0 sm:h-24 sm:w-24 sm:text-5xl"
            style={{ backgroundColor: monster.color }}
          >
            {monster.sign}
          </button>
        ))}
      </div>
    </div>
  );
}
