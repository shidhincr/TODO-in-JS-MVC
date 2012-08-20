/*
    Main application initiation.
 */
jQuery(function(){
	var tasks  = TaskManager.TaskFactory.getTasks( TaskManager.Store.get() );    
    window.taskLists = new TaskManager.TaskListModel( tasks );
	TaskManager.Store.init( taskLists );
    window.TaskListController = new TaskManager.TaskListController(taskLists);
    window.taskListView = new TaskManager.TaskListView( taskLists , TaskListController ,{
         parent:jQuery("#main")
        ,addtask : jQuery("#addTask")
        ,tasktext : jQuery("#taskText")
    });
});