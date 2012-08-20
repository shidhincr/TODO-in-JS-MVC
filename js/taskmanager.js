/*
    TaskManager Object - Singleton
    @author : Shidhin C R
 */
;(function($){
  
    window.TaskManager = (function(){
        
        var taskid = 0;

        return {
            getNextTaskId : function(){
                return "task"+(++taskid);
            }
        }
    }());
    var Event = TaskManager.Event = function(eventname,ctx){
        this.eventName = eventname;
        this.ctx = ctx || window;
        this.subscribers = [];
    };
    Event.prototype = {
        constructor: Event
        ,attach: function(handler,ctx){
            this.subscribers.push({
                ctx: ctx,
                handler:handler
            });
        }
        ,notify: function( data ){
            $(this.subscribers).each(function(){
                this.handler.call(this.ctx , data);
            });
        }
    };

    var Store = TaskManager.Store = (function(){
        
        var storage = (window.localStorage)? window.localStorage : {} ;

        return {
            init: function( tasklist ){
                var  me = this;
                me.datasource = tasklist;
            }
            ,update: function(){
                this.save( this.datasource._tasks );
            }
            ,save : function( data ){
                data = $.map( data ,function(obj,i){
                        return {
                            completed: obj.completed,
                            important:obj.important,
                            taskid:obj.taskid,
                            text:obj.text
                        }
                });
                storage.taskmanagerdata = JSON.stringify( data );
            }
            ,get : function( ){
                return (!!storage.taskmanagerdata && storage.taskmanagerdata!=="null") ? JSON.parse( storage.taskmanagerdata ) : [];  
            }
        }
    }());

}(jQuery));