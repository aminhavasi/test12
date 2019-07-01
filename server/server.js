process.env.NODE_CONFIG_DIR = __dirname + '/config';
const config = require('config');

console.log(config.get('LEVEL'));