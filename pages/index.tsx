import dynamic from "next/dynamic";
import { Drawing, fetchLatestDrawing } from "../lib/store";

const App = dynamic(() => import("../components/app"), {
  ssr: false,
});

// This gets called on every request
export async function getServerSideProps() {
  const drawing = await fetchLatestDrawing();
  return {
    props: {
      drawing,
    },
  };
}

export default function IndexPage(props: { drawing: Drawing }) {
  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        <App drawing={props.drawing} />
      </div>
    </>
  );
}
