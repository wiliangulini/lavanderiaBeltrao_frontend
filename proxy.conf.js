const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: 'http://192.168.0.114:8080/',
    secure: false,
    logLevel: 'debug'
  }
];

module.exports = PROXY_CONFIG;
