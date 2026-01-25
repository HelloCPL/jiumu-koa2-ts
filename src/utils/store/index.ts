import { StoreJson } from './jsonfile'
import { StoreData } from './store'

const storeJson = new StoreJson('store-json')
const store = new StoreData(storeJson)

export { store }
