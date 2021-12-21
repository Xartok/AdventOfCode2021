import * as fs from 'fs';
import { compact, range, sum } from 'lodash/fp';
import { log } from './utils';

const input: number[] = compact(fs.readFileSync('./6.txt', { encoding: 'utf-8' }).split('\n'))[0]
    .split(',')
    .map(Number);

function part1(): void {
    log(computeCounts(80));
}

function part2(): void {
    log(computeCounts(256));
}

part1();
part2();

function computeCounts(cycleCount: number): number {
    const fishCounts = range(0, 9).map((_, i) => input.filter(n => n === i).length);

    for (let _ of range(0, cycleCount)) {
        const currentFishCount = fishCounts.shift()!;
        fishCounts[6] += currentFishCount;
        fishCounts.push(currentFishCount);
    }

    return sum(fishCounts);
}
