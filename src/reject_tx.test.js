import * as gFunc from '../utils/global_func'
import { sels } from '../utils/selectors'
import { initWithDefaultSafe } from '../utils/testSetup'

let browser
let metamask
let gnosisPage
let MMpage

beforeAll(async () => {
  [browser, metamask, gnosisPage, MMpage] = await initWithDefaultSafe(true)
}, 60000)

afterAll(async () => {
  await gnosisPage.waitFor(2000)
  await browser.close()
})

describe.skip('Reject Tx flow', () => {
  const safe_hub = sels.xpSelectors.safe_hub
  const send_funds_modal = sels.xpSelectors.send_funds_modal
  const homepage = sels.xpSelectors.homepage
  let currentBalance = 0.0
  test('Open the Send Funds Form', async (done) => {
    try {
      console.log('Open the Send Funds Form')
      currentBalance = await gFunc.getNumberInString(safe_hub.balance_ETH, gnosisPage)
      console.log('Current balance = ', currentBalance)
      try {
        await gFunc.clickSomething(homepage.close_rinkeby_notif, gnosisPage)
      } catch (error) {}
      await gnosisPage.waitFor(2000)
      await gFunc.clickSomething(safe_hub.send_btn, gnosisPage)
      await gFunc.clickSomething(safe_hub.send_funds_btn, gnosisPage)
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 60000)
  test('Filling the Form', async (done) => {
    try {
      console.log('Filling the Form')
      await gFunc.assertElementPresent(sels.cssSelectors.send_funds_recep, gnosisPage, 'css')
      await gFunc.clickAndType(sels.cssSelectors.send_funds_recep, gnosisPage, sels.testAccountsHash.non_owner_acc, 'css')
      await gFunc.clickSomething(send_funds_modal.token_selec, gnosisPage)
      await gFunc.clickSomething(send_funds_modal.ether_selection, gnosisPage)
      await gFunc.clearInput(send_funds_modal.amount_input, gnosisPage)
      await gFunc.clickAndType(send_funds_modal.amount_input, gnosisPage, '0.5')
      await gFunc.assertElementPresent(send_funds_modal.valid_amount_msg, gnosisPage)
      await gFunc.clickSomething(sels.cssSelectors.review_send_fund_btn, gnosisPage, 'css')
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 15000)
  test('Approving the Tx with the owner 1', async (done) => {
    try {
      console.log('Approving the Tx with the owner 1')
      await gnosisPage.waitFor(5000)
      await gFunc.clickSomething(send_funds_modal.submit_btn, gnosisPage)
      await gnosisPage.waitFor(2000)
      await metamask.sign()
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 90000)
  test('Rejecting with the 1st  owner', async (done) => {
    try {
      console.log('Rejecting with the 1st  owner')
      // await MMpage.waitFor(5000)
      await gnosisPage.bringToFront()
      await gFunc.clickSomething(safe_hub.awaiting_confirmations, gnosisPage)
      await gFunc.assertElementPresent(safe_hub.confirmed_counter(1), gnosisPage)
      await gFunc.clickSomething(safe_hub.reject_btn, gnosisPage)
      await gFunc.clickSomething(safe_hub.reject_tx_btn, gnosisPage)
      await gnosisPage.waitFor(2000)
      await metamask.sign()
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 90000)
  test('Rejecting the Tx with the owner 2', async (done) => {
    console.log('Rejecting the Tx with the owner 2')
    try {
      await MMpage.waitFor(5000)
      await gnosisPage.bringToFront()
      await gFunc.assertElementPresent(safe_hub.rejected_counter(1), gnosisPage)
      await metamask.switchAccount(1) // currently in account4, changing to account 1
      await gnosisPage.waitFor(2000)
      await gnosisPage.bringToFront()
      await gFunc.clickSomething(safe_hub.reject_btn, gnosisPage)
      await gFunc.clickSomething(safe_hub.execute_reject_tx_btn, gnosisPage)
      await gnosisPage.waitFor(2000)
      await metamask.sign()
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 90000)
  test('Rejecting the Tx with the owner 3', async (done) => {
    console.log('Rejecting the Tx with the owner 3')
    try {
      await MMpage.waitFor(5000)
      await gnosisPage.bringToFront()
      await gFunc.assertElementPresent(safe_hub.rejected_counter(2), gnosisPage)
      await metamask.switchAccount(2)
      await gnosisPage.bringToFront()
      await gnosisPage.waitFor(5000)
      await gFunc.clickSomething(safe_hub.reject_btn, gnosisPage)
      await gFunc.clickSomething(safe_hub.execute_reject_tx_btn, gnosisPage)
      await gnosisPage.waitFor(2000)
      await metamask.confirmTransaction()
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 90000)
  test('Verifying Execution of the Tx', async (done) => {
    console.log('Verifying Execution of the Tx')
    try {
      await gnosisPage.bringToFront()
      await gFunc.assertAllElementPresent([
        safe_hub.executor_tag,
        safe_hub.executor_hash,
        safe_hub.rejected_counter(3),
        safe_hub.top_tx_cancelled_label
      ], gnosisPage)
      // await gFunc.assertElementPresent(safe_hub.top_tx_cancelled_label, gnosisPage)
      await gFunc.clickSomething(safe_hub.assets_tab, gnosisPage)
      await gnosisPage.waitFor(3000) // Numbers flicker for a bit when you enter in this tab
      const post_test_balance = await gFunc.getNumberInString(safe_hub.balance_ETH, gnosisPage)
      expect(post_test_balance).toBe(currentBalance)
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 90000)
})
