const { slowMo, TIME } = require('../utils/config').default
const puppeteer = require('puppeteer')
const dappeteer = require('dappeteer')
import * as gFunc from "../utils/global_func"
import { sels } from "../utils/selectors"

let browser;
let metamask;
let gnosisPage;
let MMpage;

beforeAll(async ()=>{
    browser = await dappeteer.launch(puppeteer,{
        defaultViewport:null, // this extends the page to the size of the browser
        slowMo, //Miliseconds it will wait for every action performed
        args: ['--start-maximized', 'https://rinkeby.gnosis-safe.io/'], //maximized browser, URL for the base page
    })
    metamask = await dappeteer.getMetamask(browser,
        {
            seed: sels.wallet.seed,
            password: sels.wallet.password
        });
    await metamask.switchNetwork('Rinkeby');
    [gnosisPage, MMpage] = await browser.pages();

    const homepage = sels.XpSelectors.homepage

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

}, TIME.T30)

afterAll(async () => {
    await gnosisPage.waitFor(2000)
    await browser.close();
})

describe("Loading an Existing safe", () => {
    const homepage = sels.XpSelectors.homepage
    const load_safe = sels.XpSelectors.load_safe
    test("Open Load Safe Form", async () => {
        console.log("Open Load Safe Form\n")
        await gFunc.clickSomething(homepage.load_safe_button, gnosisPage)
        await gFunc.assertTextPresent(load_safe.form_title, gnosisPage, sels.assertions.load_safe_title)
        await gFunc.clickAndType(load_safe.name_input, gnosisPage, sels.accountNames.load_safe_name)
        await gFunc.assertTextPresent(load_safe.valid_safe_name, gnosisPage, sels.assertions.valid_safe_name_field)
        await gFunc.clickAndType(load_safe.address_input, gnosisPage, sels.testAccountsHash.safe1)
        await gFunc.assertElementPresent(sels.CssSelectors.valid_safe_address, gnosisPage, "Css")
        await gFunc.clickSomething(load_safe.next_button, gnosisPage)
    }, TIME.T15)
    test("Load Safe Owner edition", async () => {
        console.log("Load Safe Owner edition\n")
        await gFunc.assertTextPresent(load_safe.second_step_description, gnosisPage, sels.assertions.second_step_load_safe)
        await gFunc.clearInput(load_safe.first_owner_name_input, gnosisPage)
        await gFunc.assertElementPresent(load_safe.required_error_input, gnosisPage)
        await gFunc.clickAndType(load_safe.first_owner_name_input, gnosisPage, sels.accountNames.owner_name)
        await gFunc.clickSomething(load_safe.review_button, gnosisPage)
    }, TIME.T15)
    test("Load safe Review Details", async () => {
        console.log("Load safe Review Details\n")
        const valueBefore = gFunc.getInnerText(homepage.safes_counter, gnosisPage, "int")
        await gFunc.assertElementPresent(load_safe.review_details_title, gnosisPage)
        await gFunc.assertTextPresent(load_safe.review_safe_name, gnosisPage, sels.accountNames.load_safe_name)
        await gFunc.assertTextPresent(load_safe.review_owner_name, gnosisPage, sels.accountNames.owner_name)
        await gFunc.clickSomething(load_safe.load_button, gnosisPage)
        await gnosisPage.waitForNavigation({ waitUntil: 'domcontentloaded' })
        expect(gnosisPage.url()).toMatch(sels.testAccountsHash.safe1)
        await gnosisPage.waitForSelector(sels.CssSelectors.safe_name_heading);
        const safeName = await gnosisPage.$eval(sels.CssSelectors.safe_name_heading, x => x.innerText)
        expect(safeName).toMatch(sels.accountNames.load_safe_name)
        const valueAfter = gFunc.getInnerText(homepage.safes_counter, gnosisPage, "int")
        expect(parseInt(valueBefore)).toBe(parseInt(valueAfter) + 1)
    }, TIME.T15)
})