/* -*- mode:javascript; coding:utf-8; -*- Time-stamp: <scene.js - akonsu> */

var MyLayer = cc.Layer.extend({
    crowns0: null,
    crowns1: null,

    init: function () {
        this._super();

        var cache = cc.SpriteFrameCache.getInstance();

        cache.addSpriteFrames("Resources/sprites.plist");

        this.crowns0 = cc.Sprite.createWithSpriteFrameName("crowns-0.png");
        this.crowns0.setAnchorPoint(cc.PointMake(0, 0));
        this.crowns0.setPosition(cc.p(0, 0));
        this.addChild(this.crowns0);

        this.crowns1 = cc.Sprite.createWithSpriteFrameName("crowns-1.png");
        this.crowns1.setAnchorPoint(cc.PointMake(0, 0));
        this.crowns1.setPosition(cc.p(0, 0));
        this.crowns1.setOpacity(0);
        this.addChild(this.crowns1);

        this.frames = [];
        this.index = 0;

        for (var i = 0; i < 6; i++) {
            var name = "crowns-{0}.png".format(i);
            var frame = cache.getSpriteFrame(name);

            this.frames.push(frame);
        }
        this.fade();
        return this;
    },

    fade: function () {
        var FADE_DURATION = 1.0;

        var next = (this.index + 1) % this.frames.length;
        var frame0 = this.frames[this.index];
        var frame1 = this.frames[next];

        this.crowns0.setDisplayFrame(frame0);
        this.crowns1.setDisplayFrame(frame1);

        this.crowns0.runAction(cc.FadeOut.create(FADE_DURATION));
        this.crowns1.runAction(cc.Sequence.create(cc.FadeIn.create(FADE_DURATION),
                                                  cc.CallFunc.create(this, this.fade)));

        var t = this.crowns0;
        this.crowns0 = this.crowns1;
        this.crowns1 = t;

        this.index = next;
    }
});

var MyScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        // main layer
        var layer = new MyLayer();
        layer.init();

        // static background layer
        var background = new cc.LazyLayer();
        var sprite = cc.Sprite.createWithSpriteFrameName("trees.png");

        sprite.setAnchorPoint(cc.PointMake(0, 0));
        sprite.setPosition(cc.p(0, 0));

        background.addChild(sprite);
        this.addChild(background);
        this.addChild(layer);
    }
});
