const { formatObjectData } = require('../utils/helper')
const constant = require('../utils/constant')
const reportRepository = require('../repositories/report.repository')
const excel = require('exceljs')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Ho_Chi_Minh')

const getSummaryDataForEachParam = async (paramName, standard, valueMonth, plantCode) => {
    const year = Number(valueMonth.substring(3, 7))
    const month = Number(valueMonth.substring(0, 2))

    const startDate = moment(new Date(year, month - 1, 1)).format(constant.DATE_FORMAT.YYYY_MM_DD)
    const endDate = moment(new Date(year, month, 1)).format(constant.DATE_FORMAT.YYYY_MM_DD)

    const data = await reportRepository.getSummaryTransactionData(paramName, standard, plantCode, startDate, endDate)
    return data
}

const getSummaryData = async (plantCode, valueMonth) => {
    const initSummaryData = (desc, cod, tss, ph, temp, nh4, flow_in_1, flow_in_2, flow_out) => {
        return {desc, cod, tss, ph, temp, nh4, flow_in_1, flow_in_2, flow_out}
    }

    const summaryData = await Promise.all([
        getSummaryDataForEachParam('COD', 150, valueMonth, plantCode),
        getSummaryDataForEachParam('TSS', 100, valueMonth, plantCode),
        getSummaryDataForEachParam('pH', 14, valueMonth, plantCode),
        getSummaryDataForEachParam('Temp', 100, valueMonth, plantCode),
        getSummaryDataForEachParam('NH4', 10, valueMonth, plantCode),
        getSummaryDataForEachParam('In1', 5000, valueMonth, plantCode),
        getSummaryDataForEachParam('In2', 5000, valueMonth, plantCode),
        getSummaryDataForEachParam(plantCode === constant.PlantCode.B407 ? 'Out' : 'FlowOut', 5000, valueMonth, plantCode)
    ])

    return [
        initSummaryData(
            'Thời gian vượt tối đa', 
            summaryData[0].max_value_time, 
            summaryData[1].max_value_time, 
            summaryData[2].max_value_time, 
            summaryData[3].max_value_time, 
            summaryData[4].max_value_time, 
            summaryData[5].max_value_time, 
            summaryData[6].max_value_time,
            summaryData[7].max_value_time
        ),
        initSummaryData(
            'Giá trị tối đa', 
            summaryData[0].max_value, 
            summaryData[1].max_value, 
            summaryData[2].max_value, 
            summaryData[3].max_value, 
            summaryData[4].max_value, 
            summaryData[5].max_value, 
            summaryData[6].max_value,
            summaryData[7].max_value
        ),
        initSummaryData(
            'Thời gian giảm tối thiểu', 
            summaryData[0].min_value_time, 
            summaryData[1].min_value_time, 
            summaryData[2].min_value_time, 
            summaryData[3].min_value_time, 
            summaryData[4].min_value_time, 
            summaryData[5].min_value_time, 
            summaryData[6].min_value_time,
            summaryData[7].min_value_time
        ),
        initSummaryData(
            'Giá trị tối thiểu', 
            summaryData[0].min_value, 
            summaryData[1].min_value, 
            summaryData[2].min_value, 
            summaryData[3].min_value, 
            summaryData[4].min_value, 
            summaryData[5].min_value, 
            summaryData[6].min_value,
            summaryData[7].min_value
        ),
        initSummaryData(
            'Giá trị trung bình', 
            summaryData[0].avg_value, 
            summaryData[1].avg_value, 
            summaryData[2].avg_value, 
            summaryData[3].avg_value, 
            summaryData[4].avg_value, 
            summaryData[5].avg_value, 
            summaryData[6].avg_value,
            summaryData[7].avg_value
        ),
        initSummaryData(
            'Số lần vượt ngưỡng', 
            summaryData[0].num_over_range, 
            summaryData[1].num_over_range, 
            summaryData[2].num_over_range, 
            summaryData[3].num_over_range, 
            summaryData[4].num_over_range, 
            summaryData[5].num_over_range, 
            summaryData[6].num_over_range,
            summaryData[7].num_over_range
        )
    ]
}

const getTransactionData = async (page, size, type, value, plantCode) => {
    const limit = Number(size)
    const offset = (Number(page) - 1) * Number(size)

    let startDate
    let endDate
    if (type === 'month') {
        const year = Number(value.substring(3, 7))
        const month = Number(value.substring(0, 2))
        startDate = moment(new Date(year, month - 1, 1)).format(constant.DATE_FORMAT.YYYY_MM_DD)
        endDate = moment(new Date(year, month, 1)).format(constant.DATE_FORMAT.YYYY_MM_DD)
    } else {
        const year = Number(value.substring(6, 10))
        const month = Number(value.substring(3, 5))
        const day = Number(value.substring(0, 2))
        startDate = moment(new Date(year, month - 1, day)).format(constant.DATE_FORMAT.YYYY_MM_DD)
        endDate = moment(new Date(year, month - 1, day + 1)).format(constant.DATE_FORMAT.YYYY_MM_DD)
    }

    const timeSelected = moment().format(constant.DATE_FORMAT.YYYY_MM_DD_HH_mm_ss)

    const listData = await reportRepository.getListTransactionPaging(offset, limit, startDate, endDate, timeSelected, plantCode)
    const count = await reportRepository.getTotalRecordTransaction(startDate, endDate, timeSelected, plantCode)
    const dataTable = listData?.map((record, index) => {
        record.index = index + 1
        return formatObjectData(record)
    })

    return {
        count: Math.ceil(count / Number(size)),
        total: count,
        data: dataTable
    }
}

