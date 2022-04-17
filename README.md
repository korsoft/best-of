# best-of
## Cordova plugins
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-file


##Para compila en Android
Primero tienes que tener instalado Gradle y por lo menos una versión de 
Java. En este caso me pidió la versión 1.8. 

Para usarla se setea la variable JAVA_HOME apuntando al home del jdk 1.8.
Posteriormente se setea la variable  ANDROID_HOME apuntando al sdk de 
android studio. Finalmente se corre el comando:

ionic cordova build --release android

En caso de que marque error se recomienda borrar la carpeta platform/androiod
y volver a correr el comando.

Para generar el aab se procede a moverse a la carpeta platforms/android. Allí se corre 
el archivo gradlew bundle y al finalizar se encuentra el abb en  app/build/outputs/bundle/release. 

Important!!!
node 14.19.1


