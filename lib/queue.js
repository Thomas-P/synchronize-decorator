"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * LockQueue is a simple implementation of a lock mechanism with no dead lock check
 * Each time a lock is request, it internally push the request to a queue or handle it
 * after the request is solved, the
 */
class LockQueue {
    constructor() {
        this.queue = [];
    }
    /**
     *  An internal method to request a lock.
     *  If the lock is already set or if it is not available,
     *  then the callback will be stored in a queue and called after
     *  the request before is finished.
     * @returns {Promise<T>}
     */
    requestLock() {
        return new Promise((resolve) => {
            if (this.lock) {
                this.queue.push(resolve);
            }
            else {
                this.lock = true;
                resolve();
            }
        });
    }
    /**
     * remove the lock and initiate the next request, if any is in the queue
     */
    removeLock() {
        this.lock = false;
        if (this.queue.length > 0) {
            const resolver = this.queue.shift();
            this.lock = true;
            resolver();
        }
    }
    /**
     * add a lock request to the queue and call the method parameter with context and arguments,
     * when the request list before is finished.
     * @param method
     * @param context
     * @param args
     * @returns {Promise<T>}
     */
    addToQueue(method, context, args) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.requestLock();
            try {
                return yield method.apply(context, args);
            }
            finally {
                //
                // lock will removed in the next event loop call
                //
                setTimeout(() => this.removeLock(), 0);
            }
        });
    }
}
exports.LockQueue = LockQueue;
//# sourceMappingURL=queue.js.map