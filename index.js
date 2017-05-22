/**
 *  类似zenCoding的模板引擎
 *  形如div.div>p.p+span.span[attr=value]{@text}
 *  https://github.com/hoozi/zTemplate;
 *  2017-05-22
 *  by hoozi (https://github.com/hoozi/zTemplate)
 */

;(function(){
    'use strict';
    var KEY = '__REPLACE__'; 
    /**
     * 遍历数组
     * @param {Array} arr 
     * @param {Function} fn 
     */
    var eachArray = function(arr, fn) {
        for(var i = 0, len = arr.length; i<len; i++) {
            fn.call(arr, arr[i], i, len);
        }
    }

    /**
     * 替换模板
     * @param {String} str 
     * @param {Object} rep 
     * @param {String} key 
     */
    var format = function(str, rep) {
        return str.replace(new RegExp(KEY, 'g'), rep);
    }

    /**
     * 获得源模板
     * @param {String} str 
     * @param {String} type 
     * @param {String} key 
     */
    var getHTML = function(str, type) {
        return str
        .replace(/^(\w+)([^\{\}]*)?(\{([@\w]+)\})?(.*)$/, function(match, $1, $2, $3, $4, $5) {
            var $2 = $2 || '', //属性标签，形如.nav[data=2]#a
                $3 = $3 || '', //内容标签，形如{@a}
                $4 = $4 || '', //内容元素，如{@a}中的a
                $5 = $5.replace(/\{([@\w+])\}/g, ''); //替换结尾形如 {@a}{@b}
                return type === 'in' ?
                '<' + $1 + $2 + $5 + '>' + $4 + KEY + '<' + $1 + '/>' :
                type === 'add' ?
                '<' + $1 + $2 + $5 + '>' + $4 + '<' + $1 + '/>' + KEY :
                '<' + $1 + $2 + $5 + '>' + $4 + '<' + $1 + '/>';
        })
        
        //id
        .replace(/#([@\-\w]+)/g, ' id="$1"')

        //class
        .replace(/\.([@\-\s\w]+)/g, ' class="$1"')

        //attr
        .replace(/\[(.+)\]/g, function(match, key){
            var attrs = key.replace(/'|"/g, '')
                        .split(' '),
            attrStr = '';
            eachArray(attrs, function(attr) {
                attrStr += ' ' + attr.replace(/=(.*)/g, '="$1"');
            })
            return attrStr;
        })
    }

    var zTemplate = function(temp){
        return function(data) {
            var temps = temp
                .replace(/^\s+|\s+$/, '') //去除首尾空格
                .replace(/\s+(>)\s+/g, '$1') //去除>首尾空格
                .split('>'),
            html = KEY,
            items,
            nodeTemp;
            eachArray(temps, function(temp, tIndex, tLen){
                items = temp.split('+'); //兄弟元素
                nodeTemp = KEY;
                eachArray(items, function(item, itemIndex, itemLen) {
                    //console.log(nodeTemp)
                    nodeTemp = format(nodeTemp, 
                        getHTML(item, 
                            itemLen-1 === itemIndex ? 
                            (tLen-1 === tIndex ? '' : 'in') : 
                            'add'));
                });
                html = format(html, nodeTemp);
            });
            return html.replace(/@(\w+)/g, function(match, key) {
                return typeof data[key] === 'undefined' ? '' : data[key];
            });
        }
    }

    
    //console.log(getHTML('a#nav_@mode.nav-@mode[href=@url title=@text]', 'in', '__REPLACE__'));
   // window.zTemplate = zTemplate;
    var html = zTemplate('li.@mode @choose @last[data-mode=@mode]>a#nav_@mode.nav-@mode[href=@url title=@text]>i.nav-icon-@mode+span{@text}');
    console.log(html({
        mode: 'mode',
        choose: 'choose',
        last: 'last',
        url: 'www.test.com',
        text: 'hoozi'
    }));
})();