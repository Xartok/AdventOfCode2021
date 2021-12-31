import * as fs from 'fs';
import { compact, range } from 'lodash/fp';
import { log } from './utils';

const input: string[][] = compact(fs.readFileSync('./25.txt', { encoding: 'utf-8' }).split('\n')).map(
    line => {
        return line.split('');
    },
);

function part1(): void {
    let stepNumber = 0;
    let newGrid = input;
    let moveCount = 0;
    do {
        [moveCount, newGrid] = move(newGrid);
        stepNumber++;
    } while (moveCount > 0);

    log(stepNumber);
}

part1();

function move(grid: typeof input): [number, typeof input] {
    const width = grid[0].length;
    const height = grid.length;
    const newGridAfterEastMoves = Array(height)
        .fill(undefined)
        .map(() => Array(width).fill('.'));
    let moveCount = 0;
    for (let y of range(0, height)) {
        for (let x of range(0, width)) {
            if (grid[y][x] === '>') {
                if (grid[y][(x + 1) % width] === '.') {
                    newGridAfterEastMoves[y][(x + 1) % width] = '>';
                    moveCount++;
                } else {
                    newGridAfterEastMoves[y][x] = '>';
                }
            } else if (grid[y][x] === 'v') {
                newGridAfterEastMoves[y][x] = 'v';
            }
        }
    }
    const newGridAfterSouthMoves = Array(height)
        .fill(undefined)
        .map(() => Array(width).fill('.'));
    for (let y of range(0, height)) {
        for (let x of range(0, width)) {
            if (newGridAfterEastMoves[y][x] === 'v') {
                if (newGridAfterEastMoves[(y + 1) % height][x] === '.') {
                    newGridAfterSouthMoves[(y + 1) % height][x] = 'v';
                    moveCount++;
                } else {
                    newGridAfterSouthMoves[y][x] = 'v';
                }
            } else if (newGridAfterEastMoves[y][x] === '>') {
                newGridAfterSouthMoves[y][x] = '>';
            }
        }
    }
    return [moveCount, newGridAfterSouthMoves];
}
