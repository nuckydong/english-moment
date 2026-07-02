/**
 * 语音合成工具 - 使用百度语音合成 API，带浏览器 SpeechSynthesis 回退
 * Speech synthesis utility using Baidu TTS API with browser fallback
 */

let currentAudio: HTMLAudioElement | null = null;
let currentAudioUrl: string | null = null;

/**
 * 浏览器内置语音合成回退
 */
function browserSpeak(text: string, onEnd?: () => void): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.7;
    utterance.pitch = 1.1;
    utterance.volume = 0.9;
    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = () => onEnd?.();
    }
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    return false;
  }
}

/**
 * 朗读英语单词（使用百度语音合成，失败时回退到浏览器 TTS）
 * @param word 要朗读的单词
 * @param options 朗读选项（目前只使用 onEnd 回调）
 */
export async function speakWord(
  word: string,
  options: {
    onEnd?: () => void;
  } = {}
): Promise<boolean> {
  try {
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: word, lang: 'en', spd: 3, pit: 5, vol: 8, per: 5118 }),
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);
    currentAudio = audio;
    currentAudioUrl = audioUrl;

    return new Promise<boolean>((resolve) => {
      audio.onended = () => {
        if (currentAudioUrl) URL.revokeObjectURL(currentAudioUrl);
        currentAudio = null;
        currentAudioUrl = null;
        options.onEnd?.();
        resolve(true);
      };

      audio.onerror = () => {
        if (currentAudioUrl) URL.revokeObjectURL(currentAudioUrl);
        currentAudio = null;
        currentAudioUrl = null;
        // 回退到浏览器 TTS
        if (browserSpeak(word, options.onEnd)) {
          resolve(true);
        } else {
          options.onEnd?.();
          resolve(false);
        }
      };

      audio.play().catch(() => {
        // 播放失败，回退到浏览器 TTS
        if (currentAudioUrl) URL.revokeObjectURL(currentAudioUrl);
        currentAudio = null;
        currentAudioUrl = null;
        if (browserSpeak(word, options.onEnd)) {
          resolve(true);
        } else {
          options.onEnd?.();
          resolve(false);
        }
      });
    });
  } catch {
    // 百度 API 不可用，回退到浏览器 TTS
    if (browserSpeak(word, options.onEnd)) {
      return true;
    }
    options.onEnd?.();
    return false;
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
    if (currentAudioUrl) URL.revokeObjectURL(currentAudioUrl);
    currentAudio = null;
    currentAudioUrl = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * 检查是否正在朗读
 */
export function isSpeaking(): boolean {
  return !!(currentAudio && !currentAudio.paused && currentAudio.currentTime > 0);
}
