// import React from 'react';
// import { View, StyleSheet, Dimensions } from 'react-native';
// import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

// const { width } = Dimensions.get('window');

// const SkeletonLoader = () => {
//   return (
//     <SkeletonPlaceholder>
//       <View>
//         <View style={styles.container}>
//           <View style={styles.profileImage} />
//           <View style={styles.profileTextContainer}>
//             <View style={styles.skeletonText} />
//             <View style={styles.skeletonText} />
//             <View style={styles.skeletonText} />
//           </View>
//         </View>
//         <View style={styles.tabContainer}>
//           <View style={styles.tabButton} />
//           <View style={styles.tabButton} />
//         </View>
//         <View style={styles.publicationContainer}>
//           <View style={styles.image} />
//           <View style={styles.actionsContainer}>
//             <View style={styles.iconButton} />
//             <View style={styles.iconButton} />
//           </View>
//           <View style={styles.skeletonText} />
//           <View style={styles.skeletonText} />
//         </View>
//       </View>
//     </SkeletonPlaceholder>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 30,
//     marginLeft: 20,
//   },
//   profileImage: {
//     width: 70,
//     height: 70,
//     borderRadius: 50,
//   },
//   profileTextContainer: {
//     marginLeft: 20,
//     flex: 1,
//   },
//   skeletonText: {
//     height: 20,
//     borderRadius: 4,
//     marginVertical: 5,
//     backgroundColor: '#e0e0e0',
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f3f3f3',
//   },
//   tabButton: {
//     width: 100,
//     height: 40,
//     borderRadius: 4,
//     backgroundColor: '#e0e0e0',
//   },
//   publicationContainer: {
//     marginBottom: 20,
//   },
//   image: {
//     width: width,
//     height: 320,
//     borderRadius: 10,
//     backgroundColor: '#e0e0e0',
//   },
//   actionsContainer: {
//     flexDirection: 'row',
//     marginVertical: 5,
//     paddingHorizontal: 10,
//   },
//   iconButton: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     marginHorizontal: 10,
//     backgroundColor: '#e0e0e0',
//   },
// });

// export default SkeletonLoader;
