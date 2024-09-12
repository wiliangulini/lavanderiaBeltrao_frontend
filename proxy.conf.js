const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: 'http://lavanderiabeltrao.com.br:8080/',
    secure: false,
    logLevel: 'debug'
  }
];

module.exports = PROXY_CONFIG;
