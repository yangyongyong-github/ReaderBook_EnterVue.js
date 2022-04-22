import { arrayMethods, observe } from "./拦截器"

    ;['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
        const original = arrayMethods[method]

        def(arrayMethods, method, function mutator(...args) {
            const result = original.apply(this, args)
            const ob = this.__ob__

            let inserted; // temp save new element
            switch (method) {
                case 'push':
                case 'unshift':
                    inserted = args
                case 'splice':
                    inserted = args.slice(2)
                    break;
            }

            if (inserted) {
                ob.observeArray(inserted) // 侦测这些新增元素发生的变化
            }

            ob.dep.notify();
            return result;
        })
    })



// 如何在拦截中访问Observer实例

/**
 * utils func : def
 */
function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurableL: true
    })
}


export class Observer {
    constructor(value) {
        this.value = value;
        def(value, '__ob__', this)

        if (Array.isArray(value)) this.observeArray(value)
        else this.walk(value)
    }

    observeArray(items) {
        for (let i = 0; i < items.length; i++) {
            observe(items[i]) // 为每一个子元素创建一个 实例对象
        }
    }
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
    return ob;
}