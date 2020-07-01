const { SLOWMO, ENVIRONMENT } = require('./config').default
const puppeteer = require('puppeteer')
const dappeteer = require('dappeteer')
import { sels } from "./selectors"
import * as gFunc from "./global_func"

const ENV = ENVIRONMENT.local

export const init = async ()=>{
    const browser = await dappeteer.launch(puppeteer,{
        defaultViewport:null, // this extends the page to the size of the browser
        slowMo: SLOWMO, //Miliseconds it will wait for every action performed. It's 1 by default. change it in the .env file
        args: ['--start-maximized', ENV], //maximized browser, URL for the base page
    })
    const metamask = await dappeteer.getMetamask(browser,
        {seed: sels.wallet.seed, 
        password: sels.wallet.password
    });
    await metamask.switchNetwork('Rinkeby');
    const [gnosisPage, MMpage] = await browser.pages(); //get a grip on both tabs
    gnosisPage.setDefaultTimeout(60000)
    MMpage.setDefaultTimeout(60000)

    return [
        browser,
        metamask,
        gnosisPage,
        MMpage,
    ]
}

export const walletConnect = async (importMultipleAccounts = false) => {
    const [browser, metamask, gnosisPage, MMpage] = await init()
    const homepage = sels.xpSelectors.homepage
    const cssTopBar = sels.testIdSelectors.top_bar
    const welcomePage = sels.testIdSelectors.welcome_page

    if(importMultipleAccounts){
        await gFunc.importAccounts(metamask);
        await MMpage.waitFor(1000)
    }

    await gnosisPage.bringToFront()
    if(ENV != ENVIRONMENT.local ) //for local env there is no Cookies to accept
        await gFunc.clickSomething(homepage.accept_cookies, gnosisPage)
    await gFunc.clickElement(cssTopBar.not_connected_network, gnosisPage)
    await gFunc.clickElement(welcomePage.connect_btn, gnosisPage)
    await gFunc.clickSomething(homepage.metamask_option, gnosisPage)
    await gFunc.assertElementPresent(cssTopBar.connected_network, gnosisPage, "css")
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

export const load_wallet = async (importMultipleAccounts = false) =>{
    const [browser, metamask, gnosisPage, MMpage] = await walletConnect(importMultipleAccounts)
    const welcomePage = sels.testIdSelectors.welcome_page
    const loadPage = sels.testIdSelectors.load_safe_page

    await gFunc.clickElement(welcomePage.load_safe_btn, gnosisPage)
    await gFunc.assertElementPresent(loadPage.form, gnosisPage, "css")
    await gFunc.clickAndType(loadPage.safe_name_field, gnosisPage, sels.safeNames.load_safe_name, "css")
    await gFunc.clickAndType(loadPage.safe_address_field, gnosisPage, sels.testAccountsHash.safe1, "css")
    await gFunc.clickElement(loadPage.next_btn, gnosisPage)
    await gFunc.assertElementPresent(loadPage.step_two, gnosisPage, "css")
    const keys = Object.keys(sels.accountNames)
    for(let i = 0; i < keys.length; i++) {
        let selector = loadPage.owner_name(i)
        let name = sels.accountNames[keys[i]]
        await gFunc.clearInput(selector, gnosisPage, "css")
        await gFunc.clickAndType(selector, gnosisPage, name, "css")
    }
    await gFunc.clickElement(loadPage.review_btn, gnosisPage)
    await gFunc.assertElementPresent(loadPage.step_trhee, gnosisPage, "css")
    await gnosisPage.waitFor(2000)
    await gFunc.clickElement(loadPage.load_btn, gnosisPage)

    return [
        browser,
        metamask,
        gnosisPage,
        MMpage,
    ]
}