import {sels} from "./selectors"

const elementSelector = async (selector, page, type) => {
  /*handling Xpath and Css selectors is different. Since may functions require 
  to make this distinction this function was created to do it*/
  try{
    if(type === "Xpath"){
      await page.waitForXPath(selector)
      const elementHandle = await page.$x(selector)
      return elementHandle[0]
    }
    else{
      await page.waitForSelector(selector)
      return await page.$(selector)
    }
  }
  catch(e){
    console.log("Selector = ", selector, " \nElement = ", element, "\nError = ", error)
    return {}
  }
}

export const clickSomething = async function(selector, page, type="Xpath"){
  const element = await elementSelector(selector, page, type);
  try {
    expect(element).not.toBe({})
  } catch (error) {
    console.log("Selector = ", selector, " \nElement = ", element, "\nError = ", error)
  }
  // await page.evaluate(x=>x.style.border = '3px solid red', element)
  await element.click()
  // await page.evaluate(x=>x.style.border = "", element)
  return element;
};

export const clickAndType = async function (selector, page, text="", type="Xpath"){
  if(type === "Xpath"){
    let forTyping= await clickSomething(selector, page, type);
    // await page.evaluate(x=>x.style.border = '3px solid red', forTyping)
    await forTyping.type(text)
    // await page.evaluate(x=>x.style.border = "", forTyping)
  }
  else{
    // await page.$eval(selector, x=>x.style.border = '3px solid red')
    await page.type(selector,text)
    // await page.$eval(selector, x=>x.style.border = "")
  }
}

export const clearInput = async function(selector, page, type="Xpath"){
  const field = await elementSelector(selector, page, type);
  // await page.evaluate(x=>x.style.border = '3px solid red', field)
  await field.click({clickCount:3})
  page.keyboard.press('Backspace');
  // await page.evaluate(x=>x.style.border = "", field)
}

export const importAccounts = async function(metamask, importAcc){
  if(importAcc === "impacc"){
      console.log("<<Importing accounts>>")
    const keys = Object.keys(sels.privateKeys)
    for(let i = 0; i < keys.length; i++) { //forEach doesnt work with async functions, you have to use a regular for()
      await metamask.importPK(sels.privateKeys[keys[i]])
    }
  }
};

export const assertTextPresent = async function (selector, page, textPresent, type="Xpath"){
  const element = await assertElementPresent(selector,page, type != "Xpath"? type : "Xpath")
  // await page.evaluate(x=>x.style.border = '3px solid red', element)
  const elementText = await page.evaluate(x=>x.innerText, element)
  //const elementText = await page.evaluate(type === "Xpath"? x=>x.textContent : x=>x.innerText, element)
  expect(elementText).toMatch(textPresent)
  // await page.evaluate(x=>x.style.border = "", element)
  // await page.waitForXPath(selector)
  // const [connected] = await page.$x(selector)
  // const is_connected = await page.evaluate(x=>x.textContent, connected)
  // expect(is_connected).toMatch(textPresent)
};

export const assertElementPresent = async function (selector, page, type="Xpath"){
  const connected = await elementSelector(selector, page, type)
  // await page.evaluate(x=>x.style.border = '3px solid red', connected)
  const expectHandler = expect(connected)
  type !="Xpath" ? expectHandler.not.toBeNull() : expectHandler.toBeDefined() //for Css there is a different condition to make
  // await page.evaluate(x=>x.style.border = "", connected)
  return connected
};

export const assertAllElementPresent = async function (selectors, page, type = "Xpath"){
  for (let i = 0 ; i < selectors.length ; i++) {
    expect(await assertElementPresent (selectors[i], page, type)).not.toBe({})
  }
};

export const closeIntercom = async function (selector, page){
  await page.waitFor(3000)
  const frame = await page.frames().find(frame => frame.name() === 'intercom-note-frame');
  const button = await frame.$(selector);
  await button.click()
}

export const getInnerText = async function (selector, page, valueType="string", type="Xpath"){
  const element = await assertElementPresent(selector,page, type != "Xpath"? type : "Xpath")
  const elementText = await page.evaluate(type != "Xpath"? x=>x.innerText : x=>x.textContent, element)
  return valueType !="string"? parseInt(elementText) : elementText
}

export const getNumberInString = async function(selector, page, numtype = "int", type ="Xpath"){
  const text = await getInnerText(selector, page, "string", type)
  const number = text.match(/\d+.?\d+|\d+/)[0]
  return parseFloat(number)
}