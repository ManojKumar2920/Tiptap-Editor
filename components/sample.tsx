'use client'
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import { TextStyle } from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import FontFamily from "@tiptap/extension-font-family"
import FontSize from "tiptap-extension-font-size"
import TextAlign from "@tiptap/extension-text-align"
import ListItem from "@tiptap/extension-list-item"
import Image from "@tiptap/extension-image"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import { TableRow } from "@tiptap/extension-table-row"
import { TableCell } from "@tiptap/extension-table-cell"
import PaginationExtension, { PageNode, HeaderFooterNode, BodyNode } from "tiptap-extension-pagination"
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  ChevronDown,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImagePlus,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Redo,
  Strikethrough,
  SubscriptIcon,
  SuperscriptIcon,
  UnderlineIcon,
  Undo,
  Unlink,
  Palette,
  Upload,
  Table as TableIcon,
  X,
  Plus,
  Minus,
  Trash2,
  RotateCcw,
  Move,
} from "lucide-react"
import { Table, TableHeader } from "@tiptap/extension-table"
import { editorContent } from "@/lib/editor"

const fonts = [
  { label: "System", value: "system" },
  { label: "Inter", value: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: '"Times New Roman", Times, serif' },
  { label: "Courier New", value: '"Courier New", Courier, monospace' },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
]

const fontSizes = ["8px", "9px", "10px", "11px", "12px", "14px", "16px", "18px", "24px", "32px", "48px", "64px"]

const textSwatches = [
  "#000000",
  "#374151",
  "#6B7280",
  "#9CA3AF",
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#10B981",
  "#06B6D4",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#FFFFFF",
]

const highlightSwatches = [
  "#FEF08A",
  "#FDE68A",
  "#FFEDD5",
  "#DCFCE7",
  "#E0F2FE",
  "#E9D5FF",
  "#FCE7F3",
  "#FFE4E6",
  "#E5E7EB",
  "#F3F4F6",
]

// Custom Image extension with resizing
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        renderHTML: attributes => {
          if (!attributes.width) return {}
          return { width: attributes.width }
        },
      },
      height: {
        default: null,
        renderHTML: attributes => {
          if (!attributes.height) return {}
          return { height: attributes.height }
        },
      },
    }
  },
})

