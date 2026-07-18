"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { allGames, type RobotGame } from "@/lib/curriculum";
import {
  Confetti,
  Decorations,
  RobotMeshes,
  SkySprites,
  WORLD_THEMES,
  getPatternTexture,
  useCanvasReady,
  lerpAngle,
  type Burst,
  type WorldTheme,
} from "./three-shared";

/**
 * Each robot game gets its own world theme, and Robo evolves with it (the
 * `stage` prop on RobotMeshes). Stage = the game's position among all robot
 * games, so finishing a game always reveals a fresh world + upgraded Robo.
 */
const ROBOT_GAME_IDS = allGames
  .filter((g) => g.kind === "robot")
  .map((g) => g.id);

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

/** Crisp rounded arrow (points up by default, rotated per direction). */
function ArrowIcon({
  dx,
  dy,
  className,
}: {
  dx: number;
  dy: number;
  className?: string;
}) {
  const rotation = dx === 1 ? 90 : dx === -1 ? -90 : dy === 1 ? 180 : 0;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
      fill="none"
      stroke="currentColor"
      strokeWidth={3.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 19.5V6" />
      <path d="M5.5 11.5 12 5l6.5 6.5" />
    </svg>
  );
}

/** The face of a command block: gradient tile + arrow, ×N badge on repeats. */
function BlockFace({ block, small }: { block: Block; small?: boolean }) {
  return (
    <span className="flex items-center gap-1">
      <ArrowIcon
        dx={block.dx}
        dy={block.dy}
        className={small ? "h-5 w-5" : "h-6 w-6"}
      />
      {block.times > 1 && (
        <span
          className={`font-black ${small ? "text-xs" : "text-sm"}`}
        >{`×${block.times}`}</span>
      )}
    </span>
  );
}

/** Repeat (loop) blocks get their own color so they read as special. */
function blockGradient(block: Block) {
  return block.times > 1
    ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-200"
    : "bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-violet-200";
}

/** Screen-reader / tooltip text for a block. */
function blockTitle(block: Block) {
  const dir =
    block.dx === 1 ? "→" : block.dx === -1 ? "←" : block.dy === -1 ? "↑" : "↓";
  return block.times > 1 ? `${dir} ×${block.times}` : dir;
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

/** Textured checkerboard tiles + themed walls on a big ground disc. */
function Board({ game, theme }: { game: RobotGame; theme: WorldTheme }) {
  const texA = getPatternTexture(theme.tilePattern, theme.tileA, theme.tileAccent);
  const texB = getPatternTexture(theme.tilePattern, theme.tileB, theme.tileAccent);
  const texGoal = getPatternTexture(theme.tilePattern, theme.goalTile, theme.tileAccent);
  const texWall = getPatternTexture(theme.wallPattern, theme.wall, theme.wallAccent);

  const tiles = [];
  for (let y = 0; y < game.rows; y++) {
    for (let x = 0; x < game.cols; x++) {
      const [wx, , wz] = toWorld(game, x, y);
      const isGoal = game.goal.x === x && game.goal.y === y;
      const map = isGoal ? texGoal : (x + y) % 2 === 0 ? texA : texB;
      tiles.push(
        <mesh key={`t-${x}-${y}`} receiveShadow position={[wx, -0.11, wz]}>
          <boxGeometry args={[0.94, 0.22, 0.94]} />
          <meshStandardMaterial map={map} />
        </mesh>
      );
    }
  }
  return (
    <group>
      {/* the world floor the board sits on */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.26, 0]}>
        <circleGeometry args={[Math.max(game.cols, game.rows) * 1.45, 48]} />
        <meshStandardMaterial color={theme.ground} />
      </mesh>
      {tiles}
      {game.walls.map((w) => {
        const [wx, , wz] = toWorld(game, w.x, w.y);
        return (
          <group key={`w-${w.x}-${w.y}`}>
            <mesh castShadow receiveShadow position={[wx, 0.3, wz]}>
              <boxGeometry args={[0.88, 0.6, 0.88]} />
              <meshStandardMaterial map={texWall} />
            </mesh>
            {/* lid to catch the light */}
            <mesh position={[wx, 0.61, wz]}>
              <boxGeometry args={[0.92, 0.04, 0.92]} />
              <meshStandardMaterial color={theme.wallLid} />
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

/** Frames the whole board for the canvas' CURRENT aspect ratio, so wide
 *  boards fill a wide canvas instead of shrinking with distance. */
function CameraRig({ game }: { game: RobotGame }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  useEffect(() => {
    const persp = camera as THREE.PerspectiveCamera;
    const aspect = size.width / Math.max(size.height, 1);
    const vHalf = Math.tan(((persp.fov / 2) * Math.PI) / 180);
    const hHalf = vHalf * aspect;
    // Half extents to fit. Vertically the board depth is foreshortened by the
    // ~36° camera tilt (sin≈0.62) and Robo's height rides on top (cos≈0.81,
    // folded into the +0.95 margin together with the bobbing star).
    const needW = (game.cols + 1.8) / 2;
    const needD = (game.rows + 1.4) / 2;
    const dist = Math.max((needD * 0.62 + 0.95) / vHalf, (needW * 1.06) / hHalf, 4.2);
    persp.position
      .set(0.3, 1.05, 1.35)
      .normalize()
      .multiplyScalar(dist);
    persp.lookAt(0, 0, 0);
    persp.updateProjectionMatrix();
  }, [camera, size.width, size.height, game]);
  return null;
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
function Robot({
  game,
  run,
  stage,
}: {
  game: RobotGame;
  run: Run | null;
  stage: number;
}) {
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
      <RobotMeshes stage={stage} />
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

  const stage = Math.max(0, ROBOT_GAME_IDS.indexOf(game.id));
  const theme = WORLD_THEMES[stage % WORLD_THEMES.length];
  const goalWorld = toWorld(game, game.goal.x, game.goal.y);
  const span = Math.max(game.cols, game.rows);

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
    <div className="space-y-3">
      {/* 3D world */}
      <div
        className={`relative h-[clamp(10rem,30dvh,20rem)] w-full overflow-hidden rounded-2xl border-4 ${theme.frame}`}
      >
        {mounted && (
          <Canvas
            shadows
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true }}
            camera={{ position: [3, 5, 7], fov: 42 }}
          >
            <CameraRig game={game} />
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
            <SkySprites theme={theme} width={game.cols} depth={game.rows} />
            <Decorations theme={theme} width={game.cols} depth={game.rows} />
            <Board game={game} theme={theme} />
            <Star position={goalWorld} collected={collected} />
            <Robot game={game} run={run} stage={stage} />
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
              className={`rounded-lg px-2 py-1.5 text-white shadow-md transition hover:ring-2 hover:ring-rose-300 active:scale-90 ${blockGradient(block)}`}
              title={`${blockTitle(block)} — ${t("removeBlock")}`}
              aria-label={`${blockTitle(block)} — ${t("removeBlock")}`}
            >
              <BlockFace block={block} small />
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
            className={`rounded-xl p-3 text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-110 active:scale-90 disabled:opacity-40 disabled:hover:translate-y-0 ${blockGradient(block)}`}
            title={blockTitle(block)}
            aria-label={blockTitle(block)}
          >
            <BlockFace block={block} />
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
