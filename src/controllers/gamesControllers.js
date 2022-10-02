import connection from "../db/dataBase.js";

import {gamesSchema} from "../schemas/authSchemas.js"

async function listGames(req, res){
    const search = req.query.name;
    let games

    try {
        if(!search){
            games = await connection.query(`
            SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id;
            `);
        }

        if(search){
            games = await connection.query(`
            SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE LOWER (games.name) LIKE $1;
            `, [`${search.toLowerCase()}%`]);
        }

        res.send(games.rows);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

async function createGame(req, res){
    const {name, image, stockTotal, categoryId, pricePerDay} = req.body;
    const isValid = gamesSchema.validate({name, image, stockTotal, categoryId, pricePerDay}, {abortEarly: false});


    try {
        const isValidId = await connection.query(`
        SELECT * FROM categories WHERE id = $1;
        `, [categoryId]);

        if(isValid.error || !isValidId.rows[0]) {
            return res.sendStatus(400);
        }

        const isValidName = await connection.query(`
        SELECT * FROM games WHERE name = $1;
        `, [name]);

        if(isValidName){
            return res.sendStatus(409);
        }

        await connection.query(`
        INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)
        `, [name, image, stockTotal, categoryId, pricePerDay]);

        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}  

export {
    listGames,
    createGame
}