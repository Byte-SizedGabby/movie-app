/** @format */

"use client";

interface MovieNameDisplayProps {
  movieName: string;
}

export const MovieNameDisplay = ({ movieName }: MovieNameDisplayProps) => (
  <div>{movieName ? `${movieName}` : ""}</div>
);
