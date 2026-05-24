import { readSettings, readPreviewTheme } from "@/lib/site-settings-data";
import HomeClient from "@/components/HomeClient";

// Force page to re-evaluate on each request so theme previews and customizer saves are live instantly
export const dynamic = "force-dynamic";

export default async function Home() {
  const settings = await readSettings();
  const preview = await readPreviewTheme();

  // If there's an active theme preview, inject it onto the settings
  if (preview) {
    settings.theme.activeColorPreset = preview.preset;
    settings.theme.customColors = preview.customColors;
  }

  return <HomeClient initialSettings={settings} />;
}
