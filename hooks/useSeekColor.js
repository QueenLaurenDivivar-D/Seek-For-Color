import { useContext } from "react";
import { SeekColorContext } from "../context/SeekColorContext";

export function useSeekColor() {
  const context = useContext(SeekColorContext);

  if (!context) {
    throw new Error("useSeekColor must be used within a SeekColorProvider.");
  }

  return context;
}
