require("dotenv").config();

const axios = require("axios");
const puppeteer = require('puppeteer');
const moment = require('moment');
const cron = require('node-cron');



(async () => {

    const productUrl = process.env.PRODUCT_URL 

    const sendWebhook = (datas) => {
        const webhookUri = process.env.WEBHOOK_HOST;
    
        const options = {
            channel: "#테스트",
            username: "Alert Bot", 
            icon_emoji: ":technologist:", 
            text:`재고뜸!!!!!` // 내용
        }

        // request 발송
        axios.post(webhookUri, options)
        .then((response) => {
            console.info(`Message posted successfully: ${response}`);
            result = []
        })
        .catch((error) => {
            console.error(`Error posting message to Slack API: ${error}`);
            result = []
        }); 
    }


    const getState = async() => {

        const browser = await puppeteer.launch({
            headless: true, //브라우저 실행하려면 false로
        });

        const page = await browser.newPage();

        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.83 Safari/537.36');	

        await page.goto(productUrl);
        
        console.log(moment().format() + ' 페이지 접속');

        const btnBuy = await page.$x('/html/body/div[2]/section/div[2]/div[2]/div[2]/div[8]/a[3]');

        console.log(`상태: ${ btnBuy.length > 0 ? "구매 가능" : "구매 불가능" }`)

        if (btnBuy.length > 0) {
            sendWebhook();
        }

        await browser.close();
    }

    cron.schedule('* */5 * * *', function(){
        console.log('5분마다 실행중');
        getState()
    });
    
})();