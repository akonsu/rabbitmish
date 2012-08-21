#! /bin/sh

TexturePacker \
    --sheet ./Resources/sprites.png \
    --data ./Resources/sprites.plist \
    --format cocos2d \
    --algorithm Basic \
    --max-width 4096 \
    --allow-free-size \
    --padding 0 \
    --no-trim \
    --opt RGBA8888 \
    assets/images
