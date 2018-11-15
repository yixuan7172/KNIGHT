namespace KINGHT {
    //对象池
    let matrixPool: Matrix2D[] = []

    export class Matrix2D {
        public a: number
        public b: number
        public c: number
        public d: number
        public tx: number
        public ty: number


        constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, tx: number = 0, ty: number = 0) {
            this.a = a
            this.b = b
            this.c = c
            this.d = d
            this.tx = tx
            this.ty = ty
        }

        public static create(): Matrix2D {
            let matrix = matrixPool.pop()
            if (!matrix) {
                matrix = new Matrix2D()
            }
            return matrix
        }

        public static release(matrix: Matrix2D): void {
            if (!matrix) return
            matrixPool.push(matrix)
        }

        public clone(matrix: Matrix2D): Matrix2D {
            return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty)
        }

        public identity(): Matrix2D {
            this.a = this.d = 1
            this.b = this.c = this.tx = this.ty = 0
            return this
        }
    }
}