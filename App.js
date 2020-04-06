import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; //pick an existing image

class App extends React.Component {
  state = {
    hasPermission: null,
    type: Camera.Constants.Type.back,
  }

  // get camera permissions here
  async componentDidMount() {
    this.getPermissionAsync()
  }

  getPermissionAsync = async () => {
    // Camera roll Permission 
    if (Platform.OS === 'ios') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
    // Camera Permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === 'granted' });
  }

  // switch between front and back camera
  handleCameraType = () => {
    const { cameraType } = this.state

    this.setState({
      cameraType:
        cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    })
  }

  //take an actual picture
  takePicture = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      console.log('photo', photo);

      /*
        example responses:
          photo Object {
            "height": 4224,
            "uri": "file:///var/mobile/Containers/Data/Application/5DE7DA8B-58DE-40AD-9C2B-CB00DD155F28/Library/Caches/ExponentExperienceData/%2540anonymous%252FCameraExpo2-9f817ba7-70a6-4258-bc57-702c36f7248c/Camera/5BCCE51D-BE53-496D-999A-C277B51648B6.jpg",
            "width": 1952,
          }
      */
    }
  }

  //select image from the gallery
  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    console.log('result here', result);
    /*
      example responses: 

        result here Object {
          "cancelled": false,
          "height": 4032,
          "type": "image",
          "uri": "file:///var/mobile/Containers/Data/Application/5DE7DA8B-58DE-40AD-9C2B-CB00DD155F28/Library/Caches/ExponentExperienceData/%2540anonymous%252FCameraExpo2-9f817ba7-70a6-4258-bc57-702c36f7248c/ImagePicker/F1E63A14-1165-4CA9-99F5-82DFEB430061.jpg",
          "width": 3024,
        }
        result here Object {
          "cancelled": true,
        }
    */
  }

  render() {
    const { hasPermission } = this.state
    if (hasPermission === null) {
      return <View />;
    } else if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={this.state.cameraType}
            ref={ref => {
              this.camera = ref;
            }}
          >
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", margin: 20 }}>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}
                onPress={() => this.pickImage()}
              >
                <Ionicons
                  name="ios-photos"
                  style={{ color: "#fff", fontSize: 40 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}
                onPress={() => this.takePicture()}
              >
                <FontAwesome
                  name="camera"
                  style={{ color: "#fff", fontSize: 40 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}
                onPress={() => this.handleCameraType()}
              >
                <MaterialCommunityIcons
                  name="camera-switch"
                  style={{ color: "#fff", fontSize: 40 }}
                />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
