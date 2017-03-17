(function (){
//创建空console对象，避免JS报错
if(!window.console)
window.console = {};
var console = window.console;
var funcs = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml',
'error', 'exception', 'group', 'groupCollapsed', 'groupEnd',
'info', 'log', 'markTimeline', 'profile', 'profileEnd',
'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
for(var i=0,l=funcs.length;i
var func = funcs[i];
if(!console[func])
console[func] = function(){};
}
if(!console.memory)
console.memory = {};
})();