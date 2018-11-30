namespace KINGHT {
    export class WebGLUtils {
        private static canUseWebGL: boolean

        constructor() {

        }

        public static compileProgram(gl: WebGLRenderingContext, vertexSrc: string, framSrc: string): WebGLProgram {
            let fragmentShader: WebGLShader = this.compileFragmentShader(gl, framSrc)
            let vertexShader: WebGLShader = this.compileVertexShader(gl, vertexSrc)
            let program: WebGLProgram = gl.createProgram()
            gl.attachShader(program, vertexShader)
            gl.attachShader(program, fragmentShader)
            gl.linkProgram(program)
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.log("program not linked!")
                console.log(gl.getProgramInfoLog(program))
                gl.deleteProgram(program)
                return null
            }
            return program
        }

        public static compileFragmentShader(gl: WebGLRenderingContext, shadersource: string): WebGLShader {
            return this.__compileShader(gl, shadersource, gl.FRAGMENT_SHADER)
        }

        public static compileVertexShader(gl: WebGLRenderingContext, shadersource: string): WebGLShader {
            return this.__compileShader(gl, shadersource, gl.VERTEX_SHADER)
        }

        private static __compileShader(gl: WebGLRenderingContext, shadersource: string, shaderType: number): WebGLShader {
            let shader: WebGLShader = gl.createShader(shaderType)
            gl.shaderSource(shader, shadersource)
            gl.compileShader(shader)
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.log("shader not compiled!")
                console.log(gl.getShaderInfoLog(shader))
                gl.deleteShader(shader)
                return null
            }
            return shader
        }

        public static checkCanUseWebGL(): boolean {
            if (this.canUseWebGL == void 0) {
                try {
                    let canvas = document.createElement('canvas')
                    this.canUseWebGL = !!window['WebGLRenderingContext'] && !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
                } catch (e) {
                    this.canUseWebGL = false
                }
            }
            return this.canUseWebGL
        }
    }
}