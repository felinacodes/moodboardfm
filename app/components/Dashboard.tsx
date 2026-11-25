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
  font?: string;
  color?: string;
  fontSize?: number;
};

const fonts = [
  { name: "Playfair Display", value: "var(--font-playfair)" },
  { name: "Cormorant Garamond", value: "var(--font-cormorant)" },
  { name: "Space Grotesk", value: "var(--font-space-grotesk)" },
  { name: "Bebas Neue", value: "var(--font-bebas)" },
  { name: "Pacifico", value: "var(--font-pacifico)" },
  { name: "DM Serif Display", value: "var(--font-dm-serif)" },
  { name: "Permanent Marker", value: "var(--font-permanent-marker)" },
  { name: "Lora", value: "var(--font-lora)" },
  { name: "Geist", value: "var(--font-geist)" },
  { name: "Geist Mono", value: "var(--font-geist-mono)" },
];

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
    color: "#2346d1",
    font: "var(--font-permanent-marker)",
    fontSize: 24,
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
    color: "#e3a5e1",
    font: "var(--font-pacifico)",
    fontSize: 24,
  },
];

export default function Dashboard() {
  const [items, setItems] = useState<BoardItem[]>(initialItems);
  const [selected, setSelected] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [nextId, setNextId] = useState(5);
  const [showFontMenu, setShowFontMenu] = useState(false);

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
      color: "#18181b",
      fontSize: 24,
    };

    setItems((prev) => [...prev, item]);
    setSelected(item.id);
    setIsEditing(null);
    setShowFontMenu(false);
    setNextId((prev) => prev + 1);
  }

  function updateItem(id: number, updates: Partial<BoardItem>) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  }

  function deleteSelected() {
    if (selected === null) return;

    setItems((prev) => prev.filter((item) => item.id !== selected));
    setSelected(null);
    setIsEditing(null);
    setShowFontMenu(false);
  }

  function changeFontSize(item: BoardItem, amount: number) {
    const currentSize = item.fontSize ?? 24;
    const newSize = Math.min(72, Math.max(10, currentSize + amount));

    updateItem(item.id, {
      fontSize: newSize,
      height: Math.max(65, item.height * (newSize / currentSize)),
    });
  }

  function handlePointerDown(
    e: React.PointerEvent<HTMLDivElement>,
    item: BoardItem,
  ) {
    if ((e.target as HTMLElement).closest("button, input, label")) return;
    if (isEditing === item.id) return;

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
        width: Math.max(40, startWidth + event.clientX - startX),
        height: Math.max(40, startHeight + event.clientY - startY),
      });
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function updateTextSize(id: number, element: HTMLDivElement) {
    const height = element.scrollHeight;

    updateItem(id, {
      height: Math.max(65, height),
    });
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
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            setSelected(null);
            setIsEditing(null);
            setShowFontMenu(false);
          }
        }}
      >
        <div
          className="relative min-h-[900px] min-w-[900px]"
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelected(null);
              setIsEditing(null);
              setShowFontMenu(false);
            }
          }}
        >
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
                cursor: isEditing === item.id ? "text" : "grab",
                touchAction: "none",
              }}
            >
              {item.type === "image" && (
                <img
                  src={item.content}
                  alt="Moodboard image"
                  draggable={false}
                  className="pointer-events-none h-full w-full object-cover"
                />
              )}

              {/* Sticker */}
              {item.type === "sticker" && (
                <div
                  className="pointer-events-none flex h-full w-full items-center justify-center"
                  style={{
                    fontSize: `${Math.min(item.width, item.height) * 0.75}px`,
                    lineHeight: 1,
                  }}
                >
                  {item.content}
                </div>
              )}

              {/* Text */}
              {item.type === "text" && (
                <div
                  contentEditable={isEditing === item.id}
                  suppressContentEditableWarning
                  style={{
                    fontFamily: item.font || "inherit",
                    color: item.color || "#18181b",
                    fontSize: `${item.fontSize ?? 24}px`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(item.id);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setSelected(item.id);
                    setIsEditing(item.id);
                  }}
                  onPointerDown={(e) => {
                    if (isEditing === item.id) {
                      e.stopPropagation();
                    }
                  }}
                  onInput={(e) => {
                    updateTextSize(item.id, e.currentTarget);
                  }}
                  onBlur={(e) => {
                    const element = e.currentTarget;

                    updateItem(item.id, {
                      content: element.innerText,
                      height: Math.max(65, element.scrollHeight),
                    });

                    setIsEditing(null);
                  }}
                  className={`min-h-[65px] w-full whitespace-pre-wrap break-words p-2 text-center font-bold outline-none ${
                    isEditing === item.id ? "cursor-text" : "cursor-grab"
                  }`}
                >
                  {item.content}
                </div>
              )}

              {/* Selected item controls */}
              {selected === item.id && (
                <>
                  {/* Resize handle */}
                  <button
                    onPointerDown={(e) => resizeItem(e, item)}
                    className="absolute -bottom-2 -right-2 h-4 w-4 cursor-se-resize rounded-full border-2 border-white bg-blue-500"
                    aria-label="Resize element"
                  />

                  {/* Horizontal controls */}
                  <div
                    className="absolute -top-10 left-1/2 z-[150] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    {/* Rotate */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateItem(item.id, {
                          rotation: item.rotation + 15,
                        });
                      }}
                      className="rounded-full bg-blue-500 px-3 py-1 text-xs text-white"
                    >
                      ↻ Rotate
                    </button>

                    {item.type === "text" && (
                      <>
                        {/* Font selector */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowFontMenu((prev) => !prev);
                            }}
                            className="rounded-full bg-purple-500 px-3 py-1 text-xs text-white"
                          >
                            Aa Font ▾
                          </button>

                          {showFontMenu && (
                            <div className="absolute left-1/2 top-full z-[200] mt-2 w-48 -translate-x-1/2 rounded-lg border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                              {fonts.map((font) => (
                                <button
                                  key={font.value}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateItem(item.id, {
                                      font: font.value,
                                    });
                                    setShowFontMenu(false);
                                  }}
                                  className={`block w-full rounded-md px-3 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800 ${
                                    item.font === font.value
                                      ? "bg-purple-100 dark:bg-purple-900"
                                      : ""
                                  }`}
                                  style={{ fontFamily: font.value }}
                                >
                                  {font.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Text color picker */}
                        <label
                          className="flex cursor-pointer items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-900 dark:bg-zinc-800 dark:text-white"
                          onPointerDown={(e) => e.stopPropagation()}
                        >
                          <span>Color</span>
                          <input
                            type="color"
                            value={item.color || "#18181b"}
                            onChange={(e) =>
                              updateItem(item.id, {
                                color: e.target.value,
                              })
                            }
                            className="h-5 w-5 cursor-pointer rounded border-0 bg-transparent p-0"
                            aria-label="Change text color"
                          />
                        </label>

                        {/* Text size controls */}
                        <div className="flex items-center gap-1 rounded-full bg-zinc-100 px-1 py-1 text-zinc-900 dark:bg-zinc-800 dark:text-white">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              changeFontSize(item, -2);
                            }}
                            disabled={(item.fontSize ?? 24) <= 10}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold hover:bg-zinc-200 disabled:opacity-30 dark:hover:bg-zinc-700"
                            aria-label="Decrease text size"
                          >
                            −
                          </button>

                          <span className="min-w-8 text-center text-xs tabular-nums">
                            {item.fontSize ?? 24}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              changeFontSize(item, 2);
                            }}
                            disabled={(item.fontSize ?? 24) >= 72}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold hover:bg-zinc-200 disabled:opacity-30 dark:hover:bg-zinc-700"
                            aria-label="Increase text size"
                          >
                            +
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
