import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { clientsClaim, skipWaiting } from "workbox-core";

import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";

/* eslint-disable-next-line no-restricted-globals */
precacheAndRoute(self.__WB_MANIFEST);

skipWaiting();
clientsClaim();

registerRoute("/", new StaleWhileRevalidate());
registerRoute("/manifest.json", new StaleWhileRevalidate());
registerRoute("/workbox-strategy.js", new StaleWhileRevalidate());

registerRoute(/^.*\.png$/, new CacheFirst());
