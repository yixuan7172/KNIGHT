namespace KINGHT {
    export class Matrix {
        public a: number
        public b: number
        public c: number
        public d: number
        public tx: number
        public ty: number


        constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, tx: number = 0, ty: number = 0) {
            this.set(a, b, c, d, tx, ty)
        }

        //target =  other * this
        public append(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix {
            let ma: number = this.a, mb: number = this.b, mc: number = this.c, md: number = this.d
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
            let ma: number = this.a, mb: number = this.b, mc: number = this.c, md: number = this.d
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

        public translate(dx: number, dy: number): Matrix {
            this.tx += dx
            this.ty += dy
            return this
        }

        public scale(sx: number, sy: number): Matrix {
            if (sx !== 1) {
                this.a *= sx
                this.c *= sx
                this.tx *= sx
            }
            if (sy !== 1) {
                this.b *= sy
                this.d *= sy
                this.ty *= sy
            }
            return this
        }

        public rotate(angle: number): Matrix {
            angle %= 360
            if (angle !== 0) {
                let rad: number = _Math.deg2Rad(angle)
                let cos: number = Math.cos(rad),
                    sin: number = Math.sin(rad)
                let a: number = this.a, b: number = this.b,
                    c: number = this.c, d: number = this.d,
                    tx: number = this.tx, ty: number = this.ty
                this.a = a * cos - b * sin
                this.b = a * sin + b * cos
                this.c = c * cos - d * sin
                this.d = c * sin + d * cos
                this.tx = tx * cos - ty * sin
                this.ty = tx * sin + ty * cos
            }
            return this
        }

        public inverse(): Matrix {
            let a: number = this.a,
                b: number = this.b,
                c: number = this.c,
                d: number = this.d,
                tx: number = this.tx,
                ty: number = this.ty

            let n: number = a * d - b * c
            if (n === 0) return this
            n = 1 / n
            this.a = d * n
            this.b = -b * n
            this.c = -c * n
            this.d = a * n
            this.tx = (c * ty - d * tx) * n
            this.ty = -(a * ty - b * tx) * n
            return this
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