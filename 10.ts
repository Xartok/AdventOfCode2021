import * as fs from 'fs';
import { compact, sum } from 'lodash';
import { log } from './utils';

const input: string[] = compact(fs.readFileSync('./10.txt', { encoding: 'utf-8' }).split('\n'));

function getOpeningChar(char: string): string {
    return new Map([
        [')', '('],
        [']', '['],
        ['}', '{'],
        ['>', '<'],
    ]).get(char)!;
}

function isClosingChar(char: string): boolean {
    return [')', ']', '}', '>'].includes(char);
}

function part1(): void {
    const result = sum(
        compact(
            input.map(line => {
                const stack: string[] = [];
                for (let char of line) {
                    if (isClosingChar(char)) {
                        const lastChar = stack.pop();
                        if (getOpeningChar(char) !== lastChar) {
                            return char;
                        }
                    } else {
                        stack.push(char);
                    }
                }
                return undefined;
            }),
        ).map(
            char =>
                new Map([
                    [')', 3],
                    [']', 57],
                    ['}', 1197],
                    ['>', 25137],
                ]).get(char)!,
        ),
    );
    log(result);
}

function getClosingChar(char: string): string {
    return new Map([
        ['(', ')'],
        ['[', ']'],
        ['{', '}'],
        ['<', '>'],
    ]).get(char)!;
}

function part2(): void {
    const sortedScores = compact(
        input.map(line => {
            const stack: string[] = [];
            for (let char of line) {
                if (isClosingChar(char)) {
                    const lastChar = stack.pop();
                    if (getOpeningChar(char) !== lastChar) {
                        return false;
                    }
                } else {
                    stack.push(char);
                }
            }
            return stack;
        }),
    )
        .map(stack => stack.reverse().map(getClosingChar))
        .map(missingChars => {
            let total = 0;
            for (let char of missingChars) {
                total =
                    total * 5 +
                    new Map([
                        [')', 1],
                        [']', 2],
                        ['}', 3],
                        ['>', 4],
                    ]).get(char)!;
            }
            return total;
        })
        .sort((a, b) => a - b);
    const result = sortedScores[Math.ceil(sortedScores.length / 2) - 1];
    log(result);
}

part1();
part2();
