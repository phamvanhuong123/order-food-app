"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

function AppToaster() {
  const { resolvedTheme  } = useTheme();

  return (
    <Toaster
      theme={resolvedTheme as "light" | "dark" | "system"}
      richColors
    />
  );
}
export default AppToaster