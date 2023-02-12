"use client";

import dynamic from "next/dynamic";

const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw),
  {
    ssr: false,
  }
);

declare global {
  interface Window {
    EXCALIDRAW_ASSET_PATH: string;
  }
}

export default function IndexPage() {
  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        <Excalidraw />
      </div>
    </>
  );
}
