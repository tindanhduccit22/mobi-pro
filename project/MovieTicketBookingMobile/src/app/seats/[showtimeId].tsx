import {
    router,
    useLocalSearchParams
} from "expo-router";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";


import {
    getSeatsByRoom,
    Seat
} from "../../api/seatApi";


import {
    getShowtimeById,
    Showtime
} from "../../api/showtimeApi";


import {
    createBooking,
    updateBooking
} from "../../api/bookingApi";


import {
    createBookingDetail
} from "../../api/bookingDetailApi";
import { useAuth } from "../../context/AuthContext";

export default function SeatSelectionScreen() {
    const { user } = useAuth();


    const {
        roomId,
        showtimeId
    } =
        useLocalSearchParams<{
            roomId: string;
            showtimeId: string;
        }>();


    const [seats, setSeats] =
        useState<Seat[]>([]);


    const [showtime, setShowtime] =
        useState<Showtime | null>(null);


    const [selected, setSelected] =
        useState<number[]>([]);


    const [loading, setLoading] =
        useState(true);


    const [bookingLoading, setBookingLoading] =
        useState(false);



    useEffect(() => {

        if (
            roomId &&
            showtimeId
        ) {

            loadData();

        }

    }, [
        roomId,
        showtimeId
    ]);



    const loadData = async () => {

        try {

            const [
                seatData,
                showtimeData
            ] =
                await Promise.all([

                    getSeatsByRoom(
                        Number(roomId)
                    ),

                    getShowtimeById(
                        Number(showtimeId)
                    )

                ]);


            setSeats(seatData);

            setShowtime(
                showtimeData
            );

        }
        catch (error) {

            console.log(
                "Load seat screen error:",
                error
            );

            Alert.alert(
                "Error",
                "Unable to load seat information."
            );

        }
        finally {

            setLoading(false);

        }

    };



    const toggleSeat = (
        seatId: number
    ) => {

        setSelected(
            current => {

                if (
                    current.includes(
                        seatId
                    )
                ) {

                    return current.filter(
                        id =>
                            id !== seatId
                    );

                }


                return [
                    ...current,
                    seatId
                ];

            }
        );

    };



    /*
     * Group seats by row.
     *
     * Example:
     *
     * A1 A2 A3 A4 A5 A6
     * B1 B2 B3 B4 B5 B6
     *
     */

    const seatRows = useMemo(() => {

        const rows: {
            [key: string]: Seat[]
        } = {};


        seats.forEach(seat => {

            const row =
                seat.seatNumber
                    .charAt(0)
                    .toUpperCase();


            if (!rows[row]) {
                rows[row] = [];
            }


            rows[row].push(seat);

        });


        Object.keys(rows).forEach(
            row => {

                rows[row].sort(
                    (a, b) => {

                        const numberA =
                            parseInt(
                                a.seatNumber
                                    .replace(
                                        /\D/g,
                                        ""
                                    )
                            );


                        const numberB =
                            parseInt(
                                b.seatNumber
                                    .replace(
                                        /\D/g,
                                        ""
                                    )
                            );


                        return (
                            numberA -
                            numberB
                        );

                    }
                );

            }
        );


        return rows;

    }, [seats]);



    const total =
        showtime
            ? selected.length *
              showtime.price
            : 0;



    const handleContinue = async () => {

        if (selected.length === 0) {
            Alert.alert("Select seats", "Please select at least one seat.");
            return;
        }

        if (!showtime) {
            Alert.alert("Error", "Showtime information is missing.");
            return;
        }

        const seatNumbers = selected
            .map(id => seats.find(s => s.seatID === id)?.seatNumber)
            .join(", ");

        router.push({
            pathname: "/payment",
            params: {
                showtimeId: showtime.showtimeID.toString(),
                seatIds: selected.join(","),
                total: total.toString(),
                movieTitle: showtime.movieTitle,
                cinemaName: showtime.cinemaName,
                roomName: showtime.roomName,
                startTime: showtime.startTime,
                seatNumbers: seatNumbers
            }
        });
    };



    if (loading) {

        return (

            <View style={styles.center}>

                <ActivityIndicator
                    size="large"
                />

            </View>

        );

    }



    return (

        <View style={styles.container}>


            {/* HEADER */}

            <View style={styles.header}>

                <Pressable
                    onPress={() =>
                        router.back()
                    }
                >

                    <Text
                        style={styles.back}
                    >
                        ←
                    </Text>

                </Pressable>


                <Text
                    style={styles.title}
                >
                    Select Seat
                </Text>

            </View>



            <ScrollView
                contentContainerStyle={
                    styles.content
                }
            >


                {/* SCREEN */}

                <View
                    style={styles.screen}
                >

                    <Text
                        style={
                            styles.screenText
                        }
                    >
                        SCREEN
                    </Text>

                </View>



                <Text
                    style={styles.instruction}
                >
                    Select your seats
                </Text>



                {/* SEAT LEGEND */}

                <View
                    style={styles.legend}
                >

                    <View
                        style={
                            styles.legendItem
                        }
                    >

                        <View
                            style={
                                styles.availableBox
                            }
                        />

                        <Text>
                            Available
                        </Text>

                    </View>


                    <View
                        style={
                            styles.legendItem
                        }
                    >

                        <View
                            style={
                                styles.selectedBox
                            }
                        />

                        <Text>
                            Selected
                        </Text>

                    </View>


                    <View
                        style={
                            styles.legendItem
                        }
                    >

                        <View
                            style={
                                styles.disabledBox
                            }
                        />

                        <Text>
                            Unavailable
                        </Text>

                    </View>

                </View>



                {/* SEATS */}

                <View
                    style={
                        styles.seatArea
                    }
                >

                    {
                        Object.keys(
                            seatRows
                        )
                        .sort()
                        .map(row => (

                            <View
                                key={row}
                                style={
                                    styles.row
                                }
                            >

                                <Text
                                    style={
                                        styles.rowLabel
                                    }
                                >
                                    {row}
                                </Text>


                                <View
                                    style={
                                        styles.rowSeats
                                    }
                                >

                                    {
                                        seatRows[
                                            row
                                        ].map(
                                            seat => {

                                                const isSelected =
                                                    selected.includes(
                                                        seat.seatID
                                                    );


                                                return (

                                                    <Pressable

                                                        key={
                                                            seat.seatID
                                                        }

                                                        disabled={
                                                            !seat.isActive
                                                        }

                                                        onPress={() =>
                                                            toggleSeat(
                                                                seat.seatID
                                                            )
                                                        }

                                                        style={[

                                                            styles.seat,

                                                            isSelected &&
                                                            styles.selectedSeat,

                                                            !seat.isActive &&
                                                            styles.disabledSeat

                                                        ]}

                                                    >

                                                        <Text

                                                            style={[

                                                                styles.seatText,

                                                                isSelected &&
                                                                styles.selectedText

                                                            ]}

                                                        >

                                                            {
                                                                seat.seatNumber
                                                            }

                                                        </Text>

                                                    </Pressable>

                                                );

                                            }
                                        )

                                    }

                                </View>

                            </View>

                        ))

                    }

                </View>



                {/* SUMMARY */}

                <View
                    style={
                        styles.summary
                    }
                >

                    <Text
                        style={
                            styles.summaryTitle
                        }
                    >
                        Booking Summary
                    </Text>


                    <Text
                        style={
                            styles.summaryText
                        }
                    >
                        Selected seats:{" "}

                        {
                            selected.length === 0
                                ? "None"
                                : selected
                                    .map(id => {

                                        const seat =
                                            seats.find(
                                                s =>
                                                    s.seatID === id
                                            );

                                        return seat
                                            ?.seatNumber;

                                    })
                                    .join(", ")
                        }

                    </Text>


                    <Text
                        style={
                            styles.summaryText
                        }
                    >
                        Number of seats:{" "}
                        {selected.length}
                    </Text>


                    <Text
                        style={
                            styles.total
                        }
                    >
                        Total:{" "}

                        {
                            total.toLocaleString()
                        }

                        {" "}VND
                    </Text>

                </View>


            </ScrollView>



            {/* CONTINUE BUTTON */}

            <View
                style={styles.bottom}
            >

                <Pressable

                    style={[
                        styles.button,

                        selected.length === 0 &&
                        styles.buttonDisabled

                    ]}

                    disabled={
                        selected.length === 0 ||
                        bookingLoading
                    }

                    onPress={
                        handleContinue
                    }

                >

                    {
                        bookingLoading ? (

                            <ActivityIndicator
                                color="#fff"
                            />

                        ) : (

                            <Text
                                style={
                                    styles.buttonText
                                }
                            >
                                Confirm Booking
                            </Text>

                        )
                    }

                </Pressable>

            </View>


        </View>

    );

}



