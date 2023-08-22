/* my attempt at creating a santorini sandbox -borisqwertz */
// Wait for side ready
$(document).ready(function () {

    var imgTower = '<img src="images/tower.svg" alt="tower" height="auto" width="100%" id="tower">';

    var moveLog = $("#moveText").val(); // \n for linebreak
    var droppedInCell, oldCell, currentClass, currentWorker, currentTower;
    var turnNumber = 1;
    var touchSupp, touchMove;

    // On new pageload draw the board with the params from the URL
    drawBoardfromURL()

    $("#writeURLButton").click(function () { writeURL(); });
    $("#loadBoardButton").click(function () { location.reload(); });
    $("#resetButton").click(function () { window.history.replaceState({}, '', location.pathname); location.reload(); });
    $("#clearLogButton").click(function () { clearLog(); });
    $("#textURL").click(function () { this.select(); });

    $("#p1Button").click(function () { $("#p1Button").text($("#godslist").val()); });
    $("#p2Button").click(function () { $("#p2Button").text($("#godslist").val()); });

    // Disable Middle Mouse Scroll
    $("body").mousedown(function (e) { if (e.button == 1) return false });

    // If mouse button pressed on board do this
    $(".dropZone").mousedown(function () {
        if ($(".workerOnField:hover").length > 0 || touchMove) { return }
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
        // Check and draw tower
        if ($(tdToFill).attr("data-tower") == 1) {
            $(tdToFill).prepend(imgTower);
        }
        // Draw the workers
        if ($(tdToFill).attr("data-worker1") != 0) {
            var idName = $(tdToFill).attr("data-worker1");
            $(tdToFill).prepend($("#" + idName).clone().draggable({ helper: "clone" }).css("position", "static").attr("class", "workerOnField"));
        }

        if ($(tdToFill).attr("data-worker2") != 0) {
            var idName = $(tdToFill).attr("data-worker2");
            $(tdToFill).prepend($("#" + idName).clone().draggable({ helper: "clone" }).css("position", "static").attr("class", "workerOnField"));
        }

        if ($(tdToFill).attr("data-worker3") != 0) {
            var idName = $(tdToFill).attr("data-worker3");
            $(tdToFill).prepend($("#" + idName).clone().draggable({ helper: "clone" }).css("position", "static").attr("class", "workerOnField"));
        }

        if ($(tdToFill).attr("data-worker4") != 0) {
            var idName = $(tdToFill).attr("data-worker4");
            $(tdToFill).prepend($("#" + idName).clone().draggable({ helper: "clone" }).css("position", "static").attr("class", "workerOnField"));
        }
    }

    // Figures from toolbox are draggable and a clone of it gets dragged
    $(".figures").draggable({
        helper: "clone",
        start: function (event, ui) {
            currentWorker = $(this).attr("data-worker");
            currentTower = $(this).attr("data-tower");
            console.log(currentWorker + "drag from toolbox started");
        }
    });

    // 
    $("body").on("dragstart", ".workerOnField",
        function (event, ui) {
            droppedInCell = false;
            oldCell = $(this).parent().attr("id");
            currentClass = $(this).attr("class");
            currentWorker = $(this).attr("data-worker");
            currentTower = $(this).attr("data-tower");
            console.log("Drag from field start old cell: " + oldCell);
        }
    );

    // OnField things getting dragged out of the field get deleted
    $("body").on("dragstop", ".workerOnField",
        function (event, ui) {
            if (!droppedInCell) {
                // If workerOnField dropped outside delete
                if (currentClass == "workerOnField") {
                    switch (currentWorker) {
                        case $("#" + oldCell).attr("data-worker1"):
                            $("#" + oldCell).attr("data-worker1", "0");
                            break;
                        case $("#" + oldCell).attr("data-worker2"):
                            $("#" + oldCell).attr("data-worker2", "0");
                            break;
                        case $("#" + oldCell).attr("data-worker3"):
                            $("#" + oldCell).attr("data-worker3", "0");
                            break;
                        case $("#" + oldCell).attr("data-worker4"):
                            $("#" + oldCell).attr("data-worker4", "0");
                            break;
                    }

                    log(turnNumber + ".\tremove " + currentWorker + " from " + oldCell);
                }

                draw($("#" + oldCell));
                oldCell = false;
                currentClass = false;
                currentWorker = false;
            }
        }
    );

    // Handle things getting dragged into cell a1, b1 ...
    $(".dropZone").droppable({
        accept: ".figures, .workerOnField",
        drop: function (event, ui) {

            droppedInCell = true;

            // If drag and dropped from same cell exit
            if ($(this).attr("id") == oldCell) { return }

            // If drag and dropped on corner cell
            if ($(this).hasClass("corner")) { return }
            
            var dw1 = $(this).attr("data-worker1");
            var dw2 = $(this).attr("data-worker2");
            var dw3 = $(this).attr("data-worker3");
            var dw4 = $(this).attr("data-worker4");

            // Place new or existing worker
            if (currentWorker) {

                if (currentTower) {
                    
                }
                else {
                    
                }

                $(this).attr("data-worker1", currentWorker);

                if (!oldCell) {
                    log(turnNumber + ".\t" + currentWorker + " on " + $(this).attr("id"));
                }
            }

            // Handle dropped from oldCell/clear oldCell - Move existing worker
            if (currentClass == "workerOnField") {
                
                switch (currentWorker) {
                    case $("#" + oldCell).attr("data-worker1"):
                        $("#" + oldCell).attr("data-worker1", "0");
                        break;
                    case $("#" + oldCell).attr("data-worker2"):
                        $("#" + oldCell).attr("data-worker2", "0");
                        break;
                    case $("#" + oldCell).attr("data-worker3"):
                        $("#" + oldCell).attr("data-worker3", "0");
                        break;
                    case $("#" + oldCell).attr("data-worker4"):
                        $("#" + oldCell).attr("data-worker4", "0");
                        break;
                }

                log(turnNumber + ".\t" + currentWorker + " from " + oldCell + " to " + $(this).attr("id"));

                draw($("#" + oldCell));
            } 

            // Draw the current cell new
            draw(this);
            oldCell = false;
            currentClass = false;
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
                case "worker":
                    $("#" + pair[0].slice(0, 2)).attr("data-worker", pair[1]);
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
            if ($(this).attr("data-tower") == "1") {
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
