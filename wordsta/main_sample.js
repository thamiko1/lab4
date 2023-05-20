window.onload = () => {
    let main = document.getElementById("main");
    let anchored = document.getElementsByClassName("anchored")[0];
    let not_anchored = document.getElementsByClassName("not-anchored")[0];
    let empty_user_block = not_anchored.getElementsByClassName("user-block")[0];
    // empty_user_block.className = "user-block";
    let add_button = document.getElementsByClassName("add-button")[0];
    let close_button = document.getElementsByClassName("close-button")[0];
    let pin_buttons = document.getElementsByClassName("pin-button");
    let agent_num = 2, id = 2;

    let pin_func = ((event) => {
        let node = event.target;
        while (node.className != "user-block") node = node.parentNode;
        if (node.parentNode.className == "anchored") {
            not_anchored.append(node);
        }
        else if (node.parentNode.className == "not-anchored") {
            console.log(anchored.childNodes)
            let blocks = anchored.getElementsByClassName("user-block");
            for (let block of blocks)
                not_anchored.append(block);
            anchored.append(node);
        }
        
        if (not_anchored.getElementsByClassName("user-block").length == 0) {
            main.style.gridTemplateColumns = "100% 0%";
        }
        else {
            main.style.gridTemplateColumns = 
            (anchored.getElementsByClassName("user-block").length > 0) ?
                "50% 50%": "0% 100%";
        }
    });

    let close_func = ((event) => {
        let node = event.target;
        while (node.className != "user-block") node = node.parentNode;
        node.remove();
        if (not_anchored.getElementsByClassName("user-block").length == 0) {
            main.style.gridTemplateColumns = "95% 0%";
        }
        else {
            main.style.gridTemplateColumns = 
            (anchored.getElementsByClassName("user-block").length > 0) ?
                "50% 50%": "0% 100%";
        }
        if (main.getElementsByClassName("user-block").length == 1) {
            anchored.append(main.getElementsByClassName("user-block")[0]);
            main.style.gridTemplateColumns = "95% 0%";
        }
    });

    function adjust_ui () {
        let width = box.offsetWidth;
        let height = box.offsetHeight;
        let num = not_anchored.childNodes.length;
    }

    for (let pin_button of pin_buttons) {
        pin_button.addEventListener(
            "click", pin_func
        )
    }

    close_button.addEventListener(
        "click", close_func
    )


   

    add_button.addEventListener(
        "click", ((event) => {
            new_node = empty_user_block.cloneNode(true);
            name_area = new_node.getElementsByClassName("name-area")[0];
            name_area.innerHTML = `User ${id}`;
            not_anchored.appendChild(new_node);
            let close_button = new_node.getElementsByClassName("close-button")[0];
            close_button.addEventListener(
                "click",  close_func
            )
            let pin_buttons = new_node.getElementsByClassName("pin-button");
            for (let pin_button of pin_buttons) {
                pin_button.addEventListener(
                    "click", pin_func
                )
            }
            // adjust view
            main.style.gridTemplateColumns = 
            (anchored.getElementsByClassName("user-block").length > 0) ?
                "50% 50%": "0% 100%";
            agent_num++;
            id++;
        })
    )
    
    
    for (let i = 1; i < 5; i++) 
        add_button.click();

    // update time
    time_element = document.getElementsByClassName("time")[0];
    time_element.innerHTML = "hihi";
    today = new Date();
    hour = today.getHours(), minute = today.getMinutes();
    stat = "上午";

    if (hour >= 12) {
        if (hour > 12) hour -= 12;
        stat = "下午";
    }

    if (hour == 0) {
        hour += 12;
    }
    time_element.innerText = `${stat} ${hour}:${minute} `;
}


