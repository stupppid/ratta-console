/**
 * 登录
 */
import {IStore} from "../index";
import {IStep} from "../handlers/SystemCommandHandler/StepHandler";

export function *loginSteps(store:IStore) {
    let step:IStep[]
    let wrongPasswordTime = 0
    let failed = false
    let loginObj: {
        name: string,
        password: string
    } = {
        name: '',
        password: '',
    }
    let startSteps = [
        {
            tip: () => {
                if(failed) {
                    wrongPasswordTime++
                    return `\n\ninput wrong password\nlogin: `
                } else {
                    return '\nlogin: '
                }
            },
            answer: async function (answer:string):Promise<boolean> {
                if(answer.trim() !== '') {
                    loginObj.name = answer
                } else {
                    failed = true
                }
                return true
            }
        },
        {
            tip: "\npassword: ",
            answer: function (answer:string):Promise<void> {
                loginObj.password = answer.trim()
                return store.accountController.login(loginObj.name, loginObj.password).then(r => {
                    if(r === undefined) {
                        failed = true
                        step.push(...startSteps)
                    } else {
                        store.state.setItem('$CURRENT_ACCOUNT',r, 1)
                    }
                })
            }
        }
    ]
    step = [...startSteps]
    while (step.length > 0) {
        yield step.shift()
    }
}
