/**
 * 百度语音合成 API 路由
 * Next.js API Route for Baidu TTS
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Token 缓存（内存中缓存，避免频繁请求）
let cachedToken: string | null = null;
let tokenExpireTime: number = 0;

// 简单的内存速率限制
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 分钟
const RATE_LIMIT_MAX = 30; // 每分钟最多 30 次

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(clientId);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

/**
 * 获取百度 Access Token
 */
async function getBaiduAccessToken(): Promise<string> {
  const now = Date.now();

  if (cachedToken && now < tokenExpireTime) {
    return cachedToken;
  }

  const apiKey = process.env.BAIDU_API_KEY;
  const secretKey = process.env.BAIDU_SECRET_KEY;

  if (!apiKey || !secretKey) {
    throw new Error('Baidu API credentials not configured');
  }

  const response = await fetch(
    `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`,
    { method: 'POST' }
  );

  const data = await response.json();

  if (data.access_token) {
    cachedToken = data.access_token as string;
    tokenExpireTime = now + (29 * 24 * 60 * 60 * 1000);
    return cachedToken!;
  }

  throw new Error('Failed to get access token');
}

/**
 * POST /api/tts
 * 请求体: { text: string, lang?: 'zh' | 'en', spd?: number, pit?: number, vol?: number, per?: number }
 * 返回: 音频文件流
 */
export async function POST(request: NextRequest) {
  try {
    // 速率限制检查
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const body = await request.json();
    const { text, lang = 'en', spd = 3, pit = 5, vol = 5, per = 0 } = body;

    // 输入校验
    if (!text || typeof text !== 'string' || text.length === 0 || text.length > 200) {
      return NextResponse.json(
        { error: 'Text parameter is required (1-200 characters)' },
        { status: 400 }
      );
    }

    // 参数类型转换和范围校验
    const safeSpd = Math.min(Math.max(Number(spd) || 3, 0), 15);
    const safePit = Math.min(Math.max(Number(pit) || 5, 0), 15);
    const safeVol = Math.min(Math.max(Number(vol) || 5, 0), 15);
    const safePer = Number(per) || 0;

    // 调用百度 TTS 接口
    const token = await getBaiduAccessToken();

    const params = new URLSearchParams({
      tex: text,
      tok: token,
      cuid: 'word-puzzle-game',
      ctp: '1',
      lan: lang,
      spd: safeSpd.toString(),
      pit: safePit.toString(),
      vol: safeVol.toString(),
      per: safePer.toString(),
      aue: '3',
    });

    const ttsResponse = await fetch(
      `https://tsn.baidu.com/text2audio?${params.toString()}`,
      { method: 'POST' }
    );

    const contentType = ttsResponse.headers.get('content-type');

    if (contentType && contentType.includes('audio')) {
      const audioArrayBuffer = await ttsResponse.arrayBuffer();
      const audioBuffer = Buffer.from(audioArrayBuffer);

      return new NextResponse(audioBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mp3',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } else {
      return NextResponse.json(
        { error: 'TTS service error' },
        { status: 502 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'TTS service unavailable' },
      { status: 500 }
    );
  }
}
