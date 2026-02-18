import { Composition } from "remotion";
import {
  COMP_NAME,
  CompositionProps,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";
import { ContributionGraph } from "./ContributionGraph/ContributionGraph";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id={COMP_NAME}
      component={ContributionGraph}
      schema={CompositionProps}
      durationInFrames={DURATION_IN_FRAMES}
      fps={VIDEO_FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      defaultProps={defaultMyCompProps}
    />
  );
};
