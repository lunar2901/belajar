// convert_data.js
const fs = require('fs');

// 1. Paste your existing raw arrays here (I'm using a placeholder for brevity, 
//    but you should copy the full contents of rawData, batch2, batch3, etc. from your current file)
const allRawData = [
    // ... Copy paste the content of 'rawData' array here ...
    "sein | to be | ist, war, ist gewesen | Fundamental verb for identity. | Er ist mein bester Freund. ~ He is my best friend. | dasein:to be there:Ich bin gleich da. - I will be there right away. + zusammensein:to be together:Wir sind endlich zusammen. - We are finally together.",
    // ... Copy paste batch2, batch3, etc here ...
];

// If you have multiple arrays (batch2, batch3), concatenate them before running this:
// const fullList = [...rawData, ...batch2, ...batch3, ...batch4, ...batch5]; 
// For this script, just assume 'allRawData' contains EVERYTHING.

const cleanData = allRawData.map((entry, index) => {
    try {
        const parts = entry.split("|").map(s => s.trim());
        if (parts.length < 5) return null; // Skip empty lines

        // Parse Conjugation (ist, war, ist gewesen)
        const conj = parts[2] ? parts[2].split(",").map(s => s.trim()) : ["", "", ""];

        // Parse Examples (German ~ English)
        const examples = parts[4] ? parts[4].split("~").map(s => s.trim()) : ["", ""];

        // Parse Variations (variation:meaning:example + variation:...)
        let variations = [];
        if (parts[5]) {
            variations = parts[5].split("+").map(v => {
                const vParts = v.split(":");
                return {
                    verb: vParts[0] ? vParts[0].trim() : "",
                    meaning: vParts[1] ? vParts[1].trim() : "",
                    example: vParts[2] ? vParts[2].trim() : ""
                };
            });
        }

        return {
            id: index + 1,
            root: parts[0],
            meaning: parts[1],
            conjugation: {
                present: conj[0] || "",
                past: conj[1] || "",
                perfect: conj[2] || ""
            },
            usageNote: parts[3],
            example: {
                de: examples[0] || "",
                en: examples[1] || ""
            },
            variations: variations
        };
    } catch (e) {
        console.error("Error parsing line:", entry);
        return null;
    }
}).filter(x => x !== null);

// Generate the file content
const fileContent = `// REMASTERED V8 - Auto-generated
const verbList = ${JSON.stringify(cleanData, null, 4)};

export default verbList; // Or "module.exports = verbList;" depending on your setup
`;

// Write the new file
fs.writeFileSync('words_new.js', fileContent);
console.log(`Success! Converted ${cleanData.length} verbs to words_new.js`);
