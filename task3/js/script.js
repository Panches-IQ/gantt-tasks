var tasks =  {
        "data":[
            {id:1, text:"Project TASK1", start_date:"01-04-2013", duration:16,order:10,
                progress:0.4, open: true, owner_id: [4]},
            {id:2, text:"Sample 1",    start_date:"02-04-2013", duration:4, order:10,
                progress:0.1, parent:1, owner_id: [1,2]},
            {id:3, text:"Sample 2",    start_date:"06-04-2013", duration:8, order:20,
                progress:0.6, parent: 1, owner_id: [3]}
        ],
        "links":[
            { id:1, source:1, target:2, type:"1"},
            { id:2, source:2, target:3, type:"0"},
            { id:3, source:3, target:4, type:"0"},
            { id:4, source:2, target:5, type:"2"},
        ]
    },
    employees = [
        {id:1, name: "Vasya", color: "#A68911"}, 
        {id:2, name: "Mark", color: "#A12033"}, 
        {id:3, name: "Anna", color: "#009922"}, 
        {id:4, name: "Prohor", color: "#9001BA"}
    ]; 

    function addCustomStyles() {
        var style = document.createElement('style');
        style.type = 'text/css';
        for(var i=0;i<employees.length;i++) {
            style.innerHTML += '.owner_' + employees[i].id + '_task_color{background-color: ' + employees[i].color + ';} ';
        }
        style.innerHTML += '.gantt_task_progress {background-color: #545454;opacity: 0.3;}';
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    function getEmployeeById(id) {
        for(var i=0;i<employees.length;i++) if(employees[i].id == id) return employees[i];
        return false;
    };

    function getEmployeeNames(ids) {
        var names = [];
        for(var i=0;i<ids.length;i++)
            if(getEmployeeById(ids[i])) names.push(getEmployeeById(ids[i]).name);
        return names.length ? names : false;
    }

    gantt.templates.task_text = function(start, end, task){  
        return "" + task.text + " (" + getEmployeeNames(task.owner_id).join(', ') + ")";
    };

    gantt.templates.task_class = function(start, end, task){             
        return 'owner_' + task.owner_id[0] + '_task_color'; 
    };

    gantt.locale.labels["section_owners"] = "Assigned to:";

    gantt.config.columns = [
        {name: "text", tree: true, width: 160, resize: true},
        {name: "start_date", align: "center", width: 90, resize: true},
        {name: "duration", align: "center", width: 70, resize: true},
        {name: "owner_id", label: "Owner", align: "center", width: 100, resize: false, template: function(task){
            return getEmployeeNames(task.owner_id);
            }
        }
    ];

    gantt.config.lightbox.sections = [
        {name: "time", type: "duration", allow_root: "true", root_label: "no_parent", map_to: "auto"},
        {name: "description", height: 29, map_to: "text", type: "textarea", focus: true},
        {name: "owners", height: 29, map_to: "owner_id", type: "textarea"}
    ];

    gantt.init("gantt_here");
    gantt.parse(tasks);
    addCustomStyles();
    gantt.showLightbox(2);
