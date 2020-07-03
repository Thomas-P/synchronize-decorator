/**
 * LockQueue is a simple implementation of a lock mechanism with no dead lock check
 * Each time a lock is request, it internally push the request to a queue or handle it
 * after the request is solved, the
 */
export class LockQueue {
    private queue: Array<Function> = [];
    private lock: boolean;

    constructor() {

    }

    /**
     *  An internal method to request a lock.
     *  If the lock is already set or if it is not available,
     *  then the callback will be stored in a queue and called after
     *  the request before is finished.
     * @returns {Promise<T>}
     */
    private requestLock<T>(): Promise<T> {
        return new Promise((resolve) => {
            if (this.lock) {
                this.queue.push(resolve);
            } else {
                this.lock = true;
                resolve();
            }
        });
    }

    /**
     * remove the lock and initiate the next request, if any is in the queue
     */
    private removeLock() {
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
    public async addToQueue<T>(method: Function, context?: any, args?: any[]): Promise<T> {
        await this.requestLock();
        try {
            return await method.apply(context, args);
        } finally {
            //
            // lock will removed in the next event loop call
            //
            setTimeout(() => this.removeLock(), 0);
        }
    }
}