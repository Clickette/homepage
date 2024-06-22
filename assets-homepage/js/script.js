// lol dickette
const ascii = `
       _ _      _        _   _       
      | (_)    | |      | | | |      
   ___| |_  ___| | _____| |_| |_ ___ 
  / __| | |/ __| |/ / _ \\ __| __/ _ \\
 | (__| | | (__|   <  __/ |_| ||  __/
  \\___|_|_|\\___|_|\\_\\___|\\__|\\__\\___|
                                     
`;
console.log(
  `%c${ascii}\n`,
  "color: #F97316; font-family: monospace; font-size: 24px;"
);


fetch("https://api.github.com/repos/Clickette/homepage/commits/main")
  .then((res) =>
    res.json().then((json) => {
      const commitHash = json.sha.slice(0, 7);
      const commitDate = new Date(json.commit.author.date).toLocaleString();
      const commitAuthor = json.commit.author.name;

      const base =
        "color: #FFFFFF; font-family: monospace; font-size: 16px;";
      const highlight =
        "color: #F97316; font-family: monospace; font-size: 16px;";

      console.log(
        `%cLast commit: %c${commitHash} %cby %c${commitAuthor} %con %c${commitDate}%c.`,
        base, highlight, base, highlight, base, highlight, base
      );
    })
  )
  .catch((err) => {
    console.error(err);
  });

console.log(
    `%cNever copy and paste ANYTHING here! There is a good chance you are being scammed if someone is instructing you to do so!`,
    "color: #ff0000; font-family: monospace; font-size: 16px;"
);

!(function () {
    "use strict";
    !(function () {
        if (
            "requestAnimationFrame" in window &&
            !/Mobile|Android/.test(navigator.userAgent)
        ) {
            var e = document.querySelectorAll("[data-bss-parallax]");
            if (e.length) {
                var t,
                    n = [];
                window.addEventListener("scroll", a),
                    window.addEventListener("resize", a),
                    a();
            }
        }
        function a() {
            n.length = 0;
            for (var a = 0; a < e.length; a++) {
                var i = e[a].getBoundingClientRect(),
                    o =
                        parseFloat(
                            e[a].getAttribute("data-bss-parallax-speed"),
                            10
                        ) || 0.5;
                i.bottom > 0 &&
                    i.top < window.innerHeight &&
                    n.push({ speed: o, node: e[a] });
            }
            cancelAnimationFrame(t), n.length && (t = requestAnimationFrame(r));
        }
        function r() {
            for (var e = 0; e < n.length; e++) {
                var t = n[e].node,
                    a = n[e].speed;
                t.style.transform =
                    "translate3d(0, " + -window.scrollY * a + "px, 0)";
            }
        }
    })();
})();

// detect login using "authed" cookie (bool)

if (document.cookie.includes("user=")) {
    document.querySelector("#navcol-1 > ul > li > a").remove();
    document.querySelector("#navcol-1 > a").innerHTML = 'Dashboard';
    document.querySelector("#navcol-1 > a").href = 'https://clickette.net/dashboard';
}