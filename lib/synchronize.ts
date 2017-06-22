import {LockQueue} from "./queue";


const STANDARD_TOKEN = Math.random().toString(16);
const queueMap = new WeakMap<Symbol, LockQueue>();
/**
 * generate or get a LockQueue from an token
 * @param token
 * @returns {LockQueue}
 */
const getLockQueue = (token: string | symbol = STANDARD_TOKEN): LockQueue => {
    if (!token) {
        throw new Error('A token is required to handle a queue for locking.');
    }
    if (typeof token === 'string') {
        token = Symbol.for(token);
    }
    if (!queueMap.has(token)) {
        queueMap.set(token, new LockQueue());
    }
    return queueMap.get(token);
};

/**
 * The Synchronize decorator allows to create synchronized methods on classes, that
 * will be called once a time for each token.
 * usage:
 * class TestClass {
 *
 *      //
 *      // should only run once a time and in the
 *      // chain given by the call time
  *     // also known as first in first out
 *      //
 *      @Synchronize()
 *      method(value: string, ...args) {
 *
 *      }
 *
 *      //
 *      // another way is to specify a token
 *      // so only method synchronized with this token are affected.
 *      //
 *      @Synchronize('token1')
 *      method2(value: string, ...args) {
 *
 *      }
 *
 * }
 * @param token
 * @returns {(target:any, method:string, descriptor:PropertyDescriptor)=>undefined}
 * @constructor
 */
export const Synchronize = (token: string | symbol = STANDARD_TOKEN) => {
    const queue: LockQueue = getLockQueue(token);
    /**
     * internal function for the decorator.
     */
    return (target, method: string, descriptor: PropertyDescriptor) => {
        //
        // save the old method
        //
        const _tmpMethod = descriptor.value;
        if (typeof _tmpMethod !== 'function') {
            throw new Error('No function given');
        }
        //
        // replace with lock mechanism
        //
        descriptor.value = function (...args) {
            return queue.addToQueue(_tmpMethod, this, args);
        };
    }
};


/**
 * The synchronize method replace a function with an function
 * @param token
 * @param func
 * @returns {(...args:any[])=>Promise<T>}
 * @constructor
 */
export const SynchronizeMethod = (token: string | symbol = STANDARD_TOKEN, func: Function) => {
    const queue: LockQueue = getLockQueue(token);
    if (typeof func === 'function') {
        return function (...args) {
            return queue.addToQueue(func, this, args)
        }
    }
    throw new Error('No function given');
};