import { StyleSheet } from "react-native";
import { Image, type ImageSource } from "expo-image";

interface ImageViewerProps {
  imgSource: ImageSource;
  selectedImage?: string;
}

export const ImageViewer = ({ imgSource, selectedImage }: ImageViewerProps) => {
  const imageSource = selectedImage ? { uri: selectedImage } : imgSource;

  return <Image source={imageSource} style={styles.image} />;
};

export default ImageViewer;

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
