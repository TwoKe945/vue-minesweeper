export interface BlockState {
  x: number // 横坐标
  y: number // 纵坐标
  revealed?: boolean // 是否翻转
  mine?: boolean // 是否是地雷
  flagged?: boolean // 是否插旗
  adjacentMines: number // 周围的地雷数
}
