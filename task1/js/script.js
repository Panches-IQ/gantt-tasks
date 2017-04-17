var tasks =  {
            "data":[
                {id:1, text:"Project 1", start_date:"01-04-2013", duration:5,order:10,
                    progress:0.4, open: true},
                {id:2, text:"Sample 1",    start_date:"02-04-2013", duration:4, order:10,
                    progress:0.1, parent:1}
            ],
            "links":[
                { id:1, source:1, target:2, type:"1"}
            ]
    };

    gantt.templates.task_class = function(start, end, task){             
        if(task.progress>0.75) {
            return "high";
        } 
        return "";
    };

    gantt.templates.task_text = function(start, end, task){
        if(task.progress == 1) return "<b>" + task.text + ": done</b>";
        if(task.progress > 0.9) return "<b>" + task.text + "</b>";        
        return task.text;
    };

    gantt.init("gantt_here");
    gantt.parse(tasks);
