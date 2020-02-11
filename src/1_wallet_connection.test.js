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
        slowMo:5, //Miliseconds it will wait for every action performed
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
        console.log("Importing Account\n")
        await gFunc.importAccounts(metamask, process.env.IMPACC);
        await MMpage.waitFor(1000)
    },TIME.MAX)
    test("Navigating in Gnosis", async () => {
        console.log("Navigating in Gnosis\n")
        await gnosisPage.bringToFront()
        await gFunc.clickSomething(sels.XpSelectors.homepage.accept_cookies,gnosisPage)
        await gFunc.clickSomething(sels.XpSelectors.homepage.connect_button,gnosisPage)
        await gFunc.clickSomething(sels.XpSelectors.homepage.metamask_option,gnosisPage)
    },TIME.MAX)
    test("Confirming in MetaMask", async () => {
        console.log("Confirming in MetaMask\n")
        await metamask.confirmTransaction();
    },TIME.MAX)
    test("Asserting Connection", async () => {
        console.log("Asserting Connection\n")
        await gnosisPage.bringToFront()  
        await gFunc.clickSomething(sels.XpSelectors.homepage.metamask_option,gnosisPage)
        await gFunc.assertTextPresent(sels.XpSelectors.homepage.loggedin_status, 
                            gnosisPage, 
                            sels.assertions.wallet_connection);
        try{await gFunc.closeIntercom(sels.CssSelectors.intercom_close_button, 
                            gnosisPage)}catch(e){}
    },TIME.MAX)
})

describe("Loading an Existing safe", ()=>{
    test("Open Load Safe Form", async()=>{
        console.log("Open Load Safe Form\n")
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
            sels.accountNames.load_safe_name)
        await gFunc.assertTextPresent(
            sels.XpSelectors.load_safe.valid_safe_name,
            gnosisPage,
            sels.assertions.valid_safe_name_field)
        await gFunc.clickAndType(
            sels.XpSelectors.load_safe.address_input, 
            gnosisPage,
            sels.testAccountsHash.safe1)
        await gFunc.assertElementPresent(
            sels.CssSelectors.valid_safe_address,
            gnosisPage,
            "Css")
        await gFunc.clickSomething(
            sels.XpSelectors.load_safe.next_button,
            gnosisPage)
    },TIME.MAX)
    test("Load Safe Owner edition", async () =>{
        console.log("Load Safe Owner edition\n")
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
    },TIME.MAX)
    test("Load safe Review Details", async () =>{
        console.log("Load safe Review Details\n")
        const valueBefore = gFunc.getInnerText(
            sels.XpSelectors.homepage.safes_counter,
            gnosisPage,
            "int")
        await gFunc.assertElementPresent(
            sels.XpSelectors.load_safe.review_details_title,
            gnosisPage)
        await gFunc.assertTextPresent(
            sels.XpSelectors.load_safe.review_safe_name,
            gnosisPage,
            sels.accountNames.load_safe_name)
        await gFunc.assertTextPresent(
            sels.XpSelectors.load_safe.review_owner_name,
            gnosisPage,
            sels.accountNames.owner_name)
        await gFunc.clickSomething(
            sels.XpSelectors.load_safe.load_button,
            gnosisPage)
        await gnosisPage.waitForNavigation({waitUntil:'domcontentloaded'})
        expect(gnosisPage.url()).toMatch(sels.testAccountsHash.safe1)
        await gnosisPage.waitForSelector(sels.CssSelectors.safe_name_heading);
        const safeName = await gnosisPage.$eval(sels.CssSelectors.safe_name_heading, x => x.innerText)
        expect(safeName).toMatch(sels.accountNames.load_safe_name)
        const valueAfter = gFunc.getInnerText(
            sels.XpSelectors.homepage.safes_counter,
            gnosisPage,
            "int")
        expect(parseInt(valueBefore)).toBe(parseInt(valueAfter) + 1)
    },TIME.MAX)
})

describe("Create New Safe", () =>{
    test("Open Create Safe Form", async ()=>{
        console.log("Open Create Safe Form\n")
        await gFunc.clickSomething(sels.XpSelectors.homepage.home_button,
            gnosisPage)
        await gFunc.clickSomething(sels.XpSelectors.homepage.create_safe_button,
            gnosisPage)
        await gFunc.assertElementPresent(sels.CssSelectors.create_safe_name_input,
            gnosisPage,
            "css")        
    }, TIME.MAX)
    test("Naming The Safe", async () =>{
        console.log("Naming The Safe\n")
        await gFunc.clickSomething(sels.XpSelectors.create_safe.start_button,
            gnosisPage)
        await gFunc.assertTextPresent(sels.XpSelectors.create_safe.required_error_input,
            gnosisPage,
            'Required')
        await gFunc.clickAndType(sels.CssSelectors.create_safe_name_input,
            gnosisPage,
            sels.accountNames.create_safe_name,
            "css")
        await gFunc.clickSomething(sels.XpSelectors.create_safe.start_button,
            gnosisPage)
    }, TIME.MAX)
    test("Adding Owners", async() =>{
        console.log("Adding Owners\n")
        await gFunc.assertElementPresent(sels.XpSelectors.create_safe.add_owner,
            gnosisPage)
        await gFunc.clickSomething(sels.XpSelectors.create_safe.add_owner,
            gnosisPage)
        await gFunc.clickSomething(sels.XpSelectors.create_safe.review_button,
            gnosisPage)
        await gFunc.assertTextPresent(sels.XpSelectors.create_safe.required_error_input,
            gnosisPage,
            'Required')
        await gFunc.clickAndType(sels.XpSelectors.create_safe.second_owner_name_input,
            gnosisPage,
            sels.accountNames.owner2_name)
        await gFunc.assertTextPresent(sels.XpSelectors.create_safe.required_error_input,
            gnosisPage,
            'Required')
        await gFunc.clickAndType(sels.XpSelectors.create_safe.second_owner_address_input,
            gnosisPage,
            sels.testAccountsHash.user2)
    }, TIME.MAX);
    test("Setting Required Confirmation", async () => {
        console.log("Setting Required Confirmation\n")
        await gFunc.clickSomething(sels.CssSelectors.req_conf_dropdown,
            gnosisPage,
            "css")
        await gFunc.clickSomething(sels.CssSelectors.req_conf_value_2,
            gnosisPage,
            "css")
        await gFunc.clickSomething(sels.XpSelectors.create_safe.review_button,
            gnosisPage)
        await gFunc.clickSomething(sels.XpSelectors.create_safe.review_button,
            gnosisPage)
        await gFunc.clickSomething(sels.XpSelectors.create_safe.review_button,
            gnosisPage)    
    }, TIME.MAX);
    test("Reviewing Safe Info", async () => {
        console.log("Reviewing Safe Info\n")
        await gnosisPage.waitFor(2000)
        await gFunc.clickSomething(sels.XpSelectors.create_safe.submit_button,
            gnosisPage)
        await gnosisPage.waitFor(2000)
        await metamask.confirmTransaction()
        await MMpage.waitFor(1000)
    }, TIME.MAX)
    test("Asserting Test creationg", async () => {
        console.log("Asserting Test creationg\n")
        await gnosisPage.bringToFront()
        await gnosisPage.waitForNavigation({waitUntil:'domcontentloaded'})
        await gnosisPage.waitForSelector(sels.CssSelectors.safe_name_heading);
        const safeName = await gnosisPage.$eval(sels.CssSelectors.safe_name_heading, x => x.innerText)
        expect(safeName).toMatch(sels.accountNames.create_safe_name)
    }, TIME.MAX);
})
