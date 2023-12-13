import bcrypt from 'bcryptjs'

import { generarId } from "../helpers/generarId.js";
import Usuario from "../models/Usuario.js";
import { generarToken } from '../helpers/generarJWT.js';
import { emailRegistro, emailOlvidePassword } from '../helpers/email.js';

//Funcion para registrar usuario
export const registrar = async (req, res) => {

  //Evitar registros duplicados
  const { email } = req.body;

  const usuarioExiste = await Usuario.findOne({ email });

  if (usuarioExiste) {
    const error = new Error('Uusario ya registrado!')

    return res.status(400).json({ msg: error.message });
  }

  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId();
    await usuario.save();

    //Funcion para mandar el email
    emailRegistro({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token
    });

    return res.json({ msg: 'Usuario creado correctamente! Revisa tu Email para confirmar tu cuenta.' });


  } catch (error) {
    console.log(error)
  }

}

//Funcion para autenticar al usuarios
export const autenticar = async (req, res) => {
  const { email, password } = req.body;

  //Comprobar si el usuario existe
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    const error = new Error('El Usuario no existe');
    return res.status(404).json({ msg: error.message });
  }

  //comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    const error = new Error('Tu cuenta no ha sido confirmada!');
    return res.status(404).json({ msg: error.message });
  }

  //comprobar password
  if (!await usuario.comprobarPassword(password)) {
    const error = new Error('El password es incorrecto!');
    return res.status(404).json({ msg: error.message });
  }

  //Mandamos al usuario y generamos el jwt
  res.status(200).json({
    _id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    token: generarToken(usuario._id),
  });
}

//confirmar la cuenta del usuario
export const confirmar = async (req, res) => {
  //Obtenemos el token del url
  const { token } = req.params;

  //Buscamos al usuario por ese token
  const usuarioConfirmar = await Usuario.findOne({ token });

  if (!usuarioConfirmar) {
    const error = new Error('Token no valido!');
    return res.status(403).json({ msg: error.message });
  }

  try {
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = "";
    await usuarioConfirmar.save();
    return res.json({ msg: 'Usuario Confirmado correctamente!' });
  } catch (error) {
    console.log(error)
  }
}

//para validar el email del usuario
export const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error('El Usuario no existe');
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuario.token = generarId();
    await usuario.save();
    //mandar email con instrucciones
    emailOlvidePassword({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token
    })

    return res.status(200).json({ msg: 'Hemos enviado un email con las instrucciones' })
  } catch (error) {
    console.log(error);
  }
}


//funcion para comprobar el token
export const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const tokenValido = await Usuario.findOne({ token });

  if (!tokenValido) {
    const error = new Error('Token no valido');
    return res.status(404).json({ msg: error.message });
  }

  return res.json({ msg: 'el token es valido!' })
}

//Funcion para generar el nuevo password
export const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body

  const usuario = await Usuario.findOne({ token });

  if (!usuario) {
    const error = new Error('Token no valido');
    return res.status(404).json({ msg: error.message });
  }

  //Cambiamos el password y eliminamos el token
  usuario.password = password;
  usuario.token = '';

  try {
    await usuario.save();
    return res.json({ msg: 'Password Modificado Correctamente!' })
  } catch (error) {
    console.log(error);
  }

}


//Funcion para obtener el perfil del usuario
export const perfil = async (req, res) => {
  const { usuario } = req;
  res.json(usuario);
}