
/**
 * brief 2.2
 */
function defineReactive(data, key, val) {
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
 * brief 2.4 依赖收集在哪里
 */
function defineReactive(data, key, val) {
    let dep = []; // 存储收集的依赖
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            dep.push(window.target); // 收集依赖
            return val;
        },
        set: function (newVal) {
            if (val === newVal) return;
            // 触发依赖
            for (let i = 0; i < dep.length; i++) {
                dep[i](newVal, val)
            }
            val = newVal
        }
    })
}