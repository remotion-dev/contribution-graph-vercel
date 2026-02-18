import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

const COLUMNS = 52;
const ROWS = 7;
const TILE_SIZE = 14;
const TILE_GAP = 3;

function getColor(value: number, maxValue: number): string {
  if (value === 0) return "#ebedf0";
  const ratio = value / maxValue;
  if (ratio <= 0.25) return "#9e9e9e";
  if (ratio <= 0.5) return "#757575";
  if (ratio <= 0.75) return "#424242";
  return "#000000";
}

export const GraphScene: React.FC<{
  contributions: number[];
}> = ({ contributions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const maxValue = Math.max(...contributions, 1);

  const gridWidth = COLUMNS * (TILE_SIZE + TILE_GAP) - TILE_GAP;
  const gridHeight = ROWS * (TILE_SIZE + TILE_GAP) - TILE_GAP;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      <svg
        width={gridWidth}
        height={gridHeight}
        viewBox={`0 0 ${gridWidth} ${gridHeight}`}
      >
        {Array.from({ length: COLUMNS }).map((_, col) =>
          Array.from({ length: ROWS }).map((_, row) => {
            const index = col * ROWS + row;
            if (index >= contributions.length) return null;

            const value = contributions[index];
            const color = getColor(value, maxValue);

            const tileOpacity = interpolate(
              frame,
              [index * 0.15, index * 0.15 + 0.3 * fps],
              [0, 1],
              {
                extrapolateRight: "clamp",
                extrapolateLeft: "clamp",
              },
            );

            return (
              <rect
                key={`${col}-${row}`}
                x={col * (TILE_SIZE + TILE_GAP)}
                y={row * (TILE_SIZE + TILE_GAP)}
                width={TILE_SIZE}
                height={TILE_SIZE}
                rx={2}
                ry={2}
                fill={color}
                opacity={tileOpacity}
              />
            );
          }),
        )}
      </svg>
    </AbsoluteFill>
  );
};
