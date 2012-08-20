/*
	TaskManager.Task class
	@author : Shidhin C R
 */
;(function($){

	TaskManager.Task = function(t){
        var me = this;
        this.taskid = TaskManager.getNextTaskId();
        this.text = t.text || "";
        this.completed = t.completed || false;
        this.important = t.important || false;
        this.onchanged = new TaskManager.Event("change",this);
        this.onselected = new TaskManager.Event("select",this);
        this.onprioritychanged = new TaskManager.Event("prioritychange",this);
    };

    var TaskController = TaskManager.TaskController = function(task){
        this._task = task;
    };
    TaskController.prototype = {
         constructor : TaskController
        ,setText : function( text ) {
            this._task.text = text || this._task.text;
            this._task.onchanged.notify();
        }
        ,setCompleted : function( complete ) {
            this._task.completed = complete;
            this._task.onchanged.notify();
        }
        ,setImportant: function( important ){
        	this._task.important = important;
            this._task.onchanged.notify();
            this._task.onprioritychanged.notify();
        }
        ,select : function(){
        	this._task.onselected.notify();
        }
        ,get : function( prop ){
            return this._task[prop];
        }
    };
    var TaskView = TaskManager.TaskView = function( model , controller , elements ){
        this.rootEl = null;
        this._model = model;
        this._ctr = controller;
        this._elements = elements;
        this.renderView();
        this.setActions();
        this._model.onchanged.attach(this.onmodelChange,this);
        this._model.onselected.attach(this.onModelSelect,this);
        this._model.onprioritychanged.attach(this.changePriority,this);
    };
    TaskView.prototype = {
        constructor: TaskView
        ,getRootElem : function(){
        	return this.rootEl;
        }
        ,renderView :  function(){
            this.elem = this.elem || this.getTaskElem();
            this.setText();
            this.setClass();
            TaskManager.Store.update();
        }
        ,getTaskElem : function(){

            var _html = ["<div class='task'>","<span class='text'></span>","<input type='text' class='text-edit' value=''/>",
            "<div class='task-controls'>",
            "<a class='mark sprite tick-gray' href='#'></a>",
            "<a class='imp sprite imp-gray' href='#'></a>",
            "<a class='delete sprite del-red' href='#'></a>",
            "</div></div>"]

            ,taskel = $(_html.join(""));
            
            this.getParent().prepend( taskel );
            this.rootEl = taskel;
            return taskel.find(".text");
        }
        ,onmodelChange : function(){
            this.renderView();
        }
        ,onModelSelect: function(){
        	$(".task.selected").removeClass("selected");
        	this.rootEl.addClass("selected");
        }
        ,setText :function(){
        	this.elem.text( this._model.text );
        }
        ,setClass : function(){
        	var  markdone = this.elem.parent().find(".mark")
				,markpriority = this.elem.parent().find(".imp");

			this.elem.removeClass("open completed important"); 
			markdone.removeClass("tick-green tick-gray");
			markpriority.removeClass("imp-red imp-gray");

        	(this._model.completed) ? markdone.addClass("tick-green") : markdone.addClass("tick-gray");
        	(this._model.important) ? markpriority.addClass("imp-red") : markpriority.addClass("imp-gray");

        	this.elem.addClass("open");
            if (this._model.completed) {
            	 this.elem.addClass( "completed")
            }
            if (this._model.important) {
            	 this.elem.addClass( "important");
            }
        }
        ,changePriority : function(){
        	var me = this;
        	this.elem.parent().fadeOut(function(){
        		me.getParent().prepend(me.elem.parent().fadeIn());
        	});
        }
        ,getParent: function(){
        	return (this._model.important) ? this._elements["impparent"] : this._elements["parent"];
        }
        ,setActions : function(){
            var me = this;
            this.elem.parent().bind("click",function(){
            	me._ctr.select();
            });
            this.elem.parent().bind("dblclick",function(){
            	me.elem.hide();
            	me.elem.parent().find(".text-edit").val(me._model.text).show().focus();
            });
            this.elem.parent().find(".text-edit").bind("blur keydown",function(e){
            	if( e.type === "blur" || (e.type === "keydown" && e.keyCode === 13) ){
            		var newText = $(this).val();
	            	if($.trim( newText ) !== ""){
	            		me._ctr.setText( newText );
	            	}
	            	$(this).hide();
	            	me.elem.show();
            	}
            });
            this.elem.parent().find(".mark").bind("click",function(e){
                ( me._model.completed )?me._ctr.setCompleted(false):me._ctr.setCompleted(true);
                e.stopPropagation();
            });
            this.elem.parent().find(".imp").bind("click",function(e){
                ( me._model.important )?me._ctr.setImportant(false):me._ctr.setImportant(true);
                e.stopPropagation();
            });
        }

    };

}(jQuery));