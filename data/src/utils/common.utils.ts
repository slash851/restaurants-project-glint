import * as moment from 'moment';

/**
 * functions get text up to first number found
 * @param {string} text
 * @return {string}
 */
export function getTextTillNumber(text: string): string {
    return text.match(/^\D+/)[0];
}

/**
 * converting time from AM/PM format to 24h format
 * @param text
 */
export function convertAMto24(text: string): string {
    return moment(text.trim(), ['h:mm A']).format('HH:mm:ss');
}

/**
 * may day values to number values
 * @param {string} day
 * @return {number} return converted day to number
 */
export function mapDayToInt(day: string): number {
    switch (day.trim().toLowerCase().slice(0, 3)) {
        case 'mon':
            return 0;
        case 'tue':
            return 1;
        case 'wed':
            return 2;
        case 'thu':
            return 3;
        case 'fri':
            return 4;
        case 'sat':
            return 5;
        case 'sun':
            return 6;
    }
}
