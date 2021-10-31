!macro customUnInstall
   RMDir /r /REBOOTOK "$PROFILE\AppData\Roaming\Sigma file manager\"
   ClearErrors
   FileOpen $0 "$PROFILE\AppData\Roaming\test_ddddd.txt" w
   IfErrors done
   FileWrite $0 "some text"
   FileClose $0
   done:
!macroend
