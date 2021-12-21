import * as fs from 'fs';
import { zip } from 'lodash';
import { compact, range } from 'lodash/fp';
import { log } from './utils';

type Coordinates = [number, number];

const input: Array<{
    from: Coordinates;
    to: Coordinates;
}> = compact(fs.readFileSync('./5.txt', { encoding: 'utf-8' }).split('\n'))
    .map(line => {
        const coordinates = line.split(' -> ');
        return [...coordinates[0].split(','), ...coordinates[1].split(',')].map(Number);
    })
    .map(([a, b, x, y]) => ({
        from: [a, b],
        to: [x, y],
    }));

function part1(): void {
    const map = new Map<string, number>();

    for (let entry of input) {
        const coordinatesToMark = getCoordinates(entry);
        for (let point of coordinatesToMark) {
            if (map.has(point.toString())) {
                map.set(point.toString(), map.get(point.toString())! + 1);
            } else {
                map.set(point.toString(), 1);
            }
        }
    }

    log(`part 1: ${Array.from(map.values()).filter(count => count >= 2).length}`);
}

function part2(): void {
    const map = new Map<string, number>();

    for (let entry of input) {
        const coordinatesToMark = getCoordinates(entry, true);
        for (let point of coordinatesToMark) {
            if (map.has(point.toString())) {
                map.set(point.toString(), map.get(point.toString())! + 1);
            } else {
                map.set(point.toString(), 1);
            }
        }
    }

    log(`part 2: ${Array.from(map.values()).filter(count => count >= 2).length}`);
}

part1();
part2();

export function getCoordinates(entry: { from: Coordinates; to: Coordinates }, withDiagonals: boolean = false): Coordinates[] {
    if (entry.from[0] === entry.to[0]) {
        const x = entry.from[0];
        const [min, max] = entry.from[1] < entry.to[1] ? [entry.from[1], entry.to[1]] : [entry.to[1], entry.from[1]];
        return range(0, max - min + 1)
            .map(n => min + n)
            .map(y => [x, y]);
    } else if (entry.from[1] === entry.to[1]) {
        const y = entry.from[1];
        const [min, max] = entry.from[0] < entry.to[0] ? [entry.from[0], entry.to[0]] : [entry.to[0], entry.from[0]];
        return range(0, max - min + 1)
            .map(n => min + n)
            .map(x => [x, y]);
    } else {
        return withDiagonals ? getCoordinatesWithDiagonals(entry) : [];
    }
}

function getCoordinatesWithDiagonals(entry: { from: Coordinates; to: Coordinates }): Coordinates[] {
    const [minX, maxX] = entry.from[0] < entry.to[0] ? [entry.from[0], entry.to[0]] : [entry.to[0], entry.from[0]];
    const [minY, maxY] = entry.from[1] < entry.to[1] ? [entry.from[1], entry.to[1]] : [entry.to[1], entry.from[1]];
    const xRange = range(0, maxX - minX + 1).map(n => minX + n);
    const yRange = range(0, maxY - minY + 1).map(n => minY + n);
    if (entry.to[0] - entry.from[0] !== entry.to[1] - entry.from[1]) yRange.reverse();
    return zip(xRange, yRange).map(([x, y]) => [x!, y!]);
}
