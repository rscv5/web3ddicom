This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## References

DICOM file format description can be found [here](https://www.leadtools.com/sdk/medical/dicom-spec).Popular DICOM loader framework:GDCM. Some JavaScript libraries to word with DICOM file format:

1. dicomParser
2. Daikon

## 3D volumetric rendering idea in a few words

Three.js is used as some gateway to WebGL renderer. The current Three.js version doesnot support 3D textures, so we use tricky way to build 2D textture from initial 3D texture by linking 2D slice all together as a large tile map.

## `yarn start`

Runs the app in the development mode.
Open [http://localhost:3000] to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

## Demo show

### 2d Mode View

![2d mode view](/results/select2d.jpg)
