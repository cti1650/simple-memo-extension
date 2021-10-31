from extension import Extension
import sys

ext = Extension()

if(len(sys.argv) > 1):
    key = str(sys.argv[1])
    print(key)
    if key == "major":
        ext.update(key)
    elif key == "minor":
        ext.update(key)
    elif key == "patch":
        ext.update(key)
    elif key == "new":
        ext.update(key)
    elif key == "release":
        ext.update(key)
    elif key == "zip":
        ext.zip()
    elif key == "mkicon":
        ext.icon_resize()
    elif key == "manifest":
        print(ext.load())
    else:
        print("error")
