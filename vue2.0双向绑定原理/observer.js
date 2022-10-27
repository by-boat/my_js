// 数据监听器，能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知订阅者
function Observer(data) {
  this.data = data;
  this.walk(data);
}

Observer.prototype = {
  constructor: Observer,
  walk: function (data) {
    var me = this;
    Object.keys(data).forEach(function (key) {
      me.convert(key, data[key]);
    });
  },
  convert: function (key, val) {
    this.defineReactive(this.data, key, val);
  },

  // 对数据进行劫持
  defineReactive: function (data, key, val) {
    var dep = new Dep();
    var childObj = observe(val);

    Object.defineProperty(data, key, {
      enumerable: true, // 可枚举
      configurable: false, // 不能再define
      get: function () {
        // 在compile中解析模板时，如果页面中有使用到实例上的数据，就会添加订阅者模式,并且加入订阅器，里面还包含更新页面的回调函数，后续如果数据修改就会在set中调用
        if (Dep.target) {
          dep.depend();
        }
        return val;
      },
      set: function (newVal) {
        if (newVal === val) {
          return;
        }
        val = newVal;
        // 新的值是object的话，进行监听
        childObj = observe(newVal);
        // 通知订阅者
        dep.notify();
      },
    });
  },
};

function observe(value, vm) {
  if (!value || typeof value !== "object") {
    return;
  }

  return new Observer(value);
}

var uid = 0;

function Dep() {
  this.id = uid++;
  this.subs = []; // 订阅器
}

Dep.prototype = {
  addSub: function (sub) {
    this.subs.push(sub);
  },

  depend: function () {
    Dep.target.addDep(this);
  },

  removeSub: function (sub) {
    var index = this.subs.indexOf(sub);
    if (index != -1) {
      this.subs.splice(index, 1);
    }
  },

  // 该方法最终会调用watcher中的run方法，run方法又会调用在解析模板时添加观察者时候传入的回调函数，这个回调函数就会修改页面上的数据
  notify: function () {
    this.subs.forEach(function (sub) {
      sub.update();
    });
  },
};

Dep.target = null;
