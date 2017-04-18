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
        {id:1, name: "Vasya", color: "#769911"}, 
        {id:2, name: "Mark", color: "#A12033"}, 
        {id:3, name: "Anna", color: "#009922"}, 
        {id:4, name: "Prohor", color: "#9001BA"}
    ]; 

    function getEmployeeById(id, employees) {
        for(var i=0;i<employees.length;i++) if(employees[i].id == id) return employees[i];
        return false;
    };

    gantt.templates.task_text = function(start, end, task){  
        var owners = [],
            employee;
        for(let i=0;i<task.owner_id.length;i++) {
            employee = getEmployeeById(task.owner_id[i], employees);
            if(employee) owners.push(employee.name);        
            }
        return "" + task.text + " (" + owners.join(', ') + ")";
    };

    gantt.locale.labels["section_owners"] = "Assigned to:";

    gantt.config.columns = [
        {name: "text", tree: true, width: 160, resize: true},
        {name: "start_date", align: "center", width: 90, resize: true},
        {name: "duration", align: "center", width: 70, resize: true},
        {name: "owner_id", label: "Owner", align: "center", width: 100, resize: false, template: function(obj){
            var owners = [],
                employee;
            for(var i=0;i<obj.owner_id.length;i++) {
                employee = getEmployeeById(obj.owner_id[i], employees);
                if(employee) owners.push(employee.name); 
            }
            return owners;
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
    gantt.showLightbox(2);
