import { chromium } from 'playwright';

const browser = await chromium.launch({ 
  executablePath: '/usr/bin/google-chrome', 
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage'] 
});
const page = await browser.newPage();

await page.route('**/*', route => {
  const url = route.request().url();
  if (url.includes('googleapis') || url.includes('stripe.com') || url.includes('amazonaws')) {
    return route.abort();
  }
  return route.continue();
});

await page.setViewportSize({ width: 1280, height: 900 });
await page.goto('http://localhost:5174/services/gutter-cleaning', { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.waitForTimeout(3000);

const title = await page.title();
console.log('Page title:', title);

const anchors = await page.evaluate(() => 
  Array.from(document.querySelectorAll('a')).map(a => a.getAttribute('href') + ' | ' + a.textContent.trim().slice(0,30))
);
console.log('Anchors:', anchors.slice(0,15).join('\n'));

const hasGetAPrice = await page.evaluate(() => !!document.querySelector('a[href="#get-a-price"]'));
console.log('Has #get-a-price anchor:', hasGetAPrice);

const hasFormSection = await page.evaluate(() => !!document.getElementById('get-a-price'));
console.log('Has id=get-a-price section:', hasFormSection);

const hasHowItWorks = await page.evaluate(() => 
  Array.from(document.querySelectorAll('h2')).some(h => h.textContent.includes('How It Works'))
);
console.log('Has How It Works heading:', hasHowItWorks);

const hasSteps = await page.evaluate(() => 
  Array.from(document.querySelectorAll('*')).filter(el => ['①','②','③'].some(c => el.textContent === c)).length
);
console.log('Step markers count:', hasSteps);

await page.screenshot({ path: '/tmp/gutter-hero.png' });
console.log('Hero screenshot saved');

await page.evaluate(() => window.scrollBy(0, window.innerHeight + 50));
await page.waitForTimeout(400);
await page.screenshot({ path: '/tmp/gutter-howitworks.png' });
console.log('How It Works screenshot saved');

// Anchor scroll
await page.evaluate(() => document.querySelector('a[href="#get-a-price"]')?.click());
await page.waitForTimeout(800);
await page.screenshot({ path: '/tmp/gutter-anchor.png' });
console.log('Anchor scroll screenshot saved');

// Check bottom CTA unchanged
const hasReadyToBook = await page.evaluate(() => 
  Array.from(document.querySelectorAll('p')).some(p => p.textContent.includes('Ready to book?'))
);
console.log('Has Ready to book? CTA:', hasReadyToBook);

// Window cleaning
await page.goto('http://localhost:5174/services/window-cleaning', { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: '/tmp/window-hero.png' });
console.log('Window hero screenshot saved');

// Pressure washing
await page.goto('http://localhost:5174/services/pressure-washing', { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: '/tmp/pressure-hero.png' });
console.log('Pressure hero screenshot saved');

// Mobile
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://localhost:5174/services/gutter-cleaning', { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: '/tmp/gutter-mobile-hero.png' });
await page.evaluate(() => window.scrollBy(0, window.innerHeight + 50));
await page.waitForTimeout(400);
await page.screenshot({ path: '/tmp/gutter-mobile-howitworks.png' });
console.log('Mobile screenshots saved');

await browser.close();
console.log('All done');
