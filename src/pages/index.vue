<script setup lang="ts">
import { MineGame, isDev, useToggleDev } from '~/composables'

const play: MineGame = new MineGame(10, 10)
useStorage('minesweeper', play.state)
const state = computed(() => play.board)

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
        <MineBlock
          v-for="(block,x) in row"
          :key="x"
          :block="block"
          @click="play.onClick(block)"
          @contextmenu.prevent="play.onRightClick(block)"
        />
      </div>
    </div>
    <div flex="~ gap-2" align="content-center" justify="center">
      <button p2 text-blue border="1 blue-500 rounded-2" @click="useToggleDev()">
        {{ isDev ? "DEV" : "NORMAL" }}
      </button>
      <button p2 text-blue border="1 blue-500 rounded-2" @click="play.reset()">
        RESET
      </button>
    </div>
  </div>
</template>
