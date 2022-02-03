import * as fs from 'fs';
import { Set } from 'immutable';
import { maxBy } from 'lodash';
import { log } from './utils';

type FoldingInstruction = { axis: 'x' | 'y'; value: number };
class Point {
    private constructor(public readonly x: number, public readonly y: number) {}

    public static of(x: Point['x'], y: Point['y']) {
        return new Point(x, y);
    }

    public valueOf(this: Point): string {
        return `${this.x},${this.y}`;
    }
}

const [pointLines, instructionLines] = fs
    .readFileSync('./13.txt', { encoding: 'utf-8' })
    .trim()
    .split('\n\n')
    .map(x => x.split('\n'));
const points = Set<Point>(
    pointLines.map(point => {
        const [x, y] = point.split(',').map(Number);
        return Point.of(x, y);
    }),
);
const foldingInstructions: FoldingInstruction[] = instructionLines.map(line => {
    const [axis, value] = line.slice(11).split('=');
    return { axis: axis as FoldingInstruction['axis'], value: Number(value) };
});

function part1(): void {
    console.time('part1');
    const result = getFoldedGrid(points, foldingInstructions[0]).size;

    log(result);
    console.timeEnd('part1');
}

function getFoldedGrid(initialGrid: Set<Point>, foldingInstruction: FoldingInstruction): typeof initialGrid {
    return Set(
        initialGrid
            .toArray()
            .filter(point => point[foldingInstruction.axis] !== foldingInstruction.value)
            .map(point => {
                if (point[foldingInstruction.axis] < foldingInstruction.value) {
                    return point;
                }

                let distanceToAxis = Math.abs(foldingInstruction.value - point[foldingInstruction.axis]);
                let newCoordinate =
                    point[foldingInstruction.axis] > foldingInstruction.value
                        ? foldingInstruction.value - distanceToAxis
                        : point[foldingInstruction.axis];
                return Point.of(
                    foldingInstruction.axis === 'x' ? newCoordinate : point.x,
                    foldingInstruction.axis === 'x' ? point.y : newCoordinate,
                );
            }),
    );
}

function part2(): void {
    console.time('part2');
    const foldedGrid = foldingInstructions.reduce(getFoldedGrid, points);
    const maxX = maxBy(foldedGrid.toArray().map(point => point.x))!;
    const maxY = maxBy(foldedGrid.toArray().map(point => point.y))!;
    const displayedGrid = Array.from(Array(maxY + 1)).map(() => Array(maxX + 1).fill(' '));
    for (const point of foldedGrid.toArray()) {
        displayedGrid[point.y][point.x] = '#';
    }

    log(displayedGrid.map(line => line.join('')).join('\n'));
    console.timeEnd('part2');
}

part1();
part2();
