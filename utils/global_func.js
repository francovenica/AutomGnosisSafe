import {sels} from "./selectors"

//$$(".MuiCollapse-container").forEach((element) => element.remove())
//console.log(await gnosisPage.$$eval(loadPage.owner_row, x=>x.length)) Count amount of elements with the same selector
//await page.evaluate(x=>x.style.outline = '3px solid red', element)
//await page.evaluate(x=>x.style.outline = '', element)

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
  catch(error){
    return "Selector Not Found"
  }
}

export const clickElement = async function(selector, page, type="css"){
  const element = await elementSelector(selector, page, type);
  try {
    expect(element).not.toBe("Selector Not Found")
  } catch (error) {
    console.log("ClickSomething Error: Empty element Selector = ", selector, "\n", error)
  }
  try {
    await element.click()
  } catch (error) {
    console.log("ClickSomething Error: Couldn't click = ", selector, "\n", error)
  }
  return element;
};

export const clickSomething = async function(selector, page, type="Xpath"){
  const element = await elementSelector(selector, page, type);
  try {
    expect(element).not.toBe("Selector Not Found")
  } catch (error) {
    console.log("ClickSomething Error: Empty element Selector = ", selector, "\n", error)
  }
  try {
    await page.evaluate(x=>x.click(), element)
    //await element.click()
  } catch (error) {
    console.log("ClickSomething Error: Couldn't click = ", selector, "\n", error)
  }
  
  return element;
};

export const openDropdown = async function(selector, page, type="Xpath"){
  const element = await elementSelector(selector, page, type);
  try {
    expect(element).not.toBe("Selector Not Found")
  } catch (error) {
    console.log("OpenDrowpdown Error: Empty element Selector = ", selector, "\n", error)
  }
  //await page.evaluate(x=>x.focus(), element)
  //page.keyboard.press('ArrowDown');
  await element.click()
  
  return element;
};

export const clickAndType = async function (selector, page, text="", type="Xpath"){
  if(type === "Xpath"){
    let forTyping= await clickSomething(selector, page, type);
    try {
      await forTyping.type(text)
    } catch (error) {
      console.log("ClickAndType Error: Couldn't type Xpath= ", selector, "\n", error)
    }
  }
  else{
    try {
      await page.type(selector, text)
    } catch (error) {
      console.log("ClickAndType Error: Couldn't type Css = ", selector, "\n", error)
    }
  }
}

export const clearInput = async function(selector, page, type="Xpath"){
  const field = await elementSelector(selector, page, type);
  await field.click({clickCount:3})
  page.keyboard.press('Backspace');
}

export const assertElementPresent = async function (selector, page, type="Xpath"){
  const element = await elementSelector(selector, page, type)
  try {
    expect(element).not.toBe("Selector Not Found")
  } catch (error) {
    console.log("AssertElement Error: Empty element Selector = ", selector, "\n", error)
  }
  try {
    const expectHandler = expect(element)
    type !="Xpath" ? expectHandler.not.toBeNull() : expectHandler.toBeDefined() //for Css there is a different condition to make
    return element
  } catch (error) {
    console.log("AssertElementPresent Error: selector = ", selector, "\n", error)
    return element
  }
};

export const assertTextPresent = async function (selector, page, textPresent, type="Xpath"){
  const element = await assertElementPresent(selector,page, type != "Xpath"? type : "Xpath")
  try {
    const elementText = await page.evaluate(x=>x.innerText, element)
    expect(elementText).toMatch(textPresent)
  } catch (error) {
    console.log("AssertTextPresent Error: selector = ", selector, "\n", error)
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
    let elementText = await page.evaluate(x=>x.innerText, element)
    if(elementText === "") 
      elementText = await page.evaluate(x=>x.value, element)
    return elementText
  } catch (error) {
    console.log("getInnerText Error: Selector = ", selector, "\n", error)
    return `Error = ${element}`
  }
}

export const getNumberInString = async function(selector, page, numtype = "int", type ="Xpath"){
  const text = await getInnerText(selector, page, type)
  try {
    const number = text.match(/\d+.?\d+|\d+/)[0]
    return parseFloat(number)
  } catch (error) {
    console.log("getNumberInString Error: selector = ", selector)
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

export const amountOfElements = async (selector, page) => {
  const amount =  await page.$x(selector)
  try {
    return amount.length
  } catch (error) {
    console.log("amountOfElements Error: selector = ", selector, "\n", error)
  }
}