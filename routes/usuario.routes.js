import { Router } from 'express';
import { autenticar, comprobarToken, confirmar, nuevoPassword, olvidePassword, perfil, registrar } from '../controllers/usuario.controller.js';
import { checkAuth } from '../middleware/checkAuth.js';

const router = Router();

//autenticacion, registro y confirmacion de usuarios - area publica
router.post('/', registrar);
router.post('/login', autenticar);
router.get('/confirmar/:token', confirmar);
router.post('/olvide-password', olvidePassword);
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);


//area privada
router.get('/perfil', checkAuth, perfil);


export default router;