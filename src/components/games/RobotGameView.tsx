"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { RobotGame } from "@/lib/curriculum";
import {
  Confetti,
  RobotMeshes,
  lerpAngle,
  useCanvasReady,
  type Burst,
} from "./three-shared";

type Block = { dx: number; dy: number; times: number };
type Outcome = "win" | "crash" | "miss";

/** One pressed-Go attempt: the cells visited plus how it ends. */
type Run = {
  id: number;
  /** performance.now() when Go was pressed — poses derive from wall time. */
  startedAt: number;
  path: { x: number; y: number }[];
  outcome: Outcome;
  /** Direction of the step that failed (drives the crash bump animation). */
  bump: { dx: number; dy: number } | null;
};

/**
 * Timing model: the OUTCOME is committed by wall-clock timers in the React
 * layer (works even when rAF is throttled in background tabs); the 3D scene
 * only *renders* the pose for the current wall-time, so a dropped frame can
 * never wedge the game.
 */
const STEP_SECONDS = 0.42; // per cell hop
const CELEBRATE_S = 1.5;
const BUMP_S = 0.75;
const WOBBLE_S = 0.9;

function blockLabel(block: Block) {
  const arrow =
    block.dx === 1 ? "➡️" : block.dx === -1 ? "⬅️" : block.dy === -1 ? "⬆️" : "⬇️";
  return block.times > 1 ? `${arrow} ×${block.times}` : arrow;
}

/** Grid cell → world position (board centered on the origin). */
function toWorld(game: RobotGame, x: number, y: number): [number, number, number] {
  return [x - (game.cols - 1) / 2, 0, y - (game.rows - 1) / 2];
}

/** Pure re-implementation of the walk: same rules as the old 2D engine. */
function simulate(game: RobotGame, program: Block[]): Omit<Run, "id" | "startedAt"> {
  const isWall = (x: number, y: number) =>
    game.walls.some((w) => w.x === x && w.y === y);
  const path = [{ ...game.start }];
  let cur = { ...game.start };
  for (const block of program) {
    for (let i = 0; i < block.times; i++) {
      const next = { x: cur.x + block.dx, y: cur.y + block.dy };
      const outside =
        next.x < 0 || next.y < 0 || next.x >= game.cols || next.y >= game.rows;
      if (outside || isWall(next.x, next.y)) {
        return { path, outcome: "crash", bump: { dx: block.dx, dy: block.dy } };
      }
      cur = next;
      path.push(cur);
    }
  }
  const win = cur.x === game.goal.x && cur.y === game.goal.y;
  return { path, outcome: win ? "win" : "miss", bump: null };
}

/* ------------------------------- 3D pieces ------------------------------- */

/** Checkerboard tiles + crate walls + a soft shadow-catcher plane. */
function Board({ game }: { game: RobotGame }) {
  const tiles = [];
  for (let y = 0; y < game.rows; y++) {
    for (let x = 0; x < game.cols; x++) {
      const [wx, , wz] = toWorld(game, x, y);
      const isGoal = game.goal.x === x && game.goal.y === y;
      const color = isGoal ? "#fde047" : (x + y) % 2 === 0 ? "#f3e8ff" : "#e9d5ff";
      tiles.push(
        <mesh key={`t-${x}-${y}`} receiveShadow position={[wx, -0.11, wz]}>
          <boxGeometry args={[0.94, 0.22, 0.94]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
    }
  }
  return (
    <group>
      {tiles}
      {game.walls.map((w) => {
        const [wx, , wz] = toWorld(game, w.x, w.y);
        return (
          <group key={`w-${w.x}-${w.y}`}>
            <mesh castShadow receiveShadow position={[wx, 0.3, wz]}>
              <boxGeometry args={[0.88, 0.6, 0.88]} />
              <meshStandardMaterial color="#c9884b" />
            </mesh>
            {/* crate lid to catch the light */}
            <mesh position={[wx, 0.61, wz]}>
              <boxGeometry args={[0.92, 0.04, 0.92]} />
              <meshStandardMaterial color="#a9713a" />
            </mesh>
          </group>
        );
      })}
      {/* soft shadow catcher just around the board */}
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.221, 0]}
      >
        <planeGeometry args={[game.cols + 2.5, game.rows + 2.5]} />
        <shadowMaterial opacity={0.18} />
      </mesh>
    </group>
  );
}

/** Spinning, bobbing goal star; pops away when collected. */
function Star({
  position,
  collected,
}: {
  position: [number, number, number];
  collected: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const scale = useRef(1);
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const points = 5;
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? 0.32 : 0.14;
      const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.1,
      bevelEnabled: true,
      bevelSize: 0.02,
      bevelThickness: 0.02,
      bevelSegments: 2,
    });
    geo.translate(0, 0, -0.05);
    return geo;
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * (collected ? 9 : 1.6);
    g.position.y = 0.62 + Math.sin(state.clock.elapsedTime * 2) * 0.08;
    scale.current = THREE.MathUtils.lerp(
      scale.current,
      collected ? 0 : 1,
      Math.min(1, delta * 6)
    );
    g.scale.setScalar(Math.max(scale.current, 0.0001));
  });

  return (
    <group ref={group} position={position}>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={0.45}
        />
      </mesh>
    </group>
  );
}

