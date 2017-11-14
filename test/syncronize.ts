import {expect} from "mochaccino";

import {Synchronize} from "../lib/synchronize";
describe('Synchronize', () => {
    it('should be added to classes', async () => {
        const positions = [];
        class Test {
            @Synchronize()
            async method(position: number) {
                positions.push(position);
                // 'Should be the instance of Test'
                expect(this instanceof Test)
                    .toBe(true);
            }
        }

        const test = new Test();
        for (let i = 0;i<10;i++) {
            test.method(i);
        }
        // 'No method should be called at this time,
        // because lock is request before and must wait for the next iteration of event loop.'
        expect(positions.length)
            .toBe(0);
        await test.method(10);
        // 'All 11 events are called.'
        expect(positions.length)
            .toBe(11);
        // 'Every call is handled in the right order.'
        expect(positions.every((value, index) => value === index))
            .toBe(true);

    });
});
