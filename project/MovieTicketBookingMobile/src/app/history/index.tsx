import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../api/client";

export default function HistoryScreen() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    if (!user) return;
    try {
      const response = await apiClient.get(`/Bookings/user/${user.userID}`);
      setBookings(response.data);
    } catch (error) {
      console.log("Error loading bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    // Assuming backend returns these fields, fallback if not
    const title = item.movieTitle || `Booking ${item.bookingCode}`;
    const showtime = item.showtimeTime ? new Date(item.showtimeTime).toLocaleString() : "Date N/A";
    
    return (
      <Pressable 
        style={styles.card}
        onPress={() => router.push(`/ticket/${item.bookingID}`)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.movieTitle} numberOfLines={1}>{title}</Text>
          <Text style={[
            styles.status,
            item.status === "Confirmed" ? styles.statusConfirmed : styles.statusPending
          ]}>
            {item.status}
          </Text>
        </View>
        
        <View style={styles.cardBody}>
          <Text style={styles.info}>Time: {showtime}</Text>
          <Text style={styles.info}>Code: {item.bookingCode}</Text>
        </View>
        
        <View style={styles.cardFooter}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>{item.totalAmount?.toLocaleString()} VND</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Booking History</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No bookings found</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.bookingID.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 12,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  status: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  statusConfirmed: {
    backgroundColor: "#e6f4ea",
    color: "#1e8e3e",
  },
  statusPending: {
    backgroundColor: "#fef7e0",
    color: "#f9ab00",
  },
  cardBody: {
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E50914",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});
