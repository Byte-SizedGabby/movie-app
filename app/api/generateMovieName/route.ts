/** @format */

import { OpenAI } from "openai";

const client = new OpenAI({
  baseURL: "https://api-inference.huggingface.co/v1/",
  apiKey: process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
      });
    }

    const response = await fetch(
      `https://api-inference.huggingface.co/models/mistralai/Mistral-Nemo-Instruct-2407/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    // Check if response is OK before trying to parse it
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${errorText}`);
    }

    // Try parsing the JSON response
    const data = await response.json();

    // Log the raw data for debugging
    console.log("API Response:", data);

    // Extract the generated message from the choices array
    const generatedText =
      data?.choices?.[0]?.message?.content || "No response from model";

    if (!generatedText) {
      throw new Error("No valid response from the model");
    }

    // Return the full generated text as the movie name
    const movieName = generatedText;

    return new Response(JSON.stringify({ movieName }), { status: 200 });
  } catch (error) {
    let errorMessage = "An unknown error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    console.error("Error generating movie name:", errorMessage);

    return new Response(
      JSON.stringify({
        error: `Failed to generate movie name: ${errorMessage}`,
      }),
      { status: 500 }
    );
  }
}
