import ViewNode from '../components/ViewNode.js'
import UpdateNode from '../components/UpdateNode.js'
import CreateNode from '../components/CreateNode.js'

const ScreenRegistry = {
    'view' : ViewNode,
    'update' : UpdateNode,
    'add' : CreateNode
}

export default ScreenRegistry