/**
 * The hero: a little voxel robot. Every pose is a pure function of wall time
 * (run.startedAt), so the scene stays correct however few frames render.
 */
function Robot({ game, run }: { game: RobotGame; run: Run | null }) {
  const group = useRef<THREE.Group>(null);
  const idleT = useRef(0);
  const [homeX, , homeZ] = toWorld(game, game.start.x, game.start.y);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;

    if (!run) {
      // waiting on the start pad with a tiny idle bounce
      idleT.current += delta;
      g.position.set(homeX, Math.abs(Math.sin(idleT.current * 2)) * 0.03, homeZ);
      g.rotation.z = 0;
      g.rotation.y = lerpAngle(g.rotation.y, 0, Math.min(1, delta * 8));
      return;
    }

    const last = run.path.length - 1;
    const elapsed = (performance.now() - run.startedAt) / 1000;
    const cells = elapsed / STEP_SECONDS;

    if (last > 0 && cells < last) {
      // hop from cell to cell with a little jump arc, facing the way we go
      const i = Math.min(Math.floor(cells), last - 1);
      const f = cells - i;
      const [ax, , az] = toWorld(game, run.path[i].x, run.path[i].y);
      const [bx, , bz] = toWorld(game, run.path[i + 1].x, run.path[i + 1].y);
      g.position.set(
        ax + (bx - ax) * f,
        Math.sin(f * Math.PI) * 0.3,
        az + (bz - az) * f
      );
      g.rotation.y = lerpAngle(
        g.rotation.y,
        Math.atan2(bx - ax, bz - az),
        Math.min(1, delta * 12)
      );
      g.rotation.z = 0;
      return;
    }

    // travel finished — play the ending for this outcome
    const end = run.path[last];
    const [ex, , ez] = toWorld(game, end.x, end.y);
    const k = Math.max(0, elapsed - last * STEP_SECONDS);

    if (run.outcome === "win") {
      if (k < CELEBRATE_S) {
        const p = k / CELEBRATE_S;
        g.position.set(ex, Math.abs(Math.sin(p * Math.PI * 3)) * 0.5 * (1 - p * 0.5), ez);
        g.rotation.y += delta * 8;
      } else {
        // rest at the goal with a happy little bounce
        g.position.set(ex, Math.abs(Math.sin((k - CELEBRATE_S) * 2.5)) * 0.06, ez);
        g.rotation.y += delta * 0.8;
      }
    } else if (run.outcome === "crash") {
      const dir = run.bump ?? { dx: 0, dy: 0 };
      const p = Math.min(k / BUMP_S, 1);
      // shove toward the obstacle, recoil, and shiver out
      const amp = Math.sin(p * Math.PI * 3) * 0.2 * (1 - p);
      g.position.set(ex + dir.dx * amp, 0, ez + dir.dy * amp);
      g.rotation.y = lerpAngle(
        g.rotation.y,
        Math.atan2(dir.dx, dir.dy),
        Math.min(1, delta * 10)
      );
      g.rotation.z = Math.sin(p * Math.PI * 5) * 0.1 * (1 - p);
    } else {
      // miss: a sad wobble where we stopped
      const p = Math.min(k / WOBBLE_S, 1);
      g.position.set(ex, 0, ez);
      g.rotation.z = Math.sin(p * Math.PI * 4) * 0.16 * (1 - p);
    }
  });

  return (
    <group ref={group} position={[homeX, 0, homeZ]}>
      <RobotMeshes />
    </group>
  );
}

/* ------------------------------ main component ---------------------------- */

