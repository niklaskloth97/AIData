"use client";

import PageHeader from "@/components/PageHeader";
import { AIModelSelection, InterfacePreferences, NotificationSettings, PrivacySettings } from "./settingsCards";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        heading="General Settings"
        subtext="Configure your application preferences and defaults"
      />
      <div className="space-y-6">
        <AIModelSelection />
        <InterfacePreferences />
        <NotificationSettings />
        <PrivacySettings />
      </div>
    </>
  );
}
