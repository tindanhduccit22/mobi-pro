import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";


import {
  getMovieById,
  Movie,
} from "../../api/movieApi";


import {
  getFavoritesByUser,
  addFavorite,
  removeFavorite,
} from "../../api/favoriteApi";


import Toast from "../../components/Toast";
import { useAuth } from "../../context/AuthContext";

export default function MovieDetailScreen(){
const { user } = useAuth();

const {id} =
useLocalSearchParams<{id:string}>();



const [movie,setMovie]
=
useState<Movie|null>(null);


const [loading,setLoading]
=
useState(true);



const [favorite,setFavorite]
=
useState(false);



const [favoriteId,setFavoriteId]
=
useState<number|null>(null);



const [toast,setToast]
=
useState("");




useEffect(()=>{

if(id)
loadMovie();

},[id]);





const showToast=(message:string)=>{

setToast(message);


setTimeout(()=>{

setToast("");

},2000);


};







const loadMovie=async()=>{


try{


const data =
await getMovieById(
Number(id)
);



setMovie(data);




const favorites =
await getFavoritesByUser(
user?.userID || 0
);



const found =
favorites.find(
(item:any)=>
item.movieID===data.movieID
);



if(found){

setFavorite(true);

setFavoriteId(
found.favoriteID
);


}



}
catch(error){

console.log(error);

}


finally{

setLoading(false);

}


};








const toggleFavorite=async()=>{


if(!movie)
return;



try{


if(favorite){



await removeFavorite(
favoriteId!
);



setFavorite(false);


setFavoriteId(null);



showToast(
"Removed from favorites"
);



}
else{


const result =
await addFavorite(
user?.userID || 0,
movie.movieID
);



setFavorite(true);


setFavoriteId(
result.favoriteID
);



showToast(
"Added to favorites"
);



}



}
catch(error){

console.log(error);


showToast(
"Something went wrong"
);


}


};







if(loading){

return(

<View style={styles.center}>

<ActivityIndicator size="large"/>

</View>

);

}





if(!movie){

return(

<View style={styles.center}>

<Text>
Movie not found
</Text>

</View>

);

}








return(

<View style={styles.container}>


<ScrollView>


<Image

source={{
uri:
movie.bannerURL ||
movie.posterURL
}}

style={styles.banner}

/>




<Pressable
    style={styles.backButton}
    onPress={() => router.back()}
>
    <Ionicons name="arrow-back" size={24} color="#fff" />
</Pressable>







<View style={styles.content}>


<View style={styles.movieHeader}>


<Image

source={{
uri:movie.posterURL
}}

style={styles.poster}

/>




<View style={styles.movieInfo}>


<View style={styles.titleRow}>


<Text

style={styles.title}

numberOfLines={2}

>

{movie.title}

</Text>




<Pressable

style={[
styles.heartButton,
favorite &&
styles.activeHeart
]}


onPress={toggleFavorite}


>


<Ionicons

name={
favorite
?
"heart"
:
"heart-outline"
}


size={27}


color={
favorite
?
"#FF375F"
:
"#999"
}


/>


</Pressable>



</View>




<Text style={styles.genre}>
{movie.genreName}
</Text>



<Text style={styles.info}>
{movie.duration} minutes
</Text>


<Text style={styles.info}>
Age: {movie.ageRating}
</Text>


<Text style={styles.info}>
Language: {movie.language}
</Text>



</View>


</View>






<Text style={styles.section}>
Description
</Text>


<Text style={styles.description}>
{movie.description}
</Text>




<Text style={styles.section}>
Director
</Text>


<Text style={styles.description}>
{movie.director}
</Text>




<Text style={styles.section}>
Cast
</Text>


<Text style={styles.description}>
{movie.cast}
</Text>




<Text style={styles.section}>
Country
</Text>


<Text style={styles.description}>
{movie.country}
</Text>



</View>



</ScrollView>







<View style={styles.bottom}>


<Pressable

style={styles.bookButton}

onPress={()=>


router.push({

pathname:"/showtime/[movieId]",

params:{
movieId:
movie.movieID.toString()
}

})


}

>


<Text style={styles.bookText}>
Book Now
</Text>


</Pressable>


</View>





{
toast!=="" &&
<Toast message={toast}/>
}





</View>


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


banner:{
width:"100%",
height:230
},


backButton:{
position:"absolute",
top:45,
left:20,
width:42,
height:42,
borderRadius:21,
backgroundColor:"rgba(0,0,0,.5)",
justifyContent:"center",
alignItems:"center"
},


backText:{
color:"#fff",
fontSize:25
},


content:{
padding:20,
paddingBottom:120
},


movieHeader:{
flexDirection:"row"
},


poster:{
width:120,
height:180,
borderRadius:12
},


movieInfo:{
flex:1,
marginLeft:15
},


titleRow:{
flexDirection:"row"
},


title:{
flex:1,
fontSize:24,
fontWeight:"700"
},


heartButton:{
width:45,
height:45,
borderRadius:23,
borderWidth:1,
borderColor:"#ddd",
justifyContent:"center",
alignItems:"center"
},


activeHeart:{
backgroundColor:"#FFE5EA"
},


genre:{
marginTop:10,
color:"#E50914"
},


info:{
marginTop:6,
color:"#666"
},


section:{
fontSize:20,
fontWeight:"700",
marginTop:25
},


description:{
marginTop:8,
fontSize:16,
lineHeight:24,
color:"#555"
},


bottom:{
position:"absolute",
bottom:0,
left:0,
right:0,
padding:16,
backgroundColor:"#fff"
},


bookButton:{
backgroundColor:"#E50914",
padding:16,
borderRadius:12
},


bookText:{
color:"#fff",
textAlign:"center",
fontWeight:"700",
fontSize:17
}


});