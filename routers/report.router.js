const express = require('express')
const router = express.Router()
const constant = require('../utils/constant')
const reportService = require('../services/report.service')
const moment = require('moment')

router.get('/summary-data', async (req, res) => {
    try {
        const { plantCode, valueMonth } = req.query
        const result = await reportService.getSummaryData(plantCode, valueMonth)
        if (result) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.SUCCESS,
                message: constant.RESPONSE_MESSAGE.SUCCESS,
                data: result
            })
        }

        return res.status(constant.HTTP_STATUS_CODE.NOT_FOUND).json({
            code: constant.RESPONSE_CODE.NOT_FOUND,
            message: constant.RESPONSE_MESSAGE.NOT_FOUND
        })
    } catch (e) {
        console.log('Exception while get summary data: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.get('/transaction-data', async (req, res) => {
    try {
        const { page, size, type, value, plantCode } = req.query
        const result = await reportService.getTransactionData(page, size, type, value, plantCode)
        if (result) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.SUCCESS,
                message: constant.RESPONSE_MESSAGE.SUCCESS,
                data: result
            })
        }

        return res.status(constant.HTTP_STATUS_CODE.NOT_FOUND).json({
            code: constant.RESPONSE_CODE.NOT_FOUND,
            message: constant.RESPONSE_MESSAGE.NOT_FOUND
        })
    } catch (e) {
        console.log('Exception while get transaction data: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.get('/download-report', async (req, res) => {
    try {
        if (!req.query.value || !req.query.type || !req.query.plantCode) {
            return res.status(constant.HTTP_STATUS_CODE.BAD_REQUEST).json({
                code: constant.RESPONSE_CODE.FAIL,
                message: constant.RESPONSE_MESSAGE.INPUT_INVALID
            })
        }
        const value = req.query.value
        const type = req.query.type
        const plantCode = req.query.plantCode
        const workbook = await reportService.getReportWorkbook(value, type, plantCode)
        
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + `transaction-report-${moment().format(constant.DATE_FORMAT.YYYY_MM_DD_HH_mm_ss_SSS)}.xlsx`
        )

        return workbook.xlsx.write(res).then(function () {
            res.status(constant.HTTP_STATUS_CODE.OK).end()
        })
    } catch (e) {
        console.log('Exception while download report: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

module.exports = router