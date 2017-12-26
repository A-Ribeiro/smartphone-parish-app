package com.paroquia.aplicativo.gl;

import android.opengl.GLES20;
import android.util.Log;

/**
 * Created by alessandro on 21/12/2017.
 */

public class GLShader {

    public int mProgram;
    public int mPositionAttrib;
    public int mUVAttrib;


    protected void LoadShaderProgram(String vertexShaderCode, String fragmentShaderCode) {
        mProgram = GLHelper.loadShaderStrings(vertexShaderCode,fragmentShaderCode);
        mPositionAttrib = GLES20.glGetAttribLocation(mProgram, "vPosition");
        mUVAttrib = GLES20.glGetAttribLocation(mProgram, "vUV");

        GLHelper.checkGLError("GLShader");

        Log.i("GLShader", "mProgram: " + mProgram);
        Log.i("GLShader", "mPositionAttrib: " + mPositionAttrib);
        Log.i("GLShader", "mUVAttrib: " + mUVAttrib);

    }

    public void EnableShader() {
        if (mProgram >=0)
        GLES20.glUseProgram(mProgram);
    }

    public void EnableVertexAttribArray() {
        if (mPositionAttrib >=0)
        GLES20.glEnableVertexAttribArray(mPositionAttrib);
        if (mUVAttrib >=0)
        GLES20.glEnableVertexAttribArray(mUVAttrib);
    }

    public void DisableVertexAttribArray() {
        if (mPositionAttrib >=0)
        GLES20.glDisableVertexAttribArray(mPositionAttrib);
        if (mUVAttrib >=0)
        GLES20.glDisableVertexAttribArray(mUVAttrib);
    }

}
