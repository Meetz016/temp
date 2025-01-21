// background.js

const AMAZON_AFF_PARAM_KEY = "tag";
const AMAZON_AFF_PARAM_VALUE = "syroa-21";
const FLIPKART_AFF_PARAM_KEY = "affid";
const FLIPKART_AFF_PARAM_VALUE = "my-flip-id";

/**
 * Checks if a URL already has the given query param with the expected value.
 */
function hasAffiliateParam(url, paramKey, paramValue) {
  const urlObj = new URL(url);
  return urlObj.searchParams.get(paramKey) === paramValue;
}

/**
 * Listener for tab updates (MV3 "service worker" style).
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only act when the URL is known (changeInfo.url) and domain is Amazon/Flipkart
  if (changeInfo.url) {
    try {
      const urlObj = new URL(changeInfo.url);
      const hostname = urlObj.hostname;

      let newUrl = null;

      // Amazon
      if (hostname.includes("amazon.")) {
        if (
          !hasAffiliateParam(
            changeInfo.url,
            AMAZON_AFF_PARAM_KEY,
            AMAZON_AFF_PARAM_VALUE
          )
        ) {
          urlObj.searchParams.set(AMAZON_AFF_PARAM_KEY, AMAZON_AFF_PARAM_VALUE);
          newUrl = urlObj.toString();
        }
      } else if (hostname.includes("flipkart.")) {
        // Flipkart
        if (
          !hasAffiliateParam(
            changeInfo.url,
            FLIPKART_AFF_PARAM_KEY,
            FLIPKART_AFF_PARAM_VALUE
          )
        ) {
          urlObj.searchParams.set(
            FLIPKART_AFF_PARAM_KEY,
            FLIPKART_AFF_PARAM_VALUE
          );
          newUrl = urlObj.toString();
        }
      }

      // If we modified the URL, update the tab
      if (newUrl && newUrl !== changeInfo.url) {
        chrome.tabs.update(tabId, { url: newUrl });
      }
    } catch (error) {
      console.error("Error updating URL for affiliate:", error);
    }
  }
});
