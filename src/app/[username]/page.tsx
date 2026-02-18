"use client";

import { Player } from "@remotion/player";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import {
  COMP_NAME,
  CompositionProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../../types/constants";
import { ContributionGraph } from "../../remotion/ContributionGraph/ContributionGraph";
import { useRendering } from "../../helpers/use-rendering";
import { InputContainer } from "../../components/Container";
import { Button } from "../../components/Button";
import { AlignEnd } from "../../components/AlignEnd";
import { DownloadButton } from "../../components/DownloadButton";
import { ErrorComp } from "../../components/Error";
import { ProgressBar } from "../../components/ProgressBar";
import { Spacing } from "../../components/Spacing";
import { Tips } from "../../components/Tips";

type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

type ApiResponse = {
  total: Record<string, number>;
  contributions: ContributionDay[];
};

export default function UserPage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}`,
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch contributions for "${username}"`);
        }
        const json = (await res.json()) as ApiResponse;
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as Error).message);
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [username]);

  const inputProps: z.infer<typeof CompositionProps> | null = useMemo(() => {
    if (!data) return null;

    const currentYear = new Date().getFullYear().toString();

    const thisYear = data.contributions
      .filter((d) => d.date.startsWith(currentYear))
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

    const contributions = thisYear.map((d) => d.count);

    while (contributions.length < 365) {
      contributions.push(0);
    }

    const totalContributions = data.total[currentYear] ?? 0;

    return {
      username,
      avatarUrl: `https://github.com/${username}.png`,
      totalContributions,
      contributions,
    };
  }, [data, username]);

  return (
    <div>
      <div className="max-w-screen-md m-auto mb-5 px-4 mt-16 flex flex-col gap-10">
        {loading ? (
          <div className="text-foreground font-geist text-center py-20">
            Loading contributions for {username}...
          </div>
        ) : error ? (
          <div className="text-geist-error font-geist text-center py-20">
            {error}
          </div>
        ) : inputProps ? (
          <>
            <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)]">
              <Player
                component={ContributionGraph}
                inputProps={inputProps}
                durationInFrames={DURATION_IN_FRAMES}
                fps={VIDEO_FPS}
                compositionHeight={VIDEO_HEIGHT}
                compositionWidth={VIDEO_WIDTH}
                style={{
                  width: "100%",
                }}
                controls
                autoPlay
                loop
              />
            </div>
            <section className="flex flex-col gap-4">
              <RenderSection inputProps={inputProps} />
            </section>
          </>
        ) : null}
        <Tips />
      </div>
    </div>
  );
}

const RenderSection: React.FC<{
  inputProps: z.infer<typeof CompositionProps>;
}> = ({ inputProps }) => {
  const { renderMedia, state, undo } = useRendering(COMP_NAME, inputProps);

  const onRender = useCallback(() => {
    renderMedia();
  }, [renderMedia]);

  return (
    <InputContainer>
      {state.status === "init" ||
      state.status === "invoking" ||
      state.status === "error" ? (
        <>
          <AlignEnd>
            <Button
              disabled={state.status === "invoking"}
              loading={state.status === "invoking"}
              onClick={onRender}
            >
              Render video
            </Button>
          </AlignEnd>
          {state.status === "invoking" ? (
            <>
              <Spacing />
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.5,
                  minHeight: "2.5em",
                  marginBottom: 8,
                }}
              >
                <div style={{ color: "#666" }}>
                  {state.phase}
                  {state.progress < 1
                    ? ` ${Math.max(Math.round(state.progress * 100), 1)}%`
                    : null}
                </div>
                <div
                  style={{
                    color: "#999",
                    fontSize: 12,
                    visibility: state.subtitle ? "visible" : "hidden",
                  }}
                >
                  {state.subtitle ?? "\u00A0"}
                </div>
              </div>
              <ProgressBar progress={state.progress} />
            </>
          ) : null}
          {state.status === "error" ? (
            <ErrorComp message={state.error.message} />
          ) : null}
        </>
      ) : null}
      {state.status === "done" ? (
        <>
          <ProgressBar progress={1} />
          <Spacing />
          <AlignEnd>
            <DownloadButton undo={undo} state={state} />
          </AlignEnd>
        </>
      ) : null}
    </InputContainer>
  );
};
