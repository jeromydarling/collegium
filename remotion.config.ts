/**
 * Remotion config — points the CLI at our composition entry and sets
 * output defaults.
 *
 * Run:
 *   npm run remotion              # Live preview studio
 *   npm run remotion:render       # Render to out/justice-gap.mp4
 */

import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setEntryPoint("./src/remotion/index.ts");
// Higher CRF = smaller file, lower quality. 18 is "visually lossless" for h264.
Config.setCrf(20);

// Sandbox environment: Remotion's chrome-headless-shell download is
// blocked by the network allowlist. Reuse the Playwright chromium
// that's already on disk. Real production deploys can drop this and
// let Remotion fetch its own pinned binary.
if (process.env.NODE_ENV !== "production") {
  Config.setBrowserExecutable(
    "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell"
  );
}
