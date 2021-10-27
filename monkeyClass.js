// I am going to try the class thing but instead of a ship I will have a monkey
// it would be really cool to have a banana but for now I will just go with two monkeys

class FunkyMonkey {
    constructor(gl, shaderProgram) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;

        this.CreateMonkeyPoints();
        this.CreateMonkeyColors();

        // Set the transformation matrix. Not sure how this will combine with the work I have done yet
        this.matrixLoc = gl.getUniformLocation(shaderProgram, "uMatrix");
        if (this.matrixLoc == null) {
            console.log("Couldn't find 'uMatrix', sorry sis.");
        }
        this.transformationMatrix = mat4 (1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1);
        this.gl.uniformMatrix4fv(this.matrixLoc, false, flatten(this.transformationMatrix));
    }

    //************************* */
    // Get the points
    CreateMonkeyPoints() {

    }

    //************************* */
    // I actually might be able to skip this because the colors are the normals, but I will put it for now
    CreateMonkeyColors() {

    }

    DrawMonkey() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.shapeBufferID); 
        var positionVar = this.gl.getAttribLocation(this.shaderProgram, "vPosition");
        this.gl.vertexAttribPointer(positionVar, 4, this.gl.FLOAT, false, 0, 0);

        //// color questionable, I'll be back
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBufferID);          
        // var colorVar = this.gl.getAttribLocation(this.shaderProgram, "vColor"); 
        // this.gl.vertexAttribPointer(colorVar, 4, this.gl.FLOAT, false, 0, 0);

        this.gl.uniformMatrix4fv(this.matrixLoc, false, flatten(this.transformationMatrix));

        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.shapePoints.length);
    }

    ResetMatrix() {
        this.transformationMatrix = mat4(1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0)
    }

    // I think I can skip all of the other ones since I want the whole scene to rotate together, so I'll leave that in the other file and this one will just have translate

    Translate(tx, ty, tz) {
        // Setup the translation matrix
        var T = mat4(1.0, 0.0, 0.0, tx,
            0.0, 1.0, 0.0, ty,
            0.0, 0.0, 0.0, tz,
            0.0, 0.0, 0.0, 1.0);

        // Update the ship's transformation matrix
        this.transformationMatrix = mult(T, this.transformationMatrix);
    }

}