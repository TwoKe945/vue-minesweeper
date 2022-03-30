
import type { Ref } from 'vue'
import type { BlockState } from '~/types'

/**
 * 方向
 */
const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [0, -1],
]

interface GameState {
  board: BlockState[][]
  mineGenerated: boolean
}

export class MineGame {
  state = ref() as Ref<GameState>

  public constructor(public width: number = 5, public height: number = 5) {
    this.reset(width, height)
  }

  get board(): BlockState[][] {
    return this.state.value.board
  }

  get blocks(): BlockState[] {
    return this.state.value.board.flat()
  }

  /**
   * 重置游戏盘
   */
  reset(width = this.width, height = this.height) {
    this.height = height
    this.width = width
    this.state.value = {
      board: Array.from({ length: this.height }, (_, y) =>
        Array.from({ length: this.width }, (_, x): BlockState => ({
          x,
          y,
          adjacentMines: 0,
          revealed: false,
          flagged: false,
        })),
      ),
      mineGenerated: false,
    }
  }

  private showAllMines() {
    this.blocks.filter(block => block.mine && !block.revealed).forEach(block => block.revealed = true)
  }

  /**
   * 生成游戏地图
   * @param current  当前块
   */
  private generateMines(current: BlockState) {
    for (const row of this.board) {
      for (const block of row) {
        if (Math.abs(block.x - current.x) <= 1)
          continue
        if (Math.abs(block.y - current.y) <= 1)
          continue
        block.mine = Math.random() < 0.3
      }
    }
    this.updateNumbers()
  }

  /**
   * 更新周围地雷数量
   */
  private updateNumbers() {
    this.board.forEach((raw: BlockState[]) => {
      raw.forEach((block) => {
        if (block.mine) return
        this.getNeighbor(block).forEach((item) => {
          if (item.mine)
            block.adjacentMines += 1
        })
      })
    })
  }

  /**
   *  获取周围的块
   * @param block
   * @returns
   */
  private getNeighbor(block: BlockState): BlockState[] {
    return directions.map(([dy, dx]) => {
      const x2 = block.x + dx
      const y2 = block.y + dy
      if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height)
        return undefined
      else
        return this.board[y2][x2]
    }).filter(Boolean) as BlockState[]
  }

  /**
   *  展开周围没有地雷的块
   * @param block 当前块
   * @returns void
   */
  private expendZero(block: BlockState) {
    if (block.adjacentMines || block.mine)
      return
    this.getNeighbor(block).forEach((item) => {
      if (!item.revealed) {
        if (!item.flagged)
          item.revealed = true
        this.expendZero(item)
      }
    })
  }

  /**
   *  排雷
   * @param block 点击的块
   * @returns
   */
  onRightClick(block: BlockState) {
    if (block.revealed)
      return
    this.board[block.y][block.x].flagged = !block.flagged
    this.checkGameState()
  }

  /**
   * 点击游戏盘
   * @param block 点击的块
   * @returns
   */
  onClick(block: BlockState) {
    if (block.flagged)
      return
    if (!this.state.value.mineGenerated) {
      this.generateMines(block)
      this.state.value.mineGenerated = true
    }
    this.board[block.y][block.x].revealed = true
    if (block.mine) {
      alert('BOOOM!')
      this.showAllMines()
    }
    else { this.expendZero(block) }
    this.checkGameState()
  }

  /**
   * 检查游戏是否成功！
   */
  private checkGameState() {
    if (this.blocks.every((block: BlockState) => block.revealed || block.flagged)) {
      if (this.blocks.every((block: BlockState) => block.flagged && !block.mine)) {
        alert('You cheat!')
        this.showAllMines()
      }
      else { alert('You win!') }
    }
  }
}
