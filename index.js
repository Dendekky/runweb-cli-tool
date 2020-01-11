#!/usr/bin/env node
const fetch = require("node-fetch");
const open = require('open');

// console.log(process.argv);
const website = process.argv[2]; 

function CheckWeb(name) {
    const substrings =['.com', '.org', '.ng', '.io', '.to', '.ai', 'co', 'ca'];

    if (new RegExp(substrings.join("|")).test(name)) {
        const info =fetch(`https://isitup.org/${name}.json`)
        .then(response => response.json());
        
        info.then(function(result) {
            function openWebSite () {
                setTimeout(function()
                { open(`https://${result.domain}`); }, 3000);
            };

            if (result.response_code == 200) {
                console.log('\x1b[32m%s\x1b[0m', 'website is up and running');
                openWebSite();
            } else if (result.response_code == 301) {
                console.log('\x1b[32m%s\x1b[0m', 'website has been moved permanently but is up');
                openWebSite();
            } else if (result.response_code == 302){
                console.log('\x1b[34m%s\x1b[0m', 'temporary redirect, website is up');
                openWebSite();
            } else if (result.response_code == 403) {
                console.log('\x1b[33m%s\x1b[0m', 'information not found');
                openWebSite();
            }
            else {
                console.log('\x1b[31m%s\x1b[0m', 'website is down')
            }
        });
    } else {
        console.log('\x1b[31m%s\x1b[0m', 'please append your url ending e.g(mouse.com)')
    }
}

CheckWeb(website);