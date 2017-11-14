# synchronize-decorator
[![Greenkeeper badge](https://badges.greenkeeper.io/Thomas-P/synchronize.svg)](https://greenkeeper.io/) [![Build Status](https://travis-ci.org/Thomas-P/synchronize.svg?branch=master)](https://travis-ci.org/Thomas-P/synchronize) [![Coverage Status](https://coveralls.io/repos/github/Thomas-P/synchronize/badge.svg)](https://coveralls.io/github/Thomas-P/synchronize) [![Known Vulnerabilities](https://snyk.io/test/github/thomas-p/synchronize/badge.svg)](https://snyk.io/test/github/thomas-p/synchronize)

Synchronize is a little module, that allows you to run an async method once a time. I needed it for a server, where I could request a resource only once a time. So I wrote this little helper, that could use for this. 

## usage
```typescript
    import {Synchronize} from 'decorator-synchronize';

    class TestClass {
        /**
        *   This method should only run once a time 
        */
        @Synchronize()
        async method1(value: string, ... args) {
            //
            // do async stuff 
            //
        }

    
        /**
        *   Each method with this token should only run once a time 
        */
        @Synchronize('token')
        async method1(value: string, ... args) {
            //
            // do async stuff 
            //
        }
    }
```