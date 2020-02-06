import {sels} from "./selectors"

global.TIME = {
  "MAX" : "30000",
  "MID" : "10000",
  "MIN" : "6000",
  "MICRO" : "2000",  
};

export const clickSomething = async function(selector, page, type="Xpath")
{
  if(type === "Xpath"){
    await page.waitForXPath(selector)
    const element = await page.$x(selector);
    await element[0].click()
  }
  else{
    await page.waitForSelector(selector)
    const element = await page.$(selector)
    await element.click()
  }
};

export const clickAndType = async function (selector, page, text="", type="Xpath"){
  let forTyping=null;

  if(type === "Xpath"){
    const element = await page.$x(selector);
    await element[0].click();
    forTyping = element[0];
  }
  else{
    const element = await page.$(selector);
    await element.click();
    forTyping = element;
  }

  if(text != ""){
    if(type==="Xpath"){
      await forTyping.type(text)
    }
    else{
      await page.type(selector,text)
    }
  }
}

export const clearInput = async function(selector, page, type="Xpath"){
  let field;
  if(type === "Xpath"){
    await page.waitForXPath(selector)  
    field = await page.$x(selector)
    await field[0].click({clickCount:3})
  }
  else{
    field = await page.$(selector)
    await field.click({clickCount: 3})
  }
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
  const connected = await page.$x(selector)
  const is_connected = await page.evaluate(x=>x.textContent, connected[0])
  expect(is_connected).toMatch(textPresent)
};

export const assertElementPresent = async function (selector, page, type="Xpath"){
  if (type ==="Xpath"){
    await page.waitForXPath(selector)
    const connected = await page.$x(selector)
    expect(connected[0]).toBeDefined()
  }
  else{
    await page.waitForSelector(selector)
    const connected = await page.$(selector)
    expect(connected).not.toBe(null)
  }
};

export const closeIntercom = async function (selector, page){
  await page.waitFor(2000)
  const frame = await page.frames().find(frame => frame.name() === 'intercom-note-frame');
  const button = await frame.$(selector);
  await button.click()
}