export const a = 123

import { StoreJson } from './jsonfile'
import { StoreData } from './store'

const file = new StoreJson('file')
const StoreFile = new StoreData(file)

const file2 = new StoreJson('file2')
const StoreFile2 = new StoreData(file2)

export { StoreFile, StoreFile2 }
