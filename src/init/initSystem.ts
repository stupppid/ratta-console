import {state, RtDB, RtFile, RtAccount, ACCOUNT_TYPE, RT_FILE_TYPE} from "ratta/src/index";


export interface IInitSystemObject {
    root: {
        name: string
        password: string
    }
    device: {
        name: string
        render: string // todo 是否安装桌面
    }
    init: boolean
}

// todo store 应该有直接全局直接用的地方
async function initSystem(initObject: IInitSystemObject) {
    const db = new RtDB()
    await db.accounts.clear()
    await db.files.clear()
    await db.states.clear()
    localStorage.clear()
    sessionStorage.clear()
    if (initObject.init) {
        await db.transaction('rw', [db.accounts, db.files, db.states], function () {
            db.accounts.add(new RtAccount({type: ACCOUNT_TYPE.ROOT, name: initObject.root.name, password: initObject.root.password})).then(async (r) => {
                let account = await db.accounts.get(r)
                await state.setItem('$CURRENT_ACCOUNT', {
                    id: r,
                    name: account.name
                }, 1)
                await state.setItem('$SYSTEM', {
                    render: initObject.device.render,
                    name: initObject.device.name
                })
                db.files.bulkAdd([new RtFile({
                    absolutePath: '/',
                    type: RT_FILE_TYPE.FOLDER
                }), new RtFile({
                    absolutePath: '/home',
                    type: RT_FILE_TYPE.FOLDER
                }), new RtFile({
                    absolutePath: `/home/${initObject.root.name}`,
                    type: RT_FILE_TYPE.FOLDER
                }), new RtFile({
                    absolutePath: '/etc',
                    type: RT_FILE_TYPE.FOLDER
                }), new RtFile({
                    absolutePath: '/etc/profile',
                    type: RT_FILE_TYPE.FILE,
                    content: ''
                })]).then()
            })
        }).then(r => {
            state.setItem('account.currentPath', `/home/${initObject.root.name}`)
        }).catch(e => {
            console.error(e)
        })
    }
}

export default initSystem

