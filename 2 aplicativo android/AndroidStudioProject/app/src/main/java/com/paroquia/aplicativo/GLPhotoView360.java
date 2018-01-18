package com.paroquia.aplicativo;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.ActivityInfo;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.net.Uri;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;

import com.paroquia.aplicativo.gl.GLRenderer360Photo;
import com.paroquia.aplicativo.gl.GLView;

/**
 * An example full-screen activity that shows and hides the system UI (i.e.
 * status bar and navigation/system bar) with user interaction.
 */
public class GLPhotoView360 extends AppCompatActivity {

    GLPhotoView360 thiz = this;

    SensorEventListener sensorListener = new SensorEventListener() {
        @Override
        public void onSensorChanged(SensorEvent event){
            Sensor mySensor = event.sensor;

            if (mySensor.getType() == Sensor.TYPE_ACCELEROMETER) {
                float x = event.values[0];
                float y = event.values[1];
                float z = event.values[2];
                mGLView.<GLRenderer360Photo>getRenderer().setAccelerometer(x,y,z);
            } else if (mySensor.getType() == Sensor.TYPE_MAGNETIC_FIELD){
                float x = event.values[0];
                float y = event.values[1];
                float z = event.values[2];
                mGLView.<GLRenderer360Photo>getRenderer().setMagnetometer(x,y,z);
            }
        }
        @Override
        public void onAccuracyChanged(Sensor sensor, int accuracy){
        }
    };

    private GLView mGLView;

    /**
     * Some older devices needs a small delay between UI widget updates
     * and a change of the status and navigation bar.
     */
    private static final int UI_ANIMATION_DELAY = 300;
    private final Handler mHideHandler = new Handler();
    //private View mContentView;
    private final Runnable mHidePart2Runnable = new Runnable() {
        @SuppressLint("InlinedApi")
        @Override
        public void run() {
            // Delayed removal of status and navigation bar

            // Note that some of these constants are new as of API 16 (Jelly Bean)
            // and API 19 (KitKat). It is safe to use them, as they are inlined
            // at compile-time and do nothing on earlier devices.
            mGLView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LOW_PROFILE
                    | View.SYSTEM_UI_FLAG_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION);
        }
    };
    //private View mControlsView;
    private final Runnable mShowPart2Runnable = new Runnable() {
        @Override
        public void run() {
            // Delayed display of UI elements
            /*
            ActionBar actionBar = getSupportActionBar();
            if (actionBar != null) {
                actionBar.show();
            }
            */
            //mControlsView.setVisibility(View.VISIBLE);
        }
    };
    private boolean mVisible;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mGLView = new GLView(this, GLRenderer360Photo.class);

        //String selectedImagePath = ImageFilePath.getPath(getApplicationContext(), selectedImageUri);
        //Log.i("Image File Path", ""+selectedImagePath);

        //mGLView.<GLRenderer360Photo>getRenderer().setPhoto( getIntent().getData().toString() );



        setContentView(mGLView);

        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON, WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

        //setContentView(R.layout.activity_fullscreen_channel_view);

        mGLView.setSystemUiVisibility( View.SYSTEM_UI_FLAG_LOW_PROFILE
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION);

        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.hide();
        }
        mVisible = false;

        // Set up the user interaction to manually show or hide the system UI.
        mGLView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                toggle();
            }
        });
    }

    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
    }

    @Override
    protected void onResume(){
        super.onResume();
        Log.d("GLPhotoView360","onResume");


        SensorManager senSensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);

        Sensor senAccelerometer = senSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        boolean accFound = senSensorManager.registerListener(sensorListener, senAccelerometer , SensorManager.SENSOR_DELAY_GAME);

        Sensor senMagnetometer = senSensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD);
        boolean compassFound = senSensorManager.registerListener(sensorListener, senMagnetometer, SensorManager.SENSOR_DELAY_GAME);

        //force reset north when data from acc and mag are OK
        mGLView.<GLRenderer360Photo>getRenderer().PostResetNorth();

        if (!accFound) {
            Log.d("GLPhotoView360","Accelerometer not found...");
        }

        if (!compassFound) {
            Log.d("GLPhotoView360","Compass not found...");
            for(int i=0;i<20;i++)
                mGLView.<GLRenderer360Photo>getRenderer().setMagnetometer(0, 0, 100);
        }

    }

    @Override
    protected void onPause() {
        super.onPause();
        Log.d("GLPhotoView360","onPause");


        SensorManager senSensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        Sensor senAccelerometer = senSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        Sensor senMagnetometer = senSensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD);

        senSensorManager.unregisterListener(sensorListener, senAccelerometer);
        senSensorManager.unregisterListener(sensorListener, senMagnetometer);

    }

    private void toggle() {

        //mGLView.<GLRenderer360Photo>getRenderer().resetNorth();

        if (mVisible) {
            hide();
        } else {
            show();
        }
    }

    private void hide() {
        // Hide UI first
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.hide();
        }
        //mControlsView.setVisibility(View.GONE);
        mVisible = false;

        // Schedule a runnable to remove the status and navigation bar after a delay
        mHideHandler.removeCallbacks(mShowPart2Runnable);
        mHideHandler.postDelayed(mHidePart2Runnable, UI_ANIMATION_DELAY);
    }

    @SuppressLint("InlinedApi")
    private void show() {
        // Show the system bar
        mGLView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
        mVisible = true;

        // Schedule a runnable to display UI elements after a delay
        mHideHandler.removeCallbacks(mHidePart2Runnable);
        mHideHandler.postDelayed(mShowPart2Runnable, UI_ANIMATION_DELAY);
    }
}
