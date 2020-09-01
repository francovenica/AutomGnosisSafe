import * as gFunc from "../utils/global_func"
import { sels } from "../utils/selectors"
import { load_wallet } from "../utils/testSetup"

let browser;
let metamask;
let gnosisPage;
let MMpage;

beforeAll(async ()=>{
    [browser, metamask, gnosisPage, MMpage] = await load_wallet(true)
}, 60000)

afterAll(async () => {
    await gnosisPage.waitFor(2000)
    await browser.close();
})

describe("Reject Tx flow", ()=>{
    let current_balance = 0.0
    const safe_hub = sels.xpSelectors.safe_hub

    const errorMsg = sels.errorMsg
    const mainHub = sels.testIdSelectors.main_hub
    const sendFunds = sels.testIdSelectors.send_funds_form
    const txTab = sels.testIdSelectors.transaction_tab
    const assetTab = sels.testIdSelectors.asset_tab
    const send_funds_modal = sels.xpSelectors.send_funds_modal
    const homepage = sels.xpSelectors.homepage
    const labels = sels.statusToLabel
    test.skip("Testing stuff - Playground", async(done) => {
    console.log("Testing stuff - Playground")
    try{
        await gFunc.assertElementPresent(mainHub.transactions_tab, gnosisPage, "css")
        await gFunc.clickElement(mainHub.transactions_tab, gnosisPage)
        await gnosisPage.waitFor(5000)
        await gnosisPage.$$eval('p', allElements => {
            allElements.forEach( element => { if(element.innerText === "Awaiting your confirmation") element.click()})
        })
        await gnosisPage.waitFor(500000)
    done()
    }
    catch (error){
    console.log(error)
    done()
    }
    }, 600000)
    test("Open the Send Funds Form", async (done) => {
        try {
            console.log("Open the Send Funds Form")
            await gFunc.clickSomething(homepage.close_rinkeby_notif, gnosisPage)
            await gFunc.clickElement(mainHub.main_send_btn, gnosisPage)
            await gFunc.clickElement(mainHub.modal_send_funds_btn, gnosisPage)
            await gFunc.assertElementPresent(sendFunds.review_btn_disabled, gnosisPage, "css")
            done()
        } catch (error) {
            console.log(error)
            done(error)
        }
    }, 60000)
    test("Filling the Form", async (done) => {
        try {
            console.log("Filling the Form")
            current_balance = await gFunc.getNumberInString(sendFunds.current_eth_balance, gnosisPage, "css")
            await gFunc.clickAndType(sendFunds.recipient_input, gnosisPage, sels.testAccountsHash.non_owner_acc, "css")
            await gFunc.openDropdown(sendFunds.select_token, gnosisPage, "css")
            await gFunc.clickElement(sendFunds.select_token_ether, gnosisPage)
            await gFunc.clickAndType(sendFunds.amount_input, gnosisPage, "0.5", "css")
            await gFunc.assertElementPresent(send_funds_modal.valid_amount_msg, gnosisPage)  
            await gnosisPage.waitFor(2000)
            await gFunc.clickElement(sendFunds.review_btn, gnosisPage)
            done()
        } catch (error) {
            console.log(error)
            done(error)
        }
    }, 15000)
    test("Approving the Tx with the owner 1", async (done) => {
        try {
            console.log("Approving the Tx with the owner 1")
            await gnosisPage.waitFor(3000)
            await gFunc.clickElement(sendFunds.submit_btn, gnosisPage)
            await gnosisPage.waitFor(3000)
            await metamask.sign()
            done()
        } catch (error) {
            console.log(error)
            done(error)
        }
    }, 90000)
    test("Rejecting with the 1st  owner", async (done) => {
        try {
            console.log("Rejecting with the 1st  owner")
            //await MMpage.waitFor(5000)
            await gnosisPage.bringToFront()
            await gFunc.assertElementPresent(txTab.tx_status("Awaiting confirmations"), gnosisPage, "css")
            await gFunc.clickElement(txTab.tx_status("Awaiting confirmations"), gnosisPage)
            await gFunc.assertElementPresent(txTab.confirmed_counter(1), gnosisPage, "css")
            await gFunc.assertElementPresent(txTab.reject_tx_btn, gnosisPage, "css")
            await gFunc.clickElement(txTab.reject_tx_btn, gnosisPage)
            await gnosisPage.waitForFunction(
                'document.querySelectorAll("body").innerText.includes("Reject Transaction")'
            );
            await gnosisPage.$$eval('span', allElements => {
                allElements.forEach( element => { if(element.innerText === "Reject Transaction") element.click()})
            })
            await gnosisPage.waitFor(2000)
            await metamask.sign()
            done()
        } catch (error) {
            console.log(error)
            done(error)
        }
    }, 90000)
    // test("Rejecting the Tx with the owner 2", async (done) => {
    //     console.log("Rejecting the Tx with the owner 2")
    //     try {
    //         await MMpage.waitFor(5000)
    //         await gnosisPage.bringToFront()
    //         await gFunc.assertElementPresent(safe_hub.rejected_counter(1), gnosisPage)
    //         await metamask.switchAccount(1) //currently in account4, changing to account 1
    //         await gnosisPage.waitFor(2000)
    //         await gnosisPage.bringToFront()
    //         await gFunc.clickSomething(safe_hub.reject_btn, gnosisPage)
    //         await gFunc.clickSomething(safe_hub.execute_reject_tx_btn, gnosisPage)
    //         await gnosisPage.waitFor(2000)
    //         await metamask.sign()
    //         done()
    //     } catch (error) {
    //         console.log(error)
    //         done(error)
    //     }
    // }, 90000)
    // test("Rejecting the Tx with the owner 3", async (done) => {
    //     console.log("Rejecting the Tx with the owner 3")
    //     try {
    //         await MMpage.waitFor(5000)
    //         await gnosisPage.bringToFront()
    //         await gFunc.assertElementPresent(safe_hub.rejected_counter(2), gnosisPage)
    //         await metamask.switchAccount(2)
    //         await gnosisPage.bringToFront()
    //         await gnosisPage.waitFor(5000)
    //         await gFunc.clickSomething(safe_hub.reject_btn, gnosisPage)
    //         await gFunc.clickSomething(safe_hub.execute_reject_tx_btn, gnosisPage)
    //         await gnosisPage.waitFor(2000)
    //         await metamask.confirmTransaction()
    //         done()
    //     } catch (error) {
    //         console.log(error)
    //         done(error)
    //     }
    // }, 90000)
    // test("Verifying Execution of the Tx", async (done) => {
    //     console.log("Verifying Execution of the Tx")
    //     try {
    //         await gnosisPage.bringToFront()
    //         await gFunc.assertAllElementPresent([
    //             safe_hub.executor_tag,
    //             safe_hub.executor_hash,
    //             safe_hub.rejected_counter(3),
    //             safe_hub.top_tx_cancelled_label
    //         ], gnosisPage)
    //         //await gFunc.assertElementPresent(safe_hub.top_tx_cancelled_label, gnosisPage)
    //         await gFunc.clickSomething(safe_hub.assets_tab, gnosisPage)
    //         await gnosisPage.waitFor(3000) //Numbers flicker for a bit when you enter in this tab
    //         const post_test_balance = await gFunc.getNumberInString(safe_hub.balance_ETH, gnosisPage)
    //         expect(post_test_balance).toBe(currentBalance)
    //         done()
    //     } catch (error) {
    //         console.log(error)
    //         done(error)
    //     }
    // }, 90000)
});