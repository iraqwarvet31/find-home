const puppeteer = require("puppeteer");

const { parseCity, parseState } = require('../helpers/helpers.js')

const preparePageForTests = async (page) => {
  // Pass the User-Agent Test
  const userAgent =
    "Mozilla/5.0 (X11; Linux x86_64)" +
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36";
  await page.setUserAgent(userAgent);
};

async function getData(state, city) {
  var counter = 1;
  // Extract partners on the page, recursively check the next page in the URL pattern
  const extractApartments = async (url) => {
    const page = await browser.newPage();
    await preparePageForTests(page);
    await page.goto(url);
    // Scrape the data we want
    const apartmentsOnPage = await page.evaluate(() => {
      let apartmentsArr = [];
      let apartments = document.querySelectorAll(".copyContainer");
      let pageNumbers = document.querySelectorAll("a[data-page]");
      apartments.forEach((element) => {
        let apartmentObj = {};
        let name = element.childNodes[1].innerText;
        let address = element.childNodes[3].innerText;
        let price = element.childNodes[7].childNodes[1].childNodes[1].innerText;
        let size = element.childNodes[7].childNodes[1].childNodes[3].innerText;

        apartmentObj["Name"] = name;
        apartmentObj["Address"] = address;
        apartmentObj["Price"] = price;
        apartmentObj["Size"] = size;
        apartmentsArr.push(apartmentObj);
      });
      return apartmentsArr;
    });
    counter++;

    if (apartmentsOnPage.length < 5) {
      // Last page scraped terminate
      return apartmentsOnPage;
    } else {
      const nextUrl = `https://www.apartmentfinder.com/California/Los-Angeles-Apartments/Page${counter}`;
      return apartmentsOnPage.concat(await extractApartments(nextUrl));
    }
    // Go to all pages
    // if (apartmentsOnPage.length < 1) {
    //   // Last page scraped terminate
    //   return apartmentsOnPage;
    // } else {
    //   const nextUrl = `https://www.apartmentfinder.com/California/Los-Angeles-Apartments/Page${counter}`;
    //   return apartmentsOnPage.concat(await extractApartments(nextUrl));
    // }
  };

  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: true,
  });
  const firstUrl =
    `https://www.apartmentfinder.com/${parseState(state)}/${parseCity(city)}-Apartments/Page1`;
  const apartments = await extractApartments(firstUrl);

  await browser.close();
  return apartments;
}

module.exports = getData;






//# Backup just in case I break something :|
// const preparePageForTests = async (page) => {
//   // Pass the User-Agent Test
//   const userAgent =
//     "Mozilla/5.0 (X11; Linux x86_64)" +
//     "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36";
//   await page.setUserAgent(userAgent);
// };

// async function getData(state, city) {
//   var counter = 1;
//   // Extract partners on the page, recursively check the next page in the URL pattern
//   const extractApartments = async (url) => {
//     const page = await browser.newPage();
//     await preparePageForTests(page);
//     await page.goto(url);
//     // Scrape the data we want
//     const apartmentsOnPage = await page.evaluate(() => {
//       let apartmentsArr = [];
//       let apartments = document.querySelectorAll(".copyContainer");
//       let pageNumbers = document.querySelectorAll("a[data-page]");
//       apartments.forEach((element) => {
//         let apartmentObj = {};
//         let name = element.childNodes[1].innerText;
//         let address = element.childNodes[3].innerText;
//         let price = element.childNodes[7].childNodes[1].childNodes[1].innerText;
//         let size = element.childNodes[7].childNodes[1].childNodes[3].innerText;

//         apartmentObj["Name"] = name;
//         apartmentObj["Address"] = address;
//         apartmentObj["Price"] = price;
//         apartmentObj["Size"] = size;
//         apartmentsArr.push(apartmentObj);
//       });
//       return apartmentsArr;
//     });
//     counter++;

//     if (apartmentsOnPage.length < 5) {
//       // Last page scraped terminate
//       return apartmentsOnPage;
//     } else {
//       const nextUrl = `https://www.apartmentfinder.com/California/Los-Angeles-Apartments/Page${counter}`;
//       return apartmentsOnPage.concat(await extractApartments(nextUrl));
//     }
//     // if (apartmentsOnPage.length < 1) {
//     //   // Last page scraped terminate
//     //   return apartmentsOnPage;
//     // } else {
//     //   const nextUrl = `https://www.apartmentfinder.com/California/Los-Angeles-Apartments/Page${counter}`;
//     //   return apartmentsOnPage.concat(await extractApartments(nextUrl));
//     // }
//   };
//   const browser = await puppeteer.launch({
//     args: ["--no-sandbox"],
//     headless: true,
//   });
//   const firstUrl =
//     "https://www.apartmentfinder.com/California/Los-Angeles-Apartments/Page1";
//   const apartments = await extractApartments(firstUrl);

//   await browser.close();
//   return apartments;
// }

// module.exports = getData;