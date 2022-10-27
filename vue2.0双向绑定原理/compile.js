// 指令解析器Compile，对每个元素节点的指令进行扫描和解析，根据指令模板替换数据，以及绑定相应的更新函数

function Compile(el, vm) {
  this.$vm = vm;
  this.$el = this.isElementNode(el) ? el : document.querySelector(el);

  if (this.$el) {
    this.$fragment = this.node2Fragment(this.$el);
    this.init();
    this.$el.appendChild(this.$fragment);
  }
}

Compile.prototype = {
  constructor: Compile,
  node2Fragment: function (el) {
    var fragment = document.createDocumentFragment(),
      child;

    // 下面这个操作，会将原先el下的所有子节点拷贝到fragment上，el下的节点反而消失了（不知道为何）
    while ((child = el.firstChild)) {
      fragment.appendChild(child);
    }

    return fragment;
  },

  init: function () {
    this.compileElement(this.$fragment);
  },

  compileElement: function (el) {
    var childNodes = el.childNodes,
      me = this;
    [].slice.call(childNodes).forEach(function (node) {
      var text = node.textContent;
      var reg = /\{\{(.*)\}\}/; // 如果是 {{数据名}} 格式

      // 是元素节点
      if (me.isElementNode(node)) {
        me.compile(node);

        // 是文本节点
      } else if (me.isTextNode(node) && reg.test(text)) {
        me.compileText(node, RegExp.$1.trim());
      }

      // 有子节点的话继续调用compileElement方法
      if (node.childNodes && node.childNodes.length) {
        me.compileElement(node);
      }
    });
  },

  // 元素节点调用，解析指令
  compile: function (node) {
    var nodeAttrs = node.attributes,
      me = this;
    [].slice.call(nodeAttrs).forEach(function (attr) {
      var attrName = attr.name;
      if (me.isDirective(attrName)) {
        var exp = attr.value;
        var dir = attrName.substring(2);
        // 事件指令
        if (me.isEventDirective(dir)) {
          compileUtil.eventHandler(node, me.$vm, exp, dir);
          // 普通指令
        } else {
          compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
        }

        node.removeAttribute(attrName);
      }
    });
  },

  // 文本节点调用，将this中的数据替换 我们编写的{{data}}
  compileText: function (node, exp) {
    compileUtil.text(node, this.$vm, exp);
  },

  // 是否是普通指令
  isDirective: function (attr) {
    return attr.indexOf("v-") == 0;
  },

  // 是否是事件指令
  isEventDirective: function (dir) {
    return dir.indexOf("on") === 0;
  },

  // 是否是元素节点
  isElementNode: function (node) {
    return node.nodeType == 1;
  },

  // 是否是文本节点
  isTextNode: function (node) {
    return node.nodeType == 3;
  },
};

// 指令处理集合
var compileUtil = {
  text: function (node, vm, exp) {
    this.bind(node, vm, exp, "text");
  },

  html: function (node, vm, exp) {
    this.bind(node, vm, exp, "html");
  },

  model: function (node, vm, exp) {
    this.bind(node, vm, exp, "model");

    var me = this,
      val = this._getVMVal(vm, exp);
    node.addEventListener("input", function (e) {
      var newValue = e.target.value;
      if (val === newValue) {
        return;
      }

      me._setVMVal(vm, exp, newValue);
      val = newValue;
    });
  },

  class: function (node, vm, exp) {
    this.bind(node, vm, exp, "class");
  },

  bind: function (node, vm, exp, dir) {
    var updaterFn = updater[dir + "Updater"];

    // 调用最终方法，将模板中编写的变量数据，渲染至页面
    updaterFn && updaterFn(node, this._getVMVal(vm, exp));

    // 添加订阅者模式
    new Watcher(vm, exp, function (value, oldValue) {
      updaterFn && updaterFn(node, value, oldValue);
    });
  },

  // 事件处理
  eventHandler: function (node, vm, exp, dir) {
    var eventType = dir.split(":")[1],
      fn = vm.$options.methods && vm.$options.methods[exp];

    if (eventType && fn) {
      // 通过bind改变this指向，当调用我们在methods中定义的方法时，里面的this指向vue实例
      node.addEventListener(eventType, fn.bind(vm), false);
    }
  },

  // 如果是对象调用的话，通过遍历将最终的数据输出
  _getVMVal: function (vm, exp) {
    var val = vm;
    exp = exp.split(".");
    exp.forEach(function (k) {
      val = val[k];
    });
    return val;
  },

  _setVMVal: function (vm, exp, value) {
    var val = vm;
    exp = exp.split(".");
    exp.forEach(function (k, i) {
      // 非最后一个key，更新val的值
      if (i < exp.length - 1) {
        val = val[k];
      } else {
        val[k] = value;
      }
    });
  },
};

var updater = {
  textUpdater: function (node, value) {
    node.textContent = typeof value == "undefined" ? "" : value;
  },

  htmlUpdater: function (node, value) {
    node.innerHTML = typeof value == "undefined" ? "" : value;
  },

  classUpdater: function (node, value, oldValue) {
    var className = node.className;
    className = className.replace(oldValue, "").replace(/\s$/, "");

    var space = className && String(value) ? " " : "";

    node.className = className + space + value;
  },

  modelUpdater: function (node, value, oldValue) {
    node.value = typeof value == "undefined" ? "" : value;
  },
};
