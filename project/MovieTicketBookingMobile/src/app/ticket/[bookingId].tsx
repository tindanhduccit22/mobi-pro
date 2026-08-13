import {
    router,
    useLocalSearchParams
}
from "expo-router";


import {
    useEffect,
    useState
}
from "react";


import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
}
from "react-native";


import {
    getTicketById,
    Ticket
}
from "../../api/bookingApi";





export default function TicketDetail(){



const {
bookingId
}
=
useLocalSearchParams<{
bookingId:string
}>();





const [
ticket,
setTicket
]
=
useState<Ticket|null>(null);




const [
loading,
setLoading
]
=
useState(true);





useEffect(()=>{


if(bookingId){

loadTicket();

}


},[bookingId]);







const loadTicket=async()=>{


try{


const data =
await getTicketById(
Number(bookingId)
);


setTicket(data);


}
catch(error){

console.log(error);

}
finally{

setLoading(false);

}


};






if(loading)

return(

<View style={styles.center}>

<ActivityIndicator size="large"/>

</View>

);







if(!ticket)

return(

<View style={styles.center}>

<Text>
Ticket not found
</Text>

</View>

);






return(

<View style={styles.container}>


<View style={styles.header}>


<Pressable
onPress={()=>router.back()}
>

<Text style={styles.back}>
←
</Text>

</Pressable>


<Text style={styles.title}>
Ticket Detail
</Text>


</View>







<ScrollView
contentContainerStyle={styles.content}
>



<View style={styles.card}>


<Text style={styles.success}>
Booking Successful
</Text>





<Text style={styles.label}>
Booking ID
</Text>


<Text style={styles.value}>
#{ticket.bookingID}
</Text>






<Text style={styles.label}>
Movie
</Text>


<Text style={styles.movie}>
{ticket.movieTitle}
</Text>







<Text style={styles.label}>
Showtime
</Text>

<Text style={styles.value}>
{
new Date(ticket.startTime)
.toLocaleString([],{
    day:"2-digit",
    month:"2-digit",
    year:"numeric",
    hour:"2-digit",
    minute:"2-digit"
})
}
</Text>




<Text style={styles.label}>
Booking Time
</Text>

<Text style={styles.value}>
{
new Date(ticket.bookingDate)
.toLocaleString([],{
    day:"2-digit",
    month:"2-digit",
    year:"numeric",
    hour:"2-digit",
    minute:"2-digit"
})
}
</Text>







<Text style={styles.label}>
Booking Code
</Text>


<Text style={styles.value}>
{ticket.bookingCode}
</Text>







<Text style={styles.label}>
Status
</Text>


<Text style={styles.value}>
{ticket.status}
</Text>







<Text style={styles.total}>

{
ticket.totalAmount.toLocaleString()

}
 VND

</Text>



</View>


</ScrollView>



</View>


);


}







const styles=StyleSheet.create({


container:{
flex:1,
backgroundColor:"#f5f5f5"
},


center:{
flex:1,
justifyContent:"center",
alignItems:"center"
},


header:{
paddingTop:55,
paddingHorizontal:20,
paddingBottom:20,
backgroundColor:"#fff",
flexDirection:"row",
alignItems:"center"
},


back:{
fontSize:30,
marginRight:20
},


title:{
fontSize:24,
fontWeight:"bold"
},


content:{
padding:20
},


card:{
backgroundColor:"#fff",
padding:25,
borderRadius:20
},


success:{
fontSize:24,
fontWeight:"bold",
color:"#16a34a",
textAlign:"center",
marginBottom:25
},


label:{
marginTop:15,
color:"#777"
},


value:{
fontSize:17,
fontWeight:"600"
},


movie:{
fontSize:22,
fontWeight:"bold"
},


total:{
marginTop:30,
fontSize:22,
fontWeight:"bold",
color:"#E50914"
}


});