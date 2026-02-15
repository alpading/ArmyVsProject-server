const router = require('express').Router()
const pool = require('../config/database/postgresql/postgresql')
const asyncHandler = require('../middleware/asyncHandler')
const { ServiceUnavailable } = require('../module/customError')
const ERROR_CODE = require('../module/errorCodes')

// liveness
router.get(
    '/health',
    asyncHandler(async (req, res) => {
        res.status(200).json({ 
            ok: true,
            status: 'up',
            timestamp: new Date().toISOString()
        })
    })
)

// readiness
router.get(
    '/ready',
    asyncHandler(async (req, res) => {
        try {
            await pool.query(`SELECT 1`)
        } catch (err) {
            throw new ServiceUnavailable(ERROR_CODE.DB_UNAVAILABLE, 'DB unavailable', err)
        }

        return res.status(200).json({ 
            ok: true,
            status: 'ready',
            timestamp: new Date().toISOString()
        })
    })
)

module.exports = router
