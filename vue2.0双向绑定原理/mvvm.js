// mvvm入口函数，整合以上三者
function MVVM(options) {
  this.$options = options || {};
  var data = (this._data = this.$options.data);
  var me = this;

  // 第一步：属性代理，当访问this.xxx属性的时候代理为访问this._data.xxx属性
  Object.keys(data).forEach(function (key) {
    me._proxyData(key);
  });

  // this._initComputed();

  // 第二步：对数据对象的所有属性进行劫持
  observe(data, this);

  // 第三步：分析模板指令
  this.$compile = new Compile(options.el || document.body, this);
}

MVVM.prototype = {
  constructor: MVVM,
  $watch: function (key, cb, options) {
    new Watcher(this, key, cb);
  },

  //属性代理，当访问this.xxx属性的时候代理为访问this._data.xxx属性
  _proxyData: function (key, setter, getter) {
    var me = this;
    Object.defineProperty(me, key, {
      configurable: false, // 不能再define
      enumerable: true, // 可枚举
      get: function proxyGetter() {
        return me._data[key];
      },
      set: function proxySetter(newVal) {
        me._data[key] = newVal;
      },
    });
  },

  _initComputed: function () {
    // var me = this;
    // var computed = this.$options.computed;
    // if (typeof computed === "object") {
    //   Object.keys(computed).forEach(function (key) {
    //     Object.defineProperty(me, key, {
    //       get:
    //         typeof computed[key] === "function"
    //           ? computed[key]
    //           : computed[key].get,
    //       set: function () {},
    //     });
    //   });
    // }
  },
};
