// incoming data
var tasks =  {
        "data":[
            {id:1, text:"Task id 1", type: gantt.config.types.project, open: true, owner_id: ["4"]},
            {id:2, text:"Task id 2", start_date:"24-04-2017", duration:3, parent: 1, owner_id: ["1","2"], open: true},
            {id:3, text:"Task id 3", start_date:"27-04-2017", duration:2, parent: 2, owner_id: ["3"], open: true},
            {id:4, text:"Task id 4", start_date:"29-04-2017", duration:2, parent: 3, owner_id: ["2"], open: true},
            {id:5, text:"Task id 5", start_date:"27-04-2017", duration:1, parent: 2, owner_id: ["7"], open: true},
            {id:6, text:"Task id 6", start_date:"28-04-2017", duration:3, parent: 4, owner_id: ["5","6"], open: true},
            {id:7, text:"Task id 7", start_date:"30-04-2017", duration:2, parent: 5, owner_id: ["6"], open: true},
            {id:8, text:"Task id 8", start_date:"02-05-2017", duration:2, parent: 5, owner_id: ["6"], open: true},
            {id:9, text:"Task id 9", start_date:"03-05-2017", duration:3, parent: 5, owner_id: ["6"], open: true}
        ],
        "links":[
            { id:1, source:5, target:7, type:"0"},
            { id:2, source:2, target:3, type:"0"},
            { id:3, source:3, target:4, type:"0"},
            { id:4, source:4, target:7, type:"0"},
            { id:5, source:2, target:5, type:"0"},
            { id:6, source:8, target:9, type:"0"},
            { id:7, source:7, target:8, type:"0"},
            { id:8, source:4, target:6, type:"0"},
            { id:9, source:6, target:7, type:"0"}
        ]
    },
    employees = [
        {id:"1", name: "Vasya", color: "#4699B1"}, 
        {id:"2", name: "Mark", color: "#A12033"}, 
        {id:"3", name: "Anna", color: "#50D962"}, 
        {id:"4", name: "Prohor", color: "#108888"},
        {id:"5", name: "Lidya", color: "#8951FA"},
        {id:"6", name: "Bob Dylan", color: "#4288DD"},
        {id:"7", name: "Bruce Lee", color: "#B6B8C4"}
    ],
    date_to_str = gantt.date.date_to_str("%F, %d. %H:%i"); 
// end incoming data

    gantt.addTaskLayer(function fnc(task) {

        if(!gantt.isCriticalTask(task) && gantt.getSelectedId() == task.id) {

            if(task.$source.length > 0 && task.parent != gantt.config.root_id) {
            
                var pos = gantt.getTaskPosition(task, task.start_date, task.end_date),
                    task2 = gantt.getTask(gantt.getLink(task.$source[0]).target),
                    slack = gantt.getSlack(task, task2),
                    gridWidth = pos.width/task.duration;
                if(slack > 0) {
                    var el = document.createElement("div");
                    el.className = 'gantt_custom_slack';
                    el.style.left = pos.left + pos.width + "px";
                    el.style.width = slack*gridWidth + "px";
                    el.style.height = pos.height - 2 + "px";
                    el.style.top = pos.top  + "px";
                    return el; 
                }
            }
        }
        return false;
    });

    gantt.locale.labels["new_task"] = "enter task name";

    gantt.config.highlight_critical_path = true;
    //gantt.config.row_height = 30;
    gantt.config.task_height = 30;

    gantt.init("gantt_here");
    gantt.parse(tasks);    