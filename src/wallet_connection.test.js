const { impacc, TIME } = require('../utils/config').default
// const puppeteer = require('puppeteer')
// const dappeteer = require('dappeteer')
import * as gFunc from "../utils/global_func"
import { sels } from "../utils/selectors"
import { init } from "../utils/testSetup"

let browser;
let metamask;
let gnosisPage;
let MMpage;

beforeAll(async ()=>{
    [browser, metamask, gnosisPage, MMpage] = await init()
}, TIME.T30)

afterAll(async () => {
    await gnosisPage.waitFor(2000)
    await browser.close();
})

describe("Wallet Connection", ()=>{
    test("Importing Account", async () => {
        console.log("Importing Account\n")
        await gFunc.importAccounts(metamask, impacc);
        await MMpage.waitFor(1000)
    }, TIME.T15)
    test("Navigating in Gnosis", async () => {
        console.log("Navigating in Gnosis\n")
        await gnosisPage.bringToFront()
        await gFunc.clickSomething(sels.XpSelectors.homepage.accept_cookies,gnosisPage)
        await gFunc.clickSomething(sels.XpSelectors.homepage.connect_button,gnosisPage)
        await gFunc.clickSomething(sels.XpSelectors.homepage.metamask_option,gnosisPage)
    }, TIME.T15)
    test("Confirming in MetaMask", async () => {
        console.log("Confirming in MetaMask\n")
        await metamask.confirmTransaction();
    }, TIME.T15)
    test("Asserting Connection", async () => {
        console.log("Asserting Connection\n")
        await gnosisPage.bringToFront()  
        await gFunc.clickSomething(sels.XpSelectors.homepage.metamask_option,gnosisPage)
        await gFunc.assertTextPresent(sels.XpSelectors.homepage.loggedin_status, 
                            gnosisPage, 
                            sels.assertions.wallet_connection);
        try{await gFunc.closeIntercom(sels.CssSelectors.intercom_close_button, 
                            gnosisPage)}catch(e){}
    }, TIME.T15)
})
