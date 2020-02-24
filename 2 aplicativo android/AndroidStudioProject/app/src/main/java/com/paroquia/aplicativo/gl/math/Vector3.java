package com.paroquia.aplicativo.gl.math;

/**
 * Created by alessandro on 24/12/2017.
 */

public class Vector3 {

    public static void add(float[] result, float[] a, float [] b){
        result[0] = a[0] + b[0];
        result[1] = a[1] + b[1];
        result[2] = a[2] + b[2];
    }
    public static void add(float[] result, float[] a, float b){
        result[0] = a[0] + b;
        result[1] = a[1] + b;
        result[2] = a[2] + b;
    }

    public static void subtract(float[] result, float[] a, float [] b){
        result[0] = a[0] - b[0];
        result[1] = a[1] - b[1];
        result[2] = a[2] - b[2];
    }
    public static void subtract(float[] result, float[] a, float b){
        result[0] = a[0] - b;
        result[1] = a[1] - b;
        result[2] = a[2] - b;
    }

    public static void multiply(float[] result, float[] a, float [] b){
        result[0] = a[0] * b[0];
        result[1] = a[1] * b[1];
        result[2] = a[2] * b[2];
    }
    public static void multiply(float[] result, float[] a, float b){
        result[0] = a[0] * b;
        result[1] = a[1] * b;
        result[2] = a[2] * b;
    }

    public static void divide(float[] result, float[] a, float [] b){
        result[0] = a[0] / b[0];
        result[1] = a[1] / b[1];
        result[2] = a[2] / b[2];
    }
    public static void divide(float[] result, float[] a, float b){
        result[0] = a[0] / b;
        result[1] = a[1] / b;
        result[2] = a[2] / b;
    }


    public static void cross(float[] result, float[] a, float [] b){
        float x = ( a[1] * b[2] - b[1] * a[2] );
        float y = ( b[0] * a[2] - a[0] * b[2] );
        float z = ( a[0] * b[1] - b[0] * a[1] );

        result[0] = x;
        result[1] = y;
        result[2] = z;

    }

    public static float dot(float[] a, float [] b){
        return (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
    }

    public static float magnitude_sqr(float[] vec){
        return dot(vec,vec);
    }

    public static float magnitude(float[] vec){
        return (float)Math.sqrt( magnitude_sqr(vec) );
    }

    public static void normalize(float[] vec ){
        final float TOLERANCE = 0.001f;
        // Don't normalize if we don't have to
        float mag2 = dot( vec, vec );
        if (Math.abs(mag2) > TOLERANCE && Math.abs(mag2 - 1.0f) > TOLERANCE)
            multiply( vec, vec, ( 1.0f / (float)Math.sqrt( mag2 ) ) );
    }


    public static void clamp(float[] result, float[] min, float [] max){
        if ( result[0] < min[0] )
            result[0] = min[0];
        else if ( result[0] > max[0] )
            result[0] = max[0];

        if ( result[1] < min[1] )
            result[1] = min[1];
        else if ( result[1] > max[1] )
            result[1] = max[1];

        if ( result[2] < min[2] )
            result[2] = min[2];
        else if ( result[2] > max[2] )
            result[2] = max[2];

    }

    public static void copy( float[] result, float[] a ) {
        result[0] = a[0];
        result[1] = a[1];
        result[2] = a[2];
    }

    public static void copy( float[] result, int offset, float[] a ) {
        result[0+offset] = a[0];
        result[1+offset] = a[1];
        result[2+offset] = a[2];
    }

    public static void copy( float[] result, int offset, float[] a, int offsetA ) {
        result[0+offset] = a[0+offsetA];
        result[1+offset] = a[1+offsetA];
        result[2+offset] = a[2+offsetA];
    }

    public static void reflect( float[] result, float[] a, float[] N ){
        float[] temp = new float[3];
        multiply( temp , N , - 2.0f * dot( a,N )  );
        subtract( result, a, temp );
    }

    public static float distance_sqr(float[] a, float [] b) {
        float[] temp = new float[3];
        subtract(temp, a, b);
        return magnitude_sqr(temp);
    }

    public static float distance(float[] a, float [] b) {
        float[] temp = new float[3];
        subtract(temp, a, b);
        return magnitude(temp);
    }


    public static void abs( float[] result , float[] a) {
        result [0] = Math.abs( a[0] );
        result [1] = Math.abs( a[1] );
        result [2] = Math.abs( a[2] );
    }


    public static void lerp( float[] result , float[] a, float[] b, float t) {

        float one_minus_t = 1.0f-t;

        result[0] = a[0]*one_minus_t + b[0]*t;
        result[1] = a[1]*one_minus_t + b[1]*t;
        result[2] = a[2]*one_minus_t + b[2]*t;

    }


    // Special Thanks to Johnathan, Shaun and Geof!
    public static void slerp( float[] result , float[] a, float[] b, float t)
    //Vector3 Slerp(Vector3 start, Vector3 end, float percent)
    {
        // Dot product - the cosine of the angle between 2 vectors.
        float dot = Vector3.dot(a,b);
        // Clamp it to be in the range of Acos()
        // This may be unnecessary, but floating point
        // precision can be a fickle mistress.
        if ( dot < -1.0f)
            dot = -1.0f;
        else if (dot > 1.0f)
            dot = 1.0f;

        // Acos(dot) returns the angle between start and end,
        // And multiplying that by percent returns the angle between
        // start and the final result.
        float theta = (float)Math.acos(dot)*t;

        float RelativeVecX= b[0] - a[0]*dot;
        float RelativeVecY= b[1] - a[1]*dot;
        float RelativeVecZ= b[2] - a[2]*dot;

        float mag = 1.0f / (float)Math.sqrt( RelativeVecX * RelativeVecX +
                RelativeVecY * RelativeVecY +
                RelativeVecZ * RelativeVecZ );

        RelativeVecX *= mag;
        RelativeVecY *= mag;
        RelativeVecZ *= mag;

        //Vector3.normalize(RelativeVec);// Orthonormal basis
        // The final result.


        float cosTheta =(float)Math.cos(theta);
        float sinTheta =(float)Math.sin(theta);

        result[0] = (a[0]*cosTheta) + (RelativeVecX*sinTheta);
        result[1] = (a[1]*cosTheta) + (RelativeVecY*sinTheta);
        result[2] = (a[2]*cosTheta) + (RelativeVecZ*sinTheta);
    }

}
