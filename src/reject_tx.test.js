import * as gFunc from '../utils/selectorsHelpers'
import {
  assertElementPresent,
  clickAndType,
  clickByText,
  clickElement,
  openDropdown
} from '../utils/selectorsHelpers'
import { sels } from '../utils/selectors'
import { sendFundsForm } from '../utils/selectors/sendFundsForm'
import { transactionsTab } from '../utils/selectors/transactionsTab'
import { initWithDefaultSafeDirectNavigation } from '../utils/testSetup'

let browser
let metamask
let gnosisPage
let MMpage

beforeAll(async () => {
  [browser, metamask, gnosisPage, MMpage] = await initWithDefaultSafeDirectNavigation(true)
}, 60000)

afterAll(async () => {
  await gnosisPage.waitForTimeout(2000)
  await browser.close()
})

describe('Reject Tx flow', () => {
  let startBalance = 0.0

  const mainHub = sels.testIdSelectors.main_hub
  const assetTab = sels.testIdSelectors.asset_tab
  const labels = sels.statusToLabel

  test('Open the Send Funds Form', async (done) => {
    try {
      console.log('Open the Send Funds Form')
      await assertElementPresent(assetTab.balance_value('eth'), gnosisPage, 'css')
      startBalance = await gFunc.getNumberInString(assetTab.balance_value('eth'), gnosisPage, 'css')
      await clickByText('button', 'New Transaction', gnosisPage)
      await clickElement({ selector: mainHub.modal_send_funds_btn }, gnosisPage)
      await assertElementPresent(sendFundsForm.review_btn_disabled.selector, gnosisPage, 'css')
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 60000)

  test('Filling the Form', async (done) => {
    try {
      console.log('Filling the Form')
      await clickAndType(sendFundsForm.recipient_input, gnosisPage, sels.testAccountsHash.non_owner_acc)
      await openDropdown(sendFundsForm.select_token, gnosisPage)
      await clickElement(sendFundsForm.select_token_ether, gnosisPage)
      await clickAndType(sendFundsForm.amount_input, gnosisPage, '0.5')
      await assertElementPresent(sendFundsForm.valid_amount_msg.selector, gnosisPage)
      await gnosisPage.waitForTimeout(2000)
      await clickElement(sendFundsForm.review_btn, gnosisPage)
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 15000)

  test('Approving the Tx with the owner 1', async (done) => {
    try {
      console.log('Approving the Tx with the owner 1')
      await assertElementPresent(sendFundsForm.submit_btn.selector, gnosisPage, 'css')
      await clickElement(sendFundsForm.submit_btn, gnosisPage)

      await gnosisPage.waitForTimeout(4000)
      await metamask.sign()
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 60000)

  test('Rejecting with the 1st owner', async (done) => {
    try {
      console.log('Rejecting with the 1st owner')
      await gnosisPage.bringToFront()
      await gFunc.assertTextPresent(transactionsTab.tx2_status, 'Awaiting confirmations', gnosisPage, 'css')
      await gFunc.assertTextPresent('div > p', 'NEXT TRANSACTION', gnosisPage, 'css')
      await clickElement({ selector: transactionsTab.tx_type }, gnosisPage)
      await gnosisPage.waitForTimeout(3000)
      await clickByText('button > span', 'Cancel', gnosisPage)

      // Can't click an element by the label because notifications block the click
      // await gFunc.clickElement({ selector: transactionsTab.tx_status(labels.awaiting_confirmations) }, gnosisPage)
      // await gFunc.assertElementPresent(transactionsTab.confirmed_counter(1), gnosisPage, 'css')
      // await gFunc.assertElementPresent(transactionsTab.reject_tx_btn, gnosisPage, 'css')
      // await gFunc.clickElement({ selector: transactionsTab.reject_tx_btn }, gnosisPage)

      // making sure that a "Reject Transaction" text exist in the page first
      await gnosisPage.waitForFunction(() =>
        document.querySelector('body').innerText.includes('Reject Transaction')
      )

      await assertElementPresent(sendFundsForm.advanced_options.selector, gnosisPage, 'Xpath')
      await clickByText('button', 'Reject Transaction', gnosisPage)

      await gnosisPage.waitForTimeout(4000)
      await metamask.sign()
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 60000)

  test('Rejecting the Tx with the owner 2', async (done) => {
    console.log('Rejecting the Tx with the owner 2')
    try {
      await gnosisPage.bringToFront()
      await gnosisPage.waitForFunction(() =>
        document.querySelector('body').innerText.includes('Cancelling transaction'))
      await metamask.switchAccount(1) // changing to account 1
      await gnosisPage.waitForTimeout(2000)
      await gnosisPage.bringToFront()
      // await gFunc.assertElementPresent(txtransactionsTabTab.reject_tx_btn, gnosisPage, 'css')
      await gnosisPage.waitForTimeout(2000)
      await clickByText(transactionsTab.tx_type, 'Cancelling transaction', gnosisPage)
      await gnosisPage.waitForTimeout(1000)
      await clickByText('button > span', 'Confirm', gnosisPage)
      await gnosisPage.waitForFunction(() =>
        document.querySelector('body').innerText.includes('Approve Transaction')
      )

      await assertElementPresent(sendFundsForm.advanced_options.selector, gnosisPage, 'Xpath')

      await clickByText('button', 'Approve Transaction', gnosisPage)

      await gnosisPage.waitForTimeout(4000)
      await metamask.confirmTransaction()
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 60000)

  test('Verifying Execution of the Tx', async (done) => {
    console.log('Verifying Execution of the Tx')
    try {
      await gnosisPage.bringToFront()
      await gFunc.assertTextPresent(transactionsTab.tx2_status, 'Pending', gnosisPage, 'css')
      // waiting for the queue list to be empty and the executed tx to be on the history tab
      await gFunc.assertElementPresent("[alt='No Transactions yet']", gnosisPage, 'css')
      await clickByText('button > span > p', 'History', gnosisPage)
      await gnosisPage.waitForTimeout(4000)
      // await assertElementPresent(transactionsTab.rejected_counter(2), gnosisPage, 'css')
      // await gnosisPage.waitForFunction(() =>
      //   document.querySelector('table[class^=MuiTable-root]').innerText.includes('Executor')
      // )
      await clickByText('span', 'ASSETS', gnosisPage)
      await assertElementPresent(assetTab.balance_value('eth'), gnosisPage, 'css')
      // await gnosisPage.waitForTimeout(4000) // Numbers flicker for a bit when you enter in this tab
      const finalBalance = await gFunc.getNumberInString(assetTab.balance_value('eth'), gnosisPage, 'css')

      // Balance should not have changed
      expect(finalBalance).toBe(startBalance)
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 30000)
})
