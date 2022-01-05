import * as fs from 'fs';
import { compact, countBy, entries, max, min, values } from 'lodash';
import { aperture } from 'ramda';
import { log } from './utils';

const lines = compact(fs.readFileSync('./14.txt', { encoding: 'utf-8' }).split('\n'));
const template = lines[0];
const insertionRules = new Map(
    lines.slice(1).map<[string, string]>(line => {
        const [key, value] = line.split(' -> ');
        return [key, value];
    }),
);

function part1(): void {
    let polymer = template.split('');
    let newPolymer: string[];
    for (let step = 0; step < 10; step++) {
        newPolymer = [];
        for (let i = 0; i < polymer.length - 1; i++) {
            newPolymer.push(polymer[i]);
            const pair = polymer[i] + polymer[i + 1];
            if (insertionRules.has(pair)) {
                newPolymer.push(insertionRules.get(pair)!);
            }
        }
        newPolymer.push(polymer[polymer.length - 1]);
        polymer = newPolymer;
    }
    const characterByOccurrences = countBy(polymer);
    const result = max(values(characterByOccurrences))! - min(values(characterByOccurrences))!;
    log(result);
}

function part2(): void {
    const characterByOccurrences = countBy(template.split(''));
    let pairsByOccurrenceCount = new Map<string, number>(
        entries(countBy(aperture(2, template.split('')), pair => pair.join(''))),
    );
    for (let step = 0; step < 40; step++) {
        let newPairsByOccurrenceCount = new Map<string, number>();
        for (let [pair, occurrenceCount] of entries(pairsByOccurrenceCount)) {
            const insertedChar = insertionRules.get(pair)!;
            const [newPair1, newPair2] = [pair[0] + insertedChar, insertedChar + pair[1]];
            newPairsByOccurrenceCount.set(
                newPair1,
                occurrenceCount + (newPairsByOccurrenceCount.get(newPair1) ?? 0),
            );
            newPairsByOccurrenceCount.set(
                newPair2,
                occurrenceCount + (newPairsByOccurrenceCount.get(newPair2) ?? 0),
            );
            characterByOccurrences[insertedChar] =
                (characterByOccurrences[insertedChar] ?? 0) + occurrenceCount;
        }
        pairsByOccurrenceCount = newPairsByOccurrenceCount;
    }
    const result = max(values(characterByOccurrences))! - min(values(characterByOccurrences))!;
    log(result);
}

part1();
part2();
