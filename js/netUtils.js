const netUtils = {
    getData: async (link) => {
        var data;
    
        await fetch(link)
        .then((response) => {
            data = response.json();
        })

        return data;
    }, 
    searchMaps: async (query) => {
        var link = "http://localhost:8080/searchmap?name=" + query.replace(" ", ",");
        return await netUtils.getData(link).then((value) => {return value});
    },
    getMapPreviews: async (IDs) => {
        var link = "http://localhost:8080/getmappreview?IDs=" + IDs.toString();
        return await netUtils.getData(link);
    },
    uploadImage: async (file) => {
        var formData = new FormData();
        formData.set("file", file);

        request = fetch("/imageupload", {
            method: "POST",
            body: formData
        });

        return request;
    },
}