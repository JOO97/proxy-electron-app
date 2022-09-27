const path = require('path')
const childProcess = require('child_process')
const ipcMain = require('electron').ipcMain

const iconv = require('iconv-lite')

var mySpawn = []
// 收到消息, 打开进程
ipcMain.on('open-child-now', e => {
  console.log('打开进程-->mainProcessGet:')
  var spawn = childProcess.spawn(
    path.resolve(
      process.cwd(),
      './apps/visix-cityv-middleware/visix-cityv-middleware.exe'
    )
  )
  spawn.stdout.on('data', data => {
    e.sender.send('cs-reply', {
      type: 'data',
      content: iconv.decode(data, 'GBK'),
    })
  })

  mySpawn[mySpawn.length] = spawn
  e.sender.send('cs-reply', {
    type: 'msg',
    content: '进程打开成功',
  })
})

ipcMain.on('kill-child-now', e => {
  console.log('关闭进程-->mainProcessGet:')

  // 收到消息, 关闭所有进程
  for (let i = 0; i < mySpawn.length; i++) {
    mySpawn[i].kill()
  }
  mySpawn = []
  e.sender.send('cs-reply', {
    type: 'close',
    content: '进程关闭成功',
  })
})
