import nodemailer from 'nodemailer';


export const emailRegistro = async (datos) => {

  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  //Informacion de email
  const informacion = await transport.sendMail({
    from: "UpTask - Administrador de Proyectos",
    to: email,
    subject: "UpTask - Comprueba tu cuenta",
    text: "Comprueba tu cuenta en UpTask",
    html: `
      <p>Hola: ${nombre} Comprueba tu cuenta en UpTaks</p>
      <p>Tu Cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace: </p>
      <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
      <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    `
  })

}

export const emailOlvidePassword = async (datos) => {

  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  //Informacion de email
  const informacion = await transport.sendMail({
    from: "UpTask - Administrador de Proyectos",
    to: email,
    subject: "UpTask - Reestablece tu Password",
    text: "Reestablece tu password en UpTask",
    html: `
      <p>Hola: ${nombre}, has solicitado reestablecer tu password en UpTaks</p>
      <p>Sigue el siguiente enlace para generar un nuevo password: </p>
      <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer password</a>
      <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
    `
  })

}