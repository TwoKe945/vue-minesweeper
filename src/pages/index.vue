<script setup lang="ts">

interface BlockState {
  x: number
  y: number
  revealed?: boolean
  mine?: boolean
  flagged?: boolean
  adjacentMines: number
}

const WIDTH = 10
const HEIGHT = 10

const state = reactive(
  Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH }, (_, x): BlockState => ({
      x,
      y,
      adjacentMines: 0,
      revealed: false,
      flagged: false,
    })),
  ),
)
const numberColor = [
  'text-transparent',
  'text-blue-500',
  'text-green-500',
  'text-yellow-500',
  'text-orange-500',
  'text-red-500',
  'text-purple-500',
  'text-pink-500',
  'text-teal-500',
]

function getBlockClass(block: BlockState) {
  if (block.flagged)
    return 'bg-gray-500/10'
  if (!block.revealed)
    return 'bg-gray-500/10 hover:bg-gray-500/20'
  return block.mine ? 'text-red' : numberColor[block.adjacentMines]
}

function generateMines(current: BlockState) {
  for (const row of state) {
    for (const block of row) {
      if (Math.abs(block.x - current.x) <= 1)
        continue
      if (Math.abs(block.y - current.y) <= 1)
        continue
      block.mine = Math.random() < 0.3
    }
  }
  updateNumbers()
}

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

function updateNumbers() {
  state.forEach((raw, y) => {
    raw.forEach((block, x) => {
      if (block.mine) return
      getNeighbor(block).forEach((item) => {
        if (item.mine)
          block.adjacentMines += 1
      })
    })
  })
}

function getNeighbor(block: BlockState): BlockState[] {
  return directions.map(([dy, dx]) => {
    const x2 = block.x + dx
    const y2 = block.y + dy
    if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT)
      return undefined
    else
      return state[y2][x2]
  }).filter(Boolean) as BlockState[]
}

let mineGenerated = false
const dev = ref(false)

const fail = ref(false)

function expendZero(block: BlockState) {
  if (block.adjacentMines || block.mine)
    return
  getNeighbor(block).forEach((item) => {
    if (!item.revealed) {
      if (!item.flagged)
        item.revealed = true
      expendZero(item)
    }
  })
}

function onRightClickHandler(block: BlockState) {
  if (block.revealed)
    return
  block.flagged = !block.flagged
  checkGameState()
}

function onClickHandler(block: BlockState) {
  if (block.flagged)
    return
  if (!mineGenerated) {
    generateMines(block)
    mineGenerated = true
  }
  state[block.y][block.x].revealed = true
  if (block.mine) {
    alert('BOOOM!')
    fail.value = true
  }
  else {
    expendZero(block)
  }
  checkGameState()
}

function checkGameState() {
  const blocks = state.flat()
  if (blocks.every(block => block.revealed || block.flagged)) {
    if (blocks.every(block => block.flagged && !block.mine))
      alert('You cheat!')
    else
      alert('You win!')
  }
}
</script>

<template>
  <div>
    Minesweeper

    <div p5>
      <div
        v-for="(row,y) in state"
        :key="y"
        flex="~"
        items-center
        justify-center
      >
        <button
          v-for="(item,x) in row"
          :key="x"
          m="0.5"
          flex="~"
          items-center
          justify-center
          w-10
          h-10
          border="1 gray-400/10"
          :class="getBlockClass(item)"
          @click="() => onClickHandler(item)"
          @contextmenu.prevent="() => onRightClickHandler(item)"
        >
          <template v-if="item.flagged">
            <div i-mdi-flag text-red />
          </template>
          <template v-if="item.revealed || fail || dev">
            <div v-if="item.mine" i-mdi-mine />
            <div v-else>
              {{ item.adjacentMines === 0 ? '' : item.adjacentMines }}
            </div>
          </template>
        </button>
      </div>
    </div>

    <div>
      <button p2 text-blue border="1 blue-500 rounded-2" @click="() => dev = !dev">
        {{ dev ? "开发环境" : "正式环境" }}
      </button>
    </div>
  </div>
</template>
