import { randomUUID } from "crypto";
import { Base, Drive } from "deta";

const drive = Drive("drawings");
const base = Base("drawings");

type DrawingRecord = {
  key: string;
  name: string;
  public: boolean;
  created_at: number;
  updated_at: number;
};

export type Drawing = {
  key: string;
  public: boolean;
  content?: string;
};

export async function fetchAllItems(): Promise<DrawingRecord[]> {
  let res = await base.fetch();
  let allItems = res.items as DrawingRecord[];

  // continue fetching until last is not seen
  while (res.last) {
    res = await base.fetch({}, { last: res.last });
    allItems = allItems.concat(res.items as DrawingRecord[]);
  }

  return allItems;
}

export async function fetchLatestDrawing(): Promise<Drawing> {
  const items = await fetchAllItems();

  if (items.length === 0) {
    const key = await randomUUID();
    const drawing: DrawingRecord = {
      key,
      name: "Untitled",
      public: false,
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    await base.insert(drawing, key);

    return {
      key,
      public: false,
    };
  }

  const drawing = items.reduce((prev, current) =>
    prev.updated_at > current.updated_at ? prev : current
  );

  const blob = await drive.get(`${drawing.key}.excalidraw`);

  if (!blob) {
    return {
      key: drawing.key,
      public: drawing.public,
    };
  }

  const content = await blob.text();
  return {
    key: drawing.key,
    public: drawing.public,
    content,
  };
}

export async function saveContent(drawing: Drawing): Promise<void> {
  await base.update(
    {
      update_at: Date.now(),
    },
    drawing.key
  );
  await drive.put(`${drawing.key}.excalidraw`, {
    contentType: "application/json",
    data: drawing.content,
  });
}

export async function shareDrawing(key: string): Promise<void> {
  await base.update(
    {
      public: true,
    },
    key
  );
}

export async function unshareDrawing(key: string): Promise<void> {
  await base.update(
    {
      public: false,
    },
    key
  );
}
