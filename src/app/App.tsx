import { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { resolveRoute } from "./routes";

export function App() {
  const [hash, setHash] = useState(window.location.hash || "#/child/xiaoyu");

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || "#/child/xiaoyu");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return <AppShell>{resolveRoute(hash)}</AppShell>;
}
