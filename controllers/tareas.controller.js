import Proyecto from '../models/Proyecto.js';
import Tarea from '../models/Tarea.js';

//Funcion para agregar una tarea
const agregarTarea = async (req, res) => {
  const { proyecto } = req.body;

  const existeProyecto = await Proyecto.findById(proyecto);

  if (!existeProyecto) {
    const error = new Error('El proyecto no existe');
    return res.status(404).json({ msg: error.message });
  }

  //comprobar quien creo el proyecto
  if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('No tienes los permisos para anadir tareas');
    return res.status(403).json({ msg: error.message });
  }

  try {
    const tareaAlmacenada = await Tarea.create(req.body);
    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
  }

};

//Funcion para obtener una tarea por id
const obtenerTarea = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate('proyecto');

  //si la tarea no existe
  if (!tarea) {
    const error = new Error('Tarea no encontrada');
    return res.status(404).json({ msg: error.message });
  }

  //Comprobamos el usuario tenga los permisos
  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción no válida');
    return res.status(403).json({ msg: error.message });
  }

  return res.json(tarea);


};

const actualizarTarea = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate('proyecto');

  //si la tarea no existe
  if (!tarea) {
    const error = new Error('Tarea no encontrada');
    return res.status(404).json({ msg: error.message });
  }

  //Comprobamos el usuario tenga los permisos
  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción no válida');
    return res.status(403).json({ msg: error.message });
  }

  try {
    //Editamos el proyecto encontrado
    const tareaActualizada = await Tarea.findOneAndUpdate(Tarea._id, req.body, { new: true });

    return res.status(200).json(tareaActualizada);
  } catch (error) {
    console.log(error);
  }
};

const eliminarTarea = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate('proyecto');

  //si la tarea no existe
  if (!tarea) {
    const error = new Error('Tarea no encontrada');
    return res.status(404).json({ msg: error.message });
  }

  //Comprobamos el usuario tenga los permisos
  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción no válida');
    return res.status(403).json({ msg: error.message });
  }

  try {
    await tarea.deleteOne();
    res.status(200).json({ msg: 'El proyecto ha sido eliminado!' });
  } catch (error) {
    console.log(error);
  }

};

const cambiarEstado = async (req, res) => { };

export {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado
}