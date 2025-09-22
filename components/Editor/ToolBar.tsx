"use client";
import { useEditorState } from "@/store/editor-store";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Strikethrough,
  UnderlineIcon,
  List,
  ListOrdered,
  Redo,
  Undo,
  ChevronDown,
  Minus,
  Plus,
  Table2,
  Palette,
  Highlighter,
  Subscript,
  Superscript,
  ImageIcon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { TableSidebar } from "./TableSideBar";

export function Toolbar() {
  const { editor } = useEditorState();
  const [fontSize, setFontSize] = useState(16);
  const [showTableSidebar, setShowTableSidebar] = useState(false);
  const [showTextColorPopover, setShowTextColorPopover] = useState(false);
  const [showHighlightPopover, setShowHighlightPopover] = useState(false);
  const textColorPopoverRef = useRef<HTMLDivElement>(null);
  const highlightPopoverRef = useRef<HTMLDivElement>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Predefined colors for text and highlight
  const textColors = [
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#ff0000" },
    { name: "Green", value: "#008000" },
    { name: "Blue", value: "#0000ff" },
    { name: "Purple", value: "#800080" },
    { name: "Orange", value: "#ffa500" },
  ];
  const highlightColors = [
    { name: "None", value: "transparent" },
    { name: "Yellow", value: "#ffff00" },
    { name: "Pink", value: "#ff69b4" },
    { name: "Light Blue", value: "#add8e6" },
    { name: "Light Green", value: "#90ee90" },
    { name: "Light Gray", value: "#d3d3d3" },
  ];

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        textColorPopoverRef.current &&
        !textColorPopoverRef.current.contains(event.target as Node)
      ) {
        setShowTextColorPopover(false);
      }
      if (
        highlightPopoverRef.current &&
        !highlightPopoverRef.current.contains(event.target as Node)
      ) {
        setShowHighlightPopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!editor) {
    return null;
  }

  const applyFontSize = (size: number) => {
    setFontSize(size);
    editor
      .chain()
      .focus()
      .setMark("textStyle", { fontSize: `${size}px` })
      .run();
  };

  const applyTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setShowTextColorPopover(false);
  };

  const applyHighlightColor = (color: string) => {
    editor.chain().focus().setHighlight({ color }).run();
    setShowHighlightPopover(false);
  };

  const insertImage = (url: string) => {
    editor.chain().focus().setImage({ src: url }).run();
    setShowAddMenu(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        insertImage(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const insertTable = (rows: number, cols: number) => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();
    setShowAddMenu(false);
  };

  const Button = ({
    onClick,
    isActive,
    icon: Icon,
    label,
  }: {
    onClick: () => void;
    isActive?: boolean;
    icon?: any;
    label?: string;
  }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-all duration-200 hover:bg-gray-200/80 ${
        isActive ? "bg-gray-200 text-gray-900" : "text-gray-600"
      } focus:outline-none focus:ring-2 focus:ring-blue-300`}
      title={label}
      aria-label={label}
    >
      {Icon ? <Icon size={18} strokeWidth={2.5} /> : label}
    </button>
  );

  const getActiveBlock = () => {
    if (editor.isActive("heading", { level: 1 })) return "Heading 1";
    if (editor.isActive("heading", { level: 2 })) return "Heading 2";
    if (editor.isActive("heading", { level: 3 })) return "Heading 3";
    return "Normal text";
  };

  const Dropdown = ({
    label,
    options,
    onSelect,
  }: {
    label: string;
    options: { label: string; value: any }[];
    onSelect: (val: any) => void;
  }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {label} <ChevronDown size={16} strokeWidth={2.5} />
        </button>
        {open && (
          <div className="absolute left-0 mt-1.5 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
            {options.map((opt) => (
              <div
                key={
                  typeof opt.value === "string"
                    ? opt.value
                    : JSON.stringify(opt.value)
                }
                className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-150"
                onClick={() => {
                  onSelect(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const ColorPopover = ({
    colors,
    onSelect,
    isOpen,
    ref,
    isHighlight,
  }: {
    colors: { name: string; value: string }[];
    onSelect: (color: string) => void;
    isOpen: boolean;
    ref: React.RefObject<HTMLDivElement>;
    isHighlight?: boolean;
  }) => (
    <div
      ref={ref}
      className={`absolute left-0 mt-1.5 w-48 bg-white border border-gray-200 rounded-lg shadow-xl transition-all duration-200 z-0 ${
        isOpen
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="grid grid-cols-3 gap-2 p-3">
        {colors.map((color) => (
          <button
            key={color.value}
            className="w-8 h-8 rounded-full border border-gray-200 hover:border-blue-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
            style={{ backgroundColor: color.value }}
            onClick={() => onSelect(color.value)}
            aria-label={`Select ${color.name} color`}
            title={color.name}
          />
        ))}
      </div>
      <div className="p-3 border-t border-gray-200">
        <input
          type="color"
          onChange={(e) => onSelect(e.target.value)}
          className="w-full h-8 rounded cursor-pointer"
          aria-label="Custom color picker"
        />
      </div>
    </div>
  );
  return (
    <div className="flex items-center gap-2 p-3 bg-gradient-to-b from-white to-gray-50 border-b border-gray-200 fixed w-full top-0 z-30 text-sm font-sans print-hidden">
      {/* Undo / Redo */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <Button
          onClick={() => editor.chain().focus().undo().run()}
          icon={Undo}
          label="Undo"
        />
        <Button
          onClick={() => editor.chain().focus().redo().run()}
          icon={Redo}
          label="Redo"
        />
      </div>

      <div className="w-px h-5 bg-gray-300 mx-2" />

      {/* Font Style Dropdown */}
      <Dropdown
        label={getActiveBlock()}
        options={[
          { label: "Normal text", value: "paragraph" },
          { label: "Heading 1", value: { level: 1 } },
          { label: "Heading 2", value: { level: 2 } },
          { label: "Heading 3", value: { level: 3 } },
        ]}
        onSelect={(val) => {
          if (val === "paragraph") {
            editor.chain().focus().setParagraph().run();
          } else {
            editor.chain().focus().toggleHeading(val).run();
          }
        }}
      />

      {/* Font Size Controls */}
      <div className="flex items-center bg-gray-100 rounded-lg border border-gray-200">
        <button
          onClick={() => applyFontSize(Math.max(8, fontSize - 1))}
          className="px-2.5 py-2 hover:bg-gray-200 rounded-l-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <Minus size={16} strokeWidth={2.5} />
        </button>
        <input
          type="text"
          value={fontSize}
          onChange={(e) => {
            const newSize = Number(e.target.value) || 1;
            setFontSize(newSize);
            editor
              .chain()
              .focus()
              .setMark("textStyle", { fontSize: `${newSize}px` })
              .run();
          }}
          className="w-14 text-center bg-transparent border-x border-gray-200 py-2 text-gray-700 font-medium focus:outline-none"
        />
        <button
          onClick={() => applyFontSize(fontSize + 1)}
          className="px-2.5 py-2 hover:bg-gray-200 rounded-r-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div className="w-px h-5 bg-gray-300 mx-2" />

      {/* Text Formatting */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={Bold}
          isActive={editor.isActive("bold")}
          label="Bold"
        />
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={Italic}
          isActive={editor.isActive("italic")}
          label="Italic"
        />
        <Button
          onClick={() => editor.chain().focus().toggleUnderline?.().run()}
          icon={UnderlineIcon}
          isActive={editor.isActive("underline")}
          label="Underline"
        />
        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          icon={Strikethrough}
          isActive={editor.isActive("strike")}
          label="Strikethrough"
        />
      </div>

      <div className="w-px h-5 bg-gray-300 mx-2" />

      {/* Text Color and Highlight */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <div className="relative" ref={textColorPopoverRef}>
          <Button
            onClick={() => {
              setShowTextColorPopover(!showTextColorPopover);
              setShowHighlightPopover(false);
            }}
            icon={Palette}
            label="Text Color"
            isActive={showTextColorPopover}
          />
          <ColorPopover
            colors={textColors}
            onSelect={applyTextColor}
            isOpen={showTextColorPopover}
            ref={textColorPopoverRef as React.RefObject<HTMLDivElement>}
          />
        </div>
        <div className="relative" ref={highlightPopoverRef}>
          <Button
            onClick={() => {
              setShowHighlightPopover(!showHighlightPopover);
              setShowTextColorPopover(false);
            }}
            icon={Highlighter}
            label="Highlight Color"
            isActive={showHighlightPopover}
          />
          <ColorPopover
            colors={highlightColors}
            onSelect={applyHighlightColor}
            isOpen={showHighlightPopover}
            ref={highlightPopoverRef as React.RefObject<HTMLDivElement>}
            isHighlight
          />
        </div>
      </div>
      <div className="w-px h-5 bg-gray-300 mx-2" />

      {/* Subscript and Superscript */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <div className="relative" ref={textColorPopoverRef}>
          <Button
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            icon={Subscript}
            label="Subscript"
            isActive={editor.isActive("subscript")}
          />
        </div>
        <div className="relative" ref={highlightPopoverRef}>
          <Button
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            icon={Superscript}
            label="Superscript"
            isActive={editor.isActive("superscript")}
          />
        </div>
      </div>

      <div className="w-px h-5 bg-gray-300 mx-2" />

      {/* Lists */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={List}
          isActive={editor.isActive("bulletList")}
          label="Bullet List"
        />
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={ListOrdered}
          isActive={editor.isActive("orderedList")}
          label="Ordered List"
        />
      </div>

      <div className="w-px h-5 bg-gray-300 mx-2" />

      {/* Align */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <Button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          icon={AlignLeft}
          isActive={editor.isActive({ textAlign: "left" })}
          label="Align Left"
        />
        <Button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          icon={AlignCenter}
          isActive={editor.isActive({ textAlign: "center" })}
          label="Align Center"
        />
        <Button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          icon={AlignRight}
          isActive={editor.isActive({ textAlign: "right" })}
          label="Align Right"
        />
        <Button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          icon={AlignJustify}
          isActive={editor.isActive({ textAlign: "justify" })}
          label="Justify"
        />
      </div>

      {/* Add Button */}
      <div className="relative" ref={addMenuRef}>
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="flex items-center gap-1 p-2 rounded-lg bg-gray-100 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <Plus size={16} strokeWidth={2.5} /> Add
        </button>

        {showAddMenu && (
          <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded-lg p-3 z-50">
            {/* Upload Image */}
            <div
              className="flex items-center gap-2 mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon size={18} strokeWidth={2.5} />
              <span>Upload Image</span>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Insert Table Grid */}
            <div>
              <span className="text-gray-600 text-sm mb-1 block">
                Insert Table
              </span>
              <div className="grid grid-cols-6 gap-1">
                {Array.from({ length: 6 }).map((_, rowIdx) =>
                  Array.from({ length: 6 }).map((_, colIdx) => (
                    <div
                      key={`${rowIdx}-${colIdx}`}
                      className="w-6 h-6 border border-gray-300 hover:bg-blue-200 cursor-pointer"
                      title={`${rowIdx + 1} x ${colIdx + 1} table`}
                      onMouseEnter={() => {
                        // Optional: highlight current grid selection
                        const cells =
                          addMenuRef.current?.querySelectorAll(".table-cell");
                        cells?.forEach((cell) =>
                          cell.classList.remove("bg-blue-100")
                        );
                        for (let r = 0; r <= rowIdx; r++) {
                          for (let c = 0; c <= colIdx; c++) {
                            const cell = addMenuRef.current?.querySelector(
                              `#cell-${r}-${c}`
                            );
                            cell?.classList.add("bg-blue-100");
                          }
                        }
                      }}
                      onClick={() => insertTable(rowIdx + 1, colIdx + 1)}
                      id={`cell-${rowIdx}-${colIdx}`}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {editor.isActive("table") && (
        <>
          <div className="w-px h-5 bg-gray-300 mx-2" />
          <button
            onClick={() => {
              setShowTableSidebar(true);
              setShowTextColorPopover(false);
              setShowHighlightPopover(false);
            }}
            className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-200/80 bg-gray-100 text-gray-600 flex items-center gap-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Table options"
          >
            <Table2 size={18} strokeWidth={2.5} /> Table Options
          </button>
        </>
      )}

      {showTableSidebar && (
        <TableSidebar
          editor={editor}
          onClose={() => setShowTableSidebar(false)}
        />
      )}
    </div>
  );
}
