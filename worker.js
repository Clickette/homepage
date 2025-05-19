const RATE_LIMIT_TIME = 60 * 1000; // 1 minute in milliseconds
const TOAST_HTML = `
<div id="toast-container" style="position: fixed; bottom: 20px; left: 20px; background-color: #333; color: #fff; border: 1px solid #555; padding: 15px; border-radius: 5px; box-shadow: 2px 2px 5px rgba(0,0,0,0.3); z-index: 1000;">
    <div class="font-medium text-xs">
        <span>Clickette (Zipline) is currently in read-only mode. You won't be able to upload files.</span>
        <a href="https://clickette.instatus.com/cm9cemvfh00e19d240a7abbjo" class="underline" style="color: #80cfff;">Learn More</a>
        <br>
        <span>Follow our <a href="https://bsky.app/profile/did:plc:ttztqgxnvltmt4cyemuhg437" class="underline" style="color: #80cfff;">Bluesky</a> for updates on Vault.</span>
    </div>
    <button id="close-toast" style="margin-top: 10px; border: none; background-color: #555; color: #fff; cursor: pointer; font-size: 12px; padding: 5px 10px; border-radius: 3px;">OK</button>
</div>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const toastContainer = document.getElementById('toast-container');
    const closeButton = document.getElementById('close-toast');

    if (toastContainer && closeButton) {
      closeButton.addEventListener('click', function() {
        toastContainer.style.display = 'none';
      });
    }
  });
</script>
`;

