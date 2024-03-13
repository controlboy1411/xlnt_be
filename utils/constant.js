module.exports = {
    RESPONSE_MESSAGE: {
        SUCCESS: 'Success',
        FAIL: 'Fail',
        NOT_FOUND: 'Not found',
        SYSTEM_ERROR: 'Backend system error',
        INPUT_INVALID: 'Input invalid'
    },
    RESPONSE_CODE: {
        SUCCESS: 0,
        FAIL: -1,
        NOT_FOUND: -2
    },
    HTTP_STATUS_CODE: {
        OK: 200,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        NOT_FOUND: 404,
        INTERNAL_SERVER: 500
    },
    DATE_FORMAT: {
        yyyy_mm_dd_HH_mm_ss: 'yyyy-mm-dd HH:mm:ss',
        YYYY_MM_DD_HH_mm_ss: 'YYYY-MM-DD HH:mm:ss',
        YYYY_MM_DD_HH_mm_ss_SSS: 'YYYY-MM-DD HH:mm:ss.SSS',
        dd_mm_yyyy: 'dd-mm-yyyy',
        DD_MM_YYYY: 'DD-MM-YYYY',
        yyyy_mm_dd: 'yyyy-mm-dd',
        YYYY_MM_DD: 'YYYY-MM-DD',
        YYYYMMDDHHmmss: 'YYYYMMDDHHmmss'
    },
    RECORD_PER_INSERT_EXCEL: 200,
    PlantCode: {
        B407: 'B407',
        B457: 'B457'
    },
    PlantName: {
        B407: 'CPV Phu Nghia Further',
        B457: 'Food Hanoi 2'
    },
    Plants: [
        { code: 'B407', name: 'CPV Phu Nghia Further' },
        { code: 'B457', name: 'Food Hanoi 2'}
    ],
}