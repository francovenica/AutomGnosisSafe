import { approveAndExecuteWithOwner } from '../utils/actions/approveAndExecuteWithOwner'
import * as gFunc from '../utils/selectorsHelpers'
import {
  assertElementPresent,
  assertTextPresent,
  clickByText,
  clickElement,
  getNumberInString,
  isTextPresent,
  openDropdown
} from '../utils/selectorsHelpers'
import { sels } from '../utils/selectors'
import { generalInterface } from '../utils/selectors/generalInterface'
import { sendFundsForm } from '../utils/selectors/sendFundsForm'
import { transactionsTab } from '../utils/selectors/transactionsTab'
import { settingsTabs } from '../utils/selectors/settings'

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

describe('Change Policies', () => {
  let transactionNonce = ''

  // let owner_amount = false //amount of owners, will be taken from the owners tab in the settings
  // let req_conf = false //current required confirmations. taken from the message in the policies tab
  // let max_req_conf = false //max required confirmations. taken from the message in the policies tab

  test('Open Modify form', async (done) => {
    console.log('Open Modify form')
    try {
      await gnosisPage.waitForTimeout(2000)
      await isTextPresent(generalInterface.sidebar, 'SETTINGS', gnosisPage)
      await clickByText('span', 'SETTINGS', gnosisPage)
      await isTextPresent('body', 'Safe Version', gnosisPage)
      await clickByText('p', 'Policies', gnosisPage)
      await isTextPresent('body', 'Required confirmations', gnosisPage)
      await isTextPresent('body', '2 out of 4 owners', gnosisPage)
      await clickByText('span', 'Change', gnosisPage)
      await isTextPresent('body', 'Change required confirmations', gnosisPage)
      done()
    } catch (error) {
      done(error)
    }
  }, 30000)
  test('Creating and approving Tx with owner 1', async (done) => {
    console.log('Set modification options and submit')
    try {
      await openDropdown(settingsTabs.req_conf_dropdown, gnosisPage)
      await clickElement({ selector: '[data-value="1"]' }, gnosisPage)
      await assertElementPresent(sendFundsForm.advanced_options.selector, gnosisPage, 'Xpath')
      await assertElementPresent(generalInterface.submit_btn.selector, gnosisPage, 'css')
      await gnosisPage.waitForFunction(selector => !document.querySelector(selector), {}, generalInterface.submit_tx_btn_disabled)
      await clickElement(generalInterface.submit_btn, gnosisPage)
      await gnosisPage.waitForTimeout(2000)
      await metamask.sign()
      done()
    } catch (error) {
      done(error)
    }
  }, 30000)
  test('Approving Tx with owner 2', async (done) => {
    console.log('Approve and execute with owner 2')
    try {
      await gnosisPage.bringToFront()
      await assertTextPresent(transactionsTab.tx_status, 'Awaiting confirmations', gnosisPage, 'css')
      transactionNonce = await getNumberInString('div.tx-nonce > p', gnosisPage, 'css')
      console.log('CurrentNonce = ', transactionNonce)
      // We approve and execute with account 1
      await approveAndExecuteWithOwner(1, gnosisPage, metamask)
      done()
    } catch (error) {
      done(error)
    }
  }, 60000)
  test('Verifying the change in the settings', async (done) => {
    console.log('Verifying the change in the settings')
    try {
      await gnosisPage.bringToFront()
      await gnosisPage.waitForTimeout(2000)
      console.log('Checking for the 2 out of 2')
      await assertTextPresent(transactionsTab.tx_status, 'Pending', gnosisPage, 'css')
      // waiting for the queue list to be empty and the executed tx to be on the history tab
      await assertElementPresent(transactionsTab.no_tx_in_queue, gnosisPage, 'css')
      await clickByText('button > span > p', 'History', gnosisPage)
      await gnosisPage.waitForTimeout(2000)
      // Wating for the new tx to show in the history, looking for the nonce
      const nonce = await getNumberInString(transactionsTab.tx_nonce, gnosisPage, 'css')
      expect(nonce).toBe(transactionNonce)
      await clickElement(transactionsTab.tx_type, gnosisPage)
      const changeConfirmationText = await gFunc.getInnerText('div.tx-details > p', gnosisPage, 'css')
      expect(changeConfirmationText).toBe('Change required confirmations:')
      const txDetails = await gFunc.getInnerText('div.tx-details', gnosisPage, 'css')
      console.log(txDetails)
      console.log('Confirmed the 2 out of 2')
      await isTextPresent(generalInterface.sidebar, 'SETTINGS', gnosisPage)
      await clickByText('span', 'SETTINGS', gnosisPage)
      await isTextPresent('body', 'Safe Version', gnosisPage)
      await clickByText('p', 'Policies', gnosisPage)
      await isTextPresent('body', 'Required confirmations', gnosisPage)
      await isTextPresent('body', '1 out of 4 owners', gnosisPage)
      done()
    } catch (error) {
      done(error)
    }
  }, 90000)
  test('Create Tx to revert it back to initial state', async (done) => {
    console.log('Create Tx to revert it back to initial state')
    try {
      await clickByText('span', 'Change', gnosisPage)
      await isTextPresent('body', 'Change required confirmations', gnosisPage)
      await openDropdown(settingsTabs.req_conf_dropdown, gnosisPage)
      await clickElement({ selector: '[data-value="2"]' }, gnosisPage)
      await assertElementPresent(sendFundsForm.advanced_options.selector, gnosisPage, 'Xpath')
      await assertElementPresent(generalInterface.submit_btn.selector, gnosisPage, 'css')
      await gnosisPage.waitForFunction(selector => !document.querySelector(selector), {}, generalInterface.submit_tx_btn_disabled)
      await clickElement(generalInterface.submit_btn, gnosisPage)
      await gnosisPage.waitForTimeout(2000)
      await metamask.confirmTransaction()
      done()
    } catch (error) {
      done(error)
    }
  }, 60000)
  test('Verifying the rollback', async (done) => {
    console.log('Verifying the rollback')
    try {
      await gnosisPage.bringToFront()
      await gnosisPage.waitForTimeout(2000)
      await clickByText('button > span > p', 'History', gnosisPage)
      // Wating for the tx execution notification, history should update after
      await isTextPresent('body', 'Transaction successfully executed', gnosisPage)
      const expectedNonce = transactionNonce + 1
      console.log('Waiting for tx with nonce: ', expectedNonce)
      await gnosisPage.waitForTimeout(1000)
      const nonce = await getNumberInString(transactionsTab.tx_nonce, gnosisPage, 'css')
      expect(nonce).toBe(expectedNonce)
      await isTextPresent(generalInterface.sidebar, 'SETTINGS', gnosisPage)
      await clickByText('span', 'SETTINGS', gnosisPage)
      await isTextPresent('body', 'Safe Version', gnosisPage)
      await clickByText('p', 'Policies', gnosisPage)
      await isTextPresent('body', 'Required confirmations', gnosisPage)
      await isTextPresent('body', '2 out of 4 owners', gnosisPage)
      done()
    } catch (error) {
      done(error)
    }
  }, 90000)
})
