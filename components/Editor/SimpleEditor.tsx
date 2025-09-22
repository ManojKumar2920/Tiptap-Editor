"use client";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useEditorState } from "@/store/editor-store";
import Commands from "../Suggestions/Commands";
import getSuggestionItems from "../Suggestions/Items";
import renderItems from "../Suggestions/RenderItems";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import { VettamPagination } from "@/extensions/VettamPagination";
import { TableKit } from "@tiptap/extension-table";

const PAGE_WIDTH = 816;
const PAGE_HEIGHT = 1056;
const HEADER_HEIGHT = 40;
const FOOTER_HEIGHT = 40;
const LIMIT = 10000;

export default function TextEditor() {
  const { editor, setEditor, paddingLeft, paddingRight } = useEditorState();
  const [charactersCount, setCharactersCount] = useState(0);
  const [wordsCount, setWordsCount] = useState(0);

  const mainExtensions = [
    StarterKit,
    Commands.configure({
      suggestion: {
        items: getSuggestionItems,
        render: renderItems,
      },
    }),
    TextStyle,
    FontSize,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    Color,
    Highlight.configure({ multicolor: true }),
    Subscript,
    Superscript,
    Image,
    ImageResize,
    Placeholder.configure({
      placeholder: "Write something …",
    }),

    CharacterCount.configure({
      limit: LIMIT,
    }),
    TableKit.configure({
      table: { resizable: true },
    }),
    VettamPagination.configure({
      pageHeight: PAGE_HEIGHT,
      pageGap: 40,
      pageBreakBackground: "#f9fbfd",
      pageHeaderHeight: HEADER_HEIGHT,
      pageFooterHeight: FOOTER_HEIGHT,
      headerLeft: "Vettam Editor Header",
      marginTop: 30,
      marginBottom: 30,
      marginLeft: paddingLeft,
      marginRight: paddingRight,
      contentMarginTop: 30,
      contentMarginBottom: 30,
    }),
    
  ];

  const mainEditor = useEditor({
    extensions: mainExtensions,
    autofocus: true,
    immediatelyRender: false,
    content: `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc aliquam dolor eget volutpat luctus. Phasellus interdum ipsum at augue euismod porttitor. Nam porta, ante quis consectetur fermentum, enim neque mollis nunc, in pretium ex ipsum eget magna. Nulla at odio fringilla, convallis nunc eu, feugiat nunc. Suspendisse suscipit, elit a sagittis congue, ipsum turpis convallis arcu, quis ultricies ligula sapien fringilla est. Vivamus massa ligula, tristique vel purus consectetur, molestie tristique tellus. Curabitur nunc velit, tincidunt sit amet ligula scelerisque, posuere rhoncus enim. In pellentesque tempus ex nec egestas. Nulla ut scelerisque erat, ac interdum ante. Vivamus sed fermentum nisi.

Sed ut pretium massa. Vestibulum et justo est. Proin ultricies imperdiet lacus sed semper. Vestibulum rhoncus gravida aliquet. Fusce consectetur vel mi ut mollis. Mauris interdum massa felis. Aenean in convallis erat, at vehicula neque.

<table>
          <tbody>
            <tr>
              <th>Name</th>
              <th colspan="3">Description</th>
            </tr>
            <tr>
              <td>Cyndi Lauper</td>
              <td>Singer</td>
              <td>Songwriter</td>
              <td>Actress</td>
            </tr>
          </tbody>
        </table>

Nulla maximus sagittis tortor et fringilla. Nulla feugiat lobortis nisl vel finibus. Fusce quis nibh scelerisque, pharetra tortor quis, semper arcu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse sed magna in neque pulvinar condimentum sit amet dictum arcu. In at augue sit amet lacus cursus semper. Morbi eget enim nibh. Pellentesque eget volutpat mauris. Pellentesque ullamcorper erat nec nisl venenatis finibus. Donec accumsan ex magna, non pharetra arcu pulvinar in. Aliquam maximus blandit est quis auctor. Aenean eu quam eu elit consequat interdum. Ut eget porta tortor, euismod elementum massa. Nullam nec vestibulum lectus. Maecenas euismod vestibulum nulla, et tempor lacus consectetur vel.

`,
    editorProps: {
      attributes: {
        style: `margin-left: ${paddingLeft}px; margin-right: ${paddingRight}px; line-height: 1.5;`,
        class: "focus:outline-none prose prose-sm max-w-none  cursor-text",
      },
    },
    onCreate({ editor }) {
      setEditor(editor);
      updateCounts(editor);
    },
    onDestroy() {
      setEditor(null);
    },
    onUpdate({ editor }) {
      setEditor(editor);
      updateCounts(editor);
    },
    onSelectionUpdate({ editor }) {
      setEditor(editor);
    },
    onTransaction({ editor }) {
      setEditor(editor);
    },
    onBlur({ editor }) {
      setEditor(editor);
    },
    onFocus({ editor }) {
      setEditor(editor);
    },
    onContentError({ editor }) {
      setEditor(editor);
    },
  });

  interface CharacterCountStorage {
    characters: () => number;
    words: () => number;
  }

  interface EditorWithCharacterCount {
    storage: {
      characterCount: CharacterCountStorage;
      [key: string]: any;
    };
    [key: string]: any;
  }

  function updateCounts(
    editor: EditorWithCharacterCount | null | undefined
  ): void {
    setCharactersCount(editor?.storage.characterCount.characters() ?? 0);
    setWordsCount(editor?.storage.characterCount.words() ?? 0);
  }

  useEffect(() => {
    if (mainEditor) {
      // Access the pagination extension and update its options directly
      const pagination = mainEditor.extensionManager.extensions.find(
        (ext) => ext.name === "paginationPlus"
      );
      if (pagination && typeof pagination.options === "object") {
        pagination.options.marginLeft = paddingLeft;
        pagination.options.marginRight = paddingRight;
      }
    }
  }, [paddingLeft, paddingRight, mainEditor]);



  // CSS for page breaking (kept for print compatibility)
  const pageBreakStyles = `
    @media screen {
      .page-container {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      .page-content {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      .page-content > * {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      .page-content > p, .page-content > div, .page-content > ul, .page-content > ol {
        break-after: auto;
        page-break-after: auto;
      }
    }
    @media print {
      .page-container {
        break-after: page;
        page-break-after: always;
        width: ${PAGE_WIDTH}px;
        height: ${PAGE_HEIGHT}px;
      }
      .page-content {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      .page-content > * {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      .page-content > p, .page-content > div, .page-content > ul, .page-content > ol {
        break-after: auto;
        page-break-after: auto;
      }
    }
  `;

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <style>{pageBreakStyles}</style>
      <div
        style={{
          width: `${PAGE_WIDTH}px`,
          border: "1px solid #d1d5db",
          background: "#fff",
        }}
      >
        {mainEditor && <EditorContent editor={mainEditor} />}
      </div>

      <div
        className={`character-count fixed left-10 bottom-10 ${
          charactersCount >= LIMIT ? "character-count--warning" : ""
        }`}
      >
        <div className="counts">
          {charactersCount} / {LIMIT} characters
          <br />
          {wordsCount} words
        </div>
      </div>
    </div>
  );
}
function convertTextNode(content: JSONContent): any {
  throw new Error("Function not implemented.");
}
