const { slowMo, impacc } = require('./config').default
const puppeteer = require('puppeteer')
const dappeteer = require('dappeteer')
import { sels } from "./selectors"
import * as gFunc from "./global_func"

export const init = async ()=>{
    const browser = await dappeteer.launch(puppeteer,{
        defaultViewport:null, // this extends the page to the size of the browser
        slowMo, //Miliseconds it will wait for every action performed. It's 1 by default. change it in the .env file
        args: ['--start-maximized', 'https://rinkeby.gnosis-safe.io/'], //maximized browser, URL for the base page
    })
    const metamask = await dappeteer.getMetamask(browser,
        {seed: sels.wallet.seed, 
        password: sels.wallet.password
    });
    await metamask.switchNetwork('Rinkeby');
    const [gnosisPage, MMpage] = await browser.pages(); //get a grip on both tabs

    return [
        browser,
        metamask,
        gnosisPage,
        MMpage,
    ]
}

export const walletConnect = async (importMultipleAccounts = false)=> {
    const [browser, metamask, gnosisPage, MMpage] = await init()
    const homepage = sels.XpSelectors.homepage

    if(importMultipleAccounts){
        await gFunc.importAccounts(metamask, impacc);
        await MMpage.waitFor(1000)
    }

    await gnosisPage.bringToFront()
    await gFunc.clickSomething(homepage.accept_cookies, gnosisPage)
    await gFunc.clickSomething(homepage.connect_button, gnosisPage)
    await gFunc.clickSomething(homepage.metamask_option, gnosisPage)

    await metamask.confirmTransaction();

    await gnosisPage.bringToFront()
    await gFunc.clickSomething(homepage.metamask_option, gnosisPage)
    await gFunc.assertTextPresent(homepage.loggedin_status, gnosisPage, sels.assertions.wallet_connection);
    try {
        await gFunc.closeIntercom(sels.CssSelectors.intercom_close_button, gnosisPage)
    } catch (e) { }
    
    return [
        browser,
        metamask,
        gnosisPage,
        MMpage,
    ]
}

export const load_wallet = async (importMultipleAccounts = false) =>{
    const [browser, metamask, gnosisPage, MMpage] = await walletConnect(importMultipleAccounts)

    const homepage = sels.XpSelectors.homepage
    const load_safe = sels.XpSelectors.load_safe

    await gFunc.clickSomething(homepage.load_safe_button, gnosisPage)
    await gFunc.assertTextPresent(load_safe.form_title, gnosisPage, sels.assertions.load_safe_title)
    await gFunc.clickAndType(load_safe.name_input, gnosisPage, sels.safeNames.load_safe_name)
    await gFunc.assertTextPresent(load_safe.valid_safe_name, gnosisPage, sels.assertions.valid_safe_name_field)
    await gFunc.clickAndType(load_safe.address_input, gnosisPage, sels.testAccountsHash.safe1)
    await gFunc.assertElementPresent(sels.CssSelectors.valid_safe_address, gnosisPage, "Css")
    await gFunc.clickSomething(load_safe.next_button, gnosisPage)
    
    await gFunc.assertTextPresent(load_safe.second_step_description, gnosisPage, sels.assertions.second_step_load_safe)
    const keys = Object.keys(sels.accountNames)
    for(let i = 0; i < keys.length; i++) { 
        let selector = load_safe.first_owner_name_input(i)
        let name = sels.accountNames[keys[i]]
        console.log("\n Selector = ",selector, "\n")
        await gFunc.clearInput(selector, gnosisPage)
        //await gFunc.assertElementPresent(load_safe.required_error_input, gnosisPage)
        await gFunc.clickAndType(selector, gnosisPage, name)
    }
    await gFunc.clickSomething(load_safe.review_button, gnosisPage)
    await gFunc.assertElementPresent(load_safe.review_details_title, gnosisPage)
    await gFunc.clickSomething(load_safe.load_button, gnosisPage)

    return [
        browser,
        metamask,
        gnosisPage,
        MMpage,
    ]
}