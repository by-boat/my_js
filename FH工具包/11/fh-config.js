{
    "11": {
        "name": "11",
        "tips": "我是 11 的描述信息！你可以在这里修改！",
        "noPage": false,
        "contentScript": true,
        "contentScriptCss": false,
        "menuConfig": [
            {
                "icon": "❤",
                "text": "我是 11",
                "onClick": function (info, tab) {
                    alert("你好，我是11!");
                    chrome.DynamicToolRunner({
                        query: "tool=11"
                    });
                }
            }
        ],
        "updateUrl": null
    }
}