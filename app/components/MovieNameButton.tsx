/** @format */

"use client";

interface MovieNameButtonProps {
  onClick: () => void;
  loading: boolean;
}

export const MovieNameButton = ({ onClick, loading }: MovieNameButtonProps) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="bg-blue-500 text-white font-bold py-1 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
  >
    {loading ? "Generating..." : "Generate Movie Name"}
  </button>
);
