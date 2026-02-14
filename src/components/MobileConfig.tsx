import { useEffect } from 'react';

export function MobileConfig() {
  useEffect(() => {
    // 1. Viewport meta (width, scale, viewport-fit=cover)
    // 3. Disable horizontal scrolling (via user-scalable=0 and width)
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    // "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover"
    viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover');

    // 9. Apple mobile web app capable
    let appleMobile = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (!appleMobile) {
      appleMobile = document.createElement('meta');
      appleMobile.setAttribute('name', 'apple-mobile-web-app-capable');
      document.head.appendChild(appleMobile);
    }
    appleMobile.setAttribute('content', 'yes');

    // 10. PWA display mode (standalone / fullscreen)
    let displayMode = document.querySelector('meta[name="mobile-web-app-capable"]');
    if (!displayMode) {
      displayMode = document.createElement('meta');
      displayMode.setAttribute('name', 'mobile-web-app-capable');
      document.head.appendChild(displayMode);
    }
    displayMode.setAttribute('content', 'yes');

    // Apple Status Bar
    let statusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!statusBar) {
      statusBar = document.createElement('meta');
      statusBar.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
      document.head.appendChild(statusBar);
    }
    // black-translucent allows content to go under the status bar (glass effect)
    statusBar.setAttribute('content', 'black-translucent');

    // 11. Orientation lock (suggested via meta, strict lock requires JS API usually)
    let orientation = document.querySelector('meta[name="screen-orientation"]');
    if (!orientation) {
      orientation = document.createElement('meta');
      orientation.setAttribute('name', 'screen-orientation');
      document.head.appendChild(orientation);
    }
    orientation.setAttribute('content', 'portrait');

    // Prevent body scroll locking issues on iOS
    // document.body.style.overscrollBehaviorY = 'none'; // Removed to allow pull-to-refresh

  }, []);

  return null;
}
