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

if (document.cookie.includes("user=")) {
    document.querySelector("#navcol-1 > ul > li > a").remove();
    document.querySelector("#navcol-1 > a").innerHTML = 'Dashboard';
    document.querySelector("#navcol-1 > a").href = 'https://clickette.net/dashboard';
}