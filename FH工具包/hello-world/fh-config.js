{
    "hello-world": {
        "name": "Hello world!",
        "tips": "这是一个FH自定义工具的入门示例！一切都从Hello world开始，大家可体验，或下载后学习！",
        "noPage": true,
        "contentScript": true,
        "contentScriptCss": false,
        "menuConfig": [
            {
                "icon": "웃",
                "text": "Hello world",
                "onClick": function (info, tab) {
                    alert('你好，我是Hello world；这是一个无独立页面的功能，我的内容已经输出到控制台了哦！');
                    chrome.DynamicToolRunner({
                        query: "tool=hello-world",
                        noPage: true
                    });
                }
            }
        ],
        "updateUrl": null
    }
}