
/* Creating a Attack Towers SandBox */

// Wait for site ready
$(document).ready(function () {

    var autoSetupSearch = "?B6-worker1=p1Pawn&C6-worker1=p1King&D6-worker1=p1Pawn&E6-worker1=p1Pawn&A5-tower=p1Tower&F5-tower=p1Tower&A4-tower=p1Tower&F4-tower=p1Tower&A3-tower=p2Tower&F3-tower=p2Tower&A2-tower=p2Tower&F2-tower=p2Tower&B1-worker1=p2Pawn&C1-worker1=p2Pawn&D1-worker1=p2King&E1-worker1=p2Pawn&p1=&p2=";
    var moveLog = $("#moveText").val(); // \n for linebreak
    var droppedInCell, oldCell, currentClass, currentWorker, currentTower, draggedFromBottom;
    var turnNumber = 1;
    var touchSupp, touchMove;

    // On new pageload draw the board with the params from the URL
    drawBoardfromURL()

    $("#writeURLButton").click(function () { writeURL(); });
    $("#autoSetupBoardButton").click(function () { location.href = location.pathname + autoSetupSearch });
    $("#resetButton").click(function () { window.history.replaceState({}, '', location.pathname); location.reload(); });
    $("#clearLogButton").click(function () { clearLog(); });
    $("#textURL").click(function () { this.select(); });

    $("#p1Button").click(function () { $("#p1Button").text($("#godslist").val()); });
    $("#p2Button").click(function () { $("#p2Button").text($("#godslist").val()); });

    // Disable Middle Mouse Scroll
    $("body").mousedown(function (e) { if (e.button == 1) return false });

    // If mouse button pressed on board do this
    $(".dropZone").mousedown(function () {
        if ($(".workerOnField:hover").length > 0 || $(".towerOnField:hover").length > 0 || touchMove) { return }
        draw(this);
    });

    // Log
    function log(message) {
        moveLog += '\n' + message;
        updateLog();
    }

    // Update log
    function updateLog() {
        turnNumber++;
        $("#moveText").val(moveLog)
        $("#moveText").scrollTop($("#moveText")[0].scrollHeight);
    }

    // Clear log
    function clearLog() {
        turnNumber = 0;
        moveLog = "Gamelog:";
        updateLog();
    }

    // The named cell (eg a1) gets drawn new
    function draw(tdToFill) {
        // Empty the cell
        $(tdToFill).empty();

        // Add top, middle, bottom divs
        let $top = $('<div>', { 'data-position': 'top' });
        let $middle = $('<div>', { 'data-position': 'middle' });
        let $bottom = $('<div>', { 'data-position': 'bottom' });

        if ($(tdToFill).attr("data-tower") != 0) {
            $(tdToFill).append($top);
            $(tdToFill).append($middle);
            $(tdToFill).append($bottom);
        }
        else {
            if ($(tdToFill).attr("data-worker1") != 0 || $(tdToFill).attr("data-worker2") != 0) {
                $(tdToFill).append($top);
            }
            if ($(tdToFill).attr("data-worker3") != 0 || $(tdToFill).attr("data-worker4") != 0) {
                $(tdToFill).append($bottom);
            }
        }

        // Check and draw tower
        if ($(tdToFill).attr("data-tower") != 0) {
            var idName = $(tdToFill).attr("data-tower");
            $middle.append(
                $("#" + idName).clone().draggable({ helper: "clone" })
                .attr("class", "towerOnField")
                .css("position", "static")
            );
        }
        // Draw the workers
        if ($(tdToFill).attr("data-worker1") != 0) {
            var idName = $(tdToFill).attr("data-worker1");
            $top.append(
                $("#" + idName).clone().draggable({ helper: "clone" })
                .attr("class", "workerOnField")
                .attr("data-position", "top")
                .css("position", "static")
            );
        }

        if ($(tdToFill).attr("data-worker2") != 0) {
            var idName = $(tdToFill).attr("data-worker2");
            $top.append(
                $("#" + idName).clone().draggable({ helper: "clone" })
                .attr("class", "workerOnField")
                .attr("data-position", "top")
                .css("position", "static")
            );
        }

        if ($(tdToFill).attr("data-worker3") != 0) {
            var idName = $(tdToFill).attr("data-worker3");
            $bottom.append(
                $("#" + idName).clone().draggable({ helper: "clone" })
                .attr("class", "workerOnField")
                .attr("data-position", "bottom")
                .css("position", "static")
            );
        }

        if ($(tdToFill).attr("data-worker4") != 0) {
            var idName = $(tdToFill).attr("data-worker4");
            $bottom.append(
                $("#" + idName).clone().draggable({ helper: "clone" })
                .attr("class", "workerOnField")
                .attr("data-position", "bottom")
                .css("position", "static")
            );
        }
    }

    // Figures from toolbox are draggable and a clone of it gets dragged
    $(".figures").draggable({
        helper: "clone",
        start: function (event, ui) {
            currentClass = null;
            currentWorker = $(this).attr("data-worker");
            currentPosition = $(this).attr("data-position");
            currentTower = $(this).attr("data-tower");
            let name = this.hasAttribute('data-worker') ? $(this).attr("data-worker") : $(this).attr("data-tower");
            console.log(name + " drag from toolbox started");
        }
    });

    // Drag start callback for worker/tower on field
    $("body").on("dragstart", ".workerOnField",
        function (event, ui) {

            droppedInCell = false;
            oldCell = $(this).parent().parent().attr("id");

            currentClass = $(this).attr("class");
            currentWorker = $(this).attr("data-worker");
            currentPosition = $(this).attr("data-position");
            currentTower = null;

            console.log("Drag " + currentWorker + " from field start old cell: " + oldCell);
        }
    );

    // Drag start callback for tower on field
    $("body").on("dragstart", ".towerOnField",
        function (event, ui) {

            droppedInCell = false;
            oldCell = $(this).parent().parent().attr("id");

            currentClass = $(this).attr("class");
            currentWorker = null;
            currentPosition = null;
            currentTower = $(this).attr("data-tower");

            console.log("Drag from field start old cell: " + oldCell);
        }
    );

    // OnField things getting dragged out of the field get deleted
    $("body").on("dragstop", [".workerOnField",".towerOnField"],
        function (event, ui) {

            if (!droppedInCell) {

                let oldTower = $("#" + oldCell).attr("data-tower");
                let oldDw1 = $("#" + oldCell).attr("data-worker1");
                let oldDw2 = $("#" + oldCell).attr("data-worker2");
                let oldDw3 = $("#" + oldCell).attr("data-worker3");
                let oldDw4 = $("#" + oldCell).attr("data-worker4");

                // If workerOnField dropped outside delete
                if (currentClass == "workerOnField") {

                    if (currentPosition == 'top') {

                        if (currentWorker == oldDw1) {
                            $("#" + oldCell).attr("data-worker1", "0");
                        }
                        else if (currentWorker == oldDw2) {
                            $("#" + oldCell).attr("data-worker2", "0");
                        }
                        else {
                            return;
                        }

                    }
                    else if (currentPosition == 'bottom') {

                        if (currentWorker == oldDw3) {
                            $("#" + oldCell).attr("data-worker3", "0");
                        }
                        else if (currentWorker == oldDw4) {
                            $("#" + oldCell).attr("data-worker4", "0");
                        }
                        else {
                            return;
                        }

                    }

                    log(turnNumber + ".\tremove " + currentWorker + " from " + oldCell);
                }

                // If towerOnField dropped outside delete
                else if (currentClass == "towerOnField") {
                    $("#" + oldCell).attr("data-tower", "0");
                    log(turnNumber + ".\tremove " + currentTower + " from " + oldCell);
                }

                draw($("#" + oldCell));
                oldCell = null;
                currentClass = null;
                currentWorker = null;
                currentTower = null;
                currentPosition = null;
            }

        }
    );

    // Handle things getting dragged into cell a1, b1 ...
    $(".dropZone").droppable({
        accept: ".figures, .workerOnField, .towerOnField",
        drop: function (event, ui) {

            droppedInCell = true;

            // If drag and dropped from same cell exit
            if ($(this).attr("id") == oldCell) { return }

            // If drag and dropped on corner cell
            if ($(this).hasClass("corner")) {
                if (currentTower) { return }
            }

            let oldTower = $("#"+oldCell).attr("data-tower");
            let oldDw1 = $("#"+oldCell).attr("data-worker1");
            let oldDw2= $("#"+oldCell).attr("data-worker2");
            let oldDw3 = $("#"+oldCell).attr("data-worker3");
            let oldDw4 = $("#"+oldCell).attr("data-worker4");
            
            let tower = $(this).attr("data-tower");
            let dw1 = $(this).attr("data-worker1");
            let dw2 = $(this).attr("data-worker2");
            let dw3 = $(this).attr("data-worker3");
            let dw4 = $(this).attr("data-worker4");

            // Place new or existing worker
            if (currentWorker) {

                // if (currentPosition == 'bottom') { return }

                // Check if there is a tower
                if (tower == '0') {

                    if (dw1 == 0) {
                        $(this).attr("data-worker1", currentWorker);
                    }
                    else if (dw2 == 0) {
                        $(this).attr("data-worker2", currentWorker);
                    }
                    else {
                        return;
                    }

                }
                else {

                    let pX = event.pageX;
                    let pY = event.pageY;

                    let targetRect = event.target.getBoundingClientRect();
                    let targetHeight = targetRect.height;
                    let targetTop = targetRect.top;
                    let targetMiddle = targetTop + targetHeight / 2;
                    let targetBottom = targetTop + targetHeight;

                    let placedOnTop = pY <= (targetMiddle);
                    let placedOnBottom = pY > (targetMiddle);

                    // console.log(`Placed on top: ${placedOnTop}`);
                    // console.log(`Placed on bottom: ${placedOnBottom}`);

                    if (placedOnTop) {

                        if (dw1 == 0) {
                            $(this).attr("data-worker1", currentWorker);
                        }
                        else if (dw2 == 0) {
                            $(this).attr("data-worker2", currentWorker);
                        }
                        else {
                            return;
                        }

                    }
                    else if (placedOnBottom) {

                        if (dw3 == 0) {
                            $(this).attr("data-worker3", currentWorker);
                        }
                        else if (dw4 == 0) {
                            $(this).attr("data-worker4", currentWorker);
                        }
                        else {
                            return;
                        }

                    }
                    else {
                        return;
                    }

                }

                // Handle dropped from oldCell/clear oldCell - Move existing worker
                if (currentClass == "workerOnField") {

                    if (currentPosition == "top") {

                        if (currentWorker == oldDw1) {
                            $("#" + oldCell).attr("data-worker1", "0");
                        }
                        else if (currentWorker == oldDw2) {
                            $("#" + oldCell).attr("data-worker2", "0");
                        }

                    }
                    else if (currentPosition == "bottom") {

                        if (currentWorker == oldDw3) {
                            $("#" + oldCell).attr("data-worker3", "0");
                        }
                        else if (currentWorker == oldDw4) {
                            $("#" + oldCell).attr("data-worker4", "0");
                        }

                    }
                }

                if (!oldCell) {
                    log(turnNumber + ".\t" + currentWorker + " on " + $(this).attr("id"));
                } else {
                    log(turnNumber + ".\t" + currentWorker + " from " + oldCell + " to " + $(this).attr("id"));
                }
            }
            else if (currentTower) {

                if (tower != "0") { return }

                // Do not allow players to move towers that have none or two pwans on top of it
                // Only move tower if it is controlled by a single pawn
                //if (currentClass == "towerOnField" && oldCell) {
                //    if (oldDw1 == 0 && oldDw2 == 0) { return }
                //    else if (oldDw1 != 0 && oldDw2 != 0) { return } 
                //}

                $(this).attr("data-tower", currentTower);

                if (dw1 != 0 || dw2 != 0) {
                    $(this).attr("data-worker1", 0);
                    $(this).attr("data-worker2", 0);
                    $(this).attr("data-worker3", dw1);
                    $(this).attr("data-worker4", dw2);
                }

                if (oldDw1 != 0 || oldDw2 != 0) {
                    $(this).attr("data-worker1", oldDw1);
                    $(this).attr("data-worker2", oldDw2);
                    $("#" + oldCell).attr("data-worker1", "0");
                    $("#" + oldCell).attr("data-worker2", "0");
                }

                // Handle dropped from oldCell/clear oldCell - Move existing worker
                if (currentClass == "towerOnField") {

                    $("#" + oldCell).attr("data-tower", "0");

                    if (oldDw3 != 0 || oldDw3 != 0) {
                        $("#" + oldCell).attr("data-worker1", oldDw3);
                        $("#" + oldCell).attr("data-worker2", oldDw4);
                        $("#" + oldCell).attr("data-worker3", 0);
                        $("#" + oldCell).attr("data-worker4", 0);
                    }
                }

                if (!oldCell) {
                    log(turnNumber + ".\t" + currentTower + " on " + $(this).attr("id"));
                } else {
                    log(turnNumber + ".\t" + currentTower + " from " + oldCell + " to " + $(this).attr("id"));
                }
            }

            // Draw old cell if elements moved between existing cells            
            if (oldCell) { draw($("#"+oldCell)) }

            // Draw the current cell new
            draw(this);
            oldCell = null;
            currentClass = null;
            currentWorker = null;
            currentTower = null;
            currentPosition = null;
            draggedFromBottom = null;
        }
    });

    // Read from URL and draw
    function drawBoardfromURL() {
        let url = window.location;
        let params = new URLSearchParams(url.search.slice(1));
        for (var pair of params.entries()) {
            // use string slice to find the right data attr und cell
            switch (pair[0].slice(3)) {
                case "tower":
                    $("#" + pair[0].slice(0, 2)).attr("data-tower", pair[1]);
                    draw($("#" + pair[0].slice(0, 2)));
                    break;
                case "worker1":
                    $("#" + pair[0].slice(0, 2)).attr("data-worker1", pair[1]);
                    draw($("#" + pair[0].slice(0, 2)));
                    break;
                case "worker2":
                    $("#" + pair[0].slice(0, 2)).attr("data-worker2", pair[1]);
                    draw($("#" + pair[0].slice(0, 2)));
                    break;
                case "worker3":
                    $("#" + pair[0].slice(0, 2)).attr("data-worker3", pair[1]);
                    draw($("#" + pair[0].slice(0, 2)));
                    break;
                case "worker4":
                    $("#" + pair[0].slice(0, 2)).attr("data-worker4", pair[1]);
                    draw($("#" + pair[0].slice(0, 2)));
                    break;
            }
        }
        if (params.has("p1")) {
            $("#p1Button").text(params.get("p1"));
        }
        if (params.has("p2")) {
            $("#p2Button").text(params.get("p2"));
        }
    }

    function writeURL() {
        let newParams = new URLSearchParams();
        window.history.replaceState({}, '', location.pathname);

        $(".dropZone").each(function (index) {
            if ($(this).attr("data-tower") != 0) {
                newParams.set($(this).attr("id") + "-tower", $(this).attr("data-tower"));
            }
            if ($(this).attr("data-worker1") != 0) {
                newParams.set($(this).attr("id") + "-worker1", $(this).attr("data-worker1"));
            }
            if ($(this).attr("data-worker2") != 0) {
                newParams.set($(this).attr("id") + "-worker2", $(this).attr("data-worker2"));
            }
            if ($(this).attr("data-worker3") != 0) {
                newParams.set($(this).attr("id") + "-worker3", $(this).attr("data-worker3"));
            }
            if ($(this).attr("data-worker4") != 0) {
                newParams.set($(this).attr("id") + "-worker4", $(this).attr("data-worker4"));
            }
        });
        if ($("#p1Button").text() != "Player 1") {
            newParams.set("p1", $("#p1Button").text());
        }
        if ($("#p2Button").text() != "Player 2") {
            newParams.set("p2", $("#p2Button").text());
        }
        // update the page's URL
        window.history.replaceState({}, '', `${location.pathname}?${newParams}`);
    }

    /* Touch support */

    $("#touchNo").click(function () {
        touchSupp = 0, touchMove = 0, touchRemove = 0
        $(".touchDiv").hide()
    });
    // for firefox
    if ($("#touchNo").is(":checked")) { touchSupp = 0, touchMove = 0, touchRemove = 0, $(".touchDiv").hide() };

    $("#touchYes").click(function () {
        if (!(touchSupp)) {
            touchSupp = 1;
            touchBuild = 0;
            touchDome = 0;
            touchRemove = 0;
            touchMove = 1;

            $(".touchDiv").append(
                $(document.createElement("button")).prop({
                    type: "button",
                    innerHTML: "move",
                    id: "moveButton",
                }).click(function () { touchRemove = 0, touchMove = 1, $("#moveButton").css("background-color", "yellow"), $("#domeButton").css("background-color", ""), $("#removeButton").css("background-color", ""), $("#buildButton").css("background-color", "") }),

                $(document.createElement("button")).prop({
                    type: "button",
                    innerHTML: "remove",
                    id: "removeButton"
                }).click(function () { touchRemove = 1, touchMove = 0, $("#moveButton").css("background-color", ""), $("#domeButton").css("background-color", ""), $("#removeButton").css("background-color", "yellow"), $("#buildButton").css("background-color", "") }),

            )
            $("#moveButton").css("background-color", "yellow");
        }
    });


});
