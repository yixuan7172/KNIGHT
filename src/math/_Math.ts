class _Math {
    constructor() {
    }

    public static deg2Rad(deg: number): number {
        return deg * Math.PI / 180
    }

    public static rad2Deg(rad: number): number {
        return rad * 180 / Math.PI
    }

    //返回low ~ high之间的随机整数
    public static randInt(low, high): number {
        if (low > high) return
        return low + Math.floor(Math.random() * (high - low + 1));
    }

    //返回low ~ high之间的随机浮点数
    public static randFloat(low, high): number {
        if (low > high) return
        return low + Math.random() * (high - low);
    }

    //判断是否是2的幂
    public static isPowerOfTwo(value): boolean {
        return (value & (value - 1)) === 0 && value !== 0;
    }

    public static arrayMin(arr: Array<number>): number {
        let len = arr.length
        if (len <= 0) return Infinity
        let min = arr[0]
        for (let i = 1; i < len; ++i) {
            if (min > arr[i]) min = arr[i]
        }
        return min
    }

    public static arrayMax(arr: Array<number>): number {
        let len = arr.length
        if (len <= 0) return -Infinity
        let max = arr[0]
        for (let i = 1; i < len; ++i) {
            if (max < arr[i]) max = arr[i]
        }
        return max
    }
}

export default _Math;
