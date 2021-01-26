const config = {
  SLOWMO: 1,
  ENVIRONMENT: {
    rinkeby: 'https://rinkeby.gnosis-safe.io/app/',
    dev: 'https://safe-team.dev.gnosisdev.com/app/',
    PR: (id) => `https://pr${id}--safereact.review.gnosisdev.com/rinkeby/app/#/welcome`,
    stg: 'https://safe-team-rinkeby.staging.gnosisdev.com/app/',
    local: 'http://localhost:3000/'
  }

}

export default config
