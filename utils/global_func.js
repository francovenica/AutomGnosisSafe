import {sels} from "./selectors"

export const TIME = {
  T60 : 60000,
  T30 : 30000,
  T15 : 15000,
  T10 : 10000,
  T6 : 6000,
  T2 : 2000,  
};


const elementSelector = async (selector, page, type) => {
  /*handling Xpath and Css selectors is different. Since may functions require 
  to make this distinction this function was created to do it*/
  if(type === "Xpath"){
    await page.waitForXPath(selector)
    const elementHandle = await page.$x(selector)
    return elementHandle[0]
  }
  else{
    await page.waitForSelector(selector)
    return page.$(selector)
  }
}

export const clickSomething = async function(selector, page, type="Xpath"){
  const element = await elementSelector(selector,page, type);
  await element.click()
  return element;
};

export const clickAndType = async function (selector, page, text="", type="Xpath"){
  if(type==="Xpath"){
    let forTyping= await clickSomething(selector, page, type);
    await forTyping.type(text)
  }
  else{
    await page.type(selector,text)
  }
}

export const clearInput = async function(selector, page, type="Xpath"){
  const field = await elementSelector(selector, page, type);
  await field.click({clickCount:3})
  page.keyboard.press('Backspace');
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

export const assertTextPresent = async function (selector, page, textPresent){
  await page.waitForXPath(selector)
  const [connected] = await page.$x(selector)
  const is_connected = await page.evaluate(x=>x.textContent, connected)
  expect(is_connected).toMatch(textPresent)
};

export const assertElementPresent = async function (selector, page, type="Xpath"){
  const connected = await elementSelector(selector,page,type)
  const expectHandler = expect(connected)

  if (type === "Xpath") {
    expectHandler.toBeDefined()
  } else {
    expectHandler.not.toBeNull()
  }
};

export const closeIntercom = async function (selector, page){
  await page.waitFor(3000)
  const frame = await page.frames().find(frame => frame.name() === 'intercom-note-frame');
  const button = await frame.$(selector);
  await button.click()
}

export const getInnerText = async function (selector, page, valueType="string", type="Xpath"){
  assertElementPresent(selector,page);
  const [element] = await page.$x(selector) 
  const elementText = await page.evaluate(x=>x.innerText, element)
  if(valueType==="int")
    return parseInt(elementText)
  else
    return elementText
}