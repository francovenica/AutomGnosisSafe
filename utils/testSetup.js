import puppeteer from 'puppeteer'
import * as dappeteer from '@dasanra/dappeteer'

import config from './config'
import { accountsSelectors } from './selectors/accounts'
import { topBar } from './selectors/topBar'
import { homePage } from './selectors/welcomePage'
import { loadSafeForm } from './selectors/loadSafeForm'
import * as gFunc from './selectorsHelpers'
import { assertElementPresent, clearInput, clickAndType, clickByText, clickElement } from './selectorsHelpers'

const TESTING_ENV = process.env.TESTING_ENV || 'dev'

const { SLOWMO, ENVIRONMENT } = config
const ENV = ENVIRONMENT[TESTING_ENV.toLowerCase()]

export const init = async () => {
  const browser = await dappeteer.launch(puppeteer, {
    defaultViewport: null, // this extends the page to the size of the browser
    slowMo: SLOWMO, // Miliseconds it will wait for every action performed. It's 1 by default. change it in the .env file
    args: ['--start-maximized', ENV] // maximized browser, URL for the base page
  })

  const metamask = await dappeteer.getMetamask(browser, {
    seed: accountsSelectors.wallet.seed,
    password: accountsSelectors.wallet.password
  })

  await metamask.switchNetwork('rinkeby')
  const [gnosisPage, MMpage] = await browser.pages() // get a grip on both tabs
  // Reload Gnosis Safe to ensure Metamask info is loaded
  await gnosisPage.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] })

  gnosisPage.setDefaultTimeout(60000)
  MMpage.setDefaultTimeout(60000)

  return [
    browser,
    metamask,
    gnosisPage,
    MMpage
  ]
}

/**
 * This function returns a clean environment with one wallet already connected to Safe Multisig
 *
 * @param {boolean} importMultipleAccounts by default is false so only 1 accounts is imported to Metamask
 * if more than one account is needed this parameter should be used with `true`
 */
export const initWithWalletConnected = async (importMultipleAccounts = false) => {
  const [browser, metamask, gnosisPage, MMpage] = await init()

  if (importMultipleAccounts) {
    await gFunc.importAccounts(metamask)
    await MMpage.waitForTimeout(1000)
  }

  await gnosisPage.bringToFront()
  // if (ENV !== ENVIRONMENT.local) { // for local env there is no Cookies to accept
  await clickElement(homePage.accept_cookies, gnosisPage)
  // }
  await clickElement(topBar.not_connected_network, gnosisPage)
  await clickElement(topBar.connect_btn, gnosisPage)
  await clickElement(homePage.metamask_option, gnosisPage) // Clicking the MM icon in the onboardjs

  // FIXME remove MMpage.reload() when updated version of dappeteer
  await MMpage.reload()
  // --- end of FIXME
  await metamask.approve({ allAccounts: true })
  await gnosisPage.bringToFront()

  await assertElementPresent(topBar.connected_network, gnosisPage, 'css')

  return [
    browser,
    metamask,
    gnosisPage,
    MMpage,
  ]
}

/**
 * This method returns a clean environment with a connected account and one imported Safe Multisig wallet.
 * With default configuration the connected account is an owner of the Safe
 *
 * @param {boolean} importMultipleAccounts by default is false so only 1 accounts is imported to Metamask
 * if more than one account is needed this parameter should be used with `true`
 */
export const initWithDefaultSafe = async (importMultipleAccounts = false) => {
  const [browser, metamask, gnosisPage, MMpage] = await initWithWalletConnected(importMultipleAccounts)

  // Open load safe form
  await clickByText('p', 'Load existing Safe', gnosisPage)
  await assertElementPresent(loadSafeForm.form.selector, gnosisPage, 'css')
  await clickAndType(loadSafeForm.safe_name_field.selector, gnosisPage, accountsSelectors.safeNames.load_safe_name, 'css')
  await clickAndType(loadSafeForm.safe_address_field.selector, gnosisPage, accountsSelectors.testAccountsHash.safe1, 'css')
  await clickElement(loadSafeForm.submit_btn, gnosisPage)

  // Second step, review owners
  await assertElementPresent(loadSafeForm.step_two.selector, gnosisPage, 'css')
  const keys = Object.keys(accountsSelectors.accountNames)
  for (let i = 0; i < 2/* keys.length */; i++) { // only names on the first 2 owners
    const selector = loadSafeForm.owner_name(i)
    const name = accountsSelectors.accountNames[keys[i]]
    await clearInput(selector, gnosisPage, 'css')
    await clickAndType(selector, gnosisPage, name, 'css')
  }
  await clickElement(loadSafeForm.submit_btn, gnosisPage)

  // Third step, review information and submit
  await assertElementPresent(loadSafeForm.step_three.selector, gnosisPage, 'css')
  await gnosisPage.waitForTimeout(2000)
  await clickElement(loadSafeForm.submit_btn, gnosisPage)

  return [
    browser,
    metamask,
    gnosisPage,
    MMpage,
  ]
}
