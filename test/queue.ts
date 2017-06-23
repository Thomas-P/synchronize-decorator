import {expect} from "mochaccino";
import {LockQueue} from "../lib/queue";


describe('LockQueue', () => {
    it ('should have the right interface', () => {
        expect(typeof LockQueue)
            .toBe('function', ' LockQueue is a function constructor.');

        const queue = new LockQueue();
        expect(queue instanceof LockQueue)
            .toBe(true, 'queue is an instance of LockQueue.');

        expect(typeof queue.addToQueue)
            .toBe('function', 'LockQueue has a function named addToQueue');
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
        expect(isCalled.every((value) => value === false))
            .toBe(true, 'Every value in the is Called chain must be false.');
        expect(isCalled.length)
            .toBe(CREATE_NUM_PROMISES, `Length of called chain must be ${CREATE_NUM_PROMISES}`);

        expect(resolver.length)
            .toBe(CREATE_NUM_PROMISES, `Length of resolver chain must be ${CREATE_NUM_PROMISES}`);

        expect(resolver.every((value) => typeof value === 'function'))
            .toBe(true, `Every value of the resolver chain is a function.`);

        for (let i = CREATE_NUM_PROMISES; i>1; i--) {
            await new Promise(resolve => {
                const pos = i-1;
                // call the resolver at this position
                resolver[pos]();
                setTimeout(resolve, 0)
            });
        }
        // first is called
        expect(isCalled.every((value, index) => value === (index===0)))
            .toBe(true, 'First value is called every other in the chain is not.');
        await new Promise(resolve => {
            // first event finished
            resolver[0]();
            // call the resolver at this position
            setTimeout(resolve, 0)
        });
        await queue.addToQueue(() => {
            expect(isCalled.every((value, index) => value === true))
                .toBe(true, 'Every value in the is called chain must be false, even if the resolver is called');
            expect(inOrder.every((value, index) => value === index))
                .toBe(true, 'Every method is called in the right order.')
        });
    })
});
