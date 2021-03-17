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

describe('Loading an Existing safe', () => {
  test('Open Load Safe Form', async () => {
    console.log('Open Load Safe Form\n')

    await gnosisPage.waitForTimeout(590000)
  }, 600000)
})
