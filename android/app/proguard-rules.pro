# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in proguard-android-optimize.txt (see android/app/build.gradle).
#
# For more details, see:
#   https://developer.android.com/topic/performance/app-optimization/enable-app-optimization

# Preserve line numbers for deobfuscated crash reports.
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes InnerClasses,EnclosingMethod

# React Native core
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.proguard.annotations.DoNotStrip { *; }
-keep @com.facebook.proguard.annotations.DoNotStrip class * { *; }
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}
-keepclassmembers class * {
    native <methods>;
}

# TurboModules / New Architecture
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.uimanager.** { *; }
-keep class com.facebook.react.views.** { *; }

# Reanimated + Worklets
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.worklets.** { *; }

# Gesture Handler, Screens, Safe Area
-keep class com.swmansion.gesturehandler.** { *; }
-keep class com.swmansion.rnscreens.** { *; }
-keep class com.th3rdwave.safeareacontext.** { *; }

# Keyboard controller
-keep class com.reactnativekeyboardcontroller.** { *; }

# Async Storage, NetInfo, Slider, DateTimePicker
-keep class com.reactnativecommunity.asyncstorage.** { *; }
-keep class com.reactnativecommunity.netinfo.** { *; }
-keep class com.reactnativecommunity.slider.** { *; }
-keep class com.reactcommunity.rndatetimepicker.** { *; }

# Google Mobile Ads
-keep class io.invertase.googlemobileads.** { *; }
-keep class com.google.android.gms.ads.** { *; }
-dontwarn com.google.android.gms.**

# Expo modules (reflection-heavy native entry points)
-keep class expo.modules.** { *; }
-keep class versioned.host.exp.exponent.** { *; }

# SVG, View Shot, SVG charts
-keep class com.horcrux.svg.** { *; }
-keep class fr.greweb.reactnativeviewshot.** { *; }

# Suppress common third-party warnings
-dontwarn com.facebook.react.**
-dontwarn okhttp3.**
-dontwarn okio.**
