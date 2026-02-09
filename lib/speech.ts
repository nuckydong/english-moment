/**
 * 语音合成工具 - 使用百度语音合成 API
 * Speech synthesis utility using Baidu TTS API
 */

let currentAudio: HTMLAudioElement | null = null;
let currentAudioUrl: string | null = null;

/**
 * 朗读英语单词（使用百度语音合成）
 * @param word 要朗读的单词
 * @param options 朗读选项（目前只使用 onEnd 回调）
 */
export async function speakWord(
  word: string,
  options: {
    rate?: number;
    pitch?: number;
    volume?: number;
    onEnd?: () => void;
  } = {}
): Promise<void> {
  try {
    console.log('🔊 开始朗读 (百度语音):', word);

    // 如果有正在播放的音频，先停止并清理
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      } catch {}
      if (currentAudioUrl) {
        URL.revokeObjectURL(currentAudioUrl);
      }
      currentAudio = null;
      currentAudioUrl = null;
    }

    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: word,
        lang: 'en',
        spd: 3,
        pit: 5,
        vol: 8,
        per: 5118,
      }),
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);
    currentAudio = audio;
    currentAudioUrl = audioUrl;

    return new Promise((resolve, reject) => {
      audio.onended = () => {
        if (currentAudioUrl) {
          URL.revokeObjectURL(currentAudioUrl);
        }
        currentAudio = null;
        currentAudioUrl = null;
        console.log('🔊 朗读完成:', word);
        if (options.onEnd) {
          options.onEnd();
        }
        resolve();
      };

      audio.onerror = (error) => {
        if (currentAudioUrl) {
          URL.revokeObjectURL(currentAudioUrl);
        }
        currentAudio = null;
        currentAudioUrl = null;
        console.error('🔊 音频播放错误:', error);
        reject(error);
      };

      audio.play().catch((error) => {
        console.error('🔊 播放失败:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('🔊 百度语音朗读失败:', error);
  }
}


/**
 * 停止当前朗读
 */
export function stopSpeaking(): void {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {}
    console.log('🔊 停止朗读');
    if (currentAudioUrl) {
      URL.revokeObjectURL(currentAudioUrl);
    }
    currentAudio = null;
    currentAudioUrl = null;
  }
}

/**
 * 检查是否正在朗读
 */
export function isSpeaking(): boolean {
  return !!(currentAudio && !currentAudio.paused && currentAudio.currentTime > 0);
}

