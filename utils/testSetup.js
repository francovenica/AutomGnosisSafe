const { TIME, SLOWMO, ENVIRONMENT } = require('./config').default
const puppeteer = require('puppeteer')
const dappeteer = require('dappeteer')
import { sels } from "./selectors"
import * as gFunc from "./global_func"

export const init = async ()=>{
    const browser = await dappeteer.launch(puppeteer,{
        defaultViewport:null, // this extends the page to the size of the browser
        slowMo: SLOWMO, //Miliseconds it will wait for every action performed. It's 1 by default. change it in the .env file
        args: ['--start-maximized', ENVIRONMENT.rinkeby], //maximized browser, URL for the base page
    })
    const metamask = await dappeteer.getMetamask(browser,
        {seed: sels.wallet.seed, 
        password: sels.wallet.password
    });
    await metamask.switchNetwork('Rinkeby');
    const [gnosisPage, MMpage] = await browser.pages(); //get a grip on both tabs
    gnosisPage.setDefaultTimeout(TIME.T60)
    MMpage.setDefaultTimeout(TIME.T60)

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

    if(importMultipleAccounts){
        await gFunc.importAccounts(metamask);
        await MMpage.waitFor(1000)
    }

    await gnosisPage.bringToFront()
    await gFunc.clickSomething(homepage.accept_cookies, gnosisPage)
    await gFunc.clickSomething(homepage.connect_btn, gnosisPage)
    await gFunc.clickSomething(homepage.metamask_option, gnosisPage)
    await gFunc.assertTextPresent(homepage.loggedin_status, gnosisPage, sels.assertions.wallet_connection);
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

    const homepage = sels.xpSelectors.homepage
    const load_safe = sels.xpSelectors.load_safe
    
    await gFunc.clickSomething(homepage.load_safe_btn, gnosisPage)
    await gFunc.assertTextPresent(load_safe.form_title, gnosisPage, sels.assertions.load_safe_title)
    await gFunc.clickAndType(load_safe.name_input, gnosisPage, sels.safeNames.load_safe_name)
    await gFunc.clickAndType(load_safe.address_input, gnosisPage, sels.testAccountsHash.safe1)
    await gFunc.clickSomething(load_safe.next_btn, gnosisPage)
    
    await gFunc.assertTextPresent(load_safe.second_step_description, gnosisPage, sels.assertions.second_step_load_safe)
    const keys = Object.keys(sels.accountNames)
    for(let i = 0; i < keys.length; i++) {
        let selector = load_safe.first_owner_name_input(i)
        let name = sels.accountNames[keys[i]]
        await gFunc.clearInput(selector, gnosisPage)
        await gFunc.clickAndType(selector, gnosisPage, name)
    }
    await gFunc.clickSomething(load_safe.review_btn, gnosisPage)
    await gFunc.assertElementPresent(load_safe.review_details_title, gnosisPage)
    await gnosisPage.waitFor(TIME.T2)
    await gFunc.clickSomething(load_safe.load_btn, gnosisPage)

    return [
        browser,
        metamask,
        gnosisPage,
        MMpage,
    ]
}