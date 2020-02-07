const puppeteer = require('puppeteer');
const dappeteer = require('dappeteer');
import * as gFunc from "../utils/global_func"
import {sels} from "../utils/selectors"

let browser;
let metamask;
let gnosisPage;
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
    [gnosisPage, MMpage] = await browser.pages();
},TIME.MAX)

/*afterAll(async () => {
    await gnosisPage.waitFor(2000)
    await browser.close();
})
*/
describe("Wallet Connection", ()=>{
    test("Importing Account", async () => {
        await gFunc.importAccounts(metamask, process.env.IMPACC);
        await MMpage.waitFor(1000)
    },TIME.MIN)

    test("Navigating in Gnosis", async () => {
        await gnosisPage.bringToFront()
        await gFunc.clickSomething(sels.XpSelectors.homepage.accept_cookies,gnosisPage)
        await gFunc.clickSomething(sels.XpSelectors.homepage.connect_button,gnosisPage)
        await gFunc.clickSomething(sels.XpSelectors.homepage.metamask_option,gnosisPage)
    },TIME.MID)

    test("Confirming in MetaMask", async () => {
        await metamask.confirmTransaction();
    },TIME.MIN)

    test("Asserting Connection", async () => {
        await gnosisPage.bringToFront()    
        await gFunc.clickSomething(sels.XpSelectors.homepage.metamask_option,gnosisPage)
        await gFunc.assertTextPresent(sels.XpSelectors.homepage.loggedin_status, 
                            gnosisPage, 
                            sels.assertions.wallet_connection);
        await gFunc.closeIntercom(sels.CssSelectors.intercom_close_button, 
                            gnosisPage)
    },TIME.MID)
}),

describe("Loading an Existing safe", ()=>{
    test("Open Load Safe Form", async()=>{
        await gFunc.clickSomething(
            sels.XpSelectors.homepage.load_safe_button, 
            gnosisPage)
        await gFunc.assertTextPresent(
            sels.XpSelectors.load_safe.form_title, 
            gnosisPage,
            sels.assertions.load_safe_title)
        await gFunc.clickAndType(
            sels.XpSelectors.load_safe.name_input, 
            gnosisPage, 
            sels.accountNames.safe_name)
        await gFunc.assertTextPresent(
            sels.XpSelectors.load_safe.valid_safe_name,
            gnosisPage,
            sels.assertions.valid_safe_name_field)
        await gFunc.clickAndType(
            sels.XpSelectors.load_safe.address_input, 
            gnosisPage,
            sels.testAccounts.safe1)
        await gFunc.assertElementPresent(
            sels.CssSelectors.valid_safe_address,
            gnosisPage,
            "Css")
        await gFunc.clickSomething(
            sels.XpSelectors.load_safe.next_button,
            gnosisPage)
    },TIME.MIN)

    test("Load Safe Owner edition", async () =>{
        await gFunc.assertTextPresent(
            sels.XpSelectors.load_safe.second_step_description,
            gnosisPage,
            sels.assertions.second_step_load_safe)
        await gFunc.clearInput(
            sels.XpSelectors.load_safe.first_owner_name_input,
            gnosisPage)
        await gFunc.assertElementPresent(
            sels.XpSelectors.load_safe.required_error_input,
            gnosisPage)
        await gFunc.clickAndType(
            sels.XpSelectors.load_safe.first_owner_name_input,
            gnosisPage,
            sels.accountNames.owner_name)
        await gFunc.clickSomething(
            sels.XpSelectors.load_safe.review_button,
            gnosisPage)
    },TIME.MIN)

    test("Load safe Review Details", async () =>{
        const [safeCounter] = await gnosisPage.$x(sels.XpSelectors.homepage.safes_counter) 
        const safeAmount = await gnosisPage.evaluate(x=>x.innerText, safeCounter)
        await gFunc.assertElementPresent(
            sels.XpSelectors.load_safe.review_details_title,
            gnosisPage)
        await gFunc.assertTextPresent(
            sels.XpSelectors.load_safe.review_safe_name,
            gnosisPage,
            sels.accountNames.safe_name)
        await gFunc.assertTextPresent(
            sels.XpSelectors.load_safe.review_owner_name,
            gnosisPage,
            sels.accountNames.owner_name)
        await gFunc.clickSomething(
            sels.XpSelectors.load_safe.load_button,
            gnosisPage)
        await gnosisPage.waitForNavigation({waitUntil:'domcontentloaded'})
        expect(gnosisPage.url()).toMatch(sels.testAccounts.safe1)
        await gnosisPage.waitForSelector(sels.CssSelectors.safe_name_heading);
        const safeName = await gnosisPage.$eval(sels.CssSelectors.safe_name_heading, x => x.innerText)
        expect(safeName).toMatch(sels.accountNames.safe_name)
        [safeCounter] = await gnosisPage.$x(sels.XpSelectors.homepage.safes_counter)
        expect(safeCounter).toBe(safeAmount + 1)
    },TIME.MAX)
})
/*
describe("Create New Safe", () =>{
    test("Open Create Safe Form", async ()=>{
        
    }, TIME.MIN)
    test("Naming The Safe", async () =>{

    }, TIME.MIN)
    test("Adding Owners", async() =>{

    }, TIME.MIN)
    test("Setting Required Confirmation", async () => {
        
    }, TIME.MIN);
    test("Reviewing Safe Info", async () => {
        
    }, TIME.MIN);
    test("Asserting Test creationg", async () => {
        
    }, TIME.MIN);
})
*/