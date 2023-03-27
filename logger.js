const fs = require("fs");

const logDir = __dirname + "/_log";

if (!fs.existsSync(logDir))
    fs.mkdirSync(logDir);

function writeLog(filename, message, skipNewline) {
    try {
        const fullPath = `${logDir}/${filename}.md`;
        fs.appendFileSync(fullPath, message + (skipNewline ? "" : "\n"), { encoding: "utf8" });
        return true;
    } catch(err) {
        return false;
    }
}

module.exports = { writeLog }