import { Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

export const ProfileScene: React.FC<{
  username: string;
  avatarUrl: string;
  totalContributions: number;
}> = ({ username, avatarUrl, totalContributions }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 0.5 * fps, durationInFrames],
    [1, 0],
    {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    },
  );

  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        fontFamily,
        opacity,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <Img
          src={avatarUrl}
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              fontSize: 60,
              fontWeight: 700,
              color: "#000",
              lineHeight: 1.1,
            }}
          >
            {username}
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: "#666",
              lineHeight: 1.2,
            }}
          >
            {totalContributions.toLocaleString()} contributions
          </div>
        </div>
      </div>
    </div>
  );
};
