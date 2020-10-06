'use strict';

const assert = require('assert')
const puppeteer = require('puppeteer')

describe('E2E TEST: Check URL and short URL', () => {
    let browser
    let page

    before(async () => {
        browser = await puppeteer.launch({
            // headless: false,
            // slowMo: 50
        })
        page = await browser.newPage()
    })
    // Check if the page converts original URL to short URL
    it('E2E TEST: check if return short URL', async () => {
        await page.goto('http://localhost:4100')
        await page.click('input.input-url');
        await page.type('input.input-url', 'https://github.com/');
        await page.click('.submit-button');
        await page.waitForSelector('a.short-url')

        const shortlink = await page.$eval('a.short-url', link => link.href.trim())
        assert.notStrictEqual(shortlink, 'http://localhost:4100/')
    }).timeout(10000)
    // Check the URL search functionality on the page
    it('E2E TEST: check URL search', async () => {
        await page.goto('http://localhost:4100')
        await page.click('input#searchId');
        await page.type('input#searchId', 'https://github.com/');
        await page.keyboard.press(String.fromCharCode(13));
        await page.waitForSelector('.tbl-content');
        const shortlink = await page.evaluate(() => {
            const tds = Array.from(document.querySelectorAll('table tr td'))
            return tds.map(td => td.innerText)
        });
        assert.strictEqual(shortlink[0], 'https://github.com/')
    }).timeout(10000)
    // Check if the dsplayed short URL from page redirects to original URL
    it('E2E TEST: check URL redirect', async () => {
        await page.goto('http://localhost:4100')
        await page.click('input#searchId');
        await page.type('input#searchId', 'https://github.com/');
        await page.keyboard.press(String.fromCharCode(13));
        await page.waitForSelector('.tbl-content');
        const shortlink = await page.evaluate(() => {
            const tds = Array.from(document.querySelectorAll('table tr td'))
            return tds.map(td => td.innerText)
        });
        await page.goto(shortlink[1]);
        const originalUrl = await page.url();
        assert.strictEqual(originalUrl, shortlink[0])
    }).timeout(10000)

    after(async () => {
        await browser.close()
    })
})      
