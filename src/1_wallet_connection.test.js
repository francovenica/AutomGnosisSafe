const puppeteer = require('puppeteer');
const dappeteer = require('dappeteer');
import * as gFunc from "./global_func"
import {sels} from "./selectors"

let browser;
let metamask;
let GnosisPage;
let MMpage;

beforeAll(async ()=>{
    browser = await dappeteer.launch(puppeteer,{
        defaultViewport:null, // this extends the page to the size of the browser
        slowMo:0, //Miliseconds it will wait for every action performed
        args: ['--start-maximized', 'https://rinkeby.gnosis-safe.io/'], //maximized browser, URL for the base page
    })
    metamask = await dappeteer.getMetamask(browser,
        {seed: sels.wallet.seed, 
        password: sels.wallet.password
    });
    await metamask.switchNetwork('Rinkeby');
    [GnosisPage, MMpage] = await browser.pages();
},TIME.MAX)

afterAll(async () => {
    await GnosisPage.waitFor(2000)
    await browser.close();
})

describe("Testing Wallet connection", ()=>{
    test("Importing Account", async () => {
        await gFunc.importAccounts(metamask, process.env.IMPACC);
        await MMpage.waitFor(1000)
    },TIME.MIN)

    test("Navigating in Gnosis", async () => {
        await GnosisPage.bringToFront()
        await gFunc.clickSomething(sels.XpSelectors.accept_cookies,GnosisPage)
        await gFunc.clickSomething(sels.XpSelectors.connect_button,GnosisPage)
        await gFunc.clickSomething(sels.XpSelectors.metamask_option,GnosisPage)
    },TIME.MID)

    test("Confirming in MetaMask", async () => {
        await metamask.confirmTransaction();
    },TIME.MIN)

    test("Asserting Connection", async () => {
        await GnosisPage.bringToFront()    
        await gFunc.clickSomething(sels.XpSelectors.metamask_option,GnosisPage)
        await gFunc.assertTextPresent(sels.XpSelectors.loggedin_status, 
                            GnosisPage, 
                            sels.assertions.wallet_connection);
        await gFunc.closeIntercom(sels.CssSelectors.intercom_close_button, 
                            GnosisPage)
    },TIME.MID)

    test("Open Load Safe Form", async()=>{
        await gFunc.clickSomething(
            sels.XpSelectors.load_safe_button, 
            GnosisPage)
        await gFunc.assertTextPresent(
            sels.XpSelectors.load_safe_form_title, 
            GnosisPage,
            sels.assertions.load_safe_title)
        await gFunc.clickAndType(
            sels.XpSelectors.load_safe_name_input, 
            GnosisPage, 
            sels.accountNames.safe_name)
        await gFunc.assertTextPresent(
            sels.XpSelectors.valid_safe_name,
            GnosisPage,
            sels.assertions.valid_safe_name_field)
        await gFunc.clickAndType(
            sels.XpSelectors.load_safe_address_input, 
            GnosisPage,
            sels.testAccounts.Safe1)
        await gFunc.assertElementPresent(
            sels.CssSelectors.valid_safe_address,
            GnosisPage,
            "Css")
        await gFunc.clickSomething(
            sels.XpSelectors.next_button,
            GnosisPage)
    },TIME.MIN)

    test("Load safe Owner edition", async () =>{
        await gFunc.assertTextPresent(
            sels.XpSelectors.second_step_description,
            GnosisPage,
            sels.assertions.second_step_load_safe)
        await gFunc.clearInput(
            sels.XpSelectors.first_owner_name_input,
            GnosisPage)
        await gFunc.assertElementPresent(
            sels.XpSelectors.required_error_input,
            GnosisPage)
        await gFunc.clickAndType(
            sels.XpSelectors.first_owner_name_input,
            GnosisPage,
            sels.accountNames.owner_name)
        await gFunc.clickSomething(
            sels.XpSelectors.load_safe_review_button,
            GnosisPage)
    },TIME.MIN)

    test("Load safe Review Details", async () =>{
        await gFunc.assertElementPresent(
            sels.XpSelectors.load_safe_review_details_title,
            GnosisPage)
        await gFunc.assertTextPresent(
            sels.XpSelectors.load_safe_review_safe_name,
            GnosisPage,
            sels.accountNames.safe_name)
        await gFunc.assertTextPresent(
            sels.XpSelectors.load_safe_review_owner_name,
            GnosisPage,
            sels.accountNames.owner_name)
        await gFunc.clickSomething(
            sels.XpSelectors.load_safe_load_button,
            GnosisPage)
        await GnosisPage.waitForNavigation({waitUntil:'domcontentloaded'})
        expect(GnosisPage.url()).toMatch(sels.testAccounts.Safe1)
        await GnosisPage.waitForSelector(sels.CssSelectors.safe_name_heading);
        const safeName = await GnosisPage.$eval(sels.CssSelectors.safe_name_heading, x => x.innerText)
        expect(safeName).toMatch(sels.accountNames.safe_name)
        //await GnosisPage.screenshot({path: "snapshot.png", type:"png"})
    },TIME.MAX)
})