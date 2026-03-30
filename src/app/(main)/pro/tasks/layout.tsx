import { TasksProvider } from "@/components/tasks/TasksProvider";
import { Toaster } from "sonner";

// =====================================================
// TASKS LAYOUT
// Wraps the entire Tasks section with providers
// =====================================================

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TasksProvider>
      <div className="flex h-screen w-full overflow-hidden">{children}
        <Toaster position="top-right" />
      </div>
    </TasksProvider>
  );
}
