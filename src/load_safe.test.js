import {
  assertElementPresent,
  assertTextPresent,
  clearInput,
  clickAndType,
  clickByText,
  clickElement,
  isTextPresent
} from '../utils/selectorsHelpers'
import { sels } from '../utils/selectors'
import { accountsSelectors } from '../utils/selectors/accounts'
import { loadSafeForm } from '../utils/selectors/loadSafeForm'
import { initWithWalletConnected } from '../utils/testSetup'

let browser
let metamask
let gnosisPage
let MMpage

beforeAll(async () => {
  [browser, metamask, gnosisPage, MMpage] = await initWithWalletConnected()
}, 60000)

afterAll(async () => {
  await gnosisPage.waitForTimeout(2000)
  await browser.close()
})

describe('Loading an Existing safe', () => {
  const mainHub = sels.testIdSelectors.main_hub

  test('Open Load Safe Form', async () => {
    console.log('Open Load Safe Form\n')
    await clickByText('p', 'Load existing Safe', gnosisPage)
    await assertElementPresent(loadSafeForm.form.selector, gnosisPage, 'css')
    await clickAndType(loadSafeForm.safe_name_field, gnosisPage, accountsSelectors.safeNames.load_safe_name)
    await assertTextPresent(loadSafeForm.valid_safe_name.selector, sels.assertions.valid_safe_name_field, gnosisPage)
    await clickAndType(loadSafeForm.safe_address_field, gnosisPage, accountsSelectors.testAccountsHash.safe1)
    await assertElementPresent(loadSafeForm.valid_address.selector, gnosisPage, 'css')
    await clickElement(loadSafeForm.submit_btn, gnosisPage)
  }, 60000)

  test('Load Safe Owner edition', async () => {
    console.log('Load Safe Owner edition\n')
    await assertElementPresent(loadSafeForm.step_two.selector, gnosisPage, 'css')
    await clearInput(loadSafeForm.owner_name(), gnosisPage, 'css')
    await clickAndType({ selector: loadSafeForm.owner_name(), type: 'css' }, gnosisPage, accountsSelectors.accountNames.owner_name)
    await clickElement(loadSafeForm.submit_btn, gnosisPage)
  }, 60000)

  test('Load safe Review Details', async () => {
    console.log('Load safe Review Details\n')
    await assertElementPresent(loadSafeForm.step_three.selector, gnosisPage, 'css')
    await assertTextPresent(loadSafeForm.review_safe_name.selector, accountsSelectors.safeNames.load_safe_name, gnosisPage, 'css')
    await assertTextPresent(loadSafeForm.review_owner_name.selector, accountsSelectors.accountNames.owner_name, gnosisPage, 'css')
    await gnosisPage.waitForTimeout(2000)
    await clickElement(loadSafeForm.submit_btn, gnosisPage)
    await assertElementPresent(mainHub.show_qr_btn, gnosisPage, 'css')
    await clickElement({ selector: mainHub.show_qr_btn }, gnosisPage)
    await isTextPresent(sels.xpSelectors.testIdSelectors.general.sidebar, accountsSelectors.safeNames.load_safe_name, gnosisPage)
    // await gFunc.assertAllElementPresent([
    //     mainHub.receiver_modal_safe_name,
    //     mainHub.receiver_modal_safe_address
    // ], gnosisPage, "css")
    // const safeName = await gFunc.getInnerText(mainHub.receiver_modal_safe_name, gnosisPage, "css")
    // const safeAddress = await gFunc.getInnerText(mainHub.receiver_modal_safe_address, gnosisPage, "css")
    // expect(safeName).toBe(accountsSelectors.safeNames.load_safe_name)
    // expect(safeAddress).toBe(accountsSelectors.testAccountsHash.safe1)
  }, 60000)
})
