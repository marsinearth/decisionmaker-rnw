import { CacheFirst } from "workbox-strategies";
import { clientsClaim, skipWaiting } from "workbox-core";

import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";

/* eslint-disable-next-line no-restricted-globals */
precacheAndRoute(self.__WB_MANIFEST);

skipWaiting();
clientsClaim();

registerRoute("/", new CacheFirst());
registerRoute("/manifest.json", new CacheFirst());
registerRoute("/workbox-strategy.js", new CacheFirst());

registerRoute(/^.*\.png$/, new CacheFirst());
