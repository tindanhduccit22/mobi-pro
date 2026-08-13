import { router } from "expo-router";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";


import {
  getAllMovies,
  Movie
} from "../../api/movieApi";



export default function HomeScreen(){


const [movies,setMovies] = useState<Movie[]>([]);

const [loading,setLoading] = useState(true);



useEffect(()=>{

loadMovies();

},[]);



const loadMovies = async()=>{

try{

const data = await getAllMovies();

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





const nowShowing =
movies.filter(
movie=>movie.status==="Now Showing"
);



const comingSoon =
movies.filter(
movie=>movie.status==="Coming Soon"
);



const popular =
movies.slice(0,5);



const bannerMovie =
movies[0];





return(

<SafeAreaView style={styles.container}>


<ScrollView>


<Text style={styles.title}>
🎬 Movie Ticket
</Text>



{
bannerMovie &&

<View style={styles.banner}>


<Image

source={{
uri:
bannerMovie.bannerURL ||
bannerMovie.posterURL
}}

style={styles.bannerImage}

/>



<View style={styles.bannerText}>


<Text style={styles.bannerTitle}>

{bannerMovie.title}

</Text>



<Text style={styles.description}>

{bannerMovie.description}

</Text>


</View>



</View>

}



<SectionTitle title="🔥 Popular Movies"/>


<MovieRow movies={popular}/>




<SectionTitle title="▶️ Now Showing"/>


<MovieGrid movies={nowShowing}/>




<SectionTitle title="🔜 Coming Soon"/>


<MovieGrid movies={comingSoon}/>



</ScrollView>


</SafeAreaView>

);

}




function SectionTitle({title}:{title:string}){
return(
<Text style={styles.heading}>{title}</Text>
);
}




function MovieRow({movies}:{movies:Movie[]}){
return(
<FlatList
data={movies}
horizontal
scrollEnabled
keyExtractor={item=>item.movieID.toString()}
renderItem={({item})=>(
<Pressable
style={styles.popularCard}
onPress={()=>router.push(`/movie/${item.movieID}`)}
>
<Image
source={{uri:item.posterURL}}
style={styles.smallPoster}
/>
<Text numberOfLines={1} style={styles.movieTitle}>{item.title}</Text>
</Pressable>
)}
/>
);
}







function MovieGrid(
{
movies
}:{
movies:Movie[]
}){


return(


<FlatList

data={movies}

numColumns={2}

scrollEnabled={false}

keyExtractor={
item=>item.movieID.toString()
}


columnWrapperStyle={styles.row}



renderItem={({item})=>(


<Pressable

style={styles.card}

onPress={()=>
router.push(`/movie/${item.movieID}`)
}

>


<Image

source={{
uri:item.posterURL
}}

style={styles.poster}

/>



<Text

numberOfLines={1}

style={styles.movieTitle}

>

{item.title}

</Text>



<Text style={styles.genre}>

{item.genreName} • {item.duration} min

</Text>



</Pressable>


)}


/>


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
paddingTop:20,
marginBottom:16,
},



heading:{
fontSize:21,
fontWeight:"bold",
marginHorizontal:16,
marginTop:22,
marginBottom:15,
},


description:{
color:"#fff",
fontSize:14,
marginTop:4
},



banner:{
marginHorizontal:16,
marginTop:5,
borderRadius:16,
overflow:"hidden",
height:220,
backgroundColor:"#ddd"
},


bannerImage:{
width:"100%",
height:"100%"
},



bannerText:{
position:"absolute",
bottom:0,
left:0,
right:0,
padding:15,
backgroundColor:"rgba(0,0,0,0.45)"
},



bannerTitle:{
fontSize:22,
fontWeight:"bold",
color:"#fff"
},



popularCard:{
width:130,
marginLeft:16
},



smallPoster:{
width:130,
height:180,
borderRadius:12,
backgroundColor:"#ddd"
},



row:{
justifyContent:"space-between",
paddingHorizontal:12
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