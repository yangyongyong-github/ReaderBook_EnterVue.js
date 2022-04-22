
export function del(target, key) {
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.splice(key, 1) // 使用了我们侦测的splice方法,会被触发侦听
        // 如果根数据ob.vmCount的数量大于1,直接返回,终止运行
        return
    }


    const ob = target.__ob__
    // 判断target是不是vue实例 || 使用ob.vmCount判断它是不是根数据对象即可
    if (target._isVue || (ob && ob.vmCount)) {
        // dev环境抛出警告
        process.env.NODE_ENV !== 'production' && warn(
            'Avoid deleting properties on a Vue instance or its root $data' +
            '- just set it to null.'
        )
        return
    }

    // 如果删除的这个key不是target自身的属性,那么什么都不做,直接退出程序执行
    if (!hasOwn(target, key)) return;

    // 如果ob不存在
    if (!ob) return;

    delete target[key]
    ob.dep.notify()
}
