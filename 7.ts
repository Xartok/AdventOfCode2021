import * as fs from 'fs';
import { compact, range, sum } from 'lodash/fp';
import { log } from './utils';

const input: number[] = compact(fs.readFileSync('./7.txt', { encoding: 'utf-8' }).split('\n'))[0]
    .split(',')
    .map(Number);

function part1(): void {
    function computeFuelCostForTarget(target: number): number {
        return sum(input.map(distanceToPoint(target)));
    }

    const allCosts = range(Math.min(...input), Math.max(...input) + 1).map(computeFuelCostForTarget);
    log(Math.min(...allCosts));
}

function part2(): void {
    function computeFuelCostForTarget(target: number): number {
        return sum(
            input.map(position => {
                const distance = distanceToPoint(target)(position);
                return (distance * (distance + 1)) / 2;
            }),
        );
    }

    const allCosts = range(Math.min(...input), Math.max(...input) + 1).map(computeFuelCostForTarget);
    log(Math.min(...allCosts));
}

part1();
part2();

function distanceToPoint(position: number): (point: number) => number {
    return point => Math.abs(position - point);
}
