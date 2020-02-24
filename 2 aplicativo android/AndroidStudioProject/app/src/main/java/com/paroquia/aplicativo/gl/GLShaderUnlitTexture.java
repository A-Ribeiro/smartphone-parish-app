package com.paroquia.aplicativo.gl;

import android.opengl.GLES20;
import android.util.Log;

import java.nio.FloatBuffer;

/**
 * Created by alessandro on 21/12/2017.
 */

public class GLShaderUnlitTexture extends GLShader {

    private final String vertexShaderCode =
            "attribute vec4 vPosition;" +
            "attribute vec2 vUV;" +
            "uniform mat4 mvp;" +
            "varying vec2 uv;" +
            //"varying vec3 pos;" +
            "void main() {" +
            "  uv = vUV;" +
            //"  pos = vPosition.xyz;" +
            "  gl_Position = mvp * vPosition;" +
            "}";

    private final String fragmentShaderCode =
            "precision mediump float;" +
            "varying vec2 uv;" +
            //"varying vec3 pos;" +
            "uniform sampler2D texture;"+
            //"const float PI = 3.1415926535897932384626433832795;" +
            //"const float PI_2 = 1.57079632679489661923;" +
            //"const float PI_4 = 0.785398163397448309616;" +
            "void main() {" +
            //"  vec3 posN = normalize(pos);" +
            //"  float u = ( atan(posN.z,-posN.x) + PI) / (PI * 2.0);" +
            //"  float v = acos(posN.y) / (PI);" +
            "  vec4 result = vec4(0.0,0.0,0.0,1.0);"+
            "  result.rgb = texture2D(texture, uv ).rgb;" +
            "  gl_FragColor = result;" +
            "}";


    int texture;
    int mvp;

    public GLShaderUnlitTexture() {

        LoadShaderProgram( vertexShaderCode, fragmentShaderCode );

        texture = GLES20.glGetUniformLocation(mProgram, "texture");
        GLHelper.checkGLError("GLShaderUnlitTexture texture");
        mvp = GLES20.glGetUniformLocation(mProgram, "mvp");
        GLHelper.checkGLError("GLShaderUnlitTexture mvp");

        Log.i("GLShaderUnlitTexture", "texture: " + texture);
        Log.i("GLShaderUnlitTexture", "mvp: " + mvp);
    }

    public void setTexture(int activeTexture) {
        if (texture >= 0)
            GLES20.glUniform1i(texture,activeTexture);
        GLHelper.checkGLError("GLShaderUnlitTexture setTexture");
    }

    public void setMVP(float[] matrix) {
        if (mvp >= 0)
            GLES20.glUniformMatrix4fv(mvp,1,false, matrix, 0);
        GLHelper.checkGLError("GLShaderUnlitTexture setMVP");
    }
}
