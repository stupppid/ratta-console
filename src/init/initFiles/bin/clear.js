export default {
     run(handler){
        return async() => {
            handler.inputEl.value = ''
            return {
                code: 0
            }
        }
    }
}

