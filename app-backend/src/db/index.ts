import knex, {Knex} from 'knex';
import path from 'path';

const knexDb = knex({
    client: 'sqlite3',
    connection: {
        filename: './db/app.sqlite3',
        options: {}
    },
    useNullAsDefault: true,
    migrations: {
        tableName: 'migrations',
        directory: path.join(__dirname, 'migrations')
    }
});

export async function createTables(knex: Knex) {
    const tables: { [key: string]: (tableBuilder: Knex.TableBuilder) => void } = {
        'users': (tableBuild: Knex.TableBuilder) => {
            tableBuild.increments('id').primary();
            tableBuild.string('username').notNullable();
            tableBuild.string('email').unique().notNullable();
        }
    }
    for (let table in tables) {
        if (await knex.schema.hasTable(table)) {
            continue;
        }
        await knex.schema.createTable(table, (tableBuilder) => tables[table](tableBuilder));
    }
}

export default knexDb;
