// incoming data
var tasks =  {
        "data":[
            {id:1, text:"Project TASK1", start_date:"01-04-2013", duration:16,order:10,
                progress:0.4, open: true, owner_id: ["4"]},
            {id:2, text:"Sample 1", start_date:"02-04-2013", duration:4, order:10,
                progress:0.1, parent:1, owner_id: ["1","2"]},
            {id:3, text:"Sample 2", start_date:"06-04-2013", duration:8, order:20,
                progress:0.6, parent: 1, owner_id: ["3"]}
        ],
        "links":[
            { id:1, source:1, target:2, type:"1"},
            { id:2, source:2, target:3, type:"0"},
            { id:3, source:3, target:4, type:"0"},
            { id:4, source:2, target:5, type:"2"},
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
        for(var i=10;i<33;i++) {
            color = "#" + i*3 + i*2 + i*1;
            employees.push({id: 8+i, name: i + 8 + " name", color: color});
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

    function getSelectValues() {
        var result = [],
            value = {};
        for(var i=0;i<employees.length;i++) {
            value = {};
            value.key = employees[i].id;
            value.label = employees[i].name;
            result.push(value);
        }
        return result;
    }

    gantt.templates.task_text = function(start, end, task){  
        return "" + task.text + " (" + getEmployeeNames(task.owner_id) + ")";
    };

    gantt.templates.task_class = function(start, end, task){             
        var css = [];        
        css.push(getOwnerCssClass(task.owner_id[0])); 
        return css.join(" ");
    };

    gantt.attachEvent("onTaskCreated", function(task){
        task.owner_id = [];
        task.text = "Please enter new task name";
        task.duration = 2;
        task.progress = 0.1;
        return true;
    });

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
    gantt.showLightbox(2);
