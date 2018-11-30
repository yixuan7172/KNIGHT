namespace KINGHT {
    /**
     * 一个webgl渲染目标，拥有一个frame，一个buffer和一个texture
     */
    export class WebGLRenderTarget {
        /** 渲染上下文*/
        private gl: WebGLRenderingContext

        /**
         * 存储这绘制结果的texture
         */
        public texture: WebGLTexture

        private frameBuffer: WebGLFramebuffer

        private stencilBuffer: WebGLRenderBuffer

        /**
         * render target 的尺寸，与texture，framebuffer，stencibuffer的尺寸一致
         */
        public width: number
        public height: number

        /** 清除色*/
        public clearColor: number[] = [0, 0, 0, 0]

        /**
         * 是否启用framebuffer，默认为true
         */
        public useFrameBuffer: boolean = true

        constructor(gl: WebGLRenderingContext, width: number, height: number) {
            this.gl = gl
            //若尺寸为0，Chrome会报警
            this.width = width || 1
            this.height = height || 1
        }

        /**
         * 重置render target的尺寸
         */
        public resize(width: number, height: number): void {
            const gl = this.gl
            this.width = width
            this.height = height
            if (!!this.frameBuffer) {
                //设置texture尺寸
                gl.bindTexture(gl.TEXTURE_2D, this.texture)
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
                gl.bindTexture(gl.TEXTURE_2D, null)
            }
            if (!!this.stencilBuffer) {
                gl.deleteRenderbuffer(this.stencilBuffer)
                this.stencilBuffer = null
            }
        }

        public initFrameBuffer(): void {
            if (!this.frameBuffer) {
                const gl = this.gl
                //创建材质
                this.texture = this.createTexture()
                //创建framebuffer
                this.frameBuffer = gl.createFramebuffer()
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)

                //绑定材质
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0)
            }
        }

        /**
         * 获取framebuffer
         */
        private getFrameBuffer(): WebGLFramebuffer {
            if (!this.useFrameBuffer) return null
            return this.frameBuffer
        }

        /**
         * 创建材质
         * TODO：创建材质的方法可以合并
         */
        public createTexture(): WebGLTexture {
            const gl = this.gl
            let texture: WebGLTexture = gl.createTexture()
            texture['glContext'] = gl
            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
            return texture
        }

    }
}