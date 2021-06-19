const puppeteer = require("puppeteer");
let page;
let cmd = process.argv[2];
async function fn() {
    try {
        const browser = await puppeteer
            .launch({
                headless: false,
                defaultViewport: null,
                args: ["--start-maximized"],
            })
        let pages = await browser.pages();
        page = pages[0];
        await page.goto("https://prices.org/");
        //await page.waitForSelector(".coin-symbol", { visible: true });
        //.coin-name-inner
        await page.waitForSelector(".coin-name-inner", { visible: true });
        await page.waitForSelector(".value-field.price-responsive", { visible: true });
        //let coin = ".coin-symbol";
        let coin = ".coin-name-inner";
        let price = ".value-field.price-responsive";
        let highestPricein24hr = ".price-high-24-responsive";
        let lowestPricein24hr = ".price-low-24-responsive";
        let cryptprice = await page.evaluate(getcoinNprice, coin, price, highestPricein24hr, lowestPricein24hr);
        console.table(cryptprice);
        await page.click(".selectize-input.items.not-full.has-options");
        await page.type(".selectize-input.items.not-full.has-options", cmd, { delay: 100 });
        await page.keyboard.press("Enter");
        await page.click(".view-detail");
        await page.waitForSelector(".coin-price-24-high", {visible: true});
        let bitcoin = ".coin-name";
        let bitprice = ".coin-market-info-price";
        let bithighestPricein24hr = ".coin-price-24-high";
        let bitlowestPricein24hr = ".coin-price-24-low";
        let selectedCrypt = await page.evaluate(getSelectedCrypt, bitcoin, bitprice, bithighestPricein24hr, bitlowestPricein24hr);
        console.table(selectedCrypt);
    }
    catch (err) {
        console.log(err);
    }
    finally {
        await page.close();
        //console.log("coin");
    }
}

function getcoinNprice(coin, price, highestPricein24hr, lowestPricein24hr) {
    let coinArr = document.querySelectorAll(coin);
    let priceArr = document.querySelectorAll(price);
    let highArr = document.querySelectorAll(highestPricein24hr);
    let lowArr = document.querySelectorAll(lowestPricein24hr);
    let coinpriceArr = [];
    for (let i = 0; i < priceArr.length; i++) {
        let cryptoCurrency = coinArr[i].innerText.trim();
        let prices_in_$ = priceArr[i].innerText.trim();
        let highestPricein24hr = highArr[i].innerText.trim();
        let lowestPricein24hr = lowArr[i].innerText.trim();
        coinpriceArr.push({ cryptoCurrency, prices_in_$, highestPricein24hr, lowestPricein24hr })
    }
    return coinpriceArr;
}

function getSelectedCrypt(bitcoin, bitprice, bithighestPricein24hr, bitlowestPricein24hr) {
    let coinArr = document.querySelectorAll(bitcoin);
    let priceArr = document.querySelectorAll(bitprice);
    let highArr = document.querySelectorAll(bithighestPricein24hr);
    let lowArr = document.querySelectorAll(bitlowestPricein24hr);
    let coinpriceArr = [];
    for (let i = 0; i < priceArr.length; i++) {
        let cryptoCurrency = coinArr[i].innerText.trim();
        let prices_in_$_with_Change_inPercent = priceArr[i].innerText.trim();
        let highestPricein24hr = highArr[i].innerText.trim();
        let lowestPricein24hr = lowArr[i].innerText.trim();
        coinpriceArr.push({ cryptoCurrency, prices_in_$_with_Change_inPercent, highestPricein24hr, lowestPricein24hr })
    }
    return coinpriceArr;
}
fn();