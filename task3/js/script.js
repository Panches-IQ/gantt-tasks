var tasks =  {
        "data":[
            {id:1, text:"Project TASK1", start_date:"01-04-2013", duration:16,order:10,
                progress:0.4, open: true, owner_id: [4]},
            {id:2, text:"Sample 1", start_date:"02-04-2013", duration:4, order:10,
                progress:0.1, parent:1, owner_id: [1,2]},
            {id:3, text:"Sample 2", start_date:"06-04-2013", duration:8, order:20,
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
        {id:3, name: "Anna", color: "#00A932"}, 
        {id:4, name: "Prohor", color: "#9001BA"},
        {id:5, name: "Lidya", color: "#19C18A"}
    ]; 

    function getOwnerCssClass(ownerId) {
        return 'owner_' + ownerId + '_task_color';
    };

    function addCustomStyles() {
        var style = document.createElement('style');
        style.type = 'text/css';
        for(var i=0;i<employees.length;i++) {
            style.innerHTML += '.' + getOwnerCssClass(employees[i].id) + '{background-color: ' + employees[i].color + ';} ';
        }
        style.innerHTML += '.gantt_task_progress {background-color: #545454;opacity: 0.3;}';
        document.getElementsByTagName('head')[0].appendChild(style);
    };

    function getEmployeeById(id) {
        for(var i=0;i<employees.length;i++) if(employees[i].id == id) return employees[i];
        return false;
    };

    function getEmployeeNames(ids) {
        var names = [];
        if(ids) for(var i=0;i<ids.length;i++)
            if(getEmployeeById(ids[i])) names.push(getEmployeeById(ids[i]).name);
        //return names.length ? names : false;
        return names;
    }

    function getOptionsArr() {
        var optArr = [];
        optArr.push({key: "1", label: "hjh"});
        return optArr;
    }

    gantt.templates.task_text = function(start, end, task){  
        return "" + task.text + " (" + getEmployeeNames(task.owner_id).join(', ') + ")";
    };

    gantt.templates.task_class = function(start, end, task){             
        var css = [];
        css.push(getOwnerCssClass(task.owner_id[0]));
        return css.join(" ");
    };

    gantt.locale.labels["section_owners"] = "Assigned to:";

    gantt.form_blocks["lb_mult_selector"] = {
        render: function() {
            return "<div class='lb_mult_selector' style='height:60px; padding-left: 10px'><select name='test_lb' multiple size='2' style='width:200px;'>" 
            + "<option value='1'>Vasya</option><option value='2'>Mark</option><option value='3'>Anna</option><option value='4'>Prohor</option><option value='5'>Lidya</option></select></div>";
        },
        set_value: function(node, value, task, section) {
            //node.childNodes[1].value = value || "";
            //node.childNodes[0][1].innerHTML = "WOW!";
            //node.childNodes[0].innerHTML = "<select> <option>fuc0</option> <option>fuc1</option> </select>";
            //console.log(node.childNodes[0].value);
            //node.childNodes[1].value = getEmployeeNames(value) || "";
        },
        get_value: function(node, task, section) {
            var result = [];
            console.log(node.childNodes[0].options[0]['selected']);
            for(var i=0;i<node.childNodes[0].length;i++) if(node.childNodes[0].options[i]['selected']) result.push(node.childNodes[0].options[i].value);
            return result;
        },
        focus: function() {
            return false;
        }
    };

    gantt.config.columns = [
        {name: "text", tree: true, width: 160, resize: true},
        {name: "start_date", align: "center", width: 90, resize: true},
        {name: "duration", align: "center", width: 70, resize: true},
        {name: "owner_id", label: "Owner", align: "center", width: 100, resize: false, template: function(task){
            return getEmployeeNames(task.owner_id);
            }
        }
    ]; // edits grids

    gantt.config.lightbox.sections = [        
        {name: "description", height: 29, map_to: "text", type: "textarea", focus: true},
        {name: "time", type: "duration", allow_root: "true", root_label: "no_parent", map_to: "auto"},
        {name: "owners", height: 29, map_to: "owner_id", type: "lb_mult_selector"}
    ]; // edits lightbox fields

    addCustomStyles(); // changes tasks colors
    
    gantt.init("gantt_here");
    gantt.parse(tasks);    
    gantt.showLightbox(2);
