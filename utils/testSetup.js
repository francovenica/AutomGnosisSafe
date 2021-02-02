import puppeteer from 'puppeteer'
import * as dappeteer from '@dasanra/dappeteer'

import config from './config'
import { sels } from './selectors'
import * as gFunc from './global_func'

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
    seed: sels.wallet.seed,
    password: sels.wallet.password
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

export const initWithWalletConnected = async (importMultipleAccounts = false) => {
  const [browser, metamask, gnosisPage, MMpage] = await init()
  const homepage = sels.xpSelectors.homepage
  const topBar = sels.testIdSelectors.top_bar

  if (importMultipleAccounts) {
    await gFunc.importAccounts(metamask)
    await MMpage.waitForTimeout(1000)
  }

  await gnosisPage.bringToFront()
  // if (ENV !== ENVIRONMENT.local) { // for local env there is no Cookies to accept
  await gFunc.clickSomething(homepage.accept_cookies, gnosisPage)
  // }
  await gFunc.clickElement(topBar.not_connected_network, gnosisPage)
  await gFunc.clickElement(topBar.connect_btn, gnosisPage)
  await gFunc.clickSomething(homepage.metamask_option, gnosisPage) // Clicking the MM icon in the onboardjs

  // FIXME remove MMpage.reload() when updated version of dappeteer
  await MMpage.reload()
  // --- end of FIXME
  await metamask.approve({ allAccounts: true })
  await gnosisPage.bringToFront()

  await gFunc.assertElementPresent(topBar.connected_network, gnosisPage, 'css')
  // try {
  //     await gFunc.closeIntercom(sels.cssSelectors.intercom_close_btn, gnosisPage)
  // } catch (e) { }
  return [
    browser,
    metamask,
    gnosisPage,
    MMpage,
  ]
}

export const initWithDefaultSafe = async (importMultipleAccounts = false) => {
  const [browser, metamask, gnosisPage, MMpage] = await initWithWalletConnected(importMultipleAccounts)
  const loadPage = sels.testIdSelectors.load_safe_page

  await gFunc.clickByText('p', 'Load Existing Safe', gnosisPage)
  await gFunc.assertElementPresent(loadPage.form, gnosisPage, 'css')
  await gFunc.clickAndType(loadPage.safe_name_field, gnosisPage, sels.safeNames.load_safe_name, 'css')
  await gFunc.clickAndType(loadPage.safe_address_field, gnosisPage, sels.testAccountsHash.safe1, 'css')
  await gFunc.clickElement(loadPage.submit_btn, gnosisPage)
  await gFunc.assertElementPresent(loadPage.step_two, gnosisPage, 'css')
  const keys = Object.keys(sels.accountNames)
  for (let i = 0; i < 2/* keys.length */; i++) { // only names on the first 2 owners
    const selector = loadPage.owner_name(i)
    const name = sels.accountNames[keys[i]]
    await gFunc.clearInput(selector, gnosisPage, 'css')
    await gFunc.clickAndType(selector, gnosisPage, name, 'css')
  }
  await gFunc.clickElement(loadPage.submit_btn, gnosisPage)
  await gFunc.assertElementPresent(loadPage.step_three, gnosisPage, 'css')
  await gnosisPage.waitForTimeout(2000)
  await gFunc.clickElement(loadPage.submit_btn, gnosisPage)

  return [
    browser,
    metamask,
    gnosisPage,
    MMpage,
  ]
}
