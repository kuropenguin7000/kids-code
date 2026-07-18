"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { allGames, type PatternGame } from "@/lib/curriculum";
import {
  Confetti,
  Decorations,
  SkySprites,
  WORLD_THEMES,
  getPatternTexture,
  getTextTexture,
  useCanvasReady,
  type Burst,
  type WorldTheme,
} from "./three-shared";

/** Same treatment as the robot level: one world theme per pattern game. */
const PATTERN_GAME_IDS = allGames
  .filter((g) => g.kind === "pattern")
  .map((g) => g.id);

/**
 * 3D "pattern parade": the sequence marches along a row of pedestals, the
 * missing spot shows a pulsing "?". Picking an answer drops it from the sky —
 * a bouncy landing + confetti + a wave through the parade when it's right, a
 * shake-and-tumble when it's wrong. As in the robot engine, outcomes are
 * committed by wall-clock timers; the scene only draws poses for "now".
 */

type Phase = { kind: "correct" | "wrong"; emoji: string; at: number } | null;

const DROP_S = 0.5; // fall from the sky into the slot
const BOUNCE_S = 0.45; // landing bounce
const WAVE_STAGGER = 0.08; // per-item delay of the celebration wave
const WAVE_S = 0.35; // one item's wave hop
const WIN_REST_S = 0.9; // pause after the wave before committing the win
const WRONG_DROP_S = 0.3;
const SHAKE_S = 0.5;
const FALL_S = 0.45;

const ITEM_Y = 0.75;

/* ------------------------------- 3D pieces ------------------------------- */

