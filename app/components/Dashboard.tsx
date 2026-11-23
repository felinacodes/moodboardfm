"use client";

import { useState } from "react";

type BoardItem = {
  id: number;
  type: "text" | "image" | "sticker";
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color?: string;
};

const initialItems: BoardItem[] = [
  {
    id: 1,
    type: "text",
    content: "Ashtray girl",
    x: 100,
    y: 90,
    width: 220,
    height: 65,
    rotation: -5,
  },
  {
    id: 2,
    type: "image",
    content:
      "https://thumbs.dreamstime.com/b/cozy-rainy-day-retreat-book-candle-warm-drink-indoor-scene-tea-rain-streaked-window-comfort-440575440.jpg",
    x: 390,
    y: 100,
    width: 190,
    height: 230,
    rotation: 3,
  },
  {
    id: 3,
    type: "sticker",
    content: "💗",
    x: 220,
    y: 260,
    width: 90,
    height: 90,
    rotation: 12,
  },
  {
    id: 4,
    type: "text",
    content: "I think there's a flaw in my code",
    x: 450,
    y: 390,
    width: 240,
    height: 60,
    rotation: -3,
  },
];

export default function Dashboard() {
  const [items, setItems] = useState<BoardItem[]>(initialItems);
  const [selected, setSelected] = useState<number | null>(null);
  const [nextId, setNextId] = useState(5);

  function addItem(type: BoardItem["type"], content = "") {
    const item: BoardItem = {
      id: nextId,
      type,
      content: content || (type === "text" ? "Double click to edit" : "💘"),
      x: 100 + Math.random() * 250,
      y: 100 + Math.random() * 150,
      width: type === "image" ? 180 : 200,
      height: type === "image" ? 180 : 65,
      rotation: 0,
    };

    setItems((prev) => [...prev, item]);
    setSelected(item.id);
    setNextId((prev) => prev + 1);
  }

  function updateItem(id: number, updates: Partial<BoardItem>) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  }

  function deleteSelected() {
    setItems((prev) => prev.filter((item) => item.id !== selected));
    setSelected(null);
  }

  function handlePointerDown(
    e: React.PointerEvent<HTMLDivElement>,
    item: BoardItem,
  ) {
    if ((e.target as HTMLElement).closest("button, input")) return;

    e.preventDefault();
    e.stopPropagation();

    setSelected(item.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const originalX = item.x;
    const originalY = item.y;

    const onMove = (event: PointerEvent) => {
      updateItem(item.id, {
        x: originalX + event.clientX - startX,
        y: originalY + event.clientY - startY,
      });
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function resizeItem(
    e: React.PointerEvent<HTMLButtonElement>,
    item: BoardItem,
  ) {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = item.width;
    const startHeight = item.height;

    const onMove = (event: PointerEvent) => {
      updateItem(item.id, {
        width: Math.max(60, startWidth + event.clientX - startX),
        height: Math.max(45, startHeight + event.clientY - startY),
      });
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100 p-4 text-zinc-900 dark:bg-black dark:text-white">
      {/* Toolbar */}
      <div className="mx-auto mb-4 flex w-full max-w-6xl flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <span className="mr-auto font-semibold">Moodboard.fm</span>

        <button
          onClick={() => addItem("text")}
          className="rounded-lg bg-zinc-100 px-4 py-2 text-sm hover:bg-zinc-200 dark:bg-zinc-800"
        >
          + Text
        </button>

        <button
          onClick={() => {
            const url = window.prompt("Enter image URL");
            if (url) addItem("image", url);
          }}
          className="rounded-lg bg-zinc-100 px-4 py-2 text-sm hover:bg-zinc-200 dark:bg-zinc-800"
        >
          + Image
        </button>

        <button
          onClick={() => addItem("sticker", "💗")}
          className="rounded-lg bg-zinc-100 px-4 py-2 text-sm hover:bg-zinc-200 dark:bg-zinc-800"
        >
          + Sticker
        </button>

        <button
          onClick={() => addItem("sticker", "🌧")}
          className="rounded-lg bg-zinc-100 px-4 py-2 text-sm hover:bg-zinc-200 dark:bg-zinc-800"
        >
          + Rain
        </button>

        <button
          onClick={deleteSelected}
          disabled={selected === null}
          className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-600 hover:bg-red-200 disabled:opacity-30"
        >
          Delete
        </button>
      </div>

      {/* Workspace */}
      <div
        className="relative mx-auto w-full max-w-6xl flex-1 overflow-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800"
        style={{
          minHeight: "650px",
          backgroundImage: "radial-gradient(#d4d4d8 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
        onPointerDown={() => setSelected(null)}
      >
        {/* Canvas area */}
        <div className="relative min-h-[900px] min-w-[900px]">
          {items.map((item) => (
            <div
              key={item.id}
              onPointerDown={(e) => handlePointerDown(e, item)}
              className={`absolute flex items-center justify-center select-none ${
                selected === item.id
                  ? "ring-2 ring-blue-500"
                  : "hover:ring-1 hover:ring-zinc-300"
              }`}
              style={{
                left: item.x,
                top: item.y,
                width: item.width,
                height: item.height,
                transform: `rotate(${item.rotation}deg)`,
                zIndex: selected === item.id ? 100 : item.id,
                cursor: "grab",
                touchAction: "none",
              }}
            >
              {item.type === "image" && (
                <img
                  src={item.content}
                  alt="Moodboard image"
                  draggable={false}
                  className="h-full w-full object-cover pointer-events-none"
                />
              )}

              {item.type === "text" && (
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    updateItem(item.id, {
                      content: e.currentTarget.innerText,
                    })
                  }
                  onPointerDown={(e) => e.stopPropagation()}
                  className="h-full w-full cursor-text p-2 text-center text-xl font-bold outline-none"
                >
                  {item.content}
                </div>
              )}

              {item.type === "sticker" && (
                <div className="text-6xl">{item.content}</div>
              )}

              {/* Resize handle */}
              {selected === item.id && (
                <>
                  <button
                    onPointerDown={(e) => resizeItem(e, item)}
                    className="absolute -bottom-2 -right-2 h-4 w-4 rounded-full border-2 border-white bg-blue-500 cursor-se-resize"
                    aria-label="Resize element"
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateItem(item.id, {
                        rotation: item.rotation + 15,
                      });
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-2 py-1 text-xs text-white"
                  >
                    ↻ Rotate
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* <p className="mx-auto mt-3 text-xs text-zinc-500">
        Drag elements to move · Select to resize or rotate · Double-click text
        to edit
      </p> */}
    </div>
  );
}
