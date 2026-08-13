import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { createBooking, updateBooking } from "../../api/bookingApi";
import { createBookingDetail } from "../../api/bookingDetailApi";

const PAYMENT_METHODS = [
  { id: "cash", name: "Cash" },
  { id: "visa", name: "Visa / MasterCard" },
  { id: "momo", name: "MoMo" },
  { id: "zalo", name: "ZaloPay" }
];

export default function PaymentScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams<{
    showtimeId: string;
    seatIds: string;
    total: string;
    movieTitle: string;
    cinemaName: string;
    roomName: string;
    startTime: string;
    seatNumbers: string;
  }>();

  const [selectedMethod, setSelectedMethod] = useState("cash");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to book tickets.");
      return;
    }

    try {
      setLoading(true);

      const seatIdsArray = params.seatIds.split(",").map(Number);
      const totalAmount = Number(params.total);
      const pricePerSeat = totalAmount / seatIdsArray.length;

      // 1. Create Booking
      const booking = await createBooking({
        userID: user.userID,
        showtimeID: Number(params.showtimeId),
        totalAmount: totalAmount,
        status: "Confirmed",
        qRCode: null
      });

      const bookingId = booking.bookingID;
      if (!bookingId) throw new Error("Booking ID not returned");

      // 2. Create Booking Details
      for (const seatId of seatIdsArray) {
        await createBookingDetail({
          bookingID: bookingId,
          seatID: seatId,
          price: pricePerSeat
        });
      }

      // 3. Update with QR code
      const bookingCode = booking.bookingCode || `BK${bookingId}`;
      const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(bookingCode)}`;

      await updateBooking(bookingId, {
        totalAmount: totalAmount,
        status: "Confirmed",
        qRCode: qrCode
      });

      // 4. Navigate to success
      router.replace({
        pathname: "/booking/success/[bookingId]",
        params: { bookingId: bookingId.toString() }
      });
    } catch (error) {
      console.log("Payment error:", error);
      Alert.alert("Payment Failed", "Something went wrong during payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>Payment</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Booking Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Movie:</Text>
            <Text style={styles.value}>{params.movieTitle}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Cinema:</Text>
            <Text style={styles.value}>{params.cinemaName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Room:</Text>
            <Text style={styles.value}>{params.roomName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Time:</Text>
            <Text style={styles.value}>{new Date(params.startTime).toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Seats:</Text>
            <Text style={styles.value}>{params.seatNumbers}</Text>
          </View>
          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{Number(params.total).toLocaleString()} VND</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.methodsContainer}>
          {PAYMENT_METHODS.map((method) => (
            <Pressable
              key={method.id}
              style={[styles.methodCard, selectedMethod === method.id && styles.selectedMethod]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={[styles.radio, selectedMethod === method.id && styles.radioSelected]} />
              <Text style={[styles.methodText, selectedMethod === method.id && styles.selectedMethodText]}>
                {method.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <Pressable style={styles.payButton} disabled={loading} onPress={handlePayment}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>Pay Now</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  backText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    color: "#666",
    flex: 1,
  },
  value: {
    fontSize: 15,
    fontWeight: "500",
    flex: 2,
    textAlign: "right",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E50914",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  methodsContainer: {
    gap: 12,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedMethod: {
    borderColor: "#E50914",
    backgroundColor: "#fff9f9",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    marginRight: 12,
  },
  radioSelected: {
    borderColor: "#E50914",
    backgroundColor: "#E50914",
  },
  methodText: {
    fontSize: 16,
    fontWeight: "500",
  },
  selectedMethodText: {
    color: "#E50914",
  },
  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  payButton: {
    backgroundColor: "#E50914",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
