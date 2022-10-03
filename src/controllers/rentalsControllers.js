import connection from "../db/dataBase.js";
import {rentalsSchema} from "../schemas/authSchemas.js"
import dayjs from "dayjs";

async function listRentals(req, res){
    const customerId = req.query.customerId;
    const gameId = req.query.gameId;
    let listRentals
    try {
        
        if(customerId){
            listRentals = await connection.query(`
            SELECT
            json_build_object(
                    'id', rentals.id,
                    'customerId', rentals."customerId",
                    'gameId', rentals."gameId",
                    'rentDate', rentals."rentDate",
                    'daysRented', rentals."daysRented",
                    'returnDate', rentals."returnDate",
                    'originalPrice', games."pricePerDay",
                    'delayFee', rentals."delayFee",
                    'customer', json_build_object(
                            'id', customers.id,
                            'name', customers.name
                    ),
                    'game', json_build_object(
                            'id', games.id,
                            'name', games.name,
                            'categoryId', games."categoryId",
                            'categoryName', categories."name"
                    )
            )
            FROM rentals
                JOIN customers ON rentals."customerId" = customers.id
                JOIN games ON rentals."gameId" = games.id
                JOIN categories ON games."categoryId" = categories.id
                WHERE rentals."customerId" = $1;
            `, [customerId])
            }

        if(gameId){
            listRentals = await connection.query(`
            SELECT
            json_build_object(
                    'id', rentals.id,
                    'customerId', rentals."customerId",
                    'gameId', rentals."gameId",
                    'rentDate', rentals."rentDate",
                    'daysRented', rentals."daysRented",
                    'returnDate', rentals."returnDate",
                    'originalPrice', games."pricePerDay",
                    'delayFee', rentals."delayFee",
                    'customer', json_build_object(
                            'id', customers.id,
                            'name', customers.name
                    ),
                    'game', json_build_object(
                            'id', games.id,
                            'name', games.name,
                            'categoryId', games."categoryId",
                            'categoryName', categories."name"
                    )
            )
            FROM rentals
                JOIN customers ON rentals."customerId" = customers.id
                JOIN games ON rentals."gameId" = games.id
                JOIN categories ON games."categoryId" = categories.id
                WHERE rentals."gameId" = $1;
            `, [gameId])
            }
        if(!gameId && !customerId){
        listRentals = await connection.query(`
        SELECT
        json_build_object(
                'id', rentals.id,
                'customerId', rentals."customerId",
                'gameId', rentals."gameId",
                'rentDate', rentals."rentDate",
                'daysRented', rentals."daysRented",
                'returnDate', rentals."returnDate",
                'originalPrice', games."pricePerDay",
                'delayFee', rentals."delayFee",
                'customer', json_build_object(
                        'id', customers.id,
                        'name', customers.name
                ),
                'game', json_build_object(
                        'id', games.id,
                        'name', games.name,
                        'categoryId', games."categoryId",
                        'categoryName', categories."name"
                )
        )
        FROM rentals
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id
            JOIN categories ON games."categoryId" = categories.id;
        `)
        }

        
        listRentals = listRentals.rows.map(item => item.json_build_object)
        res.send(listRentals)
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

async function createRentals(req, res){
    const {customerId, gameId, daysRented} = req.body;

    const isValid = rentalsSchema.validate({customerId, gameId, daysRented}, {abortEarly: false});

    try {
        
        const isValidCustomer = await connection.query(`
        SELECT * FROM customers WHERE id = $1;
        `, [customerId]);
        const isValidGame = await connection.query(`
        SELECT * FROM games WHERE id = $1;
        `, [gameId]);

        if(isValid.error || !isValidCustomer.rows[0] || !isValidGame.rows[0]){
            return res.sendStatus(400);
        }
        
        const retalsGame = await connection.query(`
        SELECT * FROM rentals WHERE "gameId" = $1;
        `, [gameId]);

        
        if(retalsGame.rows.length >= isValidGame.rows[0].stockTotal){
            return res.sendStatus(400)
        }
        
        const rentDate = dayjs().format("YYYY-MM-DD");
        const originalPrice = Number(daysRented) * Number(isValidGame.rows[0].pricePerDay);
        const returnDate = null;
        const delayFee = null;
        
        await connection.query(`
        INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);
        `, [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);
        
        res.sendStatus(201)

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

async function finishRentals(req, res){
    const {id} = req.params;
    let delayFee = 0

    try {
        const rental = await connection.query(`
        SELECT rentals.*, games."pricePerDay" FROM rentals JOIN games ON rentals."gameId" = games.id WHERE rentals.id = $1;
        `, [id]);

        if(!rental.rows[0]){
            return res.sendStatus(404);
        }
        
        if(rental.rows[0].returnDate !== null){
            return res.sendStatus(400);
        }

        const returnDate = dayjs().format("YYYY-MM-DD");
        const timeDiff = Math.abs(new Date - rental.rows[0].rentDate);
        const diffDays = Math.round(timeDiff / (1000 * 3600 * 24)); 

        if(diffDays > rental.rows[0].daysRented){
            delayFee = (diffDays -rental.rows[0].daysRented) * rental.rows[0].pricePerDay;
        }

        await connection.query(`
        UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3; 
        `, [returnDate, delayFee, id])
        
        res.sendStatus(200)
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

async function deleteRentals(req, res){
    const {id} = req.params;

    try {
        const rental = await connection.query(`
        SELECT rentals.*, games."pricePerDay" FROM rentals JOIN games ON rentals."gameId" = games.id WHERE rentals.id = $1;
        `, [id]);

        if(!rental.rows[0]){
            return res.sendStatus(404);
        }
        
        if(rental.rows[0].returnDate === null){
            return res.sendStatus(400);
        }

        await connection.query(`
        DELETE FROM rentals WHERE id = $1; 
        `, [id])
        
        res.sendStatus(200)
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export {
    listRentals,
    createRentals,
    finishRentals,
    deleteRentals
}