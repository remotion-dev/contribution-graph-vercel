import { z } from "zod";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill } from "remotion";
import { CompositionProps } from "../../../types/constants";
import { ProfileScene } from "./ProfileScene";
import { GraphScene } from "./GraphScene";

export const ContributionGraph: React.FC<
  z.infer<typeof CompositionProps>
> = ({ username, avatarUrl, totalContributions, contributions }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "white" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90}>
          <ProfileScene
            username={username}
            avatarUrl={avatarUrl}
            totalContributions={totalContributions}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={225} premountFor={30}>
          <GraphScene contributions={contributions} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
