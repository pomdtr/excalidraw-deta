"use client";

import dynamic from "next/dynamic";
import { Drive } from "deta";
import { useEffect } from "react";
import * as Base64 from "js-base64";

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

  const buf = await blob.arrayBuffer();
  return {
    props: {
      data: Base64.fromUint8Array(new Uint8Array(buf)),
    },
  };
}

export default function IndexPage(props: { data?: string }) {
  let blob: Blob | undefined;
  if (props.data) {
    Base64.toUint8Array(props.data);
    blob = new Blob([Base64.toUint8Array(props.data)]);
  }

  useEffect(() => {
    window.EXCALIDRAW_ASSET_PATH = "/";
  }, []);
  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        <App blob={blob} />
      </div>
    </>
  );
}
