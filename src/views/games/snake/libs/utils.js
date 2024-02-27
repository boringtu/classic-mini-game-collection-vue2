// 判断两个坐标是否为同一个位置
export const coordinateComparison = ([x1, y1], [x2, y2]) => {
    return x1 === x2 && y1 === y2;
}

/**
 * 随机获取空闲位置
 */
export const getRandomEmptyPosition = (matrix) => {
    // 空闲坐标池
    const pool = [];
    // 矩阵的行数
    const yLen = matrix.length;
    // 矩阵的列数
    const xLen = matrix[0].length;
    for (let i = 0; i < yLen; i++) {
        for (let j = 0; j < xLen; j++) {
            if (!matrix[i][j]) {
                pool.push([j, i]);
            }
        }
    }
    // 随机获取一个空闲坐标
    return pool[Math.floor(Math.random() * pool.length)];
};
