package com.paroquia.aplicativo.gl;

import android.opengl.GLES20;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;
import java.nio.ShortBuffer;

/**
 * Created by alessandro on 21/12/2017.
 */


public class GLSquare {

    private FloatBuffer vertexBuffer;
    private FloatBuffer uvBuffer;

    private ShortBuffer drawListBuffer;

    // number of coordinates per vertex in this array
    static final int COORDS_PER_POS = 3;
    static float squareCoords[] = {
            -0.5f,  0.5f, 0.0f,   // top left
            -0.5f, -0.5f, 0.0f,   // bottom left
            0.5f, -0.5f, 0.0f,    // bottom right
            0.5f,  0.5f, 0.0f };  // top right

    static final int COORDS_PER_UV = 2;
    static float squareCoords_uv[] = {
            0, 0,   // top left
            0, 1,   // bottom left
            1, 1,   // bottom right
            1, 0};  // top right

    private short drawOrder[] = { 0, 1, 2, 0, 2, 3 }; // order to draw vertices

    public GLSquare() {
        // initialize vertex byte buffer for shape coordinates
        ByteBuffer bb = ByteBuffer.allocateDirect( squareCoords.length * 4);
        bb.order(ByteOrder.nativeOrder());
        vertexBuffer = bb.asFloatBuffer();
        vertexBuffer.put(squareCoords);
        vertexBuffer.position(0);

        bb = ByteBuffer.allocateDirect( squareCoords_uv.length * 4);
        bb.order(ByteOrder.nativeOrder());
        uvBuffer = bb.asFloatBuffer();
        uvBuffer.put(squareCoords_uv);
        uvBuffer.position(0);

        // initialize byte buffer for the draw list
        ByteBuffer dlb = ByteBuffer.allocateDirect(drawOrder.length * 2);
        dlb.order(ByteOrder.nativeOrder());
        drawListBuffer = dlb.asShortBuffer();
        drawListBuffer.put(drawOrder);
        drawListBuffer.position(0);
    }

    public void Draw(GLShader enabledShader) {
        enabledShader.EnableVertexAttribArray();
        if (enabledShader.mPositionAttrib >=0)
        GLES20.glVertexAttribPointer(enabledShader.mPositionAttrib, COORDS_PER_POS, GLES20.GL_FLOAT, false, COORDS_PER_POS * 4, vertexBuffer);
        if (enabledShader.mUVAttrib >=0)
        GLES20.glVertexAttribPointer(enabledShader.mUVAttrib, COORDS_PER_UV, GLES20.GL_FLOAT, false, COORDS_PER_UV * 4, uvBuffer);
        GLES20.glDrawArrays(GLES20.GL_TRIANGLE_FAN, 0, squareCoords.length / COORDS_PER_POS);
        enabledShader.DisableVertexAttribArray();
    }

}
