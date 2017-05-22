# zTemplate
This template is like zenCoding
## Usage
```javascript
var templateStrinh = 'li.@mode @choose @last[data-mode=@mode]>a#nav_@mode.nav-@mode[href=@url title=@text]>i.nav-icon-@mode+span{@text}';
var complie = zTemplate(templateString);
var html = complie({
    mode: 'mode',
    choose: 'choose',
    last: 'last',
    url: 'www.test.com',
    text: 'hoozi'
})//=><li class="mode choose last" data-mode="mode"><a id="nav_mode" class="nav-mode" href="www.test.com" title="hoozi"><i class="nav-icon-mode"><i/><span>hoozi<span/><a/><li/>
```
暂不支持多条（li.@mode @choose @last{$*3}）
