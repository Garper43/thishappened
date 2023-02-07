let tool = {
    selTool: pencil,
    toolActive: false,

    brush: {
        selBrush: 0, //index of the selected brush inside brushTool.brushes

        //methods
        addBrush: function (color, thickness) {
            let brush = new Brush(color, thickness);
        
            map.toolData.brushes.push(brush);
            //brushTool.selBrush = brushTool.brushes.length - 1;
            ui.addBrushBtn(color);
        },
    },
    waypoint: {
        selWaypoint: -1,
        icon: new Image(),
    }
}