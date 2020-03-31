import path from 'path'

export default {
    run(handler){
        return async (...args) => {
            return {
                code: 0,
                msg: args[0]
            }
        }
    }
}
