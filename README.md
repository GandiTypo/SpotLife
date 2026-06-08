<div align="center">
  
# 🎧 SpotLife 
**Ultimate Background Spotify for Android (Anti-Kill & Ad-Free)**

[![Platform](https://img.shields.io/badge/Platform-Android-3DDC84?style=flat-square&logo=android)](#)
[![Browser](https://img.shields.io/badge/Browser-Iceraven-FF7139?style=flat-square&logo=firefox)](#)
[![Script](https://img.shields.io/badge/Script-Tampermonkey-00485B?style=flat-square)](#)
[![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)](#)

</div>

Many of us want to listen to Spotify without ads on Android using the Web Browser trick (like Firefox/Iceraven) paired with an adblocker. However, there is one fatal flaw: **When you open heavy apps or games (like Honor of Kings or Mobile Legends), the background Spotify music suddenly stops!**

SpotLife is the definitive, hardcore solution to fix this issue permanently. We are not using modified Spotify applications (Mod APKs) which carry data theft risks. Instead, we are giving the Iceraven browser OS-level priority and injecting a highly aggressive userscript to fight back against Android's background app killer.

---

## 🔬 Under the Hood: Why Does the Music Die?

Many assume that when the music stops, Android has force-killed the browser because it ran out of RAM. Our system debugging reveals a different story:

1. **The Browser is NOT Dead:** Checking the system via `pidof io.github.forkmaintainers.iceraven` shows the PID is still active. The browser engine is still running in the background.
2. **Stolen Audio Focus:** Heavy games force Android to hijack the "Audio Focus". Checking `dumpsys media_session` logs shows Iceraven's MediaSession disappears. The OS unplugs the browser's audio session.
3. **The "Phantom Pause" Bug:** When the OS snatches the Virtual Audio Cable, Spotify's web player gets confused. The UI shows the song is still playing (the timer moves), but the audio is dumped into a void. Standard play/pause doesn't work; you usually have to reload the page.

To counter this aggressive OS behavior, we use a combination of system configs, browser tweaks, and an apex userscript (**Ironclad V5.4**) to fight back with zero latency.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your Android device:

* **[Iceraven Browser](https://github.com/fork-maintainers/iceraven-browser):** An open-source Firefox fork that supports PC extensions.
* **Tampermonkey:** Install this add-on inside Iceraven.
* **uBlock Origin:** Install this inside Iceraven to completely block all Spotify web ads.
* **[Shizuku](https://shizuku.rikka.app/) & [aShell](https://gitlab.com/sunilpaulmathew/ashell):** Required to grant system-level permissions without rooting your phone. Ensure Shizuku is running (via Wireless Debugging) and aShell is connected to it.

---

## 🚀 Step-by-Step Installation Guide

### Step 1: System-Level Configuration (via aShell)
First, we must command Android to never restrict Iceraven in the background by forcefully modifying the AppOps (Application Operations).

1. Open the **aShell** app.
2. Enter the first command and press Enter:
   ```sh
   cmd appops set io.github.forkmaintainers.iceraven RUN_IN_BACKGROUND allow
   ```
3. Enter the second command and press Enter:
   ```sh
   cmd appops set io.github.forkmaintainers.iceraven WAKE_LOCK allow
   ```
> *This grants Iceraven absolute access to keep running and prevents the phone's CPU from sleeping (Wake Lock) while the browser is active.*

### Step 2: Browser Engine Modification (`about:config`)
Now, we tweak the core engine of the Iceraven browser.

1. Open Iceraven.
2. In the URL bar, type `about:config` and press Enter (accept the risk warning).
3. Search for the following keys and toggle their values:
   * `media.hardwaremediakeys.enabled` ➔ Set to **`true`**
   * `media.suspend-bkgnd-video.enabled` ➔ Set to **`false`**
> *This forces the browser to hook into the phone's hardware media controls and forbids it from suspending media when the screen is hidden.*

### Step 3: Battery Optimization & Manual RAM Lock
The best script in the world won't work if the physical battery saver kills the app. 

1. **Unrestricted Battery:** Go to Phone Settings > Apps > Iceraven > Battery > Select **Unrestricted**. (Prevents "Doze Mode" from cutting the connection).
2. **App Lock in RAM:** Open your Recent Apps menu. Find the Iceraven window, and tap the **Lock icon** (or swipe down, depending on your OS). This tells the system's RAM cleaner to bypass Iceraven.

### Step 4: Injecting "The Apex Predator" Script (Ironclad V5.4)
The old `setTimeout` / `AudioContext` approaches fail because Android acts too fast. Ironclad V5.4 utilizes a hardware defibrillator and zero-latency recovery to immediately fight back when the OS tries to mute the tab.

1. Open Iceraven and navigate to the **Tampermonkey** dashboard.
2. Select **Create a new script**.
3. Copy the source code from the [`Ironclad-v5.4.user.js`](https://raw.githubusercontent.com/GandiTypo/SpotLife/refs/heads/main/Ironclad-v5.4.user.js) file in this repository.
4. Paste the code into the Tampermonkey editor and click **File > Save**.
5. Open the Spotify Web Player in Iceraven, log in, play your favorite track, and enjoy true background multitasking even during heavy gaming!

---

## 🐛 Known Issues & Limitations (Work in Progress)
**Tested on:** Realme C53 (Realme UI, Android 15)

Currently, this project is still in active development, which means the code is not yet perfect.
* **Experimental Recent Apps Survival:** The script can sometimes keep the music running in the background even if you explicitly swipe away/close Iceraven from your **Recent Apps** (Task Switcher).

* **The Bug:** This feature is currently unstable. Occasionally, closing Iceraven from Recent Apps will completely kill the code, resulting in the music failing to run in the background. Expect ongoing updates as we patch these development flaws.

---

## ⚠️ Disclaimer & About

**Author:** GandiTypo

**Disclaimer:** Please note that I am 100% *vibecoding* this project. While I have conducted extensive investigations to solve this background killing issue on Android, I may not have a deep, professional understanding of every single underlying mechanism in the JavaScript code provided. Use it, learn from it, modify it, but keep in mind this was built through pure experimentation and vibes!
