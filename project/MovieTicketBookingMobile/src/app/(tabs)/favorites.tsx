import {
  useCallback,
  useState
} from "react";


import {

  FlatList,

  Image,

  Pressable,

  SafeAreaView,

  StyleSheet,

  Text,

  View

} from "react-native";


import {
  router,
  useFocusEffect
} from "expo-router";


import {
  getFavoritesByUser,
  Favorite
} from "../../api/favoriteApi";
import { useAuth } from "../../context/AuthContext";

export default function FavoritesScreen(){

const { user } = useAuth();
const [favorites,setFavorites]
=
useState<Favorite[]>([]);



const [loading,setLoading]
=
useState(false);





useFocusEffect(

useCallback(()=>{


loadFavorites();


},[])


);







const loadFavorites = async()=>{


try{


setLoading(true);



const data =
await getFavoritesByUser(
user?.userID || 0
);



setFavorites(data);



}
catch(error){


console.log(
"Load favorites error:",
error
);



}
finally{


setLoading(false);


}


};







return(


<SafeAreaView style={styles.container}>


<Text style={styles.title}>
🎬 Movie Ticket
</Text>



<Text style={styles.heading}>
Favorite Movies
</Text>





{
favorites.length===0 ?


<View style={styles.empty}>


<Text style={styles.emptyText}>
❤️ No favorite movies yet
</Text>


<Text style={styles.subText}>
Add movies to your favorite list
</Text>


</View>



:


<FlatList


data={favorites}



numColumns={2}



keyExtractor={
(item)=>
item.favoriteID.toString()
}



columnWrapperStyle={
styles.row
}



contentContainerStyle={
styles.list
}



renderItem={({item})=>(



<Pressable


style={styles.card}



onPress={()=>


router.push(

`/movie/${item.movieID}`

)


}



>


<Image


source={{

uri:
item.posterURL ||

"https://via.placeholder.com/200"

}}



style={styles.poster}


/>



<Text


style={styles.movieTitle}



numberOfLines={1}



>

{item.movieTitle}


</Text>




<Text style={styles.genre}>


{item.genreName}

{" • "}

{item.duration} min



</Text>




</Pressable>



)}



/>


}



</SafeAreaView>


);


}







const styles = StyleSheet.create({


container:{
flex:1,
backgroundColor:"#fff"
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
},



empty:{
flex:1,
justifyContent:"center",
alignItems:"center"
},



emptyText:{
fontSize:18,
fontWeight:"bold"
},



subText:{
marginTop:8,
color:"#666"
}



});