export default {
    async fetch(request, env, ctx) {
        // if requesting /, /terms, /privacy, or /privacy-policy, fetch clickette.net/* and return it
        // otherwise fetch dash.clickette.net/* and return it
        const url = new URL(request.url);
        const path = url.pathname;
        const isRoot = path === '/' || path === '/terms' || path === '/privacy' || path === '/privacy-policy';
        const newUrl = new URL(request.url);
        newUrl.host = isRoot ? 'homepage-internal.clickette.net' : 'dashboard-internal.clickette.net';
        newUrl.search = url.search; // Proxy query parameters
        const newRequest = new Request(newUrl, request);
        const response = await fetch(newRequest);

        // Add manifest link to document head on dashboard pages
        if (!isRoot) {
            const text = await response.text();
            const modifiedText = text.replace(
                '</head>',
                '<link rel="manifest" href="/manifest.json" /></head>'
            );
            return new Response(modifiedText, response);
        }

        return response;
    },
};
