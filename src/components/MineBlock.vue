<script setup lang="ts">
import type { BlockState } from '~/types'
import { isDev } from '~/composables'

interface MineBlockProps {
  block: BlockState
}

defineProps<MineBlockProps>()
/**
 * 模块颜色
 */
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

/**
 * 获取指定块级的样式
 */
function getBlockClass(block: BlockState) {
  if (block.flagged)
    return 'bg-gray-500/10'
  if (!block.revealed)
    return 'bg-gray-500/10 hover:bg-gray-500/20'
  return block.mine ? 'text-red' : numberColor[block.adjacentMines]
}

</script>

<template>
  <button
    m="0.5"
    flex="~"
    items-center
    justify-center
    w-10
    h-10
    border="1 gray-400/10"
    :class="getBlockClass(block)"
  >
    <template v-if="block.flagged">
      <div i-mdi-flag text-red />
    </template>
    <template v-if="block.revealed || isDev">
      <div v-if="block.mine" i-mdi-mine />
      <div v-else>
        {{ block.adjacentMines === 0 ? '' : block.adjacentMines }}
      </div>
    </template>
  </button>
</template>
