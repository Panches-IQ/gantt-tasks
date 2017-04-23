// incoming data
var tasks =  {
        "data":[
            {id:1, text:"Project TASK1", type: gantt.config.types.project, progress: 0.2, open: true, owner_id: ["4"]},
            {id:2, text:"Sample 1", start_date:"02-04-2013", duration:4, order:10, progress:0.1, parent:1, owner_id: ["1","2"]},
            {id:3, text:"Sample 2", start_date:"06-04-2013", duration:8, order:20, progress:0.7, parent: 1, owner_id: ["3"], open: true},
            {id:4, text:"Project TASK2", type: gantt.config.types.project, progress: 0.1, open: true, parent: 3, owner_id: ["2"]},
            {id:5, text:"Sample 2", start_date:"08-04-2013", duration:9, order:20, progress:0.8, parent: 4, owner_id: ["7"], open: true},
            {id:6, text:"Sample 2", start_date:"09-04-2013", duration:12, order:20, progress:0.4, parent: 4, owner_id: ["5","6"], open: true},
        ],
        "links":[
            { id:1, source:1, target:2, type:"1"},
            { id:2, source:2, target:3, type:"0"},
            { id:3, source:3, target:4, type:"0"}
        ]
    },
    employees = [
        {id:"1", name: "Vasya", color: "#A68911"}, 
        {id:"2", name: "Mark", color: "#A12033"}, 
        {id:"3", name: "Anna", color: "#00A932"}, 
        {id:"4", name: "Prohor", color: "#108888"},
        {id:"5", name: "Lidya", color: "#19C18A"},
        {id:"6", name: "Bob Dylan", color: "#4288DD"},
        {id:"7", name: "Bruce Lee", color: "#B6B8C4"}
    ]; 
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
        return names.join(", ");
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

    function redrawProjectProgress (root) {
        gantt.eachTask(function(child) {
            if(child.type == gantt.config.types.project) gantt.updateTask(child.id);
        }, root);
    };

    function setProjectProgress(id) {
        var task = gantt.getTask(id);      
        while(task && task.type != gantt.config.types.project && task.parent != gantt.config.root_id) {
            id = task.parent;
            task = gantt.getTask(id);     
        }
        if(task.type == gantt.config.types.project) {
            task.progress = getAverageChildrenProgress(id);
        }
        if(gantt.getTask(id).parent != gantt.config.root_id) setProjectProgress(gantt.getTask(id).parent);    
        return false;    
    };

    gantt.templates.task_text = function(start, end, task){  
        return "" + task.text + " (" + getEmployeeNames(task.owner_id) + ")";
    };

    gantt.templates.task_class = function(start, end, task){             
        var css = [];        
        css.push(getOwnerCssClass(task.owner_id[0])); 
        return css.join(" ");
    };

    gantt.attachEvent("onParse", function(){
        var id = gantt.config.root_id;
        gantt.eachTask(function(child) {
            id = child.id;
        }, gantt.config.root_id);
        if(id != gantt.config.root_id) {
            setProjectProgress(id);
        }
        return true;        
    });

    gantt.attachEvent("onTaskCreated", function(task){
        task.owner_id = [];
        task.text = "Please enter new task name";
        task.duration = 3;
        task.progress = 0.1;
        return true;
    });

    gantt.attachEvent("onTaskDrag", function(id, event) { // events: move, progress, resize
        if(event == "progress" || event == "resize") {
            setProjectProgress(id);
            redrawProjectProgress(gantt.config.root_id);          
        }
        return true;
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
                redrawProjectProgress(gantt.config.root_id);          
                }       
            return true;
        });
    })();

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
        {name: "owners", height: 29, map_to: "owner_id", type: "lb_chosen_selector", array: employees}        
    ]; // edits lightbox fields

    addCustomStyles(); // changes tasks colors

    gantt.init("gantt_here");
    gantt.parse(tasks);    
    //gantt.showLightbox(2);
