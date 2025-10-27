import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const filePath = searchParams.get('path')

  if (!filePath) {
    return NextResponse.json({ ok: false, message: 'No path provided' }, { status: 400 })
  }

  try {
    // Remove leading slash and decode
    const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath
    const fullPath = path.join(process.cwd(), 'apps/web/public', cleanPath)
    
    // Security: ensure we're within public directory
    const publicDir = path.join(process.cwd(), 'apps/web/public')
    const resolvedPath = path.resolve(fullPath)
    
    if (!resolvedPath.startsWith(publicDir)) {
      return NextResponse.json({ ok: false, message: 'Invalid path' }, { status: 403 })
    }

    const content = fs.readFileSync(fullPath, 'utf-8')
    return NextResponse.json({ ok: true, content })
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 })
  }
}

