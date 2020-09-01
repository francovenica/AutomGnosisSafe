// 3 ways to find an element with the tag "p" and click it

/*1 - */ 
await gnosisPage.evaluate(() => {
    document.querySelectorAll("p").forEach(element => { if(element.innerText === "Awaiting your confirmation") element.click()})
})

/*2 - */ 
await gnosisPage.$$eval('p', x => {
    x.forEach( xx => { if(xx.innerText === "Awaiting your confirmation") xx.click()})
})

/*3 - */ 
await gnosisPage.$$eval('p', selectorMatched => {
    for(i in selectorMatched)
        if(selectorMatched[i].textContent === 'Awaiting your confirmation'){
            selectorMatched[i].click();
            break;//Remove this line (break statement) if you want to click on all matched elements otherwise the first element only is clicked  
        }
    });