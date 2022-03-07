#!/bin/bash
declare -a simulators=("98D157AE-A3E1-47B0-BDFD-FB9AA0E4EF1B" "4610E004-F1E7-4DE7-818F-35C0A4888CF7")

for i in "${simulators[@]}"
do
    xcrun instruments -w $i
    #xcrun simctl install $i ~/.expo/ios-simulator-app-cache/Exponent-2.21.3.tar.app
    xcrun simctl openurl $i exp://127.0.0.1:19000      
done