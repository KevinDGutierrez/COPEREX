import { response, request } from "express";
import { hash, verify } from "argon2";
import { generarJWT } from "../helpers/generate-jwt.js"
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Company from "./companies.model.js";


export const addCompany= async (req, res) =>{
    try {
        const data = req.body;
    
        if(req.admin.role !== 'ADMIN_ROLE'){
            return res.status(403).json({
                msg: 'You do not have permissions to add companies'
            });
        }

        const company = await Company.create({
            name: data.name.toLowerCase(),
            phone: data.phone,
            address: data.address,
            levelOfimpact: data.levelOfimpact.toLowerCase(),
            yearsOfExperience: data.yearsOfExperience,
            category: data.category.toLowerCase()

        });

        return res.status(201).json({
            message: "Company registered successfully",
            company: company
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "There was an error adding the company",
            error
        })
    }
};

export const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, ...data } = req.body;
        let { name } = req.body;
        let { category } = req.body;

        if (name) {
            name = name.toLowerCase();
            data.name = name;
        };

        if(category) {
            category = category.toLowerCase();
            data.category = category;
        }

        const company = await Company.findById(id);
        if (!company) {
            return res.status(400).json({
                success: false,
                msg: "company not found"
            });
        }


        if (company.status === false) {
            return res.status(400).json({
                success: false,
                msg: 'the company is deactivated'
            });
        }

        if(req.admin.role !== 'ADMIN_ROLE'){
            return res.status(403).json({
                msg: 'You do not have permissions to add companies'
            });
        }

        const updatedCompany = await Company.findByIdAndUpdate(id, data, { new: true });


        return res.status(200).json({
            success: true,
            msg: "company successfully updated",
            company: updatedCompany 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "There was an error updating the company",
            error
        })
    }
};

export const getCompany = async (req = request, res = response) => {
    console.log('Received parameters:', req.query); 

    try {
        const { limite = 10, desde = 0, yearsOfExperience, category, orden } = req.query;

        const cleanCategory = category ? category.trim() : '';
        const cleanOrden = orden ? orden.trim() : '';

        let filter = { status: true };

        if (yearsOfExperience) {
            filter.yearsOfExperience = Number(yearsOfExperience);
        }

        if (cleanCategory) {
            filter.category = { $regex: new RegExp(cleanCategory, 'i') };
        }

        let companies = await Company.find(filter)
            .skip(Number(desde))
            .limit(Number(limite));

        if (cleanOrden === 'A-Z') {
            companies = companies.sort((a, b) => a.name.localeCompare(b.name));
        } else if (cleanOrden === 'Z-A') {
            companies = companies.sort((a, b) => b.name.localeCompare(a.name));
        }

        if(req.admin.role !== 'ADMIN_ROLE'){
            return res.status(403).json({
                msg: 'You do not have permissions to add companies'
            });
        }

        const total = await Company.countDocuments(filter);

        res.status(200).json({
            success: true,
            total,
            companies
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "There was an error getting the companies",
            error
        });
    }
};

export const generateExcelReport = async (req = request, res = response) => {
    try {
        
        if(req.admin.role !== 'ADMIN_ROLE'){
            return res.status(403).json({
                msg: 'You do not have permissions to add companies'
            });
        }

        const companies = await Company.find({ status: true });

        const data = companies.map(company => ({
            Name: company.name,
            Phone: company.phone,
            Address: company.address,
            "Level of Impact": company.levelOfimpact,
            "Years of Experience": company.yearsOfExperience,
            Category: company.category,
            Status: company.status ? 'true' : 'false',
        }));

        const wb = XLSX.utils.book_new();

        const ws = XLSX.utils.json_to_sheet(data);

        XLSX.utils.book_append_sheet(wb, ws, 'Companies Report');

        const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const reportFolderPath = path.join(__dirname, 'reporte');

        if (!fs.existsSync(reportFolderPath)) {
            fs.mkdirSync(reportFolderPath);
        }

        const filePath = path.join(reportFolderPath, 'companies_report.xlsx');

        fs.writeFileSync(filePath, excelFile);

        res.setHeader('Content-Disposition', 'attachment; filename=companies_report.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        res.sendFile(filePath, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ success: false, msg: "Error sending the report file" });
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Error generating Excel report" });
    }
};