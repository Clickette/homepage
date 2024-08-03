const RATE_LIMIT_TIME = 60 * 1000; // 1 minute in milliseconds

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;

        if (path.startsWith("/api/auth/register")) {
            const currentTimestamp = Date.now();
            const lastRegistrationTime = await env.MY_KV_NAMESPACE.get(
                "lastRegistrationTime"
            );

            if (
                lastRegistrationTime &&
                currentTimestamp - parseInt(lastRegistrationTime) <
                    RATE_LIMIT_TIME
            ) {
                return new Response(
                    "Too many requests, please try again later.",
                    { status: 429 }
                );
            }

            // Update the last registration timestamp
            await env.MY_KV_NAMESPACE.put(
                "lastRegistrationTime",
                currentTimestamp.toString()
            );
        }

        const isRoot =
            path === "/" ||
            path.startsWith("/index.html") ||
            path.startsWith("/terms") ||
            path.startsWith("/privacy") ||
            path.startsWith("/privacy-policy") ||
            path.startsWith("/assets-homepage") ||
            path.startsWith("/manifest.json");
        const newUrl = new URL(request.url);
        newUrl.host = isRoot
            ? "homepage-internal.clickette.net"
            : "dashboard-internal.clickette.net";
        newUrl.search = url.search; // Proxy query parameters

        // Create a new request and modify the headers
        const newRequest = new Request(newUrl, {
            method: request.method,
            headers: request.headers,
            body: request.body,
            redirect: request.redirect,
        });

        // Add the Override-Domain header
        newRequest.headers.set("Override-Domain", "clickette.net");

        const response = await fetch(newRequest);

        // Check if the content type is text/html
        const contentType = response.headers.get("content-type");
        if (isRoot && contentType && contentType.includes("text/html")) {
            const text = await response.text();
            const modifiedText = text.replace(
                "</head>",
                '<link rel="manifest" href="/manifest.json" /><link rel="icon" type="image/x-icon" sizes="256x256" href="https://clickette.net/assets-homepage/img/favicon.ico" /></head>'
            );
            const modifiedText2 = modifiedText.replaceAll(
                "dash.clickette.net",
                "clickette.net"
            );
            const modifiedText3 = modifiedText2.replaceAll(
                "dashboard-internal.",
                ""
            );
            const modifiedText4 = modifiedText3.replaceAll(
                "homepage-internal.",
                ""
            );
            const logoJs = `const style=document.documentElement.style;function getLogoSrc(){let e=style.getPropertyValue("color-scheme").trim();return"dark"===e?"https://clickette.net/assets-homepage/img/wordmark-white.svg":"https://clickette.net/assets-homepage/img/wordmark-black.svg"}function setTargetInnerHTML(){let e=document.querySelector("#__next > div > header > div > h1");if(e&&"Clickette"===e.innerHTML.trim()){let t=getLogoSrc();return e.innerHTML=\`<img id="logo" src="\${t}" height="30" style="margin-top:-8px;">\`,e}return null}function updateLogo(){let e=document.getElementById("logo");e&&(e.src=getLogoSrc())}const observer=new MutationObserver(e=>{let t=document.querySelector("#__next > div > header > div > h1");t&&"Clickette"===t.innerHTML.trim()&&setTargetInnerHTML()});let targetElement=setTargetInnerHTML();const config={childList:!0,subtree:!0};observer.observe(document,config);const targetObserver=new MutationObserver(e=>{for(let t of e)"childList"===t.type&&(targetElement=setTargetInnerHTML(),targetObserver.observe(targetElement,{childList:!0,subtree:!0}))});targetObserver.observe(document,{childList:!0,subtree:!0});const themeObserver=new MutationObserver(e=>{for(let t of e)"style"===t.attributeName&&updateLogo()});themeObserver.observe(document.documentElement,{attributes:!0,attributeFilter:["style"]}),updateLogo();`;
            const modifiedText5 = modifiedText4.replace(
                "</body>",
                "</body><script>" +
                    logoJs +
                    '</script><script src="https://clickette.instatus.com/en/021b5f0f/widget/script.js"></script><script async defer src="https://s.clickette.net/latest.js"></script> <noscript><img src="https://s.clickette.net/noscript.gif" alt="" referrerpolicy="no-referrer-when-downgrade" /></noscript>'
            );
            return new Response(modifiedText5, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
            });
        } else if (
            !isRoot &&
            contentType &&
            contentType.includes("text/html")
        ) {
            const text = await response.text();
            const modifiedText = text.replace(
                "</head>",
                '<link rel="manifest" href="/manifest.json" /><link rel="icon" type="image/x-icon" sizes="256x256" href="https://clickette.net/assets-homepage/img/favicon.ico" /></head>'
            );
            const modifiedText2 = modifiedText.replaceAll(
                "dash.clickette.net",
                "clickette.net"
            );
            const modifiedText3 = modifiedText2.replaceAll(
                "dashboard-internal.",
                ""
            );
            const modifiedText4 = modifiedText3.replaceAll(
                "homepage-internal.",
                ""
            );
            const logoJs = `const style=document.documentElement.style;function getLogoSrc(){let e=style.getPropertyValue("color-scheme").trim();return"dark"===e?"https://clickette.net/assets-homepage/img/wordmark-white.svg":"https://clickette.net/assets-homepage/img/wordmark-black.svg"}function setTargetInnerHTML(){let e=document.querySelector("#__next > div > header > div > h1");if(e&&"Clickette"===e.innerHTML.trim()){let t=getLogoSrc();return e.innerHTML=\`<img id="logo" src="\${t}" height="30" style="margin-top:-8px;">\`,e}return null}function updateLogo(){let e=document.getElementById("logo");e&&(e.src=getLogoSrc())}const observer=new MutationObserver(e=>{let t=document.querySelector("#__next > div > header > div > h1");t&&"Clickette"===t.innerHTML.trim()&&setTargetInnerHTML()});let targetElement=setTargetInnerHTML();const config={childList:!0,subtree:!0};observer.observe(document,config);const targetObserver=new MutationObserver(e=>{for(let t of e)"childList"===t.type&&(targetElement=setTargetInnerHTML(),targetObserver.observe(targetElement,{childList:!0,subtree:!0}))});targetObserver.observe(document,{childList:!0,subtree:!0});const themeObserver=new MutationObserver(e=>{for(let t of e)"style"===t.attributeName&&updateLogo()});themeObserver.observe(document.documentElement,{attributes:!0,attributeFilter:["style"]}),updateLogo();`;
            const modifiedText5 = modifiedText4.replace(
                "</body>",
                "</body><script>" +
                    logoJs +
                    '</script><script src="https://clickette.instatus.com/en/021b5f0f/widget/script.js"></script><script async defer src="https://s.clickette.net/latest.js"></script> <noscript><img src="https://s.clickette.net/noscript.gif" alt="" referrerpolicy="no-referrer-when-downgrade" /></noscript>'
            );
            return new Response(modifiedText5, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
            });
        }
        return response;
    },
};
