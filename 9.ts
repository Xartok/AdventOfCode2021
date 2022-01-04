import * as fs from 'fs';
import { compact, differenceWith, flatMap, sum, uniqBy } from 'lodash';
import { log } from './utils';

type ValuedCoordinates = { rowIndex: number; colIndex: number; value: number };

const input: number[][] = compact(fs.readFileSync('./9.txt', { encoding: 'utf-8' }).split('\n')).map(line =>
    line.split('').map(Number),
);
const height = input.length;
const width = input[0].length;

function part1(): void {
    function getRiskLevel(height: number): number {
        return 1 + height;
    }

    const result = sum(
        getLowPoints(input)
            .map(x => x.value)
            .map(getRiskLevel),
    );
    log(result);
}

function getLowPoints(lines: typeof input): Array<ValuedCoordinates> {
    function isLowPoint(lines: typeof input, rowIndex: number, value: number, colIndex: number): boolean {
        return getNeighbours(rowIndex, colIndex, lines)
            .map(neighbour => neighbour.value)
            .every(neighbour => value < neighbour);
    }

    return flatMap(input, (line, rowIndex) => {
        return compact(
            line.map((value, colIndex) =>
                isLowPoint(lines, rowIndex, value, colIndex) ? { rowIndex, colIndex, value } : undefined,
            ),
        );
    });
}

function getNeighbours(rowIndex: number, colIndex: number, lines: typeof input): ValuedCoordinates[] {
    return compact([
        rowIndex > 0 ? { value: lines[rowIndex - 1][colIndex], rowIndex: rowIndex - 1, colIndex } : undefined,
        colIndex > 0 ? { value: lines[rowIndex][colIndex - 1], rowIndex, colIndex: colIndex - 1 } : undefined,
        colIndex < width - 1
            ? { value: lines[rowIndex][colIndex + 1], rowIndex, colIndex: colIndex + 1 }
            : undefined,
        rowIndex < height - 1
            ? { value: lines[rowIndex + 1][colIndex], rowIndex: rowIndex + 1, colIndex }
            : undefined,
    ]);
}

function part2(): void {
    function getBasin(
        point: ValuedCoordinates,
        lines: typeof input,
        visitedPoints: ValuedCoordinates[],
    ): ValuedCoordinates[] {
        visitedPoints.push(point);
        const neighbours = differenceWith(
            getNeighbours(point.rowIndex, point.colIndex, lines),
            visitedPoints,
            (neighbour, visitedPoint) =>
                neighbour.colIndex === visitedPoint.colIndex && neighbour.rowIndex === visitedPoint.rowIndex,
        );
        let basin: ValuedCoordinates[] = [point];
        for (let neighbour of neighbours) {
            if (neighbour.value < 9 && neighbour.value > point.value) {
                basin.push(...getBasin(neighbour, lines, visitedPoints));
            }
        }
        return basin;
    }

    const visitedPoints: ValuedCoordinates[] = [];
    const lowPoints = getLowPoints(input);
    const basins = lowPoints.map(point => getBasin(point, input, visitedPoints));
    const result = basins
        .map(basin => uniqBy(basin, point => `${point.rowIndex},${point.colIndex}`))
        .map(x => x.length)
        .sort((a, b) => a - b)
        .slice(-3)
        .reduce(Math.imul);
    log(result);
}

part1();
part2();
