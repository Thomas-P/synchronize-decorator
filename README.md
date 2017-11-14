# synchronize-decorator
[![Greenkeeper badge](https://badges.greenkeeper.io/Thomas-P/synchronize-decorator.svg)](https://greenkeeper.io/) [![Build Status](https://travis-ci.org/Thomas-P/synchronize-decorator.svg?branch=master)](https://travis-ci.org/Thomas-P/synchronize-decorator) [![Coverage Status](https://coveralls.io/repos/github/Thomas-P/synchronize-decorator/badge.svg)](https://coveralls.io/github/Thomas-P/synchronize-decorator) [![Known Vulnerabilities](https://snyk.io/test/github/thomas-p/synchronize-decorator/badge.svg)](https://snyk.io/test/github/thomas-p/synchronize-decorator)

Synchronize is a little module, that allows you to run an async method once a time. I needed it for a server, where I could request a resource only once a time. So I wrote this little helper, that could use for this. 

## usage
```typescript
import {Synchronize} from 'synchronize-decorator';

class TestClass {
    /**
     *   This method should only run once a time
     */
    @Synchronize()
    async methodA(value: string, ... args) {
        //
        // do async stuff
        //
        await new Promise(resolve => {
            const waitFor = Math.random()*1000;
            console.log('Message: ', value);
            console.log('Wait for: ', ~~waitFor, 'ms');
            setTimeout(resolve, waitFor);
        });
    }


    /**
     *   Each method with this token should only run once a time
     */
    @Synchronize('token')
    async methodB(value: string, ... args) {
        //
        // do async stuff
        //
    }
}

const main = async () => {
    const test = new TestClass();
    const testArray = [];
    for (let i=1; i<11;i++) {
        testArray.push(test.methodA('This is the call number ' + i));
    }

    await Promise.all(testArray);
};

main();
// Output:

// Message:  This is the call number 1
// Wait for:  831ms
// Message:  This is the call number 2
// Wait for:  893ms
// Message:  This is the call number 3
// Wait for:  293ms
// Message:  This is the call number 4
// Wait for:  846ms
// Message:  This is the call number 5
// Wait for:  213ms
// Message:  This is the call number 6
// Wait for:  152ms
// Message:  This is the call number 7
// Wait for:  403ms
// Message:  This is the call number 8
// Wait for:  311ms
// Message:  This is the call number 9
// Wait for:  970ms
// Message:  This is the call number 10
// Wait for:  599ms
```