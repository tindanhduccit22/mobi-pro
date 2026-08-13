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
    Image,
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
from "../../../api/bookingApi";





export default function BookingSuccess(){


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

loadBooking();

}


},[bookingId]);







const loadBooking=async()=>{


try{


const data =
await getTicketById(
Number(bookingId)
);



setTicket(data);



}
catch(error){

console.log(
"Booking error:",
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







if(!ticket){

return(

<View style={styles.center}>

<Text>
Booking not found
</Text>

</View>

);

}







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
Booking Success
</Text>


</View>







<ScrollView
contentContainerStyle={styles.content}
>


<View style={styles.card}>



<Text style={styles.success}>
✓ Booking Successful
</Text>





{
ticket.qrCode &&


<Image

source={{
uri:ticket.qrCode
}}

style={styles.qr}

/>


}






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





<View style={styles.line}/>





<Text style={styles.total}>

{
ticket.totalAmount
.toLocaleString()

}
 VND

</Text>






<Pressable

style={styles.button}

onPress={()=>


router.push({

pathname:
"/ticket/[bookingId]",


params:{

bookingId:
ticket.bookingID.toString()

}

})


}

>


<Text style={styles.buttonText}>
View Ticket Detail
</Text>


</Pressable>






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
textAlign:"center",
color:"#16a34a",
marginBottom:20
},


qr:{
width:200,
height:200,
alignSelf:"center",
marginBottom:20
},


label:{
marginTop:15,
fontSize:14,
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


line:{
height:1,
backgroundColor:"#ddd",
marginVertical:25
},


total:{
fontSize:22,
fontWeight:"bold",
color:"#E50914",
textAlign:"center"
},


button:{
marginTop:30,
backgroundColor:"#E50914",
padding:16,
borderRadius:12
},


buttonText:{
color:"#fff",
fontSize:17,
fontWeight:"bold",
textAlign:"center"
}


});