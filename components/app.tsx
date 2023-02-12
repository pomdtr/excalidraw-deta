import { Drawing } from "@/lib/store";
import {
  Excalidraw,
  loadFromBlob,
  MainMenu,
  WelcomeScreen,
  serializeAsJSON,
  LiveCollaborationTrigger,
} from "@excalidraw/excalidraw";

import _ from "lodash";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { UsersIcon } from "./icons";

declare global {
  interface Window {
    EXCALIDRAW_ASSET_PATH: string;
  }
}

export default function App(props: { drawing: Drawing; readonly?: boolean }) {
  const [initialData, setInitialData] = useState<any>();
  const [isPublic, setIsPublic] = useState(props.drawing.public);
  const debouncedSave = useRef(
    _.debounce((elements, appState, files) => {
      const json = serializeAsJSON(elements, appState, files, "local");
      const drawing = {
        ...props.drawing,
        content: json,
      } as Drawing;
      fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(drawing),
      }).catch((err) => {
        console.error(err);
      });
    }, 1000)
  );

  useEffect(() => {
    if (!props.drawing.content) {
      setInitialData({});
      return;
    }

    const blob = new Blob([props.drawing.content], {
      type: "application/json",
    });
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
      viewModeEnabled={props.readonly}
      renderTopRightUI={() => {
        if (props.readonly) {
          return null;
        }
        return (
          <LiveCollaborationTrigger
            isCollaborating={isPublic}
            onSelect={async () => {
              await fetch(isPublic ? "/api/unshare" : "api/share", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  key: props.drawing.key,
                }),
              });

              setIsPublic(!isPublic);
            }}
          />
        );
      }}
      onChange={props.readonly ? undefined : debouncedSave.current}
    >
      <WelcomeScreen />
      <MainMenu>
        <MainMenu.DefaultItems.LoadScene />
        <MainMenu.DefaultItems.Export />
        <MainMenu.DefaultItems.SaveAsImage />
        {isPublic && !props.readonly ? (
          <MainMenu.ItemLink icon={<UsersIcon />} href="/public">
            Open Public Link
          </MainMenu.ItemLink>
        ) : null}
        <MainMenu.DefaultItems.Help />
        <MainMenu.DefaultItems.ClearCanvas />
        <MainMenu.Separator />
        <MainMenu.DefaultItems.Socials />
        <MainMenu.Separator />
        <MainMenu.DefaultItems.ToggleTheme />
        <MainMenu.DefaultItems.ChangeCanvasBackground />
      </MainMenu>
    </Excalidraw>
  ) : null;
}
