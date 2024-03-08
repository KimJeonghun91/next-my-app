import FetchCache from "./fetch-cache";
import FileSystemCache from "./file-system-cache";
import path from "../../../shared/lib/isomorphic/path";
import { normalizePagePath } from "../../../shared/lib/page-path/normalize-page-path";
import { CACHE_ONE_YEAR, NEXT_CACHE_REVALIDATED_TAGS_HEADER, NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER, PRERENDER_REVALIDATE_HEADER } from "../../../lib/constants";
function toRoute(pathname) {
    return pathname.replace(/\/$/, "").replace(/\/index$/, "") || "/";
}
export class CacheHandler {
    // eslint-disable-next-line
    constructor(_ctx){}
    async get(..._args) {
        return {};
    }
    async set(..._args) {}
    async revalidateTag(_tag) {}
    resetRequestCache() {}
}
export class IncrementalCache {
    constructor({ fs, dev, appDir, pagesDir, flushToDisk, fetchCache, minimalMode, serverDistDir, requestHeaders, requestProtocol, maxMemoryCacheSize, getPrerenderManifest, fetchCacheKeyPrefix, CurCacheHandler, allowedRevalidateHeaderKeys, experimental }){
        var _this_prerenderManifest_preview, _this_prerenderManifest, _this_prerenderManifest_preview1, _this_prerenderManifest1;
        this.locks = new Map();
        this.unlocks = new Map();
        const debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        this.hasCustomCacheHandler = Boolean(CurCacheHandler);
        if (!CurCacheHandler) {
            if (fs && serverDistDir) {
                if (debug) {
                    console.log("using filesystem cache handler");
                }
                CurCacheHandler = FileSystemCache;
            }
            if (FetchCache.isAvailable({
                _requestHeaders: requestHeaders
            }) && minimalMode && fetchCache) {
                if (debug) {
                    console.log("using fetch cache handler");
                }
                CurCacheHandler = FetchCache;
            }
        } else if (debug) {
            console.log("using custom cache handler", CurCacheHandler.name);
        }
        if (process.env.__NEXT_TEST_MAX_ISR_CACHE) {
            // Allow cache size to be overridden for testing purposes
            maxMemoryCacheSize = parseInt(process.env.__NEXT_TEST_MAX_ISR_CACHE, 10);
        }
        this.dev = dev;
        // this is a hack to avoid Webpack knowing this is equal to this.minimalMode
        // because we replace this.minimalMode to true in production bundles.
        const minimalModeKey = "minimalMode";
        this[minimalModeKey] = minimalMode;
        this.requestHeaders = requestHeaders;
        this.requestProtocol = requestProtocol;
        this.allowedRevalidateHeaderKeys = allowedRevalidateHeaderKeys;
        this.prerenderManifest = getPrerenderManifest();
        this.fetchCacheKeyPrefix = fetchCacheKeyPrefix;
        let revalidatedTags = [];
        if (requestHeaders[PRERENDER_REVALIDATE_HEADER] === ((_this_prerenderManifest = this.prerenderManifest) == null ? void 0 : (_this_prerenderManifest_preview = _this_prerenderManifest.preview) == null ? void 0 : _this_prerenderManifest_preview.previewModeId)) {
            this.isOnDemandRevalidate = true;
        }
        if (minimalMode && typeof requestHeaders[NEXT_CACHE_REVALIDATED_TAGS_HEADER] === "string" && requestHeaders[NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER] === ((_this_prerenderManifest1 = this.prerenderManifest) == null ? void 0 : (_this_prerenderManifest_preview1 = _this_prerenderManifest1.preview) == null ? void 0 : _this_prerenderManifest_preview1.previewModeId)) {
            revalidatedTags = requestHeaders[NEXT_CACHE_REVALIDATED_TAGS_HEADER].split(",");
        }
        if (CurCacheHandler) {
            this.cacheHandler = new CurCacheHandler({
                dev,
                fs,
                flushToDisk,
                serverDistDir,
                revalidatedTags,
                maxMemoryCacheSize,
                _pagesDir: !!pagesDir,
                _appDir: !!appDir,
                _requestHeaders: requestHeaders,
                fetchCacheKeyPrefix,
                experimental
            });
        }
    }
    calculateRevalidate(pathname, fromTime, dev) {
        // in development we don't have a prerender-manifest
        // and default to always revalidating to allow easier debugging
        if (dev) return new Date().getTime() - 1000;
        // if an entry isn't present in routes we fallback to a default
        // of revalidating after 1 second
        const { initialRevalidateSeconds } = this.prerenderManifest.routes[toRoute(pathname)] || {
            initialRevalidateSeconds: 1
        };
        const revalidateAfter = typeof initialRevalidateSeconds === "number" ? initialRevalidateSeconds * 1000 + fromTime : initialRevalidateSeconds;
        return revalidateAfter;
    }
    _getPathname(pathname, fetchCache) {
        return fetchCache ? pathname : normalizePagePath(pathname);
    }
    resetRequestCache() {
        var _this_cacheHandler_resetRequestCache, _this_cacheHandler;
        (_this_cacheHandler = this.cacheHandler) == null ? void 0 : (_this_cacheHandler_resetRequestCache = _this_cacheHandler.resetRequestCache) == null ? void 0 : _this_cacheHandler_resetRequestCache.call(_this_cacheHandler);
    }
    async unlock(cacheKey) {
        const unlock = this.unlocks.get(cacheKey);
        if (unlock) {
            unlock();
            this.locks.delete(cacheKey);
            this.unlocks.delete(cacheKey);
        }
    }
    async lock(cacheKey) {
        if (process.env.__NEXT_INCREMENTAL_CACHE_IPC_PORT && process.env.__NEXT_INCREMENTAL_CACHE_IPC_KEY && process.env.NEXT_RUNTIME !== "edge") {
            const invokeIpcMethod = require("../server-ipc/request-utils").invokeIpcMethod;
            await invokeIpcMethod({
                method: "lock",
                ipcPort: process.env.__NEXT_INCREMENTAL_CACHE_IPC_PORT,
                ipcKey: process.env.__NEXT_INCREMENTAL_CACHE_IPC_KEY,
                args: [
                    cacheKey
                ]
            });
            return async ()=>{
                await invokeIpcMethod({
                    method: "unlock",
                    ipcPort: process.env.__NEXT_INCREMENTAL_CACHE_IPC_PORT,
                    ipcKey: process.env.__NEXT_INCREMENTAL_CACHE_IPC_KEY,
                    args: [
                        cacheKey
                    ]
                });
            };
        }
        let unlockNext = ()=>Promise.resolve();
        const existingLock = this.locks.get(cacheKey);
        if (existingLock) {
            await existingLock;
        } else {
            const newLock = new Promise((resolve)=>{
                unlockNext = async ()=>{
                    resolve();
                };
            });
            this.locks.set(cacheKey, newLock);
            this.unlocks.set(cacheKey, unlockNext);
        }
        return unlockNext;
    }
    async revalidateTag(tag) {
        var _this_cacheHandler_revalidateTag, _this_cacheHandler;
        if (process.env.__NEXT_INCREMENTAL_CACHE_IPC_PORT && process.env.__NEXT_INCREMENTAL_CACHE_IPC_KEY && process.env.NEXT_RUNTIME !== "edge") {
            const invokeIpcMethod = require("../server-ipc/request-utils").invokeIpcMethod;
            return invokeIpcMethod({
                method: "revalidateTag",
                ipcPort: process.env.__NEXT_INCREMENTAL_CACHE_IPC_PORT,
                ipcKey: process.env.__NEXT_INCREMENTAL_CACHE_IPC_KEY,
                args: [
                    ...arguments
                ]
            });
        }
        return (_this_cacheHandler = this.cacheHandler) == null ? void 0 : (_this_cacheHandler_revalidateTag = _this_cacheHandler.revalidateTag) == null ? void 0 : _this_cacheHandler_revalidateTag.call(_this_cacheHandler, tag);
    }
    // x-ref: https://github.com/facebook/react/blob/2655c9354d8e1c54ba888444220f63e836925caa/packages/react/src/ReactFetch.js#L23
    async fetchCacheKey(url, init = {}) {
        // this should be bumped anytime a fix is made to cache entries
        // that should bust the cache
        const MAIN_KEY_PREFIX = "v3";
        const bodyChunks = [];
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        if (init.body) {
            // handle ReadableStream body
            if (typeof init.body.getReader === "function") {
                const readableBody = init.body;
                const chunks = [];
                try {
                    await readableBody.pipeTo(new WritableStream({
                        write (chunk) {
                            if (typeof chunk === "string") {
                                chunks.push(encoder.encode(chunk));
                                bodyChunks.push(chunk);
                            } else {
                                chunks.push(chunk);
                                bodyChunks.push(decoder.decode(chunk, {
                                    stream: true
                                }));
                            }
                        }
                    }));
                    // Flush the decoder.
                    bodyChunks.push(decoder.decode());
                    // Create a new buffer with all the chunks.
                    const length = chunks.reduce((total, arr)=>total + arr.length, 0);
                    const arrayBuffer = new Uint8Array(length);
                    // Push each of the chunks into the new array buffer.
                    let offset = 0;
                    for (const chunk of chunks){
                        arrayBuffer.set(chunk, offset);
                        offset += chunk.length;
                    }
                    init._ogBody = arrayBuffer;
                } catch (err) {
                    console.error("Problem reading body", err);
                }
            } else if (typeof init.body.keys === "function") {
                const formData = init.body;
                init._ogBody = init.body;
                for (const key of new Set([
                    ...formData.keys()
                ])){
                    const values = formData.getAll(key);
                    bodyChunks.push(`${key}=${(await Promise.all(values.map(async (val)=>{
                        if (typeof val === "string") {
                            return val;
                        } else {
                            return await val.text();
                        }
                    }))).join(",")}`);
                }
            // handle blob body
            } else if (typeof init.body.arrayBuffer === "function") {
                const blob = init.body;
                const arrayBuffer = await blob.arrayBuffer();
                bodyChunks.push(await blob.text());
                init._ogBody = new Blob([
                    arrayBuffer
                ], {
                    type: blob.type
                });
            } else if (typeof init.body === "string") {
                bodyChunks.push(init.body);
                init._ogBody = init.body;
            }
        }
        const cacheString = JSON.stringify([
            MAIN_KEY_PREFIX,
            this.fetchCacheKeyPrefix || "",
            url,
            init.method,
            typeof (init.headers || {}).keys === "function" ? Object.fromEntries(init.headers) : init.headers,
            init.mode,
            init.redirect,
            init.credentials,
            init.referrer,
            init.referrerPolicy,
            init.integrity,
            init.cache,
            bodyChunks
        ]);
        if (process.env.NEXT_RUNTIME === "edge") {
            function bufferToHex(buffer) {
                return Array.prototype.map.call(new Uint8Array(buffer), (b)=>b.toString(16).padStart(2, "0")).join("");
            }
            const buffer = encoder.encode(cacheString);
            return bufferToHex(await crypto.subtle.digest("SHA-256", buffer));
        } else {
            const crypto1 = require("crypto");
            return crypto1.createHash("sha256").update(cacheString).digest("hex");
        }
    }
    // get data from cache if available
    async get(cacheKey, ctx = {}) {
        var _this_cacheHandler, _cacheData_value, _this_prerenderManifest_routes_toRoute;
        if (process.env.__NEXT_INCREMENTAL_CACHE_IPC_PORT && process.env.__NEXT_INCREMENTAL_CACHE_IPC_KEY && process.env.NEXT_RUNTIME !== "edge") {
            const invokeIpcMethod = require("../server-ipc/request-utils").invokeIpcMethod;
            return invokeIpcMethod({
                method: "get",
                ipcPort: process.env.__NEXT_INCREMENTAL_CACHE_IPC_PORT,
                ipcKey: process.env.__NEXT_INCREMENTAL_CACHE_IPC_KEY,
                args: [
                    ...arguments
                ]
            });
        }
        // we don't leverage the prerender cache in dev mode
        // so that getStaticProps is always called for easier debugging
        if (this.dev && (ctx.kindHint !== "fetch" || this.requestHeaders["cache-control"] === "no-cache")) {
            return null;
        }
        cacheKey = this._getPathname(cacheKey, ctx.kindHint === "fetch");
        let entry = null;
        let revalidate = ctx.revalidate;
        const cacheData = await ((_this_cacheHandler = this.cacheHandler) == null ? void 0 : _this_cacheHandler.get(cacheKey, ctx));
        if ((cacheData == null ? void 0 : (_cacheData_value = cacheData.value) == null ? void 0 : _cacheData_value.kind) === "FETCH") {
            const combinedTags = [
                ...ctx.tags || [],
                ...ctx.softTags || []
            ];
            // if a tag was revalidated we don't return stale data
            if (combinedTags.some((tag)=>{
                var _this_revalidatedTags;
                return (_this_revalidatedTags = this.revalidatedTags) == null ? void 0 : _this_revalidatedTags.includes(tag);
            })) {
                return null;
            }
            revalidate = revalidate || cacheData.value.revalidate;
            const age = (Date.now() - (cacheData.lastModified || 0)) / 1000;
            const isStale = age > revalidate;
            const data = cacheData.value.data;
            return {
                isStale: isStale,
                value: {
                    kind: "FETCH",
                    data,
                    revalidate: revalidate
                },
                revalidateAfter: Date.now() + revalidate * 1000
            };
        }
        const curRevalidate = (_this_prerenderManifest_routes_toRoute = this.prerenderManifest.routes[toRoute(cacheKey)]) == null ? void 0 : _this_prerenderManifest_routes_toRoute.initialRevalidateSeconds;
        let isStale;
        let revalidateAfter;
        if ((cacheData == null ? void 0 : cacheData.lastModified) === -1) {
            isStale = -1;
            revalidateAfter = -1 * CACHE_ONE_YEAR;
        } else {
            revalidateAfter = this.calculateRevalidate(cacheKey, (cacheData == null ? void 0 : cacheData.lastModified) || Date.now(), this.dev && ctx.kindHint !== "fetch");
            isStale = revalidateAfter !== false && revalidateAfter < Date.now() ? true : undefined;
        }
        if (cacheData) {
            entry = {
                isStale,
                curRevalidate,
                revalidateAfter,
                value: cacheData.value
            };
        }
        if (!cacheData && this.prerenderManifest.notFoundRoutes.includes(cacheKey)) {
            // for the first hit after starting the server the cache
            // may not have a way to save notFound: true so if
            // the prerender-manifest marks this as notFound then we
            // return that entry and trigger a cache set to give it a
            // chance to update in-memory entries
            entry = {
                isStale,
                value: null,
                curRevalidate,
                revalidateAfter
            };
            this.set(cacheKey, entry.value, ctx);
        }
        return entry;
    }
    // populate the incremental cache with new data
    async set(pathname, data, ctx) {
        if (process.env.__NEXT_INCREMENTAL_CACHE_IPC_PORT && process.env.__NEXT_INCREMENTAL_CACHE_IPC_KEY && process.env.NEXT_RUNTIME !== "edge") {
            const invokeIpcMethod = require("../server-ipc/request-utils").invokeIpcMethod;
            return invokeIpcMethod({
                method: "set",
                ipcPort: process.env.__NEXT_INCREMENTAL_CACHE_IPC_PORT,
                ipcKey: process.env.__NEXT_INCREMENTAL_CACHE_IPC_KEY,
                args: [
                    ...arguments
                ]
            });
        }
        if (this.dev && !ctx.fetchCache) return;
        // FetchCache has upper limit of 2MB per-entry currently
        if (ctx.fetchCache && // we don't show this error/warning when a custom cache handler is being used
        // as it might not have this limit
        !this.hasCustomCacheHandler && JSON.stringify(data).length > 2 * 1024 * 1024) {
            if (this.dev) {
                throw new Error(`fetch for over 2MB of data can not be cached`);
            }
            return;
        }
        pathname = this._getPathname(pathname, ctx.fetchCache);
        try {
            var _this_cacheHandler;
            // we use the prerender manifest memory instance
            // to store revalidate timings for calculating
            // revalidateAfter values so we update this on set
            if (typeof ctx.revalidate !== "undefined" && !ctx.fetchCache) {
                this.prerenderManifest.routes[pathname] = {
                    experimentalPPR: undefined,
                    dataRoute: path.posix.join("/_next/data", `${normalizePagePath(pathname)}.json`),
                    srcRoute: null,
                    initialRevalidateSeconds: ctx.revalidate,
                    // Pages routes do not have a prefetch data route.
                    prefetchDataRoute: undefined
                };
            }
            await ((_this_cacheHandler = this.cacheHandler) == null ? void 0 : _this_cacheHandler.set(pathname, data, ctx));
        } catch (error) {
            console.warn("Failed to update prerender cache for", pathname, error);
        }
    }
}

//# sourceMappingURL=index.js.map