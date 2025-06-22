import { useCallback } from "react";
import { useDebug } from "../utils/react";

export default function DebugToggler() {
  const debug = useDebug();

  const toggleDebug = useCallback(() => {
    const url = new URL(window.location.href);
    if (debug) {
      url.searchParams.delete("debug");
    } else {
      url.searchParams.set("debug", "1");
    }
    window.history.pushState({}, "", url.toString());
    // Trigger popstate event to update useSearchParams
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, [debug]);

  return (
    <button
      onClick={toggleDebug}
      className={`ml-2 px-2 py-1 text-xs rounded ${
        debug
          ? "bg-blue-100 text-blue-700 border border-blue-300"
          : "bg-gray-100 text-gray-600 border border-gray-300"
      } hover:opacity-80 transition-opacity`}
      title={debug ? "Disable debug mode" : "Enable debug mode"}
    >
      {debug ? "Debug ON" : "Debug OFF"}
    </button>
  );
}