import * as gFunc from '../selectorsHelpers'
import {
  assertElementPresent,
  clickByText,
  clickElement
} from '../selectorsHelpers'

import { generalInterface } from '../selectors/generalInterface'
import { sendFundsForm } from '../selectors/sendFundsForm'
import { transactionsTab } from '../selectors/transactionsTab'

export const approveAndExecuteWithOwner = async (owner, gnosisPage, metamask) => {
  await metamask.switchAccount(owner)
  await gnosisPage.bringToFront()
  await gnosisPage.waitForTimeout(3000)
  await gFunc.assertTextPresent(transactionsTab.tx2_status, 'Awaiting your confirmation', gnosisPage, 'css')
  await gFunc.assertTextPresent('div.tx-votes > div > p', '1 out of 2', gnosisPage, 'css')
  await clickElement({ selector: transactionsTab.tx_type }, gnosisPage)
  await gnosisPage.waitForTimeout(3000)
  await clickByText('button > span', 'Confirm', gnosisPage)
  await assertElementPresent(generalInterface.execute_checkbox, gnosisPage, 'css')
  await assertElementPresent(sendFundsForm.advanced_options.selector, gnosisPage, 'Xpath')
  await clickElement({ selector: generalInterface.approve_tx_btn }, gnosisPage)
  await gnosisPage.waitForTimeout(2000)
  await metamask.confirmTransaction()
}
