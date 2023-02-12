"use client";

import dynamic from "next/dynamic";
import { Drive } from "deta";
import { useEffect } from "react";

const App = dynamic(() => import("../components/app"), {
  ssr: false,
});

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const drive = Drive("drawings");
  const blob = await drive.get("deta.excalidraw");
  if (!blob) {
    return {
      props: {},
    };
  }

  const drawing = await blob.text();
  return {
    props: {
      drawing,
    },
  };
}

export default function IndexPage(props: { drawing?: string }) {
  useEffect(() => {
    window.EXCALIDRAW_ASSET_PATH = "/";
  }, []);

  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        <App drawing={props.drawing} />
      </div>
    </>
  );
}
