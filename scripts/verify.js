const { chromium } = require('playwright');

const URL = 'http://127.0.0.1:5500/Sapphire%20Cleaning/index-v2.html#home';

(async () => {
  const browser = await chromium.launch();
  const consoleErrors = [];
  const failedRequests = [];

  // ---- Desktop pass ----
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('requestfailed', (req) => failedRequests.push(req.url() + ' :: ' + (req.failure()?.errorText || '')));
    page.on('response', (res) => { if (res.status() >= 400) failedRequests.push(res.url() + ' :: HTTP ' + res.status()); });

    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-hero-slider]');
    await page.screenshot({ path: 'scripts/out/desktop-initial.png' });

    const firstSrc = await page.$eval('.hero-slide:nth-of-type(1)', el => el.getAttribute('src'));
    const secondSrcBefore = await page.$eval('.hero-slide:nth-of-type(2)', el => el.getAttribute('src') || el.getAttribute('data-src'));
    console.log('Desktop: hero slide 1 src =', firstSrc);
    console.log('Desktop: hero slide 2 src/data-src (should still show data-src briefly, or already swapped) =', secondSrcBefore);

    // Wait past one autoplay cycle (3s) so slide 2 should be showing
    await page.waitForTimeout(3500);
    const opacities = await page.$$eval('.hero-slide', els => els.map(el => getComputedStyle(el).opacity));
    console.log('Desktop: hero slide opacities after 3.5s (expect slide index 1 = "1") =', opacities);
    await page.screenshot({ path: 'scripts/out/desktop-after-autoplay.png' });

    // confirm slide 2 now has a real loaded src (not data-src placeholder)
    const secondSrcAfter = await page.$eval('.hero-slide:nth-of-type(2)', el => ({ src: el.getAttribute('src'), dataSrc: el.getAttribute('data-src'), naturalWidth: el.naturalWidth }));
    console.log('Desktop: hero slide 2 after autoplay =', secondSrcAfter);

    // click through services carousel, faq, mobile menu isn't visible on desktop so skip
    await page.click('[data-carousel-next]');
    await page.waitForTimeout(700);
    await page.screenshot({ path: 'scripts/out/desktop-services-carousel.png' });

    await page.click('.faq-toggle');
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'scripts/out/desktop-faq-open.png' });

    await page.close();
  }

  // ---- Mobile pass ----
  {
    const page = await browser.newPage({ viewport: { width: 412, height: 823 }, isMobile: true });
    page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push('[mobile] ' + msg.text()); });
    page.on('requestfailed', (req) => failedRequests.push('[mobile] ' + req.url() + ' :: ' + (req.failure()?.errorText || '')));
    page.on('response', (res) => { if (res.status() >= 400) failedRequests.push('[mobile] ' + res.url() + ' :: HTTP ' + res.status()); });

    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-hero-slider]');
    await page.screenshot({ path: 'scripts/out/mobile-initial.png' });

    await page.click('#menu-btn');
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'scripts/out/mobile-menu-open.png' });

    await page.close();
  }

  await browser.close();

  console.log('\n=== Console errors ===');
  console.log(consoleErrors.length ? consoleErrors.join('\n') : '(none)');
  console.log('\n=== Failed / 4xx-5xx requests ===');
  console.log(failedRequests.length ? failedRequests.join('\n') : '(none)');
})();
