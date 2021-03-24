import { accountsSelectors } from './selectors/accounts'

const elementSelector = async (selector, page, type, timeout) => {
  /* handling Xpath and css selectors is different. Since many functions require
  to make this distinction this function was created to do it */
  try {
    if (type === 'Xpath') {
      return await page.waitForXPath(selector, { timeout })
    } else {
      return await page.waitForSelector(selector, { timeout })
    }
  } catch (error) {
    return 'Selector Not Found'
  }
}

/** Returns a list of elements that match a selector. If no element is found and empty array is returned */
const elementsSelector = async (selector, page, type, timeout) => {
  /* handling Xpath and css selectors is different. Since many functions require
  to make this distinction this function was created to do it */
  if (type === 'Xpath') {
    await page.waitForXPath(selector, { timeout })
    return await page.$x(selector)
  } else {
    await page.waitForSelector(selector, { timeout })
    return await page.$$(selector)
  }
}

export const clickElement = async function ({ selector, type = 'css' }, page) {
  const element = await elementSelector(selector, page, type, 60000)
  try {
    expect(element).not.toBe('Selector Not Found')
  } catch (error) {
    console.log('ClickElement Error: Empty element Selector = ', selector, '\n', error)
  }
  try {
    await element.click()
  } catch (error) {
    console.log("ClickElement Error: Couldn't click = ", selector, '\n', error)
  }
  return element
}

export const clickSomething = async function (selector, page, type = 'Xpath') {
  const element = await elementSelector(selector, page, type, 20000)
  try {
    expect(element).not.toBe('Selector Not Found')
  } catch (error) {
    console.log('ClickSomething Error: Empty element Selector = ', selector, '\n', error)
  }
  try {
    await page.evaluate(x => x.click(), element)
    // await element.click()
  } catch (error) {
    console.log("ClickSomething Error: Couldn't click = ", selector, '\n', error)
  }

  return element
}

export const openDropdown = async function ({ selector, type = 'Xpath' }, page) {
  const element = await elementSelector(selector, page, type, 60000)
  try {
    expect(element).not.toBe('Selector Not Found')
  } catch (error) {
    console.log('OpenDrowpdown Error: Empty element Selector = ', selector, '\n', error)
  }
  // await page.evaluate(x=>x.focus(), element)
  // page.keyboard.press('ArrowDown');
  await element.click()

  return element
}

export const clickAndType = async function ({ selector, type = 'Xpath' }, page, text = '') {
  if (type === 'Xpath') {
    const forTyping = await clickElement({ selector, type }, page)
    try {
      await forTyping.type(text)
    } catch (error) {
      console.log("ClickAndType Error: Couldn't type Xpath= ", selector, '\n', error)
    }
  } else {
    try {
      await page.type(selector, text)
    } catch (error) {
      console.log("ClickAndType Error: Couldn't type Css = ", selector, '\n', error)
    }
  }
}

export const clearInput = async function (selector, page, type = 'Xpath') {
  const field = await elementSelector(selector, page, type, 20000)
  await field.click({ clickCount: 3 })
  page.keyboard.press('Backspace')
}

export const assertElementPresent = async function (selector, page, type = 'Xpath') {
  const element = await elementSelector(selector, page, type, 90000)
  try {
    expect(element).not.toBe('Selector Not Found')
  } catch (error) {
    console.log('AssertElement Error: Empty element Selector = ', selector, '\n', error)
  }
  try {
    const expectHandler = expect(element)
    type !== 'Xpath' ? expectHandler.not.toBeNull() : expectHandler.toBeDefined() // for Css there is a different condition to make
    console.log('Found = ', selector, '\n')
    return element
  } catch (error) {
    console.log('AssertElementPresent Error: selector = ', selector, '\n', error)
    return element
  }
}

export const assertTextPresent = async function (selector, textPresent, page, type = 'Xpath') {
  const element = await assertElementPresent(selector, page, type)
  try {
    const elementText = await page.evaluate(x => x.innerText, element)
    expect(elementText).toMatch(textPresent)
  } catch (error) {
    console.log('AssertTextPresent Error: selector = ', selector, '\n', error)
  }
}

export const assertAllElementPresent = async function (selectors, page, type = 'Xpath') {
  for (let i = 0; i < selectors.length; i++) {
    expect(await assertElementPresent(selectors[i], page, type)).not.toBe('Selector Not Found')
  }
}

export const getInnerText = async function (selector, page, type = 'Xpath') {
  const element = await assertElementPresent(selector, page, type)
  try {
    let elementText = await page.evaluate(x => x.innerText, element)
    if (elementText === '') {
      elementText = await page.evaluate(x => x.value, element)
    }
    return elementText
  } catch (error) {
    console.log('getInnerText Error: Selector = ', selector, '\n', error)
    return `Error = ${element}`
  }
}

export const getNumberInString = async function (selector, page, type = 'Xpath') {
  const text = await getInnerText(selector, page, type)
  try {
    const number = text.match(/\d+.?\d+|\d+/)[0]
    return parseFloat(number)
  } catch (error) {
    console.log('getNumberInString Error: selector = ', selector)
    return `Error =  ${text}`
  }
}

export const selectorChildren = async function (selector, page, operation, index) {
  try {
    const handle = await elementSelector(selector, page, 'css', 5000)
    const elementChildren = await page.evaluateHandle((e, index) => { return e.childNodes[index] }, handle, index)
    const text = await page.evaluate(x => x.innerText, elementChildren)
    switch (operation) {
      case 'text':
        return text
      case 'number':
        return parseFloat(text.match(/\d+.?\d+|\d+/)[0])
      case 'assert':
        return 'Found'
      default:
        break
    }
  } catch (error) {
    console.log('Error = ', error)
    return 'Not Found'
  }
}

export const clickByText = async function (tag, text, page) {
  await page.$$eval(tag, (nodes, text) => {
    console.log('Found nodes: ', nodes)
    if (nodes.length > 0) {
      nodes.forEach(singleNode => { if (singleNode.innerText.toLocaleLowerCase() === text.toLocaleLowerCase()) singleNode.click() })
    } else {
      console.log('No nodes found')
    }
  }
  , text)
}

export const isTextPresent = async function (selector, text, page) {
  try {
    await page.waitForFunction(
      (selector, text) => document.querySelector(selector).innerText.includes(text), { timeout: 60000 }, selector, text
    )
  } catch (error) {
    console.log(`Text ${text} was not found`)
  }
}

// ------------------Stand alone functions
export const closeIntercom = async function (selector, page) {
  await page.waitForTimeout(3000)
  try {
    const frame = await page.frames().find(frame => frame.name() === 'intercom-note-frame')
    const button = await frame.$(selector)
    await button.click()
  } catch (error) {
    console.log('Could not close the intercom')
  }
}

export const importAccounts = async function (metamask) {
  console.log('<<Importing accounts>>')
  const keys = Object.keys(accountsSelectors.privateKeys)
  for (let i = 0; i < 1; i++) { // forEach doesnt work with async functions, you have to use a regular for()
    await metamask.importPK(accountsSelectors.privateKeys[keys[i]])
  }
}

export const amountOfElements = async (selector, page, type = 'Xpath') => {
  const elements = await elementsSelector(selector, page, type, 20000)
  return elements.length
}