/** One parade member: bobbing emoji sprite that joins the win wave. */
function ItemSprite({
  emoji,
  x,
  index,
  scale,
  celebrateAt,
}: {
  emoji: string;
  x: number;
  index: number;
  scale: number;
  celebrateAt: number | null;
}) {
  const sprite = useRef<THREE.Sprite>(null);
  const texture = getTextTexture(emoji);

  useFrame(({ clock }) => {
    const s = sprite.current;
    if (!s) return;
    let y = ITEM_Y + Math.sin(clock.elapsedTime * 2 + index) * 0.05;
    if (celebrateAt !== null) {
      const t = (performance.now() - celebrateAt) / 1000;
      const start = DROP_S + BOUNCE_S + index * WAVE_STAGGER;
      const p = (t - start) / WAVE_S;
      if (p > 0 && p < 1) y += Math.sin(p * Math.PI) * 0.32;
    }
    s.position.set(x, y, 0);
  });

  return (
    <sprite ref={sprite} position={[x, ITEM_Y, 0]} scale={[scale, scale, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}

/** The pulsing "?" over the empty slot; hides while a reveal plays. */
function QuestionMark({
  x,
  scale,
  hidden,
}: {
  x: number;
  scale: number;
  hidden: boolean;
}) {
  const sprite = useRef<THREE.Sprite>(null);
  const texture = getTextTexture("?", { color: "#f59e0b" });

  useFrame(({ clock }) => {
    const s = sprite.current;
    if (!s) return;
    s.visible = !hidden;
    if (hidden) return;
    const pulse = Math.sin(clock.elapsedTime * 3);
    const k = scale * (1 + pulse * 0.09);
    s.scale.set(k, k, 1);
    s.position.set(x, ITEM_Y + 0.05 + pulse * 0.04, 0);
    (s.material as THREE.SpriteMaterial).opacity = 0.75 + pulse * 0.25;
  });

  return (
    <sprite ref={sprite} position={[x, ITEM_Y, 0]} scale={[scale, scale, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}

/** The picked answer flying in: bouncy landing (right) or shake-and-tumble
 *  (wrong). Remounted per attempt via key={phase.at}. */
function RevealSprite({
  x,
  scale,
  phase,
}: {
  x: number;
  scale: number;
  phase: NonNullable<Phase>;
}) {
  const sprite = useRef<THREE.Sprite>(null);
  const texture = getTextTexture(phase.emoji);

  useFrame(() => {
    const s = sprite.current;
    if (!s) return;
    const material = s.material as THREE.SpriteMaterial;
    const t = (performance.now() - phase.at) / 1000;

    if (phase.kind === "correct") {
      material.opacity = 1;
      if (t < DROP_S) {
        const p = t / DROP_S;
        s.position.set(x, ITEM_Y + (1 - p * p) * 2.2, 0);
      } else if (t < DROP_S + BOUNCE_S) {
        const p = (t - DROP_S) / BOUNCE_S;
        s.position.set(x, ITEM_Y + Math.abs(Math.sin(p * Math.PI * 2)) * 0.24 * (1 - p), 0);
      } else {
        // rest in the slot like the rest of the parade
        s.position.set(x, ITEM_Y + Math.sin(t * 2) * 0.05, 0);
      }
      return;
    }

    // wrong pick: quick drop, headshake "no", tumble away and fade
    if (t < WRONG_DROP_S) {
      const p = t / WRONG_DROP_S;
      material.opacity = 1;
      s.position.set(x, ITEM_Y + (1 - p * p) * 2.2, 0);
    } else if (t < WRONG_DROP_S + SHAKE_S) {
      const p = (t - WRONG_DROP_S) / SHAKE_S;
      material.opacity = 1;
      s.position.set(x + Math.sin(p * Math.PI * 6) * 0.11 * (1 - p), ITEM_Y, 0);
    } else {
      const p = Math.min((t - WRONG_DROP_S - SHAKE_S) / FALL_S, 1);
      material.opacity = 1 - p;
      material.rotation = p * 1.8;
      s.position.set(x + p * 0.35, ITEM_Y - p * p * 1.4, 0);
    }
  });

  return (
    <sprite ref={sprite} position={[x, ITEM_Y + 2.2, 0]} scale={[scale, scale, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}

/** Themed floor + one pedestal per slot (gold for the answer slot),
 *  all sitting on the world's ground disc. */
function Stage({
  slots,
  spacing,
  xAt,
  theme,
}: {
  slots: number;
  spacing: number;
  xAt: (i: number) => number;
  theme: WorldTheme;
}) {
  const floorTex = getPatternTexture(
    theme.tilePattern,
    theme.tileA,
    theme.tileAccent
  );
  const width = slots * spacing + 1.3;
  return (
    <group>
      {/* the world floor the stage sits on */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.26, 0]}>
        <circleGeometry args={[width / 2 + 2.2, 48]} />
        <meshStandardMaterial color={theme.ground} />
      </mesh>
      <mesh receiveShadow position={[0, -0.11, 0]}>
        <boxGeometry args={[width, 0.2, 2.1]} />
        <meshStandardMaterial map={floorTex} />
      </mesh>
      {Array.from({ length: slots }, (_, i) => {
        const isAnswer = i === slots - 1;
        const color = isAnswer
          ? theme.goalTile
          : i % 2 === 0
            ? theme.tileB
            : theme.wall;
        return (
          <mesh key={i} castShadow receiveShadow position={[xAt(i), 0.11, 0]}>
            <cylinderGeometry args={[0.3, 0.36, 0.22, 24]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
      })}
      {/* soft shadow catcher around the stage */}
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.215, 0]}
      >
        <planeGeometry args={[slots * spacing + 4, 6]} />
        <shadowMaterial opacity={0.18} />
      </mesh>
    </group>
  );
}

/* ------------------------------ main component ---------------------------- */

export function PatternGameView({
  game,
  onSuccess,
}: {
  game: PatternGame;
  onSuccess: () => void;
}) {
  const t = useTranslations("game");
  const [phase, setPhase] = useState<Phase>(null);
  const [status, setStatus] = useState<"idle" | "wrong" | "win">("idle");
  const [busy, setBusy] = useState(false);
  const [lastPick, setLastPick] = useState<string | null>(null);
  const [burst, setBurst] = useState<Burst | null>(null);
  const mounted = useCanvasReady();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timersAtMount = timers.current;
    return () => timersAtMount.forEach(clearTimeout);
  }, []);

  const themeIndex = Math.max(0, PATTERN_GAME_IDS.indexOf(game.id));
  const theme = WORLD_THEMES[themeIndex % WORLD_THEMES.length];

  // Layout: sequence slots + 1 answer slot in a row, squeezed a little when
  // the sequence is long so it still fits phone-width framing.
  const slots = game.sequence.length + 1;
  const spacing = Math.min(1, 6.5 / slots);
  const xAt = (i: number) => (i - (slots - 1) / 2) * spacing;
  const slotX = xAt(slots - 1);
  const itemScale = Math.min(0.82, spacing * 0.85);

  const cameraZ = Math.max(4.8, slots * spacing * 0.6 + 2.6);
  const cameraPosition: [number, number, number] = [0.6, cameraZ * 0.62, cameraZ];

  function pick(option: string) {
    if (busy || status === "win") return;
    const at = performance.now();
    setLastPick(option);
    setBusy(true);
    setStatus("idle");
    if (option === game.answer) {
      setPhase({ kind: "correct", emoji: option, at });
      timers.current.push(
        setTimeout(
          () => setBurst({ id: at, pos: [slotX, 0.7, 0], at: performance.now() }),
          DROP_S * 1000
        )
      );
      timers.current.push(
        setTimeout(
          () => {
            setBusy(false);
            setStatus("win");
            onSuccess();
          },
          (DROP_S + BOUNCE_S + WIN_REST_S) * 1000
        )
      );
    } else {
      setPhase({ kind: "wrong", emoji: option, at });
      timers.current.push(
        setTimeout(
          () => {
            setPhase(null);
            setBusy(false);
            setStatus("wrong");
          },
          (WRONG_DROP_S + SHAKE_S + FALL_S + 0.15) * 1000
        )
      );
    }
  }

  return (
    <div className="space-y-4">
      {/* 3D parade */}
      <div
        className={`relative h-[clamp(12rem,40dvh,18rem)] w-full overflow-hidden rounded-2xl border-4 ${theme.frame}`}
      >
        {mounted && (
          <Canvas
            shadows
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true }}
            camera={{ position: cameraPosition, fov: 42 }}
            onCreated={({ camera }) => camera.lookAt(0, 0.3, 0)}
          >
            <ambientLight intensity={0.8} />
            <directionalLight
              position={[4, 8, 5]}
              intensity={1.1}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-left={-slots}
              shadow-camera-right={slots}
              shadow-camera-top={slots}
              shadow-camera-bottom={-slots}
            />
            <SkySprites
              theme={theme}
              width={slots * spacing}
              depth={2}
            />
            <Decorations
              theme={theme}
              width={slots * spacing + 0.8}
              depth={1.8}
            />
            <Stage slots={slots} spacing={spacing} xAt={xAt} theme={theme} />
            {game.sequence.map((emoji, i) => (
              <ItemSprite
                key={i}
                emoji={emoji}
                x={xAt(i)}
                index={i}
                scale={itemScale}
                celebrateAt={
                  phase?.kind === "correct" ? phase.at : null
                }
              />
            ))}
            <QuestionMark x={slotX} scale={itemScale} hidden={phase !== null} />
            {phase && (
              <RevealSprite
                key={phase.at}
                x={slotX}
                scale={itemScale}
                phase={phase}
              />
            )}
            <Confetti burst={burst} />
          </Canvas>
        )}
      </div>

      <p className="text-center font-display text-lg font-semibold">
        {t("whatsNext")}
      </p>

      <div className="flex justify-center gap-4">
        {game.options.map((option) => (
          <button
            key={option}
            onClick={() => pick(option)}
            disabled={busy || status === "win"}
            className={`flex h-16 w-16 items-center justify-center rounded-2xl border-4 text-4xl shadow-sm transition active:scale-90 sm:h-20 sm:w-20 sm:text-5xl ${
              status === "win" && option === game.answer
                ? "border-emerald-400 bg-emerald-50"
                : status === "wrong" && lastPick === option
                  ? "border-rose-300 bg-rose-50"
                  : "border-violet-200 bg-white hover:-translate-y-1 hover:border-brand-light hover:shadow-md disabled:opacity-60"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {status === "wrong" && (
        <p className="text-center text-sm font-bold text-rose-600">
          {t("tryAgain")}
        </p>
      )}
    </div>
  );
}
