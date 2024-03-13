const homeRepository = require('../repositories/home.repository')

const getNewestColumnChartData = async (plantCode) => {
    const result = await homeRepository.getNewestTransactionDataV1(plantCode)
    return result
}

const getNewestBoxData = async (plantCode) => {
    const result = await homeRepository.getNewestTransactionDataV2(plantCode)
    return result
}

module.exports = {
    getNewestColumnChartData,
    getNewestBoxData,
}