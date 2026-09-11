import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const forwardUrl = `${API_URL}${url.pathname}${url.search}`;
  const response = await fetch(forwardUrl, {
    headers: request.headers,
    method: 'GET',
  });
  return new NextResponse(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const forwardUrl = `${API_URL}${url.pathname}${url.search}`;
  const body = await request.text();
  const response = await fetch(forwardUrl, {
    headers: request.headers,
    method: 'POST',
    body,
  });
  return new NextResponse(response.body, {
    status: response.status,
    headers: response.headers,
  });
}
