import * as fs from 'fs';
import * as readline from 'readline';

/**
 * process file line by line
 * @param dataSource path to the source file
 * @return array with lines read from the input file
 */
export async function loadFileLineByLine(dataSource: string): Promise<string[]> {

    const { dirname } = require('path');
    const appDir = dirname(require.main.filename);
    const fileStream = fs.createReadStream(appDir + dataSource);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineArray = [];

    for await (const line of rl) {
        lineArray.push(line)
    }
    return lineArray;
}
