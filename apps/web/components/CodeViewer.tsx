'use client'
import { useState, useEffect } from 'react'

type File = FileNode
interface FileNode {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: FileNode[]
}

interface CodeViewerProps {
  slug: string
}

export default function CodeViewer({ slug }: CodeViewerProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string>('')
  const [fileTree, setFileTree] = useState<FileNode[]>([])

  useEffect(() => {
    loadFileTree()
  }, [slug])

  function loadFileTree() {
    const base = `/symbols/${slug}`
    const tree: FileNode[] = [
      { name: 'index.html', path: `${base}/index.html`, type: 'file' },
      { name: 'metadata.json', path: `${base}/metadata.json`, type: 'file' },
      { name: 'schema.json', path: `${base}/schema.json`, type: 'file' },
      { 
        name: 'schemas', 
        path: `${base}/schemas`, 
        type: 'directory',
        children: [] // Will be loaded separately
      }
    ]
    setFileTree(tree)
  }

  async function loadFile(filePath: string) {
    try {
      const res = await fetch(`/api/file?path=${encodeURIComponent(filePath)}`)
      const data = await res.json()
      setFileContent(data.content || '')
      setSelectedFile(filePath)
    } catch (err) {
      console.error('Failed to load file:', err)
      setFileContent('// File not found')
    }
  }

  function renderTree(nodes: FileNode[], level = 0): JSX.Element[] {
    return nodes.map(node => (
      <div key={node.path}>
        <div 
          className="flex items-center gap-2 py-1 hover:bg-white/5 cursor-pointer"
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => node.type === 'file' && loadFile(node.path)}
        >
          <span className="text-xs">{node.type === 'directory' ? '📁' : '📄'}</span>
          <span className="text-sm">{node.name}</span>
        </div>
        {node.children && node.children.length > 0 && renderTree(node.children, level + 1)}
      </div>
    ))
  }

  return (
    <div className="grid grid-cols-[250px_1fr] h-[calc(100vh-200px)] border border-white/10 rounded-xl overflow-hidden">
      {/* File Tree */}
      <div className="bg-[#1e1e1e] p-4 overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-neutral-400">Project Files</h3>
        </div>
        {renderTree(fileTree, 0)}
      </div>

      {/* Code Editor */}
      <div className="bg-[#0B0C10] overflow-hidden">
        {selectedFile ? (
          <div className="h-full flex flex-col">
            <div className="border-b border-white/10 px-4 py-2 flex items-center justify-between">
              <span className="text-sm font-mono">{selectedFile}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(fileContent)}
                className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded"
              >
                Copy
              </button>
            </div>
            <pre className="flex-1 overflow-auto p-4 text-xs font-mono text-neutral-300 whitespace-pre-wrap break-all">
              {fileContent}
            </pre>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-neutral-400">
            Select a file to view
          </div>
        )}
      </div>
    </div>
  )
}

