const puppeteer = require('puppeteer')
const { getDocument, queries, waitFor } = require('pptr-testing-library')

const { getByTestId, getByLabelText, getByText } = queries

test.skip('Test name', async (done) => {
  console.log('Test name')
  try {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto('https://example.com', { waitUntil: 'networkidle2' })
    console.log('Done loading')
    await page.waitFor(2000)

    const $document = await getDocument(page)
    const button = await getByText($document, 'More information...')
    console.log('button = ', button)
    button.click()
    // const handle = await page.evaluate(() => {
    //     [...document.querySelectorAll('a')].find(element => element.textContent === 'More information...').click();
    // });
    // await page.$$eval('a', selectorMatched => {
    //     for(i in selectorMatched)
    //       if(selectorMatched[i].textContent === 'More information...'){
    //           selectorMatched[i].click();
    //           break;//Remove this line (break statement) if you want to click on all matched elements otherwise the first element only is clicked
    //         }
    //     });
    // const ts = await page.$$eval("p", selectors => {return selectors})
    // console.log('length = ', ts.length)
    // console.log('ts0 = ', ts)
    await page.waitFor(5000)
    done()
  } catch (error) {
    console.log(error)
    done()
  }
}, 60000)
