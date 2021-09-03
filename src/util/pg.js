const { Pool } = require("pg");

class DataBase {
  constructor(db) {
    var dbParams = {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    };

    switch (db) {
      case "tracking":
        dbParams = dbParams;
        break;
      default:
        dbParams = {};
        break;
    }
    // console.log(`db: ${db}: `, dbParams);
    this.pool = new Pool(dbParams);
  }

  async query(text, params) {
    const client = await this.pool.connect();
    try {
      return await client.query(text, params);
    } catch (err) {
      console.log(
        `ERROR DataBase.query error ${err.message} query: ${text} params`,
        params
      );
      throw err;
    } finally {
      client.release();
    }
  }

  async queryTransaction(list) {
    const client = await this.pool.connect();
    try {
      // BEGIN abre la transaccion
      await client.query("BEGIN");
      for (const queryObject of list) {
        const { text, values } = queryObject;
        await client.query(text, values);
      }
      // COMMIT acepto las querys
      await client.query("COMMIT");
    } catch (err) {
      console.log(
        `ERROR DataBase.query error ${err.message} query: ${err.text} params`,
        list
      );
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = DataBase;
