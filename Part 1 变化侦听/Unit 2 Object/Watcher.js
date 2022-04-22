/**
 * Watcher 
 * 主动把自己添加到data,a.b.c的Dep中去，是不是很神奇？
 */

export default class Watcher {
    constructor(vm, expOrFu, cb) {
        this.vm = vm;
        // 执行this.getter() 读取data.a.b.中的内容
        this.getter = parsePath(expOrFu)
        this.cb = cb
        this.value = this.get()
    }

    get() {
        window.target = this // 当前的实例
        let value = this.getter.call(this.vm, this.vm)
        window.target = undefined
        return value
    }

    update() {
        const oldValue = this.value
        this.value = this.get()
        this.cb.call(this.vm, this.value, oldValue)
    }
}

// keypath
vm.$watch('a.b.c', fucntion(newVal, oldVal){
    // do something ...
})

/**
 * parsePath怎么读取一个keypath的？
 * 解析简单路劲
 */
const bailRE = /[^\w.$]/

export function parsePath(path) {

    if (bailRE.test(path)) return;

    const segments = path.split('.') // 用.分割为数组

    return function (obj) {
        // 循环数组，读取数据
        for (let i = 0; i < segments.length; i++) {
            if (!obj) return;
            obj = obj[segments[i]]
        }
        return obj; // keypath中想要拿取的数据
    }
}

/**
 * ## 2.7 递归侦测所有的key
 * 前面的代码只能侦测数据中的某一个属性，我们希望把数据中的属性（包含子属性）侦测到，使用一个Obsever类
 * 
 * 将是一个数据中的所有属性转换为setter/getter的形式，然后取追踪它们的变化
 */
export class Observer {
    constructor(value) {
        this.value = value
        if (!Array.isArray(value)) this.walk(value)
    }

    /**
     * walk会将每一个属性都转换为getter/setter的形式来侦测变化
     * 这个方法只有在数据类型为Object时被调用
     */
    walk(obj) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i], obj[keys[i]])
        }
    }
}

function defineRecative(data, key, val) {
    // 递归子属性
    if (typeof val === 'object') new Observer(val);

    let dep = new Dep();
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            dep.depend();
            return val;
        },
        set: function (newVal) {
            if (val === newVal) return;
            val = newVal
            dep.notify()
        }
    })
}


/**
 * 但是使用这种方式，有些数据变化是追踪不到的
 * 只能追踪一个数据是否被修改，无法追踪新增和删除
 * 因为ES6之前，JS没有提供【元编程】的能力，为此vue.js提供了两个API
 * vm.$set vm.$delete
 */

// 向Object中添加/删除一个属性
var vm = new Vue({
    el:'#el',
    template: '#demo',
    methods:{
        action(){
            this.obj.name='jack' // 新增
            delete this.obj.name // 删除
        }
    },
    data:{
          obj:{}
    }
})