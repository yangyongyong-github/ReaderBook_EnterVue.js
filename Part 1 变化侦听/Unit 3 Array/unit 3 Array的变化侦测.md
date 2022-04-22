# unit 3 Array的变化侦测

> 为什么Array和Object实现方式不一样？使用了数组原型上的方法 getter是侦测不到的

例如 this.arrat.push(1)  // 如果对象，则使用setter/getter实现。但是这里不会触发
因为我们可以使用Array原型上的方法可以实现，所以Object的哪些就不再管用。

**ES6之前没有元编程，也就没有拦截原型方法的能力**。
但是这难不倒聪明测程序员们。
我们可以*使用自定义的方法去覆盖原型方法*
我们可以用一个`Array.prototype`,可以使用拦截器中的方法

## 3.2 拦截器
其实就是一个和Array.prototype一样的Object，
里面包含的属性一模一样，只不过这个Object中某些可以改变数组自身内容的方法是我们处理过的。

经过整理，我们发现Array中可以改变数组自身的方法(有副作用的)
push pop 	shift unshift		splice  sort  reverse


创建拦截器的原因：为了 获得一种能力，一种当数组的内容发生变化时得到通知的能力。

# 如何收集数组的依赖
Array的依赖收集和Object一样，defineReactive

# 关于Array的问题
正应为是拦截原型方法实现的,所以部分是检测不到的(re-render watch)-> proxy 来解决

this.list[0]=2;
this.list.length=0;