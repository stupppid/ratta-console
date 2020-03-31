import StepHandler, {IStep} from "../handlers/SystemCommandHandler/StepHandler";
import {IStore} from "../index";
import {CommonInputHandler} from "../handlers/CommonInputHandler";
import initSystem, {IInitSystemObject} from "./initSystem";

/**
 * 初始化
 */
export function *initSystemStep(store:IStore, stepHandler: StepHandler) {
    let initObject:IInitSystemObject = {
        root: {
            name: '',
            password: ''
        },
        device: {
            name: '',
            render: 'consoleView'
        },
        init: false
    }

    let wrongPassword:boolean = false
    const passwordExp = /^[a-zA-Z0-9_]{6,32}$/
    const passwordStep = {
        tip: () => `\n${wrongPassword ? 'Your password: Must be between 6 and 32 characters long, combined by letters, numbers or underscore\n' : ''}what's your admin's password?    `,
        answer: async function (answer:string) {
            if(!passwordExp.test(answer)) {
                wrongPassword = true
                step.unshift(passwordStep)
            } else {
                initObject.root.password = answer
                await initSystem(initObject)
            }
        }
    }

    let wrongAdminName:boolean = false
    const nameExp = /^[a-zA-Z0-9_]{4,16}$/
    const adminNameStep = {
        tip: () => `\n${wrongAdminName ? 'Your admin\'s name: Must be between 4 and 16 characters long, combined by letters, numbers or underscore\n' : ''}what's your admin's name?(root)    `,
        answer: async function (answer:string) {
            if(!nameExp.test(answer) && answer.length > 0) {
                wrongAdminName = true
                step.unshift(adminNameStep)
            } else {
                initObject.root.name = answer || 'root'
            }
        }
    }

    let wrongPCName:boolean = false
    const pcNameStep = {
        tip: () =>`\n${wrongPCName ? "Your pc's name: Must be between 4 and 16 characters long, combined by letters, numbers or underscore\n" : ''}what's your computer's name?(ratta)    `,
        answer: async function (answer:string) {
            if(!nameExp.test(answer) && answer.length > 0) {
                wrongPCName = true
                step.unshift(pcNameStep)
            } else {
                initObject.device.name = answer || 'ratta'
            }
        }
    }
    let step:IStep[] = [
        {
            tip: "it's the first time to run ratta, it will use some space of your disk, continue?(y)    ",
            answer: async function (answer:string) {
                if(answer.toLowerCase().startsWith('y') || answer.length < 1) {
                    initObject.init = true
                } else {
                    step.splice(0, step.length, {
                        tip: `\nthe answer is '${answer}', nothing would happen, or refresh the page to try again?\n`,
                        answer: (a:string) => {}
                    })
                    stepHandler.nextHandler = new CommonInputHandler(stepHandler.store, stepHandler.inputEl, stepHandler.inputProxy)
                }
            },
        },
        pcNameStep,
        adminNameStep,
        passwordStep
    ]
    while (step.length > 0) {
        yield step.shift()
    }
}

