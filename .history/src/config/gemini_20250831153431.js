import { GoogleGenAI } from "@google/genai";
import mime from "mime";
const GhostAiKey = "AIzaSyCY-lCq-bGu8VsaaBlzgr2JJk2v561V8yE";
function saveBinaryFile(fileName, content) {
  const blob = new Blob([content]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

async function main() {
  const ai = new GoogleGenAI({
    apiKey: GhostAiKey, // ✅ Vite usuli
  });

  const config = {
    responseModalities: ["IMAGE", "TEXT"],
  };

  const model = "gemini-2.5-flash-image-preview";
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `INSERT_INPUT_HERE`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let fileIndex = 0;
  for await (const chunk of response) {
    if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
      continue;
    }

    if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
      const fileName = `ENTER_FILE_NAME_${fileIndex++}`;
      const inlineData = chunk.candidates[0].content.parts[0].inlineData;
      const fileExtension = mime.getExtension(inlineData.mimeType || "");
      const buffer = Uint8Array.from(atob(inlineData.data || ""), c => c.charCodeAt(0));
      saveBinaryFile(`${fileName}.${fileExtension}`, buffer);
    } else {
      console.log(chunk.text);
    }
  }
}

main();
