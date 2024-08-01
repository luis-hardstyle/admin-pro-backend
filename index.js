require('dotenv').config();
const express = require('express');
const {dbConnection} = require('./database/config')
const cors = require('cors')

// Crear el servidor
const app = express();

//Configurar cors
app.use(cors())

//lectura y parse del body
app.use(express.json());

//base de datos
dbConnection();

//Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));



app.listen(process.env.PORT, () => {
    console.log('servidor iniciado ' +  process.env.PORT);
})

