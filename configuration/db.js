const Sequelize = require("sequelize");
const { configDatabase, DEFAULT_CONNECTION } = require("./configDatabase.js");
const mongoose = require('mongoose');
const path = require('path');

//Definicion de base de datos por defecto
const connections = {};
const defaultConfig = configDatabase[DEFAULT_CONNECTION];
const sequelize = new Sequelize(
    defaultConfig.database,
    defaultConfig.username,
    defaultConfig.password,
    defaultConfig.options
);

//Inicialización de base de datos especificada en el parámetro
async function sequelizeInit(instancia = DEFAULT_CONNECTION) {
    if (connections[instancia]) {
        return connections[instancia];
    }

    const dbConfig = configDatabase[instancia];
    const newSequelize = new Sequelize(
        dbConfig.database,
        dbConfig.username,
        dbConfig.password,
        dbConfig.options
    );

    connections[instancia] = newSequelize;
    return newSequelize;
}

//Conexión a las bases de datos
const connectionDb = async () => {
    try {
        for (const [key, value] of Object.entries(configDatabase)) {
            const sequelizeInstance = await sequelizeInit(key);
            await sequelizeInstance.authenticate();
            console.log(`Conexión exitosa a ${value.database} (${value.options.dialect})`);
        }
    } catch (error) {
        console.error(`Error al conectar: ${error}`);
    }
};

//Conexion para MongoDB
const connectionMongo = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) return;

        const caFilePath = path.join(process.cwd(), 'global-bundle.pem');

        await mongoose.connect(uri, {
            tls: true,
            tlsCAFile: caFilePath,
            tlsAllowInvalidHostnames: true,
            retryWrites: false,
            directConnection: true,
            serverSelectionTimeoutMS: 5000
        });

        console.log("Conexión exitosa a MongoDB via Túnel SSH");
    } catch (error) {
        console.error("Error conectando a MongoDB: ", error.message);
 }
}

module.exports = {
    sequelize,
    sequelizeInit,
    connectionDb,
    connectionMongo,
    mongoose
};
