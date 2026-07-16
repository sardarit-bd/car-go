"use client";

import { useState, useEffect } from "react";
import { X, Cookie, Settings, Check } from "lucide-react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShowBanner(true);
    } else {
      try {
        const parsedConsent = JSON.parse(consent);
        setPreferences(parsedConsent);
      } catch (e) {
        // If parsing fails (e.g., corrupted data), show banner again
        setShowBanner(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    saveConsent(newPreferences);
  };

  const handleRejectAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    saveConsent(newPreferences);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const saveConsent = (prefs) => {
    // Save to localStorage for client-side checks
    localStorage.setItem("cookie_consent", JSON.stringify(prefs));
    // Save to document.cookie for potential server-side middleware checks (1 year expiry)
    document.cookie = `cookie_consent=${JSON.stringify(prefs)}; path=/; max-age=31536000; SameSite=Lax`;
    setShowBanner(false);
  };

  const togglePreference = (key) => {
    if (key === "necessary") return; // Necessary cookies cannot be disabled
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-slate-200 shadow-2xl md:p-6">
      <div className="max-w-6xl mx-auto">
        {!showPreferences ? (
          // --- Default Banner View ---
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Cookie className="w-5 h-5 text-brand-red" />
                <h3 className="text-lg font-semibold text-slate-900">
                  We value your privacy
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                We use cookies to enhance your browsing experience, serve
                personalized content, and analyze our traffic. By clicking
                "Accept All", you consent to our use of cookies. Read our{" "}
                <a
                  href="/privacy"
                  className="text-brand-red hover:underline font-medium"
                >
                  Privacy & Cookie Policy
                </a>{" "}
                for more information.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={() => setShowPreferences(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Manage Preferences
              </button>
              <button
                onClick={handleRejectAll}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Reject All
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-red rounded-lg hover:bg-red-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                Accept All
              </button>
            </div>
          </div>
        ) : (
          // --- Expanded Preferences View ---
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-brand-red" />
                <h3 className="text-lg font-semibold text-slate-900">
                  Cookie Preferences
                </h3>
              </div>
              <button
                onClick={() => setShowPreferences(false)}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close preferences"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Necessary */}
              <div className="flex items-start justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">
                    Necessary Cookies
                  </h4>
                  <p className="text-sm text-slate-600 mt-1">
                    Required for the website to function properly (e.g.,
                    security, network management). These cannot be disabled.
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  <Check className="w-3 h-3" />
                  Always Active
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">
                    Analytics Cookies
                  </h4>
                  <p className="text-sm text-slate-600 mt-1">
                    Help us understand how visitors interact with our website by
                    collecting and reporting information anonymously.
                  </p>
                </div>
                <button
                  onClick={() => togglePreference("analytics")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.analytics ? "bg-brand-red" : "bg-slate-300"
                  }`}
                  aria-pressed={preferences.analytics}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.analytics ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-start justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">
                    Marketing Cookies
                  </h4>
                  <p className="text-sm text-slate-600 mt-1">
                    Used to track visitors across websites to display relevant
                    and engaging advertisements.
                  </p>
                </div>
                <button
                  onClick={() => togglePreference("marketing")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.marketing ? "bg-brand-red" : "bg-slate-300"
                  }`}
                  aria-pressed={preferences.marketing}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.marketing ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowPreferences(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-4 py-2 text-sm font-medium text-white bg-brand-red rounded-lg hover:bg-red-700 transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
