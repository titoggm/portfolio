import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const fontData = await readFile(
    join(
      process.cwd(),
      "node_modules/firacode/distr/ttf/FiraCode-Regular.ttf"
    )
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "Fira Code",
          fontSize: 84,
          color: "#fafafa",
        }}
      >
        <span style={{ display: "flex" }}>&gt;_</span>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Fira Code",
          data: fontData,
          style: "normal",
        },
      ],
    }
  );
}
