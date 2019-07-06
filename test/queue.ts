import {equal} from 'assert';
import {LockQueue} from '../lib/queue';


describe('LockQueue', () => {
    it ('should have the right interface', () => {
        //  LockQueue is a function constructor.
        equal(typeof LockQueue, 'function');

        // queue is an instance of LockQueue.
        const queue = new LockQueue();
        equal(queue instanceof LockQueue, true);

        // LockQueue has a function named addToQueue
        equal(typeof queue.addToQueue, 'function');
    });

    it('adding Promises to the Queue lock them', async () => {
        //
        // set up promises
        //
        const isCalled = [];
        const resolver = [];
        const inOrder = [];
        const queue = new LockQueue();
        //
        // create an async method and add them to the list.
        //
        const createLockMethod = () => {
            const position = isCalled.length;
            isCalled.push(false);
            const promise = new Promise((resolve, reject) => {
                resolver.push(resolve);
            });
            queue.addToQueue(() => {
                isCalled[position] = true;
                inOrder.push(position);
                return promise;
            });
        };
        const CREATE_NUM_PROMISES = 10;
        //
        // fill up with 10 items
        //
        for (let i = 0; i < CREATE_NUM_PROMISES; i++) {
            createLockMethod();
        }
        // Every value in the is Called chain must be false.
        equal(isCalled.every((value) => value === false), true);
        // Length of called chain must be ${CREATE_NUM_PROMISES}
        equal(isCalled.length, CREATE_NUM_PROMISES);

        // `Length of resolver chain must be ${CREATE_NUM_PROMISES}`
        equal(resolver.length, CREATE_NUM_PROMISES);
        // `Every value of the resolver chain is a function.`
        equal(resolver.every((value) => typeof value === 'function'), true);

        for (let i = CREATE_NUM_PROMISES; i>1; i--) {
            await new Promise(resolve => {
                const pos = i-1;
                // call the resolver at this position
                resolver[pos]();
                setTimeout(resolve, 0)
            });
        }
        // first is called
        // 'First value is called every other in the chain is not.'
        equal(isCalled.every((value, index) => value === (index===0)),true);
        await new Promise(resolve => {
            // first event finished
            resolver[0]();
            // call the resolver at this position
            setTimeout(resolve, 0)
        });

        await queue.addToQueue(() => {
            // 'Every value in the is called chain must be false, even if the resolver is called'
            equal(isCalled.every((value, index) => value === true), true);
            // 'Every method is called in the right order.'
            equal(inOrder.every((value, index) => value === index), true)
        });
    })
});
