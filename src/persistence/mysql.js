const waitPort = require('wait-port')
const fs = require('fs')
const mysql = require('mysql2')

const {
    MYSQL_HOST: HOST,
    MYSQL_USER: USER,
    MYSQL_PASSWORD: PASSWORD,
    MYSQL_DB: DB
} = process.env

let pool

async function init() {
    const host = HOST;
    const user = USER;
    const password = PASSWORD;
    const database = DB;

    await waitPort({
        host,
        port:3306,
        timeout:10000,
        waitForDns:true,
    })

    pool = mysql.createPool({
        connectionLimit: 5,
        host,
        user,
        password,
        database,
        charset: 'utf8mb4'
    });

    return new Promise((acc,rej)=>{
        pool.query(
            `CREATE TABLE IF NOT EXISTS app_items(
                id INTEGER AUTO_INCREMENT,
                name TEXT,
                PRIMARY KEY (id)
            ) DEFAULT CHARSET utf8mb4`,
            err=>{
                if(err){
                    
                    console.log('여기서 에러발생')
                    return rej(err);
                }    
                console.log(`connected to mysql db at host ${HOST}`);
                acc();
            },
        );
    });
}

async function teardown(){
    return new Promise((acc,rej)=>{
        pool.end(err=>{
            if(err) rej(err);
            else acc();
        });
    });
}

async function getItems(){
    return new Promise((acc,rej)=>{
        pool.query('SELECT * FROM app_items',(err,rows)=>{
            if(err) return rej(err);
            acc(rows);
        });
    });
}

async function storeItem(item){
    return new Promise((acc,rej)=>{
        let sql =`INSERT INTO app_items (name) VALUES (?)`;
        pool.query(sql,[item],err=>{
             if(err) return rej(err)
             acc();
        });
    });
}

module.exports ={
    init,
    getItems,
    teardown,
    storeItem,
};