import ViewNode from '../components/ViewNode.js'
import UpdateNode from '../components/UpdateNode.js'
import AddNode from '../components/AddNode.js'

const ScreenRegistry = {
    'view' : ViewNode,
    'update' : UpdateNode,
    'add' : AddNode
}

export default ScreenRegistry