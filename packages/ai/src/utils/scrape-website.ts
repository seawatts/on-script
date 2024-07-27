import type { Browser, Page } from "playwright";
import { chromium } from "playwright";

export async function scrapeWebsite(props: { url: string }) {
  let browser: Browser | undefined;
  let page: Page | undefined;

  try {
    let pdfBuffer: Buffer;
    let title: string;

    // Check if the URL is a PDF
    if (props.url.endsWith(".pdf")) {
      // Download the PDF using fetch
      const response = await fetch(props.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }
      const pdfArrayBuffer = await response.arrayBuffer();
      pdfBuffer = Buffer.from(pdfArrayBuffer);
      title = new URL(props.url).pathname.split("/").pop() ?? "Untitled";

      return { pdfBuffer, title };
    } else {
      // Launch the browser
      browser = await chromium.launch({ headless: true });

      // Create a new page
      page = await browser.newPage();

      // Navigate to the URL
      await page.goto(props.url);

      // Wait for the content to load (customize this selector based on your target website)
      await page.emulateMedia({ media: "screen", reducedMotion: "reduce" });
      title = await page.title();
      pdfBuffer = await page.pdf();

      return { pdfBuffer, title };
    }
  } catch (error) {
    console.error("Error scraping website:", error);
    throw error;
  } finally {
    // Close the browser
    if (browser) {
      await browser.close();
    }
  }
}
