namespace KINGHT {
    export class Rectangle {
        /**矩形左上角X坐标*/
        public x: number
        /**矩形左上角Y坐标*/
        public y: number
        /**矩形宽度*/
        public width: number
        /**矩形高度*/
        public height: number

        constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
            this.set(x, y, width, height)
        }

        /**矩形左上角X坐标。更改Rectangle的left属性对y和height没有影响。但是会影响width属性*/
        public set left(value: number) {
            this.width += this.x - value
            this.x = value
        }

        public get left(): number {
            return this.x
        }

        /**矩形左上角Y坐标。*/
        public set top(value: number) {
            this.height += this.y - value
            this.y = value
        }

        public get top(): number {
            return this.y
        }

        public set right(value: number) {
            this.width = value - this.x
        }

        /**x和width的和*/
        public get right(): number {
            return this.x + this.width
        }

        public set bottom(value: number) {
            this.height += value - this.y
        }

        public get bottom(): number {
            return this.y + this.height
        }

        /**由x，y确定Rectangle的左上角位置*/
        public set topLeft(value: Point) {
            this.left = value.x
            this.top = value.y
        }

        public get topLeft(): Point {
            return new Point(this.left, this.top)
        }

        public set bottomRight(value: Point) {
            this.right = value.x
            this.bottom = value.y
        }

        public get bottomRight(): Point {
            return new Point(this.right, this.bottom)
        }

        public copy(rect: Rectangle): Rectangle {
            this.x = rect.x
            this.y = rect.y
            this.width = rect.width
            this.height = rect.height
            return this;
        }

        public clone(): Rectangle {
            return new Rectangle(this.x, this.y, this.width, this.height)
        }

        public set(x: number, y: number, width: number, height: number): Rectangle {
            this.x = x
            this.y = y
            this.width = width
            this.height = height
            return this
        }

        /**指定是否包含x,y坐标*/
        public contains(x: number, y: number): boolean {
            return (this.left <= x && x <= this.right
                && this.top <= y && y <= this.bottom)
        }

        /**
         * 检测是否包含指定的点
         */
        public containsPoint(point: Point): boolean {
            return this.contains(point.x, point.y)
        }

        /**
         * 指定是否包含一个由rect参数组成的Rectangle对象
         */
        public containsRect(rect: Rectangle): boolean {
            return (
                // rect的left 大于等于 this.left 且 小于this.right
                rect.left >= this.left && rect.left < this.right &&
                // rect的top 大于等于 this.top 且 小于 this.bottom
                rect.top >= this.top && rect.top < this.bottom &&
                // rect的right 小于等于 this.right 且 大于 this.left
                rect.right <= this.right && rect.right > this.left &&
                // rect的bottom 小于等于 this.bottom 且 大于 this.top
                rect.bottom <= this.bottom && rect.bottom > this.top
            )
        }

        public isEmpty(): boolean {
            return this.width <= 0 || this.height <= 0
        }

        public setEmpty(): Rectangle {
            this.x = 0
            this.y = 0
            this.width = 0
            this.height = 0
            return this
        }

        public equals(rect: Rectangle): boolean {
            if (this === rect) return true
            return (
                this.x === rect.x &&
                this.y === rect.y &&
                this.width === rect.width &&
                this.height === rect.height
            )
        }

        public offset(x: number, y: number): Rectangle {
            this.x += x
            this.y += y
            return this
        }

        public offsetPoint(point: Point): Rectangle {
            return this.offset(point.x, point.y)
        }

        /**
         * 并集
         */
        public union(toUnion: Rectangle): Rectangle {
            let result = this.clone()
            if (toUnion.isEmpty()) return result
            if (result.isEmpty()) {
                result.copy(toUnion)
                return result
            }
            let minX: number = Math.min(result.x, toUnion.x)
            let minY: number = Math.min(result.y, toUnion.y)
            let width: number = Math.max(result.right, toUnion.right) - minX
            let height: number = Math.max(result.bottom, toUnion.bottom) - minY
            return result.set(minX, minY, width, height)
        }

        /**
         * 交集
         */
        public intersection(toIntersectRect: Rectangle): Rectangle {
            let result: Rectangle = this.clone()

            if (result.isEmpty() || toIntersectRect.isEmpty()) {
                return result.setEmpty()
            }
            const min: any = Math.min, max: any = Math.max
            const maxX: number = max(this.x, toIntersectRect.x)
            const maxY: number = max(this.y, toIntersectRect.y)
            const width: number = min(this.right, toIntersectRect.right) - maxX
            const height: number = min(this.bottom, toIntersectRect.bottom) - maxY

            if (width <= 0 || height <= 0) return result.setEmpty()

            return result.set(maxX, maxY, width, height)
        }

        /**
         * 判断两个矩形是否相交
         */
        public isIntersects(toIntersectRect: Rectangle): boolean {
            return (
                Math.max(this.x, toIntersectRect.x) <= Math.min(this.right, toIntersectRect.right) &&
                Math.max(this.y, toIntersectRect.y) <= Math.min(this.bottom, toIntersectRect.bottom)
            )
        }

        /**
         * 保持Rectangle的中心不变，使用dx横向增加它的宽度，使用dy纵向增加它的高度。
         */
        public inflate(dx: number, dy: number): Rectangle {
            this.x -= dx
            this.width += 2 * dx
            this.y -= dy
            this.height += 2 * dy
            return this
        }

        public toString(): string {
            return `[Rectangle(x=${this.x},y=${this.y},width=${this.width},height=${this.height})]`
        }
    }
}
