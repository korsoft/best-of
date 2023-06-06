# best-of


## Node Version 
``14.19.1``
## Apply patch for SpeechRecognition Pluggin
``````
https://github.com/pbakondy/cordova-plugin-speechrecognition/pull/121/files

fix files "fixes/SpeechRecognitionPluggin"
``````

## ANDROID =======================================================================>


## This project needs to work with Android SDK API 31. to fix it you need to change
``````
After some digging I found the file that was causing me issues was located at:

node_modules/@capacitor/android/capacitor/src/main/AndroidManifest.xml

NOTE: This might be in your root node_modules file instead. I'm using Quasar (v1).

If you are building locally you can just edit that file and change the following line from:

<service android:name="com.getcapacitor.CapacitorFirebaseMessagingService" android:stopWithTask="false">

to

<service android:name="com.getcapacitor.CapacitorFirebaseMessagingService" android:stopWithTask="false" android:exported="true">

and 

<receiver android:name="nl.xservices.plugins.ShareChooserPendingIntent" android:enabled="true" android:exported="true">
``````

## Fix SocialSharing.java

``````
Replace line 274:

final PendingIntent pendingIntent = PendingIntent.getBroadcast(cordova.getActivity().getApplicationContext(), 0, receiverIntent, PendingIntent.FLAG_IMMUTABLE);


``````

## Command PhaseScriptExecution failed with a nonzero exit code

``````
File not found: /Applications/Xcode-beta.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/lib/arc/libarclite_iphoneos.a

Open terminal:
cd /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/lib/
sudo mkdir arc
cd  arc
sudo git clone https://github.com/kamyarelyasi/Libarclite-Files.git .
sudo chmod +x *


In your Xcode navigate to:

Pods \ Target Support Files \ Pods-Runner or Pods-App  

Open Pods-Runner-frameworks.sh  or Pods-App-frameworks.sh

Find the line: source="$(readlink "${source}")" 

Replace it by: source="$(readlink -f "${source}")"

https://stackoverflow.com/questions/75574268/missing-file-libarclite-iphoneos-a-xcode-14-3

``````


