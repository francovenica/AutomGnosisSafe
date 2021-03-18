import { approveAndExecuteWithOwner } from '../utils/actions/approveAndExecuteWithOwner'
import * as gFunc from '../utils/selectorsHelpers'
import {
  assertElementPresent,
  clearInput,
  clickAndType,
  clickByText,
  clickElement,
  openDropdown
} from '../utils/selectorsHelpers'
import { sels } from '../utils/selectors'
import { accountsSelectors } from '../utils/selectors/accounts'
import { sendFundsForm } from '../utils/selectors/sendFundsForm'
import { transactionsTab } from '../utils/selectors/transactionsTab'
import { initWithDefaultSafeDirectNavigation } from '../utils/testSetup'

let browser
let metamask
let gnosisPage
let MMpage

const TOKEN_AMOUNT = 0.01

beforeAll(async () => {
  [browser, metamask, gnosisPage, MMpage] = await initWithDefaultSafeDirectNavigation(true)
}, 60000)

afterAll(async () => {
  await gnosisPage.waitForTimeout(2000)
  await browser.close()
})

describe('Send funds and sign with two owners', () => {
  const errorMsg = sels.errorMsg
  const mainHub = sels.testIdSelectors.main_hub
  const assetTab = sels.testIdSelectors.asset_tab

  let currentEthFunds = ''
  let currentEthFundsOnText = ''
  let currentNonce = ''

  test('Open the send funds form', async (done) => {
    console.log('Open the Send Funds Form\n')
    try {
      currentEthFundsOnText = await gFunc.getInnerText(assetTab.balance_value('eth'), gnosisPage, 'css')
      currentEthFunds = parseFloat((await gFunc.getNumberInString(assetTab.balance_value('eth'), gnosisPage, 'css')).toFixed(3))
      // await assertElementPresent(mainHub.new_transaction_btn, gnosisPage, "css")
      // await clickElement({ selector: mainHub.new_transaction_btn }, gnosisPage)
      await clickByText('button', 'New Transaction', gnosisPage)
      await clickElement({ selector: mainHub.modal_send_funds_btn }, gnosisPage)
      await assertElementPresent(sendFundsForm.review_btn_disabled.selector, gnosisPage, 'css')
      await gnosisPage.waitForTimeout(3000)
      done()
    } catch (error) {
      console.log(error)
      done()
    }
  }, 50000)

  test('Fill the form and check error messages when inpus are wrong', async (done) => {
    console.log('Filling the Form\n')
    try {
      await clickAndType(sendFundsForm.recipient_input, gnosisPage, accountsSelectors.testAccountsHash.non_owner_acc)

      await openDropdown(sendFundsForm.select_token, gnosisPage)
      await clickElement(sendFundsForm.select_token_ether, gnosisPage)

      await gnosisPage.waitForTimeout(1000)

      // Checking that 0 amount triggers an error
      await clickAndType(sendFundsForm.amount_input, gnosisPage, '0')
      await assertElementPresent(errorMsg.error(errorMsg.greater_than_0), gnosisPage)
      await clearInput(sendFundsForm.amount_input.selector, gnosisPage, 'css')

      // Checking that any string returns an error
      await clickAndType(sendFundsForm.amount_input, gnosisPage, 'abc')
      await assertElementPresent(errorMsg.error(errorMsg.not_a_number), gnosisPage)
      await clearInput(sendFundsForm.amount_input.selector, gnosisPage, 'css')

      // Checking that an amount over balance triggers an error
      await clickAndType(sendFundsForm.amount_input, gnosisPage, '99999')
      await assertElementPresent(errorMsg.error(errorMsg.max_amount_tokens(currentEthFunds)), gnosisPage)
      await clearInput(sendFundsForm.amount_input.selector, gnosisPage, 'css')

      // Checking that the value set by the "Send max" button is the same as the current balance
      await clickElement(sendFundsForm.send_max_btn, gnosisPage)
      const maxInputValue = await gFunc.getNumberInString(sendFundsForm.amount_input.selector, gnosisPage, 'css')
      expect(parseFloat(maxInputValue)).toBe(currentEthFunds)
      await clearInput(sendFundsForm.amount_input.selector, gnosisPage, 'css')

      await clickAndType(sendFundsForm.amount_input, gnosisPage, TOKEN_AMOUNT.toString())
      await assertElementPresent(sendFundsForm.valid_amount_msg.selector, gnosisPage)
      await clickElement(sendFundsForm.review_btn, gnosisPage)
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 15000)

  test('Review information is correct and submit transaction with signature', async (done) => {
    console.log('Review Info and submit')
    try {
      await gFunc.assertAllElementPresent([
        sendFundsForm.send_funds_review.selector,
        sendFundsForm.recipient_address_review.selector
      ], gnosisPage, 'css')
      const recipientHash = await gFunc.getInnerText(sendFundsForm.recipient_address_review.selector, gnosisPage, 'css')
      expect(recipientHash).toMatch(accountsSelectors.testAccountsHash.non_owner_acc)
      const tokenAmount = await gFunc.getInnerText(sendFundsForm.amount_eth_review.selector, gnosisPage, 'css')
      expect(tokenAmount).toMatch(TOKEN_AMOUNT.toString())

      await assertElementPresent(sendFundsForm.advanced_options.selector, gnosisPage, 'Xpath')
      await assertElementPresent(sendFundsForm.submit_btn.selector, gnosisPage, 'css')
      await clickElement(sendFundsForm.submit_btn, gnosisPage)

      await gnosisPage.waitForTimeout(4000)
      await metamask.sign()
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 15000)

  test('Approving and executing the transaction with owner 2', async (done) => {
    console.log('Approving the Tx with the owner 2')
    try {
      await gnosisPage.bringToFront()
      await gFunc.assertTextPresent(transactionsTab.tx2_status, 'Awaiting confirmations', gnosisPage, 'css')
      currentNonce = await gFunc.getNumberInString('div.tx-nonce > p', gnosisPage, 'css')
      console.log('CurrentNonce = ', currentNonce)
      // We approve and execute with account 1
      await approveAndExecuteWithOwner(1, gnosisPage, metamask)
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 90000)

  test('Check that transaction was successfully executed', async (done) => {
    console.log('Verifying Execution of the Tx')
    try {
      await gnosisPage.bringToFront()
      await gnosisPage.waitForTimeout(2000)
      await gFunc.assertTextPresent(transactionsTab.tx2_status, 'Pending', gnosisPage, 'css')
      // waiting for the queue list to be empty and the executed tx to be on the history tab
      await gFunc.assertElementPresent(transactionsTab.no_tx_in_queue, gnosisPage, 'css')
      await clickByText('button > span > p', 'History', gnosisPage)
      // Wating for the new tx to show in the history, looking for the nonce
      const nonce = await gFunc.getNumberInString(transactionsTab.tx_nonce, gnosisPage, 'css')
      expect(nonce).toBe(currentNonce)
      const sentAmount = await gFunc.selectorChildren(transactionsTab.tx_info, gnosisPage, 'number', 0)
      expect(sentAmount).toBe(TOKEN_AMOUNT)
      await clickElement({ selector: transactionsTab.tx_type }, gnosisPage)
      const recipientAddress = await gFunc.getInnerText('div.tx-details > div p', gnosisPage, 'css')
      // regex to match an address hash
      expect(recipientAddress.match(/(0x[a-fA-F0-9]+)/)[0]).toMatch(accountsSelectors.testAccountsHash.non_owner_acc)
      await clickByText('span', 'ASSETS', gnosisPage)
      await assertElementPresent(assetTab.balance_value('eth'), gnosisPage, 'css')
      const array = ['[data-testid="balance-ETH"]', currentEthFundsOnText]
      // check every 100ms an update in the ETH funds in the assets tab
      await gnosisPage.waitForFunction((array) => {
        return document.querySelector(array[0]).innerText !== array[1]
      }, { polling: 100 }, array)
      const newEthFunds = await gFunc.getNumberInString(assetTab.balance_value('eth'), gnosisPage, 'css')
      expect(parseFloat(newEthFunds.toFixed(3))).toBe(parseFloat((currentEthFunds - TOKEN_AMOUNT).toFixed(3)))

      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  }, 90000)
})
