import { z } from "zod";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { CompositionProps } from "../../../types/constants";
import { ProfileScene } from "./ProfileScene";
import { GraphScene } from "./GraphScene";

export const ContributionGraph: React.FC<
  z.infer<typeof CompositionProps>
> = ({ username, avatarUrl, totalContributions, contributions }) => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={90}>
        <ProfileScene
          username={username}
          avatarUrl={avatarUrl}
          totalContributions={totalContributions}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={125}>
        <GraphScene contributions={contributions} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
