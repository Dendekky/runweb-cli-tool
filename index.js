#!/usr/bin/env node
const fetch = require("node-fetch");
const open = require('open');
const arg = require('arg');
const inquirer = require('inquirer');

function parseArgumentsIntoOptions() {
    const args = arg(
      {
        '--website': Boolean,
        '--yes': Boolean,
        '-w': '--website',
        '-y': '--yes',
      },
      {
        argv: process.argv.slice(2),
      }
    );
    return {
      website: args['--website'] || false,
    };
}

async function promptForMissingOptions(options) {
    const questions = [];
   
    if (!options.website) {
      questions.push({
        type: 'confirm',
        name: 'website',
        message: 'Open the website on your browser?',
        default: false,
      });
    }
   
    const answers =  await inquirer.prompt(questions);
    return {
      ...options,
      website: options.website || answers.website,
    };
}
   
async function LaunchWebsite(result) {
    let options = parseArgumentsIntoOptions();
    options =  await promptForMissingOptions(options);
    if (options.website == true) {
        open(`https://${result.domain}`); 
    }
}

const website = process.argv[2]; 

function CheckWeb(name) {
    const substrings =['.com', '.org', '.ng', '.io', '.to', '.ai', 'co', 'ca'];

    if (new RegExp(substrings.join("|")).test(name)) {
        const info =fetch(`https://isitup.org/${name}.json`)
        .then(response => response.json());
        
        info.then(function(result) {
            if (result.response_code == 200) {
                console.log('\x1b[32m%s\x1b[0m', 'website is up and running');
                // openWebSite();
                LaunchWebsite(result)
            } else if (result.response_code == 301) {
                console.log('\x1b[34m%s\x1b[0m', 'website has been moved permanently but is up');
                LaunchWebsite(result)
            } else if (result.response_code == 302){
                console.log('\x1b[34m%s\x1b[0m', 'temporary redirect, website is up');
                LaunchWebsite(result)
            } else if (result.response_code == 403) {
                console.log('\x1b[33m%s\x1b[0m', 'information not found');
                LaunchWebsite(result)
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