import { Router }  from 'express';
import { check  } from 'express-validator';
import { addCompany, updateCompany, getCompany, generateExcelReport } from './companies.controller.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { existeCompanyById } from '../helpers/db-validator.js';
import { validarCampos } from '../middlewares/validar-campos.js';

const router = Router();

router.post(
    '/addCompany',
    validarJWT,
    addCompany
);
 
router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeCompanyById),
        validarCampos
    ],
    updateCompany
);

router.get(
    '/',
    validarJWT,
    getCompany
);

router.get(
    '/generateExcelReport',
    validarJWT,
    generateExcelReport
);


export default router;