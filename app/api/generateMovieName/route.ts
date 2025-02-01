/** @format */

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

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${errorText}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    const generatedText =
      data?.choices?.[0]?.message?.content ?? "No response from model";

    if (!generatedText) {
      throw new Error("No valid response from the model");
    }

    return new Response(JSON.stringify({ movieName: generatedText }), {
      status: 200,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error generating movie name:", errorMessage);

    return new Response(
      JSON.stringify({
        error: `Failed to generate movie name: ${errorMessage}`,
      }),
      { status: 500 }
    );
  }
}
