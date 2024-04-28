export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        const isRoot = path === '/' || path === '/terms' || path === '/privacy' || path === '/privacy-policy' || path.startsWith('/assets-homepage') || path === '/manifest.json'
        const newUrl = new URL(request.url);
        newUrl.host = isRoot ? 'homepage-internal.clickette.net' : 'dashboard-internal.clickette.net';
        newUrl.search = url.search; // Proxy query parameters

        // Create a new request and modify the headers
        const newRequest = new Request(newUrl, {
            method: request.method,
            headers: request.headers,
            body: request.body,
            redirect: request.redirect,
        });

        const response = await fetch(newRequest);

        // Check if the content type is text/html
        const contentType = response.headers.get("content-type");
        if (!isRoot && contentType && contentType.includes("text/html")) {
            const text = await response.text();
            const modifiedText = text.replace(
                '</head>',
                '<link rel="manifest" href="/manifest.json" /><link rel="icon" type="image/png" sizes="1024x1024" href="/assets-homepage/img/clickette.png" /></head>'
            )
            const modifiedText2 = modifiedText.replaceAll(
                'dash.clickette.net',
                'clickette.net'
            )
            const modifiedText3 = modifiedText2.replaceAll(
                'dashboard-internal.clickette.net',
                'clickette.net'
            )
            const modifiedText4 = modifiedText3.replaceAll(
                'homepage-internal.clickette.net',
                'clickette.net'
            )
            return new Response(modifiedText4, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });
        }

        return response;
    },
};