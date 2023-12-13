import mongoose from 'mongoose'

export const conectarBD = async () => {

  try {

    const connection = await mongoose.connect(process.env.MONGO_URI);

    const url = `${connection.connection.host}: ${connection.connection.port}`;
    console.log(`MongoDB conectado en: ${url}`);

  } catch (error) {
    console.log(`error: ${error.message}`);
    process.exit();
  }

}