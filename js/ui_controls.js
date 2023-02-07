let ui = {
    //elements
    pointer: document.getElementById("pointer"),
    pencil: document.getElementById("pencil"),
    poly: document.getElementById("poly"),
    waypoint: document.getElementById("waypoint"),
    brushBtnCont: document.getElementById("brushes-container"),
    brushBtn: document.getElementsByClassName("brush"),
    template: document.getElementById("template-box"),
    newBrush: document.getElementById("new-brush-btn"),
    thicknessDisplay: document.getElementById("thickness-display"),
    colorPicker: document.getElementById("color-picker"),
    thicknessSlider: document.getElementById("thickness-input"),
    waypointContainer: document.getElementById("waypoint-container"),
    nameInput: document.getElementById("name-input"),
    fill: document.getElementById("fill-checkbox"),
    fillColorPicker: document.getElementById("fill-color-picker"),
    fillTransparencySlider: document.getElementById("transparency-input"),
    fillTransparencyDisplay: document.getElementById("transparency-display"),
    waypointBox: document.getElementById("waypoint-box"),
    waypointTextArea: document.getElementById("waypoint-textarea"),
    waypointName: document.getElementById("waypoint-name"),
    searchMenu: document.getElementById("search-menu"),
    searchInput: document.getElementById("search-bar"),
    searchResults: document.getElementById("search-results"),
    saveMenu: document.getElementById("save-menu"),
    saveInput: document.getElementById("save-menu-input"),
    editMenu: document.getElementById("edit-menu"),
    imageUpload: document.getElementById("map-image-upload"),

    //methods
    addBrushBtn: (color) => {
        let btn = document.createElement('button');
        ui.brushBtnCont.appendChild(btn);
    
        btn.setAttribute("class", "brush");
        btn.innerText = "Brush";
        btn.style.borderLeft = "4px solid " + color;
        btn.style.borderRight = "4px solid " + color;
    
        ui.brushBtnCont.normalize();
    },
}

//ev listeners
ui.pencil.addEventListener("click", (ev) => { 
    tool.selTool = pencil;
    tool.toolActive = false;
});
ui.poly.addEventListener("click", (ev) => { 
    tool.selTool = poly;
    tool.toolActive = false;
});
ui.waypoint.addEventListener("click", (ev) => { 
    tool.selTool = waypoint;
    tool.toolActive = false;
});
ui.pointer.addEventListener("click", (ev) => { 
    tool.selTool = pointer;
    tool.toolActive = false;
});
ui.newBrush.addEventListener("click", () => { tool.brush.addBrush("#ffffff", 5) });
ui.brushBtnCont.addEventListener( "click", selectBrush);
ui.colorPicker.addEventListener("input", selectColor);
ui.thicknessSlider.addEventListener("input", selectThickness);
ui.nameInput.addEventListener("input", setName);
ui.fill.addEventListener("change", toggleFill);
ui.fillColorPicker.addEventListener("input", selectFillColor);
ui.fillTransparencySlider.addEventListener("input", selectFillTransparency);

//change brush color
function selectColor(ev) {
    if(tool.brush.selBrush == undefined) {return}

    let color = ev.target.value;
    let btn = ui.brushBtn[tool.brush.selBrush];

    map.toolData.brushes[tool.brush.selBrush].color = color;
    btn.style.borderLeft = "4px solid " + color;
    btn.style.borderRight = "4px solid " + color;
    
    update();
}

//change brush thickness
function selectThickness(ev) {
    let thickness = ev.target.value;
    ui.thicknessDisplay.textContent = thickness;

    if(tool.brush.selBrush == undefined) {return}

    map.toolData.brushes[tool.brush.selBrush].thickness = parseInt(thickness);
    ui.thicknessDisplay.textContent = thickness;

    update();
}

//toggle fill
function toggleFill(ev) {
    if(tool.brush.selBrush == undefined) {return}

    let value = ev.target.checked;
    map.toolData.brushes[tool.brush.selBrush].fill = value;
    
    update();
}

