import Proyecto from "../models/Proyecto.js";
import mongoose from 'mongoose';
import Tarea from "../models/Tarea.js";

//Funcion para obtener todos los proyectos del usuario
const obtenerProyectos = async (req, res) => {
  const proyectos = await Proyecto.find().where('creador').equals(req.usuario);

  return res.status(200).json(proyectos);
}

//Funcion para crear un nuevo proyeco
const nuevoProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body);
  proyecto.creador = req.usuario._id;

  try {
    const proyectoAlmacenado = await proyecto.save();
    return res.status(200).json(proyectoAlmacenado);
  } catch (error) {
    console.log(error)
  }

}

//Funcion para obtener un solo proyecto
const obtenerProyecto = async (req, res) => {
  const { id } = req.params;

  let proyecto


  //Comprobamos que el id sea valido
  if (mongoose.Types.ObjectId.isValid(id)) {
    proyecto = await Proyecto.findById(id);
  } else {
    const error = new Error('El proyecto no fue encontrado');
    return res.status(404).json({ msg: error.message });
  }

  //Comprobamos que el proyecto existe
  if (!proyecto) {
    const error = new Error('El proyecto no fue encontrado');
    return res.status(404).json({ msg: error.message });
  }

  //Para comprobar que el usuario sea el mismo que el creador
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción no Válida!');
    return res.status(404).json({ msg: error.message });
  }

  //Obtener las tareas del proyecto
  //tienes que ser el creador del proyecto o colaborador
  const tareas = await Tarea.find().where('proyecto').equals(proyecto._id);


  return res.json({
    proyecto,
    tareas
  });
}

//Funcion para editar un proyecto
const editarProyecto = async (req, res) => {
  const { id } = req.params;

  let proyecto

  //Comprobamos que el id sea valido
  if (mongoose.Types.ObjectId.isValid(id)) {
    proyecto = await Proyecto.findById(id);
  } else {
    const error = new Error('El proyecto no fue encontrado');
    return res.status(404).json({ msg: error.message });
  }

  //Comprobamos que el proyecto existe
  if (!proyecto) {
    const error = new Error('El proyecto no fue encontrado');
    return res.status(404).json({ msg: error.message });
  }

  //Para comprobar que el usuario sea el mismo que el creador
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción no Válida!');
    return res.status(404).json({ msg: error.message });
  }

  try {
    //Editamos el proyecto encontrado
    const proyecoActualizado = await Proyecto.findOneAndUpdate(Proyecto._id, req.body, { new: true });

    return res.status(200).json(proyecoActualizado);
  } catch (error) {
    console.log(error)
  }
}

//Funcion para eliminar un proyecto
const eliminarProyecto = async (req, res) => {
  const { id } = req.params;

  let proyecto

  //Comprobamos que el id sea valido
  if (mongoose.Types.ObjectId.isValid(id)) {
    proyecto = await Proyecto.findById(id);
  } else {
    const error = new Error('El proyecto no fue encontrado');
    return res.status(404).json({ msg: error.message });
  }

  //Comprobamos que el proyecto existe
  if (!proyecto) {
    const error = new Error('El proyecto no fue encontrado');
    return res.status(404).json({ msg: error.message });
  }

  //Para comprobar que el usuario sea el mismo que el creador
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción no Válida!');
    return res.status(404).json({ msg: error.message });
  }

  try {
    await proyecto.deleteOne();
    return res.json({ msg: 'Proyecto Eliminado!' });
  } catch (error) {
    console.log(error);
  }
}

const agregarColaborador = async (req, res) => {

}

const eliminarColaborador = async (req, res) => {

}



export {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador,
}