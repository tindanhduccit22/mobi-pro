import {
    router,
    useLocalSearchParams
} from "expo-router";

import {
    useEffect,
    useState
} from "react";

import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import {
    getShowtimesByMovie,
    Showtime
} from "../../api/showtimeApi";


export default function ShowtimeScreen() {

    const {
        movieId
    } = useLocalSearchParams<{
        movieId: string;
    }>();


    const [showtimes, setShowtimes] =
        useState<Showtime[]>([]);


    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        if (movieId) {
            loadShowtimes();
        }

    }, [movieId]);


    const loadShowtimes = async () => {

        try {

            const data =
                await getShowtimesByMovie(
                    Number(movieId)
                );

            setShowtimes(data);

        }
        catch (error) {

            console.log(
                "Load showtimes error:",
                error
            );

        }
        finally {

            setLoading(false);

        }

    };


    const formatDate = (
        date: string
    ) => {

        return new Date(date)
            .toLocaleDateString();

    };


    const formatTime = (
        date: string
    ) => {

        return new Date(date)
            .toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
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

                    <Text style={styles.back}>
                        ←
                    </Text>

                </Pressable>


                <Text style={styles.title}>
                    Select Showtime
                </Text>

            </View>


            {/* CONTENT */}

            <ScrollView
                contentContainerStyle={
                    styles.content
                }
            >

                {showtimes.length === 0 ? (

                    <Text style={styles.empty}>
                        No showtimes available.
                    </Text>

                ) : (

                    showtimes.map(
                        (showtime) => (

                            <Pressable
                                key={
                                    showtime.showtimeID
                                }

                                style={styles.card}

                                onPress={() =>

                                    router.push({
                                        pathname:
                                            "/seats/[showtimeId]",

                                        params: {

                                            showtimeId:
                                                showtime
                                                    .showtimeID
                                                    .toString(),

                                            roomId:
                                                showtime
                                                    .roomID
                                                    .toString()
                                        }
                                    })

                                }
                            >

                                <View
                                    style={
                                        styles.cardTop
                                    }
                                >

                                    <Text
                                        style={
                                            styles.cinema
                                        }
                                    >
                                        {
                                            showtime
                                                .cinemaName
                                        }
                                    </Text>


                                    <Text
                                        style={
                                            styles.format
                                        }
                                    >
                                        {
                                            showtime
                                                .format
                                        }
                                    </Text>

                                </View>


                                <Text
                                    style={
                                        styles.movie
                                    }
                                >
                                    {
                                        showtime
                                            .movieTitle
                                    }
                                </Text>


                                <Text
                                    style={
                                        styles.info
                                    }
                                >
                                    📅{" "}
                                    {
                                        formatDate(
                                            showtime
                                                .startTime
                                        )
                                    }
                                </Text>


                                <Text
                                    style={
                                        styles.info
                                    }
                                >
                                    🕐{" "}
                                    {
                                        formatTime(
                                            showtime
                                                .startTime
                                        )
                                    }
                                    {" - "}
                                    {
                                        formatTime(
                                            showtime
                                                .endTime
                                        )
                                    }
                                </Text>


                                <Text
                                    style={
                                        styles.info
                                    }
                                >
                                    🎬 Room:{" "}
                                    {
                                        showtime
                                            .roomName
                                    }
                                </Text>


                                <View
                                    style={
                                        styles.bottomRow
                                    }
                                >

                                    <Text
                                        style={
                                            styles.seats
                                        }
                                    >
                                        {
                                            showtime
                                                .availableSeats
                                        }{" "}
                                        seats available
                                    </Text>


                                    <Text
                                        style={
                                            styles.price
                                        }
                                    >
                                        {
                                            showtime
                                                .price
                                                .toLocaleString()
                                        }{" "}
                                        VND
                                    </Text>

                                </View>

                            </Pressable>

                        )
                    )

                )}

            </ScrollView>

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
        fontSize: 25,
        fontWeight: "bold"
    },


    content: {
        padding: 16,
        paddingBottom: 40
    },


    empty: {
        textAlign: "center",
        marginTop: 50,
        fontSize: 16,
        color: "#666"
    },


    card: {
        backgroundColor: "#fff",
        padding: 18,
        borderRadius: 15,
        marginBottom: 15
    },


    cardTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },


    cinema: {
        fontSize: 19,
        fontWeight: "bold",
        flex: 1
    },


    format: {
        backgroundColor: "#E50914",
        color: "#fff",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        fontWeight: "bold"
    },


    movie: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 12,
        marginBottom: 10
    },


    info: {
        fontSize: 15,
        color: "#555",
        marginBottom: 7
    },


    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 12
    },


    seats: {
        color: "#666"
    },


    price: {
        color: "#E50914",
        fontSize: 17,
        fontWeight: "bold"
    }

});