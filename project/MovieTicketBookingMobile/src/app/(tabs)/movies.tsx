import { router } from "expo-router";
import { useEffect, useState } from "react";

import {
FlatList,
Image,
Pressable,
SafeAreaView,
StyleSheet,
Text,
View,
ActivityIndicator
} from "react-native";

import { getAllMovies, Movie } from "../../api/movieApi";


export default function MoviesScreen(){

const [movies,setMovies]=useState<Movie[]>([]);
const [loading,setLoading]=useState(true);



useEffect(()=>{

loadMovies();

},[]);



const loadMovies=async()=>{

try{

const data=await getAllMovies();

console.log("MOVIES:",data);

setMovies(data);

}
catch(error){

console.log(error);

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
All Movies
</Text>



<FlatList

data={movies}

numColumns={2}

keyExtractor={(item)=>
item.movieID.toString()
}

columnWrapperStyle={styles.row}

contentContainerStyle={styles.list}


renderItem={({item})=>(


<Pressable

style={styles.card}

onPress={()=>
router.push(`/movie/${item.movieID}`)
}

>


<Image

source={{

uri:item.posterURL ||

"https://via.placeholder.com/200"

}}

style={styles.poster}

/>



<Text

style={styles.movieTitle}

numberOfLines={1}

>

{item.title}

</Text>



<Text style={styles.genre}>

{item.genreName} • {item.duration} min

</Text>


</Pressable>


)}

/>


</SafeAreaView>

);

}



const styles=StyleSheet.create({

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
paddingHorizontal:12
},


row:{
justifyContent:"space-between"
},


card:{
width:"48%",
marginBottom:20
},


poster:{
width:"100%",
height:240,
borderRadius:12,
backgroundColor:"#ddd"
},


movieTitle:{
fontSize:16,
fontWeight:"bold",
marginTop:8
},


genre:{
fontSize:13,
color:"#666",
marginTop:4
}

});