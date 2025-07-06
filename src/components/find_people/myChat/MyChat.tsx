export default function MyChart() {
  return (
    <div className="text-white border-2 border-dashed border-gray-500 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-800/30 shadow-inner">
      <h2 className="text-xl font-semibold mb-2">My Chat</h2>
      <p className="text-gray-300 mb-4">This is where your chart will be displayed.</p>
      <div className="px-4 py-2 bg-yellow-400/10 border border-yellow-400 text-yellow-300 rounded-full text-sm font-medium animate-pulse">
        🚧 Coming Up
      </div>
    </div>
  );
}