const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#f5f5f5"
    },


    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },


    header: {
        paddingTop: 55,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center"
    },


    back: {
        fontSize: 30,
        marginRight: 20
    },


    title: {
        fontSize: 24,
        fontWeight: "bold"
    },


    content: {
        padding: 16,
        paddingBottom: 150
    },


    screen: {
        height: 45,
        marginHorizontal: 25,
        marginTop: 15,
        backgroundColor: "#d8d8d8",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center"
    },


    screenText: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#333"
    },


    instruction: {
        textAlign: "center",
        fontSize: 15,
        color: "#666",
        marginTop: 20
    },


    legend: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 18,
        marginTop: 20,
        marginBottom: 20
    },


    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    },


    availableBox: {
        width: 18,
        height: 18,
        borderWidth: 1,
        borderColor: "#bbb",
        borderRadius: 4,
        backgroundColor: "#fff"
    },


    selectedBox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        backgroundColor: "#E50914"
    },


    disabledBox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        backgroundColor: "#999"
    },


    seatArea: {
        backgroundColor: "#fff",
        paddingVertical: 20,
        paddingHorizontal: 5,
        borderRadius: 15
    },


    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12
    },


    rowLabel: {
        width: 25,
        fontSize: 14,
        fontWeight: "bold",
        color: "#666",
        textAlign: "center"
    },


    rowSeats: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center"
    },


    seat: {
        width: 40,
        height: 40,
        margin: 4,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center"
    },


    seatText: {
        fontSize: 11,
        color: "#333"
    },


    selectedSeat: {
        backgroundColor: "#E50914",
        borderColor: "#E50914"
    },


    selectedText: {
        color: "#fff",
        fontWeight: "bold"
    },


    disabledSeat: {
        backgroundColor: "#999",
        borderColor: "#999"
    },


    summary: {
        backgroundColor: "#fff",
        padding: 18,
        borderRadius: 15,
        marginTop: 20
    },


    summaryTitle: {
        fontSize: 19,
        fontWeight: "bold",
        marginBottom: 12
    },


    summaryText: {
        fontSize: 15,
        color: "#555",
        marginBottom: 7
    },


    total: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#E50914",
        marginTop: 10
    },


    bottom: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#fff",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#eee"
    },


    button: {
        backgroundColor: "#E50914",
        padding: 16,
        borderRadius: 12,
        alignItems: "center"
    },


    buttonDisabled: {
        backgroundColor: "#aaa"
    },


    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 17
    }

});