import cat from './cat'


export default {
    run(handler){
        return async (...args) => {
            let msg = ''
            try{
                let t = (await cat.run(handler)(args[1])).msg
                msg = t.split('\n').filter(v => v.indexOf(args[0]) !== -1).join('\n')
            } catch(e) {
                msg = args[1].split('\n').filter(v => v.indexOf(args[0]) !== -1).join('\n')
            }
            return {
                code: 0,
                msg: msg
            }
        }
    }
}
