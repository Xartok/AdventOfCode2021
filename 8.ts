import * as fs from 'fs';
import { compact, difference, flatMap, intersection, invert, sum } from 'lodash';
import { log } from './utils';

const input: Array<{ encodedDigits: string[]; patterns: string[] }> = compact(
    fs.readFileSync('./8.txt', { encoding: 'utf-8' }).split('\n'),
).map(line => {
    const [patterns, encodedDigits] = line
        .split(' | ')
        .map(x => x.split(' '))
        .map(x => x.map(pattern => pattern.split('').sort().join('')));
    return { patterns, encodedDigits };
});

function part1(): void {
    const result = sum(
        flatMap(input, line =>
            line.encodedDigits.map(encodedDigit => ([2, 4, 3, 7].includes(encodedDigit.length) ? 1 : 0)),
        ),
    );
    log(result);
}

function part2(): void {
    const result = sum(
        input.map(line => {
            const one = line.patterns
                .find(pattern => pattern.length === 2)!
                .split('')
                .sort();
            const four = line.patterns
                .find(pattern => pattern.length === 4)!
                .split('')
                .sort();
            const seven = line.patterns
                .find(pattern => pattern.length === 3)!
                .split('')
                .sort();
            const eight = line.patterns
                .find(pattern => pattern.length === 7)!
                .split('')
                .sort();
            const zeroAndSixAndNine = line.patterns
                .filter(pattern => pattern.length === 6)
                .map(pattern => pattern.split('').sort());
            const twoAndThreeAndFive = line.patterns
                .filter(pattern => pattern.length === 5)
                .map(pattern => pattern.split('').sort());

            const cAndF = one;
            const six = zeroAndSixAndNine.find(digit => intersection(digit, cAndF).length === 1)!;
            const three = twoAndThreeAndFive.find(digit => intersection(digit, cAndF).length === 2)!;

            const aAndEandG = difference(eight, four);
            const two = twoAndThreeAndFive.find(
                digit => digit.join('') !== three.join('') && intersection(digit, aAndEandG).length === 3,
            )!;
            const five = twoAndThreeAndFive.find(
                digit => digit.join('') !== three.join('') && intersection(digit, aAndEandG).length === 2,
            )!;

            const d = intersection(two, three, four, five)[0];
            const nine = zeroAndSixAndNine.find(
                digit => digit.join('') !== six.join('') && digit.includes(d),
            )!;
            const zero = zeroAndSixAndNine.find(
                digit => digit.join('') !== six.join('') && !digit.includes(d),
            )!;

            const values = invert(
                [zero, one, two, three, four, five, six, seven, eight, nine].map(encodedDigit =>
                    encodedDigit.join(''),
                ),
            );
            return parseInt(line.encodedDigits.map(encodedDigit => values[encodedDigit]).join(''), 10);
        }),
    );
    log(result);
}

part1();
part2();
