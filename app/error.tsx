'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">😵</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">出错了，请重试</h2>
        <p className="text-gray-600 mb-6">游戏遇到了一些问题，点击下方按钮重新加载。</p>
        <button
          onClick={reset}
          className="w-full bg-blue-500 text-white font-bold py-4 px-8 rounded-2xl text-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          🔄 重新加载
        </button>
      </div>
    </div>
  );
}
