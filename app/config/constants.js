import path from 'path';
import merge from 'lodash/merge';
import sites from './sites';

// Default configuations applied to all environments
const defaultConfig = {
  env: process.env.NODE_ENV,
  get envs() {
    return {
      test: process.env.NODE_ENV === 'test',
      development: process.env.NODE_ENV === 'development',
      production: process.env.NODE_ENV === 'production',
    };
  },

  version: require('../../package.json').version,
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 3310,
  ip: process.env.IP || '0.0.0.0',
  apiPrefix: '', // Could be /api/resource or /api/v2/resource
  userRoles: ['guest', 'user', 'admin'],
  getSite: function(site) {
    return sites[site];
  },
  /**
   * MongoDB configuration options
   */
  mongo: {
    seed: true,
    options: {
      db: {
        safe: true,
      },
    },
  },

  smtpConfig : {
    service: 'gmail',
    port: 465,
    secure: true, // upgrade later with STARTTLS
      auth: {
          user: process.env.MAIL_ACCOUNT || 'info@guiahoteleraargentina.com',
          pass: process.env.MAIL_PASSWORD,
      }
  },
  /**
   * Security configuation options regarding sessions, authentication and hashing
   */
  security: {
    sessionSecret: process.env.SESSION_SECRET || 'i-am-the-secret-key',
    sessionExpiration: process.env.SESSION_EXPIRATION || 60 * 60 * 24 * 7, // 1 week
    saltRounds: process.env.SALT_ROUNDS || 12,
  },
};

// Environment specific overrides
const environmentConfigs = {
  development: {
    mongo: {
      uri: process.env.MONGO_URI || 'mongodb://localhost/admin',
    },
    security: {
      saltRounds: 4,
    },
  },
  test: {
    port: 5678,
    mongo: {
      uri: process.env.MONGO_URI || 'mongodb://localhost/test',
    },
    security: {
      saltRounds: 4,
    },
  },
  production: {
    mongo: {
      seed: false,
      uri: process.env.MONGO_URI,
    },
  },
};

// Recursively merge configurations
export default merge(defaultConfig, environmentConfigs[process.env.NODE_ENV] || {});
