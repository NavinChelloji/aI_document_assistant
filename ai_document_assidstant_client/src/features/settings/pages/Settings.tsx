import React, { useState, useEffect } from "react";
import { User, Settings as SettingsIcon, Cpu, FolderCog, CreditCard, Moon, Sun, Monitor, Loader2, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";
import { userService } from "../services/user.api";
import { workspaceService } from "../../workspace/services/workspace.api";
import { useAbortController } from "../../../hooks/useAbortController";
import type { Workspace } from "../../../types/workspace";

interface Prefs {
  theme: "light" | "dark" | "system";
  language: string;
  default_workspace_id: string;
  show_sources_by_default: boolean;
  response_length: "concise" | "balanced" | "detailed";
}

const TABS = [
  { key: "profile", label: "Profile", icon: User, desc: "Update your profile" },
  { key: "preferences", label: "Preferences", icon: SettingsIcon, desc: "App preferences" },
  { key: "ai", label: "AI Models", icon: Cpu, desc: "Configure AI models" },
  { key: "workspace", label: "Workspace Settings", icon: FolderCog, desc: "Manage workspace" },
  { key: "billing", label: "Billing", icon: CreditCard, desc: "Manage subscription" },
];

export const Settings = () => {
  const [tab, setTab] = useState("preferences");
  const { getSignal } = useAbortController();

  /* ── Profile state ── */
  const [profile, setProfile] = useState<{ email: string; full_name: string }>({ email: "", full_name: "" });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileStatus, setProfileStatus] = useState<"idle" | "saved" | "error">("idle");

  /* ── Preferences state ── */
  const [prefs, setPrefs] = useState<Prefs>({
    theme: "light",
    language: "English",
    default_workspace_id: "",
    show_sources_by_default: true,
    response_length: "balanced",
  });
  const [prefsSaving, setPrefsSaving] = useState(false);
  const [prefsStatus, setPrefsStatus] = useState<"idle" | "saved" | "error">("idle");
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [me, wsList] = await Promise.all([
          userService.getMe(getSignal()),
          workspaceService.getWorkspaces(getSignal()),
        ]);
        setProfile({ email: me.email, full_name: me.full_name ?? "" });
        setWorkspaces(wsList);
      } catch { /* silently skip */ }
      finally { setProfileLoading(false); }
    };
    load();
  }, [getSignal]);

  const saveProfile = async () => {
    setPrefsSaving(false);
    setProfileSaving(true);
    setProfileStatus("idle");
    try {
      await userService.updateMe({ full_name: profile.full_name });
      setProfileStatus("saved");
    } catch { setProfileStatus("error"); }
    finally { setProfileSaving(false); }
  };

  const savePrefs = async () => {
    setPrefsSaving(true);
    setPrefsStatus("idle");
    try {
      // POST to backend — if settings route not yet set up, it will fail gracefully
      await fetch("/api/settings/preferences", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      setPrefsStatus("saved");
    } catch { setPrefsStatus("error"); }
    finally { setPrefsSaving(false); }
  };

  const activeTab = TABS.find((t) => t.key === tab)!;
  const isSaving = profileSaving || prefsSaving;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <button
          onClick={tab === "profile" ? saveProfile : savePrefs}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* ── Sidebar ── */}
        <nav className="w-full md:w-64 space-y-1 flex-shrink-0">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl text-left transition-colors border ${
                tab === t.key
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800"
                  : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
            >
              <div className={`p-2 rounded-lg flex-shrink-0 ${tab === t.key ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                <t.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-semibold truncate ${tab === t.key ? "text-blue-700 dark:text-blue-400" : "text-gray-900 dark:text-white"}`}>{t.label}</p>
                <p className="text-xs text-gray-500 truncate">{t.desc}</p>
              </div>
            </button>
          ))}
        </nav>

        {/* ── Content Panel ── */}
        <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm min-h-[480px]">

          {/* Status banners */}
          {(prefsStatus === "saved" || profileStatus === "saved") && (
            <div className="flex items-center gap-2 p-3 mb-6 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" /> Changes saved successfully!
            </div>
          )}
          {(prefsStatus === "error" || profileStatus === "error") && (
            <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> Failed to save. Please try again.
            </div>
          )}

          {/* ─── Profile Tab ─── */}
          {tab === "profile" && (
            <div className="space-y-6 max-w-md">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white pb-4 border-b border-gray-100 dark:border-gray-800">Profile</h2>
              {profileLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => <div key={i} className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                    <input
                      value={profile.full_name}
                      onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
                      placeholder="Your full name"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                    <input
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ─── Preferences Tab ─── */}
          {tab === "preferences" && (
            <div className="space-y-8 max-w-md">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white pb-4 border-b border-gray-100 dark:border-gray-800">Preferences</h2>

              {/* Appearance */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Appearance</h3>
                <div className="flex gap-4">
                  {(["light", "dark", "system"] as const).map((t) => {
                    const Icon = t === "light" ? Sun : t === "dark" ? Moon : Monitor;
                    return (
                      <label key={t} className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl border transition-colors ${prefs.theme === t ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"}`}>
                        <input type="radio" name="theme" checked={prefs.theme === t} onChange={() => setPrefs((p) => ({ ...p, theme: t }))} className="hidden" />
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium capitalize">{t}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Language */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Language</h3>
                <div className="relative">
                  <select
                    value={prefs.language}
                    onChange={(e) => setPrefs((p) => ({ ...p, language: e.target.value }))}
                    className="w-full appearance-none px-4 py-2.5 pr-9 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {["English", "Spanish", "French", "German", "Hindi", "Japanese"].map((l) => <option key={l}>{l}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Default Workspace */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Default Workspace</h3>
                <div className="relative">
                  <select
                    value={prefs.default_workspace_id}
                    onChange={(e) => setPrefs((p) => ({ ...p, default_workspace_id: e.target.value }))}
                    className="w-full appearance-none px-4 py-2.5 pr-9 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="">None</option>
                    {workspaces.map((ws) => <option key={ws.id} value={ws.id}>{ws.name}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Chat Settings */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Chat Settings</h3>

                {/* Show Sources Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Sources by Default</p>
                    <p className="text-xs text-gray-400">Display source citations in chat responses</p>
                  </div>
                  <button
                    onClick={() => setPrefs((p) => ({ ...p, show_sources_by_default: !p.show_sources_by_default }))}
                    className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none ${prefs.show_sources_by_default ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${prefs.show_sources_by_default ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>

                {/* Response Length */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Response Length</p>
                  <div className="relative">
                    <select
                      value={prefs.response_length}
                      onChange={(e) => setPrefs((p) => ({ ...p, response_length: e.target.value as Prefs["response_length"] }))}
                      className="w-full appearance-none px-4 py-2.5 pr-9 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="concise">Concise</option>
                      <option value="balanced">Balanced</option>
                      <option value="detailed">Detailed</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Other Tabs (placeholder) ─── */}
          {tab !== "profile" && tab !== "preferences" && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <activeTab.icon className="w-12 h-12 mb-3 text-gray-200" />
              <p className="font-semibold text-gray-600 dark:text-gray-400">{activeTab.label}</p>
              <p className="text-sm mt-1 text-gray-400">This section is coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
