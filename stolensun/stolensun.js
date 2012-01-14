/* -*- mode:javascript; coding:utf-8; -*- Time-stamp: <stolensun.js - root> */

(function (window)
 {
     var c = function (image, metadata) { this.initialize(image, metadata); };
     var p = c.prototype = new SpriteSheet();

     p.super_initialize = p.initialize;
     p.initialize = function (image, metadata)
     {
         var animations = {};
         var count = 0;
         var frames = [];
         var root = metadata['frames'];

         for (var name in root)
         {
             var item = root[name];

             if (!item['rotated'])
             {
                 var f = item['frame'];
                 animations[name] = [count++];
                 frames.push([f['x'], f['y'], f['w'], f['h']]);
             }
         }
         this.super_initialize({animations: animations, frames: frames, images: [image]});
     };
     window['TexturePackerSpriteSheet'] = c;
 }(window));

(function (window)
 {
     if (typeof(DisplayObject) !== 'undefined')
     {
         DisplayObject.prototype.setPosition = function (p)
         {
             if (p)
             {
                 this.x = p.x;
                 this.y = p.y;
             }
         };
     }

     var stolensun = {};

     stolensun.CROC = {
         POSITION: {x: 155, y: 283},
         BODY: {
             POSITION: {x: 161, y: 282}
         },
         HEAD: {
             ANGLE: {HIGH: 30, LOW: -20},
             POSITION: {x: 233, y: 341},
             REG_POINT: {x: 147, y: 157}
         },
         JAW: {
             ANGLE: {HIGH: 23, LOW: -70},
             POSITION: {x: 195, y: 356},
             REG_POINT: {x: 162, y: 108}
         },
         LEG: {
             FRONT: {
                 ANGLE: {HIGH: 50, LOW: 10},
                 POSITION: {x: 239, y: 453},
                 REG_POINT: {x: 63, y: 35}
             },
             HIND: {
                 ANGLE: {HIGH: 10, LOW: -50},
                 POSITION: {x: 433, y: 586},
                 REG_POINT: {x: 105, y: 30}
             }
         }
     };

     var TRAJECTORY_DURATION = 2000;

     stolensun.SIZE = {w: 650, h: 700};
     stolensun.SUN = {
         POSITION: {x: 131, y: 285},
         SCALE: {INITIAL: 0.4, NORMAL: 1},
         TRAJECTORY: [
             {x: 60, y: 180, duration: TRAJECTORY_DURATION},
             {x: 54, y: 162, duration: TRAJECTORY_DURATION * 18.97 / 126.75},
             {x: 55, y: 146, duration: TRAJECTORY_DURATION * 16.03 / 126.75},
             {x: 60, y: 130, duration: TRAJECTORY_DURATION * 16.76 / 126.75},
             {x: 76, y: 114, duration: TRAJECTORY_DURATION * 22.63 / 126.75},
             {x: 100, y: 102, duration: TRAJECTORY_DURATION * 26.83 / 126.75},
             {x: 121, y: 97, duration: TRAJECTORY_DURATION * 21.59 / 126.75},
             {x: 146, y: 95, duration: TRAJECTORY_DURATION * 25.08 / 126.75},
             {x: 180, y: 100, duration: TRAJECTORY_DURATION * 34.37 / 126.75},
             {x: 326, y: 170, duration: TRAJECTORY_DURATION * 161.91 / 126.75}
         ]
     };

     function bitmapFromFrame(frame)
     {
         var b = new Bitmap(SpriteSheetUtils.extractFrame(stolensun.assets, frame));

         if (!b.image.complete)
         {
             var d = stolensun.assets.getFrame(stolensun.assets.getAnimation(frame).frames[0]);
             if (d)
             {
                 b.image.height = d.rect.height;
                 b.image.width = d.rect.width;
             }
         }
         return b;
     }

     function makeBackground(stage)
     {
         var bitmap = stage.addChild(bitmapFromFrame('background.png'));

         bitmap.regX = bitmap.image.width / 2;
         bitmap.regY = 0;
         bitmap.x = stolensun.SIZE.w / 2;
         bitmap.y = 0;

         stolensun.background = bitmap;

         return bitmap;
     }

     function makeCrocodile(parent)
     {
         var container = parent.addChild(new Container());
         var body = container.addChild(bitmapFromFrame('body.png'));
         var headContainer = container.addChild(new Container());
         var jaw = headContainer.addChild(bitmapFromFrame('lower-jaw.png'));
         var head = headContainer.addChild(bitmapFromFrame('head.png'));
         var frontLeg = container.addChild(bitmapFromFrame('front-leg.png'));
         var hindLeg = container.addChild(bitmapFromFrame('hind-leg.png'));

         container.setPosition(stolensun.CROC.POSITION);
         container.onClick = onclick_crocodileWithSun;

         body.setPosition(stolensun.background.localToLocal(stolensun.CROC.BODY.POSITION.x, stolensun.CROC.BODY.POSITION.y, container));

         headContainer.setPosition(stolensun.background.localToLocal(stolensun.CROC.HEAD.POSITION.x, stolensun.CROC.HEAD.POSITION.y, container));

         head.regX = stolensun.CROC.HEAD.REG_POINT.x;
         head.regY = stolensun.CROC.HEAD.REG_POINT.y;

         jaw.regX = stolensun.CROC.JAW.REG_POINT.x;
         jaw.regY = stolensun.CROC.JAW.REG_POINT.y;
         jaw.setPosition(stolensun.background.localToLocal(stolensun.CROC.JAW.POSITION.x, stolensun.CROC.JAW.POSITION.y, headContainer));

         frontLeg.regX = stolensun.CROC.LEG.FRONT.REG_POINT.x;
         frontLeg.regY = stolensun.CROC.LEG.FRONT.REG_POINT.y;
         frontLeg.setPosition(stolensun.background.localToLocal(stolensun.CROC.LEG.FRONT.POSITION.x, stolensun.CROC.LEG.FRONT.POSITION.y, container));

         hindLeg.regX = stolensun.CROC.LEG.HIND.REG_POINT.x;
         hindLeg.regY = stolensun.CROC.LEG.HIND.REG_POINT.y;
         hindLeg.setPosition(stolensun.background.localToLocal(stolensun.CROC.LEG.HIND.POSITION.x, stolensun.CROC.LEG.HIND.POSITION.y, container));

         stolensun.crocodile = container;
         stolensun.head = headContainer;

         return container;
     }

     function makeSun(parent)
     {
         var container = parent.addChild(new Container());
         var sun = container.addChild(bitmapFromFrame('sun.png'));

         container.setPosition(stolensun.background.localToLocal(stolensun.CROC.HEAD.POSITION.x, stolensun.CROC.HEAD.POSITION.y, parent));
         container.scaleX = container.scaleY = stolensun.SUN.SCALE.INITIAL;
         container.onClick = onclick_sunInMouth;

         sun.regX = sun.image.width * 0.5;
         sun.regY = sun.image.height * 0.5;
         sun.setPosition(stolensun.background.localToLocal(stolensun.SUN.POSITION.x, stolensun.SUN.POSITION.y, container));

         stolensun.sun = container;

         return container;
     }

     function makeSunHalo(parent)
     {
         var container = parent.addChild(new Container());
         var haloSmall = container.addChild(bitmapFromFrame('sun-halo-small.png'));
         var haloLarge = container.addChild(bitmapFromFrame('sun-halo-large.png'));

         container.setPosition(stolensun.background.localToLocal(stolensun.CROC.HEAD.POSITION.x, stolensun.CROC.HEAD.POSITION.y, parent));
         container.scaleX = container.scaleY = stolensun.SUN.SCALE.INITIAL;

         var p = stolensun.background.localToLocal(stolensun.SUN.POSITION.x, stolensun.SUN.POSITION.y, container);

         haloSmall.alpha = 0;
         haloSmall.regX = haloSmall.image.width * 0.5;
         haloSmall.regY = haloSmall.image.height * 0.5;
         haloSmall.setPosition(p);

         haloLarge.alpha = 0;
         haloLarge.regX = haloLarge.image.width * 0.5;
         haloLarge.regY = haloLarge.image.height * 0.5;
         haloLarge.setPosition(p);

         stolensun.halo = container;

         var HALO_ALPHA = 0.7;
         var HALO_DURATION = 2000;
         var WAIT_DURATION = 4000;

         Tween.get(haloSmall, {loop: true}).to({alpha: HALO_ALPHA}, HALO_DURATION).wait(HALO_DURATION * 2).to({alpha: 0}, HALO_DURATION).wait(WAIT_DURATION);
         Tween.get(haloLarge, {loop: true}).wait(HALO_DURATION).to({alpha: HALO_ALPHA}, HALO_DURATION).to({alpha: 0}, HALO_DURATION).wait(HALO_DURATION + WAIT_DURATION);

         return container;
     }

     function onclick_crocodileNoSun(e)
     {
         if (isNaN(stolensun.crocodile.tweenCount) || stolensun.crocodile.tweenCount <= 0)
         {
             stolensun.crocodile.tweenCount = 3;

             var JAW_DURATION = 100;
             var LEGS_DURATION = 150;

             function f()
             {
                 if (--stolensun.crocodile.tweenCount < 2)
                 {
                     Tween
                         .get(stolensun.head.getChildAt(0), {override: true})
                         .to({rotation: stolensun.CROC.JAW.ANGLE.HIGH / 2}, JAW_DURATION)
                         .to({rotation: stolensun.CROC.JAW.ANGLE.HIGH}, JAW_DURATION)
                         .to({rotation: stolensun.CROC.JAW.ANGLE.HIGH / 2}, JAW_DURATION)
                         .to({rotation: stolensun.CROC.JAW.ANGLE.HIGH}, JAW_DURATION)
                         .to({rotation: stolensun.CROC.JAW.ANGLE.HIGH / 2}, JAW_DURATION)
                         .to({rotation: stolensun.CROC.JAW.ANGLE.HIGH}, JAW_DURATION)
                         .call(function() { stolensun.crocodile.tweenCount--; });
                 }
             };

             Tween
                 .get(stolensun.crocodile.getChildAt(2), {override: true})
                 .to({rotation: stolensun.CROC.LEG.FRONT.ANGLE.HIGH}, LEGS_DURATION)
                 .to({rotation: stolensun.CROC.LEG.FRONT.ANGLE.LOW}, LEGS_DURATION)
                 .to({rotation: stolensun.CROC.LEG.FRONT.ANGLE.HIGH}, LEGS_DURATION)
                 .to({rotation: stolensun.CROC.LEG.FRONT.ANGLE.LOW}, LEGS_DURATION)
                 .to({rotation: 0}, LEGS_DURATION)
                 .call(f);

             Tween
                 .get(stolensun.crocodile.getChildAt(3), {override: true})
                 .to({rotation: stolensun.CROC.LEG.HIND.ANGLE.LOW}, LEGS_DURATION)
                 .to({rotation: stolensun.CROC.LEG.HIND.ANGLE.HIGH}, LEGS_DURATION)
                 .to({rotation: stolensun.CROC.LEG.HIND.ANGLE.LOW}, LEGS_DURATION)
                 .to({rotation: stolensun.CROC.LEG.HIND.ANGLE.HIGH}, LEGS_DURATION)
                 .to({rotation: 0}, LEGS_DURATION)
                 .call(f);
         }
     }

     function onclick_crocodileWithSun(e)
     {
         if (isNaN(stolensun.crocodile.tweenCount) || stolensun.crocodile.tweenCount <= 0)
         {
             stolensun.crocodile.tweenCount = 5;

             var HEAD_DURATION = 500;
             var LEGS_DURATION = 150;

             function f()
             {
                 if (--stolensun.crocodile.tweenCount < 4)
                 {
                     Tween
                         .get(stolensun.head, {override: true})
                         .to({rotation: stolensun.CROC.HEAD.ANGLE.HIGH / 2}, HEAD_DURATION / 2)
                         .to({rotation: stolensun.CROC.HEAD.ANGLE.LOW}, HEAD_DURATION)
                         .to({rotation: stolensun.CROC.HEAD.ANGLE.HIGH / 2}, HEAD_DURATION)
                         .to({rotation: stolensun.CROC.HEAD.ANGLE.LOW}, HEAD_DURATION)
                         .to({rotation: 0}, HEAD_DURATION)
                         .call(function() { stolensun.crocodile.tweenCount--; });

                     Tween
                         .get(stolensun.halo, {override: true})
                         .to({rotation: stolensun.CROC.HEAD.ANGLE.HIGH / 2}, HEAD_DURATION / 2)
                         .to({rotation: stolensun.CROC.HEAD.ANGLE.LOW}, HEAD_DURATION)
                         .to({rotation: stolensun.CROC.HEAD.ANGLE.HIGH / 2}, HEAD_DURATION)
                         .to({rotation: stolensun.CROC.HEAD.ANGLE.LOW}, HEAD_DURATION)
                         .to({rotation: 0}, HEAD_DURATION)
                         .call(function() { stolensun.crocodile.tweenCount--; });

                     Tween
                         .get(stolensun.sun, {override: true})
                         .to({rotation: stolensun.CROC.HEAD.ANGLE.HIGH / 2}, HEAD_DURATION / 2)
                         .to({rotation: stolensun.CROC.HEAD.ANGLE.LOW}, HEAD_DURATION)
                         .to({rotation: stolensun.CROC.HEAD.ANGLE.HIGH / 2}, HEAD_DURATION)
                         .to({rotation: stolensun.CROC.HEAD.ANGLE.LOW}, HEAD_DURATION)
                         .to({rotation: 0}, HEAD_DURATION)
                         .call(function() { stolensun.crocodile.tweenCount--; });
                 }
             };

             Tween
                 .get(stolensun.crocodile.getChildAt(2), {override: true})
                 .to({rotation: stolensun.CROC.LEG.FRONT.ANGLE.HIGH}, LEGS_DURATION)
                 .to({rotation: stolensun.CROC.LEG.FRONT.ANGLE.LOW}, LEGS_DURATION)
                 .to({rotation: stolensun.CROC.LEG.FRONT.ANGLE.HIGH}, LEGS_DURATION)
                 .to({rotation: stolensun.CROC.LEG.FRONT.ANGLE.LOW}, LEGS_DURATION)
                 .to({rotation: 0}, LEGS_DURATION)
                 .call(f);

             Tween
                 .get(stolensun.crocodile.getChildAt(3), {override: true})
                 .to({rotation: stolensun.CROC.LEG.HIND.ANGLE.LOW}, LEGS_DURATION)
                 .to({rotation: stolensun.CROC.LEG.HIND.ANGLE.HIGH}, LEGS_DURATION)
                 .to({rotation: stolensun.CROC.LEG.HIND.ANGLE.LOW}, LEGS_DURATION)
                 .to({rotation: stolensun.CROC.LEG.HIND.ANGLE.HIGH}, LEGS_DURATION)
                 .to({rotation: 0}, LEGS_DURATION)
                 .call(f);
         }
     }

     function onclick_sunInMouth(e)
     {
         if (isNaN(stolensun.sun.tweenCount) || stolensun.sun.tweenCount <= 0)
         {
             stolensun.crocodile.tweenCount = 2;
             stolensun.sun.tweenCount = 4;

             stolensun.sun.onClick = onclick_sunInSky;
             stolensun.crocodile.onClick = onclick_crocodileNoSun;

             var HEAD_DURATION = 1000;
             var SUN_DURATION = 1000;

             Tween
                 .get(stolensun.head, {override: true})
                 .to({rotation: stolensun.CROC.HEAD.ANGLE.HIGH}, HEAD_DURATION)
                 .wait(HEAD_DURATION)
                 .to({rotation: stolensun.CROC.HEAD.ANGLE.LOW}, HEAD_DURATION)
                 .call(function() { stolensun.crocodile.tweenCount--; });

             Tween
                 .get(stolensun.head.getChildAt(0), {override: true})
                 .to({rotation: stolensun.CROC.JAW.ANGLE.LOW}, HEAD_DURATION)
                 .wait(HEAD_DURATION)
                 .to({rotation: stolensun.CROC.JAW.ANGLE.HIGH}, HEAD_DURATION)
                 .call(function() { stolensun.crocodile.tweenCount--; });

             var haloSmall = stolensun.halo.getChildAt(0);
             var haloLarge = stolensun.halo.getChildAt(1);
             var sun = stolensun.sun.getChildAt(0);

             var stage = stolensun.background.getStage();

             var tweenSun = Tween.get(stolensun.sun);
             var tweenHalo = Tween.get(stolensun.halo);

             stolensun.halo.setPosition(stolensun.halo.localToLocal(haloSmall.x, haloSmall.y, stage));
             stolensun.sun.setPosition(stolensun.sun.localToLocal(sun.x, sun.y, stage));

             haloSmall.x = haloSmall.y = 0;
             haloLarge.x = haloLarge.y = 0;
             sun.x = sun.y = 0;

             var ps = stolensun.SUN.TRAJECTORY;
             var length = ps.length;

             for (var i = 0; i < length; i++)
             {
                 var p = ps[i];
                 var q = stolensun.background.localToLocal(p.x, p.y, stage);
                 tweenHalo.to({x: q.x, y: q.y}, p.duration);
                 tweenSun.to({x: q.x, y: q.y}, p.duration);
             }
             tweenHalo.call(function() { stolensun.sun.tweenCount--; });
             tweenSun.call(function() { stolensun.sun.tweenCount--; });

             var d = ps[length - 1].duration;

             Tween.get(stolensun.halo)
                 .wait(tweenHalo.duration - d)
                 .to({scaleX: 1, scaleY: 1}, d)
                 .call(function() { stolensun.sun.tweenCount--; });

             Tween
                 .get(stolensun.sun)
                 .wait(tweenSun.duration - d)
                 .to({scaleX: 1, scaleY: 1}, d)
                 .call(function() { stolensun.sun.tweenCount--; });
         }
     }

     function onclick_sunInSky(e)
     {
         if (isNaN(stolensun.sun.tweenCount) || stolensun.sun.tweenCount <= 0)
         {
             stolensun.sun.tweenCount = 2;

             var NUM_ROTATIONS = 5;
             var SUN_DURATION = 2000;
             var EASE = Ease.circInOut;

             Tween
                 .get(stolensun.halo)
                 .to({rotation: NUM_ROTATIONS * 360}, SUN_DURATION, EASE)
                 .set({rotation: 0})
                 .call(function() { stolensun.sun.tweenCount--; });

             Tween
                 .get(stolensun.sun)
                 .to({rotation: NUM_ROTATIONS * 360}, SUN_DURATION, EASE)
                 .set({rotation: 0})
                 .call(function() { stolensun.sun.tweenCount--; });
         }
     }

     function spriteSheet_onload(e)
     {
         var canvas = stolensun.container.appendChild(document.createElement('canvas'));
         var stage = new Stage(canvas);

         canvas.height = stolensun.actualSize.h;
         canvas.width = stolensun.actualSize.w;

         stage.scaleX = stolensun.actualSize.w / stolensun.SIZE.w;
         stage.scaleY = stolensun.actualSize.h / stolensun.SIZE.h;

         if (Touch.isSupported())
         {
             Touch.enable(stage);
         }
         stolensun.assets = new TexturePackerSpriteSheet(stolensun.spriteSheet, stolensun.FRAMES);

         makeBackground(stage);
         makeSun(stage);
         makeCrocodile(stage);
         makeSunHalo(stage);

         Ticker.setFPS(20);
         Ticker.addListener(stage);
     }

     function start(container, w, h)
     {
         stolensun.actualSize = {w: isNaN(w) ? stolensun.SIZE.w : w, h: isNaN(h) ? stolensun.SIZE.h : h};
         stolensun.container = container;

         if (Modernizr.canvas)
         {
             stolensun.spriteSheet = new Image();
             stolensun.spriteSheet.src = 'spritesheet.png';
             stolensun.spriteSheet.onload = spriteSheet_onload;
         }
         else
         {
             container.innerHTML = '<img src="snapshot.jpg" width="' + stolensun.actualSize.w + '" height="' + stolensun.actualSize.h + '" />';
         }
     }

     stolensun.FRAMES =
         {"frames": {

             "background.png":
             {
                 "frame": {"x":2,"y":2,"w":650,"h":650},
                 "rotated": false,
                 "trimmed": false,
                 "spriteSourceSize": {"x":0,"y":0,"w":650,"h":650},
                 "sourceSize": {"w":650,"h":650}
             },
             "body.png":
             {
                 "frame": {"x":654,"y":2,"w":445,"h":326},
                 "rotated": false,
                 "trimmed": false,
                 "spriteSourceSize": {"x":0,"y":0,"w":445,"h":326},
                 "sourceSize": {"w":445,"h":326}
             },
             "front-leg.png":
             {
                 "frame": {"x":1101,"y":2,"w":91,"h":141},
                 "rotated": false,
                 "trimmed": false,
                 "spriteSourceSize": {"x":0,"y":0,"w":91,"h":141},
                 "sourceSize": {"w":91,"h":141}
             },
             "head.png":
             {
                 "frame": {"x":1194,"y":2,"w":174,"h":197},
                 "rotated": false,
                 "trimmed": false,
                 "spriteSourceSize": {"x":0,"y":0,"w":174,"h":197},
                 "sourceSize": {"w":174,"h":197}
             },
             "hind-leg.png":
             {
                 "frame": {"x":1370,"y":2,"w":139,"h":94},
                 "rotated": false,
                 "trimmed": false,
                 "spriteSourceSize": {"x":0,"y":0,"w":139,"h":94},
                 "sourceSize": {"w":139,"h":94}
             },
             "lower-jaw.png":
             {
                 "frame": {"x":1511,"y":2,"w":185,"h":132},
                 "rotated": false,
                 "trimmed": false,
                 "spriteSourceSize": {"x":0,"y":0,"w":185,"h":132},
                 "sourceSize": {"w":185,"h":132}
             },
             "sun-halo-large.png":
             {
                 "frame": {"x":1698,"y":2,"w":247,"h":254},
                 "rotated": false,
                 "trimmed": false,
                 "spriteSourceSize": {"x":0,"y":0,"w":247,"h":254},
                 "sourceSize": {"w":247,"h":254}
             },
             "sun-halo-small.png":
             {
                 "frame": {"x":2,"y":654,"w":172,"h":190},
                 "rotated": false,
                 "trimmed": false,
                 "spriteSourceSize": {"x":0,"y":0,"w":172,"h":190},
                 "sourceSize": {"w":172,"h":190}
             },
             "sun.png":
             {
                 "frame": {"x":176,"y":654,"w":135,"h":145},
                 "rotated": false,
                 "trimmed": false,
                 "spriteSourceSize": {"x":0,"y":0,"w":135,"h":145},
                 "sourceSize": {"w":135,"h":145}
             }}
         }
     ;
     window['stolensun_start'] = start;
 }(window));
