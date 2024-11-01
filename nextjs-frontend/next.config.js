const PublicConfig = require('./config.js');

module.exports = {
    publicRuntimeConfig: { ...PublicConfig },
    images: {
        domains: ['127.0.0.1'],
      },
}