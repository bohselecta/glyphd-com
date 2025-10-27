import { NextResponse } from 'next/server'
const comments:Record<string,{id:string;by:string;body:string;createdAt:number}[]>= {}
export async function GET(req:Request){const url=new URL(req.url);const markId=url.searchParams.get('markId')||'';const cursor=parseInt(url.searchParams.get('cursor')||'0',10);const pageSize=20;const list=comments[markId]||[];const items=list.slice(cursor,cursor+pageSize);const nextCursor=cursor+pageSize<list.length?String(cursor+pageSize):undefined;return NextResponse.json({items,nextCursor})}
