import { StoreJson } from './jsonfile'
import { StoreData } from './store'

const project = new StoreJson('project')
const storeProject = new StoreData(project)

// storeProject.set('name', '小米')

export { storeProject }
