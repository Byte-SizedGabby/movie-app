/** @format */

"use client";

import { useState, useEffect, useRef } from "react";
import { MovieNameButton } from "./MovieNameButton";
import { MovieNameDisplay } from "./MovieNameDisplay";

interface MovieNameResponse {
  movieName: string;
  error?: string;
}

const ScrollDownArrow = () => (
  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
    {[0, 300, 600].map((delay) => (
      <span
        key={delay}
        className={`block w-4 h-4 border-b-2 border-r-2 border-white transform rotate-45 mb-1 animate-scroll-down delay-${delay}`}
      ></span>
    ))}
    <style jsx>{`
      @keyframes scroll-down {
        0% {
          opacity: 0;
          transform: rotate(45deg) translate(-10px, -10px);
        }
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0;
          transform: rotate(45deg) translate(10px, 10px);
        }
      }
      .animate-scroll-down {
        animation: scroll-down 1.5s infinite;
      }
      .delay-0 {
        animation-delay: 0s;
      }
      .delay-300 {
        animation-delay: 0.3s;
      }
      .delay-600 {
        animation-delay: 0.6s;
      }
    `}</style>
  </div>
);

export const MovieNameGenerator = () => {
  const [movieName, setMovieName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isScrollable, setIsScrollable] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const checkScrollable = () => {
    if (contentRef.current) {
      setIsScrollable(
        contentRef.current.scrollHeight > contentRef.current.clientHeight
      );
    }
  };

  useEffect(() => {
    checkScrollable();
    window.addEventListener("resize", checkScrollable);

    return () => {
      window.removeEventListener("resize", checkScrollable);
    };
  }, []);

  const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const generateMovieName = async () => {
    setLoading(true);
    const maxRetries = 3;
    let attempt = 0;
    let success = false;

    const prompts = [
      "give one random movie name",
      "suggest one comedy movie to watch",
      "give me a movie based on a love story",
      "recommend a movie from the 90s",
      "give me one action-packed movie",
      "give me a thriller movie name",
      "suggest a classic black-and-white movie",
      "suggest a sci-fi movie name",
      "give me a fantasy adventure movie",
      "can you suggest a horror movie name",
    ];

    while (attempt < maxRetries && !success) {
      try {
        shuffleArray(prompts);

        const prompt = prompts[attempt % prompts.length];

        const response = await fetch("/api/generateMovieName", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
          }),
        });

        if (response.ok) {
          const data: MovieNameResponse = await response.json();
          if (data.movieName) {
            setMovieName(data.movieName);
            success = true;
          } else {
            throw new Error(data.error || "Unknown error in response");
          }
        } else {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }
      } catch (error: unknown) {
        attempt += 1;

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
        } else {
          setMovieName("Failed to generate movie name");
        }
      } finally {
        setLoading(false);
      }
    }
    checkScrollable();
  };

  return (
    <div className="flex items-center justify-center relative">
      <div className="p-8 rounded-lg shadow-lg text-white w-full max-w-5xl">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Film Title Wizard
        </h1>
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <MovieNameButton onClick={generateMovieName} loading={loading} />
          </div>
          <div
            className="overflow-x-auto max-h-64 w-full relative"
            ref={contentRef}
            onScroll={checkScrollable}
          >
            <MovieNameDisplay movieName={movieName} />
          </div>
        </div>
      </div>
      {isScrollable && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <ScrollDownArrow />
        </div>
      )}
    </div>
  );
};
