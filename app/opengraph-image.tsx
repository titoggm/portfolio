import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "tito.dev — Tito Garcia, Product Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          flexDirection: "column",
          backgroundColor: "#0a0a0a",
          fontFamily: "Fira Code",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", gap: 10 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              border: "1px solid #525252",
              display: "flex",
            }}
          />
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              border: "1px solid #525252",
              display: "flex",
            }}
          />
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              border: "1px solid #525252",
              display: "flex",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", fontSize: 28, color: "#737373" }}>
            titogarcia999@portfolio:~$ whoami
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              marginTop: 28,
              color: "#fafafa",
            }}
          >
            Tito Garcia
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              marginTop: 20,
              color: "#a3a3a3",
            }}
          >
            Product Designer — design, AI, engineering
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 28,
            color: "#737373",
          }}
        >
          <span style={{ display: "flex" }}>tito.dev</span>
          <div
            style={{
              width: 16,
              height: 32,
              backgroundColor: "#fafafa",
              marginLeft: 16,
              display: "flex",
            }}
          />
        </div>
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
