import { useState, useEffect } from "react";
import { Excalidraw } from "@excalidraw/excalidraw/types/packages/excalidraw";
export default function IndexPage() {
  const [Comp, setComp] = useState<typeof Excalidraw>();
  // Excalidraw can only run in the browser, so we need to import it after the page has loaded
  useEffect(() => {
    import("@excalidraw/excalidraw").then((comp) => {
      setComp(comp.Excalidraw);
    });
  }, []);

  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>{Comp && <Comp />}</div>
    </>
  );
}
