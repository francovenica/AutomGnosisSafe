import {sels} from "./selectors"

const elementSelector = async (selector, page, type) => {
  /*handling Xpath and Css selectors is different. Since may functions require 
  to make this distinction this function was created to do it*/
  try{
    if(type === "Xpath"){
      await page.waitForXPath(selector, {timeout:60000})
      const elementHandle = await page.$x(selector)
      return elementHandle[0]
    }
    else{
      await page.waitForSelector(selector, {timeout:60000})
      return await page.$(selector)
    }
  }
  catch(e){
    return {}
  }
}

export const clickSomething = async function(selector, page, type="Xpath"){
  const element = await elementSelector(selector, page, type);
  try {
    expect(element).not.toBe({})
  } catch (error) {
    console.trace("Error in clickSomething Selector = ", selector)
  }
  try {
    await page.evaluate(x=>x.style.outline = '3px solid red', element)
    await element.click()
    await page.evaluate(x=>x.style.outline = '', element)
  } catch (error) {
    console.trace("Couldn't click = ", error, "\n\n")
  }
  return element;
};

export const clickAndType = async function (selector, page, text="", type="Xpath"){
  if(type === "Xpath"){
    let forTyping= await clickSomething(selector, page, type);
    try {
      await page.evaluate(x=>x.style.outline = '3px solid red', forTyping)
      await forTyping.type(text)
      await page.evaluate(x=>x.style.outline = "", forTyping)
    } catch (error) {
      console.log("Couldn't type = ", forTyping, "\n\n")
    }
  }
  else{
    try {
      await page.$eval(selector, x=>x.style.outline = '3px solid red')
      await page.type(selector,text)
      await page.$eval(selector, x=>x.style.outline = "")
    } catch (error) {
      console.log("Couldn't type = ", forTyping, "\n\n")
    }
  }
}

export const clearInput = async function(selector, page, type="Xpath"){
  const field = await elementSelector(selector, page, type);
  await page.evaluate(x=>x.style.outline = '3px solid red', field)
  await field.click({clickCount:3})
  page.keyboard.press('Backspace');
  await page.evaluate(x=>x.style.outline = "", field)
}

export const assertElementPresent = async function (selector, page, type="Xpath"){
  const connected = await elementSelector(selector, page, type)
  try {
    await page.evaluate(x=>x.style.outline = '3px solid red', connected)
    const expectHandler = expect(connected)
    type !="Xpath" ? expectHandler.not.toBeNull() : expectHandler.toBeDefined() //for Css there is a different condition to make
    await page.evaluate(x=>x.style.outline = "", connected)
    return connected
  } catch (error) {
    console.log("error in AssertElement. Could not evaluate = ", selector)
    return connected
  }
};

export const assertTextPresent = async function (selector, page, textPresent, type="Xpath"){
  const element = await assertElementPresent(selector,page, type != "Xpath"? type : "Xpath")
  try {
    await page.evaluate(x=>x.style.outline = '3px solid red', element)
    const elementText = await page.evaluate(x=>x.innerText, element)
    expect(elementText).toMatch(textPresent)
    await page.evaluate(x=>x.style.outline = "", element)
  } catch (error) {
    console.log("Could not assertTextPresent = ", selector, "\nError = ", error)
  }
};

export const assertAllElementPresent = async function (selectors, page, type = "Xpath"){
  for (let i = 0 ; i < selectors.length ; i++) {
    expect(await assertElementPresent (selectors[i], page, type)).not.toBe({})
  }
};

export const getInnerText = async function (selector, page, type="Xpath"){
  const element = await assertElementPresent(selector,page, type != "Xpath"? type : "Xpath")
  try {
    const elementText = await page.evaluate(x=>x.innerText, element)
    return elementText
  } catch (error) {
    console.log("Could not get the inner text of = ", element)
    return `Error = ${element}`
  }
}

export const getNumberInString = async function(selector, page, numtype = "int", type ="Xpath"){
  const text = await getInnerText(selector, page, type)
  try {
    const number = text.match(/\d+.?\d+|\d+/)[0]
    return parseFloat(number)
  } catch (error) {
    console.log("Could not parse the number in = ", text)
    return `Error =  ${element}`
  }
}

//------------------Stand alone functions
export const closeIntercom = async function (selector, page){
  await page.waitFor(3000)
  try {
    const frame = await page.frames().find(frame => frame.name() === 'intercom-note-frame');
    const button = await frame.$(selector);
    await button.click()
  } catch (error) {
    console.log("Could not close the intercom")
  }
}

export const importAccounts = async function(metamask){
  console.log("<<Importing accounts>>")
  const keys = Object.keys(sels.privateKeys)
  for(let i = 0; i < keys.length; i++) { //forEach doesnt work with async functions, you have to use a regular for()
    await metamask.importPK(sels.privateKeys[keys[i]])
  }
};