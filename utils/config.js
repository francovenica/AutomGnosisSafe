export default {
    SLOWMO: 2,
    TIME : {
        T600 : 600000,
        T180 : 180000,
        T90 : 90000,
        T60 : 60000,
        T30 : 30000,
        T15 : 15000,
        T10 : 10000,
        T5 : 5000,
        T2 : 2000,  
    },
    ENVIRONMENT : {
        rinkeby: "https://rinkeby.gnosis-safe.io/app/",
        dev: "https://safe-team.dev.gnosisdev.com/app/",
        PR: (id) => `https://pr${id}--safereact.review.gnosisdev.com/app/`,
        stg: "https://safe-team-rinkeby.staging.gnosisdev.com/app/"
    }

}
