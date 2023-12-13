import express, { json } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { conectarBD } from './config/db.js';
import usuarioRoutes from './routes/usuario.routes.js';
import proyectoRoutes from './routes/proyecto.routes.js';
import tareaRoutes from './routes/tareas.routes.js';

const app = express();

//Poder leer informacion de tipo json
app.use(json());

//Para usar las variables de entorno
dotenv.config();

//Funcion para conectar a la base de datos
conectarBD();

//configurar CORS
const whitelist = [process.env.FRONTEND_URL];
const corsOption = {
  origin: function (origin, callback) {

    if (whitelist.includes(origin)) {
      //puede consultar la API
      callback(null, true);
    } else {
      //no esta permitido
      callback(new Error('Error de Cors'));
    }
  }
}

app.use(cors(corsOption));


//Routing
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/tareas', tareaRoutes);

//Puerto de la aplicacion
const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
});