namespace KINGHT {
    function createCanvas(width?: number, height?: number): HTMLCanvasElement {
        let canvas: HTMLCanvasElement = document.createElement('canvas')
        if (width != void 0 && height != void 0) {
            canvas.width = width
            canvas.height = height
        }
        return canvas
    }

    export class WebGLRenderContext {
        /** 单例*/
        public static instance: WebGLRenderContext
        /** 抗锯齿*/
        public static antialias: boolean
        /** 渲染上下文*/
        public gl: WebGLRenderingContext
        /** 呈现最终绘图结果的画布*/
        public surface: HTMLCanvasElement

        /** 顶点数组管理器*/
        private vao: WebGLVertexArrayObject
        /** 绘制命令管理器*/
        public drawCmdManager: WebGLDrawCmdManager

        private currentBuffer: WebGLRenderBuffer

        constructor(width: number, height: number) {
        }

        public static getInstance(width: number, height: number): WebGLRenderContext {
            if (!this.instance) return new WebGLRenderContext(width, height)
            return this.instance
        }

    }
}