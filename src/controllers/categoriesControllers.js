import connection from "../db/dataBase.js";

async function listCategories(req, res){
    try {
        const categories = await connection.query(`
        SELECT * FROM categories `);

        res.send(categories.rows);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

async function createCategorie(req, res){
    if(!req.body.name){
        return res.sendStatus(400);
    }

    try {

        const validate = await connection.query(`
        SELECT * FROM categories WHERE name = $1
        `, [req.body.name])

        if(validate){
            return res.sendStatus(409);
        }

        await connection.query(`
        INSERT INTO categories (name) VALUES ($1)
        `, [req.body.name]);

        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export {
    listCategories,
    createCategorie
}