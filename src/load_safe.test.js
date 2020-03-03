const { TIME } = require('../utils/config').default
import * as gFunc from "../utils/global_func"
import { sels } from "../utils/selectors"
import { walletConnect } from "../utils/testSetup"

let browser;
let metamask;
let gnosisPage;
let MMpage;

beforeAll(async ()=>{
    [browser, metamask, gnosisPage, MMpage] = await walletConnect()
}, TIME.T60)

afterAll(async () => {
    await gnosisPage.waitFor(2000)
    await browser.close();
})

describe("Loading an Existing safe", () => {
    const homepage = sels.xpSelectors.homepage
    const load_safe = sels.xpSelectors.load_safe
    test("Open Load Safe Form", async () => {
        console.log("Open Load Safe Form\n")
        await gFunc.clickSomething(homepage.load_safe_btn, gnosisPage)
        await gFunc.assertTextPresent(load_safe.form_title, gnosisPage, sels.assertions.load_safe_title)
        await gFunc.clickAndType(load_safe.name_input, gnosisPage, sels.safeNames.load_safe_name)
        await gFunc.assertTextPresent(load_safe.valid_safe_name, gnosisPage, sels.assertions.valid_safe_name_field)
        await gFunc.clickAndType(load_safe.address_input, gnosisPage, sels.testAccountsHash.safe1)
        await gFunc.assertElementPresent(sels.cssSelectors.valid_safe_address, gnosisPage, "Css")
        await gFunc.clickSomething(load_safe.next_btn, gnosisPage)
    }, TIME.T60)
    test("Load Safe Owner edition", async () => {
        console.log("Load Safe Owner edition\n")
        await gFunc.assertTextPresent(load_safe.second_step_description, gnosisPage, sels.assertions.second_step_load_safe)
        await gFunc.clearInput(load_safe.first_owner_name_input(), gnosisPage)
        await gFunc.assertElementPresent(load_safe.required_error_input, gnosisPage)
        await gFunc.clickAndType(load_safe.first_owner_name_input(), gnosisPage, sels.accountNames.owner_name)
        await gFunc.clickSomething(load_safe.review_btn, gnosisPage)
    }, TIME.T15)
    test("Load safe Review Details", async () => {
        console.log("Load safe Review Details\n")
        const valueBefore = gFunc.getInnerText(homepage.safes_counter, gnosisPage, "int")
        await gFunc.assertElementPresent(load_safe.review_details_title, gnosisPage)
        await gFunc.assertTextPresent(load_safe.review_safe_name, gnosisPage, sels.safeNames.load_safe_name)
        await gFunc.assertTextPresent(load_safe.review_owner_name, gnosisPage, sels.accountNames.owner_name)
        await gFunc.clickSomething(load_safe.load_btn, gnosisPage)
        //await gnosisPage.waitFor(sels.cssSelectors.safe_name_heading)
        await gnosisPage.waitForSelector(sels.cssSelectors.safe_name_heading);
        expect(gnosisPage.url()).toMatch(sels.testAccountsHash.safe1)
        const safeName = await gnosisPage.$eval(sels.cssSelectors.safe_name_heading, x => x.innerText)
        expect(safeName).toMatch(sels.safeNames.load_safe_name)
        const valueAfter = gFunc.getInnerText(homepage.safes_counter, gnosisPage, "int")
        expect(parseInt(valueBefore)).toBe(parseInt(valueAfter) + 1)
    }, TIME.T15)
})