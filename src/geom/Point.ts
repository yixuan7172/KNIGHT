namespace KINGHT {
    export class Point {
        public x: number
        public y: number

        constructor(x: number = 0, y: number = 0) {
            this.set(x, y)
        }

        public set(x: number, y: number): Point {
            this.x = x
            this.y = y
            return this
        }

        public length(): number {
            return Math.sqrt(this.x * this.x + this.y * this.y)
        }

        public clone(): Point {
            return new Point(this.x, this.y)
        }

        public copy(point: Point): Point {
            this.x = point.x
            this.y = point.y
            return this
        }

        public add(point: Point): Point {
            return new Point(this.x + point.x, this.y + point.y)
        }

        public offset(dx: number, dy: number): Point {
            this.x += dx
            this.y += dy
            return this
        }

        public sub(point: Point): Point {
            return new Point(this.x - point.x, this.y - point.y)
        }

        public equals(point: Point): boolean {
            return this.x === point.x && this.y === point.y
        }

        public distance(point: Point): number {
            return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2))
        }

        public toString(): string {
            return `[Point(x=${this.x},y=${this.y})]`
        }
    }
}