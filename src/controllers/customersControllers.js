import connection from "../db/dataBase.js";
import {customerSchema} from "../schemas/authSchemas.js"

async function listCustomers(req, res){
    const search = req.query.cpf
    let list
    try {
        if(!search){
            list = await connection.query(`
            SELECT * FROM customers;
            `)
        }
        if(search){
            list = await connection.query(`
            SELECT * FROM customers WHERE LOWER (cpf) LIKE $1;
            `, [`${search}%`])
        }
        res.send(list.rows).status(200)
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

async function searchCustomerId(req, res){
    const userId = req.params.id
    
    try {
        const user = await connection.query(`
        SELECT * FROM customers WHERE id = $1;
        `, [userId])

        if(!user.rows[0]){
            return res.sendStatus(404);
        }

        res.send(user.rows[0])
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

async function createCustomer(req, res){
    const {name, phone, cpf, birthday} = req.body;
    const isValid = gamesSchema.validate({name, phone, cpf, birthday}, {abortEarly: false});
    if(isValid.error) {
        return res.sendStatus(400);
    }

    try {
        const isValidCpf = await connection.query(`
        SELECT * FROM customers WHERE cpf = $1;
        `, [cpf]);

        if(isValidCpf.rows[0]){
            return res.sendStatus(409);
        }

        await connection.query(`
        INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4); 
        `,[name, phone, cpf, birthday])

        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

async function updateCustomer(req, res){
    const {id} = req.params;
    const {name, phone, cpf, birthday} = req.body;
    const isValid = gamesSchema.validate({name, phone, cpf, birthday}, {abortEarly: false});
    if(isValid.error) {
        return res.sendStatus(400);
    }

    try {
        const isValidCpf = await connection.query(`
        SELECT * FROM customers WHERE cpf = $1;
        `, [cpf]);

        if(isValidCpf.rows[0]){
            return res.sendStatus(409);
        }

        await connection.query(`
        UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5; 
        `,[name, phone, cpf, birthday, id])

        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export {
    listCustomers,
    searchCustomerId,
    createCustomer,
    updateCustomer,
}