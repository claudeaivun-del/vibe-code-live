# PhishProbe — Phishing Simulation & Awareness Platform

> Live Phishing Campaign Testing & Security Awareness Training Tool

![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue) ![React](https://img.shields.io/badge/React-18+-61DAFB) ![License](https://img.shields.io/badge/License-MIT-green)

## Overview

PhishProbe is a phishing simulation platform for security teams and red teamers. It allows you to launch controlled phishing campaigns, track click rates, harvest credentials in a sandboxed environment, and generate awareness training reports.

## Features

- 🎣 **Campaign Builder** — Create realistic phishing emails with custom templates
- 📊 **Live Tracking** — Real-time open/click/credential capture dashboard
- 🧠 **Awareness Training** — Auto-enroll users who clicked into training modules
- 🖥️ **Landing Pages** — Cloned login pages for simulation purposes
- 📧 **SMTP Integration** — Send via custom mail servers
- 📋 **Reports** — Per-user and per-campaign PDF reports

## Installation

```bash
git clone https://github.com/claudeaivun-del/vibe-code-live
cd PhishProbe
npm install
npm run dev
```

## Usage

```
1. Create a campaign with a target email list
2. Choose a phishing template (Office365, Google, LinkedIn...)
3. Launch and monitor in real-time
4. Export report with clicked/not-clicked breakdown
```

## Supported Templates

| Template | Type |
|----------|------|
| Office 365 Login | Credential Harvest |
| Google Drive Share | Link Click |
| LinkedIn Message | Social Engineering |
| IT Security Alert | Urgency-based |

## Disclaimer

> For authorized security awareness training and red team operations only. Never use against targets without written permission.

## Author

**Shadow Core** — Red Team Specialist | Social Engineering Expert