const getReportWorkbook = async (value, type, plantCode) => {
    // Create template
    let workbook = new excel.Workbook()
    let worksheet = workbook.addWorksheet('transaction-report')
    worksheet.getColumn(1).width = 8.29
    worksheet.getColumn(2).width = 26.29

    const commonBorder = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    }
    Array.from([3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).forEach(value => {
        worksheet.getColumn(value).width = 16.5
    })
    Array.from([2, 3, 4, 5, 6]).forEach(value => {
        worksheet.getRow(value).height = 27.75
        worksheet.mergeCells(`C${value}:N${value}`)
        worksheet.getRow(value).getCell(3).font = {
            name: 'Times New Roman',
            bold: true,
            size: value == 2 ? 16 : 12,
            color: { argb: value == 2 ? '1ea2000' : '11333df' }
        }
        worksheet.getCell(`C${value}`).border = commonBorder
    })

    worksheet.getRow(1).height = 15.75
    worksheet.getRow(7).height = 15.75
    worksheet.getRow(2).getCell(3).value = 'Công ty cổ phần chăn nuôi C.P. Việt Nam - Nhà máy chế biến sản phẩm thịt Hà Nội'
    worksheet.getRow(3).getCell(3).value = 'Địa chỉ: Lô CN-B3 Khu công nghiệp Phú Nghĩa, xã Phú Nghĩa, huyện Chương Mỹ, thành phố Hà Nội, Việt Nam'
    worksheet.getRow(4).getCell(3).value = 'Điện thoại: 039.68.67.888'
    worksheet.getRow(5).getCell(3).value = 'Email: dangtung@cp.com.vn'
    if (type === 'date') {
        worksheet.getRow(6).getCell(3).value = `Tra cứu dữ liệu: Trạm Nhà máy chế biến sản phẩm thịt Hà Nội ${moment().format('DD/MM/YYYY')}`
    } else {
        worksheet.getRow(6).getCell(3).value = `Tra cứu dữ liệu: Trạm Nhà máy chế biến sản phẩm thịt Hà Nội ${moment().startOf('month').format('DD/MM/YYYY HH:mm')} - ${moment().endOf('month').format('DD/MM/YYYY HH:mm')}`
    }

    const imageLogoId = workbook.addImage({
        filename: './assets/report-logo.jpg',
        extension: 'jpeg',
    })
    worksheet.addImage(imageLogoId, 'B2:B6')

    worksheet.getColumn(2).alignment = {
        horizontal: 'right'
    }
    worksheet.getRow(8).getCell(1).value = 'STT'
    worksheet.getRow(8).getCell(2).value = 'Thời gian'
    worksheet.getRow(8).getCell(3).value = 'COD (mg/l)'
    worksheet.getRow(8).getCell(4).value = 'Trung bình COD'
    worksheet.getRow(8).getCell(5).value = 'TSS (mg/l)'
    worksheet.getRow(8).getCell(6).value = 'Trung bình TSS'
    worksheet.getRow(8).getCell(7).value = 'pH'
    worksheet.getRow(8).getCell(8).value = 'Temp (oC)'
    worksheet.getRow(8).getCell(9).value = 'NH4 (mg/l)'
    worksheet.getRow(8).getCell(10).value = 'Flow in 1 (m3/h)'
    worksheet.getRow(8).getCell(11).value = 'Flow in 2 (m3/h)'
    worksheet.getRow(8).getCell(12).value = 'Flow out (m3/h)'
    Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).forEach(value => {
        worksheet.getRow(8).getCell(value).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle',
                wrapText: true
            }
        }
        worksheet.getRow(8).getCell(value).font = {
            bold: true, 
            color: { argb: '#1000000' }, 
            size: 12, 
            name: 'Times New Roman'
        }
        worksheet.getRow(8).getCell(value).border = commonBorder
    })

    // Get data and fill in excel
    let startDate
    let endDate
    if (type === 'month') {
        const year = Number(value.substring(3, 7))
        const month = Number(value.substring(0, 2))
        startDate = moment(new Date(year, month - 1, 1)).format(constant.DATE_FORMAT.YYYY_MM_DD)
        endDate = moment(new Date(year, month, 1)).format(constant.DATE_FORMAT.YYYY_MM_DD)
    } else {
        const year = Number(value.substring(6, 10))
        const month = Number(value.substring(3, 5))
        const day = Number(value.substring(0, 2))
        startDate = moment(new Date(year, month - 1, day)).format(constant.DATE_FORMAT.YYYY_MM_DD)
        endDate = moment(new Date(year, month - 1, day + 1)).format(constant.DATE_FORMAT.YYYY_MM_DD)
    }

    const timeSelected = moment().format(constant.DATE_FORMAT.YYYY_MM_DD_HH_mm_ss)
    const totalRecord = await reportRepository.getTotalRecordTransaction(startDate, endDate, timeSelected, plantCode)
    const batchNum = Math.ceil(totalRecord / constant.RECORD_PER_INSERT_EXCEL)
    let rowIndex = 8

    for (let i = 0; i < batchNum; i++) {
        const data = await reportRepository.getListTransactionPaging(i * constant.RECORD_PER_INSERT_EXCEL, constant.RECORD_PER_INSERT_EXCEL, startDate, endDate, timeSelected, plantCode)
        for (let j = 0; j < data.length; j++) {
            ++rowIndex
            worksheet.getRow(rowIndex).getCell(1).value = rowIndex - 8
            worksheet.getRow(rowIndex).getCell(2).value = data[j].TransactionTime
            worksheet.getRow(rowIndex).getCell(3).value = data[j].COD
            worksheet.getRow(rowIndex).getCell(4).value = ''
            worksheet.getRow(rowIndex).getCell(5).value = data[j].TSS
            worksheet.getRow(rowIndex).getCell(6).value = ''
            worksheet.getRow(rowIndex).getCell(7).value = data[j].pH
            worksheet.getRow(rowIndex).getCell(8).value = data[j].Temp
            worksheet.getRow(rowIndex).getCell(9).value = data[j].NH4
            worksheet.getRow(rowIndex).getCell(10).value = data[j].In1
            worksheet.getRow(rowIndex).getCell(11).value = data[j].In2
            worksheet.getRow(rowIndex).getCell(12).value = data[j].Out
            for (let k = 1; k <= 12; k++) {
                worksheet.getRow(rowIndex).getCell(k).border = commonBorder
            }
        }
    }

    const avgResult = await reportRepository.getAverageCodTssByTime(startDate, endDate, plantCode)
    if (totalRecord > 0) {
        worksheet.getRow(9).getCell(4).style = {
            alignment: {
                wrapText: true,
                horizontal: 'right',
            }
        }
        worksheet.getRow(9).getCell(6).style = {
            alignment: {
                wrapText: true,
                horizontal: 'right',
            }
        }
        worksheet.getRow(9).getCell(4).value = Number(avgResult.avg_cod || 0).toFixed(2)
        worksheet.getRow(9).getCell(6).value = Number(avgResult.avg_tss || 0).toFixed(2)
        Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).forEach(value => {
            worksheet.getRow(9).getCell(value).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFFF00' },
            }
        })
    }

    // Get summary data and fill in excel when report type is month
    if (type === 'month') {
        let currentRow = worksheet.rowCount
        for (let i = 2; i <= 7; i++) {
            worksheet.mergeCells(`A${currentRow + i}:B${currentRow + i}`)
            worksheet.getRow(currentRow + i).height = 24
            for (let j = 1; j <= 12; j++) {
                worksheet.getRow(currentRow + i).getCell(j).style = {
                    alignment: {
                        wrapText: true,
                        horizontal: j === 1 ? 'left' : 'right',
                    }
                }
                if (j === 1) {
                    worksheet.getRow(currentRow + i).getCell(j).font = {
                        bold: true, 
                        color: { argb: '#1000000' }, 
                        size: 12,
                        name: 'Times New Roman'
                    }
                }
                worksheet.getRow(currentRow + i).getCell(j).border = commonBorder
            }
        }

        const summaryData = await getSummaryData(plantCode, value)
        summaryData.map((data, index) => {
            worksheet.getRow(currentRow + index + 2).getCell(1).value = data.desc
            worksheet.getRow(currentRow + index + 2).getCell(3).value = data.cod
            worksheet.getRow(currentRow + index + 2).getCell(5).value = data.tss
            worksheet.getRow(currentRow + index + 2).getCell(7).value = data.ph
            worksheet.getRow(currentRow + index + 2).getCell(8).value = data.temp
            worksheet.getRow(currentRow + index + 2).getCell(9).value = data.nh4
            worksheet.getRow(currentRow + index + 2).getCell(10).value = data.flow_in_1
            worksheet.getRow(currentRow + index + 2).getCell(11).value = data.flow_in_2
            worksheet.getRow(currentRow + index + 2).getCell(12).value = data.flow_out
        })
    }

    return workbook
}

module.exports = {
    getSummaryData,
    getTransactionData,
    getReportWorkbook
}