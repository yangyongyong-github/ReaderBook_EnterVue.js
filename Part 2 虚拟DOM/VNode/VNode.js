

/**
 * VNode class
 * 其包含的属性
 * vnode: 节点描述对象，描述了因该怎样去创建真实的DOM节点
 */
export default class VNode {
    constructor(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
        this.tag = tag;
        this.data = data;
        this.children = children;
        this.text = text;
        this.elm = elm;
        this.context = context;
        // this.componentOptions = componentOptions;
        // this.asyncFactory = asyncFactory;

        this.functionalContext = undefined;
        this.functionalOptions = undefined;
        this.functionalScopeId = undefined;
        this.key = data && data.key;
        this.componentOptions = componentOptions;
        this.componentInstance = undefined;
        this.parent = undefined;

        this.raw = false;
        this.isStatic = false;
        this.isRootInsert = false;
        this.isComment = false
        this.isCloned = false;
        this.isOnce = false;// isOnce
        this.asyncFactory = asyncFactory;
        this.isAsyncPlaceholder = false; // placeholder
    }

    get child() {
        return this.componentInstance
    }
}

/**
 * vnode -(create)->DOM-(insert)view->
 * vnode 和 view 是一一对应的
 */