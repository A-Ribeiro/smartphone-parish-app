package smartphone.app;


import android.Manifest;
import android.app.Application;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.MediaScannerConnection;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.JsResult;
import android.webkit.ValueCallback;
import android.webkit.WebBackForwardList;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.UnknownHostException;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.nio.charset.StandardCharsets;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import android.util.Base64;


public class MainActivity extends AppCompatActivity {

    WebView webView;
    ProgressDialog progress;

    @Override
    public void onBackPressed() {

        if (progress == null) {
            super.onBackPressed();
            return;
        }
        if (progress.isShowing())
            return;

        webView.loadUrl("javascript:deviceBackPress();");
    }

    public void onBackPressedSuper() {
        //super.onBackPressed();
        finish();
    }


    @Override
    protected void onSaveInstanceState(Bundle outState)
    {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState)
    {
        super.onRestoreInstanceState(savedInstanceState);
        webView.restoreState(savedInstanceState);
    }

    class JavaScriptInterface {
        @JavascriptInterface
        public void forwardBackPress() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (webView.canGoBack()) {


                        WebBackForwardList list = webView.copyBackForwardList();
                        String lastUrl = list.getItemAtIndex(list.getCurrentIndex()-1).getUrl();

                        //Log.v("lastUrl",lastUrl);

                        while ( webView.canGoBack() && ( lastUrl != null && lastUrl.contains("javascript:") ) ) {
                            webView.goBack();

                            list = webView.copyBackForwardList();
                            lastUrl = list.getItemAtIndex(list.getCurrentIndex()-1).getUrl();
                        }

                        webView.goBack();

                        while ( webView.canGoBack() && ( lastUrl != null && lastUrl.contains("javascript:") ) ) {
                            webView.goBack();

                            list = webView.copyBackForwardList();
                            lastUrl = list.getItemAtIndex(list.getCurrentIndex()-1).getUrl();
                        }

                    } else {
                        onBackPressedSuper();
                    }
                }
            });
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        //this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        if (getSupportActionBar() != null)
            getSupportActionBar().hide();
        setContentView(R.layout.activity_main);

        webView = (WebView) findViewById(R.id.webView) ;

        //webView.addJavascriptInterface(new JavaScriptInterface(), "android" );

        webView.setWebViewClient(new WebViewClient(){

            /*
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return super.shouldOverrideUrlLoading(view, request);
            }
            */

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                String requeststr = url;
                if (requeststr.startsWith("http://") ||
                        requeststr.startsWith("https://") ||
                        requeststr.startsWith("market://") ||
                        requeststr.startsWith("mailto:") ||
                        requeststr.startsWith("geo:") ||
                        requeststr.startsWith("tel:") ||
                        requeststr.startsWith("data:") ) {

                    if (requeststr.startsWith("http")  || requeststr.startsWith("market://") )
                        openWebPage(requeststr);
                    else if (requeststr.startsWith("geo"))
                        showMap(Uri.parse(requeststr));
                    else if (requeststr.startsWith("mailto"))
                        sendMail(requeststr);
                    else if (requeststr.startsWith("tel"))
                        dialPhoneNumber(requeststr);
                    else if (requeststr.startsWith("data:application/pdf;base64,")) {
                        String content = requeststr.substring( "data:application/pdf;base64,".length() );
                        try{
                            content = java.net.URLDecoder.decode(content,"UTF-8");
                        }catch(Exception e){
                        }

                        File dir = new File(Environment.getExternalStorageDirectory() + "/Download/ParishApp/");
                        dir.mkdirs();

                        File file = new File(Environment.getExternalStorageDirectory() + "/Download/ParishApp/view.pdf");

                        try {
                            if (file.exists())
                                file.delete();

                            FileOutputStream bos = new FileOutputStream(file);
                            bos.write(Base64.decode(content, 0));
                            bos.flush();
                            bos.close();

                            MediaScannerConnection.scanFile(getApplicationContext(), new String[] { file.toString() }, null,
                            new MediaScannerConnection.OnScanCompletedListener() {
                                public void onScanCompleted(String path, Uri uri) {
                                    Log.i("ExternalStorage", "Scanned " + path + ":");
                                    Log.i("ExternalStorage", "-> uri=" + uri);

                                    Intent intent;
                                    intent = new Intent(Intent.ACTION_VIEW);
                                    intent.setDataAndType( uri , "application/pdf");
                                    intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                                    if (intent.resolveActivity(getPackageManager()) != null) {
                                        startActivity(intent);
                                    }

                                }
                            });
                        } catch (IOException e) {
                            //Log.e(TAG, "IOError with PDF");
                            e.printStackTrace();
                        }
                    }

                    //Log.d("url","loading external url: " + requeststr );
                    return true;
                }
                return super.shouldOverrideUrlLoading(view, url);
            }
        });
        webView.setWebChromeClient(new WebChromeClient(){
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress == 100) {
                    progress.setMessage( "..." );
                    dismissLoadingDialog();
                } else {
                    progress.setMessage( "Progresso: " + newProgress + "%" );
                    showLoadingDialog();
                }
                super.onProgressChanged(view, newProgress);
            }


            @Override
            public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
                result.confirm();

                if ( message.compareTo( "android.forwardBackPress" ) == 0 ) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            //if (webView.canGoBack()) {
                            //    webView.goBack();
                            //} else {
                                onBackPressedSuper();
                            //}
                        }
                    });
                }

                if ( message.startsWith( "android.downloadfile:" ) ) {

                    String urlToDownload = message.substring("android.downloadfile:".length());
                    new DownloadHelper(urlToDownload,
                        "download.aux",
                        new IDownload() {
                            @Override
                            public void callback(String url, String filepath, boolean success) {

                                if (!success) {
                                    webView.loadUrl("javascript:downloadcallback(false,\"\");");
                                } else {
                                    webView.loadUrl("javascript:downloadcallback(true,\"file://"+FilePath(filepath)+"\");");
                                }
                            }
                        },
                        128*1024// 128k max file size download
                    ).start();

                }

                return true;
                //return super.onJsAlert(view, url, message, result);
            }
        });
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setAllowFileAccessFromFileURLs(true);
        webView.getSettings().setAllowUniversalAccessFromFileURLs(true);

        //webView.setInitialScale(1);
        //webView.getSettings().setBuiltInZoomControls(true);
        //webView.getSettings().setUseWideViewPort(true);

        progress = new ProgressDialog(this);
        progress.setTitle("Carregando");
        progress.setMessage("Aguarde um instante...");
        progress.setCancelable(false);
        //progress.show();
        // To dismiss the dialog
        //progress.dismiss();

        if (savedInstanceState != null){
            webView.restoreState(savedInstanceState);
        } else {

            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    showLoadingDialog();
                }
            });

            unzip_tries = 0;

            UnzipBuiltin(new Runnable() {
                @Override
                public void run() {
                    new Thread(new Runnable(){
                        @Override
                        public void run() {
                            if (isNetworkAvailable() && isOnlineGoogle1()) {
                                new DownloadHelper(Constants.urlcontentDownload,
                                        "urlcontentupdate.txt",
                                        new UrlContentUpdateTXTResponseCallback()).start();
                            } else {
                                runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        UnzipInternalContent();
                                    }
                                });
                            }
                        }
                    }).start();

                }
            });
            //webView.loadUrl("file://" + FilePath("content/noticia.html"));
        }


        //check write externals permission
        if (Build.VERSION.SDK_INT >= 23) {
            if (checkSelfPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE)
                    == PackageManager.PERMISSION_GRANTED) {
                Log.v("write permission","Permission is granted");
            } else {

                Log.v("write permission","Permission is revoked");
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
            }
        }
    }

    public boolean isNetworkAvailable() {
        ConnectivityManager cm =
                (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo netInfo = cm.getActiveNetworkInfo();
        return netInfo != null && netInfo.isConnectedOrConnecting();
    }

    public static boolean isOnlineGoogle1() {
        try {
            InetAddress.getByName("google.com").isReachable(500);
            return true;
        } catch (UnknownHostException e){
            return false;
        } catch (IOException e){
            return false;
        }
    }

    public boolean isOnlineGoogle2() {

        Runtime runtime = Runtime.getRuntime();
        try {

            Process ipProcess = runtime.exec("/system/bin/ping -c 1 8.8.8.8");
            int     exitValue = ipProcess.waitFor();
            return (exitValue == 0);

        } catch (IOException e)          { e.printStackTrace(); }
        catch (InterruptedException e) { e.printStackTrace(); }

        return false;
    }

    public void showLoadingDialog() {
        if (progress != null && !progress.isShowing()) {
            progress.show();
        }
    }

    public void dismissLoadingDialog() {

        if (progress != null && progress.isShowing()) {
            progress.dismiss();
        }
    }

    public void openWebPage(String url) {
        Uri webpage = Uri.parse(url);
        Intent intent = new Intent(Intent.ACTION_VIEW, webpage);
        if (intent.resolveActivity(getPackageManager()) != null) {
            startActivity(intent);
        }
    }

    public void showMap(Uri geoLocation) {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setData(geoLocation);
        if (intent.resolveActivity(getPackageManager()) != null) {
            startActivity(intent);
        }
    }

    public void sendMail(String uri) {
        Intent intent = new Intent(Intent.ACTION_SENDTO);
        intent.setData(Uri.parse(uri));
        if (intent.resolveActivity(getPackageManager()) != null) {
            startActivity(intent);
        }
    }

    public void composeEmail(String[] addresses, String subject, String text) {
        Intent intent = new Intent(Intent.ACTION_SENDTO);
        intent.setData(Uri.parse("mailto:")); // only email apps should handle this
        intent.putExtra(Intent.EXTRA_EMAIL, addresses);
        intent.putExtra(Intent.EXTRA_SUBJECT, subject);
        intent.putExtra(Intent.EXTRA_TEXT, subject);
        if (intent.resolveActivity(getPackageManager()) != null) {
            startActivity(intent);
        }
    }

    public void dialPhoneNumber(String uri) {
        Intent intent = new Intent(Intent.ACTION_DIAL);
        intent.setData(Uri.parse(uri));
        if (intent.resolveActivity(getPackageManager()) != null) {
            startActivity(intent);
        }
    }

    interface IDownload {
        void callback(String url, String filepath , boolean success);
    }

    class UrlContentUpdateZIPResponseCallback implements IDownload {

        @Override
        public void callback(String url, String filepath, boolean success) {
            if (!success){
                Log.d("ZIPCallback", " download fail ... unzipping original file" );
                //clearAllDownloadedFiles();
                getApplicationContext().deleteFile("contentupdate.zip");
                getApplicationContext().deleteFile("urlcontentupdate.txt");

                UnzipInternalContent();
            } else {
                Log.d("ZIPCallback", " updating urlcontent.txt " );
                getApplicationContext().deleteFile( "urlcontent.txt" );
                try {
                    FileOutputStream fileOutput = getApplicationContext().openFileOutput( "urlcontent.txt",  Context.MODE_PRIVATE);
                    fileOutput.write(url.getBytes());
                    fileOutput.close();
                    Log.d("ZIPCallback", " updating urlcontent.txt done..." );
                    UnzipInternalContent(filepath);
                } catch (FileNotFoundException e) {
                    Log.d("ZIPCallback", " ERROR TO WRITE urlcontent.txt... unzip internal content" );
                    //e.printStackTrace();
                    UnzipInternalContent();
                } catch (IOException e) {
                    Log.d("ZIPCallback", " ERROR TO WRITE urlcontent.txt... unzip internal content" );
                    //e.printStackTrace();
                    UnzipInternalContent();
                }
            }
        }
    }

    // first response with the final file URL
    class UrlContentUpdateTXTResponseCallback implements IDownload {
        @Override
        public void callback(String url, String filepath, boolean success) {
            if (!success) {
                Log.d("TXTCallback", " downloading failed... unzip the original content... ");
                //clearAllDownloadedFiles();
                getApplicationContext().deleteFile("urlcontentupdate.txt");

                UnzipInternalContent();
            } else {
                String urlcontentupdate = "";
                String urlcontent = "";
                try {
                    urlcontentupdate = convertStreamToString(getApplicationContext().openFileInput("urlcontentupdate.txt"));
                    urlcontent = convertStreamToString(getApplicationContext().openFileInput("urlcontent.txt"));
                } catch (IOException e) {
                }
                Log.d("TXTCallback", " checking: " + urlcontentupdate + " with " + urlcontent);
                if ( urlcontentupdate.length() > 0 && (urlcontent.length() == 0 || urlcontent.compareTo(urlcontentupdate) != 0 ) )
                    new DownloadHelper(urlcontentupdate,"contentupdate.zip",new UrlContentUpdateZIPResponseCallback() ).start();
                else
                    webView.loadUrl("file://" + FilePath("content/noticia.html"));
            }
        }
    }

    class DownloadHelper extends Thread {

        public String srcURL;
        public String dstFile;
        IDownload finishCallback;
        int maxFileSize = Integer.MAX_VALUE;

        public DownloadHelper(String srcURL, String dstFile, IDownload finishCallback) {
            this.srcURL = srcURL;
            this.dstFile = dstFile;
            this.finishCallback = finishCallback;
        }

        public DownloadHelper(String srcURL, String dstFile, IDownload finishCallback, int maxFileSize) {
            this.srcURL = srcURL;
            this.dstFile = dstFile;
            this.finishCallback = finishCallback;
            this.maxFileSize = maxFileSize;
        }

        @Override
        public void run() {

            /*
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    showLoadingDialog();
                }
            });
            */

            getApplicationContext().deleteFile(dstFile);
            Log.d("DownloadHelper", " downloading: " + dstFile  );
            boolean result = false;
            try {
                URL url = new URL(srcURL);

                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();

                urlConnection.setConnectTimeout(30000);
                urlConnection.setReadTimeout(30000);
                urlConnection.setInstanceFollowRedirects(true);
                urlConnection.setUseCaches(false);
                urlConnection.setDoInput(true);
                //urlConnection.setDoOutput(true);
                //urlConnection.setRequestMethod("GET");
                urlConnection.setRequestMethod("GET");


                //connect
                System.setProperty("http.keepAlive", "false");
                System.setProperty("java.net.preferIPv4Stack" , "true");
                //urlConnection.setRequestProperty("Content-Length", "1000");
                urlConnection.setRequestProperty("Connection", "close");
                urlConnection.connect();
                //int length = urlConnection.getContentLength();
                urlConnection.getRequestMethod();

                FileOutputStream fileOutput = getApplicationContext().openFileOutput( dstFile,  Context.MODE_PRIVATE);
                /*
                ReadableByteChannel byteChannel = Channels.newChannel(urlConnection.getInputStream());

                fileOutput.getChannel().transferFrom( byteChannel, 0, Long.MAX_VALUE  );

                byteChannel.close();*/


                InputStream inputStream = urlConnection.getInputStream();
                byte[] buffer = new byte[64*1024];
                int total = 0;
                int bufferLength = 0;
                //Log.d( "DownloadHelper", "reading..." );
                bufferLength = inputStream.read(buffer);
                //Log.d( "DownloadHelper", "readed: " + bufferLength);
                while ( bufferLength > 0 ) {
                    fileOutput.write(buffer, 0, bufferLength);
                    total+=bufferLength;
                    //Log.d( "DownloadHelper", "reading..." );
                    bufferLength = inputStream.read(buffer);
                    //Log.d( "DownloadHelper", "readed: " + bufferLength);

                    //failed if the file is greater than the max file size
                    if (total >= maxFileSize) {
                        total = 0;
                        break;
                    }
                }
                inputStream.close();
                //*/
                fileOutput.close();
                //
                //result = true;
                result = (total > 0);
            } catch (MalformedURLException e) {
                e.printStackTrace();
                //Log.d( "DownloadHelper", e.getMessage() );
            } catch (IOException e) {
                e.printStackTrace();
                //Log.d( "DownloadHelper", e.getMessage() );
            } catch (Exception e) {
                e.printStackTrace();
                //Log.d( "DownloadHelper", e.getMessage() );
            }
            Log.d( "DownloadHelper", " downloading: " + dstFile + ((result)?" SUCCESS":" FAILED") );

            //dismissLoadingDialog();

            runOnUiThread( new InternalCallbackCall(srcURL,dstFile,finishCallback,result) );
        }

        class InternalCallbackCall implements Runnable{
            String url;
            String filePath;
            IDownload iDownload;
            boolean success;
            public InternalCallbackCall( String url, String filePath,  IDownload iDownload, boolean success ){
                this.url = url;
                this.filePath = filePath;
                this.iDownload = iDownload;
                this.success = success;
            }
            public void run() {
                iDownload.callback(url, filePath, success);
            }
        }
    }

    public static String convertStreamToString(InputStream is) throws IOException {
        // http://www.java2s.com/Code/Java/File-Input-Output/ConvertInputStreamtoString.htm
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        StringBuilder sb = new StringBuilder();
        String line = null;
        Boolean firstLine = true;
        while ((line = reader.readLine()) != null) {
            //if(firstLine){
            sb.append(line);
            //    firstLine = false;
            //} else {
            //    sb.append("\n").append(line);
            //}
        }
        reader.close();
        return sb.toString();
    }

    public static String getStringFromFile (String filePath) throws IOException {
        File fl = new File(filePath);
        FileInputStream fin = new FileInputStream(fl);
        String ret = convertStreamToString(fin);
        //Make sure you close all streams.
        fin.close();
        return ret;
    }



    public void OnButtonClick(View btn) {
        ((Button)btn).setText("Clicked!!!");
        UnzipInternalContent();
        webView.loadUrl( "file://"+FilePath("content/noticia.html") );
    }

    String FilePath(String file) {
        File outputDir = getApplicationContext().getFilesDir();
        return outputDir + "/" + file;
    }


    void deleteRecursive(File fileOrDirectory) {
        if (fileOrDirectory.isDirectory())
            for (File child : fileOrDirectory.listFiles())
                deleteRecursive(child);

        fileOrDirectory.delete();
    }

    void clearAllDownloadedFiles() {
        getApplicationContext().deleteFile("contentupdate.zip");
        getApplicationContext().deleteFile("urlcontentupdate.txt");
        getApplicationContext().deleteFile("urlcontent.txt");
    }

    void deleteContentFolder() {
        File outputDir = getApplicationContext().getFilesDir();
        File htmlOUT = new File(outputDir, "content/");
        deleteRecursive(htmlOUT);
    }


    class RunnableCaller implements Runnable{
        public Runnable runnable;

        public RunnableCaller(Runnable runnable) {
            this.runnable = runnable;
        }

        @Override
        public void run() {
            runnable.run();
        }
    }

    void UnzipBuiltin(Runnable callback) {

        File outputDir = getApplicationContext().getFilesDir();
        File htmlOUT = new File( outputDir, "builtin/" );

        Log.d("UnzipBuiltin", "d: " +  htmlOUT.getAbsolutePath() );

        //check on file inside builtin to update it
        boolean filePresent = false;
        {
            File fileToTest = new File(outputDir, Constants.builtinVersion );
            filePresent = fileToTest.exists() && fileToTest.isFile();
        }

        if ( htmlOUT.exists() && htmlOUT.isDirectory() ) {
            if (filePresent) {
                callback.run();
                return;
            } else {
                //need update -- file not present in the builtin
                deleteRecursive(htmlOUT);
            }
        }

        htmlOUT.mkdirs();
        new unzip_custom_thread(getResources().openRawResource(R.raw.builtin),outputDir,
                //success callback
                new RunnableCaller( callback ) ,
                //error callback -- try again with the inside-app content
                new Runnable() {
                    @Override
                    public void run() {
                        System.exit(0);
                    }
                }).start();
    }



    void UnzipInternalContent(String filePath) {

        File outputDir = getApplicationContext().getFilesDir();
        File htmlOUT = new File( outputDir, "content/" );

        Log.d("UnzipInternal", "d: " +  htmlOUT.getAbsolutePath() );

        if (htmlOUT.exists() && htmlOUT.isDirectory()){
            Log.d("UnzipInternal", " DELETING OLD CONTENT... "  );
            deleteRecursive(htmlOUT);
        }
            //return;

        //htmlOUT.delete();
        htmlOUT.mkdirs();



        try {

            new unzip_custom_thread(getApplicationContext().openFileInput(filePath),outputDir,
                    //success callback
                    new Runnable() {
                        @Override
                        public void run() {
                            webView.loadUrl("file://" + FilePath("content/noticia.html"));
                        }
                    },
                    //error callback -- try again with the inside-app content
                    new Runnable() {
                        @Override
                        public void run() {
                            clearAllDownloadedFiles();
                            deleteContentFolder();
                            //deleteRecursive(htmlOUT);
                            UnzipInternalContent();
                        }
                    }).start();
            //unzip_custom( getApplicationContext().openFileInput(filePath),outputDir);

        } catch (FileNotFoundException e) {

            clearAllDownloadedFiles();
            deleteRecursive(htmlOUT);
            UnzipInternalContent();
        }
    }

    void UnzipInternalContent() {

        File outputDir = getApplicationContext().getFilesDir();
        File htmlOUT = new File( outputDir, "content/" );

        Log.d("UnzipInternal", "d: " +  htmlOUT.getAbsolutePath() );

        //deleteRecursive(htmlOUT);

        if (htmlOUT.exists() && htmlOUT.isDirectory()) {
            webView.loadUrl("file://" + FilePath("content/noticia.html"));
            return;
        }

            //htmlOUT.delete();
        htmlOUT.mkdirs();
        //unzip_custom(getResources().openRawResource(R.raw.content),outputDir);

        new unzip_custom_thread(getResources().openRawResource(R.raw.content),outputDir,
                //success callback
                new Runnable() {
                    @Override
                    public void run() {
                        webView.loadUrl("file://" + FilePath("content/noticia.html"));
                    }
                },
                //error callback -- try again with the inside-app content
                new Runnable() {
                    @Override
                    public void run() {
                        clearAllDownloadedFiles();
                        deleteContentFolder();
                        //deleteRecursive(htmlOUT);
                        UnzipInternalContent();
                    }
                }).start();
    }

    volatile int unzip_tries;

    class unzip_custom_thread extends Thread{

        InputStream _zipFileInputStream;
        File outputDir;
        Runnable callbackSuccess;
        Runnable callbackError;

        public unzip_custom_thread(InputStream _zipFileInputStream, File outputDir, Runnable callbackSuccess, Runnable callbackError) {
            this._zipFileInputStream = _zipFileInputStream;
            this.outputDir = outputDir;
            this.callbackSuccess = callbackSuccess;
            this.callbackError = callbackError;
        }
        @Override
        public void run() {
            //64k buffer
            byte[] buffer = new byte[64*1024];

            try {
                //FileInputStream fin = new FileInputStream(_zipFile);
                ZipInputStream zin = new ZipInputStream(_zipFileInputStream);
                ZipEntry ze = null;
                while ((ze = zin.getNextEntry()) != null) {
                    //create dir if required while unzipping
                    if (ze.isDirectory()) {
                        File htmlOUT = new File( outputDir, ze.getName()+"/" );
                        if (!htmlOUT.exists())
                            htmlOUT.mkdirs();
                        Log.d("unzip_custom", "d: " +  ze.getName() );
                    } else {
                        FileOutputStream fout = new FileOutputStream(outputDir.getAbsolutePath() + "/" + ze.getName());;//getApplicationContext().openFileOutput( ze.getName(),  Context.MODE_PRIVATE);;//new FileOutputStream(_targetLocation + ze.getName());
                        Log.d("unzip_custom", "f: " +  ze.getName() );
                        int len = 0;
                        while ((len = zin.read(buffer)) > 0)
                            fout.write(buffer, 0, len);
                        zin.closeEntry();
                        fout.close();
                    }
                }
                zin.close();

                runOnUiThread(callbackSuccess);

            } catch (Exception e) {

                unzip_tries++;

                if (unzip_tries >= 50){
                    System.exit(0);
                    return;
                }

                System.out.println(e);

                runOnUiThread(callbackError);
            }
        }
    }

    //public void unzip_custom(InputStream _zipFileInputStream, File outputDir) {


    //}

}
