package com.paroquia.aplicativo.gl;

import android.hardware.SensorManager;
import android.opengl.GLES20;
import android.opengl.GLSurfaceView;
import android.opengl.Matrix;
import android.util.Log;

import com.paroquia.aplicativo.CameraCompass3D;
import com.paroquia.aplicativo.GLPhotoView360;
import com.paroquia.aplicativo.gl.math.Constants;
import com.paroquia.aplicativo.gl.math.Vector3;

import java.io.FileNotFoundException;
import java.util.Vector;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

/**
 * Created by alessandro on 21/12/2017.
 */

public class GLRenderer360Photo implements GLSurfaceView.Renderer {

    private final float[] mMVPMatrix = new float[16];
    private final float[] mProjectionMatrix = new float[16];

    GLView mGLView;
    //GLSquare square;
    GLSphere sphere;
    GLTexture texture;
    GLShaderUnlitTexture shader;
    float width;
    float height;
    //String filename;

    long timeLastFrame;

    CameraCompass3D cameraCompass3D = new CameraCompass3D();

    GLPhotoView360 activity;


    public GLRenderer360Photo(GLView mGLView) {
        this.mGLView = mGLView;
        activity = (GLPhotoView360)mGLView.context;
    }

    @Override
    public void onSurfaceCreated(GL10 gl, EGLConfig config) {
        GLES20.glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
        GLES20.glEnable( GLES20.GL_DEPTH_TEST );
        GLES20.glClearDepthf(1.0f);
        GLES20.glCullFace(GLES20.GL_BACK);
        GLES20.glEnable( GLES20.GL_CULL_FACE );

        Log.d("GLRenderer360Photo","onSurfaceCreated");

        texture = new GLTexture(false);
        shader = new GLShaderUnlitTexture();

        //square = new GLSquare();
        sphere = new GLSphere(64,32,10.0f);

        //cameraCompass3D = new CameraCompass3D();
    }

    @Override
    public void onSurfaceChanged(GL10 gl, int width, int height) {
        GLES20.glViewport(0, 0, width, height);
        this.width = (float)width;
        this.height = (float)height;

        Log.d("GLRenderer360Photo","onSurfaceChanged w:"+width+" h:"+height);

        Matrix.setIdentityM(mProjectionMatrix, 0 );
        float aspect = (float) width / (float)height;
        Matrix.perspectiveM(mProjectionMatrix, 0, 60, aspect, 0.02f, 1000.0f);

        //texture.loadFromImage(filename);

        try {

            texture.loadFromImageInputStream(
                    activity.getContentResolver().openInputStream(
                            activity.getIntent().getData()
                    )
            );

        }catch (FileNotFoundException e){
            e.printStackTrace();
        }

        texture.active(0);

        shader.EnableShader();
        shader.setTexture(0);

        /*
        mGLView.queueEvent(new Runnable() {
            @Override
            public void run() {
                mGLView.requestRender();
            }
        });
        */

        cameraCompass3D.initialized = true;
    }


    @Override
    public void onDrawFrame(GL10 gl) {
        GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT | GLES20.GL_DEPTH_BUFFER_BIT);

        float deltaTime = computeDeltaTime();

        cameraCompass3D.update( deltaTime );
        Matrix.multiplyMM(mMVPMatrix,0,mProjectionMatrix,0,cameraCompass3D.mViewMatrix, 0);

        shader.EnableShader();
        shader.setMVP(mMVPMatrix);

        //square.Draw(shader);
        sphere.Draw(shader);
    }

    /*
    public void setPhoto(String filePath){
        filename = filePath;
        Log.d("GLRenderer360Photo","setPhoto: " + filePath);
    }
    */

    public void PostResetNorth() {
        cameraCompass3D.PostResetNorth();
    }

    public void setAccelerometer(float x, float y, float z){
        cameraCompass3D.setacc(x,y,z);
    }

    public void setMagnetometer(float x, float y, float z){
        cameraCompass3D.setmag(x,y,z);
    }

    float computeDeltaTime() {
        long time = System.nanoTime();
        //microseconds
        long deltaTime = (time - timeLastFrame)/1000;
        if (timeLastFrame == 0)
            deltaTime = 0;
        timeLastFrame = time;
        float elapsedSec = (float)((double)deltaTime / 1000000.0);
        return elapsedSec;
    }

}
