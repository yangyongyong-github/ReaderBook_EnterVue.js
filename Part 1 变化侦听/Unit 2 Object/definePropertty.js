/**
 * ## 2.2 如何追踪变化？
 * 定义一个响应式对象，封装Object.defineProperty
 */
function defineRecative(data, key, val) {
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            return val;
        },
        set: function (newVal) {
            if (val === newVal) return;
            val = newVal
        }
    })
}

/**
 * ## 2.3 如何收集依赖？
 * 
 * getter中收集依赖，setter中触发依赖
 * 
 * 在vue2.0中模板中使用数据等同于组件中使用数据，把用到地数据的地方收集起来，然后等属性发生变化时，把之前收集好的依赖村换触发一遍即可
 */

/**
 * ## 2.4 依赖收集在哪里？
 * 
 * 每个key都有一个数组，用来存储当前key的依赖，
 * 假设依赖是一个函数，存储在window.target上
 */
function defineRecative(data, key, val) {
    let dep = [];//存储被收集的依赖
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            dep.push(window.target) // here
            return val;
        },
        set: function (newVal) {
            if (val === newVal) return;
            // 在set被触发时，循环dep以触发收集到的依赖
            for (let i = 0; i < dep.length; i++) {
                dep[i](newVal, val)
            }
            val = newVal
        }
    })
}

// 以上有些耦合，我们分装为一个Dep类
// 收集到哪了？dep中
// ===================================================

/**
 * Dep类
 */
export default class Dep {
    constructor() {
        this.subs = []
    }

    addSub(sub) {
        this.subs.push(sub)
    }

    removeSub(sub) {
        remove(this.subs.sub, sub)

    }

    depend() {
        if (window.target) {
            this.addSub(window.target)
        }
    }

    notify() {
        const subs = this.subs.slice()
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update()
        }
    }

}

/**
 * utils func
 * remove
 */
function remove(arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item)
        if (index > -1) {
            return arr.splice(index, 1)
        }
    }
}


/**
 * use use potting(封装) class
 */
function defineRecative(data, key, val) {
    let dep = new Dep(); // use
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            dep.depend(); // use
            return val;
        },
        set: function (newVal) {
            if (val === newVal) return;
            val = newVal
            dep.notify() // use
        }
    })
}