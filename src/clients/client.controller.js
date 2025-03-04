import { response, request } from "express";
import Client from "./client.model.js";


export const addClient= async (req, res) =>{
    try {
        const data = req.body;
    
        if(req.admin.role !== 'ADMIN_ROLE'){
            return res.status(403).json({
                msg: 'You do not have permissions to add clients'
            });
        }

        const client = await Client.create({
            name: data.name.toLowerCase(),
            surname: data.surname,
            email: data.email.toLowerCase(),
            phone: data.phone,
            address: data.address
        });

        return res.status(201).json({
            message: "Client registered successfully",
            client: client
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "There was an error adding the client",
            error
        })
    }
};

export const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, email, ...data } = req.body;
        let { name } = req.body;

        if (name) {
            name = name.toLowerCase();
            data.name = name;
        };

        const client = await Client.findById(id);
        if (!client) {
            return res.status(400).json({
                success: false,
                msg: "Client not found"
            });
        }


        if (client.status === false) {
            return res.status(400).json({
                success: false,
                msg: 'the client is deactivated'
            });
        }

        if(req.admin.role !== 'ADMIN_ROLE'){
            return res.status(403).json({
                msg: 'You do not have permissions to add client'
            });
        }

        const updatedClient = await Client.findByIdAndUpdate(id, data, { new: true });


        return res.status(200).json({
            success: true,
            msg: "client successfully updated",
            client: updatedClient 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "There was an error updating the client",
            error
        })
    }
};