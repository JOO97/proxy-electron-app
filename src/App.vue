<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { ipcRenderer } from 'electron'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

const terminal = new Terminal()
const fitAddon = new FitAddon()
terminal.loadAddon(fitAddon)
fitAddon.fit()

onMounted(() => {
  nextTick(() => {
    terminal.open(document.getElementById('terminal') as HTMLElement)
  })
})

const logs = ref<string[]>([])

interface IMsg {
  type: string
  content: string
}

ipcRenderer.on('cs-reply', (e, msg: IMsg) => {
  console.log('cs-reply', msg)
  console.log('terminal', terminal)
  if (msg.type === 'close') {
    terminal.clear()
  }
  msg.content && terminal.write(msg.content.replace('\n', ''))
})

const handleClick = (status: boolean) => {
  ipcRenderer.send(`${status ? 'open' : 'kill'}-child-now`)
}
</script>

<template>
  <div>
    <button @click="handleClick(true)">start</button>
    <button @click="handleClick(false)">close</button>
  </div>
  <div id="terminal" />
</template>

<style></style>
