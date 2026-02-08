const router = require('express').Router()
const pool = require('../config/database/postgresql/postgresql')
const asyncHandler  = require('../middleware/asyncHandler')

// 5개의 장르 랜덤으로 반환
router.get('/', asyncHandler( async (req, res) => {
    const selectGenreSql = `
        SELECT
            id, name
        FROM
            type
        ORDER BY
            RANDOM()
        LIMIT
            5`
    
    const selectGenreResult = await pool.query(selectGenreSql)

	res.status(200).json({ data : selectGenreResult.rows })
}))

// 장르 목록 전체 반환
router.get('/all', asyncHandler(async (req, res) => {    
    const selectGenreSql = `
        SELECT
            id, name
        FROM
            type`
    
    const selectGenreResult = await pool.query(selectGenreSql)
	
	res.status(200).json({ data : selectGenreResult.rows })
}))

module.exports = router