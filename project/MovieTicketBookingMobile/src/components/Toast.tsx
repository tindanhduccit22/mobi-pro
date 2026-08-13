import { StyleSheet, Text, View } from "react-native";


export default function Toast({
  message
}:{
  message:string;
}){


return(

<View style={styles.toast}>

<Text style={styles.text}>
{message}
</Text>

</View>

);


}



const styles = StyleSheet.create({

toast:{
  position:"absolute",
  bottom:90,
  left:30,
  right:30,
  backgroundColor:"#333",
  paddingVertical:12,
  paddingHorizontal:20,
  borderRadius:25,
  alignItems:"center",
  elevation:5,
},


text:{
  color:"#fff",
  fontSize:15,
  fontWeight:"600",
}


});