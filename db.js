const fs = require("fs");

const dirBase = __dirname + "/_db";
const dirs = {
    config_storage: dirBase + "/_configs",
    user_storage: dirBase + "/_users"
}

if (!fs.existsSync(dirBase))
    fs.mkdirSync(dirBase);

for (let dir of Object.values(dirs)) {
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir);
}

// helper funcs
function readAsJSON(filename) {
    try {
        const data = fs.readFileSync(filename, { encoding: "utf8" });
        return JSON.parse(data);
    } catch(err) {
        return {};
    }
}
function saveAsJSON(filename, data) {
    try {
        const jsonData = JSON.stringify(data, undefined, 4);
        fs.writeFileSync(filename, jsonData, { encoding: "utf8" });
        return true;
    } catch(err) {
        console.error(err);
        return false;
    }
}
function sanityCheckFile(filename) {
    if (!fs.existsSync(filename))
        saveAsJSON(filename, {
            channel_id: null,
            user_id: null,
            session: null,
            backend: null,
            starting_prompt: null,
            messages: []
        });
}

class BaseDB {
    constructor() {
        this.data = {};
    }

    save() {
        saveAsJSON(this.fn, this.data);
    }

    set(property, value) {
        if (typeof property == "object") {
            for (let entry of Object.entries(property)) {
                const [ k, v ] = entry;
                this.data[k] = v;
            }
        } else {
            this.data[property] = value;
        }
        this.save();
    }

    get(property) {
        return this.data[property];
    }
}

class UserDB extends BaseDB {
    constructor(userId) {
        super();

        if (Number(userId) == NaN)
            throw new Error("Argument #1 must be type number");

        this.fn = `${dirs.user_storage}/${userId.toString()}.json`;
        sanityCheckFile(this.fn);

        let savedData = readAsJSON(this.fn);

        savedData.userId = userId;
        savedData.messageHistory = (typeof savedData.messageHistory == "object") ? savedData.messageHistory : [];
        savedData.savedConfigurations = (typeof savedData.savedConfigurations == "object") ? savedData.savedConfigurations : [];

        this.data = savedData;
    }
}

class ConfigDB extends BaseDB {
    constructor(configId, createIfNotExist) {
        super();

        if (Number(configId) == NaN)
            throw new Error("Argument #1 must be type number");

        this.fn = `${dirs.config_storage}/${configId.toString()}.json`;

        if (!createIfNotExist && !fs.existsSync(this.fn))
            throw new Error("No configuration found with ID " + configId);
        else
            sanityCheckFile(this.fn)

        let savedData = readAsJSON(this.fn);

        savedData.configId = configId;

        this.data = savedData;
    }

    delete() {
        fs.rmSync(this.fn);
    }
}

module.exports = { UserDB, ConfigDB }