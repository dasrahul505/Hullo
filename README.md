# Hullo MVP

A cross-platform React Native/Expo MVP for a private two-person photo widget.

## Current flow

1. A photo-only widget-style screen is shown.
2. Tapping the photo opens a full-screen device camera.
3. Capture, preview, retake, and send are functional locally.
4. Sending replaces the current photo in the local widget view.

The UI uses flexible layout values and responds to the phone's available width and dynamic height.

## Run locally

This project requires Node.js 22.13 or newer. This development machine uses Node 22.23.5.

```sh
npm install
npm run start
```

Use Expo Go on Android for basic camera-flow testing. An iPhone build requires macOS with full Xcode installed.

## Before public release

The source code can live on GitHub, but it is not itself an install channel for iPhone users. Distribution requires:

- Android: signed AAB/APK and Google Play (or a direct APK test release).
- iPhone: an Apple Developer account plus TestFlight/App Store distribution.

The local MVP deliberately has no server yet. To connect two people for real, the next build stage is to add:

- account authentication and a two-person invite code;
- secure image storage and a `currentPhoto` record per member;
- push notifications and widget refresh triggers;
- native Android and iOS home-screen widget extensions.

Home-screen widgets cannot be fully tested in Expo Go; they need a custom native development build.
