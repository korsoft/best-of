# best-of


## Node Version 
``14.19.1``
## Apply patch for SpeechRecognition Pluggin
``````
https://github.com/pbakondy/cordova-plugin-speechrecognition/pull/121/files

fix files "fixes/SpeechRecognitionPluggin"
``````

## Fix SocialSharing.java

``````
To solve this I had to go to android folder in the plugin, find SocialSharing.java, and replace this line:

 final PendingIntent pendingIntent = PendingIntent.getBroadcast(cordova.getActivity().getApplicationContext(), 0, receiverIntent, PendingIntent.FLAG_UPDATE_CURRENT);

With this code
        int pendingIntentValueFLAG = 0; if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) { pendingIntentValueFLAG  = PendingIntent.FLAG_MUTABLE; } else { pendingIntentValueFLAG  = PendingIntent.FLAG_UPDATE_CURRENT; } final PendingIntent pendingIntent = PendingIntent.getBroadcast(cordova.getActivity().getApplicationContext(), 0, receiverIntent, pendingIntentValueFLAG);
        
Replace line 274:

final PendingIntent pendingIntent = PendingIntent.getBroadcast(cordova.getActivity().getApplicationContext(), 0, receiverIntent, PendingIntent.FLAG_IMMUTABLE);


``````

## iOS =======================================================================>

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


