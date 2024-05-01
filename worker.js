export default {
    async fetch(request, _env, _ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        const isRoot =
            path === "/" ||
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
        if (!isRoot && contentType && contentType.includes("text/html")) {
            const text = await response.text();
            const modifiedText = text.replace(
                "</head>",
                '<link rel="manifest" href="/manifest.json" /><link rel="icon" type="image/png" sizes="1024x1024" href="/assets-homepage/img/clickette.png" /></head>'
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
            return new Response(modifiedText4, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
            });
        }
        // j a n k
        /*
        if (!isRoot && contentType && contentType.includes("application/json")) {
            const text = await response.text();
            const modifiedText = text.replaceAll(
                'dashboard-internal.',
                ''
            )
            const modifiedText2 = modifiedText.replaceAll(
                'homepage-internal.',
                ''
            )
            return new Response(modifiedText2, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });
        }
        */

        return response;
    },
};
