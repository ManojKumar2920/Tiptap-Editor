import { create } from 'zustand';
import {type Editor} from '@tiptap/react';

interface EditorState {
    editor: Editor | null
    paddingLeft?: number;
    paddingRight?: number;
    setPaddingLeft?: (value: number) => void;
    setPaddingRight?: (value: number) => void;
    setEditor: (editor: Editor | null) => void
  }
  
export const useEditorState = create<EditorState>((set)=>({
    editor:null,
    setEditor: (editor) => set({editor}),
    paddingLeft: 40,
    paddingRight: 40,
    setPaddingLeft: (value)=>set({paddingLeft:value}),
    setPaddingRight: (value)=>set({paddingRight:value}),
}))