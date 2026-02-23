import { z } from "zod";

export const COMP_NAME = "ContributionGraph";

export const CompositionProps = z.object({
  username: z.string(),
  avatarUrl: z.string(),
  totalContributions: z.number(),
  contributions: z.array(z.number()),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  username: "octocat",
  avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
  totalContributions: 1200,
  contributions: Array.from({ length: 365 }, () =>
    Math.floor(Math.random() * 10),
  ),
};

export const DURATION_IN_FRAMES = 300;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 600;
export const VIDEO_FPS = 30;
