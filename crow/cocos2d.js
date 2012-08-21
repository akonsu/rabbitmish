/* -*- mode:javascript; coding:utf-8; -*- Time-stamp: <cocos2d.js - akonsu> */

window.addEventListener("DOMContentLoaded", function () {
    var config = {
        COCOS2D_DEBUG: 2,
        box2d: false,
        showFPS: false,
        frameRate: 60,
        tag: "canvas",
        engineDir: "/cocos2d-html5/cocos2d/",
        appFiles: ["scene.js", "utils.js"],
        mainFile: "main.js"
    };

    var script = document.createElement("script");

    script.setAttribute("id", "cocos2d-html5");
    script.setAttribute("src", config.engineDir + "platform/jsloader.js");
    script.setAttribute("type", "text/javascript");

    script["c"] = script["config"] = config;

    document.querySelector("head").appendChild(script);
});
