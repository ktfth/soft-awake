"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigCommand = void 0;
class ConfigCommand {
    constructor() {
        this.config = new Map();
    }
    async execute(args, options = {}) {
        if (args.length === 0) {
            throw new Error('Config subcommand required');
        }
        const subcommand = args[0];
        switch (subcommand) {
            case 'set':
                if (args.length < 3) {
                    throw new Error('Key and value required for set operation');
                }
                return await this.handleSet(args[1], args[2]);
            case 'get':
                if (args.length < 2) {
                    throw new Error('Key required for get operation');
                }
                return await this.handleGet(args[1]);
            case 'list':
                return await this.handleList();
            default:
                throw new Error('Invalid config subcommand');
        }
    }
    async setConfig(key, value) {
        if (key === 'api-key') {
            if (!await this.validateApiKey(value)) {
                throw new Error('Invalid API key format');
            }
        }
        if (key === 'cache-ttl') {
            if (!await this.validateCacheTtl(value)) {
                throw new Error('Invalid cache TTL value');
            }
        }
        this.config.set(key, value);
    }
    async getConfig(key) {
        return this.config.get(key) || null;
    }
    async listConfig() {
        const result = {};
        for (const [key, value] of this.config) {
            result[key] = value;
        }
        return result;
    }
    async validateApiKey(key) {
        return key.startsWith('sk-or-v1-') && key.length > 20;
    }
    async validateCacheTtl(ttl) {
        const num = parseInt(ttl, 10);
        return !isNaN(num) && num > 0 && num <= 8760;
    }
    async handleSet(key, value) {
        await this.setConfig(key, value);
        console.log(`Set ${key} = ${value}`);
        return 0;
    }
    async handleGet(key) {
        const value = await this.getConfig(key);
        if (value !== null) {
            console.log(value);
        }
        else {
            console.log('Key not found');
        }
        return 0;
    }
    async handleList() {
        const config = await this.listConfig();
        for (const [key, value] of Object.entries(config)) {
            console.log(`${key} = ${value}`);
        }
        return 0;
    }
}
exports.ConfigCommand = ConfigCommand;
//# sourceMappingURL=ConfigCommand.js.map