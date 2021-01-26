import puppeteer from 'puppeteer'
import * as dappeteer from 'dappeteer'

import config from './config'
import { sels } from './selectors'
import * as gFunc from './global_func'

const { SLOWMO, ENVIRONMENT } = config
const ENV = ENVIRONMENT.dev

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
  const cssTopBar = sels.testIdSelectors.top_bar
  const welcomePage = sels.testIdSelectors.welcome_page

  if (importMultipleAccounts) {
    console.log('importando')
    await gFunc.importAccounts(metamask)
    await MMpage.waitFor(1000)
  }

  await gnosisPage.bringToFront()
  if (ENV !== ENVIRONMENT.local) { // for local env there is no Cookies to accept
    await gFunc.clickSomething(homepage.accept_cookies, gnosisPage)
  }
  await gFunc.clickElement(cssTopBar.not_connected_network, gnosisPage)
  await gFunc.clickElement(welcomePage.connect_btn, gnosisPage)
  const navigation = new Promise(res => browser.on('targetcreated', res)) // To later wait for a memtamask popUp to confirm the connection
  await gFunc.clickSomething(homepage.metamask_option, gnosisPage) // Clicking the MM icon in the onboardjs
  await navigation // Waiting...

  const pages = await browser.pages()
  const MMnotification = pages[pages.length - 1] // Capturing the notification popUp
  await gFunc.clickElement(welcomePage.mm_next_btn, MMnotification) // The 2 buttons in the popUp have the same class. Clicking twice
  await gFunc.clickElement(welcomePage.mm_next_btn, MMnotification)
  await gFunc.assertElementPresent(cssTopBar.connected_network, gnosisPage, 'css')
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
  const welcomePage = sels.testIdSelectors.welcome_page
  const loadPage = sels.testIdSelectors.load_safe_page

  await gFunc.clickByText('p', 'Load Existing Safe', gnosisPage)
  await gFunc.assertElementPresent(loadPage.form, gnosisPage, 'css')
  await gFunc.clickAndType(loadPage.safe_name_field, gnosisPage, sels.safeNames.load_safe_name, 'css')
  await gFunc.clickAndType(loadPage.safe_address_field, gnosisPage, sels.testAccountsHash.safe1, 'css')
  await gFunc.clickElement(loadPage.submit_btn, gnosisPage)
  await gFunc.assertElementPresent(loadPage.step_two, gnosisPage, 'css')
  const keys = Object.keys(sels.accountNames)
  for (let i = 0; i < 2/* keys.length */ ; i++) { // only names on the first 2 owners
    let selector = loadPage.owner_name(i)
    let name = sels.accountNames[keys[i]]
    await gFunc.clearInput(selector, gnosisPage, 'css')
    await gFunc.clickAndType(selector, gnosisPage, name, 'css')
  }
  await gFunc.clickElement(loadPage.submit_btn, gnosisPage)
  await gFunc.assertElementPresent(loadPage.step_trhee, gnosisPage, 'css')
  await gnosisPage.waitFor(2000)
  await gFunc.clickElement(loadPage.submit_btn, gnosisPage)

  return [
    browser,
    metamask,
    gnosisPage,
    MMpage,
  ]
}
