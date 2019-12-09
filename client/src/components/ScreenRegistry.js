import ViewNode from '../components/ViewNode.js'
import UpdateNode from '../components/UpdateNode.js'
import CreateNode from '../components/CreateNode.js'
import Message from '../components/Message.js'

const ScreenRegistry = {
    'view' : ViewNode,
    'update' : UpdateNode,
    'add' : CreateNode,
    'home' : Message
}

export default ScreenRegistry