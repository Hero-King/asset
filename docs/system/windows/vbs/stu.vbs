Set objShell = CreateObject("Wscript.Shell")
count = 5
do while i < count
objShell.SendKeys "."
WScript.Sleep 5000
objShell.SendKeys " "
WScript.Sleep 2000
objShell.SendKeys ","
WScript.Sleep 5000
objShell.SendKeys " "
WScript.Sleep 2000
i=i+1
loop
