
export function set(target, key, val) {
    /**
     * isValidArrayIndex 有效索引值
     */
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key)
        target.splice(key, 1, val) // 把val设置到target的指定位置(这时,数组拦截器会侦测到target发生了变化,自动将其转换为响应式)
        return val
    }

    // 如果key已存在在tarhet中, 该key已经被侦测了变化---修改数据
    if (key in target && !(key in Object.prototype)) {
        target[key] = val
        return val
    }

    // 新增
    const ob = target.__ob__  // 获取target的__ob__属性 (this.$data 根数据)
    // 判断target是不是vue实例 || 使用ob.vmCount判断它是不是根数据对象即可
    // (处理 "target不能是vue实例或者vue实例的根数据对象")
    if (target._isVue || (ob && ob.vmCount)) {
        process.env.NODE_ENV !== 'production' && warn(
            'Avoid adding reactive properties to a Vue instance or its root $data' +
            'at runtime - declare it upfront in the data option.'
        )
        return val

    }

    if (!ob) {
        target[key] = val
        return val
    }

    defineReactive(ob.value, key, val)
    ob.dep.notify()
    return val
}
