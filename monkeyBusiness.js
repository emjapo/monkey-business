// Emily Port with some help from the Great Dr. Wiegand
// The obj file came from a Brackeys video I watched a long time ago

//***************************************************
// Read in obj file
async function FetchWrapper(objURL) {
    const fetchResponse = await fetch(objURL);//, {mode:'no-cors'});
    const objFileContents = await fetchResponse.text();
    return objFileContents;
}

function SimpleObjParse(objFileContents) {
    const objFileLines = objFileContents.split('\n');

    var vertexList = new Array();
    var faceList = new Array();
    var textureList = new Array();
    var normalList = new Array();

    const vertexRE = /^V .*/; //I don't know what the 'RE' stands for here but I'm assuming this is what it uses to determine what data is stored in each line
    const faceRE = /^f .*/;
    const textureRE = /^vt .*/;
    const normalRE = /^vn .*/;
}