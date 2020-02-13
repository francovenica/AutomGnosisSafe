const { slowMo, TIME } = require('../utils/config').default
import * as gFunc from "../utils/global_func"
import { sels } from "../utils/selectors"
import { walletConnect } from "../utils/testSetup"

let browser;
let metamask;
let gnosisPage;
let MMpage;

beforeAll(async ()=>{
    [browser, metamask, gnosisPage, MMpage] = await walletConnect()
}, TIME.T30)

afterAll(async () => {
    await gnosisPage.waitFor(2000)
    await browser.close();
})

describe("Create New Safe", () =>{
    const homepage = sels.XpSelectors.homepage
    const create_safe = sels.XpSelectors.create_safe
    test("Open Create Safe Form", async ()=>{
        console.log("Open Create Safe Form\n")
        await gFunc.clickSomething(homepage.home_button, gnosisPage)
        await gFunc.clickSomething(homepage.create_safe_button, gnosisPage)
        await gFunc.assertElementPresent(sels.CssSelectors.create_safe_name_input, gnosisPage, "css")        
    },  TIME.T6)
    test("Naming The Safe", async () =>{
        console.log("Naming The Safe\n")
        await gFunc.clickSomething(create_safe.start_button, gnosisPage)
        await gFunc.assertTextPresent(create_safe.required_error_input, gnosisPage, 'Required')
        await gFunc.clickAndType(sels.CssSelectors.create_safe_name_input, gnosisPage, sels.safeNames.create_safe_name, "css")
        await gFunc.clickSomething(create_safe.start_button, gnosisPage)
    },  TIME.T6)
    test("Adding Owners", async() =>{
        console.log("Adding Owners\n")
        await gFunc.assertElementPresent(create_safe.add_owner, gnosisPage)
        await gFunc.clickSomething(create_safe.add_owner, gnosisPage)
        await gFunc.clickSomething(create_safe.review_button, gnosisPage)
        await gFunc.assertTextPresent(create_safe.required_error_input, gnosisPage, 'Required')
        await gFunc.clickAndType(create_safe.second_owner_name_input, gnosisPage, sels.accountNames.owner2_name)
        await gFunc.assertTextPresent(create_safe.required_error_input, gnosisPage, 'Required')
        await gFunc.clickAndType(create_safe.second_owner_address_input, gnosisPage, sels.testAccountsHash.user2)
    },  TIME.T15);
    test("Setting Required Confirmation", async () => {
        console.log("Setting Required Confirmation\n")
        await gFunc.clickSomething(sels.CssSelectors.req_conf_dropdown, gnosisPage, "css")
        await gFunc.clickSomething(sels.CssSelectors.req_conf_value_2, gnosisPage, "css")
        await gnosisPage.waitFor(3000);
        await gFunc.clickSomething(create_safe.review_button, gnosisPage)    
    },  TIME.T15);
    test("Reviewing Safe Info", async () => {
        console.log("Reviewing Safe Info\n")
        await gnosisPage.waitFor(2000)
        await gFunc.clickSomething(create_safe.submit_button,gnosisPage)
        await gnosisPage.waitFor(2000)
        await metamask.confirmTransaction()
        await MMpage.waitFor(1000)
    },  TIME.T15)
    test("Asserting Test creationg", async () => {
        console.log("Asserting Test creationg\n")
        await gnosisPage.bringToFront()
        await gnosisPage.waitForNavigation({waitUntil:'domcontentloaded'})
        await gnosisPage.waitForSelector(sels.CssSelectors.safe_name_heading);
        const safeName = await gnosisPage.$eval(sels.CssSelectors.safe_name_heading, x => x.innerText)
        expect(safeName).toMatch(sels.safeNames.create_safe_name)
    },  TIME.T60);
})
