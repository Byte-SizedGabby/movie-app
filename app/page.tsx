/** @format */

"use client";

import { useState } from "react";

// Define TypeScript types for the response
interface MovieNameResponse {
  movieName: string;
}

export default function Home() {
  const [movieName, setMovieName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const generateMovieName = async () => {
    setLoading(true);
    const maxRetries = 3;
    let attempt = 0;
    let success = false;

    while (attempt < maxRetries && !success) {
      try {
        const response = await fetch("/api/generateMovieName", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt:
              "Suggest a movie name. One of the most popular movies on the Internet",
          }),
        });

        if (response.ok) {
          const data: MovieNameResponse = await response.json();
          setMovieName(data.movieName);
          success = true;
        } else {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }
      } catch (error: unknown) {
        attempt += 1;

        if (error instanceof Error) {
          console.error(`Attempt ${attempt} failed:`, error.message);
        } else {
          console.error(`Attempt ${attempt} failed: Unknown error`);
        }

        if (attempt < maxRetries) {
          console.log(`Retrying... (${attempt}/${maxRetries})`);
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Retry after 3 seconds
        } else {
          setMovieName("Failed to generate movie name");
        }
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Movie Name Generator</h1>
      <button onClick={generateMovieName} disabled={loading}>
        {loading ? "Generating..." : "Generate Movie Name"}
      </button>
      {movieName && <p>Generated Movie Name: {movieName}</p>}
    </div>
  );
}
