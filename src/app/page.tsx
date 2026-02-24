"use client";

import type { NextPage } from "next";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/Button";
import { InputContainer } from "../components/Container";
import { Tips } from "../components/Tips";

const Home: NextPage = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = username.trim();
      if (trimmed) {
        router.push(`/${trimmed}`);
      }
    },
    [username, router],
  );

  return (
    <div>
      <div className="max-w-screen-md m-auto mb-5 px-4 mt-16 flex flex-col gap-10">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-geist mb-2">
            GitHub Contribution Graph Video
          </h1>
          <p className="text-subtitle font-geist">
            Enter a GitHub username to generate a contribution graph video.
          </p>
        </div>
        <form onSubmit={onSubmit}>
          <InputContainer>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="gh"
                className="text-sm font-medium text-foreground"
              >
                GitHub Username
              </label>
              <input
                id="gh"
                type="search"
                autoComplete="off"
                className="leading-[1.7] block w-full rounded-geist bg-background p-geist-half text-foreground text-sm border border-unfocused-border-color transition-colors duration-150 ease-in-out focus:border-focused-border-color outline-none"
                placeholder="octocat"
                spellCheck="false"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button disabled={!username.trim()}>Generate video</Button>
            </div>
          </InputContainer>
        </form>
        <Tips />
      </div>
    </div>
  );
};

export default Home;
