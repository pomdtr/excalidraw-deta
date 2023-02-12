import {
  Excalidraw,
  loadFromBlob,
  serializeAsJSON,
} from "@excalidraw/excalidraw";

import _ from "lodash";
import { useEffect } from "react";
import { useState } from "react";

declare global {
  interface Window {
    EXCALIDRAW_ASSET_PATH: string;
  }
}

export default function App(props: { drawing?: string }) {
  const [initialData, setInitialData] = useState<any>();

  useEffect(() => {
    if (!props.drawing) {
      setInitialData({});
      return;
    }

    const blob = new Blob([props.drawing], { type: "application/json" });
    loadFromBlob(blob, null, null).then((data) => {
      setInitialData({
        ...data,
        scrollToContent: true,
      });
    });
  }, [props.drawing]);

  useEffect(() => {}, []);
  return initialData ? (
    <Excalidraw
      initialData={initialData}
      onChange={_.debounce((elements, appState, files) => {
        const json = serializeAsJSON(elements, appState, files, "local");
        fetch("/api/save", {
          method: "POST",
          body: json,
        })
          .then((res) => res.json())
          .catch((err) => {
            console.error(err);
          });
      }, 1000)}
    />
  ) : null;
}
