import { Router }  from 'express';
import { check  } from 'express-validator';
import { addClient, updateClient } from './client.controller.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { existeClientById } from '../helpers/db-validator.js';
import { validarCampos } from '../middlewares/validar-campos.js';

const router = Router();

router.post(
    '/addClient',
    validarJWT,
    addClient
);
 
router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeClientById),
        validarCampos
    ],
    updateClient
);

export default router;