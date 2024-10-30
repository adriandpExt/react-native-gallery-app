import { type ImageSource } from "expo-image";

import { useRef, useState } from "react";

import { View, StyleSheet, Platform } from "react-native";

import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { captureRef } from "react-native-view-shot";

import domtoimage from "dom-to-image";

import {
  Button,
  CircleButton,
  EmojiList,
  EmojiPicker,
  EmojiSticker,
  IconButton,
  ImageViewer,
} from "@/components";

const PlaceholderImage = require("@/assets/images/background-image.png");

export default function Index() {
  const imageRef = useRef<View>(null);

  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [pickedEmoji, setPickedEmoji] = useState<ImageSource | undefined>(
    undefined
  );
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [status, requestPermission] = MediaLibrary.usePermissions();

  if (status === null) {
    requestPermission();
  }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert("You did not select any image.");
    }
  };

  const onReset = (): void => {
    setShowAppOptions(false);
  };

  const onAddSticker = (): void => {
    setIsModalVisible(true);
  };

  const onModalClose = (): void => {
    setIsModalVisible(false);
  };

  const onSaveImageAsync = async () => {
    if (Platform.OS !== "web") {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });

      if (localUri) {
        alert("Saved!");
      }

      return await MediaLibrary.saveToLibraryAsync(localUri);
    } else {
      const dataUrl = await domtoimage.toJpeg(imageRef.current as any, {
        quality: 0.95,
        width: 320,
        height: 440,
      });

      let link = document.createElement("a");
      link.download = "sticker-smash.jpeg";
      link.href = dataUrl;
      link.click();
    }
  };

  const renderIconButtons = () => {
    return (
      <View style={styles.optionsContainer}>
        <View style={styles.optionsRow}>
          <IconButton icon="refresh" label="Reset" onPress={onReset} />
          <CircleButton onPress={onAddSticker} />
          <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
        </View>
      </View>
    );
  };

  const renderButtonAction = () => {
    return (
      <View style={styles.footerContainer}>
        <Button
          theme="primary"
          label="Choose a photo"
          onPress={pickImageAsync}
        />
        <Button
          label="Use this photo"
          onPress={() => setShowAppOptions(true)}
        />
      </View>
    );
  };

  return (
    <>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.imageContainer}>
          <View ref={imageRef} collapsable={false}>
            <ImageViewer
              imgSource={PlaceholderImage}
              selectedImage={selectedImage}
            />

            {pickedEmoji && (
              <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
            )}
          </View>
        </View>

        {showAppOptions ? renderIconButtons() : renderButtonAction()}

        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
          <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
        </EmojiPicker>
      </GestureHandlerRootView>

      <StatusBar style="dark" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  optionsContainer: {
    position: "absolute",
    bottom: 80,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});
