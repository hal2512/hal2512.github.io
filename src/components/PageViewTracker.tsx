import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// GoatCounter: cookie-free visitor stats, dashboard at https://<code>.goatcounter.com
const GOATCOUNTER_CODE = "hal2512";
const PROD_HOST = "hal2512.github.io";

type GoatCounter = { count: (vars: { path: string }) => void; no_onload?: boolean };
declare global {
  interface Window {
    goatcounter?: GoatCounter | { no_onload: boolean };
  }
}

let scriptAdded = false;

function loadScript() {
  if (scriptAdded) return;
  scriptAdded = true;
  // Count page views ourselves on route changes (the site is a single-page app).
  window.goatcounter = { no_onload: true };
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  s.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
  document.head.appendChild(s);
}

function count(path: string, tries = 0) {
  const gc = window.goatcounter;
  if (gc && "count" in gc) {
    gc.count({ path });
  } else if (tries < 50) {
    window.setTimeout(() => count(path, tries + 1), 200);
  }
}

/** Sends one page view to GoatCounter per route change, only on the live site. */
export function PageViewTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.location.hostname !== PROD_HOST) return;
    loadScript();
    count(pathname);
  }, [pathname]);

  return null;
}
