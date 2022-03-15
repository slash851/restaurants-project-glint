import {convertAMto24, getTextTillNumber, mapDayToInt} from '../utils/common.utils';

export function parseLine(line) {
    const name = line.slice(0, line.indexOf(',')).replace('"', '').replace('"', '');
    const openingGroups = line.slice(line.indexOf(',') + 1, line.length).replace('"', '').split('/');

    let pairs = []
    openingGroups.forEach(group => {
            let daysGroup = getTextTillNumber(group);
            const timeFromAndTo = group.slice(daysGroup.length, group.length).replace('"', '').split('-')


            daysGroup.split(',').forEach(day => {

                let dd = day.trim().split('-')

                // case of date range Mon-Wed
                if (dd.length > 1) {

                    const dayFrom = mapDayToInt(dd[0])
                    const dayTo = mapDayToInt(dd[1])

                    if (dayFrom < dayTo) {
                        // Mon-Fri
                        for (let i = dayFrom; i <= dayTo; i++) {
                            pairs.push({
                                name: name,
                                day: i,
                                dayString: day.trim(),
                                openAt: convertAMto24(timeFromAndTo[0]),
                                closeAt: convertAMto24(timeFromAndTo[1])
                            });
                        }
                    } else {
                        // Fri - Tue
                        // split to Friday - Sunday and Monday Tuesday
                        for (let i = dayFrom; i <= 6; i++) {
                            pairs.push({
                                name: name,
                                day: i,
                                dayString: day.trim(),
                                dd: dd,
                                openAt: convertAMto24(timeFromAndTo[0]),
                                closeAt: convertAMto24(timeFromAndTo[1])
                            });
                        }
                        for (let i = 0; i <= dayTo; i++) {
                            pairs.push({
                                name: name,
                                day: i,
                                dayString: day.trim(),
                                dd: dd,
                                openAt: convertAMto24(timeFromAndTo[0]),
                                closeAt: convertAMto24(timeFromAndTo[1])
                            });
                        }
                    }


                } else {
                    pairs.push({
                        name: name,
                        day: mapDayToInt(day.trim()),
                        dayString: day.trim(),
                        dd: dd,
                        openAt: convertAMto24(timeFromAndTo[0]),
                        closeAt: convertAMto24(timeFromAndTo[1])
                    });
                }


            })
        }
    )
    return pairs;
}
