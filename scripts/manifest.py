from collections import OrderedDict
import os
import sys
import json
import glob


class Manifest:
    data = {
        "fullpath": '',
        "path": '',
        "name": '',
        "dirname": '',
        "json": ''
    }

    def __init__(self, file=''):
        self.data = self.__manifest_data(file)

    def __manifest_data(self, file):
        if(file != ''):
            files = glob.glob(file, recursive=True)
        else:
            files = glob.glob('**/manifest.json', recursive=True)
        if files:
            with open(files[0], encoding='utf-8') as f:
                update_data = json.load(f, object_pairs_hook=OrderedDict)
            return {
                "fullpath": files[0],
                "path": os.path.relpath(files[0]).replace(os.path.basename(files[0]), ''),
                "name": os.path.basename(files[0]),
                "dirname": os.path.basename(os.path.dirname(files[0])),
                "json": update_data
            }
        else:
            return {
                "fullpath": '',
                "path": '',
                "name": '',
                "dirname": '',
                "json": ''
            }

    def load(self):
        with open(self.data["fullpath"], encoding='utf-8') as f:
            update_data = json.load(f, object_pairs_hook=OrderedDict)
        return update_data

    def save(self, dic):
        with open(self.data["fullpath"], 'w', encoding='utf-8') as f:
            json.dump(dic, f, indent=2, ensure_ascii=False)
        self.data = self.__manifest_data(self.data["fullpath"])

    def __setting_version(self, version_str, key):
        version = version_str.split('.')
        if len(version) == 1:
            version.extend(['0', '0'])
        elif len(version) == 2:
            version.extend(['0'])
        if key == "major":
            version[0] = str(int(version[0]) + 1)
            version[1] = str(0)
            version[2] = str(0)
        elif key == "minor":
            version[1] = str(int(version[1]) + 1)
            version[2] = str(0)
        elif key == "patch":
            version[2] = str(int(version[2]) + 1)
        elif key == "release":
            version[0] = str(1)
            version[1] = str(0)
            version[2] = str(0)
        elif key == "new":
            version[0] = str(0)
            version[1] = str(0)
            version[2] = str(1)
        return '.'.join(version)

    def update(self, key):
        json = self.load()
        if 'version' not in json:
            json["version"] = "0.0.1"
        json['version'] = self.__setting_version(json['version'], key)
        self.save(json)
        return json['version']
