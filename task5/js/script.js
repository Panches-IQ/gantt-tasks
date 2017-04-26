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

    (function (){
        var color = "";
        for(var i=8;i<60;i++) {
            color = ("#" + Math.ceil(Math.random()*100000) + "A5B5C5").slice(0,7);
            employees.push({id: i, name: "name_" + i, color: color});
        }
    })();

    function getOwnerCssClass(ownerId) {
        return 'owner_' + ownerId + '_task_color';
    };

    function addCustomStyles() {
        var style = document.createElement("style");
        style.type = "text/css";
        // for user task color
        for(var i=0;i<employees.length;i++) {
            style.innerHTML += '.' + getOwnerCssClass(employees[i].id) + "{background-color:" + employees[i].color + ";} ";
        }
        document.getElementsByTagName('head')[0].appendChild(style);
    };

    function getEmployeeById(id) {
        for(var i=0;i<employees.length;i++) if(employees[i].id == id) return employees[i];
        return false;
    };

    function getEmployeeNames(ids) {
        var names = [];
        if(ids) for(var i=0;i<ids.length;i++) {
            if(getEmployeeById(ids[i])) {
                names.push(getEmployeeById(ids[i]).name);
            }
        }
        if(names.length) return names.join(", ");
        return "<i>none</i>";
    }

    function getAverageChildrenProgress(root) {
        var childArr = [],
            dt = 0,
            dv = 0;
        gantt.eachTask(function(child) {
            if(child.type != gantt.config.types.project) {
                childArr.push([child.progress, child.duration]);
            }
        }, root);
        for(var i=0;i<childArr.length;i++) {
            dv += childArr[i][0]*childArr[i][1];
            dt += childArr[i][1];
        }
        return dv/dt;
    };

    function setProjectProgress(id, isInit) {
        var task = gantt.getTask(id);
        isInit = isInit || false;   
        while(task && task.type != gantt.config.types.project && task.parent != gantt.config.root_id) {
            id = task.parent;
            task = gantt.getTask(id);     
        }
        if(task.type == gantt.config.types.project) {
            task.progress = getAverageChildrenProgress(id);
            if(!isInit) gantt.refreshTask(id);
        }
        if(gantt.getTask(id).parent != gantt.config.root_id) setProjectProgress(gantt.getTask(id).parent, isInit);    
        return false;    
    };

    gantt.templates.task_text = function(start, end, task){  
        var names = getEmployeeNames(task.owner_id);
        return "" + task.text + " (" + names + ")";
    };

    gantt.templates.task_class = function(start, end, task){             
        var css = [];        
        if(task.type == gantt.config.types.project) {
            css.push("gantt_project_color");
        } else {
            css.push(getOwnerCssClass(task.owner_id[0]));
            } 
        return css.join(" ");
    };

    gantt.attachEvent("onAfterTaskAdd", function(id) {
        setProjectProgress(id);
    });

    gantt.attachEvent("onParse", function(){
        var id = gantt.config.root_id;
        gantt.eachTask(function(child) {
            id = child.id;
        }, gantt.config.root_id);
        if(id != gantt.config.root_id) {
            setProjectProgress(id, true);
        }
        return true;        
    });

    gantt.attachEvent("onTaskCreated", function(task){
        task.owner_id = [];
        task.text = "Please enter task name";
        task.duration = 3;
        task.progress = 0.1;
        return true;
    });

    gantt.attachEvent("onTaskDrag", function(id, mode) { // mode: move, progress, resize
        if(mode == "progress" || mode == "resize") {
            setProjectProgress(id);
        }
        return true;
    });

    function setTaskReadonly(id) {
        if(!gantt.getTask(id).$new) {
            if(isTaskStarttimePass(id)) {
                gantt.getTask(id).readonly = true;
                return false;
            };
        };
        return true;
    }

    gantt.attachEvent("onBeforeTaskDrag", function(id) {
        return setTaskReadonly(id);
    });

    gantt.attachEvent("onBeforeTaskSelected", function(id){
        return setTaskReadonly(id);
    });

    (function () {
        var parentId;
        gantt.attachEvent("onBeforeTaskDelete", function(id) {
            parentId = gantt.getTask(id).parent;
            return true;
        });
        gantt.attachEvent("onAfterTaskDelete", function() { 
            if(parentId != gantt.config.root_id) {
                setProjectProgress(parentId);       
            }       
            return true;
        });
    })();
    
    var todayMarker = gantt.addMarker({ 
        start_date: new Date(), 
        text: "Today",
        css: "today",
        title: date_to_str(new Date())
    });
    
    function isTaskStarttimePass(id) { // boolean
        var timeDelta = Math.ceil(gantt.getTask(id).start_date*0.001 - gantt.getMarker(todayMarker).start_date*0.001);
        if(timeDelta > 0) {
            return false;
        } else {
            return true;
        }
    };

    setInterval(function(){
        var today = gantt.getMarker(todayMarker);
        today.start_date = new Date();
        today.title = date_to_str(today.start_date);
        gantt.updateMarker(todayMarker);
    }, 60*1000);

    gantt.locale.labels["section_owners"] = "Assigned to:";

    gantt.form_blocks["lb_chosen_selector"] = {
        render: function(section) {
            var rendText = "<div class='lb_mult_selector'><select class='lb_mult_input' multiple name='some_name' tabindex='4'>";
            for(var i=0;i<section.array.length;i++) {
                rendText += "<option value='" + section.array[i].id + "'> " + section.array[i].name + " </option>";
            }
            return rendText + "</select></div>";
        },
        set_value: function(node, value, task, section) {
            var $select = $(node).find(".lb_mult_input");
            $select.chosen({width: "99%"});
            var select = node.querySelectorAll(".lb_mult_input option");
            var checkedValues = {};
            for(var i=0;i<value.length;i++) {
                checkedValues[value[i]] = true;
            }
            for(i=0;i<select.length;i++) {
                select[i].selected = !!checkedValues[select[i].value];
            }
            $select.trigger("chosen:updated");
        },
        get_value: function(node, task, section) {
            return $(".lb_mult_input").val() || [];
        },
        focus: function() {
            return false;
        }
    };

    gantt.locale.labels["section_task_types"] = "Select task type: ";

    gantt.form_blocks["lb_radio_buttons"] = {
        render: function(section) {
            var rendText = "<div class='lb_radio_buttons'>";
            for(var key in gantt.config.types) {
                rendText += "<input name='lb_task_group' type='radio' value='" + key + "'> " + key + " ";
            };            
            return rendText + "</div><br/>";
        },
        set_value: function(node, value, task, section) {
            if(task.type == undefined) task.type = gantt.config.types.task;
            var input = node.querySelectorAll("input");
            for(var i=0;i<input.length;i++) {
                input[i].checked = false;
                if(input[i].value == task.type) {
                    input[i].checked = true;
                }
            };
        },
        get_value: function(node, task, section) {
            var output = node.querySelectorAll("input");
            for(var i=0;i<output.length;i++) if(output[i].checked) {
                var result = output[i].value;
            }
            return result;
        },
        focus: function() {
            return false;
        }
    };

    gantt.config.columns = [
        {name: "text", tree: true, width: "*"},
        {name: "start_date", align: "center", width: 60},
        {name: "duration", align: "center", width: 50},
        {name: "owner_id", label: "Owner", align: "center", width: 100, template: function(task){
            return getEmployeeNames(task.owner_id);
            }
        },
        {name: "add", label: "", width: 40}
    ]; // edits grids

    gantt.config.lightbox.sections = [        
        {name: "description", height: 29, map_to: "text", type: "textarea", focus: true},
        {name: "time", type: "duration", allow_root: "true", root_label: "no_parent", map_to: "auto"},
        {name: "owners", height: 29, map_to: "owner_id", type: "lb_chosen_selector", array: employees},
        {name: "task_types", height: 20, map_to: "type", type: "lb_radio_buttons"}        
    ]; // edits lightbox fields

    addCustomStyles(); // changes tasks colors

    gantt.init("gantt_here");
    gantt.parse(tasks);    
    //gantt.showLightbox(2);
