import { getCoordinates } from './5';

describe('getCoordinates', () => {
    it('should get correct result horizontally', () => {
        // arrange
        const x = 0;
        const fromY = 0;
        const toY = 5;
        // act
        const actual = getCoordinates({ from: [x, fromY], to: [x, toY] });
        // assert
        expect(actual).toEqual([
            [0, 0],
            [0, 1],
            [0, 2],
            [0, 3],
            [0, 4],
            [0, 5],
        ]);
    });
    it('should get correct result vertically', () => {
        // arrange
        const y = 0;
        const fromX = 0;
        const toX = 5;
        // act
        const actual = getCoordinates({ from: [fromX, y], to: [toX, y] });
        // assert
        expect(actual).toEqual([
            [0, 0],
            [1, 0],
            [2, 0],
            [3, 0],
            [4, 0],
            [5, 0],
        ]);
    });
    it('should get correct result diagonally when x increases and y decreases symetrically', () => {
        // arrange
        const fromX = 0;
        const fromY = 5;
        const toX = 5;
        const toY = 0;
        // act
        const actual = getCoordinates({ from: [fromX, fromY], to: [toX, toY] }, true);
        // assert
        expect(actual).toEqual([
            [0, 5],
            [1, 4],
            [2, 3],
            [3, 2],
            [4, 1],
            [5, 0],
        ]);
    });
    it('should get correct result diagonally when x increases and y decreases asymetrically', () => {
        // arrange
        const fromX = 1;
        const fromY = 5;
        const toX = 4;
        const toY = 2;
        // act
        const actual = getCoordinates({ from: [fromX, fromY], to: [toX, toY] }, true);
        // assert
        expect(actual).toEqual([
            [1, 5],
            [2, 4],
            [3, 3],
            [4, 2],
        ]);
    });
    it('should get correct result diagonally when x decreases and y increases symetrically', () => {
        // arrange
        const fromX = 5;
        const fromY = 0;
        const toX = 0;
        const toY = 5;
        // act
        const actual = getCoordinates({ from: [fromX, fromY], to: [toX, toY] }, true);
        // assert
        expect(actual).toEqual([
            [0, 5],
            [1, 4],
            [2, 3],
            [3, 2],
            [4, 1],
            [5, 0],
        ]);
    });
    it('should get correct result diagonally when x decreases and y increases asymetrically', () => {
        // arrange
        const fromX = 5;
        const fromY = 2;
        const toX = 0;
        const toY = 7;
        // act
        const actual = getCoordinates({ from: [fromX, fromY], to: [toX, toY] }, true);
        // assert
        expect(actual).toEqual([
            [0, 7],
            [1, 6],
            [2, 5],
            [3, 4],
            [4, 3],
            [5, 2],
        ]);
    });
    it('should get correct result diagonally when both x and y increase with same starting values', () => {
        // arrange
        const fromX = 1;
        const fromY = 1;
        const toX = 3;
        const toY = 3;
        // act
        const actual = getCoordinates({ from: [fromX, fromY], to: [toX, toY] }, true);
        // assert
        expect(actual).toEqual([
            [1, 1],
            [2, 2],
            [3, 3],
        ]);
    });
    it('should get correct result diagonally both x and y increase with different starting values', () => {
        // arrange
        const fromX = 1;
        const fromY = 2;
        const toX = 3;
        const toY = 4;
        // act
        const actual = getCoordinates({ from: [fromX, fromY], to: [toX, toY] }, true);
        // assert
        expect(actual).toEqual([
            [1, 2],
            [2, 3],
            [3, 4],
        ]);
    });
});
