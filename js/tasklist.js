/*
	TaskManager.TaskList class
    @author : Shidhin C R
 */
;(function($){

	var TaskFactory = TaskManager.TaskFactory = {
        getTasks: function( rawtasks){
          var taskarr = $.map(rawtasks , function(obj,index){
            return new TaskManager.Task(obj);
          });
          return taskarr;  
        }
    }

    var TaskListModel = TaskManager.TaskListModel =  function( tasks ){
        this._tasks = tasks || [];
        this.onadd = new TaskManager.Event("taskadded");
        this.ondelete = new TaskManager.Event("taskdeleted");
    };
    var TaskListController = TaskManager.TaskListController =  function ( tasklists ){
        this._tasklists = tasklists || {};
    };
    TaskListController.prototype = {
         constructor : TaskListController
        ,addTask : function( task ){
            this._tasklists._tasks.push( task );
            this._tasklists.onadd.notify( task );
        }
        ,deleteTask : function( taskid ){
            this._tasklists._tasks = $.grep( this._tasklists._tasks  ,function(task){
                return task.taskid != taskid;
            });
            this._tasklists.ondelete.notify(taskid);
        }
    };
    var TaskListView = TaskManager.TaskListView = function( tasklist , tasklistctr ,elements){
        this._tasklists = tasklist;
        this._ctr = tasklistctr;
        this.elements = elements || {};
        this.renderView();
        this._tasklists.ondelete.attach(this.onTaskRemoved ,this );
        this._tasklists.onadd.attach(this.onTaskAdded ,this );
        this.attachEvents();
    };
    TaskListView.prototype = {
         constructor : TaskListView
        ,renderView : function(){
            var  me=this;
            var parent = me.parent =  this.elements.parent || jQuery("body");
            parent.html("");
            parent.append( jQuery("<div class='priority'></div>") );
            parent.append( jQuery("<div class='default'></div>") );
            jQuery(this._tasklists._tasks).each(function(){
                me.addSingleTask( this );
            });
            TaskManager.Store.update();
        }
        ,attachEvents : function(){
            var me = this
                ,addtask = function(){
                    if( $.trim( me.elements.tasktext.val()) === ""){
                        alert("Task description cannot be blank !!!");
                        return;
                    }
                    me.addTask({
                         text: me.elements.tasktext.val()
                        ,completed: false
                        ,important: false
                    });
                    me.elements.tasktext.val("").focus();
                };
             jQuery(me.elements.tasktext).bind("keyup",function(e){
                if(e.keyCode === 13){
                    addtask();
                }
             });
            jQuery(me.elements.addtask).bind("click",function(e){
                addtask();
            });
        }
        ,addTask: function( task ){
          var taskmodel =  new TaskManager.Task(task);
          this._ctr.addTask(  taskmodel );
        }
        ,addSingleTask : function( task ){
            var   me=this
                 ,tview = new TaskManager.TaskView(task,new TaskManager.TaskController(task),{
                    "parent": this.parent.find(".default")
                    ,"impparent": this.parent.find(".priority")
                });
            tview.getRootElem().find(".delete").bind("click",function(){
                me._ctr.deleteTask( task.taskid );
            });
        }
        ,onTaskRemoved : function( taskid ){
            this.renderView();
        }
        ,onTaskAdded : function( task ){
            this.renderView();
        } 
    };

}(jQuery));