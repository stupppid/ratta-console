export default {
    run(handler) {
        return async () => {
            return {
                code: 0,
                msg: await handler.store.state.getItem('account.currentPath')
            }
        }
    }
}