//change fill color 
function selectFillColor(ev) {
    if(tool.brush.selBrush == undefined) {return}

    let color = ev.target.value;
    map.toolData.brushes[tool.brush.selBrush].fillColor = color;
    
    update();
}

//change fill transparency
function selectFillTransparency(ev) {
    let transparency = ev.target.value;
    ui.fillTransparencyDisplay.textContent = transparency;

    if(tool.brush.selBrush == undefined) {return}

    map.toolData.brushes[tool.brush.selBrush].transparency = transparency;
    
    update();
}

//selct brush
function selectBrush(ev) {
    if(ev.target.getAttribute("class") != "brush") { return }

    let index = Array.from(ui.brushBtnCont.children).indexOf(ev.target);

    tool.brush.selBrush = index;
    tool.toolActive = false;

    brush = map.toolData.brushes[tool.brush.selBrush];

    //change nameInput
    ui.nameInput.value = ui.brushBtn[index].innerText;

    //ui changes
    ui.colorPicker.value = brush.color;
    ui.thicknessSlider.value = brush.thickness;
    ui.thicknessDisplay.textContent = brush.thickness;

    ui.fill.checked = brush.fill;
    ui.fillColorPicker.value = brush.fillColor;
    ui.fillTransparencySlider.value = brush.transparency;
    ui.fillTransparencyDisplay.innerText = brush.transparency;

    //change button color
    for(i = 0 ; i < ui.brushBtn.length; i++) {
        ui.brushBtn[i].style.backgroundColor = "var(--background)";
    }
    ui.brushBtn[index].style.backgroundColor = "var(--panel)"

}

//change brush name
function setName() {
    if(tool.brush.selBrush == undefined) {return}
    ui.brushBtn[tool.brush.selBrush].innerText = ui.nameInput.value;
}

//add default brush
tool.brush.addBrush("#ffffff", 5);

ui.searchInput.addEventListener("keydown", (ev) => {
    if (ev.key == "Enter") {
        searchMaps(ui.searchInput.value);
    };
});

async function searchMaps(query) {
    clearMapPreviews();

    //get IDs of matching maps
    var mapIDs;
    await netUtils.searchMaps(query).then(
        (response) => {
            mapIDs = response;
        }
    );
    //get map previews to display
    var mapPreviews;
    await netUtils.getMapPreviews(mapIDs).then(
        (response) => {
            mapPreviews = response;
            addMapPreviews(mapPreviews);
        }
    );
}

function clearMapPreviews() {
    ui.searchResults.innerHTML = "";
}

async function addMapPreviews(mapPreviews) {
    for(var mapPreview of mapPreviews) {
        if(mapPreview != undefined) {
            ui.searchResults.innerHTML += '<div class="map-preview" id="map-preview-template" onclick="map.utils.loadMap('+mapPreview.id+')" ><h4>'+mapPreview.name+'</h4></div>';
        }
    }
}

function openSearch() {
    ui.searchMenu.parentElement.style.display = "flex";
}
function closeSearch() {
    ui.searchMenu.parentElement.style.display = "none";
}

function openSave() {
    ui.saveMenu.parentElement.style.display = "flex";
}
function closeSave() {
    ui.saveMenu.parentElement.style.display = "none";
}

function openEdit() {
    ui.editMenu.parentElement.style.display = "flex";
}
function closeEdit() {
    ui.editMenu.parentElement.style.display = "none";
}

async function fileDrop(ev) {
    var file = ev.dataTransfer.items[0].getAsFile();
    var reader = new FileReader();

    //This is for previewing the image
    reader.onload = function (event) {
        map.image.file.name = file.name;
        map.image.file.src = event.target.result;
    }
    reader.readAsDataURL(file);

    map.image.file.onload = map.utils.imageOnload;

    ev.preventDefault();
}

function dragOverHandler(ev) {
    ev.preventDefault();
}