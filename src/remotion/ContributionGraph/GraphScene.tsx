import React from "react";
import { ThreeCanvas } from "@remotion/three";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useThree } from "@react-three/fiber";

const COLUMNS = 52;
const ROWS = 7;
const TILE_SIZE = 0.8;
const TILE_SPACING = 1.0;
const MAX_HEIGHT = 3;

function getGreen(value: number, maxValue: number): string {
  if (value === 0) return "#ebedf0";
  const ratio = value / maxValue;
  if (ratio <= 0.25) return "#9be9a8";
  if (ratio <= 0.5) return "#40c463";
  if (ratio <= 0.75) return "#30a14e";
  return "#216e39";
}

const CameraSetup: React.FC = () => {
  const { camera } = useThree();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Zoom in during first 40% of the scene
  const zoomProgress = interpolate(
    frame,
    [0, durationInFrames * 0.4],
    [0, 1],
    {
      easing: Easing.inOut(Easing.quad),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const distance = interpolate(zoomProgress, [0, 1], [48, 30]);

  // Pan from left to right over the full duration
  const panProgress = interpolate(frame, [0, durationInFrames], [0, 1], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const panX = interpolate(panProgress, [0, 1], [-10, 10]);

  // Subtle rotation offset
  const rotOffset = interpolate(panProgress, [0, 1], [-2, 2]);

  // 45-degree elevation
  const elevation = Math.PI / 4;
  camera.position.set(
    panX + rotOffset,
    distance * Math.sin(elevation),
    distance * Math.cos(elevation),
  );
  camera.lookAt(panX * 0.5, 0, 0);

  return null;
};

const Tile: React.FC<{
  col: number;
  row: number;
  value: number;
  maxValue: number;
  index: number;
}> = ({ col, row, value, maxValue, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const color = getGreen(value, maxValue);
  const targetHeight =
    value === 0 ? 0.15 : (value / maxValue) * MAX_HEIGHT + 0.15;

  const progress = spring({
    frame,
    fps,
    delay: index * 0.3,
    config: { damping: 200 },
  });

  const scaleY = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  const x = (col - COLUMNS / 2 + 0.5) * TILE_SPACING;
  const z = (row - ROWS / 2 + 0.5) * TILE_SPACING;

  return (
    <group position={[x, 0, z]} scale={[1, Math.max(scaleY, 0.001), 1]}>
      <mesh position={[0, targetHeight / 2, 0]}>
        <boxGeometry args={[TILE_SIZE, targetHeight, TILE_SIZE]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
};

export const GraphScene: React.FC<{
  contributions: number[];
}> = ({ contributions }) => {
  const { width, height } = useVideoConfig();
  const maxValue = Math.max(...contributions, 1);

  return (
    <ThreeCanvas width={width} height={height}>
      <color attach="background" args={["white"]} />
      <CameraSetup />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} />
      {Array.from({ length: COLUMNS }).map((_, col) =>
        Array.from({ length: ROWS }).map((_, row) => {
          const index = col * ROWS + row;
          if (index >= contributions.length) return null;
          return (
            <Tile
              key={`${col}-${row}`}
              col={col}
              row={row}
              value={contributions[index]}
              maxValue={maxValue}
              index={index}
            />
          );
        }),
      )}
    </ThreeCanvas>
  );
};
