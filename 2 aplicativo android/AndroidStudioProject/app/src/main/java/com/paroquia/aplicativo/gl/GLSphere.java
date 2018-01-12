package com.paroquia.aplicativo.gl;

import android.opengl.GLES20;
import android.provider.SyncStateContract;

import com.paroquia.aplicativo.gl.math.Constants;
import com.paroquia.aplicativo.gl.math.Vector3;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;
import java.nio.ShortBuffer;
import java.util.ArrayList;

/**
 * Created by alessandro on 23/12/2017.
 */

public class GLSphere {
    private FloatBuffer vertexBuffer;
    private FloatBuffer uvBuffer;
    private ShortBuffer indexBuffer;

    float coords[];
    float uv[];
    short index[];

    int totalCoords = 0;
    int totalIndex = 0;

    void polarLerp(float [] vertexA , float u, float v) {

        vertexA[0] = (float)Math.cos( u * Constants.PI * 2.0f );
        vertexA[1] = 0;
        vertexA[2] = (float)Math.sin( u * Constants.PI * 2.0f );

        vertexA[1] = (float)Math.cos( v * Constants.PI );

        //normalize other according the y in sphere
        float lengthXZ = (float)Math.sqrt( vertexA[0]*vertexA[0] + vertexA[2]*vertexA[2] );

        float lengthXZNeedToBe = (float)Math.sqrt( 1 - vertexA[1]*vertexA[1] );

                /*
                float lengthY = (float)Math.sqrt(vertexA[1]*vertexA[1] + lengthXZ*lengthXZ);

                1 = sqrt( vertexA[1]*vertexA[1] + lengthXZ^2 )
                1 = vertexA[1]*vertexA[1] + lengthXZ^2
                1 - vertexA[1]*vertexA[1] = lengthXZ^2
                sqrt( 1 - vertexA[1]*vertexA[1] ) = lengthXZ

                */
        float toNormalize = lengthXZNeedToBe / lengthXZ;

        vertexA[0] *= toNormalize;
        vertexA[2] *= toNormalize;

    }

    public GLSphere(int hSlices, int vSlices, float radius) {

        float[] vertexA = new float[3];

        totalCoords = (hSlices) * (vSlices);
        totalIndex = (hSlices - 1) * (vSlices - 1);

        coords = new float[ totalCoords * 3 ];
        uv = new float[ totalCoords * 2 ];
        index = new short[ totalIndex * 6 ];

        int idx = 0;

        for(int i=0;i<vSlices;i++) {
            float v = (float)i / (float)(vSlices-1);

            float vGen = v;

            for(int j=0;j<hSlices;j++) {
                float u = (float)j / (float)(hSlices-1);

                float uGen = u;
                if (j == hSlices-1)
                    uGen = 0;

                polarLerp(vertexA, uGen, vGen );
                Vector3.multiply(vertexA, vertexA, radius);
                idx = i*( hSlices ) + j;
                Vector3.copy( coords,idx*3, vertexA  );

                uv[idx*2 + 0] = (u);
                uv[idx*2 + 1] = (v);

                if (j < hSlices - 1 && i < vSlices - 1 )
                {
                    idx = i*( hSlices - 1 ) + j;

                    index[idx*6 + 0] = (short)((i+0)*( hSlices )+(j+0));
                    index[idx*6 + 2] = (short)((i+0)*( hSlices )+(j+1));
                    index[idx*6 + 1] = (short)((i+1)*( hSlices )+(j+1));

                    index[idx*6 + 3] = (short)((i+0)*( hSlices )+(j+0));
                    index[idx*6 + 5] = (short)((i+1)*( hSlices )+(j+1));
                    index[idx*6 + 4] = (short)((i+1)*( hSlices )+(j+0));

                }
            }
        }

        {
            ByteBuffer bb = ByteBuffer.allocateDirect( coords.length * 4);
            bb.order(ByteOrder.nativeOrder());
            vertexBuffer = bb.asFloatBuffer();
            vertexBuffer.put(coords);
            vertexBuffer.position(0);
        }

        {
            ByteBuffer bb = ByteBuffer.allocateDirect( uv.length * 4);
            bb.order(ByteOrder.nativeOrder());
            uvBuffer = bb.asFloatBuffer();
            uvBuffer.put(uv);
            uvBuffer.position(0);
        }

        {
            ByteBuffer bb = ByteBuffer.allocateDirect(index.length * 2);
            bb.order(ByteOrder.nativeOrder());
            indexBuffer = bb.asShortBuffer();
            indexBuffer.put(index);
            indexBuffer.position(0);
        }

    }


    public void Draw(GLShader enabledShader) {
        enabledShader.EnableVertexAttribArray();
        GLES20.glVertexAttribPointer(enabledShader.mPositionAttrib, 3, GLES20.GL_FLOAT, false, 3 * 4, vertexBuffer);
        GLES20.glVertexAttribPointer(enabledShader.mUVAttrib, 2, GLES20.GL_FLOAT, false, 2 * 4, uvBuffer);
        GLES20.glDrawElements(GLES20.GL_TRIANGLES, index.length, GLES20.GL_UNSIGNED_SHORT, indexBuffer );
        enabledShader.DisableVertexAttribArray();
    }

}

