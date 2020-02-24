# Smartphone Application for Catholic Parish #

## Description ##

This Package has algorithms and libraries needed to create and publish online smartphone application with features to aid the information delivery related to Catholic Parish.

Create yourself an android smartphone app to your parish with: news, group that belongs to your parish, information about the parish itself, asking for pray section,  digital documents (guides, novena), music scripts listing and music chords.

Watch the [videos](#videos) that explain the details.

Site(En): https://sites.google.com/site/smartphoneparishapp/en

Site(Pt-BR): https://sites.google.com/site/smartphoneparishapp/

### History ###

The app idea comes from the observing of the parish near my home.

The first insight is related to the amount of paper that is used for information delivery ( celebration, events, etc...).

The second insight is related to the groups that belongs (aid) to the parish. I saw as a big effort to know information about the groups, their meetings, etc...

With that in my mind, I thought: Why do not create a smartphone app to hold that information?

So I did that.

### The Application ###

Instead of giving a ready to use app, it was created a set of tools (scripts, programs and projects) that allows any people to build its own android application.

The tools are made to aid the process of create, configure and deliver the application to the Google Play Store. The tools aid in the update process after publication also.

Were created a set of videos with subtitles(pt-br) to explain step-by-step what to do to create the application. The videos explain the software architecture choices also.

The application has four parts:

* __News (pt-br:Notícias):__ contains the news listing. Each news can be created and updated from its own tool.
* __Community Activities (pt-br:Atividades da comunidade):__ contains the groups listing that belongs(aid) the parish. Each group information might have its history, their meetings information and an invitation message.
* __The Parish (pt-br: A paróquia):__ contains information that don't change very frequently (schedule for the celebration, confession, contacts, batism procedure, marriage procedure, etc...)
* __Ask for Pray (pt-br: Pedidos de oração):__ contains the information to aid people to send his pray intention in that parish.

### The Application Works With Internet and Without Internet ###

The application is designed to work with or without the internet.

When the internet is available, the internal information (internal data) is updated as soon as the application starts.

When the smartphone doesn't has access to the internet, it allows access to the information that came from the latest update.

If you want to know how it works, you can take a look at the [architecture video (pt-br)](https://www.youtube.com/watch?v=dyWYwTL6vzA).

### Why Android? ###

I developed this project to run in Android platform because you need to pay the registration fee once and publish as many applications as you want at the google's android development & publishing program.

This version doesn't has iPhone and iPad support, because to build iOS application, you need to pay about 200 US$ per year to keep the application in the Apple Store. It was not developed for this platform because of the cost issue.

### Plugins ###

The software architecture is designed to support plugins also.

A plugin is a way to extend the application functionality (app feature) without the need to create an application from scratch.

__Example:__ Imagine that the application has the functionality to present news. Now we want to add a __day by day liturgy reading__. For that, we might create a new application, or we can use the same application, but using a __plugin__ that enables the application to have this new functionality (__day by day liturgy reading__).

### Plugins Already Available in this Version  ###

This application version already comes with two plugins that can be used.

The first is the __Digital Guide (pt-br:guia digital)__ plugin. This plugin enable the parish to create digital documents based on steps or based on days like novenas. It is possible to deliver these documents to the people's smartphones through this plugin. It can be useful for deliver pray guides, novenas, etc...

The second is the __Script & Music (pt-br:repertórios)__ plugin. This plugin enable the parish to create music scripts, musics lyrics or music with chords. When the plugin is installed in the application, the people can access music scripts, music lyrics, music chords or print a PDF document that contains all the music script. It can be useful for musicians, to singers and to every people that want to follow the music sequence that is used in the celebration.

### Videos ###

The videos below were created to explain step-by-step how to use the tools. It starts from download the project, configure icons, create the application for the google store, until the instalation and configuration of the plugins.

Videos list (subtitles in pt-br):

* [Step 1: Download the Project from GitHub](https://www.youtube.com/watch?v=UUGD_SbGjyk)
* [Introduction to the Software Architecture and External Tools](https://www.youtube.com/watch?v=dyWYwTL6vzA)
* [Step 2: Publishing the Application](https://www.youtube.com/watch?v=ynvnRtJN-sg)
* [Step 3: News Editor](https://www.youtube.com/watch?v=jZEcCWmhN0c)
* [Step 4: Group Editor](https://www.youtube.com/watch?v=HcCmkzr6Utg)
* [Step 5: Parish Information Editor](https://www.youtube.com/watch?v=tPjJglzY8dU)
* [Step 6: Ask for Pray Editor](https://www.youtube.com/watch?v=AeJoLf-WFjs)
* [Step 7: Changing the Application Colors (theme)](https://www.youtube.com/watch?v=3-m6wBR8OeE)
* [Plugins](https://www.youtube.com/watch?v=-OdgHzSNvX0)
* [PLUGIN: Digital Guide](https://www.youtube.com/watch?v=D9x8yRH0loM)
* [PLUGIN: Music Script and Music Chords](https://www.youtube.com/watch?v=sI1sC48iKEA)


### Application Screens (pt-br) ###

![alt tag](https://github.com/A-Ribeiro/smartphone-parish-app/raw/master/website/img/a1.jpg)
![alt tag](https://github.com/A-Ribeiro/smartphone-parish-app/raw/master/website/img/b1.jpg)
![alt tag](https://github.com/A-Ribeiro/smartphone-parish-app/raw/master/website/img/a3a.jpg)
![alt tag](https://github.com/A-Ribeiro/smartphone-parish-app/raw/master/website/img/_a3.jpg)


# Software List #

## Development Environment

1. [Android Studio](https://developer.android.com/studio/)
1. [Chrome](https://www.google.com.br/chrome/browser/desktop/)
1. [Notepad++](https://notepad-plus-plus.org/)

## Image Editors

1. [Gimp](https://www.gimp.org/)
1. [Krita](https://krita.org/)
1. [MyPaint](http://mypaint.org/)
1. [InkScape](https://inkscape.org/)

## File Transfer Software (FTP)

1. [FileZilla](https://filezilla-project.org/)

## Local HTTP Server

1. [XAMPP](https://www.apachefriends.org/pt_br/index.html)

## 3rd Party Services That Needs Account Configuration

1. [Google Play Developer](https://play.google.com/apps/publish/)
1. [000Webhost](https://www.000webhost.com/)

# Release Notes #

### Release v1.0 ###

* Windows tool set (exe)
* Google Drive setup script
* Builtin content pack script
* Online content pack and upload script
* Android Studio application project
* News editor
* Group editor
* Parish information editor
* Pray editor
* Included Plugin: online-guia-digital (digital guide)
* Included Plugin: online-repertorios (music script)
