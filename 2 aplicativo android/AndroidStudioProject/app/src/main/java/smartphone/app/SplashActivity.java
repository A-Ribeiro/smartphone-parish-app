package smartphone.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

import com.paroquia.aplicativo.GLPhotoView360;

public class SplashActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = new Intent(this, MainActivity.class);

        //Intent intent = new Intent(this, GLPhotoView360.class);
        //intent.putExtra("filename","test filename");
        //intent.setData(Uri.parse("file:///data/user/0/com.paroquia.aplicativo/files/builtin/jpg/img_4096.jpg"));

        startActivity(intent);
        finish();
    }
}

