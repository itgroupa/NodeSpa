const {createServer} = require('http');
const fs = require('fs');
const {resolve, extname} = require('path');
const server = createServer();
const prefix = 'TURIN_';

let settings={
    port: 8080
};

const getParam = () => JSON.stringify(settings);

const settingsFile = `./settings/settings.${process.env[`${prefix}env`]}.json`;
const settingFileDefault = './settings/settings.json';

const readSettings = (path) => {
    const data = JSON.parse(fs.readFileSync(path));
    settings = {...settings, ...data};
    console.log(`settings from file ${path} ${getParam()}`);
};

if (fs.existsSync(settingsFile)) {
    readSettings(settingsFile);
} else {
    readSettings(settingFileDefault);
}

const {env} = process;
for (const key in env) {
    if (key.includes(prefix)) {
        const trueKey = key.replace(prefix, '');
        if (settings[trueKey]) {
            settings[trueKey] = env[key];
        }
    }
}

console.log(`start listener port ${settings.port}`);
console.log(`final params ${getParam()}`);
const eventsEmitter = server.listen(settings.port);
fs.writeFileSync('./settings.json', getParam());
const contentType = 'Content-Type';
const {text, json } = mimeTypes = {
    'html': 'text/html',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'js': 'text/javascript',
    'css': 'text/css',
    'text': 'plain/text',
    'json': 'application/json'
};
let files = {};
eventsEmitter.addListener('request', ({url: requestUrl}, res) => {
    const url = extname(requestUrl) === '' ? 'index.html' : requestUrl;
    const fileExtension = extname(url).split('.').pop();
    const filePath = resolve(`./${url}`);
    const indexHtml = resolve(`./index.html`);
    res.setHeader(contentType, mimeTypes[fileExtension] || text);
    const truePath = fs.existsSync(filePath) ? filePath : indexHtml;
    if (files[truePath]) {
        res.end(files[truePath]);
        return;
    }
    let data = fs.readFileSync(truePath);
    files[truePath] = data;
    res.end(data);
});