export default {
    async fetch(request, env, ctx) {
        const originalUrl = new URL(request.url); // Renamed to avoid conflict
        const path = originalUrl.pathname;
        const method = request.method;

        // If it's a POST request and NOT for registration, bypass all worker logic.
        if (method === "POST" && !path.startsWith("/api/auth/register")) {
            // Fetch the original request directly without any modifications
            return fetch(request);
        }

        // For GET requests OR POST requests to /api/auth/register:
        // Proceed with worker logic (rate limiting for registration POSTs, then routing/HTML mods).

        if (path.startsWith("/api/auth/register")) {
            // Only apply rate limiting logic for POST requests to this path
            if (method === "POST") {
                const currentTimestamp = Date.now();
                const lastRegistrationTime = await env.MY_KV_NAMESPACE.get(
                    "lastRegistrationTime"
                );

                const originalUrl = new URL(request.url);
                const path = originalUrl.pathname;
                const method = request.method;

                if (method === "POST") {
                    console.log(`POST request to path: ${path}`); // Log the path
                    if (!path.startsWith("/api/auth/register")) {
                        console.log(`Bypassing worker logic for POST to: ${path}`); // Confirm bypass
                        return fetch(request); // Bypass and fetch original request directly
                    }
                }

                // Update the last registration timestamp
                await env.MY_KV_NAMESPACE.put(
                    "lastRegistrationTime",
                    currentTimestamp.toString()
                );
            }
            // If it's a GET to /api/auth/register, or a POST that wasn't rate-limited,
            // it will continue to the host rewriting and HTML modification logic below.
        }

        const isRoot =
            path === "/" ||
            path.startsWith("/index.html") ||
            path.startsWith("/terms") ||
            path.startsWith("/privacy") ||
            path.startsWith("/privacy-policy") ||
            path.startsWith("/assets-homepage") ||
            path.startsWith("/manifest.json");

        const newUrl = new URL(request.url); // Use original request.url for building the new URL
        newUrl.host = isRoot
            ? "homepage-internal.clickette.org"
            : "dashboard-internal.clickette.org";
        // Query parameters from request.url are already included in newUrl

        // Create a new request init object
        const newRequestInit = {
            method: request.method,
            headers: new Headers(request.headers), // Create a new Headers object to make it mutable
            body: request.body,
            redirect: request.redirect,
        };

        // Add the Override-Domain header
        newRequestInit.headers.set("Override-Domain", "clickette.org");

        const newRequest = new Request(newUrl.toString(), newRequestInit);

        const response = await fetch(newRequest);

        // Check if the content type is text/html for modification
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("text/html")) {
            let text = await response.text();

            // Head modifications
            text = text.replace(
                "</head>",
                '<link rel="manifest" href="/manifest.json" /><link rel="icon" type="image/x-icon" sizes="256x256" href="https://clickette.org/assets-homepage/img/favicon.ico" /></head>'
            );

            // URL and internal domain replacements
            text = text.replaceAll("dash.clickette.org", "clickette.org");
            text = text.replaceAll("dashboard-internal.", "");
            text = text.replaceAll("homepage-internal.", "");

            // Script injections
            const logoJs = `const style=document.documentElement.style;function getLogoSrc(){let e=style.getPropertyValue("color-scheme").trim();return"dark"===e?"https://clickette.org/assets-homepage/img/wordmark-white.svg":"https://clickette.org/assets-homepage/img/wordmark-black.svg"}function setTargetInnerHTML(){let e=document.querySelector("#__next > div > header > div > h1");if(e&&"Clickette"===e.innerHTML.trim()){let t=getLogoSrc();return e.innerHTML=\`<img id="logo" src="\${t}" height="30" style="margin-top:-8px;">\`,e}return null}function updateLogo(){let e=document.getElementById("logo");e&&(e.src=getLogoSrc())}const observer=new MutationObserver(e=>{let t=document.querySelector("#__next > div > header > div > h1");t&&"Clickette"===t.innerHTML.trim()&&setTargetInnerHTML()});let targetElement=setTargetInnerHTML();const config={childList:!0,subtree:!0};observer.observe(document,config);const targetObserver=new MutationObserver(e=>{for(let t of e)"childList"===t.type&&(targetElement=setTargetInnerHTML(),targetObserver.observe(targetElement,{childList:!0,subtree:!0}))});targetObserver.observe(document,{childList:!0,subtree:!0});const themeObserver=new MutationObserver(e=>{for(let t of e)"style"===t.attributeName&&updateLogo()});themeObserver.observe(document.documentElement,{attributes:!0,attributeFilter:["style"]}),updateLogo();function waitForXPath(i,e){let d=null,v=new MutationObserver(()=>{let v=document.evaluate(i,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;v&&v!==d&&(d=v,e(v))});v.observe(document,{childList:!0,subtree:!0})}waitForXPath("/html/body/div[1]/div/div/main/div/div/div[1]/div/div[2]/div[1]/span",i=>i.innerText="Information"),waitForXPath("/html/body/div[1]/div/div/main/div/div/div[1]/div/div[2]/div[2]/div/div[1]",i=>i.innerText="Vault is running on Zipline v3, an outdated version retained due to hardware limitations. Some features may be restricted or less efficient as a result. A custom replacement is in development and will be deployed once complete."),waitForXPath("/html/body/div[1]/div/div/main/div/div/div[1]/div/div[2]/div[2]/div/div[2]",i=>i.remove());`;
            text = text.replace(
                "</body>",
                TOAST_HTML +
                "</body><script>" +
                logoJs +
                '</script><script src="https://clickette.instatus.com/en/021b5f0f/widget/script.js"></script><script async defer src="https://s.clickette.org/latest.js"></script> <noscript><img src="https://s.clickette.org/noscript.gif" alt="" referrerpolicy="no-referrer-when-downgrade" /></noscript>'
            );

            // Create new headers for the modified response, copying original ones
            const newResponseHeaders = new Headers(response.headers);
            // Remove content-length as the body size has changed; the environment will set it.
            newResponseHeaders.delete('content-length');

            return new Response(text, {
                status: response.status,
                statusText: response.statusText,
                headers: newResponseHeaders,
            });
        }

        // Return the original response if not HTML or no modifications were needed
        return response;
    },
};
