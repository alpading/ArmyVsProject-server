const env = require('../../env')
const { Pool } = require('pg')

const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: env.DATABASE_POOL_MAX,
    connectionTimeoutMillis: 3000,
})

module.exports = pool
