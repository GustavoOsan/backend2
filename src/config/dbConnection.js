const mongoose = require('mongoose');
const MONGO_URI = "mongodb+srv://gustavoosan:HIRoma-550@cluster0.eqbm5rt.mongodb.net/?appName=Cluster0";
const dbConnection = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Conectado a la Base de Datos exitosamente");
    } catch (error) {
        console.error("⛔ Error al conectar a la Base de Datos:", error);
        process.exit(1);
    }
};

module.exports = { dbConnection };