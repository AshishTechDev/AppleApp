const pickImageHandler = () => {
    document.querySelector("#imageUrl").click();
};

const pickedhandler = (e) => {
    console.log("picked handler");
    if(e.target.files.length > 0) {
        console.log(typeof(e.target.files));
        const pickedFile = e.target.files[0];
        // console.log(pickedFile);

        const fileReader = new FileReader();
        // console.log(fileReader);
        fileReader.onload = () => {
            document.querySelector(".image-upload__preview img").src = 
            fileReader.result;
            console.log(fileReader.result);
            console.log("result");
        };
        fileReader.readAsDataURL(pickedFile);
    }else {
        return false ;
    }
};
