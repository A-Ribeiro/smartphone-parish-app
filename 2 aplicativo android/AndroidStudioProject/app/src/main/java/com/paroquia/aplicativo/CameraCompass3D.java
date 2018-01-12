package com.paroquia.aplicativo;

import android.hardware.SensorManager;
import android.opengl.Matrix;
import android.util.Log;

import com.paroquia.aplicativo.gl.math.Constants;
import com.paroquia.aplicativo.gl.math.Vector3;

/**
 * Created by alessandro on 25/12/2017.
 */

public class CameraCompass3D {

    public final float[] mViewMatrix = new float[16];
    private final float[] mSphereViewMatrix = new float[16];
    private final float[] mAux = new float[16];
    private final float[] mAux2 = new float[16];

    //used to filter inputs
    float [] acc = new float[3];
    float [] acc_filter = new float[3];
    float [] mag = new float[3];
    float [] mag_copy = new float[3];
    float [] mag_filter = new float[3];
    float [] mag_old = new float[3];

    //used to measure 2 degrees from movement
    float[] vector = new float[]{0,0,0,0};
    float[] point = new float[]{0,0,0,1};

    float[] currentZ = new float[4];
    float[] oldZ = new float[3];
    float[] currentY = new float[4];
    float[] oldY = new float[3];


    float[] lookZ = new float[3];
    float[] lookZ_target = new float[3];
    float[] lookUp = new float[3];
    float[] lookUp_target = new float[3];


    // aux matrixes
    float[] fixSphereTransform = new float[16];
    float[] resetNorthTransform = new float[16];
    float[] rotationMatrixFromSensors = new float[16];


    float resetAngle = 0;

    boolean firstCalibrationNorth = true;
    int accOK = 0;
    int magOK = 0;
    public boolean initialized = false;

    public void PostResetNorth() {
        accOK = 0;
        magOK = 0;
        firstCalibrationNorth = true;
    }



    public CameraCompass3D(){

        Matrix.setIdentityM(mViewMatrix, 0 );

        Matrix.setIdentityM(fixSphereTransform, 0 );
        //Matrix.translateM(fixSphereTransform,0,0,0,-5.0f);

        Matrix.rotateM(fixSphereTransform,0,90,1.0f,0,0.0f);
        Matrix.rotateM(fixSphereTransform,0,-90-45,0.0f,1.0f,0.0f);

        Matrix.setIdentityM(resetNorthTransform, 0 );
        Matrix.rotateM(resetNorthTransform,0,resetAngle,0.0f,1.0f,0.0f);

    }

    public void setmag(float x, float y, float z){
        mag[0] = x;
        mag[1] = y;
        mag[2] = z;
        if (magOK < 10)
            magOK++;
        if (initialized && firstCalibrationNorth && accOK == 10 && magOK == 10){
            if (resetNorth())
                firstCalibrationNorth = false;
        }
    }

    public void setacc(float x, float y, float z){
        acc[0] = x;
        acc[1] = y;
        acc[2] = z;

        if (accOK < 10)
            accOK++;

        if (initialized && firstCalibrationNorth && accOK == 10 && magOK == 10){
            if (resetNorth())
                firstCalibrationNorth = false;
        }
    }

