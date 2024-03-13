const constant = require('../utils/constant')
const { formatObjectData } = require('../utils/helper')

const getNewestTransactionDataV1 = async (plantCode) => {
    const sqlQuery = 
        `select top 1 COD, TSS, pH, Temp, NH4 as Amoni 
        from XLNT_Transaction 
        where PlantCode = '${plantCode}'
        order by FollowTime desc`
    const result = await _sqlserver.query(sqlQuery)
    if (result.recordset.length > 0) {
        return formatObjectData(result.recordset[0])
    }
    return null
}

const getNewestTransactionDataV2 = async (plantCode) => {
    const outColumnName = plantCode === constant.PlantCode.B407 ? 'Out' : 'FlowOut'
    const sqlQuery = 
        `select top 1 
            COD, TSS, pH, Temp, NH4 as Amoni, 
            In1 as Flow_In1, In2 as Flow_In2, ${outColumnName} as Flow_Out, TFlowOut,
            0 as Total_In1, 0 as Total_In2, 0 as Total_Out
        from XLNT_Transaction 
        where PlantCode = '${plantCode}'
        order by FollowTime desc`
    const result = await _sqlserver.query(sqlQuery)
    if (result.recordset.length > 0) {
        return formatObjectData(result.recordset[0])
    }
    return null
}




module.exports = {
    getNewestTransactionDataV1,
    getNewestTransactionDataV2
}