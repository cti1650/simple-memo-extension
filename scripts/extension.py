from manifest import Manifest
import os
import shutil
import cv2
import numpy as np
from PIL import Image


class Extension(Manifest):
    def zip(self):
        return shutil.make_archive(
            'zip_' + self.data["dirname"], 'zip', root_dir=self.data["path"])

    def __set_icon_url(self, json, size, url):
        if 'icons' not in json:
            json["icons"] = {}
        json["icons"][str(size)] = url
        if size == 19:
            if json["manifest_version"] == 2:
                if 'browser_action' in json:
                    if 'default_icon' not in json["browser_action"]:
                        json["browser_action"]["default_icon"] = {}
                    json["browser_action"]["default_icon"][str(size)] = url
                if 'page_action' in json:
                    if 'default_icon' not in json["page_action"]:
                        json["page_action"]["default_icon"] = {}
                    json["page_action"]["default_icon"][str(size)] = url
            if json["manifest_version"] == 3:
                if 'action' in json:
                    if 'default_icon' not in json["action"]:
                        json["action"]["default_icon"] = {}
                    json["action"]["default_icon"][str(size)] = url
        return json

    def __icon_resize_data_save(self, img, size=128, baseName="/icons/icon"):
        if img:
            resize_img = img.resize((size, size))
            img_path = self.data["path"] + baseName + "-" + \
                str(size) + "x" + str(size) + ".png"
            json = self.load()
            resize_img.save(img_path)
            self.__set_icon_url(json, size, baseName + "-" +
                                str(size) + "x" + str(size) + ".png")
            self.save(json)

    def __clear_background_color(self, img_path, img_savepath):
        img = cv2.imread(img_path, -1)
        img[:, :, 3] = np.where(np.all(img == 255, axis=-1),
                                0, 255)
        cv2.imwrite(img_savepath, img)

    def icon_resize(self, baseName="/icons/icon"):
        if os.path.isfile(self.data['path'] + baseName + ".png"):
            self.__clear_background_color(self.data['path'] + baseName + ".png",
                                          self.data['path'] + baseName + "_transparent.png")
            icon_view = Image.open(
                self.data['path'] + baseName + "_transparent.png")
            self.__icon_resize_data_save(
                icon_view, size=128, baseName=baseName)
            self.__icon_resize_data_save(icon_view, size=48, baseName=baseName)
            self.__icon_resize_data_save(icon_view, size=19, baseName=baseName)
            self.__icon_resize_data_save(icon_view, size=16, baseName=baseName)
        else:
            print("not icon")
