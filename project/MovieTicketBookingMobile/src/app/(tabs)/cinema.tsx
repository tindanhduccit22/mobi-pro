import { useEffect, useState } from "react";

import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Pressable
} from "react-native";


import {
    getAllCinemas,
    Cinema
} from "../../api/cinemaApi";




export default function CinemaScreen(){


const [cinemas,setCinemas]
=
useState<Cinema[]>([]);


const [loading,setLoading]
=
useState(true);




useEffect(()=>{

    loadCinemas();

},[]);





const loadCinemas = async()=>{

try{

    const data =
        await getAllCinemas();


    setCinemas(data);


}
catch(error){

    console.log(
        "Cinema error:",
        error
    );

}
finally{

    setLoading(false);

}

};





if(loading){

return(

<View style={styles.center}>

<ActivityIndicator size="large"/>

</View>

);

}





return(


<SafeAreaView style={styles.container}>


<Text style={styles.title}>
🎬 Movie Ticket
</Text>



<Text style={styles.heading}>
Cinema List
</Text>



<FlatList

data={cinemas}

keyExtractor={(item)=>
item.cinemaID.toString()
}


contentContainerStyle={
styles.list
}



renderItem={({item})=>(


<Pressable

style={styles.card}

>


<Text style={styles.name}>

{item.cinemaName}

</Text>



<Text style={styles.info}>

📍 {item.address}

</Text>



<Text style={styles.info}>

🏙 {item.city}

</Text>



<Text style={styles.info}>

☎ {item.phone}

</Text>



</Pressable>


)}


/>



</SafeAreaView>


);


}







const styles = StyleSheet.create({


container:{
flex:1,
backgroundColor:"#fff"
},



center:{
flex:1,
justifyContent:"center",
alignItems:"center"
},



title:{
fontSize:26,
fontWeight:"bold",
paddingHorizontal:16,
paddingTop:20
},



heading:{
fontSize:20,
fontWeight:"bold",
margin:16
},



list:{
paddingHorizontal:16,
paddingBottom:30
},



card:{

backgroundColor:"#fff",

borderWidth:1,

borderColor:"#ddd",

borderRadius:15,

padding:18,

marginBottom:15,

shadowColor:"#000",

shadowOpacity:0.1,

shadowRadius:5,

elevation:3

},



name:{
fontSize:20,
fontWeight:"bold",
marginBottom:10
},



info:{
fontSize:15,
color:"#555",
marginTop:5
}



});