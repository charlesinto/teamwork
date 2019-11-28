import pg from "pg";
import "dotenv/config";

let pool;
if(process.env.NODE_ENV ==='DEVELOPMENT'){
    pool = new pg.Pool({
        connectionString: process.env.DEV_DATABASE,
        ssl: true,
      });
    
}
else if(process.env.NODE_ENV === 'TEST'){
     pool = new pg.Pool({
        connectionString: process.env.TEST_DATABASE,
        ssl: true,
      });
 }

else if(process.env.NODE_ENV === 'PRODUCTION'){
    pool = new pg.Pool({
        connectionString: process.env.PROD_DATABASE , ssl:true
    }); 
}

export default pool;