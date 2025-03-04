import Admin from '../administrators/administrator.model.js'
import Company from '../companies/companies.model.js';
import Client from '../clients/client.model.js';

export const existenteEmail = async (email = ' ') => {
    
    const existeEmail = await Admin.findOne({ email });

    if (existeEmail) {
        throw new Error(`El email ${ email } ya existe en la base de datos`);
    }
}

export const existeAdminById = async (id = '') => {
    const existeAdmin = await Admin.findById(id);

    if (!existeAdmin) {
        throw new Error(`El ID ${ id } no es un administrador válido`);
    }
}

export const existeCompanyById = async (id = '') => {
    const existeCompany = await Company.findById(id);

    if (!existeCompany) {
        throw new Error(`El ID ${ id } no es una empresa válida`);
    }
}

export const existeClientById = async (id = '') => {
    const existeClient = await Client.findById(id);

    if (!existeClient) {
        throw new Error(`El ID ${ id } no es un cliente válido`);
    }
}