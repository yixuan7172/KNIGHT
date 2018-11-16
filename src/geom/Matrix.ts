namespace KINGHT {
    //对象池
    let matrixPool: Matrix[] = []

    export class Matrix {
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

        public static create(): Matrix {
            let matrix = matrixPool.pop()
            if (!matrix) {
                matrix = new Matrix()
            }
            return matrix
        }

        public static release(matrix: Matrix): void {
            if (!matrix) return
            matrixPool.push(matrix)
        }

        //target =  other * this
        public append(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix {
            let ma = this.a, mb = this.b, mc = this.c, md = this.d
            if (a !== 1 || b !== 0 || c !== 0 || d !== 1) {
                this.a = ma * a + mc * b
                this.b = mb * a + md * b
                this.c = ma * c + mc * d
                this.d = mb * c + md * d
            }
            this.tx = ma * tx + mc * ty + this.tx
            this.ty = mb * tx + md * ty + this.ty
            return this
        }

        //target = this * other
        public prepend(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix {
            let ma = this.a, mb = this.b, mc = this.c, md = this.d
            if (a !== 1 || b !== 0 || c !== 0 || d !== 1) {
                this.a = a * ma + c * mb
                this.b = b * ma + d * mb
                this.c = a * mc + c * md
                this.d = b * mc + d * md
            }
            this.tx = a * this.tx + c * this.ty + tx
            this.tx = b * this.tx + d * this.ty + ty
            return this
        }

        public appendMatrix(matrix: Matrix): Matrix {
            return this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty)
        }

        public prependMatrix(matrix: Matrix): Matrix {
            return this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty)
        }


        public clone(matrix: Matrix): Matrix {
            return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty)
        }

        public identity(): Matrix {
            return this.set(1, 0, 0, 1, 0, 0)
        }

        public isIdentity(): boolean {
            return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0
        }

        public set(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix {
            this.a = a != null ? a : 1
            this.b = b || 0
            this.c = c || 0
            this.d = d != null ? d : 1
            this.tx = tx || 0
            this.ty = ty || 0
            return this
        }

        public equals(other: Matrix): boolean {
            return this.a === other.a &&
                this.b === other.b &&
                this.c === other.c &&
                this.d === other.d &&
                this.tx === other.tx &&
                this.ty === other.ty
        }

        public copy(other: Matrix): Matrix {
            return this.set(other.a, other.b, other.c, other.d, other.tx, other.ty)
        }

        public toString(): string {
            return `[Matrix(a=${this.a},b=${this.b},c=${this.c},d=${this.d},tx=${this.tx},ty=${this.ty})]`
        }
    }
}