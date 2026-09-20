"use client";

import React, { useEffect, useState } from "react";
import { getActiveAlertsApi, SystemAlert } from "@/api/systemAlerts";
import { X, Tag, ExternalLink, Copy, Check, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { showToast } from "@/utils";

export const SystemAlertBanner = () => {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lata_dismissed_alerts");
      if (stored) {
        setDismissedIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }

    const fetchAlerts = async () => {
      try {
        const res = await getActiveAlertsApi();
        if (res?.alerts && Array.isArray(res.alerts)) {
          setAlerts(res.alerts);
        }
      } catch (err) {
        // Silent catch for public alerts
      }
    };

    fetchAlerts();
  }, []);

  const handleDismiss = (id: string) => {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    try {
      localStorage.setItem("lata_dismissed_alerts", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Promo code '${code}' copied to clipboard!`, "success");
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const visibleAlerts = alerts.filter((a) => !dismissedIds.includes(a.id));

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="w-full flex flex-col z-50">
      {visibleAlerts.map((alert) => {
        // Solid background colors based on severity
        let bgStyle = "bg-slate-900 text-white";
        let icon = <Info className="w-4 h-4 shrink-0 text-slate-300 mt-0.5" />;

        if (alert.severity === "promo") {
          bgStyle = "bg-[#5113A1] text-white";
          icon = <Tag className="w-4 h-4 shrink-0 text-purple-200 mt-0.5" />;
        } else if (alert.severity === "warning") {
          bgStyle = "bg-amber-700 text-white";
          icon = <AlertTriangle className="w-4 h-4 shrink-0 text-amber-200 mt-0.5" />;
        } else if (alert.severity === "success") {
          bgStyle = "bg-emerald-700 text-white";
          icon = <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-200 mt-0.5" />;
        }

        return (
          <div
            key={alert.id}
            className={`w-full px-3 py-2.5 sm:px-4 border-b border-black/10 ${bgStyle}`}
          >
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm font-medium">
              <div className="flex items-start gap-2 text-left pr-6 sm:pr-0">
                {icon}
                <div className="leading-snug">
                  <span className="font-bold mr-1.5">{alert.title}:</span>
                  <span className="opacity-95">{alert.message}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto shrink-0 pt-1 sm:pt-0 border-t border-white/10 sm:border-t-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Promo Code Pill */}
                  {alert.promoCode && (
                    <button
                      onClick={() => handleCopyCode(alert.promoCode!)}
                      className="flex items-center gap-1 bg-black/20 hover:bg-black/30 text-white px-2.5 py-1 rounded border border-white/20 text-xs font-mono font-semibold transition"
                      title="Copy promo code"
                    >
                      {copiedCode === alert.promoCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{alert.promoCode}</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* CTA Link Button */}
                  {alert.ctaLabel && alert.ctaLink && (
                    <Link
                      href={alert.ctaLink}
                      className="flex items-center gap-1 bg-white text-gray-900 hover:bg-gray-100 font-semibold px-2.5 py-1 rounded text-xs transition border border-gray-200"
                    >
                      <span>{alert.ctaLabel}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => handleDismiss(alert.id)}
                  className="p-1.5 hover:bg-black/20 rounded transition text-white/70 hover:text-white shrink-0 ml-auto sm:ml-0"
                  aria-label="Close Alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
