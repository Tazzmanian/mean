import path from 'path';
import { MongoMemoryServer } from 'mongodb-memory-server';
import NodeEnvironment from 'jest-environment-node';


export class MongoTest extends NodeEnvironment {
    mongod = new MongoMemoryServer({
        autoStart: false,
    });
    mongoConfig: {};

    constructor(config) {
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

    runScript(script) {
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
