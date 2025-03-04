import { Router }  from 'express';
import { check  } from 'express-validator';
import { register, login, updateAdmin} from './administrator.controller.js';
import { registerValidator, loginValidator } from '../middlewares/validator.js';
import { deleteFileOnError } from '../middlewares/delete-file-on-error.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { existeAdminById } from '../helpers/db-validator.js';
import { validarCampos } from '../middlewares/validar-campos.js';

const router = Router();

router.post(
    '/register',
    registerValidator,
    deleteFileOnError,
    validarCampos,
    register
);

router.post(
    '/login',
    loginValidator,
    deleteFileOnError,
    login
);  

router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeAdminById),
        validarCampos
    ],
    updateAdmin
);

export default router;