require('dotenv').config();

//Configuracion de las bases de datos
const configDatabase = {
    PIOAPP: {
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      options: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_CONNECTION,
        timezone: '-06:00',
        dialectOptions: {
          useUTC: false,
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      }
    },
    NOMINA: {
      database: process.env.DB_SECOND_DATABASE,
      username: process.env.DB_SECOND_USERNAME,
      password: process.env.DB_SECOND_PASSWORD,
      options: {
        host: process.env.DB_SECOND_HOST,
        port: process.env.DB_SECOND_PORT,
        dialect: process.env.DB_SECOND_CONNECTION,
        timezone: 'America/Guatemala',
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          },
        },
      }
    },
    PDV: {
      database: process.env.DB_THIRD_DATABASE,
      username: process.env.DB_THIRD_USERNAME,
      password: process.env.DB_THIRD_PASSWORD,
      options: {
        host: process.env.DB_THIRD_HOST,
        port: process.env.DB_THIRD_PORT,
        dialect: process.env.DB_THIRD_CONNECTION,
        timezone: 'America/Guatemala',
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          },
        },
      }
    }
};

const DEFAULT_CONNECTION = 'PIOAPP';

module.exports = {
    configDatabase,
    DEFAULT_CONNECTION
};