export function RobotGameView({
  game,
  onSuccess,
}: {
  game: RobotGame;
  onSuccess: () => void;
}) {
  const t = useTranslations("game");
  const [program, setProgram] = useState<Block[]>([]);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<"idle" | Outcome>("idle");
  const [run, setRun] = useState<Run | null>(null);
  const [collected, setCollected] = useState(false);
  const [burst, setBurst] = useState<Burst | null>(null);
  const mounted = useCanvasReady();
  const runId = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timersAtMount = timers.current;
    return () => timersAtMount.forEach(clearTimeout);
  }, []);

  const goalWorld = toWorld(game, game.goal.x, game.goal.y);
  const span = Math.max(game.cols, game.rows);
  const cameraPosition: [number, number, number] = [
    span * 0.45,
    span * 1.05,
    span * 1.35,
  ];

  function addBlock(block: Block) {
    if (running || status === "win") return;
    if (game.maxBlocks !== null && program.length >= game.maxBlocks) return;
    setProgram((p) => [...p, block]);
    setStatus("idle");
  }

  function removeBlock(index: number) {
    if (running || status === "win") return;
    setProgram((p) => p.filter((_, i) => i !== index));
    setStatus("idle");
  }

  function reset() {
    if (running) return;
    setProgram([]);
    setStatus("idle");
    setRun(null);
    setCollected(false);
    setBurst(null);
  }

  function go() {
    if (running || program.length === 0 || status === "win") return;
    const sim = simulate(game, program);
    runId.current += 1;
    const id = runId.current;
    const startedAt = performance.now();
    setStatus("idle");
    setCollected(false);
    setBurst(null);
    setRun({ id, startedAt, ...sim });
    setRunning(true);

    // Wall-clock timers own the outcome; the scene just draws along.
    const travelMs = (sim.path.length - 1) * STEP_SECONDS * 1000;
    const endingMs =
      sim.outcome === "win"
        ? CELEBRATE_S * 1000
        : sim.outcome === "crash"
          ? BUMP_S * 1000
          : WOBBLE_S * 1000;
    if (sim.outcome === "win") {
      timers.current.push(
        setTimeout(() => {
          setCollected(true);
          setBurst({ id, pos: goalWorld, at: performance.now() });
        }, travelMs)
      );
    }
    timers.current.push(
      setTimeout(() => {
        setRunning(false);
        setStatus(sim.outcome);
        if (sim.outcome === "win") {
          onSuccess();
        } else {
          // send Robo back to the start pad, like the 2D engine did
          setRun(null);
        }
      }, travelMs + endingMs + 60)
    );
  }

  const blocksFull =
    game.maxBlocks !== null && program.length >= game.maxBlocks;

  return (
    <div className="space-y-4">
      {/* 3D world */}
      <div className="relative h-72 w-full overflow-hidden rounded-2xl border-4 border-violet-100 bg-gradient-to-b from-sky-100 via-violet-50 to-fuchsia-50 sm:h-80">
        {mounted && (
          <Canvas
            shadows
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true }}
            camera={{ position: cameraPosition, fov: 42 }}
            onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
          >
            <ambientLight intensity={0.75} />
            <directionalLight
              position={[5, 9, 4]}
              intensity={1.2}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-left={-span}
              shadow-camera-right={span}
              shadow-camera-top={span}
              shadow-camera-bottom={-span}
            />
            <Board game={game} />
            <Star position={goalWorld} collected={collected} />
            <Robot game={game} run={run} />
            <Confetti burst={burst} />
          </Canvas>
        )}
      </div>

      {/* Program */}
      <div className="rounded-2xl border-4 border-violet-100 bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-wider text-brand">
            🧾 {t("yourPlan")}
          </p>
          {game.maxBlocks !== null && (
            <p
              className={`text-xs font-black ${blocksFull ? "text-amber-600" : "text-slate-400"}`}
            >
              {t("blocksUsed", {
                used: program.length,
                max: game.maxBlocks,
              })}
            </p>
          )}
        </div>
        <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl bg-slate-50 p-2">
          {program.length === 0 && (
            <span className="px-2 text-sm text-slate-400">
              {t("emptyProgram")}
            </span>
          )}
          {program.map((block, i) => (
            <button
              key={i}
              onClick={() => removeBlock(i)}
              className="rounded-lg border-2 border-violet-200 bg-white px-2.5 py-1.5 text-lg font-bold shadow-sm transition hover:border-rose-300 active:scale-90"
              title={t("removeBlock")}
            >
              {blockLabel(block)}
            </button>
          ))}
        </div>
      </div>

      {/* Palette */}
      <div className="flex flex-wrap justify-center gap-2">
        {game.palette.map((block, i) => (
          <button
            key={i}
            onClick={() => addBlock(block)}
            disabled={running || blocksFull || status === "win"}
            className="rounded-xl border-4 border-violet-200 bg-white px-3 py-2 text-xl font-bold shadow-sm transition hover:-translate-y-0.5 hover:border-brand-light active:scale-90 disabled:opacity-40"
          >
            {blockLabel(block)}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={go}
          disabled={running || program.length === 0 || status === "win"}
          className="rounded-2xl bg-success px-6 py-3 font-display text-lg font-semibold text-white shadow-lg shadow-emerald-200 transition hover:brightness-110 active:scale-95 disabled:opacity-50"
        >
          {t("go")}
        </button>
        <button
          onClick={reset}
          disabled={running}
          className="rounded-2xl border-4 border-slate-200 bg-white px-5 py-2.5 font-display font-semibold text-slate-600 transition hover:border-slate-300 active:scale-95 disabled:opacity-50"
        >
          🔄 {t("reset")}
        </button>
      </div>

      {status === "crash" && (
        <p className="text-center font-bold text-rose-600">💥 {t("crash")}</p>
      )}
      {status === "miss" && (
        <p className="text-center font-bold text-amber-600">🧭 {t("miss")}</p>
      )}
    </div>
  );
}
