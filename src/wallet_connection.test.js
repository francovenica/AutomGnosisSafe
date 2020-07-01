import * as gFunc from "../utils/global_func"
import { sels } from "../utils/selectors"
import { init } from "../utils/testSetup-copy"


let browser;
let metamask;
let gnosisPage;
let MMpage;

beforeAll(async ()=>{
    [browser, metamask, gnosisPage, MMpage] = await init()
}, 60000)

afterAll(async () => {
    await gnosisPage.waitFor(2000)
    await browser.close();
})

beforeAll(async ()=>{
    [browser, metamask, gnosisPage, MMpage] = await init()
}, 60000)

afterAll(async () => {
    await gnosisPage.waitFor(2000)
    await browser.close();
})

describe("Wallet Connection", ()=>{
    const homepage = sels.xpSelectors.homepage
    test("Importing Account", async () => {
        console.log("Importing Account\n")
        await gFunc.importAccounts(metamask);
        await MMpage.waitFor(1000)
    }, 60000)
    test("Navigating in Gnosis", async () => {
        console.log("Navigating in Gnosis\n")
        await gnosisPage.bringToFront()
        await gFunc.clickSomething(homepage.accept_cookies,gnosisPage)
        await gFunc.clickSomething(homepage.connect_btn,gnosisPage)
        await gFunc.clickSomething(homepage.metamask_option,gnosisPage)
    }, 15000)
    test("Asserting Connection", async () => {
        console.log("Asserting Connection\n")
        await gFunc.assertTextPresent(homepage.loggedin_status, gnosisPage, sels.assertions.wallet_connection);
        // try{
        //     await gFunc.closeIntercom(sels.cssSelectors.intercom_close_btn, gnosisPage)
        // }catch(e){}
    }, 30000)
})
