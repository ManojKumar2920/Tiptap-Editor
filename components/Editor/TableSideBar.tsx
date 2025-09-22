"use client"
import { Editor } from "@tiptap/react"
import { X } from "lucide-react"

export function TableSidebar({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  if (!editor) return null

  return (
    <div className="fixed right-0 top-0 h-full w-72 bg-gradient-to-b from-white to-gray-50 border-l border-gray-200 shadow-xl p-5 z-50 transition-transform duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Table Options</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label="Close sidebar"
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Column Controls */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">Columns</h3>
          <div className="grid gap-2">
            <button
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              className="w-full px-4 py-2.5 text-sm text-gray-700 font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Add Column Before
            </button>
            <button
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="w-full px-4 py-2.5 text-sm text-gray-700 font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Add Column After
            </button>
            <button
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="w-full px-4 py-2.5 text-sm text-gray-700 font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Delete Column
            </button>
          </div>
        </div>

        {/* Row Controls */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">Rows</h3>
          <div className="grid gap-2">
            <button
              onClick={() => editor.chain().focus().addRowBefore().run()}
              className="w-full px-4 py-2.5 text-sm text-gray-700 font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Add Row Before
            </button>
            <button
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="w-full px-4 py-2.5 text-sm text-gray-700 font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Add Row After
            </button>
            <button
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="w-full px-4 py-2.5 text-sm text-gray-700 font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Delete Row
            </button>
          </div>
        </div>

        {/* Cell Controls */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">Cells</h3>
          <div className="grid gap-2">
            <button
              onClick={() => editor.chain().focus().mergeCells().run()}
              className="w-full px-4 py-2.5 text-sm text-gray-700 font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Merge Cells
            </button>
            <button
              onClick={() => editor.chain().focus().splitCell().run()}
              className="w-full px-4 py-2.5 text-sm text-gray-700 font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Split Cell
            </button>
          </div>
        </div>

        {/* Table Controls */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">Table</h3>
          <button
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="w-full px-4 py-2.5 text-sm text-red-600 font-medium bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Delete Table
          </button>
        </div>
      </div>
    </div>
  )
}