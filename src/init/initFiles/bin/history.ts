import SystemCommandHandler from "../../../handlers/SystemCommandHandler/CommandHandler/SystemCommandHandler";

export default {
    run(handler: SystemCommandHandler){
        return async () => {
            return {
                code: '',
                msg: handler.history.join('\n')
            }
        }
    }
}
