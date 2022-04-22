
/**
 * 调用push,实际上调用的是arrayMethods.push(即mutator)
 * 因此，我们可以在mutator中做一些事情
 */

const arrayProto = Array.prototype

/**
 * 重写原型上的部分需要侦测的方法
 */
export const arrayMethods = Object.create(arrayProto)

    ;['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach((method) => {
        // cache origin methods
        const original = arrayProto[method]

        Object.defineProperty(arrayMethods, method, {
            value: function mutator(...args) {
                return original.apply(this, args)
            },
            enumerable: false, // 不可枚举
            writable: true,
            configurable: true,
        })
    })

/**
 * # 3.3 使用拦截原型覆盖Array原型
 * 我们希望拦截器只针对那些被侦测变化了的数据生效（只覆盖那些响应式数组的原型）
 */
export class Observer {
    constructor(value) {
        this.value = value;
        if (Array.isArray(value)) { // Array使用我们自己覆盖的原型
            value.__prototype__ = arrayMethods
        } else {
            this.walk(value) // Object仍然使用以前的监听方式
        }
    }
}

// __prototype__ 其实是 Object.getPrototypeOf和Object.setPrototypeOf的早期实现
// 只是目前浏览器支持不是很好



/**
 * 将拦截器方法挂载到数组属性上
 * vue处理办法：
 *      如果(由于浏览器支持原因)不能使用__proto__，就直接将arrayMethods身上的这些方法设置到被侦测的数组上
 */
import { arrayMethods } from './array'

// __proto__是否可用
const hasProto = '__proto__' in {}
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

export class Observer {
    constructor(value) {
        this.value = value
        // this.dep = new Dep()
        if (Array.isArray(value)) {
            // hasProto : 判断当前浏览器是否支持__proto__
            const augment = hasProto ? protoAugment : copyAugment
            augment(value, arrayMethods, arrayKeys)
        } else {
            this.walk(value)
        }
    }
    // ...
}

function protoAugment(target, src, keys) {
    target.__proto__ = src
}

/**
 * 将已经加工了的拦截器操做的原型方法直接添加到value属性中
 */
function copyAugment(target, src, keys) {
    for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i]
        def(target, key, src[key])
    }
}

/**
 * 收集依赖
 */


/**
 *  use use potting(封装) class
 */
function defineRecative(data, key, val) {
    let dep = new Dep(); // use
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            dep.depend();
            // 这里将要收集依赖
            return val;
        },
        set: function (newVal) {
            if (val === newVal) return;
            val = newVal
            dep.notify() // use
        }
    })
}


/**
 * 依赖列表存放在哪里： Obverser
 */
export class Obverser {
    constructor(value) {
        this.dep = new Dep()
        if (Array.isArray(value)) {
            const copyAugment = hasProto ? protoAugment : copyAugment
            augment(value, arrayMethods, arrayKeys)
        } else {
            this.walk(value)
        }
    }
    // ...
}

// 数组的依赖(dep)保存的位置：一定要在getter和拦截器中都可以访问到，所以存在Obverser中
// 在getter中开始收集依赖

/**
 * ## 3.7 收集依赖
 */
function defineReactive(data, key, val) {

    let childOb = observe(val) // 修改
    let dep = new Dep()

    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,

        get: function () {
            dep.depend()

            if (childOb) childOb.dep.depend
            return val
        },

        set: function (newVal) {
            if (val === newVal) return;

            dep.notify()
            val = newVal
        }
    })
}

/**
 * 尝试为value创建一个实例
 * 如果创建成功,直接返回该实例(如果已经是响应式的,则无需再次创建Obverser实例, 避免了重复侦测value值问题)
 * 如果value已存在一个实力,则直接返回
 */
export function observe(value, asRootData) {
    if (!isObject(value)) return;

    let ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__
    } else {
        ob = new Observer(value)
    }
    return ob
}

/**
 * 数组为什么在getter中收集依赖? 而defineReactive函数中的val很有可能是一个数组
 * 通过obverse我们得到了数组的Observer实例(childOb), 最后通过childOb的dep执行depend来收集依赖
 * 通过这样,可以收集数组依赖
 */

/**
 * 在拦截器中获取Observer实例
 * 如何在拦截中访问Observer实例
 */

/**
 * utils func
 * def
 */
function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}

export class Observer {
    constructor(value) {
        this.value = value
        this.dep = new Dep()
        def(value, '__ob__', this)

        if (Array.isArray(value)) {
            const augment = hasProto ? protoAugment : copyAugment
            augment(value, arrayMethods, arrayKeys)
        } else {
            this.walk(value)
        }
    }
}

// 通过数组的__ob__属性拿到Observer实例,然后可以拿到__ob__上的dep
// __ob__作用:(1) 拦截其中访问Observer实例(2)标记当前的value是否已被Observer转换为响应式
// 所有被侦测了变化的数据身上都有一个__ob__
// 当value身上呗标记了__ob__之后,可以通过vlaue.__ob__来访问Observer实例


/**
 * ## 3.9 向数组中的依赖发送通知
 */
;['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach((method) => {
    // cache origin methods
    const original = arrayProto[method]

    def(arrayMethods, method, function mutator(...args) {
        const result = original.apply(this, args)
        const ob = this.__ob__
        ob.dep.notify() // 向依赖发送消息(去通知依赖Watcher数据发生了变化)
        return result;
    })
})

/**
 * 3.10 侦测数组中元素的变化
 * 数组中object身上的某个属性发生变化了之后也是需要侦测的
 */

// 1. 如何侦测所有数据子集的变化

export class Observer {
    constructor(value) {
        this.value = value
        def(value, '__ob__', this)

        if (Array.isArray(value)) this.observeArray(value)
        else this.walk(value)
    }

    /**
     * 侦测Array中的每一项
     */
    observeArray(items) {
        for (let i = 0, l = items.length; i < l; i++) {
            observe(items[i]) // 将数组中的每一个元素执行一遍new Observer
        }
    }
}

// 2. 如何侦测新增元素的变化

// (1) 获取新增元素
;['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach((method) => {
    // cache origin methods
    const original = arrayProto[method]

    def(arrayMethods, method, function mutator(...args) {
        const result = original.apply(this, args)
        const ob = this.__ob__

        let inserted;// 暂存新增元素
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break;
            case 'splice':
                inserted = args.slice(2)
                break;
        }
        if(inserted) ob.observeArray(inserted) // 侦测这些新增元素的变化

        ob.dep.notify() // (2)向依赖发送消息(去通知依赖Watcher数据发生了变化)
        return result;
    })
})