function IconButton({
  onClick,
  ariaLabel,
  active = false,
  children,
  disabled,
  variant = "default",
}: {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  ariaLabel?: string;
  active?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
  variant?: "default" | "primary" | "danger";
}){
  const baseClasses = "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors"
  const variantClasses = {
    default: `text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 ${active ? "bg-neutral-100 text-neutral-900" : ""}`,
    primary: "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700",
    danger: "text-red-600 hover:bg-red-50 active:bg-red-100"
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className="mx-1 h-6 w-px bg-neutral-200" aria-hidden="true" />
}

export default function TiptapEditor() {
  const [tick, setTick] = useState(0)
  const [headingOpen, setHeadingOpen] = useState(false)
  const [fontOpen, setFontOpen] = useState(false)
  const [sizeOpen, setSizeOpen] = useState(false)
  const [textColorOpen, setTextColorOpen] = useState(false)
  const [highlightOpen, setHighlightOpen] = useState(false)
  const [addMenuOpen, setAddMenuOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<HTMLElement | null>(null)
  const [showTableControls, setShowTableControls] = useState(false)

  const headingRef = useRef(null)
  const fontRef = useRef(null)
  const sizeRef = useRef(null)
  const textColorRef = useRef(null)
  const highlightRef = useRef(null)
  const addMenuRef = useRef(null)
  const fileInputRef = useRef(null)

  const extensions = useMemo(() => [
    StarterKit.configure({
      listItem: false,
    }),
    PaginationExtension.configure({
      defaultPaperSize: "A4",
      defaultPaperOrientation: "portrait",
      defaultMarginConfig: { top: 25.4, right: 25.4, bottom: 25.4, left: 25.4 },
      defaultPageBorders:{ top: 1, right: 1, bottom: 1, left: 1 },
      pageAmendmentOptions: {
        enableHeader: true,
        enableFooter: true,
      },
    }),
    PageNode,
    HeaderFooterNode,
    BodyNode,
    ListItem,
    Underline,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      HTMLAttributes: {
        rel: "noopener noreferrer",
        target: "_blank",
        class: "text-blue-500 underline hover:text-blue-600"
      },
    }),
    FontFamily.configure({ types: ["textStyle"] }),
    FontSize,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    ResizableImage.configure({
      HTMLAttributes: {
        referrerPolicy: "no-referrer",
        class: "resizable-image max-w-full h-auto rounded-lg shadow-sm cursor-pointer"
      },
      allowBase64: true,
    }),
    Subscript,
    Superscript,
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: "border-collapse border border-neutral-300 w-full my-4"
      }
    }),
    TableRow.configure({
      HTMLAttributes: {
        class: "border-b border-neutral-200"
      }
    }),
    TableHeader.configure({
      HTMLAttributes: {
        class: "border border-neutral-300 bg-neutral-50 p-2 font-semibold text-left"
      }
    }),
    TableCell.configure({
      HTMLAttributes: {
        class: "border border-neutral-300 p-2"
      }
    }),
  ], [])

  const editor = useEditor({
    content: editorContent,
    immediatelyRender: false,
    extensions: extensions as any,
    editorProps: {
      attributes: {
        class: " focus:outline-none",
      },
      handleClick: (view, pos, event) => {
        const target = event.target as HTMLElement
        
        // Handle image selection
        if (target.tagName === 'IMG') {
          setSelectedImage(target)
          return false
        } else {
          setSelectedImage(null)
        }

        // Handle table selection
        const tableCell = target.closest('td, th')
        if (tableCell) {
          setShowTableControls(true)
        } else {
          setShowTableControls(false)
        }
        
        return false
      },
    },
    
  })

  // Re-render on selection/transaction changes
  useEffect(() => {
    if (!editor) return
    const update = () => setTick(t => t + 1)
    editor.on("selectionUpdate", update)
    editor.on("transaction", update)
    return () => {
      editor.off("selectionUpdate", update)
      editor.off("transaction", update)
    }
  }, [editor])

  // Image resize functionality
  useEffect(() => {
    if (!selectedImage) return

    const handleMouseDown = (e: MouseEvent) => {
      if (e.target !== selectedImage) return
      
      e.preventDefault()
      const startX = e.clientX
      const startY = e.clientY
      const startWidth = selectedImage.offsetWidth
      const startHeight = selectedImage.offsetHeight
      const aspectRatio = startWidth / startHeight

      const handleMouseMove = (e: MouseEvent) => {
        const width = Math.max(50, startWidth + (e.clientX - startX))
        const height = width / aspectRatio
        
        selectedImage.style.width = `${width}px`
        selectedImage.style.height = `${height}px`
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        
        // Update the editor with new dimensions
        if (editor) {
          const { view } = editor
          const pos = view.posAtDOM(selectedImage, 0)
          const tr = view.state.tr.setNodeMarkup(pos, null, {
            ...selectedImage.attributes,
            width: selectedImage.style.width,
            height: selectedImage.style.height,
          })
          view.dispatch(tr)
        }
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    selectedImage.addEventListener('mousedown', handleMouseDown)
    selectedImage.style.border = '2px dashed #3b82f6'
    selectedImage.style.cursor = 'nw-resize'

    return () => {
      selectedImage.removeEventListener('mousedown', handleMouseDown)
      selectedImage.style.border = ''
      selectedImage.style.cursor = 'pointer'
    }
  }, [selectedImage, editor])

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        headingOpen &&
        headingRef.current &&
        (headingRef.current as Element).contains &&
        !(headingRef.current as Element).contains(target)
      )
        setHeadingOpen(false);
      if (
        fontOpen &&
        fontRef.current &&
        (fontRef.current as Element).contains &&
        !(fontRef.current as Element).contains(target)
      )
        setFontOpen(false);
      if (
        sizeOpen &&
        sizeRef.current &&
        (sizeRef.current as Element).contains &&
        !(sizeRef.current as Element).contains(target)
      )
        setSizeOpen(false);
      if (
        textColorOpen &&
        textColorRef.current &&
        (textColorRef.current as Element).contains &&
        !(textColorRef.current as Element).contains(target)
      )
        setTextColorOpen(false);
      if (
        highlightOpen &&
        highlightRef.current &&
        (highlightRef.current as Element).contains &&
        !(highlightRef.current as Element).contains(target)
      )
        setHighlightOpen(false);
      if (
        addMenuOpen &&
        addMenuRef.current &&
        (addMenuRef.current as Element).contains &&
        !(addMenuRef.current as Element).contains(target)
      )
        setAddMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [headingOpen, fontOpen, sizeOpen, textColorOpen, highlightOpen, addMenuOpen])

  if (!editor) return null

  const handleImageUpload = (e: { target: { files: any[] } }) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const src = event.target?.result
        if (typeof src === "string") {
          editor.chain().focus().setImage({ src, width: 300 }).run()
        }
      }
      reader.readAsDataURL(file)
    }
    // Reset input
    if (fileInputRef.current && "value" in fileInputRef.current) {
      (fileInputRef.current as HTMLInputElement).value = '';
    }
    setAddMenuOpen(false)
  }

  const insertImageFromUrl = () => {
    const url = window.prompt("Enter image URL:")
    if (url) {
      editor.chain().focus().setImage({ src: url, width: 300 }).run()
    }
    setAddMenuOpen(false)
  }

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    setAddMenuOpen(false)
    setShowTableControls(true)
  }

  const applyLink = () => {
    const previousUrl = editor.getAttributes("link").href || ""
    const url = window.prompt("Enter URL:", previousUrl)
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
    } else if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }
  }

  const resizeSelectedImage = (percentage: number) => {
    if (!selectedImage) return
    const currentWidth = selectedImage.offsetWidth
    const newWidth = Math.max(50, currentWidth * (percentage / 100))
    const aspectRatio = selectedImage.offsetWidth / selectedImage.offsetHeight
    const newHeight = newWidth / aspectRatio
    
    selectedImage.style.width = `${newWidth}px`
    selectedImage.style.height = `${newHeight}px`
  }

  const resetImageSize = () => {
    if (!selectedImage) return
    selectedImage.style.width = '300px'
    selectedImage.style.height = 'auto'
  }

  const isActive = (name: string, attrs: {} | undefined) => {
    try {
      return editor.isActive(name, attrs)
    } catch {
      return false
    }
  }

  const getBlockLabel = () => {
    if (isActive("heading", { level: 1 })) return "H1"
    if (isActive("heading", { level: 2 })) return "H2"
    if (isActive("heading", { level: 3 })) return "H3"
    return "P"
  }

  const setBlock = (type: string) => {
    const chain = editor.chain().focus()
    switch (type) {
      case "paragraph":
        chain.setParagraph().run()
        break
      case "h1":
        chain.toggleHeading({ level: 1 }).run()
        break
      case "h2":
        chain.toggleHeading({ level: 2 }).run()
        break
      case "h3":
        chain.toggleHeading({ level: 3 }).run()
        break
    }
    setHeadingOpen(false)
  }

  const setFont = (value: string) => {
    const chain = editor.chain().focus()
    if (value === "system") {
      chain.unsetFontFamily().run()
    } else {
      chain.setFontFamily(value).run()
    }
    setFontOpen(false)
  }

  const setFontSize = (value: string) => {
    editor.chain().focus().setFontSize(value).run()
    setSizeOpen(false)
  }

  const currentFont = editor.getAttributes("textStyle")?.fontFamily
  const currentSize = editor.getAttributes("textStyle")?.fontSize

  return (
    <div className="w-full max-w-6xl mx-auto border border-neutral-200 rounded-lg bg-white">
      {/* Toolbar */}
      <div className="sticky top-0 z-50 border-b bg-neutral-50/95 backdrop-blur-sm rounded-t-lg">
        <div className="flex items-center gap-1 p-3 flex-wrap">
          {/* Undo/Redo */}
          <IconButton
            ariaLabel="Undo"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </IconButton>
          <IconButton
            ariaLabel="Redo"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </IconButton>

          <Divider />

          {/* Block Type */}
          <div className="relative" ref={headingRef}>
            <button
              type="button"
              onClick={() => setHeadingOpen(!headingOpen)}
              className="inline-flex h-8 items-center gap-1 rounded-full px-3 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 text-sm font-medium"
            >
              {getBlockLabel()}
              <ChevronDown className="h-4 w-4" />
            </button>
            {headingOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-10">
                {[
                  { label: "Normal text", value: "paragraph", icon: "P" },
                  { label: "Heading 1", value: "h1", icon: <Heading1 className="h-4 w-4" /> },
                  { label: "Heading 2", value: "h2", icon: <Heading2 className="h-4 w-4" /> },
                  { label: "Heading 3", value: "h3", icon: <Heading3 className="h-4 w-4" /> },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setBlock(item.value)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-neutral-50"
                  >
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-neutral-100 text-xs font-semibold">
                      {typeof item.icon === "string" ? item.icon : item.icon}
                    </span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Family */}
          <div className="relative" ref={fontRef}>
            <button
              type="button"
              onClick={() => setFontOpen(!fontOpen)}
              className="inline-flex h-8 items-center gap-2 rounded-full bg-neutral-100 px-3 text-sm text-neutral-700 hover:bg-neutral-200"
            >
              <span className="truncate max-w-[120px]">
                {currentFont ? (fonts.find(f => f.value === currentFont)?.label || "Custom") : "Font"}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {fontOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white border border-neutral-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                {fonts.map((font) => (
                  <button
                    key={font.label}
                    onClick={() => setFont(font.value)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-neutral-50"
                    style={{ fontFamily: font.value === "system" ? undefined : font.value }}
                  >
                    {font.label}
                    {(currentFont === font.value || (font.value === "system" && !currentFont)) && (
                      <span className="text-blue-500">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Size */}
          <div className="relative" ref={sizeRef}>
            <button
              type="button"
              onClick={() => setSizeOpen(!sizeOpen)}
              className="inline-flex h-8 items-center gap-2 rounded-full bg-neutral-100 px-3 text-sm text-neutral-700 hover:bg-neutral-200"
            >
              <span>{currentSize ? parseInt(currentSize) : 14}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {sizeOpen && (
              <div className="absolute left-0 mt-2 w-20 bg-white border border-neutral-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                {fontSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-neutral-50"
                  >
                    {parseInt(size)}
                    {currentSize === size && <span className="text-blue-500">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Divider />

          {/* Formatting */}
          <IconButton ariaLabel="Bold" onClick={(e) => editor.chain().focus().toggleBold().run()} active={isActive("bold", undefined)}>
            <Bold className="h-4 w-4" />
          </IconButton>
          <IconButton ariaLabel="Italic" onClick={(e) => editor.chain().focus().toggleItalic().run()} active={isActive("italic", undefined)}>
            <Italic className="h-4 w-4" />
          </IconButton>
          <IconButton ariaLabel="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} active={isActive("underline", undefined)}>
            <UnderlineIcon className="h-4 w-4" />
          </IconButton>
          <IconButton ariaLabel="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} active={isActive("strike", undefined)}>
            <Strikethrough className="h-4 w-4" />
          </IconButton>
          <IconButton ariaLabel="Code" onClick={() => editor.chain().focus().toggleCode().run()} active={isActive("code", undefined)}>
            <Code className="h-4 w-4" />
          </IconButton>
          <IconButton ariaLabel="Superscript" onClick={() => editor.chain().focus().toggleSuperscript().run()} active={isActive("superscript", undefined)}>
            <SuperscriptIcon className="h-4 w-4" />
          </IconButton>
          <IconButton ariaLabel="Subscript" onClick={() => editor.chain().focus().toggleSubscript().run()} active={isActive("subscript", undefined)}>
            <SubscriptIcon className="h-4 w-4" />
          </IconButton>

          <Divider />

          {/* Lists */}
          <IconButton ariaLabel="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} active={isActive("bulletList", undefined)}>
            <List className="h-4 w-4" />
          </IconButton>
          <IconButton ariaLabel="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={isActive("orderedList", undefined)}>
            <ListOrdered className="h-4 w-4" />
          </IconButton>

          <Divider />

          {/* Alignment */}
          <IconButton ariaLabel="Align Left" onClick={() => editor.chain().focus().setTextAlign("left").run()}>
            <AlignLeft className="h-4 w-4" />
          </IconButton>
          <IconButton ariaLabel="Align Center" onClick={() => editor.chain().focus().setTextAlign("center").run()} >
            <AlignCenter className="h-4 w-4" />
          </IconButton>
          <IconButton ariaLabel="Align Right" onClick={() => editor.chain().focus().setTextAlign("right").run()} >
            <AlignRight className="h-4 w-4" />
          </IconButton>
          <IconButton ariaLabel="Justify" onClick={() => editor.chain().focus().setTextAlign("justify").run()} >
            <AlignJustify className="h-4 w-4" />
          </IconButton>

          <Divider />

          {/* Link */}
          <IconButton ariaLabel="Add Link" onClick={() => applyLink()} active={isActive("link", undefined)}>
            <LinkIcon className="h-4 w-4" />
          </IconButton>
          <IconButton ariaLabel="Remove Link" onClick={() => editor.chain().focus().unsetLink().run()} active={isActive("link", undefined)}>
            <Unlink className="h-4 w-4" />
          </IconButton>

          <Divider />

          {/* Text Color */}
          <div className="relative" ref={textColorRef}>
            <IconButton ariaLabel="Text Color" onClick={() => setTextColorOpen(!textColorOpen)}>
              <Palette className="h-4 w-4" />
            </IconButton>
            {textColorOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-neutral-200 rounded-lg shadow-lg p-3 z-10">
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {textSwatches.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        editor.chain().focus().setColor(color).run()
                        setTextColorOpen(false)
                      }}
                      className="h-6 w-6 rounded border border-neutral-200 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <button onClick={() => editor.chain().focus().unsetColor().run()} className="text-sm text-neutral-600 hover:underline">
                    Reset
                  </button>
                  <input
                    type="color"
                    onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                    className="h-6 w-12 border border-neutral-200 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Highlight */}
          <div className="relative" ref={highlightRef}>
            <IconButton ariaLabel="Highlight" onClick={() => setHighlightOpen(!highlightOpen)}>
              <Highlighter className="h-4 w-4" />
            </IconButton>
            {highlightOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-neutral-200 rounded-lg shadow-lg p-3 z-10">
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {highlightSwatches.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        editor.chain().focus().setHighlight({ color }).run()
                        setHighlightOpen(false)
                      }}
                      className="h-6 w-6 rounded border border-neutral-200 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <button onClick={() => editor.chain().focus().unsetHighlight().run()} className="text-sm text-neutral-600 hover:underline">
                    Remove
                  </button>
                  <input
                    type="color"
                    onChange={(e) => editor.chain().focus().setHighlight({ color: e.target.value }).run()}
                    className="h-6 w-12 border border-neutral-200 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="ml-auto" />

          {/* Add Menu */}
          <div className="relative" ref={addMenuRef}>
            <button
              type="button"
              onClick={() => setAddMenuOpen(!addMenuOpen)}
              className="inline-flex h-8 items-center gap-2 rounded-md px-3 text-sm bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <ImagePlus className="h-4 w-4" />
              Add
            </button>
            {addMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => (fileInputRef.current as HTMLInputElement | null)?.click()}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-neutral-50"
                >
                  <Upload className="h-4 w-4" />
                  Upload Image
                </button>
                <button
                  onClick={insertImageFromUrl}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-neutral-50"
                >
                  <ImagePlus className="h-4 w-4" />
                  Image from URL
                </button>
                <button
                  onClick={insertTable}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-neutral-50"
                >
                  <TableIcon className="h-4 w-4" />
                  Insert Table
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Image Controls */}
        {selectedImage && (
          <div className="border-t bg-blue-50 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-800">Image Controls:</span>
              <button
                onClick={() => resizeSelectedImage(50)}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                50%
              </button>
              <button
                onClick={() => resizeSelectedImage(75)}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                75%
              </button>
              <button
                onClick={() => resizeSelectedImage(125)}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                125%
              </button>
              <button
                onClick={() => resizeSelectedImage(150)}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                150%
              </button>
              <button
                onClick={resetImageSize}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* Table Controls */}
        {showTableControls && (
          <div className="border-t bg-green-50 px-3 py-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-green-800">Table Controls:</span>
              <button
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Col Before
              </button>
              <button
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Col After
              </button>
              <button
                onClick={() => editor.chain().focus().deleteColumn().run()}
                className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 flex items-center gap-1"
              >
                <Minus className="h-3 w-3" />
                Col
              </button>
              <button
                onClick={() => editor.chain().focus().addRowBefore().run()}
                className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Row Before
              </button>
              <button
                onClick={() => editor.chain().focus().addRowAfter().run()}
                className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Row After
              </button>
              <button
                onClick={() => editor.chain().focus().deleteRow().run()}
                className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 flex items-center gap-1"
              >
                <Minus className="h-3 w-3" />
                Row
              </button>
              <button
                onClick={() => editor.chain().focus().deleteTable().run()}
                className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                Delete Table
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Editor Container with A4 styling */}
      <div className="bg-gray-100 min-h-[600px] p-8">
        <div className="mx-auto">
          <EditorContent
            editor={editor}
          />
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload({ target: { files: e.target.files ? Array.from(e.target.files) : [] } })}
        className="hidden"
      />
      
      <style jsx global>{`

.tiptap {
  outline: none;
  line-height: 1.6;
  font-size: 12pt;
  color: #000;
}

.tiptap h1 {
  font-size: 24pt;
  font-weight: 700;
  line-height: 1.2;
  margin: 1.5em 0 0.75em 0;
  color: #000;
  page-break-after: avoid;
}

.tiptap h2 {
  font-size: 18pt;
  font-weight: 600;
  line-height: 1.3;
  margin: 1.25em 0 0.5em 0;
  color: #000;
  page-break-after: avoid;
}

.tiptap h3 {
  font-size: 14pt;
  font-weight: 600;
  line-height: 1.3;
  margin: 1em 0 0.25em 0;
  color: #000;
  page-break-after: avoid;
}

.tiptap p {
  margin: 0.5em 0;
  text-align: justify;
  text-indent: 0;
}

.tiptap ul, .tiptap ol {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.tiptap li {
  margin: 0.25em 0;
  page-break-inside: avoid;
}

.tiptap code {
  background-color: #f3f4f6;
  color: #dc2626;
  padding: 0.125em 0.25em;
  border-radius: 0.125em;
  font-size: 0.875em;
  font-family: 'Courier New', Courier, monospace;
}

.tiptap blockquote {
  border-left: 4px solid #d1d5db;
  margin: 1em 0;
  padding-left: 1em;
  font-style: italic;
  color: #6b7280;
}

/* Enhanced Image Styling */
.tiptap img {
  max-width: 100%;
  height: auto;
  border-radius: 0.25em;
  margin: 0.5em 0;
  display: block;
  page-break-inside: avoid;
}

.tiptap img.resizable-image {
  cursor: pointer;
  transition: all 0.2s ease;
}

.tiptap img.resizable-image:hover {
  transform: scale(1.02);
}

/* Enhanced Table Styling */
.tiptap table {
  border-collapse: collapse;
  margin: 1em 0;
  width: 100%;
  page-break-inside: avoid;
}

.tiptap th, .tiptap td {
  border: 1px solid #000;
  padding: 0.5em;
  text-align: left;
  vertical-align: top;
}

.tiptap th {
  background-color: #f9fafb;
  font-weight: 600;
  page-break-after: avoid;
}

.tiptap tr {
  page-break-inside: avoid;
}

.tiptap a {
  color: #0066cc;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.tiptap a:hover {
  color: #0052a3;
}

.tiptap strong {
  font-weight: 600;
}

.tiptap em {
  font-style: italic;
}

.tiptap s {
  text-decoration: line-through;
}

.tiptap u {
  text-decoration: underline;
}

.tiptap sup {
  font-size: 0.75em;
  vertical-align: super;
}

.tiptap sub {
  font-size: 0.75em;
  vertical-align: sub;
}

.tiptap ::selection {
  background-color: rgba(59, 130, 246, 0.2);
}

.tiptap .selectedCell:after {
  background: rgba(59, 130, 246, 0.1);
  content: "";
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  position: absolute;
  z-index: 2;
}

.tiptap .column-resize-handle {
  background-color: #3b82f6;
  bottom: -2px;
  position: absolute;
  right: -2px;
  top: 0;
  width: 4px;
  pointer-events: auto;
}

.tiptap .tableWrapper {
  overflow-x: auto;
  margin: 1em 0;
}

.tiptap .resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}

.tiptap:focus-within {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.tiptap .ProseMirror-gapcursor:after {
  border-color: #3b82f6;
}

/* Page break utilities for printing */
.page-break {
  page-break-before: always;
}

.avoid-break {
  page-break-inside: avoid;
}
`}</style>

    </div>
  )
}