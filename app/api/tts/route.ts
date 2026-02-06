/**
 * 百度语音合成 API 路由
 * Next.js API Route for Baidu TTS
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Token 缓存（内存中缓存，避免频繁请求）
let cachedToken: string | null = null;
let tokenExpireTime: number = 0;

/**
 * 获取百度 Access Token
 */
async function getBaiduAccessToken(): Promise<string> {
  const now = Date.now();
  
  // 如果 token 还未过期，直接返回缓存的 token
  if (cachedToken && now < tokenExpireTime) {
    return cachedToken!; // Non-null assertion since we checked it exists
  }

  const apiKey = process.env.BAIDU_API_KEY;
  const secretKey = process.env.BAIDU_SECRET_KEY;

  if (!apiKey || !secretKey) {
    throw new Error('Baidu API credentials not configured');
  }

  try {
    const response = await fetch(
      `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`,
      { method: 'POST' }
    );

    const data = await response.json();
    
    if (data.access_token) {
      cachedToken = data.access_token;
      // Token 有效期30天，提前1天刷新
      tokenExpireTime = now + (29 * 24 * 60 * 60 * 1000);
      return cachedToken!; // Non-null assertion since we just assigned it
    } else {
      throw new Error('Failed to get access token: ' + JSON.stringify(data));
    }
  } catch (error) {
    console.error('Error getting Baidu access token:', error);
    throw error;
  }
}

/**
 * POST /api/tts
 * 请求体: { text: string, lang?: 'zh' | 'en' }
 * 返回: 音频文件流
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, lang = 'en', spd = 3, pit = 5, vol = 5, per = 0 } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text parameter is required' },
        { status: 400 }
      );
    }

    // 构造本地缓存文件路径（public/tts-cache 下）
    const cacheDir = path.join(process.cwd(), 'public', 'tts-cache');
    const cacheFileName = `${encodeURIComponent(text)}_${lang}_${spd}_${pit}_${vol}_${per}.mp3`;
    const cachePath = path.join(cacheDir, cacheFileName);

    // 确保缓存目录存在
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // 如果缓存文件已存在，直接从磁盘读取返回
    if (fs.existsSync(cachePath)) {
      const cachedBuffer = fs.readFileSync(cachePath);
      return new NextResponse(cachedBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mp3',
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    }

    // 如果没有缓存，则调用百度 TTS 接口
    const token = await getBaiduAccessToken();

    const params = new URLSearchParams({
      tex: text,
      tok: token,
      cuid: 'word-puzzle-game',
      ctp: '1',
      lan: lang,
      spd: spd.toString(),
      pit: pit.toString(),
      vol: vol.toString(),
      per: per.toString(),
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

      // 写入本地缓存（失败不会影响正常返回）
      try {
        fs.writeFileSync(cachePath, audioBuffer);
      } catch (e) {
        console.error('Failed to write TTS cache file:', e);
      }
      
      return new NextResponse(audioBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mp3',
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    } else {
      const errorData = await ttsResponse.json();
      console.error('Baidu TTS API error:', errorData);
      
      return NextResponse.json(
        { error: 'TTS API error', details: errorData },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('TTS API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: String(error) },
      { status: 500 }
    );
  }
}