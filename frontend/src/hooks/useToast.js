import { useState } from "react";

export default function useToast() {
  const [toast, setToast] = useState(null);
  function show(message, type = "success") {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3200);
  }
  return { toast, show };
}
