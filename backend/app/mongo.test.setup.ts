import path from 'path';
import { MongoMemoryServer } from 'mongodb-memory-server';
import NodeEnvironment from 'jest-environment-node';
import { Config } from '@jest/types';
import { Script } from 'vm';


export class MongoTest extends NodeEnvironment {
    mongod = new MongoMemoryServer({
        autoStart: false,
    });
    mongoConfig: {
        mongoDBName: string;
        mongoUri: string;
    } | undefined;

    constructor(config: Config.ProjectConfig) {
        super(config);
    }

    async setup() {
        console.log('Setup MongoDB Test Environment');

        await super.setup();
    }

    async teardown() {
        console.log('Teardown MongoDB Test Environment');

        await super.teardown();
    }

    runScript(script: Script) {
        return super.runScript(script);
    }

    public async startMongo() {
        await this.mongod.start();
        this.mongoConfig = {
            mongoDBName: 'jest',
            mongoUri: await this.mongod.getConnectionString(),
        };
    }

    public async stopMongo() {
        await this.mongod.stop();
    }
}
