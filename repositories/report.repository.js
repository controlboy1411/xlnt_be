const constant = require("../utils/constant")

const getSummaryTransactionData = async (paramName, standard, plantCode, startDate, endDate) => {
    const sqlQuery = 
        `select
            tmp.*,
            (
                select substring(convert(varchar, min(FollowTime), 120), 1, 16)
                from XLNT_Transaction 
                where 
                    PlantCode = '${plantCode}' and ${paramName} = tmp.min_value 
                    and FollowTime >= '${startDate}' and FollowTime < '${endDate}'
            ) as min_value_time,
            (
                select substring(convert(varchar, min(FollowTime), 120), 1, 16)
                from XLNT_Transaction 
                where 
                    PlantCode = '${plantCode}' and ${paramName} = tmp.max_value
                    and FollowTime >= '${startDate}' and FollowTime < '${endDate}'
            ) as max_value_time
        from (
            select
                isnull(min(${paramName}),0) as min_value,
                isnull(max(${paramName}),0) as max_value,
                isnull(avg(${paramName}),0) as avg_value,
                isnull(sum(case when ${paramName} > ${standard} then 1 else 0 end),0) as num_over_range
            from XLNT_Transaction
            where PlantCode = '${plantCode}' and FollowTime >= '${startDate}' and FollowTime < '${endDate}'
        ) as tmp;`
    
    const result = await _sqlserver.query(sqlQuery)
    return result.recordset[0]
}

const getListTransactionPaging = async (offset, limit, startDate, endDate, timeSelected, plantCode) => {
    const outColumnName = plantCode === constant.PlantCode.B407 ? 'Out' : 'FlowOut'
    const sqlQuery = 
        `select
            substring(convert(varchar, FollowTime, 120), 1, 16) as TransactionTime,
            COD, TSS, pH, Temp, NH4, In1, In2, ${outColumnName} as Out, TFlowOut
        from XLNT_Transaction
        where 
            PlantCode = '${plantCode}'
            and FollowTime >= '${startDate}' and FollowTime < '${endDate}'
            and FollowTime <= '${timeSelected}'
        order by FollowTime desc
        offset ${offset} rows
        fetch next ${limit} rows only`
    
    const result = await _sqlserver.query(sqlQuery)
    return result.recordset
}

const getTotalRecordTransaction = async (startDate, endDate, timeSelected, plantCode) => {
    const sqlCount = 
        `select count(*) as count from XLNT_Transaction 
        where 
            PlantCode = '${plantCode}'
            and FollowTime >= '${startDate}' and FollowTime < '${endDate}'
            and FollowTime <= '${timeSelected}'`
    const resultCount = await _sqlserver.query(sqlCount)
    return resultCount.recordset[0].count
}

const getAverageCodTssByTime = async (startDate, endDate, plantCode) => {
    const avgQuery = 
        `select ISNULL(AVG(CAST(COD as float)), 0) as avg_cod, ISNULL(AVG(CAST(TSS as float)), 0) as avg_tss
        from XLNT_Transaction 
        where PlantCode = '${plantCode}' and FollowTime >= '${startDate}' and FollowTime < '${endDate}'`
    const avgResult = await _sqlserver.query(avgQuery)
    return avgResult.recordset[0]
}


module.exports = {
    getSummaryTransactionData,
    getListTransactionPaging,
    getTotalRecordTransaction,
    getAverageCodTssByTime
}