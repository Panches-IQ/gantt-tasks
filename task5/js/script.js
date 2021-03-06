// incoming data
var tasks =  {
        "data":[
            {id:1, text:"Project TASK1", type: gantt.config.types.project, progress: 0.2, open: true, owner_id: ["4"]},
            {id:2, text:"Sample 1", start_date:"25-04-2017", duration:4, order:10, progress:0.1, parent:1, owner_id: ["1","2"]},
            {id:3, text:"Sample 2", start_date:"26-04-2017", duration:8, order:20, progress:0.7, parent: 1, owner_id: ["3"], open: true},
            {id:4, text:"Project TASK2", type: gantt.config.types.project, progress: 0.1, open: true, parent: 3, owner_id: ["2"]},
            {id:5, text:"Sample 2", start_date:"24-04-2017", duration:9, order:20, progress:0.8, parent: 4, owner_id: ["7"], open: true},
            {id:6, text:"Sample 2", start_date:"28-04-2017", duration:12, order:20, progress:0.4, parent: 4, owner_id: ["5","6"], open: true},
        ],
        "links":[
            { id:1, source:1, target:2, type:"1"},
            { id:2, source:2, target:3, type:"0"},
            { id:3, source:3, target:4, type:"0"}
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

    function isTaskChangeable(id) {
        if(!gantt.getTask(id).$new) {
            if(gantt.getTask(id).start_date - Date.now() > 0) {
                return true;
                } else {
                return false;
            };
        };
        return true;
    };

    gantt.attachEvent("onBeforeTaskDrag", function(id, mode) {
        if(mode == "progress") return true;
        return isTaskChangeable(id);
    });

    gantt.attachEvent("onBeforeLightbox", function(id) {
        return isTaskChangeable(id);
    });
    
    var todayMarker = gantt.addMarker({ 
        start_date: new Date(), 
        text: "Today",
        css: "today",
        title: date_to_str(new Date())
    });

    gantt.attachEvent("onAfterTaskAdd", function(id) {
        if(gantt.getTask(id).start_date - Date.now() < 0) {
            gantt.confirm({
                text: "Add task with expired date?",
                ok: "Yes", 
                cancel: "Cancel",
                callback: function(result){
                    if(!result) {
                        gantt.deleteTask(id);
                    };                    
                }   
            });      
        };
        return true;
    });

    gantt.attachEvent("onBeforeLinkAdd", function(id, e) {
        if(gantt.getTask(e.target).start_date - Date.now() < 0 || gantt.getTask(e.source).start_date - Date.now() < 0) {
            return false;
        };
        return true;
    });

    setInterval(function() {
        var today = gantt.getMarker(todayMarker);
        today.start_date = new Date();
        today.title = date_to_str(today.start_date);
        gantt.updateMarker(todayMarker);
    }, 60*1000);

    gantt.locale.labels["section_owners"] = "Assigned to:";
    gantt.locale.labels["new_task"] = "enter task name";
    gantt.locale.labels["section_task_types"] = "Select task type: ";

    gantt.init("gantt_here");
    gantt.parse(tasks);    
    //gantt.showLightbox(2);
