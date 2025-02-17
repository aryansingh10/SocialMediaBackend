import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'aryansinghthakur',
    password: '1234',
    database: 'finalProject',
    port: 3306,

});

export const db = drizzle(pool);
