import {InputProxy} from "../../InputProxy";
import CommandHandler from "../CommandHandler/CommandHandler";
import {CommonInputHandler} from "../../CommonInputHandler";
import {IStore} from "../../../index";

export interface IStep {
    tip: (()=>string) | string
    answer: (answer:string)=>any
}

/**
 * handler可以从inputProxy中获取stdin和stdout
 * 从store中获取数据
 */
export default class StepHandler extends CommandHandler{
    inputProxy: InputProxy;
    store:IStore  // 文件 文件内容 账户 环境变量 cs 的数据
    inputEl:HTMLTextAreaElement

    steps: Generator<IStep, IStep, string>
    lastStep: IteratorResult<IStep, IStep>
    nextHandler: CommonInputHandler
    constructor(store:IStore, inputEl:HTMLTextAreaElement, inputProxy: InputProxy, steps: any, nextHandler:CommonInputHandler = null) {
        super(store, inputEl, inputProxy)
        this.steps = steps(store, this) as Generator<IStep, IStep, string>
        this.commandHandler = this.nextStep
        this.nextHandler = nextHandler
    }

    init(): void {
        this.lastStep = this.steps.next()
        this.printTip(this.lastStep.value.tip)
    }

    private printTip(tip: (()=>string) | string ) {
        if(typeof this.lastStep.value.tip === "string") {
            this.print(this.lastStep.value.tip)
        } else {
            this.print(this.lastStep.value.tip())
        }
    }

    nextStep(command:string | null) {
        if(!this.lastStep.done) {
            this.lastStep.value.answer(command.trim()).then((r) => {
                    this.lastStep = this.steps.next(command.trim())
                    if (this.lastStep.done) {
                        if(this.nextHandler !== null) {
                            this.inputProxy.replaceHandler(this.nextHandler)
                        } else {
                            this.inputProxy.popHandler()
                        }
                    } else {
                        if (this.lastStep.value.tip instanceof Function) {
                            this.printTip(this.lastStep.value.tip())
                        } else {
                            this.printTip(this.lastStep.value.tip)
                        }
                    }
                }
            )
        }
    }
}
