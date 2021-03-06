let section_data = require('./data/sections.json')
let settings_data = require('./data/settings.json')
let user_data = require('./data/user_progress.json')
let definitions = require('./data/definitions.json')

var _ = require('lodash');


function genCharData() {
    let data = {}
    _.each(section_data.reduce((acc, item) => {
        return [ ...item.characters, ...acc]
    }, []), (x => {
        data[x] = { "review_level":Math.floor(Math.random()*5)}
    }))
    return data;
}

function genDefinitions() {
    return Object.entries(definitions).map(([key, value]) => 
        Object.assign(value, {id: key}))
}

module.exports = () => {
    return {
        sections: section_data,
        settings: settings_data,
        user: genCharData(),
        definitions: genDefinitions(),
    }
}