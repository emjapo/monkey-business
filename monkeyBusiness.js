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

    for (let lineIDX=0; lineIDX < objFileLines.length; ++lineIDX) {
        const line = objFileLines[lineIDX].trim();

        const vertexMatch = vertexRE.exec(line);
        const faceMatch = faceRE.exec(line);
        const textureMatch = textureRE.exec(line);
        const normalMatch = normalRE.exec(line);

        // vertex Line
        if (vertexMatch != null) {
            const fields = line.split(/\s/);
            vertexList.push(    vec4(parseFloat(fields[1]),
                                    parseFloat(fields[2]),
                                    parseFloat(fields[3]),
                                    1.0));
        }

        // face line
        else if (faceMatch != null) {
            const fields = line.split(/\s/);

            var vidxList = new Array();
            for (let faceIDX = 1; faceIDX < fields.length; ++faceIDX) {
                var faceVertexIndexStrings = fields[faceIDX].split('/');
                vidxList.push (parseInt(faceVertexIndexStrings[0]));
            }

            for (let vidx = 1; vidx < vidxList.length-1; ++vidx) {
                faceList.push( [vidxList[0]-1, vidxList[vidx]-1, vidxList[vidx + 1]-1 ]);
            }
        }

        // texture line
        else if (textureMatch != null) {
            const fields = line.split(/\s/);
            textureList.push(   new Array(parseFloat(fields[1]),
                                        parseFloat(fields[2])));
        }

        // normal line
        else if (normalMatch != null) {
            const fields = line.split(/\s/);
            normalList.push(    vec3(parseFloat(fields[1]),
                                    parseFloat(fields[2]),
                                    parseFloat(fields[3]) ));
        }

    }
    
    return ({"vertices": vertexList,
            "faces": faceList,
            "textures": textureList,
            "normals": normalList});
}

// This function should give the triangles that are meant to be drawn
function VerySimpleTriangleVertexExtraction(objDictionary) {
    const vertexList = objDictionary.vertices;
    const faceList = objDictionary.faces;
    var points = new Array();

    // I keep getting an annoying error telling me to do my loops as a for of loop instead so I will try it out here anad see if it works
    for (let face of faceList) {
        const triangleList = face;

        points.push(vertexList[triangleList[0]]);
        points.push(vertexList[triangleList[1]]);
        points.push(vertexList[triangleList[2]]);
    }

    return (points);
}

// creates a list of normals, A little confused because I thought we already got that from the obj file but oh well
function EstimateNormalsFromTriangles(points) {
    var normals = new Array();

    for (let triIdx = 0; triIdx < points.length; triIdx+=3) {
        const p0 = vec3(points[triIdx + 0][0],
                        points[triIdx + 0][1],
                        points[triIdx + 0][2]);
        const p1 = vec3(points[triIdx + 1][0],
                        points[triIdx + 1][1],
                        points[triIdx + 1][2]);
        const p2 = vec3(points[triIdx + 2][0],
                        points[triIdx + 2][1],
                        points[triIdx + 2][2]);

        // The normal for the triangle is 
        // (p2-p0) cross (p1-p0) !!! this seems important
        const u1 = subtract(p2,p0);
        const u2 = subtract(p1,p0);
        var n = cross(u1,u2);

        n = normalize(n);

        normals.push(n);
        normals.push(n);
        normals.push(n);
    }

    return (normals);
}

// end of reading in obj file functions
// *********************************************


// Right now I am going to also use the GetModelTransformationMatrix() from week 7 examples, but this is probally likely to change as I don't exactly know what it is doing at the moment

// I changed variable names to help me no what is going on
function GetModelTransformationMatrix() {
    var cosy = Math.cos(-Math.PI/8);
    var siny = Math.sin(-Math.PI/8);
    var cosx = Math.cos(-Math.PI/8);
    var sinx = Math.sin(-Math.PI/8);

    var scalingMatrix = mat4(0.1, 0.0, 0.0, 0.0,
                            0.0, 0.1, 0.0, 0.0,
                            0.0, 0.0, 0.1, 0.0,
                            0.0, 0.0, 0.0, 1.0 );
    
    var rotationY = mat4(cosy, 0.0, siny, 0.0,
                        0.0, 1.0, 0.0, 0.0,
                        -siny, 0.0, cosy, 0.0,
                        0.0, 0.0, 0.0, 1.0);

    var rotationX = mat4(1.0, 0.0, 0.0, 0.0,
                        0.0, cosx, -sinx, 0.0,
                        0.0, sinx, cosx, 0.0,
                        0.0, 0.0, 0.0, 1.0 );

    return (mult(rotationx, mult(rotationY, scalingMatrix)));
}