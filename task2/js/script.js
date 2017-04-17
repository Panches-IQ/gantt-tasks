var tasks =  {
            "data":[
                {id:1, text:"Project TASK1", start_date:"01-04-2013", duration:20,order:10,
                    progress:0.4, open: true},
                {id:2, text:"Sample 1",    start_date:"02-04-2013", duration:4, order:10,
                    progress:0.1, parent:1},
                {id:3, text:"Sample 2",    start_date:"06-04-2013", duration:8, order:20,
                    progress:0.6, parent: 1}
            ],
            "links":[
                { id:1, source:1, target:2, type:"1"},
                { id:2, source:2, target:3, type:"0"},
                { id:3, source:3, target:4, type:"0"},
                { id:4, source:2, target:5, type:"2"},
            ]
    },
    formFunc = gantt.date.date_to_str("%F, %d"); 

    gantt.templates.task_text = function(start, end, task){  
        return "" + formFunc(task.start_date) + " - " + formFunc(gantt.date.add(task.start_date, task.duration-1, gantt.config.scale_unit)) + " " + task.text + 
        '<button style="margin-left:5px" class="button_delete_task">Delete</button>';
    };

    gantt.attachEvent("onTaskClick", function(id,e){
        var target = e.target || e.srcElement;
        if(target.className && target.className == 'button_delete_task') {
            gantt.confirm({
                text: "Delete task?",
            ok:"Yes", 
            cancel:"Cancel",
            callback: function(result){
                if(result) {
                    gantt.deleteTask(id);
                }
            }
            });
        return false;        
        }
        return true;
    });

    gantt.init("gantt_here");
    gantt.parse(tasks);
