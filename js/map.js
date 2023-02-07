var map = {
    name: "",
    description: "",
    //id is -1 for every new map, the server will decide on a new one once it's saved
    id: -1,
    image: {
        file: new Image(),
        //TODO: this is a bit redundant, try to get rid of it later
        src: "assets/maps/empty.svg",

        //these dimentions are placeholders and will be replaced in image.file.onload()
        //they are used for calculating displayed image size
        //TODO: try replacing these with a single aspect ratio
        baseWidth: 0,
        baseHeight: 0,

        //these dimentions are placeholders and will be replaced in scroll events
        //displayed dimentions are actual dimentions that will be drawn
        displayWidth: 0,
        displayHeight: 0,
    },
    //offset
    x: 0,
    y: 0,

    drag: false,
    dragStart: {
        x: 0,
        y: 0
    },
    scale: 1,

    toolData: {
        brushes: [],
        waypoints: []
    },

    utils: {
        imageOnload: () => {
            let imgWidth = map.image.file.naturalWidth;
            let imgHeight = map.image.file.naturalHeight;

            //set base image size and offset
            if(imgWidth/imgHeight < canvas.width/canvas.height) {
                map.image.baseWidth = canvas.height * (imgWidth/imgHeight);
                map.image.baseHeight = canvas.height;

                map.x = (canvas.width - map.image.baseWidth) / 2;
                map.y = 0;
            } else {
                map.image.baseHeight = canvas.width * (imgHeight/imgWidth);
                map.image.baseWidth = canvas.width;

                map.x = 0;
                map.y = (canvas.height - map.image.baseHeight) / 2;
            }
            
            //set initial display image size
            map.image.displayWidth = map.image.baseWidth * map.scale;
            map.image.displayHeight = map.image.baseHeight * map.scale;

            //initial image draw
            update();
        },
        loadMap: async (id) => {
            var link = "http://localhost:8080/maps/" + id + ".json";
            var tempMap = await netUtils.getData(link);

            //reset map position
            map.x = 0;
            map.y = 0;
            map.scale = 1;

            //set metadata
            map.name = tempMap.name;
            map.description = tempMap.description;
            map.id = tempMap.id;

            //set up tool data
            map.toolData = tempMap.toolData;

            //set up map image
            map.image.file = new Image();
            map.image.file.src = tempMap.imageSrc;
            map.image.file.onload = map.utils.imageOnload;
        },

        //TODO: make a class for serialized map
        saveMap: (mapName) => {
            let tempMap = {};
            tempMap.name = mapName;
            tempMap.id = map.id;
            tempMap.description = map.description;
            tempMap.imageSrc = map.image.file.src;
            tempMap.toolData = map.toolData;

            netUtils.uploadImage(map.image.file).then((result) => {
                if(result.ok) {
                    map.image.file.src = `localhost:8080/assets/maps/${map.image.file.name}`;
                } else {
                    alert("couldn't upload image");
                }
            });

            let serializedMap = JSON.stringify(tempMap);

            let request = new XMLHttpRequest();
            request.open("POST", "/savemap");
            request.setRequestHeader("Content-Type", "application/json");
            request.send(serializedMap);

            //set map id to whatever server chooses
            request.onload = () => {
                map.id = request.response;
            }
        },
    }
}

map.utils.loadMap(0);