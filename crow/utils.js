/* -*- mode:javascript; coding:utf-8; -*- Time-stamp: <utils.js - akonsu> */

String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != "undefined" ? args[number] : match;
    });
};