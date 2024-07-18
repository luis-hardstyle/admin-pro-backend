require('dotenv').config();
const express = require('express');
const {dbConnection} = require('./database/config')
const cors = require('cors')

// Crear el servidor
const app = express();

//Configurar cors
app.use(cors())

//base de datos
dbConnection();

//Rutas
app.get('/',(req, res) =>{
    res.json({
        ok:true,
        msg: 'Hola Mundo'
    })
});

app.listen(process.env.PORT, () => {
    console.log('servidor iniciado ' +  process.env.PORT);
})

