require('dotenv').config()

export default {
    impacc: process.env.IMPACC || '',
    slowMo: Number.isNaN(Number.parseInt(process.env.SLOWMO)) ? 0 : Number.parseInt(process.env.SLOWMO),
    TIME : {
        T60 : 60000,
        T30 : 30000,
        T15 : 15000,
        T10 : 10000,
        T6 : 6000,
        T2 : 2000,  
    },
    environment : process.env.ENV === "rinkeby" ? "https://rinkeby.gnosis-safe.io/" : "https://safe-team.dev.gnosisdev.com/"
}
