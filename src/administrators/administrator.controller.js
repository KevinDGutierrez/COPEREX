import { response, request } from "express";
import { hash, verify } from "argon2";
import { generarJWT } from "../helpers/generate-jwt.js"
import Admin from "./administrator.model.js";

export const register = async (req, res) => {
    
    try {
        const data = req.body;

        const encryptedPassword = await hash (data.password);

        const admin = await Admin.create({
            name: data.name,
            surname: data.surname,
            username: data.username.toLowerCase(),
            email: data.email.toLowerCase(),
            phone: data.phone,
            password: encryptedPassword,
            role: data.role,
        });

        return res.status(201).json({
            message: "Amdim registered successfully",
            adminDetails: {
                admin: admin.email
            }
        });

    } catch (error) {
        
        console.log(error);

        return res.status(500).json({
            msg: "Admin registration failed",
            error
        });
    }

};

export const login = async (req , res) => {
    try {

        const { email, password, username } = req.body;
        
        const lowerEmail = email ? email.toLowerCase() : null;
        const lowerUsername = username ? username.toLowerCase() : null;
        
        const admin = await Admin.findOne({
            $or: [{ email: lowerEmail }, { username: lowerUsername }] 
        });
        
        if (!admin) {
            return res.status(404).json({ msg: 'Admin not found' });
        }
        if (admin.estado  === false){
            return res.status(404).json({
                msg: 'Admin is disabled'
            })
        }

        const validPassword = await verify(admin.password, password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'The password is incorrect'
            });
        }

        const token = await generarJWT(admin.id);

        return res.status(200).json({
            msg: 'Login successful',
            adminDetails: {
                username: admin.username,
                token: token            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error getting admin',
            error
        })
    }
};

export const updateAdmin = async (req, res = response) => {

    try {

        const { id } = req.params;
        const { _id, password, email, actualpassword, ...data } = req.body;
        let { username } = req.body;

        if (username) {
            username = username.toLowerCase();
            data.username = username;
        }

        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                msg: 'admin not found'
            })
        }

        if(req.admin.id !== id){
            return res.status(400).json({
                success: false,
                msg: 'You are not the owner of this profile, you cannot update this admin'
            })
        }

        if (admin.status === false) {
            return res.status(400).json({
                success: false,
                msg: 'This user has been deleted'
            });
        }

        if(password){
            if(!actualpassword){
                return res.status(400).json({
                    success: false,
                    msg: 'You must provide your current password'
                })
            }

            const verifypassword = await verify(admin.password, actualpassword);

            if(!verifypassword){
                return res.status(400).json({
                    success: false,
                    msg: 'Password is incorrect'
                })
            }
            data.password = await hash(password);
        }

        const adminUpdate = await Admin.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Admin Updated',
            adminUpdate
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: 'Error updating admin',
            error
        })   
    }
};


export const createAdmin = async () => {
    try {
        
        const admin = await Admin.findOne({username: "Admin".toLowerCase()})
        
        if(!admin){
            const password = await hash("12345678");
            const newAdmin = new Admin({
                name: "Kevin",
                surname: "Gutierrez",
                username: "Admin".toLowerCase(),
                email: "kevin161@gmail.com",
                phone: "32111213",
                password: password
            });
            await newAdmin.save();
            console.log("Administrator created successfully");
        }else{
            console.log("Administrator already exists");
        }

    } catch (error) {
        console.error("Failed to create admin: ", error)
    }
}