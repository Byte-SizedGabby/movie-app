/** @format */

"use client";

import { MovieNameGenerator } from "./components/MovieNameGenerator";

export default function Home() {
  return (
    <div>
      <div
        className="bg-blue-900 text-black font-bold text-2xl px-5 py-3 rounded flex items-center shadow-lg sticky top-0"
        style={{ zIndex: 1000 }}
      >
        <img
          src="/images/movie.png"
          alt="Movie"
          style={{
            marginRight: "10px",
            width: "70px",
            height: "70px",
          }}
        />
        <span className="text-yellow-500 drop-shadow-lg">
          Movie <span className="text-red-500">Night?</span>
        </span>
      </div>
      <MovieNameGenerator />
      <footer className="text-white text-center py-2 mt-1 w-full absolute bottom-0">
        &copy; {new Date().getFullYear()} Byte-SizedGabby. All rights reserved.
      </footer>
    </div>
  );
}
