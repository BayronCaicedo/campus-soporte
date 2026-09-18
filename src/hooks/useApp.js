import { useContext } from "react";
import { AppContext } from "../context/appContext.js";

export function useApp() {
  return useContext(AppContext);
}
