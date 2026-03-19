# Bot Framework WebChat — Minimal Bundle

A React + Vite reference implementation of [botframework-webchat](https://github.com/microsoft/BotFramework-WebChat) using the **minimal variant** (`botframework-webchat-component`) instead of the full meta-package. This eliminates unused Speech SDK, Adaptive Cards, and DirectLine Speech dependencies, reducing the JavaScript bundle by ~52%.

## Bundle Size Comparison

| Metric | `botframework-webchat` (full) | Minimal variant | Reduction |
|---|---|---|---|
| **Uncompressed JS** | 3,960 KB | 1,820 KB | **-2,140 KB (54%)** |
| **Gzipped JS** | 1,012 KB | 502 KB | **-510 KB (50%)** |
| **npm packages** | 535 | 459 | **-76 packages** |
| **Bundled modules** | 2,268 | 1,230 | **-1,038 modules** |

### What was removed

The full `botframework-webchat` package bundles these extras on top of the component layer — none are needed for a standard text chat:

| Removed Dependency | Size Impact |
|---|---|
| `microsoft-cognitiveservices-speech-sdk` (v1.17.0) | ~200 KB |
| `adaptivecards` (v3.0.2) | ~150 KB |
| `botframework-directlinespeech-sdk` (v4.18.0) | ~50 KB |
| Rich card renderers (Hero, Receipt, OAuth, Video, Audio, Animation) | ~80 KB |
| 76 transitive npm packages | Various |

### What was kept

All core webchat functionality is preserved:

- `ReactWebChat` component with full UI (transcript, send box, suggested actions, typing indicator)
- `createStore` for Redux store middleware
- `createStyleSet` and `styleOptions` for visual customization
- `DirectLine` with HTTP polling or WebSocket transport
- `attachmentMiddleware`, `activityMiddleware`, and all other middleware hooks

## Dependencies

```
botframework-webchat-component  ^4.18.0   ← UI components (was: botframework-webchat)
botframework-webchat-core       ^4.18.0   ← Redux store, sagas, actions
botframework-directlinejs       ^0.15.8   ← DirectLine connector
```

## Setup

```bash
npm install
```

Set `TOKEN_ENDPOINT` in `src/ChatBot.jsx` to your DirectLine token endpoint. The endpoint should accept a POST and return:

```json
{ "token": "...", "conversationId": "..." }
```

## Development

```bash
npm run dev       # Start dev server with HMR
npm run build     # Production build
npm run preview   # Preview production build
```

## Project Structure

```
src/
  main.jsx      — React entry point
  App.jsx       — Chat window shell (header + container)
  App.css       — Widget layout styles
  ChatBot.jsx   — WebChat integration (DirectLine, store, style config)
```

## How to migrate from `botframework-webchat` (full)

1. Replace the dependency:

```bash
npm uninstall botframework-webchat
npm install botframework-webchat-component botframework-webchat-core botframework-directlinejs
```

2. Update imports:

```diff
-import ReactWebChat from 'botframework-webchat';
+import ReactWebChat, { createStyleSet } from 'botframework-webchat-component';
+import { createStore } from 'botframework-webchat-core';
+import { DirectLine } from 'botframework-directlinejs';
```

3. Build and verify — all `styleOptions`, `attachmentMiddleware`, `store`, and `overrideLocalizedStrings` props work identically.

See [OPTIMIZATION-REPORT.md](OPTIMIZATION-REPORT.md) for the full analysis.
