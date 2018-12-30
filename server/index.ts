import {Application} from 'express';
import * as next from 'next';
import * as nextServerless from 'next-serverless/handler';
import 'reflect-metadata';
import 'source-map-support/register';

import Kernel from './Kernel';

const dev = process.env.NODE_ENV !== 'production';
if (process.env.IS_OFFLINE) {
    process.env.LAMBDA_TASK_ROOT  = 'true';
    process.env.AWS_EXECUTION_ENV = 'true';
}

declare global {
    namespace NodeJS {
        interface Global {
            app: next.Server;
            kernel: Application;
            handler: any;
        }
    }
}

global.app = next({dev});
module.exports.handler = async (event, context, callback) => {
    if (!global.kernel) {
        global.kernel  = await Kernel(global.app);
    }
    global.handler = nextServerless(global.app, global.kernel);

    try {
        console.log('Getting Response');
        debugger;
        const response = await global.handler(event, context);
        console.log('Response: ', {response});

        return response;
    } catch (e) {
        console.error({e});
    }
};
