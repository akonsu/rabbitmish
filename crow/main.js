/* -*- mode:javascript; coding:utf-8; -*- Time-stamp: <main.js - akonsu> */

var MyApplication = cc.Application.extend({
    config: document.querySelector("#cocos2d-html5")["config"],

    ctor: function (scene) {
        this._super();
        this.startScene = scene;

        cc.COCOS2D_DEBUG = this.config["COCOS2D_DEBUG"];

        cc.setup(this.config["tag"]);
        cc.Loader.shareLoader().onloading = function () {
            cc.LoaderScene.shareLoaderScene().draw();
        };
        cc.Loader.shareLoader().onload = function () {
            cc.AppController.shareAppController().didFinishLaunchingWithOptions();
        };

        cc.Loader.shareLoader().preload([
            {type: "plist", src: "Resources/sprites.plist"},
            {type: "image", src: "Resources/sprites.png"}
        ]);
    },

    applicationDidFinishLaunching: function () {
        var director = cc.Director.getInstance();

        director.setDisplayStats(this.config["showFPS"]);
        director.setAnimationInterval(1 / this.config["frameRate"]);
        director.runWithScene(new this.startScene());

        return true;
    }
});
var application = new MyApplication(MyScene);
