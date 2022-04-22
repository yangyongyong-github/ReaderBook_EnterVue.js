import { parsePath } from "../Unit 2 Object/Watcher"

/**
 * 1
 */
Vue.prototype.$watch = function (expOrFn, cb, options) {
    const vm = this
    options = options || {}
    const watcher = new Watcher(vm, expOrFn, cb, options)

    if (options.immediate) cb.call(vm, watcher.value)

    return function unwachFn() {
        watcher.teardown()
    }
}

/**
 * 2
 */
export default class Watcher {
    constructor(vm, expOrFn, cb) {
        this.vm = vm

        if (typeof expOrFn === 'function') { // 函数可以收集多个依赖
            // 不仅可以动态返回数据，其中读取的数据也会被Watcher观察
            // computed实现原理同理
            this.getter = expOrFn
        } else {
            this.getter = parsePath(expOrFn) // keypatch 属性路径
        }

        this.cb = cb
        this.value = this.get()
    }
}

/**
 * 3
 */
export default class Watcher {
    constructor(vm, expOrFn, cb) {
        this.vm = vm
        this.deps = [];
        this.depIds = new Set()
        this.getter = parsePath(expOrFn)
        this.cb = cb
        this.value = this.get()
    }

    // ...

    addDep(dep) {
        const id = dep.id
        // 如果当前的Watcher没有订阅了该Dep
        if (!this.depIds.has(id)) {
            this.depIds.add(id)
            this.deps.push(dep)
            dep.addSub(this)
        }
    }
}


/**
 * 4
 */
let uid = 0;
export default class Dep {
    constructor() {
        this.id = uid++
        this.subs = []
    }
    // ...
    depend() {
        if (window.target) {
            window.target.addDep(this)
        }
    }
}

/**
 * utils func
 */
function teardown() {
    let i = this.deps.length
    while (i--) {
        this.deps[i].removeSub(this)
    }
}

export default class Dep {
    removeSub(sub) {
        const index = this.subs.indexOf(sub)
        if (index > -1) {
            return this.subs.splice(index, 1)
        }
    }
}

/**
 * deep参数的实现原理
 */

export default class Watcher {
    constructor(vm, expOrFn, cb, options) {
        this.vm = vm

        if (options) {
            this.deep = !!options.deep
        } else {
            this.deep = false
        }

        this.deps = [];
        this.depIds = new Set()
        this.getter = parsePath(expOrFn)
        this.cb = cb
        this.value = this.get()
    }

    get() {
        window.target = this
        let value = this.getter.call(vm, vm)

        if (this.deep) traverse(value)

        window.target = undefined // 一定要在这段代码之前去触发子值得收集依赖逻辑
        return value
    }
}

/**
 * 接下来, 要递归value的所有子值来触发它们收集依赖的功能
 */
const seenObjects = new Set()
export function traverse(val) {
    _traverse(val, seenObjects)
    seenObjects
}
// traverse 穿过,横贯的
function _traverse(val, seen) {
    let i, keys;
    const isArr = Array.isArray(val)

    // 如果不是数组或对象,或者已经被冻结,直接结束
    if ((!isArr && !isObject(val)) || Object.isFrozen(val)) return;

    if (val.__ob__) {
        const depId = val.__ob__.dep.id
        if (seen.has(depId)) return // 确保不会重复收集
        seen.add(depId)
    }

    if (isArr) {
        i = val.length
        while (i--) _traverse(val[i], seen)
    } else {
        // 如果是Object类型的数据,
        // 则循环其所有Key,然后执行一次读取操作,再递归子值
        keys = Object.keys(val)
        i = keys.length
        while (i--) _traverse(val[keys[i]], seen)
    }
}