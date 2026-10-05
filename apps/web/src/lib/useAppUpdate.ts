"use client";

import { useEffect, useState } from "react";
import { checkAppUpdate, dismissUpdate as storeDismissUpdate, isUpdateDismissed, type AppUpdateInfo } from "./appUpdate";

// A static export lives on a web server that is updated when layerling is
// published there; the service worker tells about a new version. Asking GitHub
// would only announce a release the server may never get - a script-only fix,
// say - and the notice would stay for good. Local and Docker installs still ask.
const ASKS_GITHUB_FOR_UPDATES = process.env.NEXT_PUBLIC_STATIC_EXPORT !== "true";

export function useAppUpdate(currentVersion: string) {
  const [update, setUpdate] = useState<AppUpdateInfo | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!ASKS_GITHUB_FOR_UPDATES) return;
    let cancelled = false;
    setIsChecking(true);
    checkAppUpdate(currentVersion)
      .then((info) => {
        if (!cancelled && info) {
          setUpdate(info);
          setIsDismissed(isUpdateDismissed(info.latestVersion));
        }
      })
      .finally(() => {
        if (!cancelled) setIsChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentVersion]);

  const dismiss = () => {
    if (update) {
      storeDismissUpdate(update.latestVersion);
      setIsDismissed(true);
    }
  };

  return {
    update,
    isDismissed,
    isChecking,
    dismiss,
  };
}
