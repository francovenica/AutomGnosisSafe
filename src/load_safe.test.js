import * as gFunc from "../utils/global_func"
import { sels } from "../utils/selectors"
import { walletConnect } from "../utils/testSetup"

let browser;
let metamask;
let gnosisPage;
let MMpage;

beforeAll(async ()=>{
    [browser, metamask, gnosisPage, MMpage] = await walletConnect()
}, 60000)

afterAll(async () => {
    await gnosisPage.waitFor(2000)
    await browser.close();
})

describe("Loading an Existing safe", () => {
    const load_safe = sels.xpSelectors.load_safe
    const welcomePage = sels.testIdSelectors.welcome_page
    const loadPage = sels.testIdSelectors.load_safe_page
    const topBar = sels.testIdSelectors.top_bar
    const mainHub = sels.testIdSelectors.main_hub
    test("Open Load Safe Form", async () => {
        console.log("Open Load Safe Form\n")
        await gFunc.clickElement(welcomePage.load_safe_btn, gnosisPage)
        await gFunc.assertElementPresent(loadPage.form, gnosisPage, "css")
        await gFunc.clickAndType(loadPage.safe_name_field, gnosisPage, sels.safeNames.load_safe_name, "css")
        await gFunc.assertTextPresent(load_safe.valid_safe_name, gnosisPage, sels.assertions.valid_safe_name_field)
        await gFunc.clickAndType(loadPage.safe_address_field, gnosisPage, sels.testAccountsHash.safe1, "css")
        await gFunc.assertElementPresent(loadPage.valid_address, gnosisPage, "css")
        await gFunc.clickElement(loadPage.submit_btn, gnosisPage)
    }, 60000)
    test("Load Safe Owner edition", async () => {
        console.log("Load Safe Owner edition\n")
        await gFunc.assertElementPresent(loadPage.step_two, gnosisPage, "css")
        await gFunc.clearInput(loadPage.owner_name(), gnosisPage, "css")
        await gFunc.clickAndType(loadPage.owner_name(), gnosisPage, sels.accountNames.owner_name, "css")
        await gFunc.clickElement(loadPage.submit_btn, gnosisPage)
    }, 60000)
    test("Load safe Review Details", async () => {
        console.log("Load safe Review Details\n")
        const safeAmountBefore = await gFunc.getNumberInString(topBar.safes_counter, gnosisPage, "int", "css")
        await gFunc.assertElementPresent(loadPage.step_trhee, gnosisPage, "css")
        await gFunc.assertTextPresent(loadPage.review_safe_name, gnosisPage, sels.safeNames.load_safe_name, "css")
        await gFunc.assertTextPresent(loadPage.review_owner_name, gnosisPage, sels.accountNames.owner_name, "css")
        await gnosisPage.waitFor(2000)
        await gFunc.clickElement(loadPage.submit_btn, gnosisPage)
        await gFunc.assertElementPresent(mainHub.safe_address_heading, gnosisPage, "css")
        const loadedSafeAddress =  await gFunc.getInnerText(mainHub.safe_address_heading, gnosisPage, "css")
        expect(loadedSafeAddress).toMatch(sels.testAccountsHash.safe1)
        const safeName = await gFunc.getInnerText(mainHub.safe_name_heading, gnosisPage, "css")
        expect(safeName).toMatch(sels.safeNames.load_safe_name)
        const safeAmountAfter = await gFunc.getNumberInString(topBar.safes_counter, gnosisPage, "int", "css")
        expect(parseInt(safeAmountAfter)).toBe(parseInt(safeAmountBefore) + 1)
    }, 60000)
})