export default function TasksLoading() {
  return (
    <div className="flex-1 flex items-center justify-center bg-zinc-950">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-xl bg-zinc-800/50 animate-pulse" />
        <p className="text-zinc-500 text-sm">Chargement...</p>
      </div>
    </div>
  );
}