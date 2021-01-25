import * as gFunc from '../utils/global_func'
import { sels } from '../utils/selectors'
import { initWithWalletConnected } from '../utils/testSetup'
const { getDocument, queries, waitFor } = require('pptr-testing-library')

const { getByTestId, getByLabelText, getByText } = queries

let browser
let metamask
let gnosisPage
let MMpage

beforeAll(async () => {
  [browser, metamask, gnosisPage, MMpage] = await initWithWalletConnected()
}, 60000)

afterAll(async () => {
  await gnosisPage.waitFor(2000)
  await browser.close()
})

describe('Loading an Existing safe', () => {
  const loadSafe = sels.xpSelectors.load_safe
  const welcomePage = sels.testIdSelectors.welcome_page
  const loadPage = sels.testIdSelectors.load_safe_page
  const mainHub = sels.testIdSelectors.main_hub

  test('Open Load Safe Form', async () => {
    console.log('Open Load Safe Form\n')
    await gFunc.clickElement(welcomePage.load_safe_btn, gnosisPage)
    await gFunc.assertElementPresent(loadPage.form, gnosisPage, 'css')
    await gFunc.clickAndType(loadPage.safe_name_field, gnosisPage, sels.safeNames.load_safe_name, 'css')
    await gFunc.assertTextPresent(loadSafe.valid_safe_name, gnosisPage, sels.assertions.valid_safe_name_field)
    await gFunc.clickAndType(loadPage.safe_address_field, gnosisPage, sels.testAccountsHash.safe1, 'css')
    await gFunc.assertElementPresent(loadPage.valid_address, gnosisPage, 'css')
    await gFunc.clickElement(loadPage.submit_btn, gnosisPage)
  }, 60000)

  test('Load Safe Owner edition', async () => {
    console.log('Load Safe Owner edition\n')
    await gFunc.assertElementPresent(loadPage.step_two, gnosisPage, 'css')
    await gFunc.clearInput(loadPage.owner_name(), gnosisPage, 'css')
    await gFunc.clickAndType(loadPage.owner_name(), gnosisPage, sels.accountNames.owner_name, 'css')
    await gFunc.clickElement(loadPage.submit_btn, gnosisPage)
  }, 60000)

  test('Load safe Review Details', async () => {
    console.log('Load safe Review Details\n')
    await gFunc.assertElementPresent(loadPage.step_three, gnosisPage, 'css')
    await gFunc.assertTextPresent(loadPage.review_safe_name, gnosisPage, sels.safeNames.load_safe_name, 'css')
    await gFunc.assertTextPresent(loadPage.review_owner_name, gnosisPage, sels.accountNames.owner_name, 'css')
    await gnosisPage.waitFor(2000)
    await gFunc.clickElement(loadPage.submit_btn, gnosisPage)
    await gFunc.assertElementPresent(mainHub.show_qr_btn, gnosisPage, 'css')
    await gFunc.clickElement(mainHub.show_qr_btn, gnosisPage)
    const $name = await getByText(sels.safeNames.load_safe_name)
    console.log('$name type = ', typeof ($name))
    console.log('$name content = ', $name)

    // await gFunc.assertAllElementPresent([
    //     mainHub.receiver_modal_safe_name,
    //     mainHub.receiver_modal_safe_address
    // ], gnosisPage, "css")
    // const safeName = await gFunc.getInnerText(mainHub.receiver_modal_safe_name, gnosisPage, "css")
    // const safeAddress = await gFunc.getInnerText(mainHub.receiver_modal_safe_address, gnosisPage, "css")
    // expect(safeName).toBe(sels.safeNames.load_safe_name)
    // expect(safeAddress).toBe(sels.testAccountsHash.safe1)
  }, 60000)
})