    public void update(float deltaTime){

        //filter accelerometer
        //Vector3.lerp( acc_filter, acc_filter, acc , 0.0625f );
        Vector3.lerp( acc_filter, acc_filter, acc , Math.min( 1.0f, deltaTime/ 0.15f ) );

        Vector3.copy( mag_copy, mag );

        if (Vector3.distance(mag_old, mag_copy) < 2.2f)
            Vector3.copy( mag_copy, mag_old );
        Vector3.copy( mag_old, mag_copy );

        //filter compass
        //Vector3.lerp( mag_filter, mag_filter, mag_copy , 0.125f );
        Vector3.lerp( mag_filter, mag_filter, mag_copy , Math.min( 1.0f, deltaTime/ 0.3f ) );

        boolean rotationOK = SensorManager.getRotationMatrix(rotationMatrixFromSensors, null, acc_filter, mag_filter);
        if (rotationOK){

            Matrix.multiplyMM(mAux2,0, fixSphereTransform,0, resetNorthTransform,0);
            Matrix.multiplyMM(mAux,0,rotationMatrixFromSensors,0,mAux2, 0);
            Matrix.transposeM(mSphereViewMatrix,0,mAux,0);

            //System.arraycopy(mSphereViewMatrix,2*4,currentZ,0,3);
            vector[0] = 0;
            vector[1] = 0;
            vector[2] = -1;
            Matrix.multiplyMV( currentZ, 0,mSphereViewMatrix,0, vector, 0 );
            Vector3.normalize( currentZ );

            //initialize oldZ
            if (Vector3.magnitude_sqr(oldZ) == 0) {
                Vector3.copy(oldZ, currentZ);
                Vector3.multiply(oldZ,oldZ,-1.0f);
            }

            //System.arraycopy(mSphereViewMatrix,1*4,currentY,0,3);
            vector[0] = 0;
            vector[1] = 1;
            vector[2] = 0;
            Matrix.multiplyMV( currentY, 0,mSphereViewMatrix,0, vector, 0 );
            Vector3.normalize( currentY );

            //initialize oldX
            if (Vector3.magnitude_sqr(oldY) == 0) {
                Vector3.copy(oldY, currentY);
                Vector3.multiply(oldY,oldY,-1.0f);
            }

            //check if the angle is greater than 2 degrees
            if ( Math.acos(Vector3.dot(currentZ, oldZ)) > Constants.DEG2RAD * 2.0f ||
                    Math.acos(Vector3.dot(currentY, oldY)) > Constants.DEG2RAD * 2.0f ){

                //System.arraycopy(mSphereViewMatrix,0,mViewMatrix,0,16);
                Vector3.copy(lookZ_target, currentZ);
                Vector3.copy(lookUp_target, currentY);

                if ( Vector3.magnitude_sqr(lookZ) == 0 ) {
                    Vector3.copy(lookZ, lookZ_target);
                    Vector3.copy(lookUp, lookUp_target);
                }

                Vector3.copy(oldZ, currentZ);
                Vector3.copy(oldY, currentY);
            }
        }

        //Vector3.copy(lookZ, lookZ_target);
        //Vector3.copy(lookUp, lookUp_target);
        Vector3.lerp( lookZ, lookZ, lookZ_target, Math.min( 1.0f, deltaTime / 0.2f ) );
        Vector3.lerp( lookUp, lookUp, lookUp_target, Math.min( 1.0f, deltaTime / 0.2f ) );

        Matrix.setLookAtM( mSphereViewMatrix, 0,
                0,0,0 ,
                lookZ[0],lookZ[1],lookZ[2],
                lookUp[0],lookUp[1],lookUp[2] );
        System.arraycopy(mSphereViewMatrix,0,mViewMatrix,0,16);
    }


    boolean resetNorth() {

        //local matrixes
        float[] rotationMatrixFromSensors = new float[16];
        float[] mAux = new float[16];
        float[] mSphereViewMatrix = new float[16];


        boolean rotationOK = SensorManager.getRotationMatrix(rotationMatrixFromSensors, null, acc, mag);

        if (!rotationOK)
            return false;

        Matrix.multiplyMM(mAux,0,rotationMatrixFromSensors,0,fixSphereTransform, 0);
        Matrix.transposeM(mSphereViewMatrix,0,mAux,0);

        //System.arraycopy(mSphereViewMatrix,2*4,currentZ,0,3);
        vector[0] = 0;
        vector[1] = 0;
        vector[2] = -1;

        float[] z = new float[4];
        Matrix.multiplyMV( z, 0,mSphereViewMatrix,0, vector, 0 );
        Vector3.normalize( z );

        //Vector3.copy(z,currentZ);
        Vector3.multiply(z,z,-1.0f);

        z[1] = 0;
        Vector3.normalize(z);

        float angle = (float)Math.atan2( z[2], z[0] );
        resetAngle = -angle* Constants.RAD2DEG;

        Log.i("angle: ", " " + (angle*Constants.RAD2DEG) );

        Matrix.setIdentityM(resetNorthTransform, 0 );
        Matrix.rotateM(resetNorthTransform,0,resetAngle,0.0f,1.0f,0.0f);

        return true;

    }

}
