import * as fs from 'fs';
import { compact, flatMap, flatten } from 'lodash';
import { log } from './utils';

type ValuedCoordinates = { rowIndex: number; colIndex: number; value: number };

const input: number[][] = compact(fs.readFileSync('./11.txt', { encoding: 'utf-8' }).split('\n')).map(line =>
    line.split('').map(Number),
);
const height = input.length;
const width = input[0].length;

function getNeighbours(rowIndex: number, colIndex: number, lines: typeof input): ValuedCoordinates[] {
    return compact([
        rowIndex > 0 && colIndex > 0
            ? { value: lines[rowIndex - 1][colIndex - 1], rowIndex: rowIndex - 1, colIndex: colIndex - 1 }
            : undefined,
        rowIndex > 0 ? { value: lines[rowIndex - 1][colIndex], rowIndex: rowIndex - 1, colIndex } : undefined,
        rowIndex > 0 && colIndex < width - 1
            ? { value: lines[rowIndex - 1][colIndex + 1], rowIndex: rowIndex - 1, colIndex: colIndex + 1 }
            : undefined,
        colIndex > 0 ? { value: lines[rowIndex][colIndex - 1], rowIndex, colIndex: colIndex - 1 } : undefined,
        colIndex < width - 1
            ? { value: lines[rowIndex][colIndex + 1], rowIndex, colIndex: colIndex + 1 }
            : undefined,
        rowIndex < height - 1 && colIndex > 0
            ? { value: lines[rowIndex + 1][colIndex - 1], rowIndex: rowIndex + 1, colIndex: colIndex - 1 }
            : undefined,
        rowIndex < height - 1
            ? { value: lines[rowIndex + 1][colIndex], rowIndex: rowIndex + 1, colIndex }
            : undefined,
        rowIndex < height - 1 && colIndex < width - 1
            ? { value: lines[rowIndex + 1][colIndex + 1], rowIndex: rowIndex + 1, colIndex: colIndex + 1 }
            : undefined,
    ]);
}

function doFlashes(grid: typeof input): [typeof input, number] {
    let newGrid = grid.slice();
    const queue = flatMap(grid, (line, rowIndex) =>
        compact(line.map((value, colIndex) => (value > 9 ? [rowIndex, colIndex] : undefined))),
    );
    let flashCount = 0;
    while (queue.length > 0) {
        const [y, x] = queue.pop()!;
        if (newGrid[y][x] > 9) {
            flashCount++;
            const neighbours = getNeighbours(y, x, newGrid).filter(neighbour => neighbour.value <= 9);
            for (let neighbour of neighbours) {
                newGrid[neighbour.rowIndex][neighbour.colIndex]++;
                if (newGrid[neighbour.rowIndex][neighbour.colIndex] > 9) {
                    queue.unshift([neighbour.rowIndex, neighbour.colIndex]);
                }
            }
        }
    }

    return [newGrid, flashCount];
}

function part1(): void {
    let totalFlashCount = 0;
    let newFlashCount = 0;
    let newGrid = input.slice();
    for (let step = 1; step <= 100; step++) {
        newGrid = newGrid.map(line => line.map(n => 1 + n));
        [newGrid, newFlashCount] = doFlashes(newGrid);
        newGrid = newGrid.map(line => line.map(n => (n > 9 ? 0 : n)));
        totalFlashCount += newFlashCount;
    }
    log(totalFlashCount);
}

function part2(): void {
    let newGrid = input.slice();
    let done = false;
    let step = 0;
    while (!done) {
        step++;
        newGrid = newGrid.map(line => line.map(n => 1 + n));
        [newGrid] = doFlashes(newGrid);
        newGrid = newGrid.map(line => line.map(n => (n > 9 ? 0 : n)));
        done = flatten(newGrid).every(n => n === 0);
    }
    log(step);
}

part1();
part2();
