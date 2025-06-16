exports.up = async function (knex) {
  await knex.raw(`
       CREATE TABLE IF NOT EXISTS bmi (
         id SERIAL PRIMARY KEY,
         height NUMERIC NOT NULL,
         weight NUMERIC NOT NULL,
         age INTEGER NOT NULL,
         bmi NUMERIC NOT NULL,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
       );
     `);
};

exports.down = async function (knex) {
  await knex.raw(`
       DROP TABLE IF EXISTS bmi;
     `);
};

exports.config = { transaction: true };
