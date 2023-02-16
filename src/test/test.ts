
import {getPath, fsStat, fsMkdir, judgeDir, sureIsDir, deleteDirSync} from '@/router/controller/files-info/tools'
 async function handleTest ()  {
  const a = getPath('./test')
  const b = getPath('./test.txt')
  const c = getPath('./test2')
  // const rr = fsMkdir(c, true)
  // console.log('rr', rr)
  // // console.log('c', c)
  // const r1 =  await judgeDir(a, false)
  // const r2 =  await judgeDir(b, false)
  // const r3 =  await judgeDir(c, false)



  console.log(111)
  const ss = deleteDirSync(b)
  console.log(ss, 'ss')
  console.log(222)
}

// handleTest()
